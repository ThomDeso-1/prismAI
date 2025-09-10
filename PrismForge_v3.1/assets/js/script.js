/* script.js — PrismForge interactivity: nav active, theme toggle, card previews, bot demos, chatbot widget */
document.addEventListener('DOMContentLoaded', () => {
  // 1) set year placeholders
  const y = new Date().getFullYear();
  document.querySelectorAll('[id^=year]').forEach(el => el.textContent = y);

  // 2) NAV: mark active link by filename
  const links = document.querySelectorAll('.nav-link');
  const page = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    if (a.getAttribute('href') === page) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    } else {
      a.classList.remove('active');
      a.removeAttribute('aria-current');
    }
  });

  // NAVBAR TOGGLE
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
  // // 3) THEME toggle: toggle .light / .dark classes on body
  // document.querySelectorAll('[id^=theme-toggle]').forEach(btn => {
  //   btn.addEventListener('click', () => {
  //     document.body.classList.toggle('light');
  //     document.body.classList.toggle('dark');
  //     const pressed = document.body.classList.contains('light');
  //     btn.setAttribute('aria-pressed', pressed ? 'true' : 'false');
  //   });
  // });

  // DARK MODE TOGGLE FIX
  const themeToggle = document.querySelector("#theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  // 4) CARD preview toggles
  document.querySelectorAll('.card-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const back = card.querySelector('.card-back');
      if (!back) return;
      if (back.hasAttribute('hidden')) back.removeAttribute('hidden');
      else back.setAttribute('hidden','');
    });
  });

  // 5) PrismBot in-page demo (bot area)
  (function setupInPageBot(){
    const log = document.getElementById('bot-log');
    const input = document.getElementById('bot-query');
    const send = document.getElementById('bot-send');
    const canned = [
      "Hi — I'm Prism, a demo assistant. Ask about pricing, prototypes, or privacy.",
      "We usually start with a 1–2 week prototype to validate impact.",
      "Chatbots use RAG + human handoff for safe operations."
    ];
    function push(msg, who='b'){
      if(!log) return;
      const d = document.createElement('div');
      d.className = who === 'u' ? 'u' : 'b';
      d.textContent = msg;
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
    }
    if (log && log.children.length === 0) push("Hi — I'm Prism. Try 'pricing' or 'privacy'.");

    if (send) {
      send.addEventListener('click', () => {
        const t = input.value.trim();
        if (!t) return;
        push(t, 'u');
        input.value = '';
        setTimeout(() => {
          const txt = t.toLowerCase();
          if (/price|pricing|cost/.test(txt)) push("We start with prototypes; pricing depends on scope — book a consult for a scoped estimate.");
          else if (/chat|bot|rag/.test(txt)) push("We build RAG-powered chat demos with analytics and handoff.");
          else if (/privacy|hipaa|soc2|security/.test(txt)) push("We design least-privilege flows and data controls for prototypes.");
          else push(canned[Math.floor(Math.random() * canned.length)]);
        }, 420);
      });
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send.click(); });
    }
  })();

  // 6) CHATBOT widget: toggle + minimize + multi-bubble replies
  (function setupWidget(){
    const togg = document.getElementById('chatbot-toggle');
    const minBtn = document.getElementById('chatbot-minimize');
    const body = document.getElementById('chatbot-body');
    const input = document.getElementById('chat-input');
    const log = document.getElementById('chat-messages');

    const quick = [
      {re: /price|pricing|cost/, msg: "We start with 1–2 week prototypes; pricing depends on scope."},
      {re: /chat|bot|rag/, msg: "RAG chat + analytics; human handoff is recommended."},
      {re: /automation|workflow|crm|schedule/, msg: "Automation prototypes focus on routing, drafts, and exports."},
      {re: /privacy|hipaa|soc2|security/, msg: "We apply least-privilege, encryption, and data hygiene during prototypes."}
    ];

    function append(text, who='b'){
      if(!log) return;
      const el = document.createElement('div');
      el.className = who === 'u' ? 'chat-u' : 'chat-b';
      el.textContent = text;
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
    }

    if (log && log.children.length === 0) append("PrismBot demo — ask about pricing, chatbots, or privacy.");

    // toggle expand/collapse
    if (togg) togg.addEventListener('click', () => {
      const hidden = body.hasAttribute('hidden');
      if (hidden) {
        body.removeAttribute('hidden');
        togg.setAttribute('aria-expanded', 'true');
        input && input.focus();
      } else {
        body.setAttribute('hidden','');
        togg.setAttribute('aria-expanded', 'false');
      }
    });

    // minimize toggles body hidden (keeps header visible)
    if (minBtn) minBtn.addEventListener('click', () => {
      if (body.hasAttribute('hidden')) body.removeAttribute('hidden'); else body.setAttribute('hidden','');
    });

    // input handling
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        const t = input.value.trim();
        if (!t) return;
        append(t, 'u');
        input.value = '';
        setTimeout(() => {
          let matched = false;
          for (const q of quick) {
            if (q.re.test(t.toLowerCase())) {
              append(q.msg, 'b'); matched = true; break;
            }
          }
          if (!matched) {
            append("Great question — book a consult for a tailored plan.", 'b');
            // optionally append a second supporting sentence
            setTimeout(() => append("I can explain services, demos, or next steps.", 'b'), 300);
          }
        }, 320);
      });
    }
  })();

  // 7) small particle-ish animation for any hero SVG with ID 'prism' (non-essential)
  (function animatePrism(){
    try {
      const svg = document.getElementById('prism');
      if (!svg) return;
      const layer = svg.querySelector('#particles');
      if (!layer) return;
      // create small circles
      for (let i=0;i<12;i++){
        const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('r', (Math.random()*2.5 + 0.8).toFixed(2));
        c.setAttribute('cx', Math.random()*520 + 30);
        c.setAttribute('cy', Math.random()*320 + 20);
        c.setAttribute('fill', i%2? '#6b7cff' : '#00d8c2');
        c.setAttribute('opacity', 0.45*Math.random());
        layer.appendChild(c);
      }
      // subtle motion loop
      let t=0;
      setInterval(()=>{ t+=0.02; layer.querySelectorAll('circle').forEach((c,idx) => {
        const ox = parseFloat(c.getAttribute('cx'));
        const oy = parseFloat(c.getAttribute('cy'));
        c.setAttribute('cx', (ox + Math.sin(t + idx)*0.4).toFixed(2));
        c.setAttribute('cy', (oy + Math.cos(t + idx)*0.3).toFixed(2));
      }); }, 70);
    } catch(e){ /* ignore if SVG not present */ }
  })();

  // HERO PARALLAX EFFECT
const hero = document.querySelector('.hero');

if (hero) {
  hero.addEventListener('mousemove', (e) => {
    const { offsetWidth: width, offsetHeight: height } = hero;
    const x = (e.offsetX / width) - 0.5;
    const y = (e.offsetY / height) - 0.5;

    hero.style.backgroundPosition = `${50 + x * 10}% ${50 + y * 10}%`;
  });

  // Reset on mouse leave
  hero.addEventListener('mouseleave', () => {
    hero.style.backgroundPosition = "center";
  });
}

});
