import React from 'react';

const HR_KEYS = ['hr1', 'hr2', 'hr3', 'hr4', 'hr5', 'hr6', 'hr7', 'hr8', 'hr9', 'hr10', 'hr11', 'hr12', 'hr13'];

const GROUP_COLORS = {
  'Break down (BD)': { bg: 'bg-white dark:bg-slate-900', border: 'border-l-red-500' },
  'Set up (ST)': { bg: 'bg-white dark:bg-slate-900', border: 'border-l-orange-500' },
  'Start up (SU)': { bg: 'bg-white dark:bg-slate-900', border: 'border-l-amber-500' },
  'Speed loss (MS)': { bg: 'bg-white dark:bg-slate-900', border: 'border-l-yellow-500' },
  'Waiting (MW)': { bg: 'bg-white dark:bg-slate-900', border: 'border-l-blue-500' },
  'Waiting (ML)': { bg: 'bg-white dark:bg-slate-900', border: 'border-l-blue-500' },
  'Delay (DL)': { bg: 'bg-white dark:bg-slate-900', border: 'border-l-purple-500' },
  'Oth.loss (OL)': { bg: 'bg-white dark:bg-slate-900', border: 'border-l-slate-400' },
  'Pl.loss (PL)': { bg: 'bg-white dark:bg-slate-900', border: 'border-l-teal-500' },
  'Pl.loss (PF)': { bg: 'bg-white dark:bg-slate-900', border: 'border-l-teal-500' },
};

