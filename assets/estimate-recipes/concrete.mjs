// Default prices researched 2026-11-27 (2026 cost guides; Boise ~$10-14/sq ft driveways, Knoxville $8-15 broom);
// sources in websites/QUOTE_RESEARCH.md. Owner edits every price. Range, never an exact quote.
const area = (key, label, presets) => ({key, label, type: 'number', min: 0, max: 20000, default: key === 'driveway' ? 800 : 0, unit: `sq ft ${key === 'tearout' ? 'torn out' : key}`,
  presets: [{label: 'Skip', value: 0}, ...presets]});
const money = (label, cents) => ({label, default: cents, unit: 'cents'});
const factor = (label, bps) => ({label, default: bps, unit: 'bps', max: 30000});
const AREAS = ['driveway', 'patio', 'sidewalk', 'slab'];

export default {
  trade: 'concrete',
  label: 'Concrete',
  kind: 'B',
  serviceField: 'service',
  fields: [
    {key: 'service', label: 'Service', type: 'select', default: 'concrete_work', options: [{value: 'concrete_work', label: 'Concrete work'}]},
    area('driveway', 'Driveway', [{label: '1-car (10 x 40 ft)', value: 400}, {label: '2-car (20 x 40 ft)', value: 800}, {label: 'Long 2-car (20 x 60 ft)', value: 1200}]),
    area('patio', 'Patio', [{label: 'Small (10 x 10 ft)', value: 100}, {label: 'Medium (12 x 16 ft)', value: 192}, {label: 'Large (20 x 20 ft)', value: 400}]),
    area('sidewalk', 'Sidewalk or path', [{label: 'Short (4 x 25 ft)', value: 100}, {label: 'Long (4 x 50 ft)', value: 200}]),
    area('slab', 'Slab (shed, garage or pad)', [{label: 'Shed pad (10 x 12 ft)', value: 120}, {label: '1-car garage (12 x 24 ft)', value: 288}, {label: '2-car garage (24 x 24 ft)', value: 576}]),
    {key: 'finish', label: 'Finish', type: 'select', default: 'broom',
      options: [{value: 'broom', label: 'Plain / broom finish'}, {value: 'aggregate', label: 'Exposed aggregate'},
        {value: 'stamped', label: 'Stamped'}, {value: 'stamped_color', label: 'Stamped and colored'}]},
    area('tearout', 'Old concrete to remove first', [{label: 'Same as new area', value: 400}, {label: 'Part of it (200 sq ft)', value: 200}]),
    {key: 'ground', label: 'Is the ground flat and ready?', type: 'select', default: 'flat',
      options: [{value: 'flat', label: 'Yes, flat'}, {value: 'dig', label: 'No, needs digging or leveling'}]},
  ],
  rules: [
    {field: 'service', op: 'add', prices: {}},
    ...AREAS.map(field => ({field, op: 'unit', price: field})),
    {field: 'finish', op: 'multiply', prices: {aggregate: 'aggregate', stamped: 'stamped', stamped_color: 'stamped_color'}, scope: AREAS},
    {field: 'ground', op: 'multiply', prices: {dig: 'dig'}, scope: AREAS},
    {field: 'tearout', op: 'unit', price: 'tearout'},
  ],
  prices: {
    minimum: money('Minimum charge (small pours)', 120000),
    range_low: {label: 'Range below estimate (%)', default: 1500, unit: 'bps', max: 9000},
    range_high: {label: 'Range above estimate (%)', default: 2500, unit: 'bps', max: 10000},
    driveway: money('Driveway (per sq ft)', 950),
    patio: money('Patio (per sq ft)', 850),
    sidewalk: money('Sidewalk (per sq ft)', 900),
    slab: money('Slab (per sq ft)', 750),
    aggregate: factor('Exposed aggregate (x)', 13500),
    stamped: factor('Stamped (x)', 16000),
    stamped_color: factor('Stamped and colored (x)', 18000),
    dig: factor('Digging / leveling needed (x)', 11000),
    tearout: money('Remove old concrete (per sq ft)', 400),
  },
  notes: [
    'Sizes are approximate, so the final price may move a little.',
    'Permits, steep slopes and hard-to-reach spots are confirmed when we look at the job.',
  ],
  requireAny: AREAS,
};
