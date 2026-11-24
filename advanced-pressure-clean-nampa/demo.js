'use strict';
// Sample forms never make a network call. Live forms use only their configured endpoint.
const dayText = day => new Intl.DateTimeFormat('en-US', {weekday:'short', month:'short', day:'numeric', timeZone:'UTC'}).format(new Date(day + 'T12:00:00Z'));
const timeText = hm => { const [h, m] = hm.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`; };
// Some looks join buttons edge to edge; with gaps, every button needs its own border.
const fixBorders = row => row.querySelectorAll('span').forEach(span => { span.style.borderLeft = getComputedStyle(span).borderTop; });
// Pro sites with online booking: a day strip + time buttons. If anything fails,
// the normal "Best day / Best time" fields stay and the form sends a request.
async function slotPicker(form) {
  if (form.dataset.native) return;
  const day = form.elements.namedItem('day'), time = form.querySelector('[name="time"]');
  const url = new URL('/slots', form.dataset.endpoint);
  url.searchParams.set('site', form.dataset.site);
  let data;
  try { const response = await fetch(url.href, {credentials:'omit'}); if (!response.ok) return; data = await response.json(); } catch { return; }
  form.querySelector('.slot-pick')?.remove();
  if (!data.days || !data.days.length) return;
  const group = time && time.closest('.slots,.seg,.pick');
  const old = [day && (day.closest('label') || day), group ? (group.closest('.f,.fld') || group) : time && time.closest('label')].filter(Boolean);
  const box = document.createElement('fieldset');
  box.className = 'slot-pick';
  Object.assign(box.style, {border:'0', padding:'0', margin:'0', minWidth:'0', gridColumn:'1 / -1', display:'grid', gap:'10px'});
  const legend = document.createElement('legend');
  legend.textContent = `${data.label} (${data.zone})`;
  Object.assign(legend.style, {padding:'0', marginBottom:'8px', fontWeight:'600'});
  const strip = (name, items, onPick) => {
    const row = document.createElement('div');
    row.className = group ? group.className : 'slots';
    row.setAttribute('role', 'radiogroup');
    row.setAttribute('aria-label', name === 'slot' ? 'Time' : 'Day');
    Object.assign(row.style, name === 'slot'
      ? {display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(92px,1fr))', gap:'8px'}
      : {display:'flex', flexWrap:'nowrap', overflowX:'auto', gap:'8px', paddingBottom:'4px', scrollSnapType:'x mandatory'});
    items.forEach(([value, text], i) => {
      const label = document.createElement('label'), input = document.createElement('input'), span = document.createElement('span');
      input.type = 'radio'; input.name = name; input.value = value; input.required = name === 'slot';
      span.textContent = text;
      Object.assign(span.style, {whiteSpace:'pre-line', lineHeight:'1.25'});
      if (name !== 'slot') Object.assign(label.style, {flex:'0 0 auto', minWidth:'76px', scrollSnapAlign:'start'});
      input.addEventListener('focus', () => { span.style.outline = '2px solid currentColor'; span.style.outlineOffset = '2px'; });
      input.addEventListener('blur', () => { span.style.outline = ''; });
      if (onPick) input.addEventListener('change', () => onPick(value));
      label.append(input, span); row.append(label);
      if (i === 0 && name !== 'slot') input.checked = true;
    });
    return row;
  };
  let times = document.createElement('div');
  const showTimes = picked => {
    const slots = data.days.find(d => d.day === picked).slots;
    const next = strip('slot', slots.map(t => [`${picked}T${t}`, timeText(t)]));
    times.replaceWith(next); times = next; fixBorders(next);
  };
  const days = strip('slot_day', data.days.map(d => [d.day, dayText(d.day).replace(', ', '\n')]), showTimes);
  box.append(legend, days, times);
  (old[0] || form.querySelector('button[type="submit"]')).before(box);
  old.forEach(el => { el.style.display = 'none'; });
  fixBorders(days);
  showTimes(data.days[0].day);
  const submit = form.querySelector('button[type="submit"]'); if (submit) submit.textContent = 'Book this time';
}
document.querySelectorAll('form.demo-form').forEach(form => {
  if (form.dataset.native) return;
  if (form.dataset.slots === 'true' && form.dataset.endpoint) slotPicker(form);
  const loaded = Date.now();
  form.elements.namedItem('t').value = String(loaded);
  const button = form.querySelector('button[type="submit"]');
  button.disabled = false;
  form.addEventListener('submit', async event => {
    if (form.dataset.native) return;
    event.preventDefault();
    const result = form.querySelector('.form-result');
    if (!form.dataset.endpoint) {
      result.textContent = 'This is a sample. On your live site, this request goes straight to your phone and email.';
      result.hidden = false;
      return;
    }
    if (button.disabled) return;
    button.disabled = true;
    result.hidden = false;
    result.textContent = 'Sending your request…';
    try {
      const values = Object.fromEntries(new FormData(form));
      values.site = form.dataset.site;
      values.t = loaded;
      values.page = window.location.pathname;
      if (form.dataset.demo === 'true') values.demo_business = form.dataset.demoBusiness || form.dataset.business;
      const endpoint = new URL(form.dataset.endpoint);
      endpoint.searchParams.set('site', values.site);
      const response = await fetch(endpoint.href, {method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'Could not send. Please try again or call.');
      result.textContent = data.booked
        ? `You're booked for ${data.booked} (${data.zone}). ${form.dataset.business} will call if anything needs to change.`
        : `Thanks! ${form.dataset.business} got your request and will call you to confirm.`;
      if (form.dataset.demo === 'true') result.textContent += ' (Demo: this went to Slated Studio.)';
      form.reset();
      form.elements.namedItem('t').value = String(loaded);
      if (form.querySelector('.slot-pick')) slotPicker(form);
    } catch (error) {
      result.textContent = error instanceof TypeError ? 'Could not connect. Please try again or call.' : error.message;
      // A time someone else just took: show the fresh list.
      if (form.querySelector('.slot-pick') && /taken|not open/.test(result.textContent)) slotPicker(form);
    } finally {
      button.disabled = false;
    }
  });
});
const tabs = document.querySelectorAll('.tabs button');
tabs.forEach(button => button.addEventListener('click', () => {
  tabs.forEach(other => other.setAttribute('aria-selected', String(other === button)));
  document.querySelectorAll('.panelx').forEach((panel, i) => panel.classList.toggle('on', String(i) === button.dataset.t));
}));
