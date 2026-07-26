(function(){
  const $ = (q, el=document) => el.querySelector(q);
  const $$ = (q, el=document) => Array.from(el.querySelectorAll(q));

  function setupPwToggle(){
    $$('.pw-toggle').forEach((btn)=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-toggle');
        const input = document.getElementById(id);
        if(!input) return;
        const isPwd = input.type === 'password';
        input.type = isPwd ? 'text' : 'password';
        const t = btn.querySelector('.pw-text');
        if(t) t.textContent = isPwd ? 'Hide' : 'Show';
        btn.setAttribute('aria-label', isPwd ? 'Hide password' : 'Show password');
      });
    });
  }

  function scoreStrength(pw){
    let score = 0;
    const len = pw.length;
    if(len >= 8) score += 25;
    if(len >= 12) score += 15;
    if(/[A-Z]/.test(pw)) score += 20;
    if(/[a-z]/.test(pw)) score += 10;
    if(/[0-9]/.test(pw)) score += 20;
    if(/[^A-Za-z0-9]/.test(pw)) score += 20;
    return Math.max(0, Math.min(100, score));
  }

  function meterUpdate(){
    const pw = $('#password');
    const fill = $('.pw-strength-fill');
    const text = $('#pw-strength-text');
    const hint = $('#pw-strength-hint');
    const w = $('#pw-state-weak');
    const m = $('#pw-state-med');
    const sEl = $('#pw-state-strong');
    if(!pw || !fill || !text || !hint || !w || !m || !sEl) return;

    const val = pw.value;
    const score = scoreStrength(val);

    // defaults
    w.classList.remove('is-active');
    m.classList.remove('is-active');
    sEl.classList.remove('is-active');

    if(val.length === 0){
      fill.style.width = '8%';
      fill.style.background = 'linear-gradient(90deg, rgba(255,255,255,.35), rgba(109,40,217,.45))';
      text.textContent = '—';
      hint.textContent = 'Use 8+ chars, a number, and a symbol.';
      return;
    }

    let label = 'Weak';
    let msg = 'Use 8+ chars, a number, and a symbol.';
    let color = 'linear-gradient(90deg, rgba(239,68,68,.95), rgba(109,40,217,.85))';
    let width = 28;

    if(score >= 80){
      label = 'Strong';
      msg = 'Excellent! Your password looks strong.';
      color = 'linear-gradient(90deg, rgba(34,211,238,.95), rgba(109,40,217,.90))';
      width = 100;
      sEl.classList.add('is-active');
    } else if(score >= 55){
      label = 'Medium';
      msg = 'Nice. Add a symbol or increase length for extra strength.';
      color = 'linear-gradient(90deg, rgba(167,139,250,.95), rgba(37,99,235,.85))';
      width = 65;
      m.classList.add('is-active');
    } else {
      label = 'Weak';
      msg = 'Use 8+ chars, add numbers, and include a symbol.';
      color = 'linear-gradient(90deg, rgba(239,68,68,.95), rgba(109,40,217,.85))';
      width = 38;
      w.classList.add('is-active');
    }

    text.textContent = label;
    hint.textContent = msg;
    fill.style.width = width + '%';
    fill.style.background = color;
  }


  function validate(form){
    const full = $('#full_name', form);
    const email = $('#email', form);
    const mobile = $('#mobile', form);
    const cls = $('#class_level', form);
    const board = $('#board', form);
    const pw = $('#password', form);
    const cpw = $('#confirm_password', form);

    if(full && !full.value.trim()){ full.focus(); return false; }
    if(email && !email.value.trim()){ email.focus(); return false; }
    if(mobile){
      const v = mobile.value.trim();
      if(!/^\d{10}$/.test(v)){ mobile.focus(); return false; }
    }
    if(cls && !cls.value){ cls.focus(); return false; }
    if(board && !board.value){ board.focus(); return false; }
    if(pw && pw.value.length < 8){ pw.focus(); return false; }
    if(cpw && pw.value !== cpw.value){ cpw.focus(); return false; }

    return true;
  }

  function setupRipple(btn){
    btn.addEventListener('pointerdown', (e)=>{
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      btn.style.setProperty('--x', x + '%');
      btn.style.setProperty('--y', y + '%');
    });
  }

  function setupSubmit(btn){
    setupRipple(btn);
    const form = btn.closest('form');
    if(!form) return;

    form.addEventListener('submit', (ev)=>{
      if(!validate(form)){
        ev.preventDefault();
        btn.animate([{transform:'translateY(-1px)'},{transform:'translateY(0px)'}],{duration:220, easing:'ease-out'});
        return;
      }
      const loader = $('.btn-loader', btn);
      const content = $('.btn-content', btn);
      if(loader) loader.hidden = false;
      if(content) content.style.opacity = .85;
      btn.disabled = true;
      btn.style.cursor = 'not-allowed';
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    setupPwToggle();
    meterUpdate();

    $('#password')?.addEventListener('input', meterUpdate);
    $('#confirm_password')?.addEventListener('input', meterUpdate);

    const btn = $('#signupBtn');
    if(btn) setupSubmit(btn);
  });
})();

