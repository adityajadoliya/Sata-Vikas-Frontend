import React from 'react';

const HR_KEYS = ['hr1', 'hr2', 'hr3', 'hr4', 'hr5', 'hr6', 'hr7', 'hr8', 'hr9', 'hr10', 'hr11', 'hr12', 'hr13', 'total'];

export default function ProductionGrid({ data = {}, editable = false, onChange }) {
  const isToolHandover = data?.formType === 'tool-handover';
  const uphValues = data.uphValues || {};
  const part1Prod = data.part1Production || {};
  const part1Cast = data.part1CastingRej || {};
  const part1Mach = data.part1MachiningRej || {};
  const part1Unp  = data.part1UnprocessedRej || {};

  const part2Prod = data.part2Production || {};
  const part2Cast = data.part2CastingRej || {};
  const part2Mach = data.part2MachiningRej || {};
  const part2Unp  = data.part2UnprocessedRej || {};

  const update = (field, value) => {
    if (onChange) onChange({ ...data, [field]: value });
  };

  const updateGridCell = (sectionKey, hrKey, value) => {
    if (!onChange) return;
    if (sectionKey === 'uphValues') {
      const updated = {
        ...data,
        uphValues: { ...uphValues, [hrKey]: value },
        uph: hrKey === 'hr1' ? value : (data.uph || value),
      };
      onChange(updated);
    } else {
      const sectionData = data[sectionKey] || {};
      const updated = {
        ...data,
        [sectionKey]: { ...sectionData, [hrKey]: value },
      };
      onChange(updated);
    }
  };

  const renderCellInput = (value, onCellChange, isHighlight = false, isBold = false) => {
    if (editable) {
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onCellChange(e.target.value)}
          className={`form-cell-input text-center text-xs ${isHighlight ? 'font-bold text-indigo-700 dark:text-indigo-300' : 'font-medium'}`}
        />
      );
    }
    return (
      <span className={`text-xs ${isBold ? 'font-bold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-800 dark:text-slate-200'} ${isHighlight ? 'font-bold text-indigo-800 dark:text-indigo-200' : ''}`}>
        {value !== undefined && value !== null && value !== '' ? value : ''}
      </span>
    );
  };

  const hasPart2Data = data.partNo2 || data.plan2 ||
    Object.values(part2Prod).some(v => v && v !== '');

  return (
    <>
      {/* ── ROW 1: Part No1: [partNo1]  Plan : [plan1]  + UPH / Planned Hourly target cells ── */}
      <tr className="bg-slate-50/80 dark:bg-slate-800/40">
        <td colSpan={2} className="form-label-cell px-2 py-1 border border-slate-400 dark:border-slate-600">
          <div className="flex items-center gap-2 text-[10px]">
            <span className="font-bold text-slate-900 dark:text-slate-100">Part No1:</span>
            {editable ? (
              <input
                type="text"
                value={data.partNo1 || ''}
                onChange={(e) => update('partNo1', e.target.value)}
                placeholder="Part #"
                className="form-cell-input font-bold w-20 text-xs px-1 py-0.5"
              />
            ) : (
              <span className="font-bold text-slate-900 dark:text-slate-100">{data.partNo1 || '—'}</span>
            )}

            <span className="font-bold text-slate-700 dark:text-slate-300 ml-3">Plan :</span>
            {editable ? (
              <input
                type="text"
                value={data.plan1 || ''}
                onChange={(e) => update('plan1', e.target.value)}
                placeholder="Qty"
                className="form-cell-input w-12 text-xs px-1 py-0.5"
              />
            ) : (
              <span className="font-semibold text-slate-800 dark:text-slate-200">{data.plan1 || ''}</span>
            )}
          </div>
        </td>
        <td className="form-cell border border-slate-400 dark:border-slate-600 text-center bg-slate-50/50 dark:bg-slate-800/30 font-bold text-[10px]"></td>
        {/* Hour cells for UPH target values */}
        {HR_KEYS.map((hrKey) => (
          <td key={`uph-${hrKey}`} className={`form-cell border border-slate-400 dark:border-slate-600 text-center ${hrKey === 'total' ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>
            {renderCellInput(uphValues[hrKey], (val) => updateGridCell('uphValues', hrKey, val), true, true)}
          </td>
        ))}
      </tr>

      {/* ── ROW 2: Actual Production - Production : ── */}
      <tr>
        <td colSpan={2} className="form-label-cell px-2 py-1 font-bold text-[10px] text-slate-900 dark:text-slate-100 border border-slate-400 dark:border-slate-600 bg-indigo-50/50 dark:bg-indigo-950/40">
          Actual Production - Production :
        </td>
        <td className="form-cell border border-slate-400 dark:border-slate-600 text-center bg-indigo-50/30 dark:bg-indigo-950/30"></td>
        {HR_KEYS.map((hrKey) => (
          <td key={`prod1-${hrKey}`} className={`form-cell border border-slate-400 dark:border-slate-600 text-center bg-indigo-50/30 dark:bg-indigo-950/30 ${hrKey === 'total' ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''}`}>
            {renderCellInput(part1Prod[hrKey], (val) => updateGridCell('part1Production', hrKey, val), false, true)}
          </td>
        ))}
      </tr>

      {/* ── ROWS 3, 4, 5: REJECTION section for Part 1 with vertical "REJECTION" side label ── */}
      {!isToolHandover && (
        <>
          {/* Row 3: Casting Rejection */}
          <tr>
            <td rowSpan={3} className="border border-slate-400 dark:border-slate-600 bg-slate-100/90 dark:bg-slate-800/90 text-center font-bold text-[9px] uppercase text-slate-700 dark:text-slate-300 [writing-mode:vertical-lr] rotate-180 py-1 w-6 align-middle">
              REJECTION
            </td>
            <td className="form-label-cell px-2 py-1 text-[10px] border border-slate-400 dark:border-slate-600">
              <span className="truncate text-slate-900 dark:text-slate-100">Casting Rejection for part 1</span>
            </td>
            <td className="border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center font-semibold text-[9px] text-slate-700 dark:text-slate-300 py-0.5">
              Nos
            </td>
            {HR_KEYS.map((hrKey) => (
              <td key={`cast1-${hrKey}`} className={`form-cell border border-slate-400 dark:border-slate-600 text-center ${hrKey === 'total' ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''}`}>
                {renderCellInput(part1Cast[hrKey], (val) => updateGridCell('part1CastingRej', hrKey, val))}
              </td>
            ))}
          </tr>

          {/* Row 4: Machining Rejection */}
          <tr>
            <td className="form-label-cell px-2 py-1 text-[10px] border border-slate-400 dark:border-slate-600">
              <span className="truncate text-slate-900 dark:text-slate-100">Machining Rejection for part 1</span>
            </td>
            <td className="border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center font-semibold text-[9px] text-slate-700 dark:text-slate-300 py-0.5">
              Nos
            </td>
            {HR_KEYS.map((hrKey) => (
              <td key={`mach1-${hrKey}`} className={`form-cell border border-slate-400 dark:border-slate-600 text-center ${hrKey === 'total' ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''}`}>
                {renderCellInput(part1Mach[hrKey], (val) => updateGridCell('part1MachiningRej', hrKey, val))}
              </td>
            ))}
          </tr>

          {/* Row 5: Unprocessed casting rejection */}
          <tr>
            <td className="form-label-cell px-2 py-1 text-[10px] border border-slate-400 dark:border-slate-600">
              <span className="truncate text-slate-900 dark:text-slate-100">Unprocessed casting rejection</span>
            </td>
            <td className="border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center font-semibold text-[9px] text-slate-700 dark:text-slate-300 py-0.5">
              Nos
            </td>
            {HR_KEYS.map((hrKey) => (
              <td key={`unp1-${hrKey}`} className={`form-cell border border-slate-400 dark:border-slate-600 text-center ${hrKey === 'total' ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''}`}>
                {renderCellInput(part1Unp[hrKey], (val) => updateGridCell('part1UnprocessedRej', hrKey, val))}
              </td>
            ))}
          </tr>
        </>
      )}

      {/* ── PART NO 2 SECTION (always rendered on Page A matching pre-printed physical form) ── */}
      {!isToolHandover && (
        <>
          {/* Row 6: Part No2: [partNo2]  Plan : [plan2] */}
          <tr className="bg-slate-50/60 dark:bg-slate-800/30">
            <td colSpan={2} className="form-label-cell px-2 py-1 border border-slate-400 dark:border-slate-600">
              <div className="flex items-center gap-2 text-[10px]">
                <span className="font-bold text-slate-900 dark:text-slate-100">Part No2:</span>
                {editable ? (
                  <input
                    type="text"
                    value={data.partNo2 || ''}
                    onChange={(e) => update('partNo2', e.target.value)}
                    placeholder="Part #"
                    className="form-cell-input font-bold w-20 text-xs px-1 py-0.5"
                  />
                ) : (
                  <span className="font-bold text-slate-900 dark:text-slate-100">{data.partNo2 || ''}</span>
                )}

                <span className="font-bold text-slate-700 dark:text-slate-300 ml-3">Plan :</span>
                {editable ? (
                  <input
                    type="text"
                    value={data.plan2 || ''}
                    onChange={(e) => update('plan2', e.target.value)}
                    placeholder="Qty"
                    className="form-cell-input w-12 text-xs px-1 py-0.5"
                  />
                ) : (
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{data.plan2 || ''}</span>
                )}
              </div>
            </td>
            <td className="form-cell border border-slate-400 dark:border-slate-600 text-center bg-slate-50/50 dark:bg-slate-800/30"></td>
            {HR_KEYS.map((hrKey) => (
              <td key={`part2-uph-${hrKey}`} className="form-cell border border-slate-400 dark:border-slate-600 text-center">
                {renderCellInput(data.part2UphValues?.[hrKey], (val) => updateGridCell('part2UphValues', hrKey, val))}
              </td>
            ))}
          </tr>

          {/* Row 7: Actual Production - Production (Part 2) */}
          <tr>
            <td colSpan={2} className="form-label-cell px-2 py-1 font-bold text-[10px] text-slate-900 dark:text-slate-100 border border-slate-400 dark:border-slate-600 bg-indigo-50/30 dark:bg-indigo-950/20">
              Actual Production - Production :
            </td>
            <td className="form-cell border border-slate-400 dark:border-slate-600 text-center bg-indigo-50/20 dark:bg-indigo-950/20"></td>
            {HR_KEYS.map((hrKey) => (
              <td key={`prod2-${hrKey}`} className={`form-cell border border-slate-400 dark:border-slate-600 text-center ${hrKey === 'total' ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''}`}>
                {renderCellInput(part2Prod[hrKey], (val) => updateGridCell('part2Production', hrKey, val), false, true)}
              </td>
            ))}
          </tr>

          {/* Rows 8, 9, 10: Part 2 Rejection rows with vertical REJECTION label */}
          <tr>
            <td rowSpan={3} className="border border-slate-400 dark:border-slate-600 bg-slate-100/90 dark:bg-slate-800/90 text-center font-bold text-[9px] uppercase text-slate-700 dark:text-slate-300 [writing-mode:vertical-lr] rotate-180 py-1 w-6 align-middle">
              REJECTION
            </td>
            <td className="form-label-cell px-2 py-1 text-[10px] border border-slate-400 dark:border-slate-600">
              <span className="truncate text-slate-900 dark:text-slate-100">Casting Rejection for part 2</span>
            </td>
            <td className="border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center font-semibold text-[9px] text-slate-700 dark:text-slate-300 py-0.5">
              Nos
            </td>
            {HR_KEYS.map((hrKey) => (
              <td key={`cast2-${hrKey}`} className={`form-cell border border-slate-400 dark:border-slate-600 text-center ${hrKey === 'total' ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''}`}>
                {renderCellInput(part2Cast[hrKey], (val) => updateGridCell('part2CastingRej', hrKey, val))}
              </td>
            ))}
          </tr>

          {/* Row 9: Machining Rejection Part 2 */}
          <tr>
            <td className="form-label-cell px-2 py-1 text-[10px] border border-slate-400 dark:border-slate-600">
              <span className="truncate text-slate-900 dark:text-slate-100">Machining Rejection for part 2</span>
            </td>
            <td className="border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center font-semibold text-[9px] text-slate-700 dark:text-slate-300 py-0.5">
              Nos
            </td>
            {HR_KEYS.map((hrKey) => (
              <td key={`mach2-${hrKey}`} className={`form-cell border border-slate-400 dark:border-slate-600 text-center ${hrKey === 'total' ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''}`}>
                {renderCellInput(part2Mach[hrKey], (val) => updateGridCell('part2MachiningRej', hrKey, val))}
              </td>
            ))}
          </tr>

          {/* Row 10: Unprocessed casting rejection Part 2 */}
          <tr>
            <td className="form-label-cell px-2 py-1 text-[10px] border border-slate-400 dark:border-slate-600">
              <span className="truncate text-slate-900 dark:text-slate-100">Unprocessed casting rejection</span>
            </td>
            <td className="border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center font-semibold text-[9px] text-slate-700 dark:text-slate-300 py-0.5">
              Nos
            </td>
            {HR_KEYS.map((hrKey) => (
              <td key={`unp2-${hrKey}`} className={`form-cell border border-slate-400 dark:border-slate-600 text-center ${hrKey === 'total' ? 'bg-slate-100 dark:bg-slate-800 font-bold' : ''}`}>
                {renderCellInput(part2Unp[hrKey], (val) => updateGridCell('part2UnprocessedRej', hrKey, val))}
              </td>
            ))}
          </tr>
        </>
      )}

      {/* ── ROW 11: Supervisor Name / Shift In-charge Name / PDI OK-Part 1 / Part 2 ── */}
      <tr>
        <td colSpan={3} className="border border-slate-400 dark:border-slate-600 px-2 py-1 bg-slate-100/70 dark:bg-slate-800/70">
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">Supervisor Name :</span>
            {editable ? (
              <input
                type="text"
                value={data.supervisorName || ''}
                onChange={(e) => update('supervisorName', e.target.value)}
                className="form-cell-input text-left font-bold text-slate-900 dark:text-slate-100"
              />
            ) : (
              <span className="font-bold text-blue-700 dark:text-blue-300 text-xs">{data.supervisorName || '—'}</span>
            )}
          </div>
        </td>

        <td colSpan={8} className="border border-slate-400 dark:border-slate-600 px-2 py-1 bg-slate-100/70 dark:bg-slate-800/70">
          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">Shift In-charge Name :</span>
            {editable ? (
              <input
                type="text"
                value={data.shiftIncharge || ''}
                onChange={(e) => update('shiftIncharge', e.target.value)}
                className="form-cell-input text-left font-bold text-slate-900 dark:text-slate-100"
              />
            ) : (
              <span className="font-bold text-blue-700 dark:text-blue-300 text-xs">{data.shiftIncharge || '—'}</span>
            )}
          </div>
        </td>

        <td colSpan={6} className="border border-slate-400 dark:border-slate-600 px-2 py-1 bg-slate-100/70 dark:bg-slate-800/70">
          <div className="flex items-center justify-between gap-2 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">PDI OK-Part 1:</span>
              {editable ? (
                <input
                  type="text"
                  value={data.pdiOkPart1 || ''}
                  onChange={(e) => update('pdiOkPart1', e.target.value)}
                  className="form-cell-input w-14 text-center font-semibold"
                />
              ) : (
                <span className="font-bold text-slate-900 dark:text-slate-100">{data.pdiOkPart1 || '—'}</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">Part 2:</span>
              {editable ? (
                <input
                  type="text"
                  value={data.pdiOkPart2 || ''}
                  onChange={(e) => update('pdiOkPart2', e.target.value)}
                  className="form-cell-input w-14 text-center font-semibold"
                />
              ) : (
                <span className="font-bold text-slate-900 dark:text-slate-100">{data.pdiOkPart2 || '—'}</span>
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
}
