// Quote widget: five ways to give a customer a price. Demo prices. Use QuoteWidget.mount(el, id, opts).
const $ = (s, r = document) => r.querySelector(s);
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const range = (lo, hi) => Math.round(lo) === Math.round(hi) ? money(lo) : money(lo) + ' to ' + money(hi);
const lab = opts => Object.fromEntries(opts.map(o => [o[0], o[1]]));

const SYS = [
{
  id: 'spa', tab: 'Car spa', title: 'Pick as many services as you like',
  blurb: 'Best for detailing. The customer ticks what they want, the size and condition adjust the price, and the total updates live.',
  prices: {
    wash: ['Exterior hand wash and wax', 60], interior: ['Interior deep clean', 120], pet: ['Pet hair removal', 50],
    light: ['Headlight restoration', 80], engine: ['Engine bay detail', 60], touch: ['Paint touch-up, per spot', 45],
    suv: ['SUV size adjustment (% of base)', 120], truck: ['Truck or van adjustment (% of base)', 135],
    dirty: ['Heavy dirt or stains surcharge (%)', 20], mobile: ['Come-to-you fee', 30]
  },
  fields: [
    { k: 'size', t: 'select', label: 'Vehicle size', opts: [['sedan', 'Sedan or coupe'], ['suv', 'SUV'], ['truck', 'Truck or van']] },
    { k: 'svc', t: 'multi', label: 'What would you like done?', opts: [['wash', 'Exterior hand wash and wax'], ['interior', 'Interior deep clean'], ['pet', 'Pet hair removal'], ['light', 'Headlight restoration'], ['engine', 'Engine bay detail']], pre: ['wash', 'interior'] },
    { k: 'touch', t: 'num', label: 'Paint touch-up spots', min: 0, max: 8, val: 2 },
    { k: 'dirty', t: 'check', label: 'Heavy dirt, mud or stains' },
    { k: 'mobile', t: 'check', label: 'Come to my place' }
  ],
  calc(P, s, L) {
    const m = s.size === 'suv' ? P('suv') / 100 : s.size === 'truck' ? P('truck') / 100 : 1;
    const lines = []; let sub = 0;
    for (const k of s.svc) { const a = P(k) * m; lines.push([L.svc[k], money(a)]); sub += a; }
    if (s.touch > 0) { const a = P('touch') * s.touch; lines.push(['Paint touch-up x' + s.touch, money(a)]); sub += a; }
    if (s.dirty) { const a = sub * P('dirty') / 100; lines.push(['Heavy dirt surcharge', money(a)]); sub += a; }
    if (s.mobile) { lines.push(['Come-to-you fee', money(P('mobile'))]); sub += P('mobile'); }
    return { lines, low: sub, high: sub, note: 'Ceramic coating and paint correction are quoted after we see the car.' };
  }
},
{
  id: 'plumb', tab: 'Plumbing', title: 'Priced by the work, not by the clock on the wall',
  blurb: 'Plumbing is labor hours times a rate, plus one trip fee and parts. After-hours is a higher hourly rate, shown plainly.',
  prices: {
    rate: ['Hourly rate', 120], trip: ['Trip fee (once per visit)', 85], after: ['After-hours rate (% of normal)', 150], emerg: ['Emergency rate (% of normal)', 200],
    h_drain: ['Hours: clogged drain', 1], p_drain: ['Parts: clogged drain', 0],
    h_toilet: ['Hours: toilet repair', 1], p_toilet: ['Parts: toilet repair', 25],
    h_faucet: ['Hours: replace a faucet', 1.5], p_faucet: ['Parts: replace a faucet (small parts)', 30],
    h_disposal: ['Hours: garbage disposal', 1.5], p_disposal: ['Parts: garbage disposal (unit)', 140],
    h_heater: ['Hours: tank water heater', 3.5], p_heater: ['Parts: tank water heater (unit)', 700],
    h_leak: ['Hours: find and fix a leak', 1.5], p_leak: ['Parts: leak repair', 30]
  },
  fields: [
    { k: 'svc', t: 'multi', label: 'What do you need? Pick everything that applies.', opts: [['drain', 'Clogged sink or tub drain'], ['toilet', 'Toilet repair'], ['faucet', 'Replace a faucet'], ['disposal', 'Replace a garbage disposal'], ['heater', 'Replace a tank water heater'], ['leak', 'Leak or something else']], pre: ['drain', 'faucet'] },
    { k: 'when', t: 'select', label: 'When can we come?', opts: [['reg', 'Weekday, regular hours'], ['after', 'Evening or weekend'], ['emerg', 'Emergency, right away']] }
  ],
  calc(P, s, L) {
    if (!s.svc.length) return { lines: [], low: 0, high: 0, note: 'Pick at least one job to see a price.' };
    const mult = s.when === 'after' ? P('after') / 100 : s.when === 'emerg' ? P('emerg') / 100 : 1;
    const hours = s.svc.reduce((a, k) => a + P('h_' + k), 0), parts = s.svc.reduce((a, k) => a + P('p_' + k), 0);
    const rate = P('rate') * mult, labor = hours * rate, total = P('trip') + labor + parts;
    const tag = s.when === 'after' ? ' (after-hours rate)' : s.when === 'emerg' ? ' (emergency rate)' : '';
    return {
      lines: [['Trip fee', money(P('trip'))], ['Labor: ' + hours + ' h x ' + money(rate) + '/h' + tag, money(labor)], ['Parts and materials', money(parts)]],
      low: total * 0.9, high: total * 1.2, note: 'Final price depends on what we find. Parts are billed at cost shown on the invoice.'
    };
  }
},
{
  id: 'fence', tab: 'Fence', title: 'Priced by the foot',
  blurb: 'For fences, decks and anything measured. The customer enters the length, picks a style and height, and adds gates.',
  prices: {
    privacy: ['Privacy fence, per foot', 32], picket: ['Picket fence, per foot', 24], rail: ['Split rail fence, per foot', 18],
    h4: ['4 ft height adjustment (%)', 85], h8: ['8 ft height adjustment (%)', 125], gate: ['Each gate', 350], removal: ['Remove old fence, per foot', 4]
  },
  fields: [
    { k: 'ft', t: 'range', label: 'How many feet of fence?', min: 20, max: 400, step: 5, val: 150, unit: ' ft' },
    { k: 'style', t: 'select', label: 'Style', opts: [['privacy', 'Privacy fence'], ['picket', 'Picket fence'], ['rail', 'Split rail fence']] },
    { k: 'h', t: 'select', label: 'Height', opts: [['6', '6 feet'], ['4', '4 feet'], ['8', '8 feet']] },
    { k: 'gates', t: 'num', label: 'Gates', min: 0, max: 5, val: 1 },
    { k: 'old', t: 'check', label: 'Remove and haul away my old fence' }
  ],
  calc(P, s, L) {
    const unit = P(s.style) * (s.h === '4' ? P('h4') / 100 : s.h === '8' ? P('h8') / 100 : 1), lines = [];
    let t = s.ft * unit; lines.push([s.ft + ' ft of ' + L.style[s.style].toLowerCase() + ', ' + s.h + ' ft tall', money(t)]);
    if (s.gates) { const g = s.gates * P('gate'); lines.push([s.gates + ' gate' + (s.gates > 1 ? 's' : ''), money(g)]); t += g; }
    if (s.old) { const r = s.ft * P('removal'); lines.push(['Remove old fence', money(r)]); t += r; }
    return { lines, low: t * 0.88, high: t * 1.12, note: 'We confirm the length and the ground on a quick visit before the final price.' };
  }
},
{
  id: 'tree', tab: 'Tree service', title: 'A range, because every tree is different',
  blurb: 'When the true price depends on things you cannot see online, give an honest range and say what moves it.',
  prices: {
    lo_s: ['Small tree, low end', 350], hi_s: ['Small tree, high end', 600], lo_m: ['Medium tree, low end', 600], hi_m: ['Medium tree, high end', 1100],
    lo_l: ['Large tree, low end', 1100], hi_l: ['Large tree, high end', 2200], near: ['Near a house or fence adds (%)', 25], power: ['Near power lines adds (%)', 35],
    stump_lo: ['Stump grinding, low (each)', 150], stump_hi: ['Stump grinding, high (each)', 250], haul: ['Haul away branches and logs', 150]
  },
  fields: [
    { k: 'count', t: 'num', label: 'How many trees?', min: 1, max: 10, val: 1 },
    { k: 'size', t: 'select', label: 'How big is the tree?', opts: [['m', 'Medium (30 to 60 ft)'], ['s', 'Small (under 30 ft)'], ['l', 'Large (over 60 ft)']] },
    { k: 'house', t: 'check', label: 'It is close to a house, shed or fence' },
    { k: 'power', t: 'check', label: 'It is near power lines' },
    { k: 'stump', t: 'check', label: 'Grind the stump too' },
    { k: 'haul', t: 'check', label: 'Haul everything away' }
  ],
  calc(P, s, L) {
    let lo = s.count * P('lo_' + s.size), hi = s.count * P('hi_' + s.size);
    const lines = [[s.count + ' ' + L.size[s.size].split(' (')[0].toLowerCase() + ' tree' + (s.count > 1 ? 's' : ''), range(lo, hi)]];
    let f = 1; if (s.house) f += P('near') / 100; if (s.power) f += P('power') / 100;
    if (f > 1) { const a = lo * (f - 1), b = hi * (f - 1); lines.push(['Tricky location', '+' + range(a, b)]); lo += a; hi += b; }
    if (s.stump) { const a = s.count * P('stump_lo'), b = s.count * P('stump_hi'); lines.push(['Stump grinding', range(a, b)]); lo += a; hi += b; }
    if (s.haul) { lines.push(['Haul away', money(P('haul'))]); lo += P('haul'); hi += P('haul'); }
    return { lines, low: lo, high: hi, note: s.power ? 'Near power lines we must look at it in person before any price is firm.' : 'We look at the tree before we confirm the price.' };
  }
},
{
  id: 'clean', tab: 'House cleaning', title: 'Good, better, best',
  blurb: 'Packages make a decision easy. The customer picks a level, sizes the home, and adds extras. A repeat plan lowers the price.',
  prices: {
    base: ['Base price', 70], bed: ['Per bedroom', 22], bath: ['Per bathroom', 18], deep: ['Deep clean (% of standard)', 160], move: ['Move-out clean (% of standard)', 210],
    oven: ['Inside the oven', 35], fridge: ['Inside the fridge', 30], windows: ['Interior windows', 60], pets: ['Pet hair extra', 25], biweek: ['Every 2 weeks discount (%)', 15], month: ['Monthly discount (%)', 10]
  },
  fields: [
    { k: 'pkg', t: 'radio', label: 'Which clean?', opts: [['std', 'Standard', 'Dusting, floors, kitchen and baths'], ['deep', 'Deep clean', 'Everything in standard, plus baseboards, cabinets and detail work'], ['move', 'Move-out', 'Top to bottom, empty home, ready for the next person']] },
    { k: 'bed', t: 'num', label: 'Bedrooms', min: 1, max: 6, val: 3 },
    { k: 'bath', t: 'num', label: 'Bathrooms', min: 1, max: 5, val: 2 },
    { k: 'ext', t: 'multi', label: 'Extras', opts: [['oven', 'Inside the oven'], ['fridge', 'Inside the fridge'], ['windows', 'Interior windows'], ['pets', 'Pet hair extra']], pre: [] },
    { k: 'freq', t: 'select', label: 'How often?', opts: [['once', 'One time'], ['biweek', 'Every 2 weeks'], ['month', 'Monthly']] }
  ],
  calc(P, s, L) {
    const std = P('base') + P('bed') * s.bed + P('bath') * s.bath, m = s.pkg === 'deep' ? P('deep') / 100 : s.pkg === 'move' ? P('move') / 100 : 1;
    const lines = []; let t = std * m; lines.push([L.pkg[s.pkg] + ' clean, ' + s.bed + ' bed, ' + s.bath + ' bath', money(t)]);
    for (const k of s.ext) { lines.push([L.ext[k], money(P(k))]); t += P(k); }
    if (s.freq !== 'once') { const d = t * P(s.freq) / 100; lines.push(['Repeat plan discount', '-' + money(d)]); t -= d; }
    return { lines, low: t, high: t, note: 'Final price confirmed when we book. First visit may take a little longer.' };
  }
}
];


