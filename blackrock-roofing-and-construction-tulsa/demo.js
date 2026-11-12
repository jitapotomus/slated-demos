'use strict';
// No fetch, storage, analytics or form delivery. This is a local demonstration.
const bar = document.querySelector('.sample-bar');
const header = document.querySelector('.site-header');
function measureHeader() {
  document.documentElement.style.setProperty('--bar-height', `${bar.offsetHeight}px`);
  document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
}
new ResizeObserver(measureHeader).observe(bar);
new ResizeObserver(measureHeader).observe(header);
measureHeader();
const form = document.querySelector('#quote-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const result = document.querySelector('#form-result');
  result.textContent = 'This is a demo. On your live site this goes straight to your phone as a text.';
  result.hidden = false;
  result.focus({preventScroll: true});
  result.scrollIntoView({block: 'nearest'});
});
form.querySelector('button[type="submit"]').disabled = false;
