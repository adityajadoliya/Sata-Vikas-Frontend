export default function FormPageAFooter({ data = {}, editable = false, onChange }) {
  const update = (field, value) => {
    if (onChange) onChange({ ...data, [field]: value });
  };

  const CellInput = ({ value, onChange, placeholder = '', className = '' }) => (
    editable ? (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-transparent px-1.5 py-0.5 text-xs text-slate-900 dark:text-slate-100 outline-none border-b border-indigo-300 dark:border-indigo-700 focus:border-indigo-600 dark:focus:border-indigo-400 ${className}`}
      />
    ) : (
      <span className={`text-xs font-bold text-slate-900 dark:text-slate-100 ${className}`}>
        {value !== undefined && value !== null && value !== '' ? value : '—'}
      </span>
    )
  );

  return (
    <tr>
      <td colSpan={16} className="border border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800/90 p-2">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200">Entry person Name <span className="font-normal text-[10px] text-slate-500 dark:text-slate-400">(Write full name)</span> :</span>
            <CellInput value={data.entryPersonName} onChange={(val) => update('entryPersonName', val)} placeholder="Full Name" className="min-w-[140px]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200">Abnormality Parts - Tool change :</span>
            <CellInput value={data.abnormalityToolChange ?? data.abnormalityParts} onChange={(val) => update('abnormalityToolChange', val)} placeholder="Value" className="w-20 text-center font-bold text-indigo-700 dark:text-indigo-300" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-800 dark:text-slate-200">Other abnormality/Alarm :</span>
            <CellInput value={data.otherAbnormality} onChange={(val) => update('otherAbnormality', val)} placeholder="Value" className="w-24 text-center font-bold text-indigo-700 dark:text-indigo-300" />
          </div>
        </div>
      </td>
    </tr>
  );
}
