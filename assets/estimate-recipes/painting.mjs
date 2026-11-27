// Default prices researched 2026-11-27 (2026 guides: interior $1-4 per sq ft of FLOOR (This Old House), $2-6 full interiors
// (NerdWallet); exterior $1.50-4 per sq ft; ceilings +$1-2/sq ft; two-story +30-50%; labor 70-80% of the bill).
// Sources in websites/QUOTE_RESEARCH.md. Owner edits every price. Range, never an exact quote.
const money = (label, cents) => ({label, default: cents, unit: 'cents'});
const factor = (label, bps) => ({label, default: bps, unit: 'bps', max: 30000});
const pick = (key, label, options, def = options[0][0]) => ({key, label, type: 'select', default: def,
  options: options.map(([value, text]) => ({value, label: text}))});
const BOTH = ['interior', 'exterior'];

export default {
  trade: 'painting',
  label: 'Painting',
  kind: 'B',
  assist: true,  // customers can type the job in their own words; the AI only fills these answers
  serviceField: 'service',
  fields: [
    pick('service', 'What do you want painted?', [['interior', 'Inside'], ['exterior', 'Outside'], ['both', 'Inside and outside']]),
    {key: 'interior', label: 'Inside: floor area of the rooms to paint', type: 'number', min: 0, max: 20000, default: 1000, unit: 'sq ft inside',
      presets: [{label: 'Skip', value: 0}, {label: '1 room (150 sq ft)', value: 150}, {label: '1,000 sq ft', value: 1000}, {label: '2,000 sq ft', value: 2000}, {label: '3,000 sq ft', value: 3000}]},
    {key: 'exterior', label: 'Outside: size of the house', type: 'number', min: 0, max: 20000, default: 0, unit: 'sq ft outside',
      presets: [{label: 'Skip', value: 0}, {label: '1,200 sq ft', value: 1200}, {label: '2,000 sq ft', value: 2000}, {label: '3,000 sq ft', value: 3000}]},
    pick('ceilings', 'Paint the ceilings too?', [['no', 'No'], ['yes', 'Yes']]),
    pick('trim', 'Paint trim, doors and baseboards?', [['no', 'No'], ['yes', 'Yes']]),
    pick('stories', 'How many stories is the house?', [['one', '1 story'], ['two', '2 stories'], ['three', '3 stories']]),
    pick('paint', 'Paint quality', [['standard', 'Standard paint'], ['premium', 'Premium paint'], ['own', 'I have my own paint']]),
    pick('color', 'Changing color a lot? (for example dark to light)', [['no', 'No, similar color'], ['yes', 'Yes, big change']]),
    pick('prep', 'Condition of the surfaces', [['good', 'Good shape'], ['repairs', 'Some holes, cracks or peeling']]),
  ],
  rules: [
    {field: 'service', op: 'add', prices: {}},
    {field: 'interior', op: 'unit', price: 'interior'},
    {field: 'exterior', op: 'unit', price: 'exterior'},
    {field: 'ceilings', op: 'multiply', prices: {yes: 'ceilings'}, scope: ['interior']},
    {field: 'trim', op: 'multiply', prices: {yes: 'trim'}, scope: ['interior']},
    {field: 'stories', op: 'multiply', prices: {two: 'two_story', three: 'three_story'}, scope: ['exterior']},
    {field: 'paint', op: 'multiply', prices: {premium: 'premium'}, scope: BOTH},
    {field: 'paint', op: 'discount', prices: {own: 'own_paint'}, scope: BOTH},
    {field: 'color', op: 'multiply', prices: {yes: 'color_change'}, scope: BOTH},
    {field: 'prep', op: 'multiply', prices: {repairs: 'repairs'}, scope: BOTH},
  ],
  prices: {
    minimum: money('Minimum charge', 40000),
    range_low: {label: 'Range below estimate (%)', default: 1500, unit: 'bps', max: 9000},
    range_high: {label: 'Range above estimate (%)', default: 2500, unit: 'bps', max: 10000},
    interior: money('Inside walls (per sq ft of floor)', 250),
    exterior: money('Outside of house (per sq ft of house)', 225),
    ceilings: factor('Ceilings too (x)', 14000),
    trim: factor('Trim, doors and baseboards (x)', 12000),
    two_story: factor('2-story outside (x)', 13500),
    three_story: factor('3-story outside (x)', 16000),
    premium: factor('Premium paint (x)', 11200),
    own_paint: {label: 'Customer supplies paint (discount %)', default: 1500, unit: 'bps', max: 5000},
    color_change: factor('Big color change, extra coat (x)', 12000),
    repairs: factor('Patching and scraping (x)', 11500),
  },
  notes: [
    'Sizes are approximate, so the final price may move a little.',
    'We confirm the price after a quick look at the rooms or the house.',
  ],
  requireAny: BOTH,
};
