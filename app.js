// ---------- Helpers ----------
async function loadJSON(path){const r=await fetch(path);return r.json();}
const qs=(s,el=document)=>el.querySelector(s);
const qsa=(s,el=document)=>[...el.querySelectorAll(s)];
const slugify=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');

// ---------- Social ----------
function setSocialLinks(social){
  const li=document.getElementById('cta-linkedin'); if(li&&social.linkedin) li.href=social.linkedin;
  const gh=document.getElementById('cta-github'); if(gh&&social.github) gh.href=social.github;
}

// ---------- Build project card ----------
function projectCard(p){
  const div=document.createElement('div');div.className='card';div.setAttribute('role','button');div.setAttribute('tabindex','0');
  const imgSrc=(p.images && p.images[0] && p.images[0].src) || p.imageOrVideo || '';
  div.dataset.slug=slugify(p.title||'project');
  div.innerHTML=`
    <img src="${imgSrc}" alt="" aria-hidden="true" style="width:100%;height:160px;object-fit:cover;border-radius:12px;border:1px solid var(--line);margin-bottom:.6rem"/>
    <h3>${p.title||''}</h3>
    <p>${p.description||''}</p>
    <p><strong>Tech:</strong> ${Array.isArray(p.tech)?p.tech.join(', '):p.tech||''}</p>
    <div style="display:flex;gap:.5rem;flex-wrap:wrap">
      <a class="btn" href="${p.repoURL||'#'}" target="_blank" rel="noopener">Repo</a>
    </div>`;
  return div;
}

// ---------- Modal / Gallery state ----------
const state={ projects:[], open:null, slide:0, lastFocus:null };

function openProject(project, slideIndex=0){
  state.open=project; state.slide=slideIndex;
  const modal=qs('#project-modal'); const img=qs('#carousel-image'); const caption=qs('#carousel-caption');
  const thumbs=qs('#carousel-thumbs'); const title=qs('#modal-title');
  const tech=qs('#modal-tech'); const desc=qs('#modal-description'); const links=qs('#modal-links');

  title.textContent=project.title||'';
  tech.innerHTML=(Array.isArray(project.tech)?project.tech:[]).map(t=>`<span class="btn">${t}</span>`).join('');
  desc.innerHTML=(project.longDescription||'').trim() || `<p>${project.description||''}</p>`;
  links.innerHTML=`<a class="btn" href="${project.repoURL||'#'}" target="_blank" rel="noopener">View Repo</a>`;

  // build thumbs (only show if multiple images)
  thumbs.innerHTML='';
  const imgs = (project.images||[]).slice(0,5);
  if(imgs.length > 1) {
    imgs.forEach((im,idx)=>{
      const tb=document.createElement('button');
      const ti=document.createElement('img');
      ti.src=im.src; ti.alt=im.alt||''; tb.appendChild(ti);
      tb.addEventListener('click',()=>setSlide(idx,true));
      thumbs.appendChild(tb);
    });
    thumbs.parentElement.style.display = 'block';
  } else {
    thumbs.parentElement.style.display = 'none';
  }

  function setSlide(i,updateHash){
    const images=(project.images||[]);
    if(!images.length){ // placeholder tile
      const svg=`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='%23E0E0E0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%231A1A1A' font-family='Inter' font-size='20'>Image unavailable</text></svg>`;
      img.src=svg; img.alt=''; caption.hidden=true;
      return;
    }
    state.slide=(i+images.length)%images.length;
    const im=images[state.slide];
    img.classList.remove('loaded'); img.classList.add('blur-up');
    img.onload=()=>img.classList.add('loaded');
    img.onerror=()=>{ const svg=`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'><rect width='100%' height='100%' fill='%23E0E0E0'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%231A1A1A' font-family='Inter' font-size='20'>Image unavailable</text></svg>`; img.src=svg; caption.hidden=true; };
    img.src=im?.src||''; img.alt=im?.alt||'';
    if(im && im.caption){ caption.textContent=im.caption; caption.hidden=false; } else { caption.hidden=true; }

    // Update thumbnail selection visual feedback
    qsa('button',thumbs).forEach((b,k)=>b.style.borderColor = k===state.slide ? 'var(--brand1)':'var(--line)');

    // preload neighbors
    const next=images[(state.slide+1)%images.length], prev=images[(state.slide-1+images.length)%images.length];
    [next,prev].forEach(n=>{ if(n&&n.src){ const i2=new Image(); i2.src=n.src; } });

    if(updateHash){ updateHashFromState(); }
  }
  window.setSlide=setSlide;
  setSlide(slideIndex,false);

  // Show modal
  state.lastFocus=document.activeElement;
  modal.hidden=false; document.body.style.overflow='hidden';
  const firstFocus=qs('.modal__content',modal); firstFocus && firstFocus.focus();

  // keyboard navigation and focus trap
  const focusables = ()=>qsa('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])', modal)
                           .filter(el=>!el.hasAttribute('disabled') && el.offsetParent!==null);
  modal.addEventListener('keydown', (e)=>{
    const images=(project.images||[]);
    if(e.key==='ArrowLeft' && images.length>1){ setSlide(state.slide-1,true); e.preventDefault(); }
    else if(e.key==='ArrowRight' && images.length>1){ setSlide(state.slide+1,true); e.preventDefault(); }
    else if(e.key==='Escape'){ closeModal(); e.preventDefault(); }
    else if(e.key==='Tab'){
      const els=focusables(); if(!els.length) return;
      const first=els[0], last=els[els.length-1];
      if(e.shiftKey && document.activeElement===first){ last.focus(); e.preventDefault(); }
      else if(!e.shiftKey && document.activeElement===last){ first.focus(); e.preventDefault(); }
    }
  });

  // swipe/drag
  const vp=qs('.carousel__viewport'); let startX=null, dragging=false;
  function start(ev){ dragging=true; startX=(ev.touches?ev.touches[0].clientX:ev.clientX); }
  function end(ev){
    if(!dragging) return; dragging=false;
    const endX=(ev.changedTouches?ev.changedTouches[0].clientX:ev.clientX);
    const dx=endX-startX; const images=(project.images||[]);
    if(Math.abs(dx)>50 && images.length>1){ const dir = dx<0 ? 1 : -1; setSlide(state.slide+dir,true); }
  }
  vp.addEventListener('touchstart',start,{passive:true}); vp.addEventListener('touchend',end);
  vp.addEventListener('mousedown',start); vp.addEventListener('mouseup',end);

  // close handlers (backdrop only)
  modal.addEventListener('click',(e)=>{ if(e.target.classList.contains('modal__backdrop')){ closeModal(); } });

  updateHashFromState();
}

