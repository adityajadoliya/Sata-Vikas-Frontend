/**
 * @typedef {Object} ProductionLog
 * @property {number} id
 * @property {string} form_unique_id
 * @property {string} serialNo
 * @property {string} date - YYYY-MM-DD
 * @property {string} shift - 'A' | 'B' | 'C'
 * @property {string} [zone]
 * @property {string} machineNo
 * @property {string} qaCell
 * @property {string} operationNumber
 * @property {string} partNo1
 * @property {string} partNo2
 * @property {string} plan1 - plan for part 1
 * @property {string} plan2 - plan for part 2
 * @property {string} employeeNumbers - comma-separated
 * @property {string} employeeId
 * @property {number} scheduledQuantity
 * @property {string} page
 * @property {number} totalProduction
 * @property {number} totalLossMin
 * @property {string} uploadedBy
 * @property {string} uploadedById
 * @property {string} supervisorName
 * @property {string} shiftIncharge
 * @property {string} entryPersonName
 * @property {string} pdiOkPart1
 * @property {string} pdiOkPart2
 * @property {string} reworkGenPart1
 * @property {string} reworkGenPart2
 * @property {string} reworkClearedPart1
 * @property {string} reworkClearedPart2
 * @property {string} reworkApprovalNo
 * @property {string} docNo
 * @property {string} revNo
 * @property {string} dateRev
 * @property {string} dateOrg
 * @property {string} supplierInfo
 * @property {string} dieCavityNo
 * @property {string} preparedByEmpNo
 * @property {string} moduleIncharge
 * @property {string} abnormalityToolChange
 * @property {string} otherAbnormality
 * @property {HourlyProductionEntry} hourlyProduction
 * @property {TPMLossEntry[]} tpmLosses
 */

/**
 * @typedef {Object} HourlyProductionEntry
 * @property {string} uph - Single UPH reference (header display)
 * @property {Object.<string, string>} uphValues - Per-hour UPH targets { hr1: '', hr2: '', ... hr13: '' }
 * @property {Object.<string, string>} part1Production - { hr1: '', hr2: '', ... hr9: '', total: '' }
 * @property {Object.<string, string>} part1CastingRej
 * @property {Object.<string, string>} part1MachiningRej
 * @property {Object.<string, string>} part1UnprocessedRej
 * @property {Object.<string, string>} part2Production
 * @property {Object.<string, string>} part2CastingRej
 * @property {Object.<string, string>} part2MachiningRej
 * @property {Object.<string, string>} part2UnprocessedRej
 */

/**
 * @typedef {Object} TPMLossEntry
 * @property {string} code - e.g. 'BD', 'ST', 'SU', 'SL', 'MS', 'ML', 'LL', 'LD', 'AD', 'PS', 'UR', 'UL', 'TC', 'SA'
 * @property {string} category - 'Breakdown (BD)', 'Set up (ST)', etc.
 * @property {string} description
 * @property {Object.<string, string>} hourlyValues - { hr1: '', hr2: '', ... hr9: '' }
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string} fullName
 * @property {string} role - 'admin' | 'employee'
 * @property {string} department
 * @property {string} createdDate
 * @property {string} status - 'active' | 'inactive'
 */

export const HOUR_COLUMNS = ['uph', 'hr1', 'hr2', 'hr3', 'hr4', 'hr5', 'hr6', 'hr7', 'hr8', 'hr9', 'hr10', 'hr11', 'hr12', 'hr13', 'total'];
export const HOUR_LABELS = ['UPH', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'Total'];
export const OP_SLOTS = ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100'];

