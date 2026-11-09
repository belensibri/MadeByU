import React, {useEffect, useState} from 'react';
import './profile.css';

const keyFor=user=>user?`madebyu.demo.profile.v1.${user.id}`:null;
const empty=()=>({contact:{name:'',email:'',phone:''},addresses:[],defaultAddress:'',cards:[],defaultCard:''});
export const DEMO_CARDS=[{id:'visa-demo',brand:'Visa',last4:'4242'},{id:'mastercard-demo',brand:'Mastercard',last4:'4444'}];
const clean=(value,max=160)=>typeof value==='string'?value.slice(0,max):'';
function normalize(value){
  if(!value||typeof value!=='object')return empty();
  const addresses=(Array.isArray(value.addresses)?value.addresses:[]).filter(a=>a&&typeof a==='object'&&typeof a.id==='string').slice(0,20).map(a=>({id:clean(a.id),label:clean(a.label),recipient:clean(a.recipient),phone:clean(a.phone,40),line:clean(a.line,300),city:clean(a.city),reference:clean(a.reference,300)}));
  const cards=DEMO_CARDS.filter(c=>Array.isArray(value.cards)&&value.cards.some(saved=>saved?.id===c.id));
  return {contact:{name:clean(value.contact?.name),email:clean(value.contact?.email),phone:clean(value.contact?.phone,40)},addresses,cards,defaultAddress:addresses.some(a=>a.id===value.defaultAddress)?value.defaultAddress:(addresses[0]?.id||''),defaultCard:cards.some(c=>c.id===value.defaultCard)?value.defaultCard:(cards[0]?.id||'')};
}
export function useProfile(user){
  const key=keyFor(user);
  const [profile,setProfile]=useState(()=>{
    if(!key)return empty();
    try{const saved=localStorage.getItem(key);if(saved)return normalize(JSON.parse(saved));}catch{}
    return {...empty(),contact:{name:user.name,email:user.email,phone:''}};
  });
  const [storageError,setStorageError]=useState('');
  useEffect(()=>{if(!key)return;try{localStorage.setItem(key,JSON.stringify(profile));setStorageError('');}catch{setStorageError('El navegador no permite guardar los cambios. Se conservarán solo mientras esta página esté abierta.');}},[profile,key]);
  const update=change=>setProfile(previous=>normalize(typeof change==='function'?change(previous):change));
  return {profile,update,storageError};
}
export function addressText(address){return address?[address.recipient,address.phone,address.line,address.city,address.reference].filter(Boolean).join(' · '):'';}
const newAddress=()=>({id:'',label:'',recipient:'',phone:'',line:'',city:'',reference:''});

