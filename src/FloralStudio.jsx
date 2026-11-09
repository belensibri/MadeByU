import React, { useMemo, useState } from 'react';
import './studio.css';
import ramoVista from './assets/petalos-rosados.svg';
import cajaVista from './assets/caja-primavera.svg';

const money = n => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format(n);
const SIZES = [
  {id:'mini',label:'Mini',count:5,price:9.99},
  {id:'pequeno',label:'Pequeño',count:8,price:13.99},
  {id:'mediano',label:'Mediano',count:14,price:21.99},
  {id:'grande',label:'Grande',count:20,price:29.99}
];
const FLOWERS = [
  {id:'claveles',label:'Claveles',extra:0,short:'Clavel',description:'De temporada · incluidos'},
  {id:'margaritas',label:'Margaritas',extra:0,short:'Margarita',description:'De temporada · incluidas'},
  {id:'rosas',label:'Rosas',extra:.40,short:'Rosa',description:'+$0.40 por tallo · demo'},
  {id:'girasoles',label:'Girasoles',extra:.30,short:'Girasol',description:'+$0.30 por tallo · demo'}
];
const PALETTES=[
  {label:'Rosa',value:'#f1a6ba',shadow:'#c77991'},
  {label:'Melocotón',value:'#efb09b',shadow:'#c77f6d'},
  {label:'Lila',value:'#c9b4e0',shadow:'#9781b4'},
  {label:'Marfil',value:'#fff5dc',shadow:'#d6ccaf'},
  {label:'Vino',value:'#a65876',shadow:'#763b54'}
];
const PAPERS=[
  {label:'Azul salvia',value:'#a6c5c6',dark:'#789ea1'},
  {label:'Rosa polvo',value:'#e9bac5',dark:'#c88b9a'},
  {label:'Marfil',value:'#f3eee4',dark:'#d9cbbb'},
  {label:'Kraft',value:'#d4b296',dark:'#ad886a'}
];
const RIBBONS=[
  {label:'Verde salvia',value:'#5e9e93'},
  {label:'Rosa',value:'#d88da2'},
  {label:'Crema',value:'#e8d0b4'},
  {label:'Vino',value:'#915771'}
];
const STAGES=[
  {id:'flores',label:'Flores',number:'01',icon:'flower'},
  {id:'follaje',label:'Follaje',number:'02',icon:'leaf'},
  {id:'envoltura',label:'Envoltura',number:'03',icon:'wrap'},
  {id:'liston',label:'Listón',number:'04',icon:'bow'},
  {id:'presentacion',label:'Formato',number:'05',icon:'box'},
  {id:'dedicatoria',label:'Tarjeta',number:'06',icon:'heart'}
];
const POSITIONS = [
  [338,287,0.99, 0],[262,323,.87,-17],[419,330,.93,14],[331,380,.86,6],[375,245,.86,11],
  [207,269,.84,-11],[470,261,.88,12],[282,221,.86,-20],[431,403,.78,21],[235,399,.83,-23],
  [352,192,.82,4],[168,344,.81,-14],[508,345,.8,20],[290,437,.78,-17],[409,205,.74,15],
  [236,204,.74,-13],[490,421,.73,20],[190,421,.7,-20],[333,467,.75,4],[445,463,.72,15]
];
function initialCounts(size) { const n=SIZES.find(s=>s.id===size).count; return {claveles:Math.ceil(n/2),margaritas:Math.floor(n/2),rosas:0,girasoles:0}; }
function Symbol({name,size=22}){
  const line={fill:'none',stroke:'currentColor',strokeWidth:1.65,strokeLinecap:'round',strokeLinejoin:'round'};
  const path={
    flower:<><circle cx="12" cy="12" r="2"/><circle cx="12" cy="6" r="4"/><circle cx="18" cy="12" r="4"/><circle cx="12" cy="18" r="4"/><circle cx="6" cy="12" r="4"/></>,
    leaf:<><path d="M21 3C10 3 4 7 4 16a5 5 0 0 0 5 5C18 21 22 14 21 3Z"/><path d="M6 19 18 8"/></>,
    wrap:<><path d="M4 6 12 3l8 3-3 14-5 2-5-2L4 6Z"/><path d="M4 6 12 12l8-6M12 12v10"/></>,
    bow:<><path d="M12 12C8 3 2 5 3 9c1 4 5 3 9 3Zm0 0c4-9 10-7 9-3-1 4-5 3-9 3Z"/><path d="m12 12-4 9 4-3 4 3-4-9"/></>,
    box:<><path d="M4 8h16v13H4zM2 4h20v4H2zM12 4v17"/></>,
    heart:<path d="M20 5a5 5 0 0 0-7 0l-1 1-1-1a5 5 0 0 0-7 7l8 8 8-8a5 5 0 0 0 0-7Z"/>,
    back:<path d="m15 18-6-6 6-6"/>,
    cart:<><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M2 3h3l2.2 12h12L22 7H6"/></>,
    check:<path d="m5 12 5 5L20 7"/>,
    plus:<path d="M12 5v14M5 12h14"/>,
    minus:<path d="M5 12h14"/>,
    sparkle:<><path d="M12 2c0 7 3 10 10 10-7 0-10 3-10 10 0-7-3-10-10-10 7 0 10-3 10-10Z"/></>,
    info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" {...line} aria-hidden="true">{path[name]||path.flower}</svg>;
}
function FlowerHead({type='claveles', color='#f1a6ba',shadow='#c77991',small=false}){
  const r=small ? 0.69 : 1;
  return <g transform={`scale(${r})`} filter="url(#flowerShadow)">
    {type==='girasoles'? <>
      {Array.from({length:14},(_,i)=><ellipse key={i} cx="0" cy="-30" rx="11" ry="27" transform={`rotate(${i*360/14})`} fill={i%2?'#ebad41':'#f6c969'} stroke="#cc9342" strokeWidth=".8"/>)}
      <circle r="24" fill="#775a42"/><circle r="17" fill="#564c3c"/>
      {Array.from({length:17},(_,i)=><circle key={i} cx={Math.sin(i*7)*14} cy={Math.cos(i*7)*14} r="1.8" fill="#bca76e"/>)}
    </>:type==='margaritas'?<>
      {Array.from({length:12},(_,i)=><ellipse key={i} cx="0" cy="-24" rx="10" ry="23" transform={`rotate(${i*30})`} fill={i%3===0?'#f8f3e7':'#fffdf3'} stroke="#d6dbd1" strokeWidth=".9"/>)}
      <circle r="17" fill="#e5bd64"/><circle r="11" fill="#f0d48b"/>
      {Array.from({length:12},(_,i)=><circle key={i} cx={Math.sin(i*6)*10} cy={Math.cos(i*6)*10} r="1.4" fill="#ce9b49"/>)}
    </>:type==='rosas'?<>
      {Array.from({length:8},(_,i)=><ellipse key={i} cx="0" cy="-16" rx="24" ry="32" transform={`rotate(${i*45})`} fill={i%3===0?shadow:color} stroke={shadow} strokeWidth="1"/>)}
      {Array.from({length:5},(_,i)=><ellipse key={i} cx="0" cy="-10" rx="15" ry="18" transform={`rotate(${i*72})`} fill={i%2?color:'#f8d3d8'} stroke={shadow} strokeWidth="1"/>)}
      <path d="M-9 0 Q-10-12 0-12 Q13-12 10 0 Q9 10 0 7 Q-4 4 2 0" fill="none" stroke={shadow} strokeWidth="3" strokeLinecap="round"/>
    </>:<>
      {Array.from({length:12},(_,i)=><ellipse key={i} cx="0" cy="-21" rx="18" ry="22" transform={`rotate(${i*30})`} fill={i%3===0?shadow:color} stroke={shadow} strokeWidth="1"/>)}
      {Array.from({length:7},(_,i)=><ellipse key={i} cx="0" cy="-9" rx="14" ry="15" transform={`rotate(${i*360/7})`} fill={i%2?'#f8d3d3':color} stroke={shadow} strokeWidth=".8"/>)}
      <circle r="8" fill="#edc5a4"/>
    </>}
  </g>;
}
function FlowerThumbnail({type,color='#e9a5b8'}){
  return <svg className="flower-thumbnail" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="#f2f6f2"/><g transform="translate(50 50) scale(.56)"><FlowerHead type={type} color={color} shadow="#bc7c88"/></g></svg>;
}
function BouquetPreview({counts,palette,paper,ribbon,format,foliage}){
  const color=PALETTES.find(p=>p.label===palette)||PALETTES[0];
  const wrap=PAPERS.find(p=>p.label===paper)||PAPERS[0];
  const ribbonColor=RIBBONS.find(r=>r.label===ribbon)||RIBBONS[0];
  const list=FLOWERS.flatMap(f=>Array.from({length:counts[f.id]||0},()=>f.id));
  // Stable composition: selected flower types determine the petals displayed in the preview.
  const ordered = list.map((type,i)=>({type,...{x:POSITIONS[i%POSITIONS.length][0],y:POSITIONS[i%POSITIONS.length][1],s:POSITIONS[i%POSITIONS.length][2],rot:POSITIONS[i%POSITIONS.length][3]}}));
  return <svg className="bouquet-art" viewBox="0 0 680 770" role="img" aria-label={`Vista previa ilustrada de un ramo con ${list.length} flores: ${FLOWERS.filter(f=>counts[f.id]).map(f=>`${counts[f.id]} ${f.label}`).join(', ')}. Papel ${paper}, listón ${ribbon}.`}>
    <defs>
      <linearGradient id="paperMain" x1="0" y1="0" x2="1" y2="1"><stop stopColor={wrap.value}/><stop offset="1" stopColor={wrap.dark}/></linearGradient>
      <linearGradient id="paperFold" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffffff" stopOpacity=".75"/><stop offset="1" stopColor={wrap.dark} stopOpacity=".7"/></linearGradient>
      <linearGradient id="stem" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#789c79"/><stop offset="1" stopColor="#446752"/></linearGradient>
      <linearGradient id="vase" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#eae5db"/><stop offset="1" stopColor="#c5d2c8"/></linearGradient>
      <filter id="flowerShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="2" dy="5" stdDeviation="3" floodColor="#506e63" floodOpacity=".17"/></filter>
      <filter id="bouquetShadow"><feGaussianBlur stdDeviation="16"/></filter>
      <clipPath id="bouquetClip"><rect width="680" height="770" rx="0"/></clipPath>
    </defs>
    <ellipse cx="340" cy="714" rx="155" ry="18" fill="#5f8b83" opacity=".17" filter="url(#bouquetShadow)"/>
    {/* Paper wrapping opens behind the blooms; it changes when the user selects a new paper. */}
    {format==='envuelto' ? <g>
      <path d="M335 674 100 221 244 298 342 401 443 278 596 227 385 676Z" fill="url(#paperMain)" stroke={wrap.dark} strokeWidth="3"/>
      <path d="m105 220 150 72 81 110-120-74Z" fill="url(#paperFold)" opacity=".92"/>
      <path d="m596 227-154 55-100 119 119-82Z" fill="url(#paperFold)" opacity=".9"/>
      <path d="M185 425 77 337 261 351 330 485l-8 158Z" fill={wrap.value} opacity=".85"/>
      <path d="m506 428 112-101-167 37-121 131 9 148Z" fill={wrap.dark} opacity=".72"/>
      <path d="M308 565 338 698 373 566" fill="none" stroke="#f4f7ed" strokeOpacity=".3" strokeWidth="4"/>
    </g> : <g>
      <path d="M179 398 Q170 357 204 353l65 8 74 70 78-70 66-9q35 1 28 47l-21 174q-10 42-71 50H267q-64-7-70-48Z" fill="url(#vase)" stroke="#b7c2b8" strokeWidth="2"/>
      <ellipse cx="343" cy="381" rx="158" ry="45" fill="#e9eee9" stroke="#b7c2b8" strokeWidth="2"/>
      <ellipse cx="343" cy="381" rx="139" ry="34" fill="#788f78" opacity=".25"/>
    </g>}
    {/* Layered stems and eucalyptus are intentionally visible to make each preview feel botanical. */}
    <g stroke="url(#stem)" strokeWidth="5" strokeLinecap="round" fill="none">
      {ordered.map((f,i)=><path key={`stem-${i}`} d={`M340 ${format==='caja'?470:602} Q${335+(f.x-340)*.4} ${490-(i%4)*13} ${f.x} ${f.y+9}`}/>)}
    </g>
    <g fill={foliage==='eucalipto'?'#90b19d':'#6d9a72'} stroke="#577a65" strokeWidth="1.4">
      {Array.from({length:12},(_,i)=>{const dx=[-184,-144,-119,-88,-58,61,99,144,181,-164,133,-90][i];const dy=[-109,-194,-237,-133,-205,-203,-148,-227,-107,-44,-33,-67][i];const tx=340+dx, ty=390+dy;return <g key={i}><path d={`M340 580 Q${325+dx*.4} ${450+dy*.20} ${tx} ${ty}`} fill="none"/><ellipse cx={tx} cy={ty} rx={foliage==='eucalipto'?16:11} ry={foliage==='eucalipto'?22:28} transform={`rotate(${dx>0?-35:35} ${tx} ${ty})`}/><ellipse cx={tx+dx*.12} cy={ty+26} rx="11" ry="19" transform={`rotate(${dx>0?32:-32} ${tx+dx*.12} ${ty+26})`}/></g>})}
    </g>
    <g stroke="#719c80" strokeWidth="1.2" fill="#d2e2c6" opacity=".85">
      {Array.from({length:22},(_,i)=>{const x=145+((i*71)%395), y=175+((i*47)%295); return <circle key={i} cx={x} cy={y} r={(i%3)+2.6}/>})}
    </g>
    {ordered.map((f,i)=><g key={`flower-${i}`} transform={`translate(${f.x} ${f.y}) rotate(${f.rot}) scale(${f.s})`}>
      <FlowerHead type={f.type} color={f.type==='girasoles'?'#f0c35a':f.type==='margaritas'?'#fff8eb':color.value} shadow={f.type==='girasoles'?'#d59a39':f.type==='margaritas'?'#cfcabf':color.shadow}/>
    </g>)}
    {format==='envuelto'?<g>
      <path d="M297 580Q334 593 381 571L380 668Q336 708 303 657Z" fill="url(#paperMain)" stroke={wrap.dark} strokeWidth="2"/>
      <path d="M330 606 Q295 572 270 597 Q282 628 331 624 Q380 577 402 604 Q396 641 336 623" fill={ribbonColor.value} stroke="#fff" strokeWidth="2"/>
      <path d="m332 618-19 88 22-17 19 18-7-89" fill={ribbonColor.value} stroke="#ffffff" strokeOpacity=".6" strokeWidth="2"/>
      <circle cx="335" cy="616" r="12" fill={ribbonColor.value} stroke="#fff" strokeWidth="2"/>
    </g>:<g><path d="M249 491Q340 520 442 487" stroke={ribbonColor.value} strokeWidth="16" fill="none"/><path d="M338 500 Q294 464 275 489Q288 515 338 500Q385 466 411 489Q397 519 338 500" fill={ribbonColor.value}/></g>}
  </svg>;
}
function ToggleCard({selected,onClick,title,subtitle,icon}){return <button type="button" className={`studio-toggle ${selected?'is-selected':''}`} onClick={onClick} aria-pressed={selected}><span className="studio-toggle-icon"><Symbol name={icon} size={23}/></span><span><strong>{title}</strong><small>{subtitle}</small></span>{selected&&<Symbol name="check" size={18}/>}</button>}

export default function FloralStudio({navigate,onAdd}){
  const [size,setSize]=useState('mediano');
  const [counts,setCounts]=useState(()=>initialCounts('mediano'));
  const [stage,setStage]=useState('flores');
  const [palette,setPalette]=useState('Rosa');
  const [foliage,setFoliage]=useState('eucalipto');
  const [paper,setPaper]=useState('Azul salvia');
  const [ribbon,setRibbon]=useState('Verde salvia');
  const [format,setFormat]=useState('envuelto');
  const [message,setMessage]=useState('');
  const [selectedFlower,setSelectedFlower]=useState('rosas');
  const chosenSize=SIZES.find(s=>s.id===size);
  const count=Object.values(counts).reduce((a,b)=>a+b,0);
  const supplements=FLOWERS.reduce((sum,f)=>sum+(counts[f.id]||0)*f.extra,0);
  const formatExtra=format==='caja'?5:0;
  const total=chosenSize.price+supplements+formatExtra;
  const uniqueFlowers=FLOWERS.filter(f=>counts[f.id]>0);
  const currentFlower=FLOWERS.find(f=>f.id===selectedFlower);
  const summaries=useMemo(()=>uniqueFlowers.map(f=>({id:f.id,label:f.label,quantity:counts[f.id],value:counts[f.id]*f.extra})),[counts]);

  function chooseSize(id){setSize(id);setCounts(initialCounts(id))}
  function switchFlower(id,delta){
    setCounts(old=>{
      const next={...old};
      if(delta>0){
        if(next[id]>=chosenSize.count)return old;
        const donor=['claveles','margaritas','rosas','girasoles'].find(x=>x!==id&&next[x]>0);
        if(!donor)return old;
        next[donor]-=1;next[id]+=1;
      } else {
        if(next[id]===0)return old;
        const recipient=id==='claveles'?'margaritas':'claveles';
        next[id]-=1;next[recipient]+=1;
      }
      return next;
    });
  }
  function recommend(){const n=chosenSize.count;setCounts({claveles:Math.ceil(n*.6),margaritas:Math.floor(n*.4),rosas:0,girasoles:0});setPalette('Melocotón');setPaper('Marfil')}
  function surprise(){const n=chosenSize.count;const roses=Math.floor(n*.25),sun=n>=8?1:0,claveles=Math.floor((n-roses-sun)*.6);setCounts({claveles,margaritas:n-roses-sun-claveles,rosas:roses,girasoles:sun});setPalette('Rosa');setPaper('Kraft');setRibbon('Crema')}
  function add(){
    const description=FLOWERS.filter(f=>counts[f.id]).map(f=>`${counts[f.id]} ${f.label.toLowerCase()}`).join(', ');
    // The existing cart uses a static product image. The interactive bouquet remains an illustrative on-screen preview.
    onAdd({id:`custom-${Date.now()}`,name:`Mi ramo ${chosenSize.label.toLowerCase()}`,price:total,image:format==='caja'?cajaVista:ramoVista,custom:true,description:`${count} flores: ${description}. ${format==='caja'?'Bouquet en caja':`Papel ${paper}`}, listón ${ribbon}, tono ${palette}.${message?` Dedicatoria: ${message}`:''}`});
    navigate('/carrito');
  }
  return <div className="studio-page">
    <div className="studio-floating studio-floating-1" aria-hidden="true">✿</div><div className="studio-floating studio-floating-2" aria-hidden="true">✾</div><div className="studio-floating studio-floating-3" aria-hidden="true">❀</div>
    <div className="studio-shell">
      <header className="studio-topbar">
        <button className="studio-logo" onClick={()=>navigate('/')} aria-label="Volver al inicio de MadeByU"><span className="studio-logo-flower">✿</span>MadeByU<span className="studio-logo-dot">.</span></button>
        <span className="studio-top-divider"/><div className="studio-top-caption">Estudio floral <span>/</span> Crea tu ramo</div>
        <div className="studio-top-actions"><span className="studio-top-annotation">Tu detalle, a tu manera</span><button className="studio-top-back" onClick={()=>navigate('/catalogo/arreglos')}><Symbol name="back" size={17}/> Explorar catálogo</button><button className="studio-cart-circle" onClick={()=>navigate('/carrito')} aria-label="Ir al carrito"><Symbol name="cart" size={20}/></button></div>
      </header>
      <div className="studio-body">
        <aside className="studio-steps" aria-label="Pasos de personalización">
          <div className="studio-steps-title">PERSONALIZA</div>
          {STAGES.map(s=><button key={s.id} className={`studio-step ${stage===s.id?'is-current':''}`} onClick={()=>setStage(s.id)} aria-current={stage===s.id?'step':undefined}><span className="studio-step-circle"><Symbol name={s.icon} size={24}/></span><span>{s.label}</span></button>)}
          <div className="studio-steps-foot"><Symbol name="sparkle" size={22}/><span>Hecho especialmente<br/>por ti ♡</span></div>
        </aside>
        <section className="studio-center" aria-label="Visualización del ramo personalizado">
          <div className="studio-center-intro"><span className="studio-kicker">DISEÑADO POR TI</span><h1>Hazlo <em>único.</em></h1><p>Cada flor cuenta una historia. Crea la tuya.</p></div>
          <div className="studio-preview"><BouquetPreview counts={counts} palette={palette} paper={paper} ribbon={ribbon} foliage={foliage} format={format}/></div>
          <div className="studio-preview-label"><span className="studio-green-dot"/> Vista previa ilustrada que cambia según tus elecciones</div>
          <div className="studio-floral-ghost" aria-hidden="true">MADE WITH LOVE</div>
        </section>
        <aside className="studio-controls">
          <div className="studio-control-top"><span className="studio-kicker">DISEÑA TU DETALLE</span><span className="studio-step-count">{String(STAGES.findIndex(s=>s.id===stage)+1).padStart(2,'0')} / 06</span></div>
          <div className="studio-control-scroll">
            {stage==='flores'&&<>
              <h2>Escoge tus <em>flores</em></h2><p className="studio-control-desc">Selecciona una variedad y cambia cantidades. Cada nueva flor sustituye otra para mantener tu tamaño.</p>
              <div className="studio-field-title">Tamaño del ramo <span>{chosenSize.count} flores</span></div>
              <div className="studio-size-picker">{SIZES.map(s=><button key={s.id} className={size===s.id?'active':''} onClick={()=>chooseSize(s.id)} aria-pressed={size===s.id}><span>{s.label}</span><strong>{money(s.price)}</strong></button>)}</div>
              <div className="studio-field-title flower-field-title">Tipo de flor <span>4 variedades de ejemplo</span></div>
              <div className="studio-flower-grid">{FLOWERS.map(f=><button key={f.id} className={`studio-flower-tile ${selectedFlower===f.id?'active':''}`} onClick={()=>setSelectedFlower(f.id)} aria-pressed={selectedFlower===f.id}><FlowerThumbnail type={f.id} color={PALETTES.find(p=>p.label===palette).value}/><strong>{f.label}</strong><span>{counts[f.id]} de {chosenSize.count}</span></button>)}</div>
              <div className="studio-quantity"><div><strong>{currentFlower.label}</strong><small>{currentFlower.extra?`Recargo de prueba: +${money(currentFlower.extra)} por flor`:'Incluidas en el precio base'}</small></div><div className="studio-stepper"><button onClick={()=>switchFlower(selectedFlower,-1)} disabled={!counts[selectedFlower]} aria-label={`Quitar ${currentFlower.short}`}><Symbol name="minus" size={15}/></button><strong>{counts[selectedFlower]}</strong><button onClick={()=>switchFlower(selectedFlower,1)} disabled={counts[selectedFlower]===chosenSize.count} aria-label={`Sustituir otra flor por ${currentFlower.short}`}><Symbol name="plus" size={15}/></button></div></div>
              <div className="studio-field-title">Color principal</div><div className="studio-color-row">{PALETTES.map(p=><button key={p.label} style={{'--swatch':p.value}} aria-label={`Color ${p.label}`} title={p.label} aria-pressed={palette===p.label} className={palette===p.label?'active':''} onClick={()=>setPalette(p.label)}/>)}</div>
              <div className="studio-help-actions"><button onClick={recommend}><Symbol name="sparkle" size={15}/> Recomiéndame</button><button onClick={surprise}><Symbol name="heart" size={15}/> Sorpréndeme</button></div>
            </>}
            {stage==='follaje'&&<><h2>Un toque de <em>verde</em></h2><p className="studio-control-desc">El follaje acompaña las flores y aporta volumen. Estas opciones están incluidas en el precio de prueba.</p><div className="studio-choice-list"><ToggleCard selected={foliage==='eucalipto'} onClick={()=>setFoliage('eucalipto')} icon="leaf" title="Eucalipto suave" subtitle="Hojas redondeadas · incluido"/><ToggleCard selected={foliage==='clasico'} onClick={()=>setFoliage('clasico')} icon="leaf" title="Follaje clásico" subtitle="Hojas más finas · incluido"/></div></>}
            {stage==='envoltura'&&<><h2>El papel <em>perfecto</em></h2><p className="studio-control-desc">Viste tu ramo con uno de nuestros tonos. Cambia el papel en la vista previa.</p>{format==='caja'?<div className="studio-hint"><Symbol name="info" size={18}/> Has elegido presentación en caja. Puedes cambiarla en el paso «Formato» si prefieres papel.</div>:<div className="studio-choice-list">{PAPERS.map(p=><button key={p.label} className={`studio-color-choice ${paper===p.label?'active':''}`} onClick={()=>setPaper(p.label)} aria-pressed={paper===p.label}><span style={{background:p.value}}/><strong>{p.label}</strong>{paper===p.label&&<Symbol name="check" size={18}/>}</button>)}</div>}</>}
            {stage==='liston'&&<><h2>El último <em>detalle</em></h2><p className="studio-control-desc">Un listón sencillo puede cambiar todo. Elige el que mejor combine con tus flores.</p><div className="studio-choice-list">{RIBBONS.map(r=><button key={r.label} className={`studio-color-choice ${ribbon===r.label?'active':''}`} onClick={()=>setRibbon(r.label)} aria-pressed={ribbon===r.label}><span style={{background:r.value}}/><strong>{r.label}</strong>{ribbon===r.label&&<Symbol name="check" size={18}/>}</button>)}</div></>}
            {stage==='presentacion'&&<><h2>¿Cómo lo <em>imaginas?</em></h2><p className="studio-control-desc">Dos maneras de presentar tu creación. Ambas utilizan las mismas flores seleccionadas.</p><div className="studio-choice-list"><ToggleCard selected={format==='envuelto'} onClick={()=>setFormat('envuelto')} title="Ramo envuelto" subtitle="Incluido en el tamaño elegido" icon="wrap"/><ToggleCard selected={format==='caja'} onClick={()=>setFormat('caja')} title="Bouquet en caja" subtitle="+$5.00 solo para esta demostración" icon="box"/></div><p className="studio-smallprint">La caja real y su suplemento definitivo deben cotizarse con proveedores.</p></>}
            {stage==='dedicatoria'&&<><h2>Dilo con <em>flores</em></h2><p className="studio-control-desc">Puedes acompañar tu ramo con una dedicatoria especial.</p><label className="studio-message-label" htmlFor="studioMessage">Tu mensaje (opcional)</label><textarea id="studioMessage" className="studio-message-input" maxLength={160} rows={6} placeholder="Para alguien que hace florecer mis días..." value={message} onChange={e=>setMessage(e.target.value)}/><div className="studio-letter-counter">{message.length}/160 caracteres</div><div className="studio-hint"><Symbol name="heart" size={18}/> Lo más bonito es que el mensaje sea tuyo.</div></>}
          </div>
          <div className="studio-checkout-panel">
            <div className="studio-receipt-title"><span>Tu creación</span><span>{count} flores</span></div>
            <div className="studio-price-line"><span>Ramo {chosenSize.label.toLowerCase()}</span><strong>{money(chosenSize.price)}</strong></div>
            <div className="studio-price-line"><span>Recargos de flores (demo)</span><strong>{money(supplements)}</strong></div>
            {format==='caja'&&<div className="studio-price-line"><span>Caja (demo)</span><strong>{money(formatExtra)}</strong></div>}
            <div className="studio-total"><span>Total provisional</span><strong>{money(total)}</strong></div>
            <button className="studio-add" onClick={add}>Añadir al carrito <Symbol name="cart" size={19}/></button>
            <small>Entrega no incluida · Compra simulada · Sin cobros reales</small>
          </div>
        </aside>
      </div>
      <footer className="studio-bottom">
        <div className="studio-bottom-label"><span className="studio-kicker">TU COMBINACIÓN</span><span>{count} flores de temporada</span></div>
        <div className="studio-picked-list">{summaries.map(s=><div className="studio-picked" key={s.id}><FlowerThumbnail type={s.id} color={PALETTES.find(p=>p.label===palette).value}/><div><strong>{s.label}</strong><span>Cantidad: {s.quantity}</span></div><b>{s.value?`+${money(s.value)}`:'Incluidas'}</b></div>)}</div>
        <button className="studio-bottom-next" onClick={()=>setStage(STAGES[(STAGES.findIndex(s=>s.id===stage)+1)%STAGES.length].id)} aria-label="Ir al siguiente paso"><Symbol name="back" size={21}/></button>
      </footer>
    </div>
    <div className="studio-outside-note">MadeByU · Prototipo UX para investigación académica · Composiciones y recargos ilustrativos</div>
  </div>;
}
