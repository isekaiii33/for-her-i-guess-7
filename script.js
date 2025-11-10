/* Complete script.js
   - Envelope intro with flash + sparkles
   - Smooth reveal of the card ("Hey — can I be honest with you?")
   - Yes -> result + confetti
   - Maybe later -> teleports away every time (playful)
   - Gift -> modal -> "Yes — show me" triggers heart experience
   - Heart experience: white bg + stars, center-out connection web, pulsing finish
   - After finish: glowing pulsing "S" drawn at center
*/

/* ---------------- CONFIG ---------------- */
const YOUR_NAME = "isekai";
const CRUSH_NAME = "<3";
const ACCEPT_TITLE = "Yesss! 💖";
const ACCEPT_TEXT =  `So thats it then... i am officially the luckiest person alive :D — ${YOUR_NAME}`;
const LATER_TITLE = "No worries 🙂";
const LATER_TEXT = "That's totally okay. You're amazing either way.";

/* Heart formation tuning */
const POINTS = 700;
const CONNECTIONS = 6000;
const DURATION = 4000; // ms

/* ---------------- DOM READY ---------------- */
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- DOM refs ---------- */
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn"); // "Maybe later"
  const result = document.getElementById("result");
  const resultTitle = document.getElementById("resultTitle");
  const resultText = document.getElementById("resultText");
  const confettiCanvas = document.getElementById("confetti");
  const card = document.querySelector(".card");
  const flowerPrompt = document.getElementById("flowerPrompt");
  const giveFlowerBtn = document.getElementById("giveFlowerBtn");
  const noFlowerBtn = document.getElementById("noFlowerBtn");
  const giftBtn = document.getElementById("giftBtn");

  /* ---------------- small helpers ---------------- */
  function showResult(title, text){
    resultTitle.textContent = title;
    resultText.textContent = text;
    result.classList.add("visible");
    card.classList.add("showing-result");
  }

  function runConfetti(){
    const c = confettiCanvas;
    const DPR = window.devicePixelRatio || 1;
    c.width = Math.floor(window.innerWidth * DPR);
    c.height = Math.floor(window.innerHeight * DPR);
    c.style.width = window.innerWidth + "px";
    c.style.height = window.innerHeight + "px";
    const ctx = c.getContext("2d");
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const colors = ["#ff6aa3","#ffd166","#8bf0c6","#bdb2ff","#ff8fb1"];
    const pieces = Array.from({length:120}, () => ({
      x: Math.random()*innerWidth,
      y: Math.random()*-innerHeight,
      w: 6+Math.random()*8,
      h: 8+Math.random()*10,
      vx: -2+Math.random()*4,
      vy: 2+Math.random()*5,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360, vr:-5+Math.random()*10
    }));
    let t=0;
    const id=setInterval(()=>{
      ctx.clearRect(0,0,innerWidth,innerHeight);
      for(const p of pieces){
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.06; p.rot+=p.vr;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle=p.color; ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
      }
      if(++t>200){ clearInterval(id); ctx.clearRect(0,0,innerWidth,innerHeight); }
    },16);
  }

  /* ---------------- button behaviors ---------------- */
  yesBtn && (yesBtn.onclick = () => {
    showResult(`${ACCEPT_TITLE}${CRUSH_NAME?`, ${CRUSH_NAME}`:""}`, ACCEPT_TEXT);
    runConfetti();
    if (yesBtn) yesBtn.disabled = true;
    if (noBtn) noBtn.disabled = true;
  });

  // teleport "Maybe later"
  if (noBtn){
    noBtn.addEventListener('click', (e) => {
      e.preventDefault();
      teleportElementRandom(noBtn);
    });
  }

  giftBtn && (giftBtn.onclick = () => {
    flowerPrompt.classList.remove("hidden");
    flowerPrompt.setAttribute("aria-hidden","false");
  });

  noFlowerBtn && (noFlowerBtn.onclick = () => {
    flowerPrompt.classList.add("hidden");
    flowerPrompt.setAttribute("aria-hidden","true");
  });

  giveFlowerBtn && (giveFlowerBtn.onclick = () => {
    flowerPrompt.classList.add("hidden");
    flowerPrompt.setAttribute("aria-hidden","true");
    // start heart experience
    startHeartExperience();
  });

  /* ---------------- envelope intro ---------------- */
  (function envelopeFlow(){
    const envelopeStage = document.getElementById('envelopeStage');
    const envelope = document.getElementById('envelope');
    const tapHint = document.getElementById('tapHint');

    if(!envelopeStage || !envelope || !card) return;

    function flashAndSparkle(cx, cy){
      // bright flash overlay
      const flash = document.createElement('div');
      flash.style.position = 'fixed';
      flash.style.left = 0; flash.style.top = 0;
      flash.style.width = '100%'; flash.style.height = '100%';
      flash.style.background = 'radial-gradient(circle at ' + (cx/window.innerWidth*100) + '% ' + (cy/window.innerHeight*100) + '%, rgba(255,230,240,0.95), rgba(255,200,240,0.65) 10%, rgba(0,0,0,0) 50%)';
      flash.style.zIndex = 378; flash.style.pointerEvents = 'none'; flash.style.opacity = 0;
      document.body.appendChild(flash);
      flash.animate([{opacity:0},{opacity:1},{opacity:0}], {duration:420, easing:'ease-out'}).onfinish = ()=> {
        try{ document.body.removeChild(flash); } catch(e){}
      };

      // sparkles canvas
      const burst = document.createElement('canvas');
      burst.style.position = 'fixed';
      burst.style.left = '0'; burst.style.top = '0';
      burst.width = window.innerWidth; burst.height = window.innerHeight;
      burst.style.width = window.innerWidth + 'px';
      burst.style.height = window.innerHeight + 'px';
      burst.style.zIndex = 379;
      burst.style.pointerEvents = 'none';
      document.body.appendChild(burst);
      const ctx = burst.getContext('2d');
      const DPR = window.devicePixelRatio || 1;
      ctx.setTransform(DPR,0,0,DPR,0,0);

      const particles = [];
      const colors = ['#ff7bbd','#ff4f9b','#ffd166','#ff8fb1','#fff5f8'];
      for(let i=0;i<80;i++){
        particles.push({
          x: cx,
          y: cy,
          vx: (Math.random()-0.5)*12,
          vy: (Math.random()-1.5)*12,
          r: 1 + Math.random()*5,
          col: colors[Math.floor(Math.random()*colors.length)],
          life: 50 + Math.random()*60
        });
      }
      let t = 0;
      const iid = setInterval(()=>{
        ctx.clearRect(0,0, burst.width, burst.height);
        for(const p of particles){
          p.vy += 0.45;
          p.x += p.vx; p.y += p.vy;
          p.r *= 0.995;
          ctx.beginPath();
          ctx.fillStyle = p.col;
          ctx.globalAlpha = Math.max(0, 1 - (t / (p.life + 6)));
          ctx.arc(p.x, p.y, Math.max(0.5, p.r), 0, Math.PI*2);
          ctx.fill();
        }
        t++;
        if(t > 110){
          clearInterval(iid);
          try{ document.body.removeChild(burst); } catch(e){}
        }
      }, 16);
    }

    function openEnvelope(){
      if(envelopeStage.classList.contains('opening')) return;
      envelopeStage.classList.add('opening');
      envelope.classList.add('pop');
      const r = envelope.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      flashAndSparkle(cx, cy);
      if(tapHint) tapHint.style.transition = 'opacity .25s ease', tapHint.style.opacity = 0;

      setTimeout(()=>{
        envelopeStage.classList.add('fade');
        setTimeout(()=>{
          try{ envelopeStage.parentNode && envelopeStage.parentNode.removeChild(envelopeStage); } catch(e){}
          // reveal card smoothly
          card.classList.remove('hidden');
          card.style.opacity = 0;
          card.style.transform = 'translateY(12px)';
          card.style.transition = 'opacity 420ms ease, transform 420ms cubic-bezier(.2,1,.3,1)';
          requestAnimationFrame(()=> {
            card.style.opacity = 1; card.style.transform = 'translateY(0)';
          });
          card.setAttribute('aria-hidden','false');
        }, 420);
      }, 260);
    }

    envelope.addEventListener('click', openEnvelope);
    envelope.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); } });

    setTimeout(()=> {
      if(envelopeStage && !envelopeStage.classList.contains('opening')){
        if(tapHint) { tapHint.style.opacity = 1; tapHint.style.transition = 'opacity .4s ease'; }
      }
    }, 600);
  })();

  /* ---------------- teleport helper ---------------- */
  function teleportElementRandom(el){
    // quick scale effect
    el.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(0.98)'}], {duration:280, easing:'ease-out'});
    // random position inside viewport with padding
    const padding = 14;
    const w = Math.max(72, el.offsetWidth || 80);
    const h = Math.max(32, el.offsetHeight || 36);
    const minX = padding;
    const maxX = Math.max(window.innerWidth - w - padding, padding);
    const minY = padding + 90; // avoid top area
    const maxY = Math.max(window.innerHeight - h - padding, minY + 10);
    const nx = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
    const ny = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

    el.style.position = 'fixed';
    el.style.left = nx + 'px';
    el.style.top = ny + 'px';
    el.style.zIndex = 9999;

    el.animate([
      { transform: 'translateY(-12px) scale(1.02)' },
      { transform: 'translateY(6px) scale(0.98)' },
      { transform: 'translateY(0) scale(1)' }
    ], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
  }

  /* ---------------- HEART EXPERIENCE (center-out) ---------------- */
  function startHeartExperience(){
    /* Replace body with full-canvas experience */
    document.body.innerHTML = "";
    const c = document.createElement("canvas");
    c.className = "canvas-full";
    document.body.appendChild(c);
    const ctx = c.getContext("2d");

    // sizing
    let W = innerWidth, H = innerHeight, DPR = window.devicePixelRatio || 1;
    let center = {x: W/2, y: H*0.52};
    function resize(){
      DPR = window.devicePixelRatio || 1;
      W = innerWidth; H = innerHeight;
      c.width = Math.floor(W*DPR);
      c.height = Math.floor(H*DPR);
      c.style.width = W + "px";
      c.style.height = H + "px";
      ctx.setTransform(DPR,0,0,DPR,0,0);
      center.x = W/2; center.y = H*0.52;
    }
    window.addEventListener("resize", resize);
    resize();

    // stars
    const STAR_COUNT = Math.max(60, Math.floor((W*H)/16000));
    const stars = new Array(STAR_COUNT);
    for(let i=0;i<STAR_COUNT;i++){
      stars[i] = {
        x: Math.random()*W,
        y: Math.random()*H,
        r: Math.random()*1.2 + 0.6,
        phase: Math.random()*Math.PI*2,
        speed: 0.003 + Math.random()*0.008
      };
    }

    // heart parametric function
    function heartPoint(t){
      const x = 16 * Math.pow(Math.sin(t),3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t);
      return {x, y: -y};
    }

    // generate points
    const pts = new Array(POINTS);
    const scale = Math.min(W, H) / 38;
    for(let i=0;i<POINTS;i++){
      const t = (i / POINTS) * Math.PI * 2;
      const p = heartPoint(t + (Math.random()-0.5)*0.0003);
      const rj = (Math.random()-0.5) * 1.4;
      pts[i] = {
        x: center.x + (p.x + rj * 0.36) * scale,
        y: center.y + (p.y + rj * 0.28) * scale
      };
    }

    // build connections with midpoint distance bias (center-out)
    const connList = new Array(CONNECTIONS);
    for(let k=0;k<CONNECTIONS;k++){
      const a = Math.floor(Math.random() * POINTS);
      let b;
      if(Math.random() < 0.72){
        const offset = Math.floor(((Math.random()+Math.random()+Math.random())/3 - 0.5) * POINTS * 0.08);
        b = (a + offset + POINTS) % POINTS;
      } else {
        b = Math.floor(Math.random() * POINTS);
      }
      const mx = (pts[a].x + pts[b].x) / 2;
      const my = (pts[a].y + pts[b].y) / 2;
      const dx = mx - center.x, dy = my - center.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      connList[k] = {a,b,d};
    }
    connList.sort((m,n) => m.d - n.d);
    const connections = new Uint32Array(connList.length * 2);
    for(let i=0;i<connList.length;i++){
      connections[i*2] = connList[i].a;
      connections[i*2 + 1] = connList[i].b;
    }

    const revealTotal = connections.length / 2;
    let revealed = 0;
    const startTime = performance.now();
    let finished = false;

    // streaks
    const streaks = [];
    const MAX_STREAKS = Math.min(420, Math.floor(revealTotal / 25));
    function maybeSpawnStreak(){
      if(revealed <= 0) return;
      if(streaks.length < MAX_STREAKS && Math.random() < 0.45){
        const idx = Math.floor(Math.random() * revealed);
        const ai = connections[idx*2];
        const bi = connections[idx*2 + 1];
        const a = pts[ai], b = pts[bi];
        const life = 600 + Math.random()*900;
        streaks.push({ax:a.x, ay:a.y, bx:b.x, by:b.y, start:performance.now(), life});
      }
    }

    const baseColor = [255, 30, 130];

    // main animation loop
    function loop(){
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, Math.max(0, elapsed / DURATION));
      const revealTarget = Math.floor(Math.pow(progress, 1.0) * revealTotal);
      const burst = Math.min(160, revealTarget - revealed);
      if(burst > 0) revealed += burst;

      // background (white + subtle vignette)
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0,0,W,H);
      const vg = ctx.createRadialGradient(center.x, center.y - 36, 10, center.x, center.y - 36, Math.max(W,H)*0.7);
      vg.addColorStop(0, 'rgba(255,255,255,1)');
      vg.addColorStop(0.6, 'rgba(245,245,250,0.98)');
      vg.addColorStop(1, 'rgba(230,230,235,0.96)');
      ctx.fillStyle = vg; ctx.fillRect(0,0,W,H);

      // stars (behind)
      for(let s=0;s<stars.length;s++){
        const st = stars[s];
        st.phase += st.speed * (1 + Math.sin(now * 0.001) * 0.5);
        const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(st.phase));
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,240,210,${(a*0.9).toFixed(3)})`;
        ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
        ctx.fill();
      }

      // draw revealed connections (heart web)
      ctx.lineCap = 'round';
      for(let i=0; i<revealed; i++){
        const ai = connections[i*2];
        const bi = connections[i*2 + 1];
        const A = pts[ai], B = pts[bi];
        const rel = i / revealTotal;
        const alpha = 0.32 * Math.min(1, 1.6 - Math.abs(progress - rel) * 1.9);
        const width = 0.6 + (1 - rel) * 1.4;

        ctx.beginPath();
        ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y);
        ctx.strokeStyle = `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},${alpha.toFixed(3)})`;
        ctx.lineWidth = width;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y);
        ctx.strokeStyle = `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},${(alpha*0.18).toFixed(3)})`;
        ctx.lineWidth = width * 6.0;
        ctx.stroke();
      }

      if(!finished){
        if(Math.random() < 0.48) maybeSpawnStreak();
      } else {
        if(Math.random() < 0.08) maybeSpawnStreak();
      }

      // draw streaks
      for(let s = streaks.length - 1; s >= 0; s--){
        const st = streaks[s];
        const tfrac = (now - st.start) / st.life;
        if(tfrac >= 1){ streaks.splice(s,1); continue; }
        const ease = 1 - Math.pow(1 - tfrac, 3);
        const x = st.ax + (st.bx - st.ax) * ease;
        const y = st.ay + (st.by - st.ay) * ease;
        const back = Math.max(0.015, 0.06 * (1 - tfrac));
        const xb = st.ax + (st.bx - st.ax) * Math.max(0, ease - back);
        const yb = st.ay + (st.by - st.ay) * Math.max(0, ease - back);

        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(xb, yb);
        const g = ctx.createLinearGradient(x, y, xb, yb);
        g.addColorStop(0, `rgba(255,225,245,${(1 - tfrac).toFixed(3)})`);
        g.addColorStop(1, `rgba(${baseColor[0]},${baseColor[1]},${baseColor[2]},0.06)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 2.6;
        ctx.stroke();
      }

      // finished detection
      if(!finished && revealed >= revealTotal){
        finished = true;
        for(let i=0;i<Math.min(400, MAX_STREAKS); i++) maybeSpawnStreak();
      }

      // pulse overlay when finished
      if(finished){
        const pulse = 0.94 + Math.sin(now * 0.0028) * 0.06;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const glow = ctx.createRadialGradient(center.x, center.y - 36, 0, center.x, center.y - 36, Math.max(W,H)*0.45);
        glow.addColorStop(0, `rgba(255,66,140,${0.12 * pulse})`);
        glow.addColorStop(0.6, `rgba(255,66,140,${0.03 * pulse})`);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.fillRect(0,0,W,H);
        ctx.restore();

        // draw glowing letter S at center (pulsing)
        const now2 = performance.now();
        const sPulse = 0.98 + Math.sin(now2 * 0.0038) * 0.06;
        ctx.save();
        // choose font size relative to screen
        const sSize = Math.min(W, H) * 0.18 * sPulse;
        ctx.font = `bold ${Math.floor(sSize)}px "Segoe UI", Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        // gradient fill
        const g = ctx.createLinearGradient(center.x - sSize*0.5, center.y - sSize*0.5, center.x + sSize*0.5, center.y + sSize*0.5);
        g.addColorStop(0, "#ff007f");
        g.addColorStop(0.5, "#ff3b94");
        g.addColorStop(1, "#ff9bbf");
        ctx.fillStyle = g;
        // shadow/glow
        ctx.shadowColor = "rgba(255,70,140,0.9)";
        ctx.shadowBlur = 36 * (sPulse);
        // slight outer stroke for crispness
        ctx.lineWidth = Math.max(2, Math.floor(sSize * 0.04));
        ctx.strokeStyle = `rgba(255,140,180,0.6)`;
        ctx.strokeText("S", center.x, center.y + (sSize*0.04));
        ctx.fillText("S", center.x, center.y + (sSize*0.04));
        ctx.restore();
      }

      requestAnimationFrame(loop);
    } // end loop

    loop();
  } // end startHeartExperience

  // expose global so other code can call it (buttons earlier rely on it)
  window.startHeartExperience = startHeartExperience;

}); // DOMContentLoaded end

/* ---------------- NOTES ----------------
- If performance is heavy on phone, reduce POINTS & CONNECTIONS.
- Letter "S" can be replaced by any character or an image by editing draw code inside finished block.
--------------------------------------- */