function closeModal(){
  const modal=qs('#project-modal'); if(modal.hidden) return;
  modal.hidden=true; document.body.style.overflow='';
  clearHash();
  if(state.lastFocus && document.body.contains(state.lastFocus)){ state.lastFocus.focus(); }
  state.open=null;
}

function updateHashFromState(){
  if(!state.open) return;
  const slug = slugify(state.open.title||'project');
  const slide = state.slide || 0;
  const newHash = `#project=${encodeURIComponent(slug)}&slide=${slide}`;
  if(location.hash !== newHash){ history.replaceState(null,'',newHash); }
}
function clearHash(){ if(location.hash){ history.replaceState(null,'',location.pathname+location.search); } }

function parseHash(){
  const h=location.hash.replace(/^#/,''); if(!h) return null;
  const params=new URLSearchParams(h.includes('&')||h.includes('=')?h:('project='+h));
  const project=params.get('project'); const slide=parseInt(params.get('slide')||'0',10);
  return (project?{project,slide:isNaN(slide)?0:slide}:null);
}

function tryOpenFromHash(){
  const info=parseHash(); if(!info) return;
  const proj=state.projects.find(p=>slugify(p.title||'project')===info.project);
  if(proj){ openProject(proj, info.slide||0); }
}
window.addEventListener('hashchange', ()=>{
  const info=parseHash();
  const modal=qs('#project-modal');
  if(!info && !modal.hidden){ closeModal(); }
  else if(info){
    const proj=state.projects.find(p=>slugify(p.title||'project')===info.project);
    if(proj){
      const isSame = state.open && slugify(state.open.title||'project')===info.project;
      if(!isSame || typeof info.slide==='number'){ openProject(proj, info.slide||0); }
    }
  }
});

// ---------- Contact form ----------
document.getElementById('contact-form')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const form=e.target; const status=document.getElementById('form-status');
  const name=form.name.value.trim(), email=form.email.value.trim(), message=form.message.value.trim();
  if(!name||!email||!message||message.length<10){status.textContent='Please complete all fields (message ≥ 10 chars).';return;}
  // Temporarily disabled - static site deployment
  status.textContent='Contact form temporarily disabled during static deployment. Please email tmille12@syr.edu directly.';
});

// ---------- Boot (load all JSON content) ----------
(async ()=>{
  const social=await loadJSON('./data/social.json'); setSocialLinks(social||{});

  const projects=await loadJSON('./data/projects.json'); state.projects=projects||[];
  const grid=document.getElementById('project-grid');
  (projects||[]).slice(0,3).forEach(p=>{
    const card=projectCard(p);
    card.addEventListener('click', ()=>openProject(p,0));
    card.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openProject(p,0); }});
    grid.appendChild(card);
  });

  // Skills chips
  const skills=await loadJSON('./data/skills.json');
  const groups=document.getElementById('skills-chips');
  const order=['Languages','Frameworks','Tools/Cloud','Coursework'];
  order.forEach(k=>{
    const arr=skills?.[k]||[]; const wrap=document.createElement('div'); wrap.innerHTML=`<h3>${k}</h3>`;
    const row=document.createElement('div'); row.style.display='flex'; row.style.flexWrap='wrap'; row.style.gap='.4rem';
    arr.forEach(s=>{const chip=document.createElement('span');chip.className='btn skill-chip';chip.textContent=s;row.appendChild(chip);});
    wrap.appendChild(row); groups.appendChild(wrap);
  });

  // Leadership & Awards
  const leaders=await loadJSON('./data/leadership.json'); const lwrap=document.getElementById('leadership-list');
  (leaders||[]).forEach(item=>{const c=document.createElement('div');c.className='card';
    c.innerHTML=`<h3>${item.title||''}</h3><p>${item.org||''} • ${item.dates||''}</p><ul>${(item.bullets||[]).map(b=>`<li>${b}</li>`).join('')}</ul>`; lwrap.appendChild(c);});
  const awards=await loadJSON('./data/awards.json'); const aw=document.getElementById('awards-list');
  (awards||[]).forEach(a=>{const c=document.createElement('div');c.className='card'; c.innerHTML=`<h3>${a.title||''}</h3><p>${a.note||''}</p>`; aw.appendChild(c);});

  // Deep-link open if hash present
  tryOpenFromHash();
})();