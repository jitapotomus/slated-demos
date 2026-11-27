// Default prices researched 2026-11-27 (national 2026 cost guides, ID/TN run ~5-8% under national);
// sources in websites/QUOTE_RESEARCH.md. Owner edits every price. Range, never an exact quote.
const count = (key, label, unit) => ({key, label, type: 'number', min: 0, max: 20, default: key === 'remove_medium' ? 1 : 0, unit,
  presets: [{label: 'None', value: 0}, {label: '1', value: 1}, {label: '2', value: 2}, {label: '3', value: 3}]});
const money = (label, cents) => ({label, default: cents, unit: 'cents'});
const factor = (label, bps) => ({label, default: bps, unit: 'bps', max: 30000});
const WORK = ['remove_small', 'remove_medium', 'remove_large', 'trim_small', 'trim_medium', 'trim_large'];

export default {
  trade: 'tree_service',
  label: 'Tree service',
  kind: 'B',
  serviceField: 'service',
  fields: [
    {key: 'service', label: 'Service', type: 'select', default: 'tree_work', options: [{value: 'tree_work', label: 'Tree work'}]},
    count('remove_small', 'Trees to remove: small (under 30 ft, about a 2-story house)', 'small tree removals'),
    count('remove_medium', 'Trees to remove: medium (30 to 60 ft)', 'medium tree removals'),
    count('remove_large', 'Trees to remove: large (over 60 ft)', 'large tree removals'),
    count('trim_small', 'Trees to trim: small (under 30 ft)', 'small tree trims'),
    count('trim_medium', 'Trees to trim: medium (30 to 60 ft)', 'medium tree trims'),
    count('trim_large', 'Trees to trim: large (over 60 ft)', 'large tree trims'),
    {key: 'stumps', label: 'Stumps to grind', type: 'number', min: 0, max: 30, default: 0, unit: 'stumps',
      presets: [{label: 'None', value: 0}, {label: '1', value: 1}, {label: '2', value: 2}, {label: '4', value: 4}]},
    {key: 'near', label: 'Are any of the trees close to the house, a fence or power lines?', type: 'select', default: 'open',
      options: [{value: 'open', label: 'No, open space'}, {value: 'close', label: 'Yes, close to something'}]},
    {key: 'wood', label: 'What should we do with the wood?', type: 'select', default: 'haul',
      options: [{value: 'haul', label: 'Haul it all away'}, {value: 'leave', label: 'Leave the logs, haul the branches'}]},
    {key: 'when', label: 'How soon?', type: 'select', default: 'normal',
      options: [{value: 'normal', label: 'Normal scheduling'}, {value: 'storm', label: 'Storm damage / emergency'}]},
  ],
  rules: [
    {field: 'service', op: 'add', prices: {}},
    ...WORK.map(field => ({field, op: 'unit', price: field})),
    {field: 'stumps', op: 'unit', price: 'stump'},
    {field: 'near', op: 'multiply', prices: {close: 'near_close'}, scope: WORK},
    {field: 'wood', op: 'discount', prices: {leave: 'leave_wood'}, scope: WORK},
    {field: 'when', op: 'multiply', prices: {storm: 'storm'}},
  ],
  prices: {
    minimum: money('Minimum charge', 25000),
    range_low: {label: 'Range below estimate (%)', default: 2000, unit: 'bps', max: 9000},
    range_high: {label: 'Range above estimate (%)', default: 3000, unit: 'bps', max: 10000},
    remove_small: money('Remove a small tree (under 30 ft)', 35000),
    remove_medium: money('Remove a medium tree (30-60 ft)', 75000),
    remove_large: money('Remove a large tree (over 60 ft)', 135000),
    trim_small: money('Trim a small tree', 22500),
    trim_medium: money('Trim a medium tree', 47500),
    trim_large: money('Trim a large tree', 90000),
    stump: money('Grind a stump (average size)', 15000),
    near_close: factor('Close to house / fence / lines (x)', 13000),
    leave_wood: {label: 'Customer keeps the logs (discount %)', default: 1000, unit: 'bps', max: 5000},
    storm: factor('Storm / emergency (x)', 15000),
  },
  notes: [
    'Tree prices depend on the exact tree, so we confirm the price after a quick look.',
    'Very large trees that need a crane are priced separately.',
  ],
  requireAny: [...WORK, 'stumps'],
};
