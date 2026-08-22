from pathlib import Path

path = Path('/home/ubuntu/proline/client/src/pages/Home.tsx')
text = path.read_text()
start = text.index('function SettingsPanel')
replacement = r'''function SettingsPanel({ templateId, setTemplateId, themeId, setThemeId, onExport, onClose }: { templateId: ExcelTemplateId; setTemplateId: (id: ExcelTemplateId) => void; themeId: ThemeId; setThemeId: (id: ThemeId) => void; onExport: (format: "csv" | "xls") => void; onClose: () => void }) {
  const activeTheme = themePresets.find((theme) => theme.id === themeId) || themePresets[0];
  const [themesOpen, setThemesOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);

  return <div className="fixed inset-0 z-[60] bg-[#02070B]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div className="w-full max-w-2xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-white/10 bg-[#0D1C29] proline-theme-surface shadow-2xl">
      <div className="flex items-start justify-between gap-4 border-b border-white/[.08] px-4 sm:px-6 py-4 sm:py-5">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] font-bold proline-theme-accent"><Settings size={13} /> Sistem ayarları</div>
          <h2 className="font-display text-xl sm:text-2xl font-bold mt-2">PROLINE Settings</h2>
          <p className="text-xs leading-5 text-[#B7C3CB] mt-2 max-w-lg">Tema və Excel çıxış seçimlərini buradan idarə edin.</p>
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

        <section className="rounded-xl border border-white/[.1] overflow-hidden">
          <button type="button" aria-expanded={templatesOpen} onClick={() => setTemplatesOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-white/[.04]">
            <span><span className="block text-[10px] uppercase tracking-[.14em] font-bold text-[#AAB9C4]">Excel çıxış şablonu</span><span className="block text-xs text-[#AAB9C4] mt-1">Məlumatların hansı formatda çıxacağını seçin.</span></span>
            <span className="flex items-center gap-2 text-xs text-[#E8EEF2]"><span className="max-w-[130px] truncate">{templatesOpen ? "Bağla" : excelTemplates.find((template) => template.id === templateId)?.name}</span><ChevronDown size={15} className={`transition-transform ${templatesOpen ? "rotate-180" : ""}`} /></span>
          </button>
          {templatesOpen && <div className="border-t border-white/[.08] p-3"><div className="space-y-3">{excelTemplates.map((template) => <button key={template.id} type="button" onClick={() => setTemplateId(template.id)} aria-pressed={templateId === template.id} className={`w-full text-left rounded-xl border p-4 transition ${templateId === template.id ? "border-white/30" : "border-white/[.1] hover:border-white/25"}`} style={templateId === template.id ? { borderColor: activeTheme.accent, background: activeTheme.glow } : undefined}><div className="flex items-start gap-3"><span className="mt-0.5 h-5 w-5 rounded-full border flex items-center justify-center shrink-0" style={templateId === template.id ? { borderColor: activeTheme.accent, backgroundColor: activeTheme.accent, color: "#101820" } : { borderColor: "rgba(255,255,255,.25)" }}>{templateId === template.id && <Check size={13} />}</span><span className="min-w-0"><span className="block text-sm font-semibold text-[#F1F5F7]">{template.name}</span><span className="block text-xs leading-5 text-[#B7C3CB] mt-1">{template.description}</span><span className="block text-[10px] leading-4 text-[#C5D0D6] mt-2">Sütunlar: {template.fields.join(" · ")}</span></span></div></button>)}</div></div>}
        </section>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/[.08] bg-[#0A1722] px-4 sm:px-6 py-4">
        <span className="text-[11px] text-[#AAB9C4]">Aktiv: <strong className="proline-theme-accent">{excelTemplates.find((template) => template.id === templateId)?.name}</strong></span>
        <div className="flex flex-col sm:flex-row gap-2"><button onClick={() => onExport("csv")} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 px-3.5 py-2.5 text-xs font-bold text-[#E0E8EC] hover:bg-white/5"><Download size={14} /> CSV çıxart</button><button onClick={() => onExport("xls")} className="inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-bold text-[#101820] proline-theme-button"><Download size={14} /> Excel çıxart</button></div>
      </div>
    </div>
  </div>;
}
'''
path.write_text(text[:start] + replacement)

