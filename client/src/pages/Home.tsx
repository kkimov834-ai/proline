/* Industrial Command design: dark ink surfaces, Forge Copper #D78A4A, Space Grotesk + DM Sans, tray-like workflow columns. */
import { useEffect, useMemo, useRef, useState } from "react";
import { useTouchAutoScroll } from "@/hooks/useTouchAutoScroll.js";
import { trpc } from "@/lib/trpc";
import { canProlineRoleMove, ownProlineColumn, PROLINE_COLUMN_ORDER, PROLINE_ROLE_MAP, visibleProlineColumns } from "@shared/prolineAuth";
import { excelTemplates, type ExcelTemplate, type ExcelTemplateId } from "@shared/excelTemplates";
import { hidePreviewField, movePreviewField, normalizePreviewFields, showPreviewField } from "@shared/excelPreview";
import { autoScrollViewportDelta, clampScrollLeft } from "@shared/mobileBoard";
import { isPendingNoticeForUser } from "@shared/prolineNotifications";
import { formatOperationError } from "@shared/statusAlerts";
import { getProlinePushSubscription, registerProlineServiceWorker, serializeProlinePushSubscription } from "@/lib/prolinePush";
import { toast } from "sonner";
import {
  Archive,
  Bell,
  BellRing,
  ArrowRight,
  Trash2,
  CalendarDays,
  Check,
  Download,
  History,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  Filter,
  MessageCircle,
  Send,
  Clock3,
  GripVertical,
  ImagePlus,
  LogIn,
  LogOut,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
  Zap,
  Volume2,
  VolumeX,
} from "lucide-react";

type Role = "admin" | "production" | "polishing" | "paint" | "warehouse";
type ColumnId = "orders" | "production" | "polishing" | "paint" | "warehouse";
type Priority = "low" | "normal" | "high" | "urgent";
type Order = { id: string; title: string; description: string; image?: string; priority: Priority; createdAt: string; column: ColumnId; stageEnteredAt: string; pendingTo?: ColumnId; rejectedReason?: string; };
type OrderComment = { id: number; orderId: number; authorUserId: number; authorName: string; body: string; createdAt: string | Date };
type Notice = { id: string; orderId: string; from: ColumnId; to: ColumnId; requester: string; createdAt: string; status: "pending" | "accepted" | "rejected"; reason?: string; };
type User = { email: string; role: Role; label: string; column?: ColumnId; userId?: number };
type Staff = { email: string; label: string; online: boolean };
type ThemeId = "copper" | "ocean" | "forest" | "violet" | "crimson" | "teal" | "amber" | "slate" | "rose" | "lime" | "indigo" | "cyan";
type ThemePreset = { id: ThemeId; name: string; description: string; accent: string; accentHover: string; glow: string; surface: string; };


const STORAGE = "proline-orders-v2";
const NOTICE_STORAGE = "proline-notices-v1";
const users: Record<string, User> = Object.fromEntries(Object.entries(PROLINE_ROLE_MAP).map(([email, config]) => [email, { email, role: config.role as Role, label: config.label, column: ("column" in config ? config.column : undefined) as ColumnId | undefined }])) as Record<string, User>;
const roleColumn: Record<Role, ColumnId | undefined> = { admin: undefined, production: "production", polishing: "polishing", paint: "paint", warehouse: "warehouse" };
const columns: { id: ColumnId; label: string; detail: string; icon: typeof ClipboardList; color: string }[] = [
  { id: "orders", label: "Sifarişlər", detail: "Yeni qəbul", icon: ClipboardList, color: "#91A5B7" },
  { id: "production", label: "İstehsalat", detail: "Hazırlanır", icon: Zap, color: "#D78A4A" },
  { id: "polishing", label: "Cilalama", detail: "Səth emalı", icon: Sparkles, color: "#A9B5C3" },
  { id: "paint", label: "Boyalama", detail: "Son örtük", icon: SlidersHorizontal, color: "#9D8DB7" },
  { id: "warehouse", label: "Anbar", detail: "Təhvilə hazır", icon: Archive, color: "#7FA98B" },
];
const seedOrders: Order[] = [];

function showOperationError(error: unknown, fallback: string) {
  toast.error("Xəta", { description: formatOperationError(error, fallback) });
}
const themePresets: ThemePreset[] = [
  { id: "copper", name: "Forge Copper", description: "Klassik sənaye mis palitrası.", accent: "#D78A4A", accentHover: "#E49A5A", glow: "rgba(215,138,74,.16)", surface: "#0B1823" },
  { id: "ocean", name: "Deep Ocean", description: "Soyuq mavi, texniki idarəetmə görünüşü.", accent: "#4FA7C5", accentHover: "#6BC0DC", glow: "rgba(79,167,197,.16)", surface: "#081A27" },
  { id: "forest", name: "Industrial Forest", description: "Sakit yaşıl istehsalat palitrası.", accent: "#69B58A", accentHover: "#86D0A3", glow: "rgba(105,181,138,.16)", surface: "#0B1B1B" },
  { id: "violet", name: "Night Violet", description: "Premium bənövşəyi rəng sxemi.", accent: "#A98BE0", accentHover: "#C0A6F2", glow: "rgba(169,139,224,.16)", surface: "#121127" },
  { id: "crimson", name: "Safety Crimson", description: "Güclü qırmızı təhlükəsizlik aksenti.", accent: "#E06B68", accentHover: "#F08B86", glow: "rgba(224,107,104,.16)", surface: "#211416" },
  { id: "teal", name: "Factory Teal", description: "Balanslı teal və qrafit səthlər.", accent: "#3FB7A8", accentHover: "#61D2C2", glow: "rgba(63,183,168,.16)", surface: "#071D1F" },
  { id: "amber", name: "Signal Amber", description: "Parlaq amber siqnal rəngi.", accent: "#E4B64C", accentHover: "#F2CA69", glow: "rgba(228,182,76,.16)", surface: "#201B0B" },
  { id: "slate", name: "Graphite Slate", description: "Neytral slate, uzun iş sessiyaları üçün.", accent: "#91A7C0", accentHover: "#B1C6DC", glow: "rgba(145,167,192,.16)", surface: "#101A25" },
  { id: "rose", name: "Rose Steel", description: "Yumşaq rose və polad kontrastı.", accent: "#D486A6", accentHover: "#E5A5BF", glow: "rgba(212,134,166,.16)", surface: "#21151D" },
  { id: "lime", name: "Lime Works", description: "Enerjili lime istehsalat aksenti.", accent: "#A8C95B", accentHover: "#C4DF79", glow: "rgba(168,201,91,.16)", surface: "#17200D" },
  { id: "indigo", name: "Indigo Control", description: "Dərin indigo və aydın mavi aksent.", accent: "#7188E8", accentHover: "#94A7FF", glow: "rgba(113,136,232,.16)", surface: "#11152A" },
  { id: "cyan", name: "Cyan Circuit", description: "Rəqəmsal cyan ilə yüksək görünürlük.", accent: "#43C7E8", accentHover: "#74DDF4", glow: "rgba(67,199,232,.16)", surface: "#071B25" },
];

/* Mock data intentionally disabled: PROLINE starts with a clean board. */


