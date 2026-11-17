'use strict';
// Sample forms never make a network call. Live forms use only their configured endpoint.
document.querySelectorAll('form.demo-form').forEach(form => {
  const loaded = Date.now();
  form.elements.namedItem('t').value = String(loaded);
  const button = form.querySelector('button[type="submit"]');
  button.disabled = false;
  form.addEventListener('submit', async event => {
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
      result.textContent = `Thanks! ${form.dataset.business} got your request and will call you to confirm.${form.dataset.demo === 'true' ? ' (Demo: this went to Slated Studio.)' : ''}`;
      form.reset();
      form.elements.namedItem('t').value = String(loaded);
    } catch (error) {
      result.textContent = error instanceof TypeError ? 'Could not connect. Please try again or call.' : error.message;
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
