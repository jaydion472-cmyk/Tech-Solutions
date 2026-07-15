(function(){
  document.documentElement.classList.add('js');

  // ── Hero carousel ──
  var slides=document.querySelectorAll('.hc-slide');
  var dots=document.querySelectorAll('.hc-dot');
  var cur=0,timer=null;
  function goTo(i){
    cur=(i+slides.length)%slides.length;
    slides.forEach(function(s,idx){
      s.classList.toggle('active',idx===cur);
      var v=s.querySelector('video');
      if(v){if(idx===cur){v.currentTime=0;v.play().catch(function(){});}else{v.pause();}}
    });
    dots.forEach(function(d,idx){d.classList.toggle('active',idx===cur);});
  }
  function resetTimer(){
    if(timer)clearTimeout(timer);
    (function tick(){
      var dwell=slides[cur].querySelector('video')?9600:4800;
      timer=setTimeout(function(){goTo(cur+1);tick();},dwell);
    })();
  }
  if(slides.length){
    dots.forEach(function(d){d.addEventListener('click',function(){goTo(parseInt(d.dataset.slide,10));resetTimer();});});
    var prevB=document.getElementById('hc-prev'),nextB=document.getElementById('hc-next');
    if(prevB)prevB.addEventListener('click',function(){goTo(cur-1);resetTimer();});
    if(nextB)nextB.addEventListener('click',function(){goTo(cur+1);resetTimer();});
    var reduceMotionC=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(reduceMotionC){
      slides.forEach(function(s){var v=s.querySelector('video');if(v){v.removeAttribute('autoplay');v.pause();}});
    }else{
      resetTimer();
    }
  }

  // ── Vertical photo sliders ──
  var reduceMotionV=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!reduceMotionV){
    document.querySelectorAll('.vslide').forEach(function(sl,si){
      var imgs=sl.querySelectorAll('img');
      if(imgs.length<2)return;
      var cur=0;
      setInterval(function(){
        var next=(cur+1)%imgs.length;
        var out=imgs[cur],inn=imgs[next];
        inn.style.transition='none';inn.style.transform='translateY(100%)';
        void inn.offsetHeight;
        inn.style.transition='';
        out.style.transform='translateY(-100%)';
        inn.style.transform='translateY(0)';
        setTimeout(function(){
          out.style.transition='none';out.style.transform='translateY(100%)';
          void out.offsetHeight;out.style.transition='';
        },900);
        cur=next;
      },4200+si*700);
    });
  }

  // ── Mobile nav ──
  var navToggle=document.getElementById('nav-toggle'),mainNav=document.getElementById('main-nav');
  if(navToggle&&mainNav){
    navToggle.addEventListener('click',function(){
      var open=mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded',open);
    });
    mainNav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mainNav.classList.remove('open');navToggle.setAttribute('aria-expanded','false');});});
    document.addEventListener('click',function(e){if(!mainNav.contains(e.target)&&!navToggle.contains(e.target)){mainNav.classList.remove('open');navToggle.setAttribute('aria-expanded','false');}});
  }

  // ── Contact dropdown ──
  var cMenu=document.getElementById('contact-menu'),cBtn=document.getElementById('contact-btn');
  if(cMenu&&cBtn){
    cBtn.addEventListener('click',function(e){e.stopPropagation();var open=cMenu.classList.toggle('open');cBtn.setAttribute('aria-expanded',open);});
    cMenu.querySelectorAll('.contact-dropdown a').forEach(function(a){a.addEventListener('click',function(){cMenu.classList.remove('open');cBtn.setAttribute('aria-expanded','false');});});
    document.addEventListener('click',function(e){if(!cMenu.contains(e.target)){cMenu.classList.remove('open');cBtn.setAttribute('aria-expanded','false');}});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){cMenu.classList.remove('open');cBtn.setAttribute('aria-expanded','false');}});
  }

  // ── Nav active on scroll ──
  var navLinks=document.querySelectorAll('nav a[href^="#"]');
  if(navLinks.length&&window.IntersectionObserver){
    var nObs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(!e.isIntersecting)return;var id=e.target.id;navLinks.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+id);});});},{rootMargin:'-35% 0px -60% 0px'});
    navLinks.forEach(function(a){var el=document.getElementById(a.getAttribute('href').slice(1));if(el)nObs.observe(el);});
  }

  // ── Scroll reveal ──
  var reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!reduceMotion&&window.IntersectionObserver){
    var revEls=document.querySelectorAll('.reveal');
    var rObs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');rObs.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -6% 0px'});
    revEls.forEach(function(el){
      if(el.getBoundingClientRect().bottom<0){el.classList.add('in');}
      else{rObs.observe(el);}
    });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
  }

  // ── Numbered accordion (one open at a time, climate-style) ──
  document.querySelectorAll('.acc-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.closest('.acc-item');
      var wasOpen=item.classList.contains('open');
      item.parentElement.querySelectorAll('.acc-item').forEach(function(i){
        i.classList.remove('open');
        i.querySelector('.acc-btn').setAttribute('aria-expanded','false');
      });
      if(!wasOpen){item.classList.add('open');btn.setAttribute('aria-expanded','true');}
    });
  });

  // ── FAQ ──
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=btn.closest('.faq-item');
      var open=item.classList.toggle('open');
      btn.setAttribute('aria-expanded',open);
    });
  });

  // ── Contact form ──
  var form=document.getElementById('contact-form-el'),formSuccess=document.getElementById('form-success'),submitBtn=document.getElementById('submit-btn'),submitText=document.getElementById('submit-text'),submitSpinner=document.getElementById('submit-spinner');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return;}
      submitBtn.disabled=true;submitText.textContent='Sending…';submitSpinner.style.display='block';
      var FORM_ENDPOINT='https://formsubmit.co/ajax/jaymuanja64@gmail.com';
      function showSuccess(){form.style.display='none';formSuccess.style.display='block';}
      if(FORM_ENDPOINT){
        var payload={};new FormData(form).forEach(function(v,k){payload[k]=v;});
        fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)})
        .then(function(r){if(r.ok)showSuccess();else throw new Error();})
        .catch(function(){window.location.href='mailto:hello@techsolutionsagents.com?subject=Farm+enquiry';submitBtn.disabled=false;submitText.textContent='Send message';submitSpinner.style.display='none';});
      } else {setTimeout(showSuccess,800);}
    });
  }
})();