function formatDate(iso: string) { return new Intl.DateTimeFormat("az-AZ", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)); }
function todayLabel() { return new Intl.DateTimeFormat("az-AZ", { day: "2-digit", month: "short", year: "numeric" }).format(new Date()); }
function priorityMeta(priority: Priority) { return ({ low: ["Aşağı", "#91A5B7"], normal: ["Normal", "#7FA98B"], high: ["Yüksək", "#D7B45A"], urgent: ["Təcili", "#D77464"] } as const)[priority]; }
function canEdit(user: User | null) { return user?.role === "admin"; }
function canMove(user: User | null, from: ColumnId, to: ColumnId) { return !!user && canProlineRoleMove(user.role, from, to); }

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ColumnId | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [onlineOpen, setOnlineOpen] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [creating, setCreating] = useState(false);
  const [dragged, setDragged] = useState<Order | null>(null);
  const nativeDraggedRef = useRef<Order | null>(null);
  const [dropTarget, setDropTarget] = useState<ColumnId | null>(null);
  const boardRef = useRef<HTMLElement | null>(null);
  const mobileDragRef = useRef<{ order: Order | null; startX: number; startY: number; lastX: number; lastY: number; active: boolean; axis: "pending" | "horizontal" | "vertical" }>({ order: null, startX: 0, startY: 0, lastX: 0, lastY: 0, active: false, axis: "pending" });
  const suppressNextCardClickRef = useRef(false);
  const desktopDragScrollFrame = useRef<number | null>(null);
  const desktopDragX = useRef(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [rejecting, setRejecting] = useState<Notice | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [form, setForm] = useState({ title: "", description: "", priority: "normal" as Priority, image: "" });
  const [staff, setStaff] = useState<Staff[]>([]);
  const lastNoticeCount = useRef(0);
  const lastOrderCount = useRef(0);
  const knownNoticeIds = useRef<Set<string>>(new Set());
  const knownOrderIds = useRef<Set<string>>(new Set());
  const feedHydrated = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);
  const audioUnlockedRef = useRef(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [excelTemplate, setExcelTemplate] = useState<ExcelTemplateId>(() => (window.localStorage.getItem("proline-excel-template") as ExcelTemplateId) || "detailed");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pushSettingsOpen, setPushSettingsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sessionProbeEnabled, setSessionProbeEnabled] = useState(true);
  const [themeId, setThemeId] = useState<ThemeId>(() => (window.localStorage.getItem("proline-theme") as ThemeId) || "copper");
  const [columnLayouts, setColumnLayouts] = useState<Record<string, string[]>>(() => { try { return JSON.parse(window.localStorage.getItem("proline-excel-columns") || "{}"); } catch { return {}; } });
  const activeTheme = themePresets.find((theme) => theme.id === themeId) || themePresets[0];
  const logoutMutation = trpc.auth.logout.useMutation();
  const trpcUtils = trpc.useUtils();
  const heartbeatMutation = trpc.board.heartbeat.useMutation();
  const sessionQuery = trpc.board.session.useQuery(undefined, { enabled: sessionProbeEnabled && !user && !loggingOut, retry: false });
  const loginMutation = trpc.board.login.useMutation();
  const sessionReady = !!user && (sessionQuery.isSuccess || loginMutation.isSuccess);
  const createMutation = trpc.board.create.useMutation();
  const updateMutation = trpc.board.update.useMutation();
  const deleteMutation = trpc.board.delete.useMutation();
  const requestMoveMutation = trpc.board.requestMove.useMutation();
  const respondMutation = trpc.board.respond.useMutation();
  const boardQuery = trpc.board.list.useQuery(undefined, { enabled: sessionReady, refetchInterval: 3000 });
  const soundQuery = trpc.board.notificationPreference.useQuery(undefined, { enabled: sessionReady });
  const soundMutation = trpc.board.setNotificationPreference.useMutation();
  const auditFeedQuery = trpc.board.audit.useQuery(undefined, { enabled: sessionReady, refetchInterval: 5000 });
  const orderAuditQuery = trpc.board.audit.useQuery(selected ? { orderId: Number(selected.id) } : undefined, { enabled: !!selected });
  const exportQuery = trpc.board.export.useQuery(undefined, { enabled: false });
  const commentsQuery = trpc.board.comments.useQuery(selected ? { orderId: Number(selected.id) } : { orderId: 0 }, { enabled: sessionReady && !!selected, refetchInterval: selected ? 5000 : false });
  const addCommentMutation = trpc.board.addComment.useMutation();

  useEffect(() => { if (soundQuery.data !== undefined) setSoundEnabled(soundQuery.data); }, [soundQuery.data]);
  useEffect(() => { window.localStorage.setItem("proline-excel-template", excelTemplate); }, [excelTemplate]);
  useEffect(() => { window.localStorage.setItem("proline-theme", themeId); }, [themeId]);
  useEffect(() => { window.localStorage.setItem("proline-excel-columns", JSON.stringify(columnLayouts)); }, [columnLayouts]);
  useEffect(() => { if (!loggingOut && sessionQuery.data && !user) setUser({ email: sessionQuery.data.email, role: sessionQuery.data.role as Role, label: sessionQuery.data.label, column: sessionQuery.data.column as ColumnId | undefined, userId: sessionQuery.data.userId }); }, [sessionQuery.data, user, loggingOut]);
  function playTone(frequency: number) { if (!audioUnlockedRef.current) return; try { const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext; if (!AudioContextClass) return; const audio = audioRef.current || new AudioContextClass(); audioRef.current = audio; const oscillator = audio.createOscillator(); const gain = audio.createGain(); oscillator.frequency.value = frequency; gain.gain.setValueAtTime(0.0001, audio.currentTime); gain.gain.exponentialRampToValueAtTime(0.12, audio.currentTime + 0.02); gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.28); oscillator.connect(gain); gain.connect(audio.destination); void audio.resume().then(() => oscillator.start()); oscillator.stop(audio.currentTime + 0.3); } catch { /* browser audio unavailable */ } }
  useEffect(() => { const notificationRows = boardQuery.data?.notifications || []; const orderRows = boardQuery.data?.orders || []; const currentCount = notificationRows.length; const orderCount = orderRows.length; const noticeIds = new Set(notificationRows.map((item) => String(item.id))); const orderIds = new Set(orderRows.map((item) => String(item.id))); const newNotices = notificationRows.filter((item) => !knownNoticeIds.current.has(String(item.id))); const newOrders = orderRows.filter((item) => !knownOrderIds.current.has(String(item.id))); if (!feedHydrated.current) { feedHydrated.current = true; } else { if (soundEnabled && currentCount > lastNoticeCount.current) playTone(880); else if (soundEnabled && orderCount > lastOrderCount.current) playTone(660); if (newNotices.length) { const notice = newNotices[0]; toast.info(`Yeni təsdiq sorğusu: ${notice.orderId}`, { description: "Tətbiq açıq olduğu müddətdə bildiriş göstərildi." }); } if (newOrders.length && user) { toast.success(`Yeni sifariş: ${newOrders[0].title}`, { description: "Sifarişlər panelində yeni məlumat var." }); } } knownNoticeIds.current = noticeIds; knownOrderIds.current = orderIds; lastNoticeCount.current = currentCount; lastOrderCount.current = orderCount; }, [boardQuery.data, soundEnabled, user]);
  useEffect(() => { if (!boardQuery.data) return; const mappedOrders: Order[] = boardQuery.data.orders.map((item) => ({ id: String(item.id), title: item.title, description: item.description || "", image: item.imageUrl || undefined, priority: item.priority, createdAt: item.createdAt.toISOString(), column: item.columnId, stageEnteredAt: item.stageEnteredAt.toISOString(), pendingTo: item.pendingTo || undefined, rejectedReason: item.rejectedReason || undefined })); setOrders(mappedOrders); const mappedNotices: Notice[] = boardQuery.data.notifications.map((item) => ({ id: String(item.id), orderId: String(item.orderId), from: item.fromColumn, to: item.toColumn, requester: String(item.requesterUserId), createdAt: item.createdAt.toISOString(), status: item.status, reason: item.reason || undefined })); setNotices(mappedNotices); setStaff(boardQuery.data.staff || []); }, [boardQuery.data]);
  const visibleColumns = useMemo(() => visibleProlineColumns(user?.role || "admin") as ColumnId[], [user?.role]);
  const visibleOrders = useMemo(() => orders.filter((o) => { const matchesText = `${o.title} ${o.id} ${o.description}`.toLowerCase().includes(query.toLowerCase()); const matchesStatus = statusFilter === "all" || o.column === statusFilter; const created = new Date(o.createdAt); const matchesFrom = !dateFrom || created >= new Date(`${dateFrom}T00:00:00`); const matchesTo = !dateTo || created <= new Date(`${dateTo}T23:59:59`); const ownColumn = user?.role === "admin" ? undefined : ownProlineColumn(user?.role || "admin"); return (user?.role === "admin" ? true : o.column === ownColumn) && matchesText && matchesStatus && matchesFrom && matchesTo; }), [orders, query, statusFilter, dateFrom, dateTo, visibleColumns, user?.role]);
  const total = orders.length;
  const completed = orders.filter((o) => o.column === "warehouse").length;
  const pendingForUser = notices.filter((n) => isPendingNoticeForUser(n, user?.role || "admin", user?.userId || 0));
  const touchAutoScroll = useTouchAutoScroll(boardRef, { edge: 60, step: 12 });

  useEffect(() => { if (!user) return; const id = window.setInterval(() => { heartbeatMutation.mutate(); }, 15000); return () => window.clearInterval(id); }, [user]);
  function stopMobileAutoScroll() {
    touchAutoScroll.stop();
  }
  function stopDesktopDragScroll() {
    if (desktopDragScrollFrame.current !== null) window.clearInterval(desktopDragScrollFrame.current);
    desktopDragScrollFrame.current = null;
  }
  function handleNativeDragStart(order: Order, event: React.DragEvent<HTMLElement>) {
    nativeDraggedRef.current = order;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", order.id);
    setDragged(order);
  }
  function handleNativeDragEnd() {
    nativeDraggedRef.current = null;
    stopDesktopDragScroll();
    setDragged(null);
    setDropTarget(null);
  }
  function handleDesktopDragOver(event: React.DragEvent<HTMLElement>) {
    if (!nativeDraggedRef.current || !boardRef.current) return;
    event.preventDefault();
    desktopDragX.current = event.clientX;
    if (desktopDragScrollFrame.current !== null) return;
    desktopDragScrollFrame.current = window.setInterval(() => {
      const board = boardRef.current;
      if (!board || !nativeDraggedRef.current) return stopDesktopDragScroll();
      const direction = desktopDragX.current >= window.innerWidth - 50 ? 1 : desktopDragX.current <= 50 ? -1 : 0;
      if (direction) board.scrollLeft = clampScrollLeft(board.scrollLeft + direction * 10, board.scrollWidth, board.clientWidth);
    }, 16);
  }
  function startMobileDrag(order: Order, event: React.TouchEvent) {
    const touch = event.touches[0];
    if (!touch) return;
    event.stopPropagation();
    suppressNextCardClickRef.current = false;
    stopMobileAutoScroll();
    mobileDragRef.current = { order, startX: touch.clientX, startY: touch.clientY, lastX: touch.clientX, lastY: touch.clientY, active: false, axis: "pending" };
    setDragged(null);
    setDropTarget(null);
  }
  function startPointerDrag(order: Order, event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.stopPropagation();
    suppressNextCardClickRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    stopMobileAutoScroll();
    mobileDragRef.current = { order, startX: event.clientX, startY: event.clientY, lastX: event.clientX, lastY: event.clientY, active: false, axis: "pending" };
    setDragged(null);
    setDropTarget(null);
  }
  function handlePointerDragMove(event: React.PointerEvent<HTMLElement>) {
    const board = boardRef.current;
    const pendingDrag = mobileDragRef.current;
    if ((event.pointerType === "mouse" && event.buttons === 0) || !board || !pendingDrag.order || pendingDrag.axis === "vertical") return;
    pendingDrag.lastX = event.clientX;
    pendingDrag.lastY = event.clientY;
    if (!pendingDrag.active) {
      const deltaX = event.clientX - pendingDrag.startX;
      const deltaY = event.clientY - pendingDrag.startY;
      if (Math.hypot(deltaX, deltaY) < 8) return;
      if (Math.abs(deltaY) > Math.abs(deltaX) * 1.15) { pendingDrag.axis = "vertical"; return; }
      pendingDrag.active = true;
      pendingDrag.axis = "horizontal";
      pendingDrag.startX = event.clientX;
      suppressNextCardClickRef.current = true;
      setDragged(pendingDrag.order);
    }
    event.preventDefault();
    const followDelta = pendingDrag.startX - event.clientX;
    if (followDelta) board.scrollLeft = clampScrollLeft(board.scrollLeft + followDelta, board.scrollWidth, board.clientWidth);
    pendingDrag.startX = event.clientX;
    touchAutoScroll.onTouchMove({ touches: [{ clientX: pendingDrag.lastX }] });
    const viewportDelta = autoScrollViewportDelta(event.clientY, 0, window.innerHeight, 96, 26);
    if (viewportDelta) window.scrollBy({ top: viewportDelta, behavior: "auto" });
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-proline-column]");
    setDropTarget((target?.dataset.prolineColumn as ColumnId | undefined) || null);
  }
  function finishPointerDrag(event: React.PointerEvent<HTMLElement>) {
    const pendingDrag = mobileDragRef.current;
    if (!pendingDrag.active || !pendingDrag.order) { cancelMobileDrag(); return; }
    event.preventDefault();
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-proline-column]");
    const targetColumn = target?.dataset.prolineColumn as ColumnId | undefined;
    if (targetColumn) moveOrder(pendingDrag.order, targetColumn);
    cancelMobileDrag();
  }
  function handleMobileDragMove(event: React.TouchEvent) {
    const touch = event.touches[0];
    const board = boardRef.current;
    const pendingDrag = mobileDragRef.current;
    if (!touch || !board || !pendingDrag.order || pendingDrag.axis === "vertical") return;
    pendingDrag.lastX = touch.clientX;
    pendingDrag.lastY = touch.clientY;
    if (!pendingDrag.active) {
      const deltaX = touch.clientX - pendingDrag.startX;
      const deltaY = touch.clientY - pendingDrag.startY;
      const distance = Math.hypot(deltaX, deltaY);
      if (distance < 8) return;
      if (Math.abs(deltaY) > Math.abs(deltaX) * 1.15) { pendingDrag.axis = "vertical"; return; }
      pendingDrag.active = true;
      pendingDrag.axis = "horizontal";
      pendingDrag.startX = touch.clientX;
      suppressNextCardClickRef.current = true;
      setDragged(pendingDrag.order);
    }
    event.preventDefault();
    const followDelta = pendingDrag.startX - touch.clientX;
    if (followDelta) board.scrollLeft = clampScrollLeft(board.scrollLeft + followDelta, board.scrollWidth, board.clientWidth);
    pendingDrag.startX = touch.clientX;
    touchAutoScroll.onTouchMove({ touches: [{ clientX: pendingDrag.lastX }] });
    const viewportDelta = autoScrollViewportDelta(touch.clientY, 0, window.innerHeight, 96, 26);
    if (viewportDelta) window.scrollBy({ top: viewportDelta, behavior: "auto" });
    const target = document.elementFromPoint(touch.clientX, touch.clientY)?.closest<HTMLElement>("[data-proline-column]");
    setDropTarget((target?.dataset.prolineColumn as ColumnId | undefined) || null);
  }
  function getTouchDropColumn(clientX: number, clientY: number) {
    const direct = document.elementFromPoint(clientX, clientY)?.closest<HTMLElement>("[data-proline-column]");
    if (direct?.dataset.prolineColumn) return direct.dataset.prolineColumn as ColumnId;
    const board = boardRef.current;
    if (!board) return undefined;
    const column = Array.from(board.querySelectorAll<HTMLElement>("[data-proline-column]")).find((item) => {
      const rect = item.getBoundingClientRect();
      return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    });
    return column?.dataset.prolineColumn as ColumnId | undefined;
  }
  function cancelMobileDrag() {
    stopMobileAutoScroll();
    mobileDragRef.current = { order: null, startX: 0, startY: 0, lastX: 0, lastY: 0, active: false, axis: "pending" };
    setDragged(null);
    setDropTarget(null);
  }
  function finishMobileDrag(event: React.TouchEvent) {
    const pendingDrag = mobileDragRef.current;
    const touch = event.changedTouches[0];
    if (!pendingDrag.active || !pendingDrag.order) {
      stopMobileAutoScroll();
      mobileDragRef.current = { order: null, startX: 0, startY: 0, lastX: 0, lastY: 0, active: false, axis: "pending" };
      return;
    }
    event.preventDefault();
    const targetColumn = touch ? getTouchDropColumn(touch.clientX, touch.clientY) : undefined;
    if (targetColumn) void moveOrder(pendingDrag.order, targetColumn);
    stopMobileAutoScroll();
    mobileDragRef.current = { order: null, startX: 0, startY: 0, lastX: 0, lastY: 0, active: false, axis: "pending" };
    setDragged(null);
    setDropTarget(null);
  }
  async function logout() { if (loggingOut) return; setSessionProbeEnabled(false); try { sessionStorage.removeItem("proline_session_token"); } catch { /* storage unavailable */ } setLoggingOut(true); setUser(null); setOrders([]); setNotices([]); setStaff([]); setSelected(null); setCreating(false); setSettingsOpen(false); setPushSettingsOpen(false); setCommentBody(""); try { await logoutMutation.mutateAsync(); await Promise.all([trpcUtils.board.session.reset(), trpcUtils.board.list.reset(), trpcUtils.board.audit.reset(), trpcUtils.board.export.reset(), trpcUtils.board.notificationPreference.reset(), trpcUtils.board.comments.reset()]); setLoggingOut(false); } catch (error) { showOperationError(error, "Çıxış tamamlanmadı. Yenidən cəhd edin."); } }
  async function toggleSound() { const next = !soundEnabled; try { await soundMutation.mutateAsync({ enabled: next }); setSoundEnabled(next); toast.success(next ? "Bildiriş səsi aktivdir" : "Bildiriş səsi söndürülüb"); } catch (error) { showOperationError(error, "Bildiriş səsi ayarı yadda saxlanmadı."); } }
  function downloadFile(content: string, name: string, type: string) { const blob = new Blob([content], { type }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.rel = "noopener"; document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); }
  async function downloadExport(format: "csv" | "xls", requestedFields?: string[]) {
    try {
      const result = await exportQuery.refetch();
      const rows = result.data || [];
      const template = excelTemplates.find((item) => item.id === excelTemplate) || excelTemplates[0];
      const fields = requestedFields?.length ? requestedFields : template.fields;
      const columnLabel = (value: unknown) => columns.find((column) => column.id === value)?.label || "—";
      const priorityLabel = (value: unknown) => ({ low: "Aşağı", normal: "Normal", high: "Yüksək", urgent: "Təcili" } as Record<string, string>)[String(value)] || "—";
      const statusLabel = (row: Record<string, unknown>) => row.rejectedReason ? "İmtina edilib" : row.pendingTo ? "Təsdiq gözləyir" : "YOXDUR";
      const dateLabel = (value: unknown) => value ? formatDate(new Date(String(value)).toISOString()) : "—";
      const valueFor = (row: Record<string, unknown>, field: string): string => ({
        "Sifariş kodu": String(row.publicId || "—"),
        "Sifariş adı": String(row.title || "—"),
        "Ətraflı açıqlama": String(row.description || "Açıqlama yoxdur"),
        "Prioritet": priorityLabel(row.priority),
        "Cari mərhələ": columnLabel(row.columnId),
        "Gözlənilən keçid": columnLabel(row.pendingTo),
        "Növbəti mərhələ": columnLabel(row.pendingTo),
        "İmtina səbəbi": String(row.rejectedReason || "—"),
        "Yaradılma tarixi": dateLabel(row.createdAt),
        "Son yenilənmə": dateLabel(row.updatedAt),
        "Mərhələyə giriş tarixi": dateLabel(row.stageEnteredAt),
        "Təsdiq statusu": statusLabel(row),
        "Status": statusLabel(row),
      }[field] || "—");
      const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
      const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
      const matrix: string[][] = rows.map((row) => fields.map((field) => valueFor(row as Record<string, unknown>, field)));
      if (format === "csv") downloadFile([fields.map(escape).join(","), ...matrix.map((line) => line.map(escape).join(","))].join("\\n"), `proline-${excelTemplate}-${Date.now()}.csv`, "text/csv;charset=utf-8");
      else {
        const title = `PROLINE — ${template.name}`;
        const table = `<table><caption>${escapeHtml(title)}</caption><thead><tr>${fields.map((field) => `<th>${escapeHtml(field)}</th>`).join("")}</tr></thead><tbody>${matrix.map((line: string[]) => `<tr>${line.map((value: string) => `<td>${escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
        downloadFile(`<html><head><meta charset="utf-8"><style>body{font-family:Arial;color:#17212b}caption{font-size:18px;font-weight:700;text-align:left;padding:12px 0}table{border-collapse:collapse;width:100%}th{background:#173247;color:#fff;font-weight:700}th,td{border:1px solid #b8c5cf;padding:8px;text-align:left;vertical-align:top}tr:nth-child(even){background:#eef3f6}</style></head><body>${table}</body></html>`, `proline-${excelTemplate}-${Date.now()}.xls`, "application/vnd.ms-excel;charset=utf-8");
      }
      toast.success(`${rows.length} sifariş “${template.name}” şablonu ilə export edildi`);
    } catch (error) { showOperationError(error, "Excel faylı hazırlana bilmədi."); }
  }
  async function login(e: React.FormEvent) { e.preventDefault(); const normalizedEmail = email.trim().toLowerCase(); const normalizedCode = code.replace(/\D/g, "").slice(0, 6); try { const result = await loginMutation.mutateAsync({ email: normalizedEmail, code: normalizedCode }); setSessionProbeEnabled(true); setLoggingOut(false); setUser({ email: result.email, role: result.role as Role, label: result.label, column: result.column as ColumnId | undefined, userId: result.userId }); try { if (result.token) sessionStorage.setItem("proline_session_token", result.token); } catch { /* storage unavailable */ } try { const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext; if (AudioContextClass) { audioRef.current = audioRef.current || new AudioContextClass(); await audioRef.current.resume(); audioUnlockedRef.current = true; } } catch { /* audio permission unavailable */ } setLoginError(""); toast.success(`${result.label} kimi daxil oldunuz`); } catch { setLoginError("Email və ya giriş kodu yanlışdır."); } }
  function openCreate() { if (!canEdit(user)) return toast.error("Yalnız Dispatcher sifariş yarada bilər."); setForm({ title: "", description: "", priority: "normal", image: "" }); setSelected(null); setCreating(true); }
  function openEdit(order: Order) { if (!canEdit(user)) return toast.error("Bu əməliyyat üçün Dispatcher rolu tələb olunur."); setForm({ title: order.title, description: order.description, priority: order.priority, image: order.image || "" }); setSelected(order); setCreating(true); }
  async function saveOrder(e: React.FormEvent) { e.preventDefault(); if (!form.title.trim()) return toast.error("Sifariş adı daxil edin."); try { if (selected) { await updateMutation.mutateAsync({ orderId: Number(selected.id), title: form.title.trim(), description: form.description.trim(), imageUrl: form.image, priority: form.priority }); await boardQuery.refetch(); toast.success("Sifariş yeniləndi"); } else { await createMutation.mutateAsync({ title: form.title.trim(), description: form.description.trim(), imageUrl: form.image, priority: form.priority }); await boardQuery.refetch(); toast.success("Sifariş Sifarişlər sütununa əlavə edildi"); } setCreating(false); } catch (error) { showOperationError(error, "Sifariş yadda saxlanmadı. Server bağlantısını yoxlayın."); } }
  async function moveOrder(order: Order, to: ColumnId) { if (to === order.column) return; if (!canMove(user, order.column, to)) { toast.error("Bu mərhələyə keçid üçün icazəniz yoxdur."); return; } try { await requestMoveMutation.mutateAsync({ orderId: Number(order.id), toColumn: to }); await boardQuery.refetch(); toast.success(`${columns.find((c) => c.id === to)?.label} rəhbərinə təsdiq göndərildi`); } catch (error) { showOperationError(error, "Sifariş keçidi serverdə yadda saxlanmadı."); } }
  async function respondNotice(notice: Notice, accepted: boolean, reason = "") { try { await respondMutation.mutateAsync({ notificationId: Number(notice.id), accepted, reason }); await boardQuery.refetch(); if (accepted) toast.success(`${notice.orderId} qəbul olundu və ${columns.find((c) => c.id === notice.to)?.label} sütununa keçdi`); else toast.error(`${notice.orderId} imtina edildi`); } catch (error) { showOperationError(error, "Bildiriş cavabı serverdə yadda saxlanmadı."); } setRejecting(null); setRejectReason(""); }
  async function submitComment(e: React.FormEvent) { e.preventDefault(); if (!selected || !commentBody.trim()) return; try { await addCommentMutation.mutateAsync({ orderId: Number(selected.id), body: commentBody.trim() }); setCommentBody(""); await commentsQuery.refetch(); await auditFeedQuery.refetch(); toast.success("Şərh əlavə edildi"); } catch (error) { showOperationError(error, "Şərh əlavə olunmadı. Yenidən cəhd edin."); } }


  if (!user && sessionQuery.isLoading && !loggingOut) return <div className="min-h-screen bg-[#08121B] text-[#E9EEF2] flex items-center justify-center"><div className="text-xs uppercase tracking-[.18em] text-[#D78A4A] proline-theme-accent">Sessiya bərpa olunur...</div></div>;
  if (!user) return <LoginScreen email={email} code={code} setEmail={setEmail} setCode={setCode} error={loginError} onSubmit={login} />;
  return <div className="min-h-screen bg-[#08121B] text-[#E9EEF2]" style={{ backgroundColor: activeTheme.surface, backgroundImage: `linear-gradient(rgba(8,18,27,.94), rgba(8,18,27,.97)), radial-gradient(circle at 85% 0%, ${activeTheme.glow}, transparent 34%), url('/manus-storage/proline-grid_53b97e55.png')`, backgroundSize: "cover", backgroundAttachment: "fixed", "--proline-accent": activeTheme.accent, "--proline-accent-hover": activeTheme.accentHover, "--proline-glow": activeTheme.glow, "--proline-surface": activeTheme.surface } as React.CSSProperties}>
    <header className="min-h-[76px] border-b border-white/[.08] bg-[#0B1823]/90 backdrop-blur-xl flex items-center justify-between gap-3 px-3 sm:px-5 lg:px-9 py-3 sticky top-0 z-30">
      <div className="flex items-center gap-3"><img src="/manus-storage/proline-logo_8e1fe1d1.png" className="h-10 w-10 object-contain" alt="PROLINE" /><div><div className="font-display text-[17px] font-bold tracking-[.16em] leading-none">PROLINE</div><div className="text-[10px] uppercase tracking-[.2em] text-[#8292A0] mt-1">Production control</div></div></div>
      <div className="hidden md:flex items-center gap-5 text-xs text-[#8292A0]"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#7FA98B] shadow-[0_0_10px_#7FA98B]" /> Sistem aktivdir</span><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#7FA98B]" /> {user.label} onlayn</span><span className="h-5 w-px bg-white/10" /><span>{todayLabel()}</span></div>
      <div className="flex items-center gap-2"><button onClick={() => setSettingsOpen(true)} className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2.5 text-[#B8C4CB] hover:bg-white/5 transition" title="Settings"><Settings size={17} /></button><button onClick={() => setPushSettingsOpen(true)} className="inline-flex items-center justify-center rounded-lg border border-white/10 p-2.5 text-[#B8C4CB] hover:bg-white/5 transition" title="Bağlı cihaz bildirişləri"><Bell size={17} /></button><button onClick={() => void toggleSound()} className={`inline-flex items-center justify-center rounded-lg border p-2.5 transition ${soundEnabled ? "border-[#7FA98B]/30 bg-[#7FA98B]/10 text-[#A8D2B0]" : "border-white/10 bg-white/[.03] text-[#8292A0]"}`} title={`Bildiriş səsi: ${soundEnabled ? "Aktiv" : "Deaktiv"}`}>{soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button><div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/[.035] pl-2 pr-3 py-1.5"><div className="h-7 w-7 rounded-full bg-[#D78A4A] proline-theme-button text-[#1C1712] flex items-center justify-center text-xs font-bold">{user.email[0].toUpperCase()}</div><div className="leading-tight"><div className="text-xs font-semibold text-[#DDE5EA]">{user.label}</div><div className="text-[10px] text-[#8292A0]">{user.email}</div></div></div><button onClick={logout} className="p-2 rounded-lg text-[#8292A0] hover:bg-white/10 hover:text-white transition" title="Çıxış"><LogOut size={17} /></button></div>
    </header>
    <main className="proline-main px-3 sm:px-5 lg:px-9 py-5 sm:py-8 max-w-[1600px] mx-auto"><div className="mb-4 flex justify-end"><div className="w-full sm:w-auto"><button type="button" aria-expanded={onlineOpen} onClick={() => setOnlineOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/[.1] bg-[#0C1925]/90 px-3 py-2.5 text-left text-xs text-[#DDE5EA] sm:hidden"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#7FA98B] shadow-[0_0_8px_#7FA98B]" />Online işçilər <span className="text-[#AAB9C4]">({staff.filter((worker) => worker.online || worker.email === user.email).length})</span></span><ChevronDown size={15} className={`transition-transform ${onlineOpen ? "rotate-180" : ""}`} /></button><div className={`${onlineOpen ? "block" : "hidden"} mt-2 sm:hidden`}><StaffStatus current={user} staff={staff} /></div><div className="hidden sm:block"><StaffStatus current={user} staff={staff} /></div></div></div><NoticeTray notices={pendingForUser} orders={orders} user={user} onAccept={(n) => respondNotice(n, true)} onReject={(n) => { setRejecting(n); setRejectReason(""); }} />
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8"><div><div className="flex items-center gap-2 text-[#D78A4A] proline-theme-accent text-[11px] font-bold tracking-[.2em] uppercase mb-3"><span className="h-px w-7 bg-[#D78A4A] proline-theme-button" /> Əməliyyat mərkəzi</div><h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-.045em] text-white">Axını nəzarətdə saxla.</h1><p className="text-[#8D9DAA] mt-3 max-w-xl text-sm leading-6">Sifarişləri mərhələlər arasında dəqiq hərəkət etdir, komandanın növbəti addımını bir baxışda gör.</p></div><div className="flex items-center gap-3">{user.role === "admin" && <button onClick={openCreate} className="inline-flex items-center gap-2 bg-[#D78A4A] proline-theme-button hover:bg-[#E49A5A] text-[#1B1713] rounded-lg px-4 py-2.5 text-sm font-bold transition active:scale-[.97] shadow-[0_8px_24px_rgba(215,138,74,.18)]"><Plus size={17} /> Sifariş yarat</button>}</div></section>
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"><Metric label="Aktiv sifarişlər" value={total} detail="bütün xətt üzrə" icon={ClipboardList} /><Metric label="Tamamlanan" value={completed} detail={`${total ? Math.round((completed / total) * 100) : 0}% anbar mərhələsi`} icon={PackageCheck} accent="#7FA98B" /><Metric label="Təcili işlər" value={orders.filter((o) => o.priority === "urgent").length} detail="prioritet nəzarəti" icon={Zap} accent="#D77464" /><Metric label="Bu gün" value={orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString()).length} detail="yeni daxil olanlar" icon={CalendarDays} accent="#91A5B7" /></section>
      {(auditFeedQuery.data?.length || 0) > 0 && <section className="proline-audit mb-6 rounded-xl border border-white/[.09] bg-[#0C1925]/90 p-4"><div className="flex items-center gap-2 mb-3"><History size={15} className="text-[#D78A4A] proline-theme-accent" /><div className="font-display font-bold text-sm">Son fəaliyyətlər</div><span className="text-[10px] uppercase tracking-[.14em] text-[#6F818E]">audit log</span></div><div className="grid md:grid-cols-2 xl:grid-cols-4 gap-2">{(auditFeedQuery.data || []).slice(0, 8).map((log) => <div key={`${log.id}-${log.createdAt.toISOString()}`} className="rounded-lg bg-white/[.035] px-3 py-2"><div className="text-[10px] font-semibold text-[#C0CBD2]">{log.details || log.action}</div><div className="text-[10px] text-[#718391] mt-1">{log.orderId ? `Sifariş #${log.orderId}` : "Sistem"} · {formatDate(log.createdAt.toISOString())}</div></div>)}</div></section>}
      <div className="mb-4 rounded-xl border border-white/[.09] bg-[#0C1925]/90 p-3 sm:p-4"><div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center justify-between gap-3"><div><div className="font-display font-bold text-lg">İstehsalat xətti <span className="text-[#7D8E9C] font-normal text-sm ml-2">/ {visibleOrders.length}/{total} sifariş</span></div><div className="text-[10px] uppercase tracking-[.12em] text-[#687A86] mt-1">Tarix, status və mətn üzrə axtarış · Kartı basılı saxlayıb növbəti sütuna sürüşdürün</div></div><button onClick={() => setFiltersOpen((value) => !value)} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-[#B8C4CB] hover:bg-white/5 lg:hidden"><Filter size={14} /> Filtrlər</button></div><div className="relative w-full lg:w-72"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718391]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Sifariş, kod və ya açıqlama..." className="w-full bg-[#0E1B27] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs outline-none focus:border-[#D78A4A] proline-theme-border placeholder:text-[#667785] transition" /></div></div><div className={`${filtersOpen ? "grid" : "hidden lg:grid"} grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/[.08]`}><label className="text-[10px] uppercase tracking-[.12em] text-[#7C8C98]">Status<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ColumnId | "all")} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#07121B] px-3 py-2.5 text-xs text-[#D9E2E8] outline-none focus:border-[#D78A4A] proline-theme-border"><option value="all">Bütün sütunlar</option>{visibleColumns.map((columnId) => { const column = columns.find((item) => item.id === columnId)!; return <option key={column.id} value={column.id}>{column.label}</option>; })}</select></label><label className="text-[10px] uppercase tracking-[.12em] text-[#7C8C98]">Başlanğıc tarixi<input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#07121B] px-3 py-2.5 text-xs text-[#D9E2E8] outline-none focus:border-[#D78A4A] proline-theme-border" /></label><label className="text-[10px] uppercase tracking-[.12em] text-[#7C8C98]">Son tarix<input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#07121B] px-3 py-2.5 text-xs text-[#D9E2E8] outline-none focus:border-[#D78A4A] proline-theme-border" /></label></div>{(query || statusFilter !== "all" || dateFrom || dateTo) && <button onClick={() => { setQuery(""); setStatusFilter("all"); setDateFrom(""); setDateTo(""); }} className="mt-3 text-[10px] font-bold uppercase tracking-[.12em] text-[#D78A4A] proline-theme-accent hover:text-[#E49A5A]">Filtrləri təmizlə</button>}</div>
      <section ref={boardRef} onDragOver={handleDesktopDragOver} onPointerMove={handlePointerDragMove} onPointerUp={finishPointerDrag} onPointerCancel={cancelMobileDrag} onTouchMove={handleMobileDragMove} onTouchEnd={finishMobileDrag} onTouchCancel={cancelMobileDrag} style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch", scrollSnapType: "x proximity" }} className="proline-board flex gap-4 pb-5 overflow-x-auto overscroll-x-contain scroll-smooth snap-x">{visibleColumns.map((columnId) => { const column = columns.find((item) => item.id === columnId)!; const list = visibleOrders.filter((o) => o.column === column.id); const Icon = column.icon; return <div key={column.id} data-proline-column={column.id} onDragOver={(e) => { e.preventDefault(); setDropTarget(column.id); }} onDragLeave={() => setDropTarget(null)} onDrop={(e) => { e.preventDefault(); const order = nativeDraggedRef.current; if (order) void moveOrder(order, column.id); handleNativeDragEnd(); }} className={`min-w-[280px] w-[min(100%,360px)] flex-none snap-start rounded-xl border xl:min-w-[278px] xl:w-auto xl:flex-1 bg-[#0C1925]/90 overflow-hidden transition-all duration-200 ${dropTarget === column.id ? "border-[#D78A4A] proline-theme-border shadow-[0_0_0_3px_rgba(215,138,74,.13)] -translate-y-1" : "border-white/[.09]"}`}><div className="px-4 py-4 border-b border-white/[.08]" style={{ borderTop: `2px solid ${column.color}` }}><div className="flex items-center justify-between"><div className="flex items-center gap-2.5"><span className="h-8 w-8 rounded-lg bg-white/[.055] flex items-center justify-center" style={{ color: column.color }}><Icon size={16} /></span><div><div className="font-display font-bold text-sm">{column.label}</div><div className="text-[10px] uppercase tracking-[.12em] text-[#70818E] mt-0.5">{column.detail}</div></div></div><span className="font-display text-xs font-bold text-[#A8B6C0] bg-white/[.06] rounded-md px-2 py-1">{list.length}</span></div></div><div className="p-3 min-h-[260px] space-y-3">{list.map((order) => <OrderCard key={order.id} order={order} canDrag={columns.some((target) => canMove(user, order.column, target.id))} onClick={() => { if (suppressNextCardClickRef.current) { suppressNextCardClickRef.current = false; return; } setSelected(order); }} onDragStart={(event) => handleNativeDragStart(order, event)} onDragEnd={handleNativeDragEnd} onPointerDown={(event) => startPointerDrag(order, event)} onPointerMove={handlePointerDragMove} onPointerUp={finishPointerDrag} onPointerCancel={() => { stopDesktopDragScroll(); cancelMobileDrag(); }} onTouchStart={(event) => startMobileDrag(order, event)} onTouchMove={handleMobileDragMove} onTouchEnd={finishMobileDrag} onTouchCancel={cancelMobileDrag} />)}{list.length === 0 && <div className="h-[220px] rounded-lg border border-dashed border-white/10 flex flex-col items-center justify-center text-center px-4"><div className="h-10 w-10 rounded-full bg-white/[.035] flex items-center justify-center mb-3"><ArrowRight size={16} className="text-[#536571]" /></div><div className="text-xs text-[#647582]">Sifarişi bura<br />sürüklə</div></div>}</div></div> })}</section>
      <footer className="flex items-center justify-between border-t border-white/[.08] mt-3 pt-5 text-[11px] text-[#637480]"><span>PROLINE · İstehsalat əməliyyat sistemi</span><span className="flex items-center gap-2"><ShieldCheck size={13} /> Rol əsaslı giriş aktivdir</span></footer>
    </main>
    {selected && !creating && <OrderModal order={selected} user={user} auditLogs={orderAuditQuery.data || []} comments={commentsQuery.data || []} commentBody={commentBody} setCommentBody={setCommentBody} onSubmitComment={submitComment} onClose={() => { setSelected(null); setCommentBody(""); }} onEdit={() => openEdit(selected)} onDelete={user?.role === "admin" ? async () => { if (!window.confirm("Bu sifariş və onun tarixçəsi silinsin?")) return; try { await deleteMutation.mutateAsync({ orderId: Number(selected.id) }); setSelected(null); await boardQuery.refetch(); toast.success("Sifariş silindi."); } catch (error) { showOperationError(error, "Sifariş silinə bilmədi."); } } : undefined} />}
    {creating && <OrderForm selected={selected} form={form} setForm={setForm} onClose={() => setCreating(false)} onSubmit={saveOrder} />}
    {rejecting && <RejectModal notice={rejecting} reason={rejectReason} setReason={setRejectReason} onClose={() => setRejecting(null)} onSubmit={() => respondNotice(rejecting, false, rejectReason)} />}
    {settingsOpen && <SettingsPanel canExport={user.role === "admin"} templateId={excelTemplate} setTemplateId={setExcelTemplate} themeId={themeId} setThemeId={setThemeId} columnLayouts={columnLayouts} setColumnLayouts={setColumnLayouts} onExport={(format, fields) => { setSettingsOpen(false); void downloadExport(format, fields); }} onClose={() => setSettingsOpen(false)} />}
    {pushSettingsOpen && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#02070B]/75 p-3 backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setPushSettingsOpen(false)}><div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0D1C29] proline-theme-surface shadow-2xl"><div className="flex items-start justify-between gap-4 border-b border-white/[.08] px-4 py-4 sm:px-6"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] proline-theme-accent"><BellRing size={13} /> Cihaz bildirişləri</div><h2 className="mt-2 font-display text-xl font-bold">Fon bildirişləri</h2><p className="mt-2 max-w-md text-xs leading-5 text-[#B7C3CB]">Hər telefon və noutbukda bir dəfə aktivləşdirin. Tətbiq bağlı olduqda da sifariş və təsdiq xəbərdarlıqları gələcək.</p></div><button onClick={() => setPushSettingsOpen(false)} aria-label="Bildiriş ayarlarını bağla" className="rounded-lg p-2 text-[#B7C3CB] hover:bg-white/10"><X size={18} /></button></div><div className="p-4 sm:p-6"><PushControl /></div></div></div>}
  </div>;
}

function LoginScreen({ email, code, setEmail, setCode, error, onSubmit }: { email: string; code: string; setEmail: (v: string) => void; setCode: (v: string) => void; error: string; onSubmit: (e: React.FormEvent) => void }) { return <div className="min-h-screen bg-[#08121B] text-[#E9EEF2] flex items-center justify-center px-5 relative overflow-hidden" style={{ backgroundImage: "linear-gradient(rgba(8,18,27,.86), rgba(8,18,27,.96)), url('/manus-storage/proline-grid_53b97e55.png')", backgroundSize: "cover" }}><div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[#D78A4A] bg-[#D78A4A]/10 blur-3xl" /><div className="w-full max-w-[980px] grid lg:grid-cols-[1.1fr_.9fr] border border-white/10 rounded-2xl overflow-hidden bg-[#0B1823]/85 backdrop-blur-xl shadow-2xl relative"><div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/[.08] min-h-[570px]" style={{ backgroundImage: "linear-gradient(130deg, rgba(10,25,36,.45), rgba(10,25,36,.92)), url('/manus-storage/proline-empty-state_07d8bf97.png')", backgroundSize: "cover", backgroundPosition: "center" }}><div><div className="flex items-center gap-3"><img src="/manus-storage/proline-logo_8e1fe1d1.png" className="h-11 w-11" alt="PROLINE" /><span className="font-display text-lg font-bold tracking-[.16em]">PROLINE</span></div><div className="mt-24 max-w-sm"><div className="text-[#D78A4A] proline-theme-accent text-[11px] font-bold uppercase tracking-[.2em] mb-4">Production control</div><h1 className="font-display text-5xl font-bold leading-[1.02] tracking-[-.05em]">İstehsalatın<br /><span className="text-[#D78A4A] proline-theme-accent">növbəti xətti.</span></h1><p className="mt-5 text-[#A6B3BC] text-sm leading-6">Sifarişdən anbara qədər hər addımı bir səthdə görünən, ciddi və çevik idarəetmə mühiti.</p></div></div><div className="flex items-center gap-2 text-xs text-[#8292A0]"><span className="h-2 w-2 rounded-full bg-[#7FA98B]" /> Təhlükəsiz iş sahəsi · 5 mərhələ</div></div><div className="p-8 sm:p-12 bg-[linear-gradient(140deg,rgba(18,34,48,.28),transparent_42%)] relative"><div className="absolute top-0 right-0 h-px w-32 bg-gradient-to-l from-[#D78A4A]/60 to-transparent" /><div className="lg:hidden flex items-center gap-3 mb-14"><img src="/manus-storage/proline-logo_8e1fe1d1.png" className="h-10 w-10" alt="PROLINE" /><span className="font-display font-bold tracking-[.16em]">PROLINE</span></div><div className="flex items-center justify-between border-b border-white/[.08] pb-4 mb-9"><div className="text-[10px] uppercase tracking-[.18em] text-[#718391] flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#7FA98B]" /> Access bay / 01</div><div className="font-display text-[10px] tracking-[.15em] text-[#D78A4A] proline-theme-accent">PL-LOGIN</div></div><div className="mb-9"><div className="text-[#D78A4A] proline-theme-accent text-[10px] font-bold uppercase tracking-[.22em] mb-3">Operator identifikasiyası</div><h2 className="font-display text-3xl font-bold tracking-[-.045em]">İş sahəsinə daxil ol</h2><p className="text-[#81919E] text-sm mt-3 leading-5">Roluna uyğun əməliyyat panelini aç.</p></div><form onSubmit={onSubmit} className="space-y-5"><label className="block"><span className="text-[10px] uppercase tracking-[.14em] font-bold text-[#B6C1C9]">Email identifikatoru</span><input value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} autoComplete="username" placeholder="sifariş" className="mt-2 w-full rounded-lg border border-white/10 bg-[#07121B] px-3.5 py-3 text-sm outline-none focus:border-[#D78A4A] proline-theme-border transition placeholder:text-[#536571]" /></label><label className="block"><span className="text-[10px] uppercase tracking-[.14em] font-bold text-[#B6C1C9]">Giriş kodu / access key</span><input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} autoComplete="current-password" type="password" inputMode="numeric" maxLength={6} placeholder="••••••" className="mt-2 w-full rounded-lg border border-white/10 bg-[#07121B] px-3.5 py-3 text-sm tracking-[.35em] outline-none focus:border-[#D78A4A] proline-theme-border transition placeholder:text-[#536571]" /></label>{error && <div className="text-xs text-[#E58A7C] bg-[#D77464]/10 border border-[#D77464]/20 px-3 py-2 rounded-lg">{error}</div>}<button className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#D78A4A] proline-theme-button hover:bg-[#E49A5A] text-[#1B1713] py-3 text-sm font-bold transition active:scale-[.98]">Panelə daxil ol <LogIn size={16} /></button></form><div className="mt-8 pt-5 border-t border-white/[.08] flex gap-2 text-[11px] text-[#687984]"><CircleHelp size={14} className="shrink-0 text-[#D78A4A] proline-theme-accent" /><span>Giriş yalnız əvvəlcədən təyin edilmiş PROLINE rolları üçün açıqdır.</span></div><div className="mt-7 flex items-center gap-1.5"><span className="text-[9px] uppercase tracking-[.16em] text-[#536571] mr-1">Workflow</span>{[0,1,2,3,4].map((item) => <span key={item} className={`h-1 flex-1 rounded-full ${item === 0 ? "bg-[#D78A4A] proline-theme-button" : "bg-[#243743]"}`} />)}</div></div></div></div> }

function StaffStatus({ current, staff }: { current: User; staff: Staff[] }) { const onlineStaff = staff.filter((worker) => worker.online || worker.email === current.email); if (!onlineStaff.length) return null; return <div className="flex min-w-0 max-w-[48vw] flex-wrap items-center justify-end gap-1.5 rounded-lg border border-white/[.08] bg-white/[.025] px-2 py-1.5 sm:max-w-none sm:px-2.5" title="Online işçilər"><span className="text-[9px] uppercase tracking-[.12em] text-[#657783] mr-1">Online</span>{onlineStaff.map((worker) => <span key={worker.email} className="flex items-center gap-1 text-[10px] text-[#91A0AA]" title={`${worker.label} · Onlayn`}><span className="h-1.5 w-1.5 rounded-full bg-[#7FA98B] shadow-[0_0_6px_#7FA98B]" />{worker.label}</span>)}</div> }
function NoticeTray({ notices, orders, user, onAccept, onReject }: { notices: Notice[]; orders: Order[]; user: User; onAccept: (notice: Notice) => void; onReject: (notice: Notice) => void }) {
  if (!notices.length) return null;
  return <section role="status" aria-live="polite" aria-label="Yeni bildirişlər" className="mb-6 rounded-xl border border-[#D78A4A]/30 proline-theme-border bg-[#D78A4A]/[.07] p-4">
    <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-[#D78A4A]/15 flex items-center justify-center text-[#D78A4A] proline-theme-accent"><PackageCheck size={16} /></span><div><div className="font-display font-bold text-sm">Yeni mərhələ sorğusu</div><div className="text-[10px] uppercase tracking-[.12em] text-[#9B8B7D]">Təsdiq gözləyən sifarişlər</div></div></div><span className="text-xs font-bold text-[#D78A4A] proline-theme-accent">{notices.length} sorğu</span></div>
    <div className="space-y-2">{notices.map((notice) => { const order = orders.find((o) => o.id === notice.orderId); const target = columns.find((c) => c.id === notice.to); const canRespond = roleColumn[user.role] === notice.to; return <div key={notice.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-lg bg-[#0B1823]/80 border border-white/[.08] px-3.5 py-3"><div><div className="text-xs font-semibold text-[#E2E9ED]">{notice.orderId} · {order?.title || "Sifariş"}</div><div className="text-[11px] text-[#84939E] mt-1">{notice.requester} tərəfindən <span className="text-[#D78A4A] proline-theme-accent">{target?.label}</span> mərhələsinə göndərilib.</div></div><div className="flex gap-2 shrink-0">{canRespond ? <><button onClick={() => onAccept(notice)} className="px-3 py-2 rounded-md bg-[#7FA98B] text-[#102017] text-[11px] font-bold">Qəbul et</button><button onClick={() => onReject(notice)} className="px-3 py-2 rounded-md border border-[#D77464]/50 text-[#E58A7C] text-[11px] font-bold hover:bg-[#D77464]/10">İmtina et</button></> : <span className="px-3 py-2 rounded-md border border-[#D7B45A]/30 text-[#D7B45A] text-[11px] font-semibold">Cavab gözlənilir</span>}</div></div>; })}</div>
  </section>;
}
function RejectModal({ notice, reason, setReason, onClose, onSubmit }: { notice: Notice; reason: string; setReason: (value: string) => void; onClose: () => void; onSubmit: () => void }) {
  return <div className="fixed inset-0 z-50 bg-[#02070B]/75 backdrop-blur-sm flex items-center justify-center p-4"><div className="w-full max-w-md rounded-2xl border border-[#D77464]/30 bg-[#0D1C29] proline-theme-surface shadow-2xl overflow-hidden"><div className="p-6 border-b border-white/[.08]"><div className="text-[10px] uppercase tracking-[.18em] text-[#D77464] font-bold">İmtina protokolu · {notice.orderId}</div><h2 className="font-display text-2xl font-bold mt-2">Səbəbi qeyd et</h2><p className="text-xs text-[#81919E] mt-2">Sifariş əvvəlki sütunda qalacaq və bu səbəb alert kimi görünəcək.</p></div><div className="p-6"><textarea autoFocus value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="İmtina səbəbini yaz..." className="w-full resize-none rounded-lg border border-white/10 bg-[#07121B] px-3.5 py-3 text-sm outline-none focus:border-[#D77464]" /><div className="flex justify-end gap-2 mt-4"><button onClick={onClose} className="px-4 py-2.5 rounded-lg text-xs text-[#91A0AA] hover:bg-white/5">Ləğv et</button><button onClick={onSubmit} className="px-4 py-2.5 rounded-lg bg-[#D77464] text-[#170D0B] text-xs font-bold">İmtinanı təsdiqlə</button></div></div></div></div>;
}
function Metric({ label, value, detail, icon: Icon, accent = "#D78A4A" }: { label: string; value: number; detail: string; icon: typeof ClipboardList; accent?: string }) { return <div className="rounded-xl border border-white/[.09] bg-[#0C1925]/90 px-4 py-4 flex items-center gap-3"><div className="h-9 w-9 rounded-lg bg-white/[.05] flex items-center justify-center" style={{ color: accent }}><Icon size={17} /></div><div><div className="text-[10px] uppercase tracking-[.12em] text-[#6F818E]">{label}</div><div className="flex items-baseline gap-2 mt-0.5"><span className="font-display text-xl font-bold">{value}</span><span className="text-[10px] text-[#73838E]">{detail}</span></div></div></div> }
function durationLabel(iso: string, now: number) { const totalMinutes = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 60000)); const days = Math.floor(totalMinutes / 1440); const hours = Math.floor((totalMinutes % 1440) / 60); const mins = totalMinutes % 60; return days ? `${days}g ${hours}s` : hours ? `${hours}s ${mins}d` : `${mins}d`; }
function PushControl() {
  const configQuery = trpc.push.config.useQuery();
  const subscribeMutation = trpc.push.subscribe.useMutation();
  const unsubscribeMutation = trpc.push.unsubscribe.useMutation();
  const [status, setStatus] = useState<"checking" | "enabled" | "disabled" | "unsupported" | "denied">("checking");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!configQuery.data?.configured) {
      setStatus("unsupported");
      return;
    }
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    void registerProlineServiceWorker()
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setStatus(subscription ? "enabled" : Notification.permission === "denied" ? "denied" : "disabled"))
      .catch(() => setStatus("unsupported"));
  }, [configQuery.data?.configured]);

  async function enablePush() {
    if (!configQuery.data?.publicKey) return toast.error("Push serveri hələ konfiqurasiya edilməyib.");
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "disabled");
        toast.error(permission === "denied" ? "Bildiriş icazəsi brauzer ayarlarından bloklanıb." : "Bildiriş icazəsi verilmədi.");
        return;
      }
      const subscription = await getProlinePushSubscription(configQuery.data.publicKey);
      await subscribeMutation.mutateAsync({ ...serializeProlinePushSubscription(subscription), userAgent: navigator.userAgent });
      setStatus("enabled");
      toast.success("Fon bildirişləri aktivləşdirildi");
    } catch {
      toast.error("Fon bildirişləri aktivləşdirilmədi. HTTPS və brauzer icazəsini yoxlayın.");
    } finally {
      setBusy(false);
    }
  }

  async function disablePush() {
    setBusy(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration("/");
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) await unsubscribeMutation.mutateAsync({ endpoint: subscription.endpoint });
      await subscription?.unsubscribe();
      setStatus("disabled");
      toast.success("Fon bildirişləri söndürüldü");
    } catch {
      toast.error("Fon bildirişləri söndürülmədi.");
    } finally {
      setBusy(false);
    }
  }

  const unavailable = status === "unsupported" || status === "denied";
  return <section className="rounded-xl border border-white/[.1] overflow-hidden" aria-live="polite">
    <div className="flex items-start justify-between gap-3 px-4 py-3">
      <div className="flex min-w-0 items-start gap-3"><span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${status === "enabled" ? "bg-[#7FA98B]/15 text-[#A8D2B0]" : "bg-white/[.05] text-[#B7C3CB]"}`}>{status === "enabled" ? <BellRing size={16} /> : <Bell size={16} />}</span><div className="min-w-0"><div className="text-[10px] uppercase tracking-[.14em] font-bold text-[#AAB9C4]">Bağlı cihaz bildirişləri</div><div className="text-xs leading-5 text-[#B7C3CB] mt-1">Tətbiq bağlı olduqda sifariş və təsdiq bildirişi alın.</div></div></div>
      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${status === "enabled" ? "bg-[#7FA98B]/15 text-[#A8D2B0]" : "bg-white/[.06] text-[#AAB9C4]"}`}>{status === "checking" ? "Yoxlanır" : status === "enabled" ? "Aktiv" : status === "denied" ? "Bloklanıb" : status === "unsupported" ? "Dəstəklənmir" : "Deaktiv"}</span>
    </div>
    <div className="flex flex-col gap-3 border-t border-white/[.08] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-[10px] leading-4 text-[#8F9FA9]">Brauzerin sistem bildiriş səsi istifadə olunur. Hər cihazda ayrıca aktivləşdirin.</p>{!unavailable && <button type="button" disabled={busy || status === "checking"} onClick={status === "enabled" ? disablePush : enablePush} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-[#101820] proline-theme-button disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Gözləyin..." : status === "enabled" ? <><Bell size={14} /> Söndür</> : <><BellRing size={14} /> Aktivləşdir</>}</button>}</div>
  </section>;
}

function OrderCard({ order, canDrag, onClick, onDragStart, onDragEnd, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onTouchStart, onTouchMove, onTouchEnd, onTouchCancel }: { order: Order; canDrag: boolean; onClick: () => void; onDragStart: (event: React.DragEvent<HTMLElement>) => void; onDragEnd: () => void; onPointerDown?: (event: React.PointerEvent<HTMLElement>) => void; onPointerMove?: (event: React.PointerEvent<HTMLElement>) => void; onPointerUp?: (event: React.PointerEvent<HTMLElement>) => void; onPointerCancel?: () => void; onTouchStart?: (event: React.TouchEvent<HTMLElement>) => void; onTouchMove?: (event: React.TouchEvent<HTMLElement>) => void; onTouchEnd?: (event: React.TouchEvent<HTMLElement>) => void; onTouchCancel?: () => void }) { const [p, color] = priorityMeta(order.priority); const [coarsePointer] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches); const [now, setNow] = useState(Date.now()); const [expanded, setExpanded] = useState(false); useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 60000); return () => window.clearInterval(id); }, []); const pending = order.pendingTo ? columns.find((c) => c.id === order.pendingTo) : null; const hasLongDescription = (order.description || "").length > 150; return <article draggable={!coarsePointer && canDrag && !order.pendingTo} onDragStart={onDragStart} onDragEnd={onDragEnd} onPointerDown={onPointerDown} onTouchStart={onTouchStart} onClick={onClick} style={{ touchAction: "pan-y" }} className={`group min-w-0 overflow-hidden rounded-lg border bg-[#122230] p-3.5 transition-all duration-200 cursor-pointer shadow-[0_4px_18px_rgba(0,0,0,.12)] ${pending ? "border-[#D7B45A]/45" : "border-white/[.08] hover:border-[#D78A4A] proline-theme-border/50 hover:bg-[#162A39]"}`}><div className="flex items-start justify-between gap-2"><div className="flex items-center gap-2 min-w-0">{canDrag && <button type="button" aria-label="Sürüşdürmək üçün tutacaq" className="cursor-grab rounded p-1 -m-1 text-[#4F626F] group-hover:text-[#D78A4A] proline-theme-accent active:cursor-grabbing" onClick={(event) => event.stopPropagation()}><GripVertical size={14} /></button>}<span className="font-display text-[10px] font-bold tracking-[.12em] text-[#80909C]">{order.id}</span></div><span className="text-[9px] font-bold uppercase tracking-[.1em] flex items-center gap-1" style={{ color }}><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />{p}</span></div><h3 className="min-w-0 break-words font-display text-sm font-semibold text-[#E8EEF2] mt-3 leading-5">{order.title}</h3>{order.image && <img src={order.image} alt="Sifariş şəkli" className="mt-3 h-32 w-full rounded-md object-cover border border-white/10" />}{order.description && <div className="mt-1.5"><p className={`max-w-full break-words whitespace-pre-wrap text-[11px] leading-4 text-[#80909C] ${expanded || !hasLongDescription ? "" : "line-clamp-2 overflow-hidden"}`}>{order.description}</p>{hasLongDescription && <button type="button" onClick={(event) => { event.stopPropagation(); setExpanded((value) => !value); }} className="mt-1 inline-flex min-h-7 items-center rounded-md px-1.5 text-[10px] font-semibold proline-theme-accent hover:bg-white/[.06]">{expanded ? "Qısalt" : "Tam göstər"}</button>}</div>}{pending && <div className="mt-3 rounded-md bg-[#D7B45A]/10 border border-[#D7B45A]/20 px-2.5 py-2 text-[10px] text-[#D7B45A]">Təsdiq gözləyir · {pending.label}</div>}{order.rejectedReason && <div className="mt-3 rounded-md bg-[#D77464]/10 border border-[#D77464]/20 px-2.5 py-2 text-[10px] text-[#E58A7C]">İmtina səbəbi: {order.rejectedReason}</div>}<div className="mt-4 pt-3 border-t border-white/[.07] flex items-center justify-between text-[10px] text-[#687A86]"><span className="flex items-center gap-1.5"><Clock3 size={12} />{formatDate(order.createdAt)}</span><span className="flex items-center gap-1.5 text-[#A3B1BA]" title="Cari mərhələdə keçən vaxt"><span className="h-1.5 w-1.5 rounded-full bg-[#D78A4A] proline-theme-button" />{durationLabel(order.stageEnteredAt, now)}</span></div></article> }
function OrderModal({ order, user, auditLogs, comments, commentBody, setCommentBody, onSubmitComment, onClose, onEdit, onDelete }: {
  order: Order;
  user: User;
  auditLogs: { action: string; details: string | null; createdAt: Date }[];
  comments: OrderComment[];
  commentBody: string;
  setCommentBody: React.Dispatch<React.SetStateAction<string>>;
  onSubmitComment: (event: React.FormEvent) => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}) {
  const col = columns.find((c) => c.id === order.column)!;
  const [p, color] = priorityMeta(order.priority);
  return (
    <div className="fixed inset-0 z-50 bg-[#02070B]/75 backdrop-blur-sm flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="flex min-h-0 w-full max-w-xl max-h-[calc(100vh-1.5rem)] flex-col rounded-2xl border border-white/10 bg-[#0D1C29] proline-theme-surface shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/[.08] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] tracking-[.16em] uppercase text-[#D78A4A] proline-theme-accent font-bold"><span>{order.id}</span><span className="h-1 w-1 rounded-full bg-[#536571]" /><span>{col.label}</span></div>
            <h2 className="font-display text-xl sm:text-2xl font-bold mt-2 break-words">{order.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-[#81919E] shrink-0"><X size={18} /></button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} /><span className="text-xs font-semibold" style={{ color }}>{p} prioritet</span><span className="text-[#536571]">·</span><span className="text-xs text-[#91A0AA]">{col.detail}</span></div>
          {order.image && <img src={order.image} alt="Sifariş" className="w-full max-h-52 object-cover rounded-lg border border-white/10" />}
          <div><div className="text-[10px] uppercase tracking-[.14em] font-bold text-[#6E808D] mb-2">Açıqlama</div><p className="text-sm leading-6 text-[#C0CBD2] break-words">{order.description || "Açıqlama əlavə edilməyib."}</p></div>
          {auditLogs.length > 0 && <div><div className="text-[10px] uppercase tracking-[.14em] font-bold text-[#6E808D] mb-2 flex items-center gap-2"><History size={12} /> Audit tarixçəsi</div><div className="space-y-2 max-h-36 overflow-y-auto">{auditLogs.map((log) => <div key={log.createdAt.toISOString() + log.action} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-white/[.035] px-3 py-2 text-[11px]"><span className="text-[#C0CBD2]">{log.details || log.action}</span><span className="text-[#718391] shrink-0">{formatDate(log.createdAt.toISOString())}</span></div>)}</div></div>}
          <div>
            <div className="text-[10px] uppercase tracking-[.14em] font-bold text-[#6E808D] mb-2 flex items-center gap-2"><MessageCircle size={12} /> Şərhlər <span className="text-[#718391]">({comments.length})</span></div>
            <div className="space-y-2 max-h-44 overflow-y-auto">
              {comments.length ? comments.map((comment) => <div key={comment.id} className="rounded-lg bg-white/[.035] border border-white/[.06] px-3 py-2.5"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[11px] font-semibold text-[#D5DEE4]">{comment.authorName}</span><span className="text-[10px] text-[#718391]">{formatDate(new Date(comment.createdAt).toISOString())}</span></div><p className="text-xs leading-5 text-[#AEBBC4] mt-1.5 whitespace-pre-wrap break-words">{comment.body}</p></div>) : <div className="rounded-lg border border-dashed border-white/10 px-3 py-4 text-center text-[11px] text-[#718391]">Hələ şərh yoxdur</div>}
            </div>
            <form onSubmit={onSubmitComment} className="mt-3 flex flex-col sm:flex-row gap-2"><textarea value={commentBody} onChange={(event) => setCommentBody(event.target.value)} rows={2} maxLength={2000} placeholder="Bu sifariş haqqında qeyd yaz..." className="min-w-0 flex-1 resize-none rounded-lg border border-white/10 bg-[#07121B] px-3 py-2.5 text-xs text-[#E8EEF2] outline-none focus:border-[#D78A4A] proline-theme-border" /><button type="submit" disabled={!commentBody.trim()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D78A4A] proline-theme-button px-3.5 py-2.5 text-xs font-bold text-[#1B1713] disabled:cursor-not-allowed disabled:opacity-40"><Send size={14} /> Yaz</button></form>
          </div>
          <div className="grid sm:grid-cols-2 gap-3"><div className="rounded-lg bg-white/[.035] border border-white/[.07] p-3"><div className="text-[10px] uppercase tracking-[.12em] text-[#6E808D]">Yaradılma tarixi</div><div className="text-xs text-[#D4DDE2] mt-1.5 flex items-center gap-2"><CalendarDays size={13} className="text-[#D78A4A] proline-theme-accent" />{formatDate(order.createdAt)}</div></div><div className="rounded-lg bg-white/[.035] border border-white/[.07] p-3"><div className="text-[10px] uppercase tracking-[.12em] text-[#6E808D]">Sifariş statusu</div><div className="text-xs text-[#D4DDE2] mt-1.5 flex items-center gap-2"><PackageCheck size={13} className="text-[#7FA98B]" />{col.label}</div></div></div>
        </div>
        <div className="sticky bottom-0 shrink-0 px-4 sm:px-6 py-4 bg-[#0A1722] border-t border-white/[.08] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><span className="text-[11px] text-[#697B87] flex items-center gap-1.5"><ShieldCheck size={13} /> {onDelete ? "Admin əməliyyatları" : "Sifariş silinməzdir"}</span>{canEdit(user) && <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"><button onClick={onEdit} className="inline-flex items-center justify-center gap-2 bg-[#D78A4A] proline-theme-button hover:bg-[#E49A5A] text-[#1B1713] px-3.5 py-2.5 rounded-lg text-xs font-bold"><Pencil size={14} /> Redaktə et</button>{onDelete && <button onClick={onDelete} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D77464]/40 bg-[#D77464]/10 px-3.5 py-2.5 text-xs font-bold text-[#F0A39A] hover:bg-[#D77464]/20"><Trash2 size={14} /> Sil</button>}</div>}</div>
      </div>
    </div>
  );
}

async function compressImage(file: File) { if (typeof createImageBitmap === "undefined") return await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result || "")); reader.onerror = () => reject(new Error("Şəkil oxunmadı")); reader.readAsDataURL(file); }); const bitmap = await createImageBitmap(file); const maxSizes = [1200, 900, 700, 500]; const qualities = [0.68, 0.52, 0.38]; let output = ""; for (const maxSize of maxSizes) { const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height)); const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale)); const context = canvas.getContext("2d"); if (!context) continue; context.drawImage(bitmap, 0, 0, canvas.width, canvas.height); for (const quality of qualities) { output = canvas.toDataURL("image/jpeg", quality); if (output.length <= 64000) { bitmap.close(); return output; } } } bitmap.close(); return output; }
function OrderForm({ selected, form, setForm, onClose, onSubmit }: { selected: Order | null; form: { title: string; description: string; priority: Priority; image: string }; setForm: React.Dispatch<React.SetStateAction<{ title: string; description: string; priority: Priority; image: string }>>; onClose: () => void; onSubmit: (e: React.FormEvent) => void }) { return <div className="fixed inset-0 z-50 bg-[#02070B]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"><div className="flex min-h-0 w-full max-w-lg flex-col rounded-2xl border border-white/10 bg-[#0D1C29] proline-theme-surface shadow-2xl overflow-hidden max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)]"><div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/[.08] flex items-center justify-between"><div><div className="text-[10px] tracking-[.16em] uppercase text-[#D78A4A] proline-theme-accent font-bold">{selected ? "Sifarişi yenilə" : "Yeni sifariş"}</div><h2 className="font-display text-2xl font-bold mt-1">{selected ? selected.id : "Sifarişi xəttə əlavə et"}</h2></div><button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-[#81919E]"><X size={18} /></button></div><form onSubmit={onSubmit} className="min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4"><label className="block"><span className="text-xs font-semibold text-[#B6C1C9]">Sifariş adı *</span><input autoFocus value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Məs: Atlas metal konstruksiya" className="mt-2 w-full rounded-lg border border-white/10 bg-[#07121B] px-3.5 py-3 text-sm outline-none focus:border-[#D78A4A] proline-theme-border transition placeholder:text-[#536571]" /></label><label className="block"><span className="text-xs font-semibold text-[#B6C1C9]">Açıqlama</span><textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} placeholder="Ölçü, material, xüsusi qeydlər..." className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-[#07121B] px-3.5 py-3 text-sm outline-none focus:border-[#D78A4A] proline-theme-border transition placeholder:text-[#536571]" /></label><div className="grid sm:grid-cols-2 gap-4"><label className="block"><span className="text-xs font-semibold text-[#B6C1C9]">Vaciblik</span><div className="relative mt-2"><select value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))} className="appearance-none w-full rounded-lg border border-white/10 bg-[#07121B] px-3.5 py-3 text-sm outline-none focus:border-[#D78A4A] proline-theme-border transition"><option value="low">Aşağı</option><option value="normal">Normal</option><option value="high">Yüksək</option><option value="urgent">Təcili</option></select><ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#718391]" /></div></label><div className="block"><span className="text-xs font-semibold text-[#B6C1C9]">Sifariş şəkli <span className="text-[#657783] font-normal">(opsional)</span></span><div className="mt-2 flex min-w-0 items-center gap-2 rounded-lg border border-white/10 bg-[#07121B] px-3 py-2.5"><input id="order-image-upload" type="file" accept="image/*" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { const image = await compressImage(file); setForm((f) => ({ ...f, image })); } catch (error) { showOperationError(error, "Şəkil emal edilə bilmədi."); } }} className="sr-only" /><label htmlFor="order-image-upload" className="shrink-0 cursor-pointer rounded-md bg-[#D78A4A] proline-theme-button px-3 py-1.5 text-xs font-bold text-[#1B1713]">Şəkil seç</label><span className="min-w-0 truncate text-xs text-[#D5DFE4]">{form.image ? "Şəkil hazırdır" : "Şəkil seçilməyib"}</span></div></div></div><div className="rounded-lg border border-white/10 bg-white/[.045] p-3 flex gap-2 text-[11px] text-[#D5DFE4]"><ShieldCheck size={14} className="text-[#D78A4A] proline-theme-accent shrink-0" /><span>Sifariş məlumatlarını yalnız Admin redaktə və ya silə bilər.</span></div><div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg text-xs font-semibold text-[#C4D0D7] hover:bg-white/5">Ləğv et</button><button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D78A4A] proline-theme-button hover:bg-[#E49A5A] text-[#1B1713] text-xs font-bold"><Check size={15} /> {selected ? "Dəyişiklikləri saxla" : "Sifariş yarat"}</button></div></form></div></div> }

function SettingsPanel({ canExport, templateId, setTemplateId, themeId, setThemeId, columnLayouts, setColumnLayouts, onExport, onClose }: { canExport: boolean; templateId: ExcelTemplateId; setTemplateId: (id: ExcelTemplateId) => void; themeId: ThemeId; setThemeId: (id: ThemeId) => void; columnLayouts: Record<string, string[]>; setColumnLayouts: React.Dispatch<React.SetStateAction<Record<string, string[]>>>; onExport: (format: "csv" | "xls", fields?: string[]) => void; onClose: () => void }) {
  const activeTheme = themePresets.find((theme) => theme.id === themeId) || themePresets[0];
  const selectedTemplate = excelTemplates.find((template) => template.id === templateId) || excelTemplates[0];
  const [themesOpen, setThemesOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<"csv" | "xls">("xls");
  const [previewFields, setPreviewFields] = useState<string[]>(() => normalizePreviewFields(selectedTemplate.fields, columnLayouts[templateId]));
  useEffect(() => { setPreviewFields(normalizePreviewFields(selectedTemplate.fields, columnLayouts[templateId])); }, [templateId, columnLayouts, selectedTemplate]);
  function updatePreviewFields(nextFields: string[]) { const safeFields = normalizePreviewFields(selectedTemplate.fields, nextFields); setPreviewFields(safeFields); setColumnLayouts((previous) => ({ ...previous, [templateId]: safeFields })); }
  function selectTemplate(nextTemplateId: ExcelTemplateId) { const nextTemplate = excelTemplates.find((template) => template.id === nextTemplateId) || excelTemplates[0]; setTemplateId(nextTemplateId); setPreviewFields(normalizePreviewFields(nextTemplate.fields, columnLayouts[nextTemplateId])); }
  const previewRows = [
    { "Sifariş kodu": "PL-NÜMUNƏ-001", "Sifariş adı": "Nümunə metal konstruksiya", "Ətraflı açıqlama": "Ölçü və material üzrə nümunə məlumat", "Prioritet": "Yüksək", "Cari mərhələ": "İstehsalat", "Gözlənilən keçid": "Cilalama", "Növbəti mərhələ": "Cilalama", "İmtina səbəbi": "—", "Yaradılma tarixi": "21 Avq 2026, 10:30", "Son yenilənmə": "21 Avq 2026, 12:15", "Mərhələyə giriş tarixi": "21 Avq 2026, 11:00", "Təsdiq statusu": "YOXDU", "Status": "YOXDU" },
    { "Sifariş kodu": "PL-NÜMUNƏ-002", "Sifariş adı": "Nümunə sifariş", "Ətraflı açıqlama": "Önizləmə üçün nümunə sətir", "Prioritet": "Normal", "Cari mərhələ": "Sifarişlər", "Gözlənilən keçid": "—", "Növbəti mərhələ": "—", "İmtina səbəbi": "—", "Yaradılma tarixi": "21 Avq 2026, 09:45", "Son yenilənmə": "21 Avq 2026, 09:45", "Mərhələyə giriş tarixi": "21 Avq 2026, 09:45", "Təsdiq statusu": "YOXDU", "Status": "YOXDU" },
  ];
  const previewValue = (row: Record<string, string>, field: string) => row[field] || "—";

  return <div className="fixed inset-0 z-[60] bg-[#02070B]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#0D1C29] proline-theme-surface shadow-2xl">
      <div className="flex items-start justify-between gap-4 border-b border-white/[.08] px-4 sm:px-6 py-4 sm:py-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] font-bold proline-theme-accent"><Settings size={13} /> Sistem ayarları</div>
          <h2 className="font-display text-xl sm:text-2xl font-bold mt-2">PROLINE Settings</h2>
          <p className="text-xs leading-5 text-[#B7C3CB] mt-2 max-w-lg">Tema seçimlərini buradan idarə edin.{canExport ? " Excel çıxış ayarları da bu bölmədədir." : ""}</p>
        </div>
        <button onClick={onClose} aria-label="Settings-i bağla" className="p-2 rounded-lg text-[#B7C3CB] hover:bg-white/10"><X size={18} /></button>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <section className="rounded-xl border border-white/[.1] overflow-hidden">
          <button type="button" aria-expanded={themesOpen} onClick={() => setThemesOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-white/[.04]">
            <span><span className="block text-[10px] uppercase tracking-[.14em] font-bold text-[#AAB9C4]">Rəngli tema</span><span className="block text-xs text-[#AAB9C4] mt-1">12 rəng palitrasından birini seçin.</span></span>
            <span className="flex items-center gap-2 text-xs text-[#E8EEF2]"><span className="h-3 w-3 rounded-full" style={{ backgroundColor: activeTheme.accent }} />{themesOpen ? "Bağla" : activeTheme.name}<ChevronDown size={15} className={`transition-transform ${themesOpen ? "rotate-180" : ""}`} /></span>
          </button>
          {themesOpen && <div className="border-t border-white/[.08] p-3"><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{themePresets.map((theme) => <button key={theme.id} type="button" onClick={() => setThemeId(theme.id)} aria-pressed={themeId === theme.id} className={`text-left rounded-xl border p-3.5 transition ${themeId === theme.id ? "border-white/50" : "border-white/[.1] hover:border-white/25"}`} style={{ background: `linear-gradient(135deg, ${theme.glow}, rgba(255,255,255,.025))` }}><div className="flex items-center gap-3"><span className="h-8 w-8 rounded-full border-2 border-white/25 shrink-0" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentHover})`, boxShadow: `0 0 18px ${theme.glow}` }} /><span className="min-w-0"><span className="block text-sm font-semibold text-[#F1F5F7]">{theme.name}</span><span className="block text-[10px] leading-4 text-[#B7C3CB] mt-0.5">{theme.description}</span></span>{themeId === theme.id && <Check size={16} className="ml-auto shrink-0 proline-theme-accent" />}</div></button>)}</div></div>}
        </section>

        {canExport && <>
        <section className="rounded-xl border border-white/[.1] overflow-hidden">
          <button type="button" aria-expanded={templatesOpen} onClick={() => setTemplatesOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-white/[.04]">
            <span><span className="block text-[10px] uppercase tracking-[.14em] font-bold text-[#AAB9C4]">Excel çıxış şablonu</span><span className="block text-xs text-[#AAB9C4] mt-1">Məlumatların hansı formatda çıxacağını seçin.</span></span>
            <span className="flex items-center gap-2 text-xs text-[#E8EEF2]"><span className="max-w-[130px] truncate">{templatesOpen ? "Bağla" : excelTemplates.find((template) => template.id === templateId)?.name}</span><ChevronDown size={15} className={`transition-transform ${templatesOpen ? "rotate-180" : ""}`} /></span>
          </button>
          {templatesOpen && <div className="border-t border-white/[.08] p-3"><div className="space-y-3">{excelTemplates.map((template) => <button key={template.id} type="button" onClick={() => selectTemplate(template.id)} aria-pressed={templateId === template.id} className={`w-full text-left rounded-xl border p-4 transition ${templateId === template.id ? "border-white/30" : "border-white/[.1] hover:border-white/25"}`} style={templateId === template.id ? { borderColor: activeTheme.accent, background: activeTheme.glow } : undefined}><div className="flex items-start gap-3"><span className="mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center shrink-0" style={templateId === template.id ? { borderColor: activeTheme.accent, backgroundColor: activeTheme.accent, color: "#101820" } : { borderColor: "rgba(255,255,255,.25)" }}>{templateId === template.id && <Check size={13} />}</span><span className="min-w-0"><span className="block text-sm font-semibold text-[#F1F5F7]">{template.name}</span><span className="block text-xs leading-5 text-[#B7C3CB] mt-1">{template.description}</span><span className="block text-[10px] leading-4 text-[#C5D0D6] mt-2">Sütunlar: {template.fields.join(" · ")}</span></span></div></button>)}</div></div>}
        </section>

        <section className="rounded-xl border border-white/[.1] overflow-hidden">
          <div className="flex items-start justify-between gap-3 border-b border-white/[.08] px-4 py-3"><div><div className="text-[10px] uppercase tracking-[.14em] font-bold text-[#AAB9C4]">Preview sütunları</div><div className="text-xs text-[#B7C3CB] mt-1">Sütunları gizlədin və sırasını dəyişin.</div></div><span className="text-[10px] text-[#AAB9C4]">{previewFields.length}/{selectedTemplate.fields.length} görünür</span></div>
          <div className="space-y-2 p-3">{previewFields.map((field, index) => <div key={field} className="flex items-center gap-2 rounded-lg border border-white/[.08] bg-white/[.025] px-2.5 py-2"><GripVertical size={14} className="shrink-0 text-[#8294A0]" /><span className="min-w-0 flex-1 truncate text-xs text-[#E4EBEF]">{field}</span><div className="flex items-center gap-1"><button type="button" disabled={index === 0} onClick={() => { updatePreviewFields(movePreviewField(previewFields, index, -1)); }} className="rounded p-1 text-[#AAB9C4] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30" aria-label={`${field} sütununu yuxarı keçir`}><ChevronDown size={14} className="rotate-180" /></button><button type="button" disabled={index === previewFields.length - 1} onClick={() => { updatePreviewFields(movePreviewField(previewFields, index, 1)); }} className="rounded p-1 text-[#AAB9C4] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30" aria-label={`${field} sütununu aşağı keçir`}><ChevronDown size={14} /></button><button type="button" disabled={previewFields.length === 1} onClick={() => updatePreviewFields(hidePreviewField(previewFields, field))} className="rounded p-1 text-[#D58C83] hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30" aria-label={`${field} sütununu gizlət`}><X size={14} /></button></div></div>)}{selectedTemplate.fields.filter((field) => !previewFields.includes(field)).length > 0 && <div className="flex flex-wrap gap-2 border-t border-white/[.08] pt-3">{selectedTemplate.fields.filter((field) => !previewFields.includes(field)).map((field) => <button type="button" key={field} onClick={() => updatePreviewFields(showPreviewField(previewFields, field, selectedTemplate.fields))} className="inline-flex items-center gap-1 rounded-md border border-white/[.12] px-2 py-1.5 text-[10px] text-[#D3DDE2] hover:bg-white/10"><Plus size={12} /> {field} göstər</button>)}</div>}</div>
        </section>

        <section className="rounded-xl border border-white/[.1] overflow-hidden" style={{ borderColor: `${activeTheme.accent}55`, background: `linear-gradient(145deg, ${activeTheme.glow}, transparent 48%)` }}>
          <div className="flex flex-col gap-3 border-b border-white/[.08] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="text-[10px] uppercase tracking-[.14em] font-bold" style={{ color: activeTheme.accent }}>Excel önizləməsi</div><div className="text-xs text-[#D3DDE2] mt-1">“{selectedTemplate.name}” formatında görünüş.</div></div><div className="flex flex-wrap items-center gap-2"><span className="rounded-md px-2 py-1 text-[10px] font-bold" style={{ backgroundColor: activeTheme.glow, color: activeTheme.accent }}>Nümunə</span><select value={downloadFormat} onChange={(event) => setDownloadFormat(event.target.value as "csv" | "xls")} aria-label="Önizləmə yükləmə formatı" className="rounded-md border border-white/15 bg-[#07121B] px-2 py-1.5 text-[10px] font-bold text-[#E8EEF2] outline-none" style={{ borderColor: `${activeTheme.accent}66` }}><option value="xls">XLS</option><option value="csv">CSV</option></select><button type="button" onClick={() => onExport(downloadFormat, previewFields)} className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[10px] font-bold" style={{ backgroundColor: activeTheme.accent, color: "#08121B" }}><Download size={13} /> Yüklə</button></div></div>
          <div className="overflow-x-auto"><table className="min-w-full text-left text-[10px]"><thead><tr style={{ backgroundColor: activeTheme.accent, color: "#08121B" }}>{previewFields.map((field) => <th key={field} className="whitespace-nowrap px-3 py-2 font-bold">{field}</th>)}</tr></thead><tbody>{previewRows.map((row, index) => <tr key={index} className="border-b border-white/[.06] last:border-0" style={{ backgroundColor: index % 2 ? activeTheme.glow : "transparent" }}>{previewFields.map((field, fieldIndex) => <td key={field} className={`max-w-[220px] whitespace-nowrap px-3 py-2 ${fieldIndex === 0 ? "font-semibold" : ""}`} style={{ color: fieldIndex === 0 ? activeTheme.accent : "#D5DFE4" }}>{previewValue(row, field)}</td>)}</tr>)}</tbody></table></div><div className="border-t border-white/[.08] px-4 py-2 text-[10px] text-[#BFCBD2]">Bu yalnız önizləmədir; yüklənən faylda real sifariş məlumatları istifadə olunacaq.</div>
        </section>
        </>}
      </div>

      {canExport && <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/[.08] bg-[#0A1722] px-4 sm:px-6 py-4">
        <span className="text-[11px] text-[#AAB9C4]">Aktiv: <strong className="proline-theme-accent">{excelTemplates.find((template) => template.id === templateId)?.name}</strong></span>
        <div className="flex flex-col sm:flex-row gap-2"><button onClick={() => onExport("csv")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3.5 py-2.5 text-xs font-bold text-[#E0E8EC] hover:bg-white/5"><Download size={14} /> CSV çıxart</button><button onClick={() => onExport("xls")} className="inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-bold text-[#101820] proline-theme-button"><Download size={14} /> Excel çıxart</button></div>
      </div>}
    </div>
  </div>;
}