export default function Profile({profile,update,storageError,navigate,user,onLogout}){
  const [contact,setContact]=useState(profile.contact);
  const [address,setAddress]=useState(null);
  const [notice,setNotice]=useState('');
  const saveAddress=e=>{e.preventDefault();const item={...address,id:address.id||crypto.randomUUID()};update(p=>({...p,addresses:p.addresses.some(a=>a.id===item.id)?p.addresses.map(a=>a.id===item.id?item:a):[...p.addresses,item],defaultAddress:p.defaultAddress||item.id}));setAddress(null);setNotice('Dirección guardada.');};
  const changeAddress=(key,value)=>setAddress(a=>({...a,[key]:value}));
  return <div className="container page-content profile-page">
    <div className="breadcrumb"><button onClick={()=>navigate('/')}>MadeByU</button> / <span>Mi perfil</span></div>
    <div className="profile-session-bar"><p>Sesión de prueba · {user.email}</p><button className="btn btn-outline" onClick={onLogout}>Cerrar sesión</button></div><div className="profile-heading"><div><span className="eyebrow">TU ESPACIO MADEBYU</span><h1>Hola, <em>{profile.contact.name.split(' ')[0]||'qué gusto verte'}.</em></h1><p>Tus detalles, listos para la próxima ocasión.</p></div><span className="profile-avatar" aria-hidden="true">{profile.contact.name.slice(0,1).toUpperCase()||'✿'}</span></div>
    {storageError&&<p className="profile-error" role="alert">{storageError}</p>}
    <div className="profile-notice" role="status" aria-live="polite">{notice}</div>
    <div className="profile-layout"><nav className="profile-nav" aria-label="Secciones del perfil"><a href="#datos" onClick={e=>{e.preventDefault();document.getElementById('datos')?.scrollIntoView();}}>Mis datos</a><a href="#direcciones" onClick={e=>{e.preventDefault();document.getElementById('direcciones')?.scrollIntoView();}}>Mis direcciones <span>{profile.addresses.length}</span></a><a href="#tarjetas" onClick={e=>{e.preventDefault();document.getElementById('tarjetas')?.scrollIntoView();}}>Métodos de pago <span>{profile.cards.length}</span></a><button className="btn btn-outline" onClick={()=>navigate('/catalogo/arreglos')}>Seguir explorando</button></nav>
      <div className="profile-sections">
        <section className="profile-section" id="datos"><div className="profile-section-heading"><div><span className="eyebrow">01 · CONTACTO</span><h2>Mis datos</h2><p>Se completarán por ti al finalizar un pedido de prueba.</p></div></div><form onSubmit={e=>{e.preventDefault();update(p=>({...p,contact}));setNotice('Tus datos se guardaron.');}}><div className="fields-grid"><label>Nombre o alias <input required maxLength={160} autoComplete="off" value={contact.name} onChange={e=>setContact({...contact,name:e.target.value})}/></label><label>Correo de prueba <input type="email" required maxLength={160} autoComplete="off" value={contact.email} onChange={e=>setContact({...contact,email:e.target.value})}/></label><label>Teléfono de prueba <input type="tel" maxLength={40} autoComplete="off" value={contact.phone} onChange={e=>setContact({...contact,phone:e.target.value})}/></label></div><button className="btn btn-primary" type="submit">Guardar mis datos</button></form></section>
        <section className="profile-section" id="direcciones"><div className="profile-section-heading"><div><span className="eyebrow">02 · TUS LUGARES</span><h2>Mis direcciones</h2><p>Casa, oficina o ese lugar especial para sorprender.</p></div><button className="btn btn-outline" disabled={profile.addresses.length>=20} onClick={()=>{setAddress(newAddress());setNotice('');}}>Añadir dirección</button></div>
          {profile.addresses.length===0&&!address&&<div className="profile-empty"><span aria-hidden="true">⌂</span><h3>Tu primer destino especial</h3><p>Guarda una dirección para seleccionarla en tu próximo pedido.</p></div>}
          <div className="profile-addresses">{profile.addresses.map(a=><article className="saved-address" key={a.id}><div className="saved-card-heading"><h3>{a.label}</h3>{profile.defaultAddress===a.id&&<span className="profile-badge">Predeterminada</span>}</div><strong>{a.recipient}</strong><p>{a.line}<br/>{a.city}</p>{a.phone&&<p>{a.phone}</p>}{a.reference&&<small>{a.reference}</small>}<div className="profile-card-actions"><button type="button" onClick={()=>{setAddress({...a});setNotice('');}}>Editar {a.label}</button>{profile.defaultAddress!==a.id&&<button type="button" onClick={()=>update(p=>({...p,defaultAddress:a.id}))}>Usar por defecto {a.label}</button>}<button type="button" onClick={()=>{update(p=>({...p,addresses:p.addresses.filter(item=>item.id!==a.id)}));if(address?.id===a.id)setAddress(null);setNotice('Dirección eliminada.');}}>Eliminar {a.label}</button></div></article>)}</div>
          {address&&<form className="profile-address-form" onSubmit={saveAddress}><h3>{address.id?'Editar dirección':'Nueva dirección'}</h3><div className="fields-grid"><label>Nombre de la dirección <input required maxLength={80} placeholder="Casa, oficina…" value={address.label} onChange={e=>changeAddress('label',e.target.value)}/></label><label>Persona que recibe <input required maxLength={160} value={address.recipient} onChange={e=>changeAddress('recipient',e.target.value)}/></label><label>Teléfono de contacto <input type="tel" maxLength={40} value={address.phone} onChange={e=>changeAddress('phone',e.target.value)}/></label><label>Municipio y departamento <input required maxLength={160} value={address.city} onChange={e=>changeAddress('city',e.target.value)}/></label></div><label>Dirección de prueba <textarea aria-label="Dirección de prueba" required maxLength={300} rows={3} value={address.line} onChange={e=>changeAddress('line',e.target.value)}/></label><label>Punto de referencia (opcional) <input maxLength={300} value={address.reference} onChange={e=>changeAddress('reference',e.target.value)}/></label><div className="profile-form-actions"><button className="btn btn-primary" type="submit">Guardar dirección</button><button className="btn btn-outline" type="button" onClick={()=>setAddress(null)}>Cancelar</button></div></form>}
        </section>
        <section className="profile-section" id="tarjetas"><div className="profile-section-heading"><div><span className="eyebrow">03 · MÉTODOS DE PAGO</span><h2>Mis tarjetas</h2><p>Prueba cómo se verán tus métodos guardados.</p></div></div><p className="profile-local-note">Solo tarjetas ficticias de demostración. No introduzcas números de tarjeta ni CVV. Ningún método de esta sección permite cobrar.</p>
          <div className="profile-payment-cards">{profile.cards.map(card=><article className="saved-payment" key={card.id}><div className="saved-card-heading"><strong>{card.brand}</strong><span className="profile-badge">Demo</span></div><p className="payment-digits">•••• · •••• · •••• · {card.last4}</p><small>{profile.defaultCard===card.id?'Método predeterminado':'Tarjeta de demostración'}</small><div className="profile-card-actions">{profile.defaultCard!==card.id&&<button onClick={()=>update(p=>({...p,defaultCard:card.id}))}>Usar por defecto {card.brand}</button>}<button onClick={()=>{update(p=>({...p,cards:p.cards.filter(c=>c.id!==card.id)}));setNotice('Tarjeta de demostración eliminada.');}}>Eliminar {card.brand}</button></div></article>)}</div>
          <div className="profile-form-actions">{DEMO_CARDS.filter(card=>!profile.cards.some(c=>c.id===card.id)).map(card=><button key={card.id} className="btn btn-outline" onClick={()=>{update(p=>({...p,cards:[...p.cards,card],defaultCard:p.defaultCard||card.id}));setNotice('Tarjeta de demostración añadida.');}}>Añadir {card.brand} de prueba · {card.last4}</button>)}</div>
        </section>
      </div>
    </div>
  </div>;
}

export function SavedAddressPicker({profile,onChoose,navigate}){
  const [selected,setSelected]=useState(profile.defaultAddress);
  return <div className="saved-checkout-picker"><label>Usar una dirección guardada <select value={selected} onChange={e=>{setSelected(e.target.value);onChoose(profile.addresses.find(a=>a.id===e.target.value));}}><option value="">Escribir otra dirección</option>{profile.addresses.map(a=><option value={a.id} key={a.id}>{a.label} · {a.city}</option>)}</select></label><button type="button" className="text-link" onClick={()=>navigate('/perfil')}>Gestionar mis direcciones</button></div>;
}
export function SavedPaymentPicker({profile,value,onChange,navigate}){
  return <div className="saved-checkout-picker"><label>Método para esta simulación <select value={value} onChange={e=>onChange(e.target.value)}><option value="">Continuar sin tarjeta guardada</option>{profile.cards.map(c=><option key={c.id} value={c.id}>{c.brand} · •••• {c.last4} · demo</option>)}</select></label><button type="button" className="text-link" onClick={()=>navigate('/perfil')}>Gestionar métodos de pago</button></div>;
}
