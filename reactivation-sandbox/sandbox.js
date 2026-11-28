'use strict';
// Show a note when the page was opened from a campaign email (?c=<campaign id>); site.js sends the id with the form.
if (/[?&]c=[a-f0-9-]{36}(?:&|$)/.test(location.search)) document.getElementById('came').hidden = false;
// The demo email link carries the campaign name (&s=...); preselect it so the request matches the email.
const pick = new URLSearchParams(location.search).get('s'), sel = document.querySelector('select[name=service]');
if (pick && sel) { sel.add(new Option(pick.slice(0, 80), pick.slice(0, 80)), 0); sel.selectedIndex = 0; }
