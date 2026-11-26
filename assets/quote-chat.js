// Quote chat: a short conversation that builds an estimate from the owner's price book. Prices always come from the server.
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const range = (a, b) => Math.round(a) === Math.round(b) ? money(a) : money(a) + ' to ' + money(b);

  function mount(el, o) {
    const q = '?system=' + encodeURIComponent(o.system || 'plumb') + '&site=' + encodeURIComponent(o.site);
    const S = { messages: [], cart: { items: [], when: 'reg', custom: [], visit: [] }, view: { quote: null, custom: [], projects: [] }, busy: false, catalog: null, asked: 0 };
    el.classList.add('qw', 'qc');
    el.innerHTML = `<div class="qgrid"><div class="qleft">
      <div class="chat" role="log" aria-live="polite"></div>
      <form class="cform" onsubmit="return false"><label class="sr" for="qc-in">Describe your problem</label><textarea id="qc-in" rows="2" maxlength="500" placeholder="${esc(o.example || 'Tell me what is going on, for example: my kitchen sink is clogged and the faucet drips')}"></textarea><div class="crow"><button type="button" class="send abtn">Send</button><span class="cstat" role="status"></span></div></form>
      <details class="browse"><summary>Or pick jobs from the list yourself</summary><div class="bbody"><label class="fld"><span>Type of job</span><select class="bcat"></select></label><label class="fld"><span>Job</span><select class="bjob"></select></label><button type="button" class="abtn addjob">Add this job</button></div></details>
      </div>
      <aside class="est" aria-live="polite"><h3>Your estimate</h3><div class="lines"></div><div class="tot"><span>Total</span><b class="totv">-</b></div><label class="fld when"><span>When can we come?</span><select class="wsel"><option value="reg">Weekday, regular hours</option><option value="after">Evening or weekend</option><option value="emerg">Emergency, right away</option></select></label><p class="note"></p><button class="go req" type="button">Request this quote</button><p class="sent" hidden></p></aside></div>`;
    const chat = $('.chat', el), input = $('#qc-in', el), stat = $('.cstat', el);
    const say = (role, text) => { const d = document.createElement('div'); d.className = 'msg ' + role; d.textContent = text; chat.appendChild(d); chat.scrollTop = chat.scrollHeight; };
    say('assistant', "Hi, I'm an AI assistant. Tell me what's going on and I'll build your estimate. The owner confirms the final price.");

    function draw() {
      const v = S.view, lines = [];
      if (v.quote) {
        v.quote.lines.forEach((l, i) => lines.push(`<div class="ln item"><span>${esc(l.label)}${l.qty > 1 ? ' x' + l.qty : ''}</span><span class="ctl"><button type="button" data-a="dec" data-id="${esc(l.id)}" aria-label="Fewer">-</button><button type="button" data-a="inc" data-id="${esc(l.id)}" aria-label="More">+</button><button type="button" data-a="rm" data-id="${esc(l.id)}" aria-label="Remove ${esc(l.label)}">x</button></span></div>`));
        lines.push(`<div class="ln"><span>Trip fee</span><b>${money(v.quote.trip)}</b></div>`, `<div class="ln"><span>Labor: ${v.quote.hours} h x ${money(v.quote.rate)}/h</span><b>${money(v.quote.labor)}</b></div>`, `<div class="ln"><span>Parts and materials</span><b>${money(v.quote.parts)}</b></div>`);
      }
      v.custom.forEach(c => lines.push(`<div class="ln"><span><b>${esc(c.title)}</b><br><small>We will price this after a quick look.</small></span><b>Quote after visit</b></div>`));
      v.projects.forEach(p => lines.push(`<div class="ln"><span><b>${esc(p.label)}</b><br><small>This kind of project needs a visit before we can price it.</small></span><b>Quote after visit</b></div>`));
      $('.lines', el).innerHTML = lines.join('') || '<p class="muted">Your estimate will show up here as we talk.</p>';
      $('.totv', el).textContent = v.quote ? range(v.quote.low, v.quote.high) : (v.custom.length || v.projects.length ? 'After a visit' : '-');
      $('.note', el).textContent = v.quote ? 'This is an estimate. The owner confirms the final price after hearing the details.' : '';
      $('.wsel', el).value = S.cart.when;
    }
    async function api(path, body, method) {
      const r = await fetch(o.api + path + q, { method: method || 'POST', headers: { 'Content-Type': 'application/json' }, body: method === 'GET' ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(28000) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'The assistant is busy.');
      return d;
    }
    function apply(d) { S.cart = d.cart; S.view = { quote: d.quote, custom: d.custom || [], projects: d.projects || [] }; draw(); }
    async function send() {
      const t = input.value.trim(); if (t.length < 3 || S.busy) { if (t.length < 3) stat.textContent = 'Tell me a little about the problem first.'; return; }
      S.busy = true; $('.send', el).disabled = true; stat.textContent = 'Thinking...'; input.value = '';
      S.messages.push({ role: 'user', content: t }); say('user', t);
      try {
        let d; try { d = await api('/v1/quote-chat', { messages: S.messages, cart: S.cart }); } catch (e1) { if (/busy/i.test(e1.message || '')) { stat.textContent = 'Still thinking...'; d = await api('/v1/quote-chat', { messages: S.messages, cart: S.cart }); } else throw e1; }
        S.messages.push({ role: 'assistant', content: d.reply }); say('assistant', d.reply); apply(d); stat.textContent = d.ready ? 'Review your estimate, then tap Request this quote.' : '';
      } catch (e) { S.messages.pop(); stat.textContent = ''; say('assistant', (e && e.message && !/abort|fetch|network|load/i.test(e.message)) ? e.message : 'Sorry, I am busy right now. You can pick jobs from the list below.'); }
      S.busy = false; $('.send', el).disabled = false;
    }
    async function reprice(cart) { try { apply(await api('/v1/quote-catalog', { cart })); } catch (e) { stat.textContent = 'Could not update the estimate. Try again.'; } }
    $('.send', el).onclick = send;
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } });
    $('.lines', el).addEventListener('click', e => {
      const b = e.target.closest('button[data-a]'); if (!b) return; const c = JSON.parse(JSON.stringify(S.cart)), it = c.items.find(x => x.id === b.dataset.id); if (!it) return;
      if (b.dataset.a === 'rm') c.items = c.items.filter(x => x !== it); else it.qty += b.dataset.a === 'inc' ? 1 : -1;
      if (it.qty < 1) c.items = c.items.filter(x => x !== it); reprice(c);
    });
    $('.wsel', el).onchange = e => { const c = JSON.parse(JSON.stringify(S.cart)); c.when = e.target.value; reprice(c); };
    // browse the list by hand
    fetch(o.api + '/v1/quote-catalog' + q, { signal: AbortSignal.timeout(15000) }).then(r => r.json()).then(cat => {
      S.catalog = cat; const cs = $('.bcat', el), js = $('.bjob', el);
      cs.innerHTML = cat.categories.map(c => `<option value="${esc(c[0])}">${esc(c[1])}</option>`).join('');
      const fill = () => { js.innerHTML = cat.items.filter(i => i.cat === cs.value).map(i => `<option value="${esc(i.id)}">${esc(i.label)}${i.visit ? ' (priced after a visit)' : ''}</option>`).join(''); };
      cs.onchange = fill; fill();
    }).catch(() => { const b = $('.browse', el); if (b) b.hidden = true; });
    $('.addjob', el).onclick = () => {
      const id = $('.bjob', el).value, item = S.catalog && S.catalog.items.find(i => i.id === id); if (!item) return;
      const c = JSON.parse(JSON.stringify(S.cart));
      if (item.visit) { if (!c.visit.includes(id)) c.visit.push(id); } else { const h = c.items.find(x => x.id === id); if (h) h.qty = Math.min(item.max, h.qty + 1); else c.items.push({ id, qty: 1, weFurnish: false }); }
      reprice(c);
    };
    $('.req', el).onclick = () => {
      const sent = $('.sent', el), form = o.form && $(o.form), v = S.view;
      if (!v.quote && !v.custom.length && !v.projects.length) { sent.textContent = 'Tell me about the problem first, or pick a job from the list.'; sent.hidden = false; return; }
      const parts = [];
      if (v.quote) parts.push('Jobs: ' + v.quote.lines.map(l => l.label + (l.qty > 1 ? ' x' + l.qty : '')).join('; ') + '. Estimate ' + range(v.quote.low, v.quote.high) + '.');
      v.custom.forEach(c => parts.push('Custom job to price: ' + c.title + '. ' + c.why));
      v.projects.forEach(p => parts.push('Project needing a visit: ' + p.label + '.'));
      parts.push('Timing: ' + ({ reg: 'regular hours', after: 'evening or weekend', emerg: 'emergency' }[S.cart.when]) + '.');
      const said = S.messages.filter(m => m.role === 'user').map(m => m.content).join(' | ');
      if (said) parts.push('What I told the assistant: ' + said);
      if (form) { const ta = $('textarea[name=message]', form); if (ta) ta.value = parts.join(' ').slice(0, 1900); form.scrollIntoView({ behavior: 'smooth', block: 'center' }); sent.textContent = 'Your estimate is filled in below. Add your name and phone and send it.'; }
      else sent.textContent = 'In a real site this sends the request to the owner. This is a demo, so nothing was sent.';
      sent.hidden = false;
    };
    draw();
  }
  window.QuoteChat = { mount };
})();
