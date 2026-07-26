(function(){
  const $ = (q, el=document) => el.querySelector(q);
  const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

  function setupRipple(btn){
    btn.addEventListener('pointerdown', (e)=>{
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      btn.style.setProperty('--x', x + '%');
      btn.style.setProperty('--y', y + '%');
    });
  }

  function setupPwToggle(){
    $$('.pw-toggle').forEach((btn)=>{
      btn.addEventListener('click', ()=>{
        const key = btn.getAttribute('data-toggle');
        const input = document.getElementById(key);
        if(!input) return;
        const isPwd = input.type === 'password';
        input.type = isPwd ? 'text' : 'password';
        btn.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
        const t = btn.querySelector('.pw-text');
        if(t) t.textContent = isPwd ? 'Hide' : 'Show';
      });
    });
  }

  function validateLogin(form){
    const username = $('#email', form);
    const password = $('#password', form);

    if(username && !username.value.trim()){
      username.focus();
      return false;
    }
    if(password && password.value.length < 6){
      password.focus();
      return false;
    }
    return true;
  }

  function setupSubmit(btn){
    setupRipple(btn);
    btn.addEventListener('click', (e)=>{
      // ripple already handled by pointerdown; prevent double-loading via submit state
    });
    const form = btn.closest('form');
    if(!form) return;

    form.addEventListener('submit', (ev)=>{
      if(!validateLogin(form)){
        ev.preventDefault();
        btn.animate([{transform:'translateY(-1px)'},{transform:'translateY(0px)'}],{duration:220, easing:'ease-out'});
        return;
      }
      const loader = $('.btn-loader', btn);
      const content = $('.btn-content', btn);
      loader.hidden = false;
      if(content) content.style.opacity = .85;
      btn.disabled = true;
      btn.style.cursor = 'not-allowed';
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    setupPwToggle();
    const btn = $('#loginBtn');
    if(btn) setupSubmit(btn);

    // Focus animations
    $$('input').forEach((inp)=>{
      inp.addEventListener('focus', ()=>{
        const p = inp.closest('.control');
        if(p) p.classList.add('focused');
      });
      inp.addEventListener('blur', ()=>{
        const p = inp.closest('.control');
        if(p) p.classList.remove('focused');
      });
    });

    // Social buttons UI-only
    $$('.social-btn').forEach((b)=>{
      b.addEventListener('click', ()=>{
        b.animate([{transform:'translateY(0)'},{transform:'translateY(-2px)'},{transform:'translateY(0)'}],{duration:260, easing:'ease-out'});
      });
    });
  });
})();

