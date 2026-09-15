export default function FormHeader({ data, editable, onChange }) {
  const update = (field, value) => {
    if (onChange) onChange({ ...data, [field]: value });
  };

  const Cell = ({ value, field, width, placeholder }) => (
    editable ? (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder || ''}
        className="form-cell-input"
        style={{ width: width || '100%' }}
      />
    ) : (
      <span className="text-xs font-medium text-slate-900">{value || '—'}</span>
    )
  );

  // Total columns = 12 (2 label + 10 data: UPH + Hr1-Hr9 or Hr1-Hr9 + Total)

  return (
    <>
      {/* Row 1: Company + Title (kept unchanged) */}
      <tr>
        <td className="form-cell-header text-left px-2" colSpan={2}>
          <div className="flex items-center gap-1.5 mb-1">
            <img src="/sata-vikas-logo.svg" alt="Logo" className="h-4 w-auto" />
            <div className="text-[9px] leading-tight">
              <span className="text-slate-500">Page</span>{' '}
              <Cell value={data.page} field="page" width="20px" />
            </div>
          </div>
          <div className="font-bold text-[10px] text-slate-800">
            SATA VIKAS INDIA PVT LTD, PALWAL
          </div>
        </td>
        <td className="form-cell-header text-center font-bold text-sm text-indigo-800" colSpan={6}>
          Hourly Production Monitoring Book
        </td>
      </tr>

      {/* Integrated top‑right block */}
      <tr className="border-t border-slate-200">
        <td className="form-label-cell text-xs font-medium text-slate-500" rowSpan={4}>
          PDI
        </td>
        <td className="form-label-cell text-xs font-medium text-slate-500" rowSpan={4}>
          QA
        </td>
        <td className="form-label-cell text-xs font-medium text-slate-500">Date</td>
        <td className="form-cell" colSpan={6}>
          <Cell value={data.date} field="date" />
        </td>
      </tr>
      <tr className="border-t border-slate-200">
        <td className="form-label-cell text-xs font-medium text-slate-500">Shift</td>
        <td className="form-cell" colSpan={6}>
          <Cell value={data.shift} field="shift" />
        </td>
      </tr>
      <tr className="border-t border-slate-200">
        <td className="form-label-cell text-xs font-medium text-slate-500">Cell</td>
        <td className="form-cell" colSpan={6}>
          <Cell value={data.qaCell} field="qaCell" />
        </td>
      </tr>
      <tr className="border-t border-slate-200">
        <td className="form-label-cell text-xs font-medium text-slate-500">Part</td>
        <td className="form-cell" colSpan={6}>
          <Cell value={data.partNo1} field="partNo1" />
        </td>
      </tr>

      {/* Row 5: Scheduled Quantity + Hour Headers */}
      <tr>
        <td className="form-label-cell" colSpan={2}>Scheduled Quantity :</td>
        <td className="form-cell-header text-[10px]">UPH</td>
        <td className="form-cell-header text-[10px]">Hr1</td>
        <td className="form-cell-header text-[10px]">Hr2</td>
        <td className="form-cell-header text-[10px]">Hr3</td>
        <td className="form-cell-header text-[10px]">Hr4</td>
        <td className="form-cell-header text-[10px]">Hr5</td>
        <td className="form-cell-header text-[10px]">Hr6</td>
        <td className="form-cell-header text-[10px]">Hr7</td>
        <td className="form-cell-header text-[10px]">Hr8</td>
        <td className="form-cell-header text-[10px]">Hr9</td>
      </tr>
    </>
  );
}
