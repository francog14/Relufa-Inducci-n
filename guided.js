// Interactive narration uses only the browser's speech synthesis; no audio service.
const guide={active:false,paused:false,muted:false,last:'',completed:false,initialClosed:0};
const canSpeak='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
const guidePanel=document.createElement('section');guidePanel.id='guide-panel';guidePanel.setAttribute('aria-label','Inducción guiada');
document.querySelector('.app').insertBefore(guidePanel,main);
function stopVoice(){if(canSpeak)window.speechSynthesis.cancel()}
function sayGuide(text){stopVoice();if(!canSpeak||guide.paused||guide.muted||!guide.active)return;const u=new SpeechSynthesisUtterance(text);u.lang='es-CL';u.rate=.92;const voices=speechSynthesis.getVoices();u.voice=voices.find(v=>v.lang.toLowerCase()==='es-cl')||voices.find(v=>v.lang.toLowerCase().startsWith('es'))||null;u.onerror=e=>{if(e.error!=='canceled'&&e.error!=='interrupted'){guidePanel.querySelector('.voice-status').textContent='La voz no está disponible. Sigue los subtítulos.'}};speechSynthesis.speak(u)}
function guideStep(){
 if(state.outcomes.filter(Boolean).length>guide.initialClosed)return {key:'complete',n:12,text:'¡Muy bien! Completaste una entrega. El pedido pasó al historial. Presiona Ver historial para revisar tu registro.',target:'[data-guide="history"]',complete:true};
 if(dialog.open&&document.querySelector('.practice-camera')){const count=photoTypes().filter(([k])=>form.photos?.[k]).length;const names=['las etiquetas del paquete','la fachada del domicilio','el cliente recibiendo el paquete'];return {key:'photo-'+count,n:8,text:`Foto ${count+1} de ${photoTypes().length}: ${names[count]}. Presiona el disparador. Esta cámara es simulada; no toma fotos reales.`,target:'[data-action="sample-photo"]'}}
 if(dialog.open)return {key:'dialog',n:1,text:'Lee el mensaje y ciérralo para continuar la inducción.',target:'#dialog-actions button'};
 if(page==='menu')return {key:'assign',n:1,text:'Bienvenido a la inducción de Relufa. Vamos a practicar una entrega paso a paso. Primero, presiona Asignar ruta.',target:'[data-action="go-assignment"]'};
 if(page==='assignment')return {key:'qr',n:2,text:'Aquí recibes tu ruta. En una operación real debes verificar los paquetes y sus etiquetas. Ahora presiona Escanear QR para asignar cinco pedidos ficticios.',target:'[data-action="assign"].primary'};
 if(page==='orders'&&!state.assigned)return {key:'empty',n:1,text:'Todavía no tienes una ruta. Presiona Asignar una ruta para comenzar.',target:'[data-action="go-assignment"]'};
 if(page==='orders'||page==='search')return {key:'stop',n:3,text:'Estos son tus pedidos pendientes. Revisa la dirección, el destinatario y la cantidad de paquetes. Presiona el primer pedido para ver su detalle.',target:'.stop[data-action]'};
 if(page==='detail')return {key:'success',n:4,text:'Antes de entregar, verifica el pedido y quién lo recibe. En este ejercicio el cliente recibió su paquete. Presiona Exitosa para registrar la entrega.',target:'[data-action="success"]'};
 if(page==='scan')return {key:'scan',n:5,text:'Verifica que el número de pedido corresponda al paquete. Presiona Simular escaneo del paquete para continuar.',target:'[data-action="scanned"]'};
 if(page==='form'){
  if(!success)return {key:'failure',n:6,text:'Elegiste una entrega fallida. Selecciona el motivo, agrega las evidencias simuladas y la ubicación. Terminar se habilitará cuando estén completos los requisitos.',target:!form.reason?'#reason':!form.evidence?'[data-action="add-evidence"]':!form.location?'[data-action="toggle-location"]':'#finish'};
  if(!form.place)return {key:'place',n:6,text:'Selecciona el lugar de entrega: edificio, casa u oficina. Para practicar, puedes elegir Casa.',target:'[data-action="choose-place-Casa"]'};
  if(!form.receiver?.trim()||!form.relation)return {key:'receiver',n:7,text:'Escribe el nombre de quien recibe y selecciona su relación con el destinatario. Los datos de este ejercicio son ficticios.',target:!form.receiver?.trim()?'#receiver':'.visual-choices[aria-label="Quién recibe"]'};
  if(!form.signature)return {key:'signature',n:7,text:'Verifica el nombre y quién recibe el paquete. Luego agrega la firma de recibido. En esta inducción, presiona Usar firma simulada.',target:'[data-action="example-signature"]'};
  if(!form.evidence)return {key:'evidence',n:8,text:'La entrega requiere fotos de las etiquetas, la fachada y el cliente recibiendo. Presiona Agregar para practicar las tres capturas en una cámara simulada.',target:'[data-action="add-evidence"]'};
  if(!form.location)return {key:'location',n:10,text:'Ya agregaste las fotos de práctica. Los comentarios son opcionales. Presiona Agregar ubicación simulada para registrar dónde se realizó la entrega.',target:'[data-action="toggle-location"]'};
  return {key:'finish',n:11,text:'Revisa que los datos, la firma y las tres evidencias estén completos. Presiona Terminar para cerrar este pedido y guardarlo en el historial.',target:'#finish'};
 }
 return {key:'return',n:3,text:'Para continuar la práctica, vuelve a Órdenes y abre un pedido pendiente.',target:'[data-action="go-orders"]'};
}
function renderGuide(){
 document.querySelectorAll('.guide-target').forEach(e=>e.classList.remove('guide-target'));
 const inCamera=dialog.open&&!!document.querySelector('.practice-camera');
 const parent=inCamera?document.querySelector('#dialog-body'):document.querySelector('.app');
 if(guidePanel.parentElement!==parent){if(inCamera)parent.prepend(guidePanel);else parent.insertBefore(guidePanel,main)}
 if(!guide.active){guidePanel.innerHTML='<div class="guide-welcome"><strong>Aprende con una guía de voz</strong><span>Escucha, lee y practica cada paso.</span><button class="btn primary" data-guide="start">Iniciar inducción</button></div>';return}
 const step=guideStep();guide.completed=!!step.complete;
 const key=step.key+(guide.paused?'paused':'')+(guide.muted?'muted':'');
 if(guidePanel.dataset.view!==key){guidePanel.dataset.view=key;guidePanel.innerHTML=`<div class="guide-top"><strong>${step.complete?'Entrega de práctica completada':`Inducción · Paso ${step.n} de 12`}</strong><button data-guide="exit" aria-label="Salir de la inducción">Salir</button></div><p class="guide-caption" role="status" aria-live="polite">${guide.paused?'Inducción en pausa. Presiona Continuar cuando estés listo.':esc(step.text)}</p><div class="guide-controls"><button data-guide="pause">${guide.paused?'Continuar':'Pausar'}</button><button data-guide="repeat" ${guide.paused?'disabled':''}>Repetir</button><button data-guide="mute" aria-pressed="${guide.muted}">${guide.muted?'Activar voz':'Silenciar'}</button>${step.complete?'<button data-guide="history">Ver historial</button>':''}</div><small class="voice-status">${canSpeak?'Voz del dispositivo · Subtítulos siempre visibles':'Voz no disponible en este navegador. Sigue los subtítulos.'}</small>`}
 if(!guide.paused){const target=document.querySelector(step.target);if(target){target.classList.add('guide-target');if(guide.last!==step.key)target.scrollIntoView({block:'nearest',behavior:'instant'})}}
 if(guide.last!==step.key){guide.last=step.key;sayGuide(step.text)}
}
document.addEventListener('click',e=>{const action=e.target.closest('[data-guide]')?.dataset.guide;if(action){switch(action){case 'start':guide.active=true;guide.paused=false;guide.completed=false;guide.last='';guide.initialClosed=state.outcomes.filter(Boolean).length;if(state.assigned&&state.outcomes.every(Boolean)){notice('Práctica completada','Ya completaste todos los pedidos. Reinicia desde Menú → Cerrar sesión para practicar otra vez.');guide.active=false}else go('menu');break;case 'pause':guide.paused=!guide.paused;stopVoice();if(!guide.paused){guide.last='';}break;case 'mute':guide.muted=!guide.muted;stopVoice();if(!guide.muted)guide.last='';break;case 'repeat':sayGuide(guideStep().text);break;case 'exit':guide.active=false;guide.last='';stopVoice();guidePanel.dataset.view='';break;case 'history':guide.active=false;stopVoice();go('history');guidePanel.dataset.view='';break}renderGuide();return}queueMicrotask(()=>{if(guide.active)renderGuide()})});
document.addEventListener('input',()=>{if(guide.active)queueMicrotask(renderGuide)});
document.addEventListener('change',()=>{if(guide.active)queueMicrotask(renderGuide)});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopVoice();if(guide.active){guide.paused=true;renderGuide()}}});
window.addEventListener('pagehide',stopVoice);
renderGuide();
