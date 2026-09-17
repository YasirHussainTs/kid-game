'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const outfits=[['Cloud blue','Hello, sunshine! ☀️'],['Candy pink','Pink makes me smile! ♡'],['Ocean blue','Ooooh! A sea of sparkles! ✨'],['Mint wink','Wink, wink! Your turn! 😉'],['Giggly purple','Hehe! This is so much fun!'],['Sunny yellow','Yaaay! Let’s celebrate! 🎉']];
const adventures=[['🧺','Happy picnic','A colourful day outside!',3],['🎂','Birthday party','Time for cake and giggles!',1],['🎈','Balloon parade','Let’s bring the sunshine!',5]];
const endings=[['Yay! Let’s go on our picnic!','Our outfits are ready. Time for a lovely day outside!','Pack the snacks and bring your biggest smile! 🧺'],['Yay! Let’s go to the party!','We’re dressed and ready. Let’s celebrate!','Cake, games and lots of giggles are waiting! 🎂'],['Yay! Let’s join the parade!','Our colourful looks are ready. Off we go!','Bring your balloons and your happy dance! 🎈']];
const palettes={Blush:[['Strawberry','#ed759d'],['Peachy','#ed9b73'],['Rosy','#cf6895'],['Lilac','#b58dd6']],Lips:[['Cherry','#bd456d'],['Berry','#97436f'],['Peach','#d47969'],['Rose','#b6657a']],Sparkle:[['Gold star','#ffe171'],['Pink star','#f7a4dc'],['Blue star','#7ce6ff'],['Magic star','#c7a2ff']]};
const state={mode:'easy',step:0,style:0,occasion:0,tool:'Blush',shade:0,intensity:.3,makeup:{},brushes:0,earned:[false,false,false],sound:false};
const canvas=$('#portrait'),ctx=canvas.getContext('2d'),sprite=new Image();let ready=false,timer,bopTimer,audioCtx,introFrame=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');clearTimeout(timer);timer=setTimeout(()=>$('#toast').classList.remove('show'),2100)}
function sound(kind='tap'){if(!state.sound)return;try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume();const notes=kind==='win'?[523,659,784,1047]:kind==='star'?[784,988]:[660];notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain(),t=audioCtx.currentTime+i*.12;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.045,t);g.gain.exponentialRampToValueAtTime(.001,t+.25);o.connect(g);g.connect(audioCtx.destination);o.start(t);o.stop(t+.26)})}catch{}}
function bop(){canvas.classList.remove('bop');void canvas.offsetWidth;canvas.classList.add('bop');clearTimeout(bopTimer);bopTimer=setTimeout(()=>canvas.classList.remove('bop'),680)}
function requiredBrushes(){return state.mode==='easy'?3:5}
function setStep(n){state.step=n;for(const i of [0,1,2,4])$('#panel'+i).hidden=i!==n;canvas.classList.toggle('dance',n===4);if(n===1){const target=adventures[state.occasion][3];$('#dress-clue').textContent=state.mode==='challenge'?'Colour clue: choose '+outfits[target][0]+'!':'Pick your favourite outfit!';$('#reaction').textContent='Which outfit shall we try? 🌈'}if(n===2){$('#reaction').textContent='Tap, tap! A little colour! 🖌';updateBrush()}if(n===4){const end=endings[state.occasion];$('#reaction').textContent=end[0];$('#ending-title').textContent=end[0];$('#ending-description').textContent=end[1];$('#ending-card').textContent=end[2]}sound()}
function badges(){state.earned.forEach((v,i)=>{const b=$('#badge'+i);b.classList.toggle('earned',v);b.textContent=(v?'✓ ':'○ ')+['Dress','Colour','Ready'][i]})}
function render(){
 $('#occasions').innerHTML=adventures.map((a,i)=>`<button data-occasion="${i}" class="adventure ${state.occasion===i?'selected':''}" aria-pressed="${state.occasion===i}"><span>${a[0]}</span><div>${a[1]}<small>${a[2]}</small></div></button>`).join('');
 $('#looks').innerHTML=outfits.map((a,i)=>`<button data-look="${i}" class="look ${state.style===i?'selected':''}" aria-pressed="${state.style===i}"><span class="look-image" style="background-position:${i%3*50}% ${Math.floor(i/3)*100}%"></span><strong>${a[0]}</strong></button>`).join('');
 $('#tools').innerHTML=Object.keys(palettes).map(t=>`<button data-tool="${t}" class="${state.tool===t?'selected':''}" aria-pressed="${state.tool===t}" ${t==='Lips'&&state.style===4?'disabled title="Rasla is hiding her giggle! Try blush or sparkle."':''}>${{Blush:'🌸',Lips:'♡',Sparkle:'✨'}[t]} ${t}</button>`).join('');
 $('#swatches').innerHTML=palettes[state.tool].map((a,i)=>`<button data-shade="${i}" class="${state.shade===i?'selected':''}" aria-label="${a[0]}" title="${a[0]}" aria-pressed="${state.shade===i}" style="background:${a[1]}"></button>`).join('');$('#shade-name').textContent=palettes[state.tool][state.shade][0];$('#look-name').textContent=outfits[state.style][0];badges();
}
const faces=[{lip:[248,241],cheeks:[[202,207],[305,213]]},{lip:[249,244],cheeks:[[205,211],[309,212]]},{lip:[246,252],cheeks:[[203,212],[304,214]]},{lip:[250,242],cheeks:[[204,212],[304,216]]},{lip:null,cheeks:[[196,202],[314,208]]},{lip:[245,240],cheeks:[[197,205],[305,210]]}];
function glow(x,y,rx,ry,color,alpha){ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);const g=ctx.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,color);g.addColorStop(1,color+'00');ctx.globalAlpha=alpha;ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.fill();ctx.restore()}
function draw(){ctx.clearRect(0,0,600,660);if(!ready){ctx.fillStyle='#6554d9';ctx.textAlign='center';ctx.font='bold 22px sans-serif';ctx.fillText('Rasla is getting ready…',300,330);return}const w=sprite.naturalWidth/3,h=sprite.naturalHeight/2;ctx.drawImage(sprite,state.style%3*w,Math.floor(state.style/3)*h,w,h,0,35,600,600);ctx.save();ctx.translate(0,35);ctx.scale(600/512,600/512);const face=faces[state.style];for(const [tool,m] of Object.entries(state.makeup)){if(tool==='Blush')face.cheeks.forEach(p=>glow(p[0],p[1],23,15,m.color,m.intensity));if(tool==='Sparkle'){ctx.save();ctx.fillStyle=m.color;ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.font='24px serif';ctx.textAlign='center';face.cheeks.forEach((p,i)=>{ctx.fillText('✦',p[0]+(i?7:-7),p[1]+12);ctx.strokeText('✦',p[0]+(i?7:-7),p[1]+12)});ctx.restore()}if(tool==='Lips'&&face.lip){const [x,y]=face.lip;ctx.save();ctx.globalCompositeOperation='multiply';ctx.globalAlpha=m.intensity*.8;ctx.strokeStyle=m.color;ctx.fillStyle=m.color;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();if(state.style===2){ctx.moveTo(x-25,y-6);ctx.bezierCurveTo(x-14,y+27,x+11,y+26,x+24,y-5);ctx.stroke()}else if(state.style===5){ctx.moveTo(x-26,y+1);ctx.quadraticCurveTo(x,y+24,x+27,y);ctx.stroke()}else{ctx.moveTo(x-33,y-9);ctx.bezierCurveTo(x-17,y-7,x-9,y-4,x,y-5);ctx.bezierCurveTo(x+12,y-4,x+23,y-3,x+33,y-6);ctx.bezierCurveTo(x+16,y+16,x-13,y+14,x-33,y-9);ctx.fill()}ctx.restore()}}ctx.restore()}
function chooseStyle(i){state.style=i;if(i===4&&state.tool==='Lips'){state.tool='Blush';state.shade=0}state.earned[0]=false;render();draw();$('#reaction').textContent=outfits[i][1];bop();sound()}
function updateBrush(){const n=requiredBrushes(),done=state.brushes>=n;$('#brush-count').textContent=Math.min(state.brushes,n)+' / '+n;$('#brush-progress').style.width=Math.min(100,state.brushes/n*100)+'%';$('#colour-done').disabled=!done;$('#colour-done').textContent=done?'All ready! Let’s go! →':'Brush '+n+' times to continue'}
function apply(){if(state.step!==2)return;if(!ready){toast('Rasla is still getting ready!');return}state.makeup[state.tool]={color:palettes[state.tool][state.shade][1],intensity:state.intensity};state.brushes++;draw();updateBrush();bop();sound();$('#reaction').textContent=['Hehe! That tickles! 😄','Ooh, lovely colours! 🌈','Sparkle high-five! ✋'][state.brushes%3]}
function startGame(){state.style=0;state.occasion=0;state.tool='Blush';state.shade=0;state.intensity=.3;state.brushes=0;state.makeup={};state.earned=[false,false,false];$('#strength').value=30;$('#strength-label').textContent='Soft';$('#intro').hidden=true;$('#game').hidden=false;$('#reaction').textContent='Pick an adventure! 🌈';render();setStep(0);draw();window.scrollTo({top:0,behavior:'smooth'})}
function confetti(){if(reduced)return;for(let i=0;i<28;i++){const el=document.createElement('span');el.className='confetti';el.textContent=['●','◆','♪','✿'][i%4];el.style.left=Math.random()*100+'vw';el.style.color=['#ffcb43','#f392bf','#8770e7','#65cbdc'][i%4];el.style.animationDelay=Math.random()*.7+'s';document.body.append(el);setTimeout(()=>el.remove(),3900)}}
function savePicture(){draw();const c=document.createElement('canvas');c.width=900;c.height=1200;const g=c.getContext('2d');g.fillStyle='#edf8ff';g.fillRect(0,0,900,1200);g.fillStyle='#6554d9';g.textAlign='center';g.font='bold 48px sans-serif';g.fillText('Rasla Studio',450,85);g.drawImage(canvas,150,110,600,660);g.fillStyle='#d4a016';g.font='60px serif';g.fillText('Let’s go!',450,845);g.fillStyle='#514179';g.font='bold 30px sans-serif';g.fillText(endings[state.occasion][0],450,940);g.font='25px sans-serif';g.fillText(adventures[state.occasion][1]+' · '+outfits[state.style][0],450,1000);g.fillText('Ready for a colourful adventure!',450,1080);g.font='16px sans-serif';g.fillText('A CARTOON INSPIRED BY RASLA',450,1150);preparePicture(c)}
$$('[data-mode]').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;$$('[data-mode]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',x===b)});sound()});
$('#start').onclick=startGame;$('#restart').onclick=startGame;$('#again').onclick=startGame;$('#home').onclick=()=>{$('#game').hidden=true;$('#intro').hidden=false;canvas.classList.remove('dance');window.scrollTo({top:0,behavior:'smooth'})};
$('#open-wardrobe').onclick=()=>setStep(1);$$('[data-back]').forEach(b=>b.onclick=()=>setStep(+b.dataset.back));
$('#occasions').onclick=e=>{const b=e.target.closest('[data-occasion]');if(b){state.occasion=+b.dataset.occasion;state.earned[0]=false;render();sound()}};
$('#looks').onclick=e=>{const b=e.target.closest('[data-look]');if(b)chooseStyle(+b.dataset.look)};
$('#dress-done').onclick=()=>{if(state.mode==='challenge'&&state.style!==adventures[state.occasion][3]){toast('Find '+outfits[adventures[state.occasion][3]][0]+'! You can do it!');bop();return}state.earned[0]=true;badges();setStep(2);toast('Outfit ready! ✓')};
$('#tools').onclick=e=>{const b=e.target.closest('[data-tool]');if(b&&!b.disabled){state.tool=b.dataset.tool;state.shade=0;render()}};
$('#swatches').onclick=e=>{const b=e.target.closest('[data-shade]');if(b){state.shade=+b.dataset.shade;render();sound()}};
$('#strength').oninput=e=>{state.intensity=+e.target.value/100;$('#strength-label').textContent=state.intensity<.4?'Soft':'Bright';if(state.makeup[state.tool]){state.makeup[state.tool].intensity=state.intensity;draw()}};
$('#apply').onclick=apply;$('#tap-face').onclick=()=>{if(state.step===2)apply();else{bop();sound();$('#reaction').textContent=outfits[state.style][1]}};
$('#clear').onclick=()=>{state.makeup={};state.brushes=0;state.earned[1]=false;draw();badges();updateBrush();toast('Fresh colours, here we go!')};
$('#colour-done').onclick=()=>{if(state.brushes<requiredBrushes())return;state.earned[1]=true;state.earned[2]=true;badges();setStep(4);sound('win');confetti()};
$('#download').onclick=savePicture;
$('#sound').onclick=()=>{state.sound=!state.sound;$('#sound span').textContent=state.sound?'Sound on':'Sound off';$('#sound').setAttribute('aria-pressed',state.sound);$('#sound').setAttribute('aria-label',state.sound?'Turn sound off':'Turn sound on');sound()};
sprite.onload=()=>{ready=true;draw()};sprite.onerror=()=>{toast('Rasla couldn’t load. Please refresh to try again.');$('#start').disabled=true;$('#apply').disabled=true;$('#dress-done').disabled=true};sprite.src='rasla-cartoon.png';
if(!reduced)setInterval(()=>{if(!$('#intro').hidden&&!document.hidden){introFrame=(introFrame+1)%6;$('.intro-character').style.backgroundPosition=(introFrame%3*50)+'% '+(Math.floor(introFrame/3)*100)+'%'}},2200);
render();draw();

