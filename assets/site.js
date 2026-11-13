'use strict';
// Demo only: no fetch, storage, analytics or form delivery.
document.querySelectorAll('form.demo-form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const result = form.querySelector('.form-result');
    if (result) {
      result.textContent = 'This is a sample. On your live site, this request goes straight to your phone and email.';
      result.hidden = false;
    }
  });
});
const tabs = document.querySelectorAll('.tabs button');
tabs.forEach(button => button.addEventListener('click', () => {
  tabs.forEach(other => other.setAttribute('aria-selected', String(other === button)));
  document.querySelectorAll('.panelx').forEach((panel, i) => panel.classList.toggle('on', String(i) === button.dataset.t));
}));