const edits = {};
function P(sys) { return k => (edits[sys.id] && edits[sys.id][k] != null ? edits[sys.id][k] : sys.prices[k][1]); }
function labels(sys) { const L = {}; for (const f of sys.fields) if (f.opts) L[f.k] = lab(f.opts); return L; }
function gather(sys, root) {
  const s = {};
  for (const f of sys.fields) {
    if (f.t === 'select') s[f.k] = $('[name=' + f.k + ']', root).value;
    else if (f.t === 'multi') s[f.k] = [...root.querySelectorAll('[name=' + f.k + ']:checked')].map(i => i.value);
    else if (f.t === 'num' || f.t === 'range') s[f.k] = Number($('[name=' + f.k + ']', root).value) || 0;
    else if (f.t === 'check') s[f.k] = $('[name=' + f.k + ']', root).checked;
    else if (f.t === 'radio') s[f.k] = ($('[name=' + f.k + ']:checked', root) || {}).value;
  }
  return s;
}
function mount(el, id, opts = {}) {
  const sys = SYS.find(s => s.id === id), uid = 'q' + Math.random().toString(36).slice(2, 7);
  const fields = sys.fields.map(f => {
    const nm = f.k;
    if (f.t === 'select') return `<label class="fld"><span>${f.label}</span><select name="${nm}">${f.opts.map(o => `<option value="${o[0]}">${o[1]}</option>`).join('')}</select></label>`;
    if (f.t === 'multi') return `<fieldset class="fld"><legend>${f.label}</legend><div class="chips">${f.opts.map(o => `<label class="chip"><input type="checkbox" name="${nm}" value="${o[0]}"${(f.pre || []).includes(o[0]) ? ' checked' : ''}><span>${o[1]}</span></label>`).join('')}</div></fieldset>`;
    if (f.t === 'num') return `<label class="fld"><span>${f.label}</span><div class="step"><button type="button" data-d="-1" data-for="${nm}" aria-label="Fewer">-</button><input name="${nm}" type="number" min="${f.min}" max="${f.max}" value="${f.val ?? f.min}"><button type="button" data-d="1" data-for="${nm}" aria-label="More">+</button></div></label>`;
    if (f.t === 'range') return `<label class="fld"><span>${f.label} <b class="rv" data-r="${nm}">${f.val}${f.unit || ''}</b></span><input name="${nm}" type="range" min="${f.min}" max="${f.max}" step="${f.step || 1}" value="${f.val}"></label>`;
    if (f.t === 'check') return `<label class="chip solo"><input type="checkbox" name="${nm}"><span>${f.label}</span></label>`;
    if (f.t === 'radio') return `<fieldset class="fld"><legend>${f.label}</legend><div class="cards">${f.opts.map((o, i) => `<label class="pk"><input type="radio" name="${nm}" value="${o[0]}"${i === 0 ? ' checked' : ''}><span><b>${o[1]}</b><small>${o[2]}</small></span></label>`).join('')}</div></fieldset>`;
  }).join('');
  const owner = opts.owner ? `<details class="owner"><summary>Owner view: set your own prices</summary><p class="hint">The owner changes these numbers once. Every customer sees the new price.</p><div class="ops">${Object.keys(sys.prices).map(k => `<label class="op"><span>${sys.prices[k][0]}</span><input type="number" step="any" data-k="${k}" value="${P(sys)(k)}"></label>`).join('')}</div></details>` : '';
  const head = opts.heading === false ? '' : `<h2>${sys.title}</h2><p class="blurb">${sys.blurb}</p>`;
  el.classList.add('qw');
  const assistBlock = opts.assist ? `<div class="assist"><label for="${uid}t"><b>Not sure what you need?</b> Tell us in your own words.</label><textarea id="${uid}t" class="atext" rows="2" maxlength="500" placeholder="${opts.assist.example || 'For example: my kitchen sink is clogged and the faucet drips'}"></textarea><div class="arow"><button type="button" class="abtn">Fill it in for me</button><span class="astat" role="status"></span></div></div>` : '';
  el.innerHTML = `<div class="qgrid"><div class="qleft">${head}${assistBlock}<form class="qf" onsubmit="return false">${fields}</form>${owner}</div>
    <aside class="est" aria-live="polite"><h3>Your estimate</h3><div class="lines"></div><div class="tot"><span>Total</span><b class="totv"></b></div><p class="note"></p><button class="go req" type="button">${opts.cta || 'Request this quote'}</button><p class="sent" hidden></p></aside></div>`;
  const L = labels(sys), form = $('.qf', el); let last = null;
  const run = () => {
    const r = last = sys.calc(P(sys), gather(sys, form), L);
    $('.lines', el).innerHTML = r.lines.map(l => `<div class="ln"><span>${l[0]}</span><b>${l[1]}</b></div>`).join('') || '<p class="muted">Pick something to see a price.</p>';
    $('.totv', el).textContent = r.low === 0 && r.high === 0 ? '-' : range(r.low, r.high);
    $('.note', el).textContent = r.note || ''; $('.sent', el).hidden = true;
  };
  form.addEventListener('input', e => { if (e.target.type === 'range') { const rv = $('[data-r=' + e.target.name + ']', el); if (rv) rv.textContent = e.target.value + (sys.fields.find(f => f.k === e.target.name).unit || ''); } run(); });
  form.addEventListener('click', e => { const b = e.target.closest('button[data-d]'); if (!b) return; const i = $('[name=' + b.dataset.for + ']', form); i.value = Math.max(i.min, Math.min(i.max, Number(i.value) + Number(b.dataset.d))); run(); });
  const ops = $('.ops', el); if (ops) ops.addEventListener('input', e => { const k = e.target.dataset.k; if (!k) return; (edits[sys.id] = edits[sys.id] || {})[k] = Number(e.target.value) || 0; run(); });
  $('.req', el).onclick = () => {
    const sent = $('.sent', el), target = opts.form && $(opts.form);
    if (target && last && last.lines.length) {
      const ta = $('textarea[name=message]', target), sel = $('select[name=service]', target);
      if (ta) ta.value = 'My estimate from the website: ' + last.lines.map(l => l[0] + ' ' + l[1]).join('; ') + '. Total ' + $('.totv', el).textContent + '.';
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      sent.textContent = 'Your estimate is filled in below. Add your name and phone and send it.'; sent.hidden = false;
    } else { sent.textContent = 'In a real site this sends the request and the estimate to the owner. This is a demo, so nothing was sent.'; sent.hidden = false; }
  };
  const abtn = $('.abtn', el);
  if (abtn) abtn.onclick = async () => {
    const txt = $('.atext', el).value.trim(), stat = $('.astat', el);
    if (txt.length < 3) { stat.textContent = 'Tell us a little about the problem first.'; return; }
    abtn.disabled = true; stat.textContent = 'Reading your message...';
    try {
      const r = await fetch(opts.assist.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system: id, text: txt }), signal: AbortSignal.timeout(15000) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'The helper is busy.');
      const picks = d.picks || {};
      for (const f of sys.fields) {
        if (!(f.k in picks)) continue; const v = picks[f.k];
        if (f.t === 'multi') form.querySelectorAll('[name=' + f.k + ']').forEach(i => { i.checked = v.includes(i.value); });
        else if (f.t === 'check') $('[name=' + f.k + ']', form).checked = !!v;
        else if (f.t === 'select' || f.t === 'radio') { const t = form.querySelector('[name=' + f.k + '][value="' + v + '"]') || $('[name=' + f.k + ']', form); if (t.type === 'radio') t.checked = true; else t.value = v; }
        else { const i = $('[name=' + f.k + ']', form); i.value = v; const rv = $('[data-r=' + f.k + ']', el); if (rv) rv.textContent = v + (f.unit || ''); }
      }
      run();
      const n0 = (d.note || 'Here is what I picked.').trim(), n1 = /[.!?]$/.test(n0) ? n0 : n0 + '.';
      stat.textContent = Object.keys(picks).length ? n1 + ' This was picked by AI. Please check it and change anything that is wrong.' : (d.note || 'We could not tell what you need. Pick below, or call us.');
    } catch (e) { stat.textContent = (e && e.message && !/abort|fetch|network/i.test(e.message)) ? e.message : 'The helper is busy. Please pick your options below.'; }
    abtn.disabled = false;
  };
  run();
}
window.QuoteWidget = { mount, systems: SYS };
