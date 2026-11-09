import React, {useState} from 'react';
import bouquet from './assets/catalog/p3.webp';
import './auth.css';

const ACCOUNTS='madebyu.demo.accounts.v1';
const SESSION='madebyu.demo.session.v1';
export const DEMO_PASSWORD='Flores123!';
function readAccounts(){try{const saved=JSON.parse(localStorage.getItem(ACCOUNTS));return Array.isArray(saved)?saved.filter(a=>typeof a?.id==='string'&&typeof a?.name==='string'&&typeof a?.email==='string').slice(0,50).map(a=>({id:a.id.slice(0,100),name:a.name.slice(0,100),email:a.email.slice(0,160)})):[];}catch{return [];}}
export function useDemoAuth(){
  const [user,setUser]=useState(()=>{try{return readAccounts().find(a=>a.id===sessionStorage.getItem(SESSION))||null;}catch{return null;}});
  const [warning,setWarning]=useState('');
  const begin=account=>{try{sessionStorage.setItem(SESSION,account.id);}catch{setWarning('La sesión de prueba durará solo mientras esta página siga abierta.');}setUser(account);};
  const register=({name,email,password})=>{
    const accounts=readAccounts();email=email.trim().toLowerCase();name=name.trim();
    if(!name)throw new Error('Escribe un nombre o alias de prueba.');
    if(password!==DEMO_PASSWORD)throw new Error(`Usa la contraseña de demostración: ${DEMO_PASSWORD}`);
    if(accounts.some(a=>a.email===email))throw new Error('Ese correo de prueba ya está registrado. Puedes iniciar sesión.');
    if(accounts.length>=50)throw new Error('Se alcanzó el límite de cuentas de prueba de este navegador.');
    const account={id:crypto.randomUUID(),name,email};
    try{localStorage.setItem(ACCOUNTS,JSON.stringify([...accounts,account]));}catch{throw new Error('Este navegador no permite guardar la cuenta de prueba. Habilita el almacenamiento local e inténtalo otra vez.');}
    begin(account);
  };
  const login=({email,password})=>{const account=readAccounts().find(a=>a.email===email.trim().toLowerCase());if(!account||password!==DEMO_PASSWORD)throw new Error('Revisa el correo y la contraseña de demostración.');begin(account);};
  const logout=()=>{try{sessionStorage.removeItem(SESSION);}catch{}setUser(null);setWarning('');window.location.hash='/ingresar';};
  return {user,register,login,logout,warning};
}

export default function DemoAuth({mode='login',auth,navigate}){
  const signup=mode==='register',reset=mode==='reset';
  const [name,setName]=useState('');const [email,setEmail]=useState('');
  const [password,setPassword]=useState(signup?DEMO_PASSWORD:'');const [visible,setVisible]=useState(false);
  const [error,setError]=useState('');
  const submit=e=>{e.preventDefault();setError('');try{if(signup){auth.register({name,email,password});}else auth.login({email,password});navigate('/perfil');}catch(err){setError(err.message);}};
  return <div className="container auth-page"><div className="auth-layout">
    <aside className="auth-visual"><img src={bouquet} alt="Ramo de rosas y claveles rosados"/><div><span className="eyebrow">TU DETALLE, A TU MANERA</span><h2>Las mejores sorpresas<br/>empiezan <em>contigo.</em></h2><p>Un espacio para tus lugares y tus próximos detalles.</p></div></aside>
    <section className="auth-panel"><span className="eyebrow">MI CUENTA MADEBYU</span><h1>{reset?'Una ayuda para entrar':signup?'Crea tu cuenta':'Qué gusto verte.'}</h1><p className="auth-intro">{reset?'En este prototipo no enviamos correos de recuperación.':signup?'Guarda tus direcciones y prepara tu próximo detalle.':'Entra a tu perfil para encontrar tus datos guardados.'}</p>
      {auth.warning&&<p role="alert" className="profile-error">{auth.warning}</p>}
      {reset?<div className="auth-reset"><p>La contraseña de todas las cuentas de demostración es <strong>{DEMO_PASSWORD}</strong>.</p><button className="btn btn-primary full" onClick={()=>navigate('/ingresar')}>Volver a iniciar sesión</button></div>:<>
        <form onSubmit={submit} className="auth-form">
          {signup&&<label>Nombre o alias de prueba <input required maxLength={100} value={name} onChange={e=>setName(e.target.value)} placeholder="Por ejemplo, Ana" autoComplete="off"/></label>}
          <label>Correo de prueba <input required type="email" maxLength={160} value={email} onChange={e=>setEmail(e.target.value)} placeholder="ana@ejemplo.com" autoComplete="off"/></label>
          <label htmlFor="demoPassword">Contraseña de demostración</label><div className="auth-password"><input id="demoPassword" required type={visible?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} readOnly={signup} autoComplete="off" maxLength={100}/><button type="button" onClick={()=>setVisible(v=>!v)} aria-label={visible?'Ocultar contraseña':'Mostrar contraseña'}>{visible?'Ocultar':'Mostrar'}</button></div>
          {!signup&&<button type="button" className="auth-text-button" onClick={()=>navigate('/recuperar')}>¿Olvidaste tu contraseña?</button>}
          {error&&<p role="alert" className="profile-error">{error}</p>}
          <button type="submit" className="btn btn-primary full large">{signup?'Crear cuenta de prueba':'Iniciar sesión de prueba'}</button>
        </form>
        <p className="auth-switch">{signup?'¿Ya tienes una cuenta?':'¿Es tu primera visita?'} <button className="auth-text-button" onClick={()=>navigate(signup?'/ingresar':'/registro')}>{signup?'Inicia sesión':'Crea tu cuenta'}</button></p>
      </>}
      <button className="auth-text-button" onClick={()=>navigate('/catalogo/arreglos')}>Seguir explorando como invitado →</button>
    </section>
  </div></div>;
}