let pictureURL=null,pictureFile=null,pictureRequest=0;
function preparePicture(renderedCanvas){
 const request=++pictureRequest;
 const dialog=$('#save-dialog');
 $('#save-status').textContent='Preparing your edited picture…';
 $('#save-preview').hidden=true;$('#save-actions').hidden=true;$('#share-file').hidden=true;
 pictureFile=null;
 if(!dialog.open)dialog.showModal();
 try{renderedCanvas.toBlob(blob=>{
  if(request!==pictureRequest)return;
  if(!blob){$('#save-status').textContent='The picture could not be created. Close this window and try again.';return;}
  const oldURL=pictureURL;pictureURL=URL.createObjectURL(blob);
  $('#save-preview').src=pictureURL;$('#save-preview').hidden=false;
  $('#save-file').href=pictureURL;$('#open-picture').href=pictureURL;
  $('#save-actions').hidden=false;
  $('#save-status').textContent='Your outfit and makeup are included. Choose how to save your picture below.';
  try{pictureFile=new File([blob],'Rasla-my-edited-picture.png',{type:'image/png'});$('#share-file').hidden=!(navigator.share&&navigator.canShare&&navigator.canShare({files:[pictureFile]}));}catch{pictureFile=null;}
  // Keep the previous URL alive long enough for an already-open preview or download.
  if(oldURL)setTimeout(()=>URL.revokeObjectURL(oldURL),60000);
 },'image/png');}catch{ $('#save-status').textContent='Please open the deployed game in Safari or Chrome and try saving again.'; }
}
$('#save-close').onclick=()=>$('#save-dialog').close();
$('#save-file').onclick=()=>{$('#save-status').textContent='Your browser will download the picture or open it so you can save it.';};
$('#share-file').onclick=async()=>{
 if(!pictureFile)return;
 const button=$('#share-file');button.disabled=true;
 try{await navigator.share({files:[pictureFile],title:'My Rasla picture'});$('#save-status').textContent='Picture handed to your phone. Finish saving in the option you selected.';}
 catch(e){$('#save-status').textContent=e.name==='AbortError'?'You can still download your picture below.':'Sharing is unavailable here. Use Download picture, or press and hold the preview to save it.';}
 finally{button.disabled=false;}
};
