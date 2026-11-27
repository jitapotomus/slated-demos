import { estimate, estimateText } from './estimate.js';
import { recipes } from './estimate-recipes/index.mjs';

const panel=document.querySelector('#instant-estimate');
if (panel) {
  const source=document.querySelector('form.demo-form'), trade=panel.dataset.trade;
  const el=(tag,text,attrs={})=>{const n=document.createElement(tag);if(text)n.textContent=text;for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);return n;};
  const close=el('button','×',{type:'button','aria-label':'Close estimate',class:'estimate-close'});
  const progress=el('p','',{'aria-live':'polite',class:'estimate-progress'});
  const content=el('div','',{class:'estimate-content'}), error=el('p','',{role:'alert'});
  const back=el('button','Back',{type:'button'}), next=el('button','Next',{type:'button'});
  const nav=el('div','',{class:'estimate-nav'});nav.append(back,next);
  panel.append(close,progress,content,error,nav);
  let config,answers={},step=0,result,busy=false,started,opener,submissionId,finished=false;
  const contacts={};
  // Estimates off or unreachable: send people to the normal request form, cursor in the name box.
  const fallback=()=>{opener=null;if(panel.open)panel.close();const form=document.querySelector('#estimate') || source;form.scrollIntoView({block:'start'});setTimeout(()=>source.querySelector('input[name=name]')?.focus(),0);};
  const fields=()=>config.recipe.fields;
  // Screens, not one question per screen: the service alone first, then short questions of the same kind
  // share a screen (up to 3 number boxes, or up to 3 small choices). Long choice lists keep their own screen.
  let pageCache;
  const pages=()=>{
    if(pageCache)return pageCache;
    const kind=f=>f.type==='number' ? 'number' : (f.options?.length<=3 ? 'small' : 'big');
    const out=[];
    fields().forEach((f,i)=>{
      const last=out[out.length-1], prev=last && fields()[last[last.length-1]];
      if(i===0 || kind(f)==='big' || !last || last[0]===0 || kind(prev)!==kind(f) || last.length>=3)out.push([i]);else last.push(i);
    });
    return pageCache=out;
  };
  const priceStep=()=>pages().length, contactStep=()=>priceStep()+1;
  const price=()=>estimate({...config.recipe,kind:config.modes[answers[config.recipe.serviceField]] || config.recipe.kind},config.prices,answers);
  function field(f) {
    const wrap=el('fieldset'), legend=el('legend',f.label);wrap.append(legend);
    if (f.type==='number') {
      const input=el('input','',{type:'number',name:f.key,min:f.min,max:f.max,step:1,inputmode:'numeric','aria-label':f.label});
      input.value=answers[f.key];
      input.addEventListener('input',()=>{answers[f.key]=input.value==='' ? null : Number(input.value);});
      if(f.presets){const presets=el('div','',{class:'estimate-choices'});f.presets.forEach(p=>{const b=el('button',p.label,{type:'button'});b.addEventListener('click',()=>{input.value=p.value;answers[f.key]=p.value;});presets.append(b);});wrap.append(presets,el('p',/sq ft/.test(f.unit||'') ? 'Or enter the exact square feet below.' : 'Or type the exact number below.'));}
      wrap.append(input);
    } else {
      const options=el('div','',{class:'estimate-choices'});
      f.options.forEach((o,i)=>{
        const label=el('label'), input=el('input','',{type:'radio',name:f.key,value:o.value});
        input.checked=answers[f.key]===o.value;
        input.addEventListener('change',()=>{answers[f.key]=o.value;});
        label.append(input,el('span',o.label));
        if(f.drawing==='truck') {
          const truck=el('span','',{class:'estimate-truck','aria-hidden':'true'}), units=[1,2,4,6,8][i];
          for(let n=0;n<8;n++)truck.append(el('i','',{class:n<units ? 'filled' : ''}));
          label.append(truck);
        }
        options.append(label);
      });wrap.append(options);
    }
    return wrap;
  }
  function render() {
    error.textContent='';content.replaceChildren();back.hidden=step===0;next.hidden=false;nav.hidden=false;
    const total=contactStep()+1;
    progress.textContent=`Step ${step+1} of ${total}`;progress.style.setProperty('--done',`${(step+1)/total*100}%`);
    if(config.sample)content.append(el('p','Sample prices: the owner sets their own',{class:'estimate-sample'}));
    if(step<priceStep()) {
      const page=pages()[step];
      content.append(el('h2',step===0 ? 'What can we help with?' : page.length===1 ? fields()[page[0]].label : 'A few quick details'));
      page.forEach(i=>content.append(field(fields()[i]))); next.textContent=step===priceStep()-1 ? 'See my estimate' : 'Next';
    } else if(step===priceStep()) {
      result=price();content.append(el('h2',`Your estimate: ${estimateText(result)}`));
      const list=el('ul');result.lines.forEach(l=>list.append(el('li',`${l.label}: $${(l.cents/100).toFixed(2)}`)));content.append(list);
      result.notes.forEach(note=>content.append(el('p',note)));
      next.textContent='Send my request';
    } else {
      content.append(el('h2','How can we reach you?'));
      for(const [key,label,type,required,max] of [['name','Your name','text',true,120],['phone','Phone','tel',true,40],['email','Email (optional)','email',false,254],['address','Address (optional)','text',false,250],['day','Preferred day (optional)','date',false,10]]) {
        const row=el('label',label), input=el('input','',{name:key,type,'aria-label':label,maxlength:max});
        input.value=contacts[key] || '';input.required=required;
        if(key==='phone')input.pattern='[0-9\\s\\(\\)\\+\\.\\-]{10,40}';  // every symbol escaped: browsers check patterns in strict (v) mode
        if(key==='day') {input.min=new Date(Date.now()-86400000).toISOString().slice(0,10);input.max=new Date(Date.now()+120*86400000).toISOString().slice(0,10);}
        input.addEventListener('input',()=>{contacts[key]=input.value;});row.append(input);content.append(row);
      }
      content.append(el('p','We only use this to contact you about your request.'));
      const hp=el('input','',{name:'hp',class:'estimate-hp',tabindex:'-1',autocomplete:'off','aria-hidden':'true'});content.append(hp);
      next.textContent=config.sample && !source.dataset.endpoint ? 'Try sample request' : 'Send request';
    }
    content.querySelector('h2')?.setAttribute('tabindex','-1');content.querySelector('h2')?.focus();
  }
  async function send() {
    for(const input of content.querySelectorAll('input'))if(!input.reportValidity())return;
    busy=true;next.disabled=true;back.disabled=true;
    try {
      let data={estimate:result,response_time:config.response_time,phone:config.phone};
      if(source.dataset.endpoint) {
        const url=new URL('/v1/estimate',source.dataset.endpoint);url.searchParams.set('site',source.dataset.site);
        const response=await fetch(url.href,{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({
          ...contacts,site:source.dataset.site,trade,answers,submission_id:submissionId,t:started,
          hp:content.querySelector('[name=hp]').value,page:location.pathname,
          ...(source.dataset.demo==='true' ? {demo_business:source.dataset.demoBusiness || source.dataset.business} : {})
        })});data=await response.json();if(!response.ok || !data.ok)throw Error(data.error || 'Could not send. Please try again or call.');
      }
      finished=true;content.replaceChildren(el('h2','Received!'));nav.hidden=true;progress.textContent='Request complete';
      content.append(el('p',window.bookingReceiptText(source,data,contacts,estimateText(data.estimate || result))));
      if(data.phone || source.dataset.phone)content.append(el('a',`Call ${data.phone || source.dataset.phone}`,{href:'tel:'+(data.phone || source.dataset.phone).replace(/[^+0-9]/g,'')}));
    } catch(err) {error.textContent=err.message || 'Could not connect. Please try again or call.';}
    finally {busy=false;next.disabled=false;back.disabled=false;}
  }
  next.addEventListener('click',()=>{
    if(busy || finished)return;
    if(step===contactStep())return send();
    if(step<priceStep()) {
      for(const input of content.querySelectorAll('input[type=number]'))if(!input.value || !input.reportValidity())return;
    }
    try {if(step===priceStep()-1)price();step++;render();}catch(err){error.textContent=err.message;}
  });
  back.addEventListener('click',()=>{if(!busy && step>0){step--;render();}});
  close.addEventListener('click',()=>panel.close());
  panel.addEventListener('close',()=>opener?.focus());
  document.querySelectorAll('[data-open-estimate]').forEach(button=>button.addEventListener('click',async()=>{
    opener=button;if(busy)return;
    if(finished){panel.showModal();return;}
    button.disabled=true;
    try {
      if(!config) {
        if(source.dataset.endpoint) {
          const url=new URL('/v1/estimate-config',source.dataset.endpoint);url.searchParams.set('site',source.dataset.site);url.searchParams.set('trade',trade);
          const response=await fetch(url.href,{credentials:'omit'});if(!response.ok)throw Error();config=await response.json();
        } else config={recipe:recipes[trade],prices:{},modes:{},sample:true,response_time:source.dataset.responseTime || '1 to 3 business days',phone:source.dataset.phone || ''};
        answers=Object.fromEntries(config.recipe.fields.map(f=>[f.key,f.default]));started=Date.now();submissionId=crypto.randomUUID();
      }
      panel.showModal();render();
    } catch {config=null;fallback();}
    finally {button.disabled=false;}
  }));
}