export const TPM_LOSS_CATEGORIES = [
  // Break down (BD)
  { code: 'BD', group: 'Break down (BD)', description: 'Breakdown-Mech. (Details on next page)' },
  { code: 'BD', group: 'Break down (BD)', description: 'Breakdown-Elect. (Details on next page)' },
  { code: 'BD', group: 'Break down (BD)', description: 'Breakdown-Hydraulic' },
  { code: 'BD', group: 'Break down (BD)', description: 'Breakdown-Fixture' },
  // Set up (ST)
  { code: 'ST', group: 'Set up (ST)', description: 'Fixture change (For same part)' },
  { code: 'ST', group: 'Set up (ST)', description: 'Setting change (Both Tool & Fixture)' },
  { code: 'ST', group: 'Set up (ST)', description: 'Tool change (Replacement/breakage)' },
  { code: 'ST', group: 'Set up (ST)', description: 'Program (Next part) change' },
  // Start up (SU)
  { code: 'SU', group: 'Start up (SU)', description: 'Startup after Breakdown' },
  { code: 'SU', group: 'Start up (SU)', description: 'Startup after tool change' },
  { code: 'SU', group: 'Start up (SU)', description: 'Start up after planned stopage' },
  { code: 'SU', group: 'Start up (SU)', description: 'Power failure & start up after that' },
  // Speed loss (MS)
  { code: 'MS', group: 'Speed loss (MS)', description: 'Speed loss : Lower CT/Partial BD M/c' },
  { code: 'MS', group: 'Speed loss (MS)', description: 'Speed loss : Untrained person' },
  { code: 'MS', group: 'Speed loss (MS)', description: 'Tool buildup' },
  { code: 'MS', group: 'Speed loss (MS)', description: 'Slow running with Minor stoppages' },
  // Waiting (MW)
  { code: 'MW', group: 'Waiting (MW)', description: 'Waiting : Casting' },
  { code: 'MW', group: 'Waiting (MW)', description: 'Waiting : Child parts/ED part' },
  { code: 'MW', group: 'Waiting (MW)', description: 'Waiting : Tool / Fixture' },
  { code: 'MW', group: 'Waiting (MW)', description: 'Waiting : Trolley/Packing box/Pallet' },
  // Delay (DL)
  { code: 'DL', group: 'Delay (DL)', description: 'Meeting/ Discussion with supervisor' },
  { code: 'DL', group: 'Delay (DL)', description: 'Delay : Issue analysis/adjustment' },
  { code: 'DL', group: 'Delay (DL)', description: 'Delay : Getting Lab report' },
  { code: 'DL', group: 'Delay (DL)', description: 'Delay : Consumable (coolant)' },
  // Oth.loss (OL)
  { code: 'OL', group: 'Oth.loss (OL)', description: 'Machine cleaning' },
  { code: 'OL', group: 'Oth.loss (OL)', description: 'Manpower not available' },
  { code: 'OL', group: 'Oth.loss (OL)', description: 'Power failure' },
  { code: 'OL', group: 'Oth.loss (OL)', description: 'Utility loss (Air/water supply failure)' },
  // Pl.loss (PL)
  { code: 'PL', group: 'Pl.loss (PL)', description: 'PPC No schedule/Planned stoppage' },
  { code: 'PL', group: 'Pl.loss (PL)', description: 'PM/Reconditioning' },
  { code: 'PL', group: 'Pl.loss (PL)', description: 'Lunch (L) /Tea (T) stoppage (write L/T)' },
];

export const OPN_DEFECT_OPERATIONS = ['10', '20', '30', '40', '50', '60', '70', '80', '90'];
export const MATERIAL_MACHINE_OPERATIONS = ['Op#10', 'Op#20', 'Op#30', 'Op#40', 'Op#50', 'Op#60', 'Op#70'];

export function createEmptyFormData() {
  const emptyHours = () => ({
    hr1: '', hr2: '', hr3: '', hr4: '', hr5: '', hr6: '', hr7: '',
    hr8: '', hr9: '', hr10: '', hr11: '', hr12: '', hr13: '', total: ''
  });

  const emptyTpmHours = () => ({
    hr1: '', hr2: '', hr3: '', hr4: '', hr5: '', hr6: '', hr7: '',
    hr8: '', hr9: '', hr10: '', hr11: '', hr12: '', hr13: ''
  });

  return {
    id: null,
    form_unique_id: '',
    serialNo: '',
    date: '',
    shift: '',
    zone: '',
    machineNo: '',
    machineNoByOperation: {},
    employeeNoByOperation: {},
    qaCell: '',
    operationNumber: '',
    partNo1: '',
    partNo2: '',
    plan1: '',
    plan2: '',
    employeeNumbers: '',
    employeeId: '',
    scheduledQuantity: '',
    page: 'A',
    uph: '',
    uphValues: { hr1: '', hr2: '', hr3: '', hr4: '', hr5: '', hr6: '', hr7: '', hr8: '', hr9: '', hr10: '', hr11: '', hr12: '', hr13: '' },
    part1Production: emptyHours(),
    part1CastingRej: emptyHours(),
    part1MachiningRej: emptyHours(),
    part1UnprocessedRej: emptyHours(),
    part2Production: emptyHours(),
    part2CastingRej: emptyHours(),
    part2MachiningRej: emptyHours(),
    part2UnprocessedRej: emptyHours(),
    supervisorName: '',
    shiftIncharge: '',
    entryPersonName: '',
    pdiOkPart1: '',
    pdiOkPart2: '',
    reworkGenPart1: '',
    reworkGenPart2: '',
    reworkClearedPart1: '',
    reworkClearedPart2: '',
    reworkApprovalNo: '',
    docNo: 'SV/F/0615',
    revNo: '03',
    dateRev: '17.04.2026',
    dateOrg: '01.04.2011',
    opnDefects: OPN_DEFECT_OPERATIONS.map(op => ({ opn: op, mr: '', cr: '' })),
    opnDefectsTotal: { mr: '', cr: '' },
    supplierInfo: '',
    dieCavityNo: '',
    materialAbnormalities: MATERIAL_MACHINE_OPERATIONS.map(op => ({ op, abnormality: '', abnormality1: '', abnormality2: '', abnormality3: '', abnormality4: '', total: '' })),
    materialAbnormalitiesTotal: '',
    preparedByEmpNo: '',
    moduleIncharge: '',
    abnormalityToolChange: '',
    otherAbnormality: '',
    tpmLosses: TPM_LOSS_CATEGORIES.map(cat => ({
      ...cat,
      hourlyValues: emptyTpmHours(),
    })),
    totalLossMin: 0,
    totalProduction: 0,
    uploadedBy: '',
    uploadedById: '',
  };
}
