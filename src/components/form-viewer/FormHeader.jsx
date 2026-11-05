import { OP_SLOTS, HOUR_LABELS } from '../../types/models';

export const getFormASerialNumber = (data) => {
  if (data?.serialNo) return String(data.serialNo);
  if (data?.serialNumber) return String(data.serialNumber);
  if (data?.serial_no) return String(data.serial_no);

  if (data?.id !== undefined && data?.id !== null && data?.id !== '') {
    const numericId = parseInt(data.id, 10);
    if (!isNaN(numericId)) {
      if (numericId >= 1000) {
        return String(numericId).padStart(6, '0');
      }
      return String(7823 + numericId).padStart(6, '0');
    }
    return String(data.id).padStart(6, '0');
  }
  return '007824';
};

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

  const Cell = ({ value, field, width, placeholder, fallback = '—' }) => (
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
      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{value || fallback}</span>
    )
  );     
  
  return (
    <>
      {/* Row 1: Serial No + SATA VIKAS- Hourly Production Monitoring Book + Date */}
      <tr>
        <td className="form-cell-header text-center px-3 py-2 bg-slate-50 dark:bg-slate-800/80" colSpan={3}>
          {editable ? (
            <input
              type="text"
              value={data.serialNo !== undefined ? data.serialNo : getFormASerialNumber(data)}
              onChange={(e) => update('serialNo', e.target.value)}
              placeholder="000000"
              className="form-cell-input text-center font-mono font-bold text-sm sm:text-base text-red-600 dark:text-red-400 tracking-[0.2em]"
              style={{ width: '100%' }}
            />
          ) : (
            <span className="font-mono font-extrabold text-sm sm:text-base tracking-[0.22em] text-red-600 dark:text-red-400 select-all">
              {getFormASerialNumber(data)}
            </span>
          )}
        </td>
        <td className="form-cell-header text-center font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 tracking-wide px-3 py-2" colSpan={11}>
          SATA VIKAS- Hourly Production Monitoring Book
        </td>
        <td className="form-cell-header text-center font-bold text-slate-700 dark:text-slate-300 px-1 py-1 text-[10px] sm:text-xs whitespace-nowrap" colSpan={1}>
          Date:
        </td>
        <td className="form-cell-header px-1.5 py-1 text-center" colSpan={2}>
          <Cell value={data.date} field="date" />
        </td>
      </tr>

      {/* Row 2: Operation Number slots + PDI Shift */}
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
        <td className="form-cell text-center font-bold text-slate-700 dark:text-slate-300 text-[10px] bg-slate-50 dark:bg-slate-800/60 p-0.5">
          PDI
        </td>
        <td className="form-cell text-center font-bold text-slate-600 dark:text-slate-400 text-[10px] p-0.5 whitespace-nowrap">
          Shift :
        </td>
        <td className="form-cell px-1 text-center" colSpan={2}>
          <Cell value={data.shift} field="shift" width="55px" />
        </td>
      </tr>

      {/* Row 3: Zone + Machine No with 10 - 100 hour columns + QA Cell */}
      <tr>
        <td className="form-label-cell px-2" colSpan={3}>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <span className="text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap">Zone :</span>
              <Cell value={data.zone} field="zone" width="55px" placeholder="Zone" fallback="" />
            </div>
            <span className="text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap">Machine No :</span>
          </div>
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
        <td className="form-cell text-center font-bold text-slate-700 dark:text-slate-300 text-[10px] bg-slate-50 dark:bg-slate-800/60 p-0.5">
          QA
        </td>
        <td className="form-cell text-center font-bold text-slate-600 dark:text-slate-400 text-[10px] p-0.5 whitespace-nowrap">
          Cell :
        </td>
        <td className="form-cell px-1 text-center" colSpan={2}>
          <Cell value={data.qaCell} field="qaCell" placeholder="e.g. QA-Cell" />
        </td>
      </tr> 

      {/* Row 4: Employee Number with 10 - 100 hour columns + Part */}
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
        <td className="form-cell bg-slate-50/50 dark:bg-slate-800/30 p-0.5" />
        <td className="form-cell text-center font-bold text-slate-600 dark:text-slate-400 text-[10px] p-0.5 whitespace-nowrap">
          Part :
        </td>
        <td className="form-cell px-1 text-center" colSpan={2}>
          <Cell value={data.partNo1} field="partNo1" placeholder="Part Number" />
        </td>
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
