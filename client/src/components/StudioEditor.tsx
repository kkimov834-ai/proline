import { useState, useRef } from "react";
import { Check, X, Plus, Settings, Trash2, ClipboardList, Box, Activity, Clock, List, Layout, ToggleLeft, Hash, Type, AlignLeft, Calendar } from "lucide-react";
type ColumnId = "orders" | "production" | "polishing" | "paint" | "warehouse";

export type StudioColumn = { id: string; sourceId?: ColumnId; label: string; detail: string; color: string; visible: boolean };
export type StudioMetric = { id: string; label: string; metric: "active" | "completed" | "urgent" | "today"; visible: boolean };
export type WorkspaceConfig = { columns: StudioColumn[]; metrics: StudioMetric[]; auditPosition: "top" | "bottom" | "hidden" };

export function StudioEditor({
  initial, onSave, onClose, saving
}: {
  initial: WorkspaceConfig; saving?: boolean;
  onSave: (config: WorkspaceConfig) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [activeTab, setActiveTab] = useState<"add" | "properties">("add");
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ type: string; payload?: any } | null>(null);

  const fieldTypes = [
    { id: "short-text", label: "Short Text", icon: Type },
    { id: "long-text", label: "Long Text", icon: AlignLeft },
    { id: "number", label: "Number", icon: Hash },
    { id: "switch", label: "Switch", icon: ToggleLeft },
    { id: "date", label: "Date", icon: Calendar },
    { id: "date-time", label: "Date & Time", icon: Clock },
    { id: "selection", label: "Selection", icon: List },
    { id: "relation", label: "Relation", icon: Layout },
  ];

  function addColumn(label: string) {
    const newCol: StudioColumn = {
      id: `studio-${Date.now()}`,
      label: label,
      detail: "New Field",
      color: "#D78A4A",
      visible: true
    };
    setDraft(prev => ({ ...prev, columns: [...prev.columns, newCol] }));
    setSelectedColumn(newCol.id);
    setActiveTab("properties");
  }

  function handleDropOnBoard(e: React.DragEvent) {
    e.preventDefault();
    if (draggedItem?.type === "new-field") {
      addColumn(draggedItem.payload.label);
    }
    setDraggedItem(null);
  }

  const selectedColData = draft.columns.find(c => c.id === selectedColumn);

  return (
    <div className="fixed inset-0 z-[100] flex bg-[#0F1722] text-[#E8EEF2] font-sans">
      <div className="flex-1 flex flex-col bg-[#0F1722]">
        <header className="h-[60px] flex-none border-b border-white/10 flex items-center justify-between px-6 bg-[#16202A]">
          <div className="flex items-center gap-6 text-sm text-[#AAB9C4] font-medium">
            <span className="text-white">Views</span>
            <span>Reports</span>
            <span>Automations</span>
            <span>Actions</span>
            <span>Webhooks</span>
            <span>Access Control</span>
            <span>Filter Rules</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 text-xs text-[#AAB9C4] hover:text-white px-3 py-1.5"><X size={14}/> Sifirla</button>
            <button 
              onClick={() => onSave(draft)}
              className="flex items-center gap-2 bg-[#3E80E5] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#2c65bc] transition"
            >
              <Check size={16} /> Save Global (Studio)
            </button>
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/20 text-sm font-medium hover:bg-white/5">Close</button>
          </div>
        </header>
        
        <div 
          className="flex-1 overflow-auto p-8"
          onDragOver={e => e.preventDefault()}
          onDrop={handleDropOnBoard}
        >
          <div className="text-sm font-bold uppercase tracking-[.15em] text-[#70818E] mb-6">C?DV?L SÜTUNLARININ ÖNIZL?M?SI</div>
          
          <div className="flex gap-4 items-start">
            {draft.columns.map(col => (
              <div 
                key={col.id} 
                onClick={() => {
                  setSelectedColumn(col.id);
                  setActiveTab("properties");
                }}
                className={`w-[280px] flex-none rounded-xl bg-[#16202A] border transition-all cursor-pointer ${selectedColumn === col.id ? 'border-[#3E80E5] shadow-[0_0_0_2px_rgba(62,128,229,.2)]' : 'border-white/10 hover:border-white/30'}`}
              >
                <div className="px-4 py-4 border-b border-white/[.08]" style={{ borderTop: `2px solid ${col.color}` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="h-8 w-8 rounded-lg bg-white/[.055] flex items-center justify-center" style={{ color: col.color }}>
                         <List size={16} />
                      </span>
                      <div>
                        <div className="font-display font-bold text-sm text-white">{col.label}</div>
                        <div className="text-[10px] uppercase tracking-[.12em] text-[#70818E] mt-0.5">{col.detail}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 h-[120px] flex items-center justify-center border-t border-white/5 bg-white/[.01]">
                   <div className="text-xs text-[#536571]">Empty contents</div>
                </div>
              </div>
            ))}

            <div 
              className={`w-[280px] h-[200px] flex-none rounded-xl border-2 border-dashed flex items-center justify-center text-sm font-medium transition ${draggedItem ? 'border-[#3E80E5] bg-[#3E80E5]/5 text-[#3E80E5]' : 'border-white/20 text-[#70818E]'}`}
            >
              Sah?l?ri bura sürükl?y?r?k<br/>c?dv?l? sütun ?lav? edin
            </div>
          </div>
          
          <div className="mt-12 text-sm font-bold uppercase tracking-[.15em] text-[#70818E] mb-6">M?LUMAT KARTLARI ÖNIZL?M?SI</div>
          <div className="flex flex-wrap gap-4">
             {draft.metrics.map(m => (
               <div key={m.id} className="relative group p-4 bg-[#16202A] border border-white/10 rounded-xl min-w-[200px]">
                 <div className="text-xs text-[#70818E] mb-1">{m.label}</div>
                 <div className="text-2xl font-bold">12</div>
                 <button 
                   onClick={() => setDraft(v => ({...v, metrics: v.metrics.filter(x => x.id !== m.id)}))}
                   className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition"
                 >
                    <Trash2 size={14}/>
                 </button>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="w-[300px] flex-none border-l border-white/10 bg-[#16202A] flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#70818E] mb-1">GÖRÜNÜS SEÇICI</div>
          <select className="w-full bg-[#0C141C] border border-white/10 rounded-lg p-2 text-sm text-white outline-none">
            <option>List View</option>
            <option>Board View</option>
          </select>
        </div>
        
        <div className="flex border-b border-white/10">
          <button 
            className={`flex-1 p-3 text-xs font-bold uppercase tracking-[.1em] border-b-2 transition ${activeTab === "add" ? "border-[#D78A4A] text-[#D78A4A]" : "border-transparent text-[#70818E]"}`}
            onClick={() => setActiveTab("add")}
          >
            + ADD
          </button>
          <button 
            className={`flex-1 p-3 text-xs font-bold uppercase tracking-[.1em] border-b-2 transition ${activeTab === "properties" ? "border-[#D78A4A] text-[#D78A4A]" : "border-transparent text-[#70818E]"}`}
            onClick={() => setActiveTab("properties")}
          >
            PROPERTIES
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "add" && (
            <div className="space-y-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#70818E] mb-3">FIELDS</div>
                <div className="grid grid-cols-2 gap-2">
                  {fieldTypes.map(ft => (
                    <div 
                      key={ft.id}
                      draggable
                      onDragStart={() => setDraggedItem({ type: "new-field", payload: ft })}
                      onDragEnd={() => setDraggedItem(null)}
                      onClick={() => addColumn(ft.label)}
                      className="flex items-center gap-2 p-3 rounded-lg border border-white/10 bg-[#0C141C] hover:bg-white/5 cursor-grab active:cursor-grabbing transition"
                    >
                      <ft.icon size={14} className="text-[#3E80E5]" />
                      <span className="text-xs">{ft.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#70818E] mb-3">LAYOUT</div>
                <div className="grid grid-cols-2 gap-2">
                   <div className="flex items-center gap-2 p-3 rounded-lg border border-white/10 bg-[#0C141C] cursor-not-allowed opacity-50">
                     <Layout size={14} className="text-[#3E80E5]" />
                     <span className="text-xs">Card Panel</span>
                   </div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#70818E] mb-3">METRICS</div>
                <button onClick={() => setDraft(v => ({ ...v, metrics: [...v.metrics, { id: `metric-${Date.now()}`, label: "Yeni Kart", metric: "active", visible: true }] }))} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-white/20 hover:border-white/40 text-xs text-[#AAB9C4] transition">
                  <Plus size={14} /> Add Metric Card
                </button>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#70818E] mb-3">AUDIT LOG</div>
                <select 
                  value={draft.auditPosition} 
                  onChange={e => setDraft(v => ({ ...v, auditPosition: e.target.value as any }))}
                  className="w-full bg-[#0C141C] border border-white/10 rounded-lg p-2 text-sm text-white"
                >
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "properties" && selectedColData && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[.15em] text-[#70818E] mb-1.5 block">Sütun Adi</label>
                <input 
                  type="text"
                  value={selectedColData.label}
                  onChange={e => {
                    const val = e.target.value;
                    setDraft(prev => ({
                      ...prev,
                      columns: prev.columns.map(c => c.id === selectedColumn ? { ...c, label: val } : c)
                    }));
                  }}
                  className="w-full bg-[#0C141C] border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#D78A4A]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[.15em] text-[#70818E] mb-1.5 block">Açiqlama</label>
                <input 
                  type="text"
                  value={selectedColData.detail}
                  onChange={e => {
                    const val = e.target.value;
                    setDraft(prev => ({
                      ...prev,
                      columns: prev.columns.map(c => c.id === selectedColumn ? { ...c, detail: val } : c)
                    }));
                  }}
                  className="w-full bg-[#0C141C] border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-[#D78A4A]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-[.15em] text-[#70818E] mb-1.5 block">R?ng</label>
                <input 
                  type="color"
                  value={selectedColData.color}
                  onChange={e => {
                    const val = e.target.value;
                    setDraft(prev => ({
                      ...prev,
                      columns: prev.columns.map(c => c.id === selectedColumn ? { ...c, color: val } : c)
                    }));
                  }}
                  className="w-full h-10 bg-[#0C141C] border border-white/10 rounded-lg p-1 outline-none"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-[#E8EEF2]">
                <input 
                  type="checkbox"
                  checked={selectedColData.visible}
                  onChange={e => {
                    const val = e.target.checked;
                    setDraft(prev => ({
                      ...prev,
                      columns: prev.columns.map(c => c.id === selectedColumn ? { ...c, visible: val } : c)
                    }));
                  }}
                  className="rounded bg-[#0C141C] border-white/10"
                />
                Görünür
              </label>
              
              <div className="pt-4 border-t border-white/10 mt-4">
                <button 
                  onClick={() => {
                    setDraft(prev => ({ ...prev, columns: prev.columns.filter(c => c.id !== selectedColumn) }));
                    setSelectedColumn(null);
                    setActiveTab("add");
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition text-sm font-bold"
                >
                  <Trash2 size={16} /> Sütunu Sil
                </button>
              </div>
            </div>
          )}

          {activeTab === "properties" && !selectedColData && (
            <div className="text-center text-[#70818E] text-sm py-10">
              Redakt? etm?k üçün sütun seçin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

