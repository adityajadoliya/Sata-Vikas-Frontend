import { OP_SLOTS, HOUR_LABELS } from '../../types/models';

export default function FormHeader({ data, editable, onChange }) {
  const update = (field, value) => {
    if (onChange) onChange({ ...data, [field]: value });
  };

  const machineByOp = data.machineNoByOperation || {};
  const machineForOperation = (slot) => {
    if (machineByOp[slot] !== undefined && machineByOp[slot] !== '') return machineByOp[slot];
    const op = String(data.operationNumber || '').trim();
    if (op === slot || (slot === '10' && (!op || op === '10'))) {
      return data.machineNo || '';
    }
    return '';
  };

  const updateMachineForOperation = (slot, val) => {
    if (!onChange) return;
    const nextMap = { ...machineByOp, [slot]: val };
    const primary = val || Object.values(nextMap).find(v => Boolean(v)) || '';
    onChange({
      ...data,
      machineNo: primary,
      machineNoByOperation: nextMap,
    });
  };

  const employeeByOp = data.employeeNoByOperation || {};
  const employeeForOperation = (slot) => {
    if (employeeByOp[slot] !== undefined && employeeByOp[slot] !== '') return employeeByOp[slot];
    const op = String(data.operationNumber || '').trim();
    if (op === slot || (slot === '10' && (!op || op === '10'))) {
      return data.employeeNumbers || data.employeeId || '';
    }
    return '';
  };

  const updateEmployeeForOperation = (slot, val) => {
    if (!onChange) return;
    const nextMap = { ...employeeByOp, [slot]: val };
    const primary = val || Object.values(nextMap).find(v => Boolean(v)) || '';
    onChange({
      ...data,
      employeeNumbers: primary,
      employeeId: primary,
      employeeNoByOperation: nextMap,
    });
  };

  const Cell = ({ value, field, width, placeholder }) => (
    editable && field === 'shift' ? (
      <select
        value={value || ''}
        onChange={(e) => update(field, e.target.value)}
        className="form-cell-input cursor-pointer font-bold"
        style={{ width: width || '100%' }}
      >
        <option value="">Select</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
    ) : editable ? (
      <input
        type={field === 'date' ? 'date' : 'text'}
        value={value || ''}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder || ''}
        className="form-cell-input"
        style={{ width: width || '100%' }}
      />
    ) : (
      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{value || '—'}</span>
    )
  );     
  
  return (
    <>
      {/* Row 1: Company + Title + Date & Shift */}
      <tr>
        <td className="form-cell-header text-left px-2" colSpan={3}>
          <div className="flex items-center gap-1.5 mb-1">
            <img src="/sata-vikas-logo.svg" alt="Logo" className="h-4 w-auto" />
            <div className="text-[9px] leading-tight font-semibold">
              <span className="text-slate-500 dark:text-slate-400">Page</span>{' '}
              <Cell value={data.page || 'A'} field="page" width="22px" />
            </div>
          </div>
          <div className="font-bold text-[10px] text-slate-800 dark:text-slate-200">SATA VIKAS INDIA P LTD, PALWAL</div>
        </td>
        <td className="form-cell-header text-center font-bold text-sm sm:text-base text-indigo-800 dark:text-indigo-300" colSpan={11}>
          Hourly Production Monitoring Book
        </td>
        <td className="form-cell-header px-2" colSpan={3}>
          <div className="flex flex-col gap-1 text-[10px]"> 
            <div className="flex items-center justify-between gap-1">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Date:</span>
              <Cell value={data.date} field="date" />
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Shift:</span> 
              <Cell value={data.shift} field="shift" width="55px" />
            </div>
          </div>
        </td>
      </tr>

      {/* Row 2: Operation Number slots + QA Cell */}
      <tr>
        <td className="form-label-cell" colSpan={3}>
          <div className="flex items-center gap-1">
            <span className="text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap">Operation Number :</span>
            <Cell value={data.operationNumber} field="operationNumber" width="70px" />
          </div>
        </td>
        {OP_SLOTS.map(slot => (
          <td key={slot} className="form-cell text-center bg-slate-50 dark:bg-slate-800/60 p-0.5">
            <div className="text-[9px] font-bold text-slate-600 dark:text-slate-300 leading-none">{slot}</div>
          </td>
        ))}
        <td className="form-cell px-2" colSpan={4}>
          <div className="flex items-center gap-1 text-[10px]">
            <span className="font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">QA Cell :</span>
            <div className="flex-1">
              <Cell value={data.qaCell} field="qaCell" placeholder="e.g. QA-Cell" />
            </div>
          </div>
        </td>
      </tr>

      {/* Row 3: Machine No with 10 - 100 hour columns */}
      <tr>
        <td className="form-label-cell" colSpan={3}>
          <span className="text-slate-600 dark:text-slate-400 font-semibold">Machine No :</span>
        </td>
        {OP_SLOTS.map(slot => (
          <td key={slot} className="form-cell text-center p-0.5">
            {editable ? (
              <input
                type="text"
                value={machineForOperation(slot)}
                onChange={(e) => updateMachineForOperation(slot, e.target.value)}
                placeholder=""
                className="form-cell-input text-center text-[9px] font-bold px-0.5"
              />
            ) : (
              <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100">
                {machineForOperation(slot)}
              </span>
            )}
          </td>
        ))}
        <td className="form-cell px-2" colSpan={4}>
          <div className="flex items-center gap-1 text-[10px]">
            <span className="font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">Part :</span>
            <div className="flex-1">
              <Cell value={data.partNo1} field="partNo1" placeholder="Part Number" />
            </div>
          </div>
        </td>
      </tr> 

      {/* Row 4: Employee Number with 10 - 100 hour columns */}
      <tr>
        <td className="form-label-cell" colSpan={3}>
          <span className="text-slate-600 dark:text-slate-400 font-semibold">Employee number :</span>
        </td>
        {OP_SLOTS.map(slot => (
          <td key={slot} className="form-cell text-center p-0.5">
            {editable ? (
              <input
                type="text"
                value={employeeForOperation(slot)}
                onChange={(e) => updateEmployeeForOperation(slot, e.target.value)}
                placeholder=""
                className="form-cell-input text-center text-[9px] font-bold px-0.5"
              />
            ) : (
              <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100">
                {employeeForOperation(slot)}
              </span>
            )}
          </td>
        ))}
        <td className="form-cell px-2 bg-slate-50/50 dark:bg-slate-800/30" colSpan={4} />
      </tr>

      {/* Row 5: Scheduled Quantity + Hour Header (UPH, H1 - H13, Total) */}
      <tr className="bg-slate-100 dark:bg-slate-800 text-center font-bold">
        <td className="form-label-cell text-[10px]" colSpan={2}>
          <div className="flex items-center gap-1 text-[10px]">
            <span className="whitespace-nowrap font-bold">Scheduled Quantity :</span>
            {editable ? (
              <input
                type="text"
                value={data.scheduledQuantity || ''}
                onChange={(e) => update('scheduledQuantity', e.target.value)}
                placeholder="Qty"
                className="form-cell-input font-bold text-slate-900 dark:text-slate-100 max-w-[65px] text-left"
              />
            ) : (
              <span className="font-bold text-slate-900 dark:text-slate-100 ml-1">{data.scheduledQuantity || '—'}</span>
            )}
          </div>
        </td>
        <td className="form-cell-header text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold p-1 text-center">
          UPH
        </td>
        {HOUR_LABELS.slice(1).map((lbl) => (
          <td key={lbl} className={`form-cell-header text-[10px] ${lbl === 'Total' ? 'bg-slate-200 dark:bg-slate-700 font-extrabold text-slate-900 dark:text-slate-100' : ''}`}>
            {lbl.replace(/^H(\d+)/, 'Hr$1')}
          </td>
        ))}
      </tr>
    </>
  );
}
