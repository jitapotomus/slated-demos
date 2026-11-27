// Pure, shared price engine. Money is integer cents; factors/discounts are basis
// points (10000 = 1x). Tier rates apply progressively, not to the whole quantity.
export function estimate(recipe, prices = {}, answers = {}) {
  const fail = message => { throw Object.assign(new Error(message), {status:400}); };
  const record = value => value && typeof value === 'object' && !Array.isArray(value);
  if (!record(prices) || !record(answers)) fail('Check prices and answers.');
  const fields = recipe.fields, params = recipe.prices;
  for (const key of Object.keys(prices)) if (!Object.hasOwn(params,key)) fail('Unknown price.');
  const p = {};
  for (const [key, spec] of Object.entries(params)) {
    const n = Object.hasOwn(prices,key) ? prices[key] : spec.default;
    if (!Number.isSafeInteger(n) || n < (spec.min ?? 0) || n > (spec.max ?? 100000000)) fail(`Check ${spec.label}.`);
    p[key] = n;
  }
  for (const key of Object.keys(answers)) if (!fields.some(f=>f.key===key)) fail('Unknown answer.');
  const a = {};
  for (const f of fields) {
    const v = Object.hasOwn(answers,f.key) ? answers[f.key] : f.default;
    if (f.type === 'number') {
      if (!Number.isSafeInteger(v) || v<f.min || v>f.max) fail(`Check ${f.label}.`);
    } else if (!f.options.some(o=>o.value===v)) fail(`Choose ${f.label}.`);
    a[f.key] = v;
  }
  if (recipe.requireAny && !recipe.requireAny.some(k=>a[k]>0)) fail('Choose at least one surface.');
  const lines = []; let total = 0;
  const add = (label, cents, key) => {
    if (!Number.isSafeInteger(cents) || Math.abs(cents)>1000000000) fail('This job is too large. Please call.');
    total += cents;
    if (cents) lines.push({label,cents,key});
  };
  if (recipe.base) add(params[recipe.base].label,p[recipe.base],'base');
  for (const rule of recipe.rules) {
    const f = fields.find(f=>f.key===rule.field), value = a[rule.field];
    if (rule.op === 'unit') {
      const units = Math.max(0,value-(rule.included || 0));
      let cents = 0, previous = 0;
      for (const tier of rule.tiers || [{upTo:f.max,price:rule.price}]) {
        cents += Math.max(0,Math.min(units,tier.upTo)-previous)*p[tier.price];
        previous = tier.upTo;
      }
      const unit=f.unit || f.label;
      add(`${units} ${units===1 ? unit.replace(/s$/,'') : unit}`,cents,f.key);  // "1 bathroom", "2 bathrooms"
    } else {
      const option = f.options.find(o=>o.value===value), key = rule.prices[value];
      if (!key) continue;
      const label = `${f.label.replace(/[?:]$/,"")}: ${option.label}`;  // "What do you need: X", not "need?: X"
      if (rule.op === 'multiply' || rule.op === 'discount') {
        const subtotal = rule.scope ? lines.filter(l=>rule.scope.includes(l.key)).reduce((n,l)=>n+l.cents,0) : total;
        const factor = rule.op === 'discount' ? -p[key] : p[key]-10000;
        add(label,Math.round(subtotal*factor/10000),f.key);
      } else add(label,p[key],f.key);
    }
  }
  if (total<p.minimum) add('Minimum charge',p.minimum-total,'minimum');
  const rounded = Math.max(Math.ceil(p.minimum/500)*500,Math.round(total/500)*500);
  add('Round to nearest $5',rounded-total,'rounding');
  const kind = recipe.kind;
  if (!['A','B','C','D'].includes(kind)) fail('Unknown estimate type.');
  const floor=Math.ceil(p.minimum/500)*500;  // a range never starts below the minimum charge
  return {kind,low:kind==='B' ? Math.max(floor,Math.round(rounded*(10000-p.range_low)/10000/500)*500) : rounded,
    high:kind==='B' ? Math.round(rounded*(10000+p.range_high)/10000/500)*500 : rounded,
    lines,notes:[...(recipe.notes || []),'Estimate based on your answers. The final price is confirmed before any work starts.']};
}

export const estimateText = result => {
  const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n/100);
  return result.kind==='D' ? `Starting at ${money(result.low)}` : result.low===result.high ? money(result.low) : `${money(result.low)} to ${money(result.high)}`;
};

export function answerText(recipe, answers) {
  return recipe.fields.map(f=> {
    const v = answers[f.key] ?? f.default;
    return `${f.label.replace(/[?:]$/,"")}: ${f.type==='number' ? v+(f.unit ? ' '+f.unit : '') : f.options.find(o=>o.value===v)?.label}`;
  }).join('\n');
}
