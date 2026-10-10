document.addEventListener('DOMContentLoaded', () => {
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

  // Intro fades after a short opening; the skip button makes it accessible.
  const intro = $('#intro');
  const hideIntro = () => intro?.classList.add('intro-hidden');
  const introTimer = setTimeout(hideIntro, 5200);
  $('#skipIntro')?.addEventListener('click', () => { clearTimeout(introTimer); hideIntro(); });

  // Floating hearts.
  const heartsContainer = $('#hearts');
  function createHeart() {
    if (!heartsContainer || document.hidden) return;
    const heart = document.createElement('span'); heart.className='heart'; heart.textContent=Math.random()>.5?'♥':'♡';
    heart.style.left=`${Math.random()*100}vw`; heart.style.fontSize=`${12+Math.random()*17}px`; heart.style.animationDuration=`${5+Math.random()*5}s`;
    heartsContainer.appendChild(heart); setTimeout(()=>heart.remove(),10500);
  }
  const heartInterval = setInterval(createHeart, 1100);
  window.addEventListener('pagehide',()=>clearInterval(heartInterval),{once:true});

  // Music starts at the requested segment when metadata is available. Browsers may require a tap.
  const music=$('#bgMusic'), musicBtn=$('#musicBtn'), musicLabel=$('#musicLabel');
  const songStartTime=115, songEndTime=205;
  function updateMusicButton(){ if(!musicBtn)return; const playing=music && !music.paused; if(musicLabel)musicLabel.textContent=playing?'Pause music':'Play music'; musicBtn.setAttribute('aria-label',playing?'Pause birthday music':'Play birthday music'); }
  if(music){
    music.volume=.55;
    music.addEventListener('loadedmetadata',()=>{if(Number.isFinite(music.duration)&&music.duration>songStartTime){try{music.currentTime=songStartTime}catch(e){}}});
    music.addEventListener('timeupdate',()=>{if(music.currentTime>=songEndTime){music.pause();updateMusicButton();}});
    music.addEventListener('play',updateMusicButton); music.addEventListener('pause',updateMusicButton);
    musicBtn?.addEventListener('click',async()=>{try{if(music.paused){if(music.currentTime===0&&music.duration>songStartTime)music.currentTime=songStartTime;await music.play()}else music.pause()}catch(e){if(musicLabel)musicLabel.textContent='Tap to play';}updateMusicButton()});
  }

  // Chiku stays in the hero and only says two short lines; no second teddy or story sequence.
  const chiku=$('#chiku'), bubble=$('#chikuBubble');
  if(chiku&&bubble){
    setTimeout(()=>{bubble.textContent="Hi! I'm Chiku 🧸";chiku.classList.add('waving')},1800);
    setTimeout(()=>{bubble.textContent='Happy Birthday! Make a lovely wish ✨';chiku.classList.remove('waving');void chiku.offsetWidth;chiku.classList.add('waving')},6500);
    setTimeout(()=>{bubble.textContent='I’ll stay right here with you ♡';chiku.classList.remove('waving')},10500);
    setInterval(()=>{chiku.classList.add('waving');setTimeout(()=>chiku.classList.remove('waving'),2200)},11000);
  }
  $('#heroContinue')?.addEventListener('click',()=>$('#letter')?.scrollIntoView({behavior:'smooth',block:'start'}));

  // Countdown to 4 December 2026. After the date, show a completed state.
  const targetDate=new Date('2026-12-04T00:00:00');
  function updateCountdown(){const now=new Date();let diff=targetDate-now;const values={days:0,hours:0,minutes:0,seconds:0};if(diff>0){values.days=Math.floor(diff/86400000);values.hours=Math.floor(diff%86400000/3600000);values.minutes=Math.floor(diff%3600000/60000);values.seconds=Math.floor(diff%60000/1000)}else{values.days=0;values.hours=0;values.minutes=0;values.seconds=0}Object.entries(values).forEach(([id,value])=>{const el=$('#'+id);if(el)el.textContent=String(value).padStart(2,'0')});}
  updateCountdown();setInterval(updateCountdown,1000);

  // Typewriter letter.
  const envelope=$('#envelope'), openLetter=$('#openLetter'), typedLetter=$('#typedLetter');
  const message=`Meri Laado,\n\nAaj ka din mere liye sirf tumhara birthday nahi hai. Ye ek reminder hai ki duniya mein tumhara hona kitna beautiful hai.\n\nTumhari smile, tumhari little habits, hamari random baatein aur woh saare chhote moments jo shayad normal lagte hain... mere liye woh sab memories hain jinhe main hamesha yaad rakhna chahta hoon.\n\nI hope this new year of your life brings you endless happiness, peace, success and beautiful moments.\n\nKabhi apni smile khona mat. Keep shining. Keep smiling.\n\nHappy Birthday, Meri Laado ❤️`;
  let letterOpened=false, typingTimer=null;
  function stopTyping(){if(typingTimer){clearTimeout(typingTimer);typingTimer=null}}
  function typeLetter(){if(!typedLetter)return;stopTyping();typedLetter.textContent='';let i=0;const typeNext=()=>{if(i>=message.length){typingTimer=null;return}typedLetter.textContent+=message.charAt(i++);typingTimer=setTimeout(typeNext,25)};typeNext()}
  openLetter?.addEventListener('click',()=>{if(!envelope)return;if(letterOpened){stopTyping();envelope.classList.remove('open');openLetter.textContent='Open My Letter 💌';letterOpened=false;if(typedLetter)typedLetter.textContent='';return}envelope.classList.add('open');openLetter.textContent='Close Letter 💕';letterOpened=true;setTimeout(typeLetter,850)});

  // Wish, candle flames, confetti and fireworks.
  const cake=$('#birthdayCake'), wishBtn=$('#wishBtn'), wishComplete=$('#wishCompleteMessage'), canvas=$('#cakeFireworks');let wishMade=false;
  function createConfetti(){const colors=['#9d6545','#c28b68','#e0b895','#f1d6ba','#79503b','#b77c58','#b96861'];for(let i=0;i<75;i++){const piece=document.createElement('i');piece.className='confetti-piece';piece.style.left=`${Math.random()*100}vw`;piece.style.setProperty('--confetti-x',`${(Math.random()-.5)*300}px`);piece.style.animationDelay=`${Math.random()*.7}s`;piece.style.animationDuration=`${3+Math.random()*2}s`;piece.style.background=colors[Math.floor(Math.random()*colors.length)];document.body.appendChild(piece);setTimeout(()=>piece.remove(),6500)}}
  function launchFireworks(){if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;const rect=canvas.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height),dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);const particles=[];function burst(x,y){for(let i=0;i<44;i++){const a=Math.PI*2/44*i,s=1.5+Math.random()*3;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:.014+Math.random()*.012,size:1.2+Math.random()*2.1,color:['#b77c58','#d99b8c','#e4bd83','#fff0d8'][i%4]})}}for(let i=0;i<5;i++)setTimeout(()=>burst(w*(.18+Math.random()*.64),h*(.15+Math.random()*.28)),i*280);function draw(){ctx.clearRect(0,0,w,h);for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.035;p.life-=p.decay;if(p.life<=0){particles.splice(i,1);continue}ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;if(particles.length)requestAnimationFrame(draw);else ctx.clearRect(0,0,w,h)}draw()}
  wishBtn?.addEventListener('click',()=>{if(wishMade)return;wishMade=true;$$('.flame',cake||document).forEach((flame,i)=>setTimeout(()=>flame.classList.add('flame-out'),i*90));setTimeout(()=>{cake?.classList.add('cake-celebrate');setTimeout(()=>cake?.classList.remove('cake-celebrate'),1400)},250);const text=$('.wish-text',wishBtn),icon=$('.wish-icon',wishBtn),arrow=$('.wish-arrow',wishBtn);if(text)text.textContent='Wish made ✨';if(icon)icon.textContent='♡';if(arrow)arrow.textContent='✓';wishBtn.setAttribute('aria-label','Birthday wish completed');setTimeout(()=>wishComplete?.classList.add('show'),650);setTimeout(createConfetti,300);setTimeout(launchFireworks,400)});

  // Graceful handling for absent local photo files; keep cards attractive instead of broken-image icons.
  $$('.memory-card img').forEach(img=>img.addEventListener('error',()=>{img.style.opacity='0';img.parentElement.style.background='linear-gradient(135deg,#ead5c1,#f6e9dc)';const label=img.parentElement.parentElement.querySelector('.memory-overlay');if(label){label.style.background='linear-gradient(transparent,#70453630)';}}));
  // Small heart on non-button clicks.
  document.addEventListener('click',event=>{if(event.target.closest('button,a,video'))return;const heart=document.createElement('span');heart.textContent='♥';heart.style.cssText=`position:fixed;left:${event.clientX}px;top:${event.clientY}px;z-index:9999;pointer-events:none;color:#b96861;font-size:20px;transition:transform 1s ease,opacity 1s ease`;document.body.appendChild(heart);requestAnimationFrame(()=>{heart.style.transform='translateY(-70px) scale(1.5)';heart.style.opacity='0'});setTimeout(()=>heart.remove(),1100)});
});
