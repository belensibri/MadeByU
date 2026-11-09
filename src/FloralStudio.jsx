import React, { useEffect, useMemo, useRef, useState } from 'react';
import BouquetPreview, { FlowerThumbnail, captureBouquet } from './PhotoBouquet.jsx';
import './studio.css';

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
function initialCounts(size) { const n=SIZES.find(s=>s.id===size).count; return {claveles:Math.ceil(n/2),margaritas:Math.floor(n/2),rosas:0,girasoles:0}; }
function Symbol({name,size=22}){
  const line={fill:'none',stroke:'currentColor',strokeWidth:1.65,strokeLinecap:'round',strokeLinejoin:'round'};
  const path={
    user:<><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
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
function ToggleCard({selected,onClick,title,subtitle,icon}){return <button type="button" className={`studio-toggle ${selected?'is-selected':''}`} onClick={onClick} aria-pressed={selected}><span className="studio-toggle-icon"><Symbol name={icon} size={23}/></span><span><strong>{title}</strong><small>{subtitle}</small></span>{selected&&<Symbol name="check" size={18}/>}</button>}

export default function FloralStudio({navigate,onAdd}){
  const previewRef=useRef(null);
  const controlsRef=useRef(null);
  const [adding,setAdding]=useState(false);
  const [imageError,setImageError]=useState('');
  const [size,setSize]=useState('mediano');
  const [counts,setCounts]=useState(()=>initialCounts('mediano'));
  const [stage,setStage]=useState('flores');
  const [palette,setPalette]=useState('Rosa');
  const [foliage,setFoliage]=useState('eucalipto');
  const [paper,setPaper]=useState('Azul salvia');
  const [ribbon,setRibbon]=useState('Verde salvia');
  const [format,setFormat]=useState('envuelto');
  const [message,setMessage]=useState('');
  const stageChanged=useRef(stage);
  const stageIndex=STAGES.findIndex(item=>item.id===stage);
  useEffect(()=>{
    controlsRef.current?.scrollTo({top:0,behavior:'instant'});
    if(stageChanged.current!==stage){
      const heading=controlsRef.current?.querySelector('h2');
      heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:true});
      if(window.matchMedia('(max-width:850px)').matches)controlsRef.current?.scrollIntoView({block:'start',behavior:'instant'});
    }
    stageChanged.current=stage;
  },[stage]);
  const chosenSize=SIZES.find(s=>s.id===size);
  const count=Object.values(counts).reduce((a,b)=>a+b,0);
  const supplements=FLOWERS.reduce((sum,f)=>sum+(counts[f.id]||0)*f.extra,0);
  const formatExtra=format==='caja'?5:0;
  const total=chosenSize.price+supplements+formatExtra;
  const uniqueFlowers=FLOWERS.filter(f=>counts[f.id]>0);
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
  async function add(){
    if(adding)return;
    setAdding(true);setImageError('');
    try {
      const image=await captureBouquet(previewRef.current.querySelector('svg'));
      const description=FLOWERS.filter(f=>counts[f.id]).map(f=>`${counts[f.id]} ${f.label.toLowerCase()}`).join(', ');
      onAdd({id:`custom-${Date.now()}`,name:`Mi ramo ${chosenSize.label.toLowerCase()}`,price:total,image,custom:true,description:`${count} flores: ${description}. ${format==='caja'?'Bouquet en caja':`Papel ${paper}`}, listón ${ribbon}, tono ${palette}.${message?` Dedicatoria: ${message}`:''}`});
      navigate('/carrito');
    } catch(error) {
      setImageError('No pudimos guardar la vista previa. Intenta añadir el ramo nuevamente.');
    } finally {setAdding(false);}
  }
  return <div className="studio-page">
    <div className="studio-botanical-corner" aria-hidden="true"><FlowerThumbnail type="eucalipto"/></div>
    <div className="studio-shell">
      <header className="studio-topbar">
        <button className="studio-logo" onClick={()=>navigate('/')} aria-label="Volver al inicio de MadeByU"><span className="studio-logo-flower">✿</span>MadeByU<span className="studio-logo-dot">.</span></button>
        <span className="studio-top-divider"/><div className="studio-top-caption">Estudio floral <span>/</span> Crea tu ramo</div>
        <div className="studio-top-actions"><button className="profile-link" onClick={()=>navigate('/perfil')} aria-label="Mi perfil"><Symbol name="user" size={20}/></button><span className="studio-top-annotation">Tu detalle, a tu manera</span><button className="studio-top-back" onClick={()=>navigate('/catalogo/arreglos')}><Symbol name="back" size={17}/> Explorar catálogo</button><button className="studio-cart-circle" onClick={()=>navigate('/carrito')} aria-label="Ir al carrito"><Symbol name="cart" size={20}/></button></div>
      </header>
      <div className="studio-body">
        <aside className="studio-steps" aria-label="Pasos de personalización">
          <div className="studio-steps-title">PERSONALIZA</div>
          {STAGES.map(s=><button key={s.id} className={`studio-step ${stage===s.id?'is-current':''}`} onClick={()=>setStage(s.id)} aria-current={stage===s.id?'step':undefined}><span className="studio-step-circle"><Symbol name={s.icon} size={24}/></span><span>{s.label}</span></button>)}
          <div className="studio-steps-foot"><Symbol name="sparkle" size={22}/><span>Hecho especialmente<br/>por ti ♡</span></div>
        </aside>
        <section className="studio-center" aria-label="Visualización del ramo personalizado">
          <div className="studio-center-intro"><span className="studio-kicker">DISEÑADO POR TI</span><h1>Hazlo <em>único.</em></h1><p>Cada flor cuenta una historia. Crea la tuya.</p></div>
          <div className="studio-preview" ref={previewRef}><BouquetPreview counts={counts} palette={palette} paper={paper} ribbon={ribbon} foliage={foliage} format={format}/></div>
          <div className="studio-preview-label"><span className="studio-green-dot"/> Simulación visual · El ramo final puede variar</div>
          <div className="studio-floral-ghost" aria-hidden="true">MadeByU</div>
        </section>
        <aside className="studio-controls">
          <div className="studio-control-top"><span className="studio-kicker">DISEÑA TU DETALLE</span><span className="studio-step-count">{String(STAGES.findIndex(s=>s.id===stage)+1).padStart(2,'0')} / 06</span></div>
          <div className="studio-control-scroll" ref={controlsRef}>
            {stage==='flores'&&<>
              <h2>Escoge tus <em>flores</em></h2>
              <label className="studio-size-select">Tamaño del ramo<select value={size} onChange={e=>chooseSize(e.target.value)}>{SIZES.map(item=><option value={item.id} key={item.id}>{item.label} · {item.count} flores · {money(item.price)}</option>)}</select></label>
              <div className="studio-field-title flower-field-title">Tipo de flor <span>Selecciona una variedad</span></div>
              <div className="studio-flower-grid">{FLOWERS.map(f=><div key={f.id} className={`studio-flower-card ${counts[f.id]>0?'has-flowers':''}`}>
                <div className="studio-flower-tile"><FlowerThumbnail type={f.id} color={PALETTES.find(p=>p.label===palette).value}/><strong>{f.label}</strong><span>{f.extra?`+${money(f.extra)} por flor`:'Incluidas'}</span></div>
                <div className="studio-stepper"><button type="button" onClick={()=>switchFlower(f.id,-1)} disabled={!counts[f.id]} aria-label={`Quitar ${f.short}`}><Symbol name="minus" size={15}/></button><strong aria-label={`${counts[f.id]} ${f.label.toLowerCase()}`}>{counts[f.id]}</strong><button type="button" onClick={()=>switchFlower(f.id,1)} disabled={counts[f.id]===chosenSize.count} aria-label={`Sustituir otra flor por ${f.short}`}><Symbol name="plus" size={15}/></button></div>
              </div>)}</div>
              <p className="studio-count-note" aria-live="polite">{count} de {chosenSize.count} flores · Al aumentar una variedad, sustituye a otra.</p>
              <div className="studio-field-title">Color principal</div><div className="studio-color-row">{PALETTES.map(p=><button key={p.label} style={{'--swatch':p.value}} aria-label={`Color ${p.label}`} title={p.label} aria-pressed={palette===p.label} className={palette===p.label?'active':''} onClick={()=>setPalette(p.label)}/>)}</div>
              <div className="studio-help-actions"><button onClick={recommend}><Symbol name="sparkle" size={15}/> Recomiéndame</button><button onClick={surprise}><Symbol name="heart" size={15}/> Sorpréndeme</button></div>
            </>}
            {stage==='follaje'&&<><h2>Un toque de <em>verde</em></h2><p className="studio-control-desc">El follaje acompaña las flores y aporta volumen. Estas opciones están incluidas en el precio de prueba.</p><div className="studio-choice-list"><ToggleCard selected={foliage==='eucalipto'} onClick={()=>setFoliage('eucalipto')} icon="leaf" title="Eucalipto suave" subtitle="Hojas redondeadas · incluido"/><ToggleCard selected={foliage==='clasico'} onClick={()=>setFoliage('clasico')} icon="leaf" title="Follaje clásico" subtitle="Hojas más finas · incluido"/></div></>}
            {stage==='envoltura'&&<><h2>El papel <em>perfecto</em></h2><p className="studio-control-desc">Viste tu ramo con uno de nuestros tonos. Cambia el papel en la vista previa.</p>{format==='caja'?<div className="studio-hint"><Symbol name="info" size={18}/> Has elegido presentación en caja. Puedes cambiarla en el paso «Formato» si prefieres papel.</div>:<div className="studio-choice-list">{PAPERS.map(p=><button key={p.label} className={`studio-color-choice ${paper===p.label?'active':''}`} onClick={()=>setPaper(p.label)} aria-pressed={paper===p.label}><span style={{background:p.value}}/><strong>{p.label}</strong>{paper===p.label&&<Symbol name="check" size={18}/>}</button>)}</div>}</>}
            {stage==='liston'&&<><h2>El último <em>detalle</em></h2><p className="studio-control-desc">Un listón sencillo puede cambiar todo. Elige el que mejor combine con tus flores.</p><div className="studio-choice-list">{RIBBONS.map(r=><button key={r.label} className={`studio-color-choice ${ribbon===r.label?'active':''}`} onClick={()=>setRibbon(r.label)} aria-pressed={ribbon===r.label}><span style={{background:r.value}}/><strong>{r.label}</strong>{ribbon===r.label&&<Symbol name="check" size={18}/>}</button>)}</div></>}
            {stage==='presentacion'&&<><h2>¿Cómo lo <em>imaginas?</em></h2><p className="studio-control-desc">Dos maneras de presentar tu creación. Ambas utilizan las mismas flores seleccionadas.</p><div className="studio-choice-list"><ToggleCard selected={format==='envuelto'} onClick={()=>setFormat('envuelto')} title="Ramo envuelto" subtitle="Incluido en el tamaño elegido" icon="wrap"/><ToggleCard selected={format==='caja'} onClick={()=>setFormat('caja')} title="Bouquet en caja" subtitle="+$5.00 solo para esta demostración" icon="box"/></div><p className="studio-smallprint">La caja real y su suplemento definitivo deben cotizarse con proveedores.</p></>}
            {stage==='dedicatoria'&&<><h2>Dilo con <em>flores</em></h2><p className="studio-control-desc">Puedes acompañar tu ramo con una dedicatoria especial.</p><label className="studio-message-label" htmlFor="studioMessage">Tu mensaje (opcional)</label><textarea id="studioMessage" className="studio-message-input" maxLength={160} rows={6} placeholder="Para alguien que hace florecer mis días..." value={message} onChange={e=>setMessage(e.target.value)}/><div className="studio-letter-counter">{message.length}/160 caracteres</div><div className="studio-hint"><Symbol name="heart" size={18}/> Lo más bonito es que el mensaje sea tuyo.</div></>}
          </div>
          <nav className="studio-stage-navigation" aria-label="Navegar por la personalización">
            {stageIndex>0&&<button type="button" className="studio-stage-back" disabled={adding} onClick={()=>setStage(STAGES[stageIndex-1].id)}><Symbol name="back" size={16}/> Atrás</button>}
            {stageIndex<STAGES.length-1?<button type="button" className="studio-stage-next" onClick={()=>setStage(STAGES[stageIndex+1].id)}>Continuar a {STAGES[stageIndex+1].label.toLowerCase()} <Symbol name="back" size={17}/></button>:<button type="button" className="studio-add" onClick={add} disabled={adding}>{adding?'Guardando tu ramo…':'Añadir al carrito'} <Symbol name="cart" size={19}/></button>}
          </nav>
          {imageError&&<p role="alert" className="studio-image-error">{imageError}</p>}
        </aside>
      </div>
      <footer className="studio-bottom">
        <div className="studio-bottom-label"><span className="studio-kicker">TU COMBINACIÓN</span><span>{count} flores de temporada</span></div>
        <div className="studio-picked-list">{summaries.map(s=><div className="studio-picked" key={s.id}><FlowerThumbnail type={s.id} color={PALETTES.find(p=>p.label===palette).value}/><div><strong>{s.label}</strong><span>Cantidad: {s.quantity}</span></div><b>{s.value?`+${money(s.value)}`:'Incluidas'}</b></div>)}</div>
        <section className="studio-checkout-panel" aria-label="Resumen de precio del ramo">
          <div className="studio-total"><span>Total del ramo</span><strong aria-live="polite">{money(total)}</strong></div>
          <details className="studio-price-details"><summary>Ver desglose del precio</summary><div>
            <div className="studio-price-line"><span>Ramo {chosenSize.label.toLowerCase()}</span><strong>{money(chosenSize.price)}</strong></div>
            <div className="studio-price-line"><span>Recargos de flores</span><strong>{money(supplements)}</strong></div>
            {format==='caja'&&<div className="studio-price-line"><span>Caja</span><strong>{money(formatExtra)}</strong></div>}
          </div></details>
          <small>El envío se calcula al finalizar la compra.</small>
        </section>
      </footer>
    </div>
    <div className="studio-outside-note">MadeByU · Prototipo UX para investigación académica · Composiciones y recargos ilustrativos</div>
  </div>;
}
