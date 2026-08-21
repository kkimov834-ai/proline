from pathlib import Path
import re

path = Path('/home/ubuntu/proline/client/src/pages/Home.tsx')
text = path.read_text()
replacement = r'''function OrderModal({ order, user, auditLogs, comments, commentBody, setCommentBody, onSubmitComment, onClose, onEdit }: {
  order: Order;
  user: User;
  auditLogs: { action: string; details: string | null; createdAt: Date }[];
  comments: OrderComment[];
  commentBody: string;
  setCommentBody: React.Dispatch<React.SetStateAction<string>>;
  onSubmitComment: (event: React.FormEvent) => void;
  onClose: () => void;
  onEdit: () => void;
}) {
  const col = columns.find((c) => c.id === order.column)!;
  const [p, color] = priorityMeta(order.priority);
  return (
    <div className="fixed inset-0 z-50 bg-[#02070B]/75 backdrop-blur-sm flex items-center justify-center p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-xl max-h-[calc(100vh-2rem)] rounded-2xl border border-white/10 bg-[#0D1C29] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/[.08] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] tracking-[.16em] uppercase text-[#D78A4A] font-bold"><span>{order.id}</span><span className="h-1 w-1 rounded-full bg-[#536571]" /><span>{col.label}</span></div>
            <h2 className="font-display text-xl sm:text-2xl font-bold mt-2 break-words">{order.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-[#81919E] shrink-0"><X size={18} /></button>
        </div>
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-9rem)]">
          <div className="flex flex-wrap items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} /><span className="text-xs font-semibold" style={{ color }}>{p} prioritet</span><span className="text-[#536571]">·</span><span className="text-xs text-[#91A0AA]">{col.detail}</span></div>
          {order.image && <img src={order.image} alt="Sifariş" className="w-full max-h-52 object-cover rounded-lg border border-white/10" />}
          <div><div className="text-[10px] uppercase tracking-[.14em] font-bold text-[#6E808D] mb-2">Açıqlama</div><p className="text-sm leading-6 text-[#C0CBD2] break-words">{order.description || "Açıqlama əlavə edilməyib."}</p></div>
          {auditLogs.length > 0 && <div><div className="text-[10px] uppercase tracking-[.14em] font-bold text-[#6E808D] mb-2 flex items-center gap-2"><History size={12} /> Audit tarixçəsi</div><div className="space-y-2 max-h-36 overflow-y-auto">{auditLogs.map((log) => <div key={log.createdAt.toISOString() + log.action} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-white/[.035] px-3 py-2 text-[11px]"><span className="text-[#C0CBD2]">{log.details || log.action}</span><span className="text-[#718391] shrink-0">{formatDate(log.createdAt.toISOString())}</span></div>)}</div></div>}
          <div>
            <div className="text-[10px] uppercase tracking-[.14em] font-bold text-[#6E808D] mb-2 flex items-center gap-2"><MessageCircle size={12} /> Şərhlər <span className="text-[#718391]">({comments.length})</span></div>
            <div className="space-y-2 max-h-44 overflow-y-auto">
              {comments.length ? comments.map((comment) => <div key={comment.id} className="rounded-lg bg-white/[.035] border border-white/[.06] px-3 py-2.5"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-[11px] font-semibold text-[#D5DEE4]">{comment.authorName}</span><span className="text-[10px] text-[#718391]">{formatDate(new Date(comment.createdAt).toISOString())}</span></div><p className="text-xs leading-5 text-[#AEBBC4] mt-1.5 whitespace-pre-wrap break-words">{comment.body}</p></div>) : <div className="rounded-lg border border-dashed border-white/10 px-3 py-4 text-center text-[11px] text-[#718391]">Hələ şərh yoxdur</div>}
            </div>
            <form onSubmit={onSubmitComment} className="mt-3 flex flex-col sm:flex-row gap-2"><textarea value={commentBody} onChange={(event) => setCommentBody(event.target.value)} rows={2} maxLength={2000} placeholder="Bu sifariş haqqında qeyd yaz..." className="min-w-0 flex-1 resize-none rounded-lg border border-white/10 bg-[#07121B] px-3 py-2.5 text-xs text-[#E8EEF2] outline-none focus:border-[#D78A4A]" /><button type="submit" disabled={!commentBody.trim()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#D78A4A] px-3.5 py-2.5 text-xs font-bold text-[#1B1713] disabled:cursor-not-allowed disabled:opacity-40"><Send size={14} /> Yaz</button></form>
          </div>
          <div className="grid sm:grid-cols-2 gap-3"><div className="rounded-lg bg-white/[.035] border border-white/[.07] p-3"><div className="text-[10px] uppercase tracking-[.12em] text-[#6E808D]">Yaradılma tarixi</div><div className="text-xs text-[#D4DDE2] mt-1.5 flex items-center gap-2"><CalendarDays size={13} className="text-[#D78A4A]" />{formatDate(order.createdAt)}</div></div><div className="rounded-lg bg-white/[.035] border border-white/[.07] p-3"><div className="text-[10px] uppercase tracking-[.12em] text-[#6E808D]">Sifariş statusu</div><div className="text-xs text-[#D4DDE2] mt-1.5 flex items-center gap-2"><PackageCheck size={13} className="text-[#7FA98B]" />{col.label}</div></div></div>
        </div>
        <div className="px-4 sm:px-6 py-4 bg-[#0A1722] border-t border-white/[.08] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3"><span className="text-[11px] text-[#697B87] flex items-center gap-1.5"><ShieldCheck size={13} /> Sifariş silinməzdir</span>{canEdit(user) && <button onClick={onEdit} className="inline-flex items-center justify-center gap-2 bg-[#D78A4A] hover:bg-[#E49A5A] text-[#1B1713] px-3.5 py-2 rounded-lg text-xs font-bold"><Pencil size={14} /> Redaktə et</button>}</div>
      </div>
    </div>
  );
}
'''
new_text, count = re.subn(r'function OrderModal\([\s\S]*?\nasync function compressImage', replacement + '\nasync function compressImage', text, count=1)
if count != 1:
    raise SystemExit(f'OrderModal replacement count={count}')
path.write_text(new_text)