export default function TPMLossGrid({ data = {}, editable = false, onChange }) {
  const tpmLosses = data.tpmLosses || [];

  const updateLossCell = (lossIdx, hrKey, value) => {
    if (!onChange) return;
    const updated = [...tpmLosses];
    updated[lossIdx] = {
      ...updated[lossIdx],
      hourlyValues: { ...updated[lossIdx].hourlyValues, [hrKey]: value },
    };
    onChange({ ...data, tpmLosses: updated });
  };

  const updateLossDetail = (lossIdx, field, value) => {
    if (!onChange) return;
    const updated = [...tpmLosses];
    updated[lossIdx] = { ...updated[lossIdx], [field]: value };
    onChange({ ...data, tpmLosses: updated });
  };

  // Group losses by their group field
  const groups = [];
  let currentGroup = null;
  tpmLosses.forEach((loss, idx) => {
    if (!currentGroup || currentGroup.name !== loss.group) {
      currentGroup = { name: loss.group, items: [] };
      groups.push(currentGroup);
    }
    currentGroup.items.push({ ...loss, originalIdx: idx });
  });

  // Calculate total losses per hour
  const hourTotals = {};
  HR_KEYS.forEach(hr => {
    hourTotals[hr] = tpmLosses.reduce((sum, loss) => {
      return sum + (parseInt(loss.hourlyValues?.[hr]) || 0);
    }, 0);
  });
  const grandTotal = Object.values(hourTotals).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* TPM Header */}
      <tr>
        <td className="border border-slate-400 dark:border-slate-600 bg-slate-800 dark:bg-slate-950 text-white font-bold text-[11px] px-2 py-1.5" colSpan={3}>
          TPM 16 Loss entry :
        </td>
        <td className="border border-slate-400 dark:border-slate-600 bg-slate-800 dark:bg-slate-950 text-center" colSpan={14}>
          <span className="text-[10px] text-amber-300 font-semibold">
            {'<<<Enter Loss time in Minute only & write machine number>>>'}
          </span>
        </td>
      </tr>

      {/* Loss Rows grouped with vertical side-label matching reference image */}
      {groups.map((group) => {
        const colors = GROUP_COLORS[group.name] || GROUP_COLORS['Oth.loss (OL)'];
        return group.items.map((loss, itemIdx) => {
          const hasData = HR_KEYS.some(hr => loss.hourlyValues?.[hr]);
          if (data?.formType === 'tool-handover' && !hasData) return null;

          return (
            <tr key={loss.originalIdx}>
              {/* Col 1: Code cell */}
              <td className="form-cell text-center text-[9px] font-bold w-7 border border-slate-400 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40">
                {editable ? (
                  <input
                    type="text"
                    value={loss.code || ''}
                    onChange={(e) => updateLossDetail(loss.originalIdx, 'code', e.target.value)}
                    className="form-cell-input text-center text-[9px]"
                  />
                ) : (
                  <span className="text-slate-800 dark:text-slate-200">{loss.code}</span>
                )}
              </td>

              {/* Col 2: Description cell */}
              <td className="form-label-cell text-[10px] px-1.5 py-0.5 border border-slate-400 dark:border-slate-600">
                {editable ? (
                  <input
                    type="text"
                    value={loss.description || ''}
                    onChange={(e) => updateLossDetail(loss.originalIdx, 'description', e.target.value)}
                    className="form-cell-input text-left text-[10px]"
                  />
                ) : (
                  <span className="text-slate-900 dark:text-slate-100 text-[9.5px] leading-tight font-medium whitespace-nowrap">
                    {loss.description}
                  </span>
                )}
              </td>

              {/* Col 3: Vertical Rotated Group Label — only rendered on first row of group */}
              {itemIdx === 0 && (
                <td
                  rowSpan={group.items.length}
                  className="border border-slate-400 dark:border-slate-600 bg-slate-100/90 dark:bg-slate-800/90 text-center font-bold text-[9px] uppercase text-slate-700 dark:text-slate-300 [writing-mode:vertical-lr] rotate-180 py-1 px-0.5 w-6 align-middle"
                >
                  {group.name}
                </td>
              )}

              {/* Hourly cells */}
              {HR_KEYS.map(hr => (
                <td key={hr} className="form-cell text-center border border-slate-400 dark:border-slate-600">
                  {editable ? (
                    <input
                      type="text"
                      value={loss.hourlyValues?.[hr] || ''}
                      onChange={(e) => updateLossCell(loss.originalIdx, hr, e.target.value)}
                      className="form-cell-input text-center text-xs font-bold text-red-600 dark:text-red-400"
                    />
                  ) : (
                    <span className={`text-xs ${loss.hourlyValues?.[hr] ? 'font-bold text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {loss.hourlyValues?.[hr] || ''}
                    </span>
                  )}
                </td>
              ))}

              {/* Total column for individual loss row */}
              <td className="form-cell border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40 text-center font-bold text-xs">
                {(() => {
                  const rowTotal = HR_KEYS.reduce((sum, hr) => {
                    const val = parseInt(loss.hourlyValues?.[hr]);
                    return !isNaN(val) ? sum + val : sum;
                  }, 0);
                  return rowTotal > 0 ? (
                    <span className="text-red-600 dark:text-red-400 font-bold text-xs">
                      {rowTotal}
                    </span>
                  ) : '';
                })()}
              </td>
            </tr>
          );
        });
      })}

      {/* TOTAL LOSSES ROW */}
      <tr className="bg-red-50/80 dark:bg-red-950/60 font-bold">
        <td className="border border-slate-400 dark:border-slate-600 bg-red-100/80 dark:bg-red-950 font-extrabold text-[11px] px-2 py-1 text-red-900 dark:text-red-200" colSpan={2}>
          TOTAL LOSSES :
        </td>
        <td className="border border-slate-400 dark:border-slate-600 bg-red-100/80 dark:bg-red-950 font-bold text-[10px] text-center text-red-900 dark:text-red-200">
          Min
        </td>
        {HR_KEYS.map(hr => (
          <td key={hr} className="form-cell border border-slate-400 dark:border-slate-600 bg-red-50 dark:bg-red-950/80 font-bold text-red-600 dark:text-red-400 text-xs text-center">
            {hourTotals[hr] !== undefined ? hourTotals[hr] : '0'}
          </td>
        ))}
        <td className="form-cell border border-slate-400 dark:border-slate-600 bg-red-100 dark:bg-red-900 font-extrabold text-red-700 dark:text-red-200 text-xs text-center">
          {grandTotal > 0 ? `${grandTotal}` : '0'}
        </td>
      </tr>
    </>
  );
}
