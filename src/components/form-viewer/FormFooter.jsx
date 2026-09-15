import React from 'react';
import { OPN_DEFECT_OPERATIONS } from '../../types/models';

export default function FormFooter({ data = {}, editable = false, onChange }) {
  const update = (field, value) => {
    if (onChange) onChange({ ...data, [field]: value });
  };

  const updateOpnDefect = (index, field, value) => {
    if (!onChange) return;
    const current = data.opnDefects || OPN_DEFECT_OPERATIONS.map(op => ({ opn: op, mr: '', cr: '' }));
    const updated = [...current];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, opnDefects: updated });
  };

  const updateMaterialAbnormality = (index, field, value) => {
    if (!onChange) return;
    const current = data.materialAbnormalities || [
      { op: 'Op#10', abnormality: '', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', total: '' },
      { op: 'Op#20', abnormality: '', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', total: '' },
      { op: 'Op#30', abnormality: '', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', total: '' },
      { op: 'Op#40', abnormality: '', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', total: '' },
      { op: 'Op#50', abnormality: '', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', total: '' },
      { op: 'Op#60', abnormality: '', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', total: '' },
      { op: 'Op#70', abnormality: '', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', total: '' },
    ];
    const updated = [...current];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, materialAbnormalities: updated });
  };

  const rawMaterialAbnormalities = data.materialAbnormalities || [
    { op: 'Op#10', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
    { op: 'Op#20', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
    { op: 'Op#30', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
    { op: 'Op#40', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
    { op: 'Op#50', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
    { op: 'Op#60', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
    { op: 'Op#70', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', totFopPart: '', total: '' },
  ];
  const materialAbnormalities = rawMaterialAbnormalities.map(row => ({
    ...row,
    abnormality1: row.abnormality1 ?? row.abnormality ?? '',
    abnormality2: row.abnormality2 ?? '',
    abnormality3: row.abnormality3 ?? '',
    abnormality4: row.abnormality4 ?? '',
  }));

  const totalMR = opnDefects.reduce((acc, curr) => acc + (Number(curr.mr) || 0), 0);
  const totalCR = opnDefects.reduce((acc, curr) => acc + (Number(curr.cr) || 0), 0);

  const CellInput = ({ value, onChange, placeholder = '', className = '' }) => (
    editable ? (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`form-footer-input w-full bg-transparent px-1 py-0.5 text-[10px] sm:text-xs text-slate-900 dark:text-slate-100 outline-none focus:bg-indigo-50 dark:focus:bg-indigo-950/50 ${className}`}
      />
    ) : (
      <span className={`text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 ${className}`}>
        {value !== undefined && value !== null && value !== '' ? value : '—'}
      </span>
    )
  );

  return (
    <tr>
      <td colSpan={12} className="p-0 border-t-2 border-slate-500 bg-white dark:bg-slate-900">
        <table className="tool-handover-footer w-full table-fixed border-collapse text-[10px] leading-tight text-slate-800 dark:text-slate-200">
          <colgroup>
            {/* Left section: 33% */}
            <col style={{ width: '33%' }} />
            {/* Middle section: 13% (4.33% + 4.33% + 4.34%) */}
            <col style={{ width: '4.33%' }} />
            <col style={{ width: '4.33%' }} />
            <col style={{ width: '4.34%' }} />
            {/* Right section: 54% (8% + 4*8% + 14%) */}
            <col style={{ width: '8%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '14%' }} />
          </colgroup>
          <tbody>
            {/* Row 0: Section Headers */}
            <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-[10.5px]">
              <td className="border border-slate-400 dark:border-slate-600 px-2 py-1 text-slate-900 dark:text-slate-100">
                Shift communication / Remark :
              </td>
              <td colSpan={3} className="border border-slate-400 dark:border-slate-600 px-1 py-1 text-center whitespace-nowrap text-slate-900 dark:text-slate-100">
                Opn# defect/Sh :
              </td>
              <td colSpan={6} className="border border-slate-400 dark:border-slate-600 px-2 py-1 text-slate-900 dark:text-slate-100">
                Material &amp; Tool related communication
              </td>
            </tr>

            {/* Row 1: Section Sub-headers */}
            <tr className="text-[10px]">
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-800/40 px-2 py-0.5 font-bold text-slate-800 dark:text-slate-200">
                PDI OK parts for shift (PDI Insp. to write)
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 py-0.5 text-center font-bold">
                Opn#
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 py-0.5 text-center font-bold">
                MR
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 py-0.5 text-center font-bold">
                CR
              </td>
              <td colSpan={5} className="border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5">
                <div className="flex items-center gap-1">
                  <span className="font-semibold whitespace-nowrap text-[10px]">Supplier information :</span>
                  <div className="flex-1">
                    <CellInput value={data.supplierInfo} onChange={(val) => update('supplierInfo', val)} className="text-left" />
                  </div>
                </div>
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 px-1 py-0.5">
                <div className="flex items-center gap-0.5">
                  <span className="font-semibold whitespace-nowrap text-[9px]">Die/Cavity Number :</span>
                  <div className="flex-1 min-w-0">
                    <CellInput value={data.dieCavityNo} onChange={(val) => update('dieCavityNo', val)} className="text-left" />
                  </div>
                </div>
              </td>
            </tr>

            {/* Row 2: Part 1 | Opn 10 | M/c Header */}
            <tr>
              <td className="border border-slate-400 dark:border-slate-600 px-2 py-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] w-14 shrink-0">Part 1</span>
                  <span className="text-slate-400 mr-2">:</span>
                  <div className="flex-1">
                    <CellInput value={data.pdiOkPart1} onChange={(val) => update('pdiOkPart1', val)} className="text-left" />
                  </div>
                </div>
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold">
                10
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[0]?.mr} onChange={(val) => updateOpnDefect(0, 'mr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[0]?.cr} onChange={(val) => updateOpnDefect(0, 'cr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-center font-bold text-[10px] py-0.5">
                M/c (Opn#)
              </td>
              <td colSpan={4} className="border border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-bold text-[10px] text-center">
                Abnormty /Alarm (Mention time here)
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-center font-bold text-[10px] py-0.5 whitespace-nowrap">
                Tot.FOP Part
              </td>
            </tr>

            {/* Row 3: Part 2 | Opn 20 | Op#10 */}
            <tr>
              <td className="border border-slate-400 dark:border-slate-600 px-2 py-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] w-14 shrink-0">Part 2</span>
                  <span className="text-slate-400 mr-2">:</span>
                  <div className="flex-1">
                    <CellInput value={data.pdiOkPart2} onChange={(val) => update('pdiOkPart2', val)} className="text-left" />
                  </div>
                </div>
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold">
                20
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[1]?.mr} onChange={(val) => updateOpnDefect(1, 'mr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[1]?.cr} onChange={(val) => updateOpnDefect(1, 'cr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold text-[10px]">
                Op#10
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[0]?.abnormality1 ?? materialAbnormalities[0]?.abnormality} onChange={(val) => updateMaterialAbnormality(0, 'abnormality1', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[0]?.abnormality2} onChange={(val) => updateMaterialAbnormality(0, 'abnormality2', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[0]?.abnormality3} onChange={(val) => updateMaterialAbnormality(0, 'abnormality3', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[0]?.abnormality4} onChange={(val) => updateMaterialAbnormality(0, 'abnormality4', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={materialAbnormalities[0]?.totFopPart ?? materialAbnormalities[0]?.total} onChange={(val) => updateMaterialAbnormality(0, 'totFopPart', val)} className="text-center" />
              </td>
            </tr>

            {/* Row 4: Rework generation subhead | Opn 30 | Op#20 */}
            <tr>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-800/40 px-2 py-0.5 font-bold text-slate-800 dark:text-slate-200">
                Rework generation :
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold">
                30
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[2]?.mr} onChange={(val) => updateOpnDefect(2, 'mr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[2]?.cr} onChange={(val) => updateOpnDefect(2, 'cr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold text-[10px]">
                Op#20
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[1]?.abnormality1 ?? materialAbnormalities[1]?.abnormality} onChange={(val) => updateMaterialAbnormality(1, 'abnormality1', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[1]?.abnormality2} onChange={(val) => updateMaterialAbnormality(1, 'abnormality2', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[1]?.abnormality3} onChange={(val) => updateMaterialAbnormality(1, 'abnormality3', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[1]?.abnormality4} onChange={(val) => updateMaterialAbnormality(1, 'abnormality4', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={materialAbnormalities[1]?.totFopPart ?? materialAbnormalities[1]?.total} onChange={(val) => updateMaterialAbnormality(1, 'totFopPart', val)} className="text-center" />
              </td>
            </tr>

            {/* Row 5: Part 1 | Opn 40 | Op#30 */}
            <tr>
              <td className="border border-slate-400 dark:border-slate-600 px-2 py-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] w-14 shrink-0">Part 1</span>
                  <span className="text-slate-400 mr-2">:</span>
                  <div className="flex-1">
                    <CellInput value={data.reworkGenPart1} onChange={(val) => update('reworkGenPart1', val)} className="text-left" />
                  </div>
                </div>
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold">
                40
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[3]?.mr} onChange={(val) => updateOpnDefect(3, 'mr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[3]?.cr} onChange={(val) => updateOpnDefect(3, 'cr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold text-[10px]">
                Op#30
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[2]?.abnormality1 ?? materialAbnormalities[2]?.abnormality} onChange={(val) => updateMaterialAbnormality(2, 'abnormality1', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[2]?.abnormality2} onChange={(val) => updateMaterialAbnormality(2, 'abnormality2', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[2]?.abnormality3} onChange={(val) => updateMaterialAbnormality(2, 'abnormality3', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[2]?.abnormality4} onChange={(val) => updateMaterialAbnormality(2, 'abnormality4', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={materialAbnormalities[2]?.totFopPart ?? materialAbnormalities[2]?.total} onChange={(val) => updateMaterialAbnormality(2, 'totFopPart', val)} className="text-center" />
              </td>
            </tr>

            {/* Row 6: Part 2 | Opn 50 | Op#40 */}
            <tr>
              <td className="border border-slate-400 dark:border-slate-600 px-2 py-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] w-14 shrink-0">Part 2</span>
                  <span className="text-slate-400 mr-2">:</span>
                  <div className="flex-1">
                    <CellInput value={data.reworkGenPart2} onChange={(val) => update('reworkGenPart2', val)} className="text-left" />
                  </div>
                </div>
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold">
                50
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[4]?.mr} onChange={(val) => updateOpnDefect(4, 'mr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[4]?.cr} onChange={(val) => updateOpnDefect(4, 'cr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold text-[10px]">
                Op#40
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[3]?.abnormality1 ?? materialAbnormalities[3]?.abnormality} onChange={(val) => updateMaterialAbnormality(3, 'abnormality1', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[3]?.abnormality2} onChange={(val) => updateMaterialAbnormality(3, 'abnormality2', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[3]?.abnormality3} onChange={(val) => updateMaterialAbnormality(3, 'abnormality3', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[3]?.abnormality4} onChange={(val) => updateMaterialAbnormality(3, 'abnormality4', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={materialAbnormalities[3]?.totFopPart ?? materialAbnormalities[3]?.total} onChange={(val) => updateMaterialAbnormality(3, 'totFopPart', val)} className="text-center" />
              </td>
            </tr>

            {/* Row 7: Rework cleared subhead | Opn 60 | Op#50 */}
            <tr>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/70 dark:bg-slate-800/40 px-2 py-0.5 font-bold text-slate-800 dark:text-slate-200">
                Rework cleared in shift :
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold">
                60
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[5]?.mr} onChange={(val) => updateOpnDefect(5, 'mr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[5]?.cr} onChange={(val) => updateOpnDefect(5, 'cr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold text-[10px]">
                Op#50
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[4]?.abnormality1 ?? materialAbnormalities[4]?.abnormality} onChange={(val) => updateMaterialAbnormality(4, 'abnormality1', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[4]?.abnormality2} onChange={(val) => updateMaterialAbnormality(4, 'abnormality2', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[4]?.abnormality3} onChange={(val) => updateMaterialAbnormality(4, 'abnormality3', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[4]?.abnormality4} onChange={(val) => updateMaterialAbnormality(4, 'abnormality4', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={materialAbnormalities[4]?.totFopPart ?? materialAbnormalities[4]?.total} onChange={(val) => updateMaterialAbnormality(4, 'totFopPart', val)} className="text-center" />
              </td>
            </tr>

            {/* Row 8: Part 1 | Opn 70 | Op#60 */}
            <tr>
              <td className="border border-slate-400 dark:border-slate-600 px-2 py-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] w-14 shrink-0">Part 1</span>
                  <span className="text-slate-400 mr-2">:</span>
                  <div className="flex-1">
                    <CellInput value={data.reworkClearedPart1} onChange={(val) => update('reworkClearedPart1', val)} className="text-left" />
                  </div>
                </div>
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold">
                70
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[6]?.mr} onChange={(val) => updateOpnDefect(6, 'mr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[6]?.cr} onChange={(val) => updateOpnDefect(6, 'cr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold text-[10px]">
                Op#60
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[5]?.abnormality1 ?? materialAbnormalities[5]?.abnormality} onChange={(val) => updateMaterialAbnormality(5, 'abnormality1', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[5]?.abnormality2} onChange={(val) => updateMaterialAbnormality(5, 'abnormality2', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[5]?.abnormality3} onChange={(val) => updateMaterialAbnormality(5, 'abnormality3', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[5]?.abnormality4} onChange={(val) => updateMaterialAbnormality(5, 'abnormality4', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={materialAbnormalities[5]?.totFopPart ?? materialAbnormalities[5]?.total} onChange={(val) => updateMaterialAbnormality(5, 'totFopPart', val)} className="text-center" />
              </td>
            </tr>

            {/* Row 9: Part 2 | Opn 80 | Op#70 */}
            <tr>
              <td className="border border-slate-400 dark:border-slate-600 px-2 py-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] w-14 shrink-0">Part 2</span>
                  <span className="text-slate-400 mr-2">:</span>
                  <div className="flex-1">
                    <CellInput value={data.reworkClearedPart2} onChange={(val) => update('reworkClearedPart2', val)} className="text-left" />
                  </div>
                </div>
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold">
                80
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[7]?.mr} onChange={(val) => updateOpnDefect(7, 'mr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[7]?.cr} onChange={(val) => updateOpnDefect(7, 'cr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold text-[10px]">
                Op#70
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[6]?.abnormality1 ?? materialAbnormalities[6]?.abnormality} onChange={(val) => updateMaterialAbnormality(6, 'abnormality1', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[6]?.abnormality2} onChange={(val) => updateMaterialAbnormality(6, 'abnormality2', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[6]?.abnormality3} onChange={(val) => updateMaterialAbnormality(6, 'abnormality3', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5">
                <CellInput value={materialAbnormalities[6]?.abnormality4} onChange={(val) => updateMaterialAbnormality(6, 'abnormality4', val)} className="text-left" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={materialAbnormalities[6]?.totFopPart ?? materialAbnormalities[6]?.total} onChange={(val) => updateMaterialAbnormality(6, 'totFopPart', val)} className="text-center" />
              </td>
            </tr>

            {/* Row 10: Rework approval No | Opn 90 | TOTAL : */}
            <tr className="footer-approval-row">
              <td className="border border-slate-400 dark:border-slate-600 px-2 py-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] whitespace-nowrap">Rework approval No :</span>
                  <div className="flex-1 ml-2">
                    <CellInput value={data.reworkApprovalNo} onChange={(val) => update('reworkApprovalNo', val)} className="text-left" />
                  </div>
                </div>
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-50/60 dark:bg-slate-800/40 text-center font-semibold">
                90
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[8]?.mr} onChange={(val) => updateOpnDefect(8, 'mr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center p-0">
                <CellInput value={opnDefects[8]?.cr} onChange={(val) => updateOpnDefect(8, 'cr', val)} className="text-center" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-center font-bold text-[10px] py-0.5">
                TOTAL :
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5 text-center font-bold">
                <CellInput value={data.materialAbnormalitiesTotal1 ?? materialAbnormalities[6]?.abnormality1} onChange={(val) => update('materialAbnormalitiesTotal1', val)} className="text-center font-bold" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5 text-center font-bold">
                <CellInput value={data.materialAbnormalitiesTotal2 ?? materialAbnormalities[6]?.abnormality2} onChange={(val) => update('materialAbnormalitiesTotal2', val)} className="text-center font-bold" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5 text-center font-bold">
                <CellInput value={data.materialAbnormalitiesTotal3 ?? materialAbnormalities[6]?.abnormality3} onChange={(val) => update('materialAbnormalitiesTotal3', val)} className="text-center font-bold" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 px-1 py-0.5 text-center font-bold">
                <CellInput value={data.materialAbnormalitiesTotal4 ?? materialAbnormalities[6]?.abnormality4} onChange={(val) => update('materialAbnormalitiesTotal4', val)} className="text-center font-bold" />
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center font-bold p-0">
                <CellInput
                  value={data.materialAbnormalitiesTotal ?? (materialAbnormalities[6]?.totFopPart || '4')}
                  onChange={(val) => update('materialAbnormalitiesTotal', val)}
                  className="text-center font-bold"
                />
              </td>
            </tr>

            {/* Row 11: Document Box (rowSpan=2) | Total Opn# / MR / CR */}
            <tr className="border-t-2 border-slate-500">
              <td rowSpan={2} className="border border-slate-400 dark:border-slate-600 p-0 align-top bg-slate-50/60 dark:bg-slate-800/60">
                <div className="flex flex-col h-full text-[9px] leading-tight divide-y divide-slate-300 dark:divide-slate-700">
                  <div className="flex items-center px-2 py-0.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 w-20 shrink-0">Doc. No.:</span>
                    <CellInput value={data.docNo ?? 'SV/F/0615'} onChange={(val) => update('docNo', val)} className="text-left font-semibold" />
                  </div>
                  <div className="flex items-center px-2 py-0.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 w-20 shrink-0">Rev. No.:</span>
                    <CellInput value={data.revNo ?? '03'} onChange={(val) => update('revNo', val)} className="text-left" />
                  </div>
                  <div className="flex items-center px-2 py-0.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 w-20 shrink-0">Date (Rev.):</span>
                    <CellInput value={data.dateRev ?? '17.04.2026'} onChange={(val) => update('dateRev', val)} className="text-left" />
                  </div>
                  <div className="flex items-center px-2 py-0.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 w-20 shrink-0">Date (Org.):</span>
                    <CellInput value={data.dateOrg ?? '01.04.2011'} onChange={(val) => update('dateOrg', val)} className="text-left" />
                  </div>
                </div>
              </td>
              <td className="border border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-center font-bold text-[10px] py-1">
                Total
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center font-bold p-0">
                {editable ? (
                  <CellInput
                    value={data.opnDefectsTotal?.mr || (totalMR > 0 ? String(totalMR) : '0')}
                    onChange={(val) => update('opnDefectsTotal', { ...data.opnDefectsTotal, mr: val })}
                    className="text-center font-bold"
                  />
                ) : (
                  <span>{data.opnDefectsTotal?.mr || totalMR || '0'}</span>
                )}
              </td>
              <td className="border border-slate-400 dark:border-slate-600 text-center font-bold p-0">
                {editable ? (
                  <CellInput
                    value={data.opnDefectsTotal?.cr || (totalCR > 0 ? String(totalCR) : '0')}
                    onChange={(val) => update('opnDefectsTotal', { ...data.opnDefectsTotal, cr: val })}
                    className="text-center font-bold"
                  />
                ) : (
                  <span>{data.opnDefectsTotal?.cr || totalCR || '0'}</span>
                )}
              </td>
              <td colSpan={6} className="border border-slate-400 dark:border-slate-600 bg-slate-50/30 dark:bg-slate-800/20"></td>
            </tr>

            {/* Row 12: Prepared by & Supervisor */}
            <tr>
              <td colSpan={6} className="border border-slate-400 dark:border-slate-600 bg-slate-50/90 dark:bg-slate-800/80 px-2 py-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold whitespace-nowrap text-[10px]">Prepared by - Employee No :</span>
                  <div className="flex-1">
                    <CellInput
                      value={data.preparedByEmpNo || data.employeeNumbers}
                      onChange={(val) => update('preparedByEmpNo', val)}
                      placeholder="Emp ID"
                      className="text-left"
                    />
                  </div>
                </div>
              </td>
              <td colSpan={3} className="border border-slate-400 dark:border-slate-600 bg-slate-50/90 dark:bg-slate-800/80 px-2 py-1">
                <div className="flex flex-col justify-center">
                  <span className="font-bold text-[9px] whitespace-nowrap">Module Incharge / Supervisor</span>
                  <div className="w-full">
                    <CellInput
                      value={data.moduleIncharge || data.supervisorName}
                      onChange={(val) => update('moduleIncharge', val)}
                      placeholder="Sign / Name"
                      className="text-left font-semibold"
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}
