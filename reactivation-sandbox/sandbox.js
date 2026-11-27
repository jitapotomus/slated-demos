'use strict';
// Show a note when the page was opened from a campaign email (?c=<campaign id>); site.js sends the id with the form.
if (/[?&]c=[a-f0-9-]{36}(?:&|$)/.test(location.search)) document.getElementById('came').hidden = false;
