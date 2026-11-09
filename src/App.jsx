import DeliveryOptions, {deliveryQuote} from './DeliveryOptions.jsx';
import DemoAuth, {useDemoAuth} from './DemoAuth.jsx';
import Profile, {useProfile, addressText, SavedAddressPicker, SavedPaymentPicker} from './Profile.jsx';
import FloralStudio from './FloralStudio.jsx';
import React, { useEffect, useMemo, useState } from 'react';
import miniRosa from './assets/catalog/p1.webp';
import miniSol from './assets/catalog/p2.webp';
import petalosRosados from './assets/catalog/p3.webp';
import abrazoDulce from './assets/catalog/p4.webp';
import alegriaDeSol from './assets/catalog/p5.webp';
import clasicoRojo from './assets/catalog/p6.webp';
import cajaPrimavera from './assets/catalog/p7.webp';
import grandeDecorativo from './assets/catalog/p8.webp';

const money = number => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
const sizes = [
  { id: 'mini', label: 'Minirramo', count: 5, price: 9.99, subtitle: 'Un detalle bonito' },
  { id: 'pequeno', label: 'Pequeño', count: 8, price: 13.99, subtitle: 'Para alegrar el día' },
  { id: 'mediano', label: 'Mediano', count: 14, price: 21.99, subtitle: 'Nuestro favorito' },
  { id: 'grande', label: 'Grande', count: 20, price: 29.99, subtitle: 'Para ocasiones especiales' }
];
const products = [
  { id: 'p1', name: 'Pequeño gesto', size: 'mini', price: 9.99, image: miniRosa, colors: ['Rosa', 'Blanco'], flowers: ['Claveles', 'Margaritas'], occasions: ['Cumpleaños', 'Agradecimiento'], type: 'Ramo envuelto', description: 'Un detalle delicado y alegre con flores de temporada.' },
  { id: 'p2', name: 'Rayito de sol', size: 'mini', price: 9.99, image: miniSol, colors: ['Amarillo', 'Blanco'], flowers: ['Girasoles', 'Margaritas'], occasions: ['Cumpleaños', 'Graduación'], type: 'Ramo envuelto', description: 'Una combinación luminosa que contagia alegría.' },
  { id: 'p3', name: 'Pétalos bonitos', size: 'pequeno', price: 13.99, image: petalosRosados, colors: ['Rosa', 'Blanco'], flowers: ['Rosas', 'Claveles'], occasions: ['Aniversario', 'Agradecimiento'], type: 'Ramo envuelto', description: 'Flores suaves para regalar algo con intención.' },
  { id: 'p4', name: 'Abrazo dulce', size: 'pequeno', price: 13.99, image: abrazoDulce, colors: ['Morado', 'Blanco'], flowers: ['Claveles', 'Margaritas'], occasions: ['Cumpleaños', 'Aniversario'], type: 'Ramo envuelto', description: 'Una mezcla pastel para un momento especial.' },
  { id: 'p5', name: 'Alegría de sol', size: 'mediano', price: 21.99, image: alegriaDeSol, colors: ['Amarillo', 'Blanco'], flowers: ['Girasoles', 'Margaritas'], occasions: ['Graduación', 'Cumpleaños'], type: 'Ramo envuelto', description: 'Un ramo cálido, vistoso y lleno de energía.' },
  { id: 'p6', name: 'Clásico con cariño', size: 'mediano', price: 21.99, image: clasicoRojo, colors: ['Rojo', 'Rosa'], flowers: ['Rosas', 'Claveles'], occasions: ['Aniversario', 'San Valentín'], type: 'Ramo envuelto', description: 'Una propuesta romántica con detalles hechos para ti.' },
  { id: 'p7', name: 'Primavera en caja', size: 'mediano', price: 26.99, image: cajaPrimavera, colors: ['Rosa', 'Morado'], flowers: ['Claveles'], occasions: ['Cumpleaños', 'Agradecimiento'], type: 'Bouquet en caja', description: 'Nuestra presentación en caja, con un toque delicado.' },
  { id: 'p8', name: 'Mil emociones', size: 'grande', price: 29.99, image: grandeDecorativo, colors: ['Rosa', 'Morado'], flowers: ['Rosas', 'Claveles', 'Margaritas'], occasions: ['Aniversario', 'Graduación'], type: 'Ramo envuelto', description: 'Un ramo lleno de personalidad para celebrar en grande.' }
];
const UX_TASKS = [
  'Encuentra un ramo que cueste menos de $15 y revisa cuántas flores incluye.',
  'Busca un arreglo para cumpleaños usando el menú de navegación.',
  'Crea un ramo mediano, añade dos rosas y comprueba cuánto cambia el precio.',
  'Añade un producto al carrito y revisa las opciones de retiro y entrega.',
  'Completa el checkout de demostración y llega a la confirmación de prueba.'
];
function readRoute() { return decodeURIComponent(window.location.hash.slice(1) || '/'); }
const pick = (obj, key) => obj[key] || '';

function Icon({name, size=20, className=''}) {
  const paths = {
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
    cart: <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6H19a2 2 0 0 0 2-1.6L23 6H6"/></>,
    chevron: <path d="m6 9 6 6 6-6"/>,
    right: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m20 6-11 11-5-5"/>,
    leaf: <><path d="M20 4c-8 0-15 4-15 13a4 4 0 0 0 4 4c9 0 13-7 11-17Z"/><path d="M5 17c2-2 6-6 12-8"/></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    close: <path d="M18 6 6 18M6 6l12 12"/>,
    star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>,
    info: <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></>,
    lock: <><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    gift: <><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13M12 8C5 8 4 5 6 3c3-3 6 3 6 5Zm0 0c7 0 8-3 6-5-3-3-6 3-6 5Z"/></>,
    filter: <><path d="M4 7h16M7 12h10M10 17h4"/></>,
    flower: <><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="4"/><circle cx="19" cy="12" r="4"/><circle cx="12" cy="19" r="4"/><circle cx="5" cy="12" r="4"/></>,
    minus: <path d="M5 12h14"/>,
    plus: <path d="M12 5v14M5 12h14"/>
  };
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none" aria-hidden="true">{paths[name]||paths.flower}</svg>;
}

function Brand({ navigate }) { return <button className="brand" onClick={()=>navigate('/')} aria-label="MadeByU, volver al inicio"><span className="brand-icon">✿</span> MadeByU<span className="brand-dot">.</span></button>; }
function Header({navigate,cartCount,user}) {
  const [menuOpen,setMenuOpen]=useState(false);
  const navData=[
    {name:'Por arreglos florales',target:'/catalogo/arreglos',sub:[['Ramos envueltos','/catalogo/arreglos?tipo=Ramo%20envuelto'],['Bouquets en caja','/catalogo/arreglos?tipo=Bouquet%20en%20caja'],['Todos los arreglos','/catalogo/arreglos']]},
    {name:'Por ocasiones',target:'/catalogo/ocasiones',sub:['Cumpleaños','Aniversario','Graduación','San Valentín','Agradecimiento'].map(n=>[n,`/catalogo/ocasiones?ocasion=${encodeURIComponent(n)}`])},
    {name:'Por tipos de flores',target:'/catalogo/flores',sub:['Rosas','Claveles','Girasoles','Margaritas'].map(n=>[n,`/catalogo/flores?flor=${encodeURIComponent(n)}`])}
  ];
  const go=route=>{navigate(route);setMenuOpen(false)};
  return <>
    <div className="announcement">Flores bonitas, a tu manera · San Salvador y La Libertad <span>♡</span></div>
    <header className="header"><div className="container header-inner">
      <Brand navigate={go}/>
      <nav className={`main-nav ${menuOpen?'show':''}`} aria-label="Menú principal">
        {navData.map(item=><div className="nav-item" key={item.name}>
          <button onClick={()=>go(item.target)}>{item.name} <Icon name="chevron" size={14}/></button>
          <div className="nav-dropdown">{item.sub.map(link=><button key={link[0]} onClick={()=>go(link[1])}>{link[0]}</button>)}</div>
        </div>)}
        <button className="mobile-only-nav" onClick={()=>go('/crear')}>Crea tu ramo</button>
      </nav>
      <div className="header-actions"><button className="profile-link" onClick={()=>go('/perfil')} aria-label={user?'Mi perfil':'Iniciar sesión'}><Icon name="user" size={20}/></button><button className="btn btn-primary nav-cta" onClick={()=>go('/crear')}>Crea tu ramo <Icon name="right" size={16}/></button><button className="icon-button cart-icon" aria-label={`Abrir carrito, ${cartCount} productos`} onClick={()=>go('/carrito')}><Icon name="cart" size={23}/>{cartCount>0&&<span className="cart-count">{cartCount}</span>}</button><button className="icon-button mobile-toggle" aria-label={menuOpen?'Cerrar menú':'Abrir menú'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}><Icon name={menuOpen?'close':'menu'}/></button></div>
    </div></header>
  </>;
}
function ProductCard({product,navigate,onAdd}) {
  const size=sizes.find(s=>s.id===product.size);
  return <article className="product-card">
    <button className="product-cover" onClick={()=>navigate(`/producto/${product.id}`)} aria-label={`Ver ${product.name}`}><img src={product.image} alt={`Imagen de referencia del arreglo ${product.name}`} loading="lazy"/><span className="product-tag">{size.count} flores</span></button>
    <div className="product-card-content"><p className="overline tiny">{product.type} · {size.label}</p><button className="product-name" onClick={()=>navigate(`/producto/${product.id}`)}>{product.name}</button><div className="product-meta"><strong>{money(product.price)}</strong><button className="mini-add" onClick={()=>onAdd(product)} aria-label={`Añadir ${product.name} al carrito`}><Icon name="plus" size={19}/></button></div></div>
  </article>;
}
function Home({navigate,onAdd}) {
  return <>
    <section className="hero container"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line"/> ARREGLOS FLORALES HECHOS PARA TI</div><h1>Flores que dicen <em>lo que sientes.</em></h1><p>Elige tus flores favoritas, juega con los colores y crea un ramo tan único como la persona que lo recibirá. Sin complicaciones y con precios claros.</p><div className="hero-buttons"><button className="btn btn-primary large" onClick={()=>navigate('/crear')}>Quiero crear mi ramo <Icon name="right" size={19}/></button><button className="btn btn-outline large" onClick={()=>navigate('/catalogo/arreglos')}>Explorar arreglos</button></div><div className="hero-trust"><span><Icon name="heart" size={16}/> Personalizados</span><span><Icon name="gift" size={16}/> Desde $9.99*</span><span><Icon name="pin" size={16}/> El Salvador</span></div></div>
      <div className="hero-visual"><div className="hero-photo"><img src={grandeDecorativo} alt="Imagen de referencia de un ramo grande en tonos pastel"/></div><div className="hero-floating"><span>✿</span><div><strong>Hecho a tu manera</strong><small>Hasta el último detalle</small></div></div><div className="hero-sparkle">✳</div></div>
    </section>
    <section className="whybar"><div className="container whybar-inner"><div><Icon name="flower"/><span>Elige tus flores</span></div><div><Icon name="heart"/><span>Personaliza cada detalle</span></div><div><Icon name="gift"/><span>Regala con intención</span></div></div></section>
    <section className="section container" id="populares"><div className="section-top"><div><span className="eyebrow">ENCUENTRA TU FAVORITO</span><h2>Pequeños detalles, <em>grandes emociones.</em></h2></div><button className="text-link" onClick={()=>navigate('/catalogo/arreglos')}>Ver todo el catálogo <Icon name="right" size={17}/></button></div><div className="product-grid">{products.slice(0,4).map(p=><ProductCard key={p.id} product={p} navigate={navigate} onAdd={onAdd}/>)}</div><p className="price-note">*Precios ilustrativos de producto estándar, sin domicilio; sujetos a validación de costos.</p></section>
    <section className="feature-section"><div className="container feature-grid"><div className="feature-visual"><img src={cajaPrimavera} alt="Imagen de referencia de un bouquet en caja"/><div className="feature-sticker">tú eliges<br/>cada detalle ♡</div></div><div className="feature-copy"><span className="eyebrow">COMO TÚ LO IMAGINAS</span><h2>Tu idea. <em>Tu ramo.</em></h2><p>No hace falta saber de flores. Nuestro creador te guía para elegir tamaño, combinación, envoltura y listón; siempre podrás ver el precio antes de avanzar.</p><div className="feature-steps">{[['01','Elige tamaño y presupuesto'],['02','Combina tus flores favoritas'],['03','Personaliza papel y listón'],['04','Revisa el precio y agrégalo al carrito']].map(s=><div key={s[0]}><strong>{s[0]}</strong><span>{s[1]}</span></div>)}</div><button className="btn btn-primary large" onClick={()=>navigate('/crear')}>Empezar a crear <Icon name="right" size={19}/></button></div></div></section>
    <section className="section container occasions"><div className="center-heading"><span className="eyebrow">PARA CADA MOMENTO</span><h2>Siempre hay una razón para <em>regalar flores.</em></h2></div><div className="occasion-grid">{[['Cumpleaños','Celebra su día','✳'],['Aniversario','Recuerden su historia','♡'],['Graduación','Celebra sus logros','✿']].map((o,i)=><button className={`occasion-card occasion-${i}`} key={o[0]} onClick={()=>navigate(`/catalogo/ocasiones?ocasion=${encodeURIComponent(o[0])}`)}><span className="occasion-glyph">{o[2]}</span><strong>{o[0]}</strong><small>{o[1]}</small><span className="occasion-arrow">Explorar <Icon name="right" size={14}/></span></button>)}</div></section>
    <section className="closing-cta"><div className="container closing-inner"><span className="eyebrow">¿TODAVÍA NO SABES QUÉ REGALAR?</span><h2>Un ramo pensado por ti <em>vale el doble.</em></h2><p>O elige un diseño listo para personalizarlo después.</p><button className="btn btn-light large" onClick={()=>navigate('/crear')}>Diseñar mi ramo <Icon name="right" size={17}/></button></div></section>
  </>;
}
function Catalog({route,navigate,onAdd}) {
  const [, ,section='arreglos']=route.split('?')[0].split('/');
  const query=new URLSearchParams(route.split('?')[1]||'');
  const [color,setColor]=useState('Todos');
  const [size,setSize]=useState('Todos');
  const [sort,setSort]=useState('relevancia');
  useEffect(()=>{setColor('Todos');setSize('Todos');},[route]);
  const selectedOccasion=query.get('ocasion'),selectedFlower=query.get('flor'),selectedType=query.get('tipo');
  const title=section==='ocasiones'?(selectedOccasion||'Por ocasiones'):section==='flores'?(selectedFlower||'Por tipos de flores'):(selectedType||'Por arreglos florales');
  let list=products.filter(p=>(!selectedOccasion||p.occasions.includes(selectedOccasion))&&(!selectedFlower||p.flowers.includes(selectedFlower))&&(!selectedType||p.type===selectedType)&& (color==='Todos'||p.colors.includes(color))&& (size==='Todos'||p.size===size));
  if(sort==='precio-asc')list=[...list].sort((a,b)=>a.price-b.price); if(sort==='precio-desc')list=[...list].sort((a,b)=>b.price-a.price);
  return <div className="container page-content"><div className="breadcrumb"><button onClick={()=>navigate('/')}>MadeByU</button> / <span>{title}</span></div><div className="catalog-heading"><div><span className="eyebrow">ENCUENTRA TU ARREGLO IDEAL</span><h1>{title}<span className="accent-dot">.</span></h1><p>Diseños de inspiración con precios provisionales. Combina colores y tamaños para encontrar tu favorito.</p></div><div className="catalog-decor">✿</div></div><div className="catalog-layout"><aside className="filters"><div className="filter-head"><Icon name="filter" size={19}/> Filtros</div><div className="filter-block"><h3>Color <span className="small-muted">(filtro, sin URL propia)</span></h3><div className="color-filter">{['Todos','Rosa','Blanco','Amarillo','Rojo','Morado'].map(c=><button className={c===color?'selected':''} key={c} onClick={()=>setColor(c)}>{c}</button>)}</div></div><div className="filter-block"><h3>Tamaño</h3>{['Todos',...sizes.map(s=>s.id)].map(v=><label className="radio-line" key={v}><input type="radio" checked={size===v} onChange={()=>setSize(v)}/>{v==='Todos'?'Todos':sizes.find(s=>s.id===v)?.label}</label>)}</div><div className="filter-help"><Icon name="heart" size={19}/><strong>¿No encuentras lo que imaginas?</strong><p>Mejor créalo a tu manera.</p><button className="btn btn-primary" onClick={()=>navigate('/crear')}>Crea tu ramo <Icon name="right" size={15}/></button></div></aside><div className="catalog-results"><div className="results-toolbar"><span>{list.length} arreglos encontrados</span><label>Ordenar por <select aria-label="Ordenar catálogo" value={sort} onChange={e=>setSort(e.target.value)}><option value="relevancia">Destacados</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option></select></label></div>{list.length?<div className="product-grid catalog-products">{list.map(p=><ProductCard key={p.id} product={p} navigate={navigate} onAdd={onAdd}/>)}</div>:<div className="empty-results"><span>✿</span><h2>Sin coincidencias por ahora</h2><p>Prueba otro filtro o crea un ramo desde cero.</p><button className="btn btn-outline" onClick={()=>{setColor('Todos');setSize('Todos')}}>Limpiar filtros</button></div>}</div></div></div>;
}
function ProductPage({product,navigate,onAdd}) {
  const [amount,setAmount]=useState(1);
  useEffect(()=>setAmount(1),[product?.id]);
  if(!product) return <div className="container page-content"><h1>No encontramos este producto</h1><button className="btn btn-primary" onClick={()=>navigate('/catalogo/arreglos')}>Volver al catálogo</button></div>;
  const sz=sizes.find(s=>s.id===product.size);
  return <div className="container page-content"><div className="breadcrumb"><button onClick={()=>navigate('/')}>MadeByU</button> / <button onClick={()=>navigate('/catalogo/arreglos')}>Arreglos</button> / <span>{product.name}</span></div><div className="product-detail"><div className="product-big-image"><img src={product.image} alt={`Imagen de referencia del arreglo ${product.name}`}/><span className="detail-tag">Imagen generada con IA · composición de referencia</span></div><div className="product-panel"><span className="eyebrow">HECHO PARA REGALAR</span><h1>{product.name}</h1><p className="product-description">{product.description}</p><div className="detail-price">{money(product.price)} <span>precio provisional</span></div><div className="detail-specs"><div><Icon name="flower" size={18}/><span><strong>{sz.count} flores principales</strong><small>Selección estándar de temporada</small></span></div><div><Icon name="gift" size={18}/><span><strong>{product.type}</strong><small>Papel y listón incluidos; sujeto a disponibilidad</small></span></div><div><Icon name="pin" size={18}/><span><strong>Retiro o domicilio</strong><small>El costo de entrega se muestra por separado</small></span></div></div><div className="amount-line"><span>Cantidad</span><div className="stepper"><button aria-label="Reducir cantidad" disabled={amount<=1} onClick={()=>setAmount(x=>Math.max(1,x-1))}><Icon name="minus" size={16}/></button><strong>{amount}</strong><button aria-label="Aumentar cantidad" onClick={()=>setAmount(x=>Math.min(20,x+1))}><Icon name="plus" size={16}/></button></div></div><button className="btn btn-primary large full" onClick={()=>onAdd(product,amount)}>Añadir al carrito <Icon name="cart" size={19}/></button><button className="btn btn-outline large full" onClick={()=>navigate('/crear')}>Me gustaría personalizarlo <Icon name="right" size={18}/></button><p className="muted-disclaimer"><Icon name="info" size={16}/> Imagen de referencia generada con IA. La composición y los tonos del producto final pueden variar. Compra simulada, sin cobros reales.</p></div></div></div>;
}
function Cart({cart,navigate,onQty,onRemove}) {
  const subtotal=cart.reduce((sum,it)=>sum+it.price*it.qty,0);
  return <div className="container page-content"><div className="breadcrumb"><button onClick={()=>navigate('/')}>MadeByU</button> / <span>Carrito</span></div><h1 className="page-title">Tu carrito <em>florece.</em></h1>{!cart.length?<div className="empty-cart"><span>✿</span><h2>Tu carrito aún está vacío</h2><p>Hay muchas maneras de decir algo bonito. Descubre nuestros arreglos.</p><button className="btn btn-primary" onClick={()=>navigate('/catalogo/arreglos')}>Explorar arreglos <Icon name="right" size={17}/></button></div>:<div className="cart-layout"><div className="cart-list">{cart.map(it=><div className="cart-row" key={it.id}><img src={it.image} alt={`${it.custom?'Simulación de tu composición: ' : 'Imagen de referencia: '}${it.name}`}/><div className="cart-row-details"><strong>{it.name}</strong><p>{it.description||'Arreglo floral de temporada'}</p><button className="remove-link" onClick={()=>onRemove(it.id)}><Icon name="trash" size={15}/> Quitar</button></div><div className="cart-end"><strong>{money(it.price*it.qty)}</strong><div className="stepper"><button aria-label={`Reducir cantidad de ${it.name}`} onClick={()=>onQty(it.id,-1)}><Icon name="minus" size={15}/></button><span>{it.qty}</span><button aria-label={`Aumentar cantidad de ${it.name}`} onClick={()=>onQty(it.id,1)}><Icon name="plus" size={15}/></button></div></div></div>)}</div><aside className="order-summary"><h2>Resumen de compra</h2><div className="price-breakdown"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Entrega</span><strong>Por definir</strong></div><div className="breakdown-total"><strong>Subtotal provisional</strong><strong>{money(subtotal)}</strong></div></div><button className="btn btn-primary full large" onClick={()=>navigate('/checkout')}>Continuar a la compra <Icon name="right" size={18}/></button><button className="btn btn-outline full" onClick={()=>navigate('/catalogo/arreglos')}>Seguir explorando</button><p className="muted-disclaimer">No habrá cobros reales en esta maqueta académica.</p></aside></div>}</div>;
}
function Checkout({cart,navigate,onConfirm,profile}) {
  const [form,setForm]=useState(()=>({name:profile.contact.name||'Participante de prueba',email:profile.contact.email||'demo@ejemplo.com',phone:profile.contact.phone||'0000-0000',delivery:'retiro',address:addressText(profile.addresses.find(a=>a.id===profile.defaultAddress)),date:'',notes:''}));
  const [payment,setPayment]=useState(profile.defaultCard);
  const useAddress=address=>setForm(previous=>({...previous,address:addressText(address),...(address?{name:address.recipient||previous.name,phone:address.phone||previous.phone}:{})}));
  const [agreed,setAgreed]=useState(false);
  const subtotal=cart.reduce((a,b)=>a+b.price*b.qty,0);
  const [deliveryZone,setDeliveryZone]=useState('');
  const quote=deliveryQuote(form.delivery,deliveryZone,subtotal);
  const deliveryFee=quote.fee;
  const total=quote.valid?Math.round((subtotal+deliveryFee)*100)/100:null;
  if(!cart.length)return <div className="container page-content"><h1>Primero agrega flores a tu carrito</h1><button className="btn btn-primary" onClick={()=>navigate('/catalogo/arreglos')}>Ver arreglos</button></div>;
  const change=(k,v)=>setForm(o=>({...o,[k]:v}));
  const submit=e=>{e.preventDefault();if(!agreed||!quote.valid)return;onConfirm({code:`DEMO-${Date.now().toString().slice(-6)}`,total,subtotal,delivery:form.delivery,deliveryFee,deliveryZone:quote.label,deliveryDate:form.date,items:cart,recipient:form.name,payment:profile.cards.find(card=>card.id===payment)||null})};
  return <div className="container page-content"><div className="breadcrumb"><button onClick={()=>navigate('/')}>MadeByU</button> / <button onClick={()=>navigate('/carrito')}>Carrito</button> / <span>Finalizar compra</span></div><h1 className="page-title">Casi está <em>listo.</em></h1><div className="checkout-layout"><form id="demoCheckout" onSubmit={submit} className="checkout-form"><div className="checkout-section"><div className="step-heading"><span className="step-number">01</span><div><h2>Datos para este pedido de prueba</h2><p>Puedes usar información ficticia. No se enviarán datos a ningún servidor.</p></div></div><div className="fields-grid"><label>Nombre o alias de prueba <input required value={form.name} onChange={e=>change('name',e.target.value)} placeholder="Nombre de prueba"/></label><label>Correo ficticio <input required type="email" value={form.email} onChange={e=>change('email',e.target.value)} placeholder="demo@ejemplo.com"/></label><label>Teléfono ficticio <input required value={form.phone} onChange={e=>change('phone',e.target.value)} placeholder="0000-0000"/></label><label>Fecha deseada{quote.promotion?' (requerida para la promoción)':''} <input required={!!quote.promotion} type="date" value={form.date} onChange={e=>change('date',e.target.value)}/></label></div></div><div className="checkout-section"><div className="step-heading"><span className="step-number">02</span><div><h2>¿Cómo te gustaría recibirlo?</h2><p>Elige retiro gratuito o entrega a domicilio según tu zona.</p></div></div><DeliveryOptions delivery={form.delivery} zoneId={deliveryZone} subtotal={subtotal} onDelivery={value=>change('delivery',value)} onZone={setDeliveryZone}/>{form.delivery==='domicilio'&&<><SavedAddressPicker profile={profile} onChoose={useAddress} navigate={navigate}/><label className="address-label">Dirección ficticia para la prueba <textarea required rows={3} value={form.address} onChange={e=>change('address',e.target.value)} placeholder="Escribe una dirección inventada, no la tuya"/></label></>}</div><div className="checkout-section"><div className="step-heading"><span className="step-number">03</span><div><h2>Pago simulado</h2><p>Esta versión solo prueba si el checkout se entiende.</p></div></div><SavedPaymentPicker profile={profile} value={payment} onChange={setPayment} navigate={navigate}/><div className="safe-pay"><Icon name="lock" size={20}/><div><strong>Pago de demostración · $0 cobrados</strong><p>No se solicitan tarjetas, cuentas ni datos bancarios. Ningún pedido se envía a una floristería real.</p></div></div><label className="consent-line"><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}/> Comprendo que se trata de una simulación académica y que no estoy realizando una compra real.</label></div></form><aside className="order-summary checkout-summary"><h2>Resumen</h2><div className="checkout-items">{cart.map(it=><div key={it.id}><span>{it.qty} × {it.name}</span><strong>{money(it.price*it.qty)}</strong></div>)}</div><div className="price-breakdown"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Tarifa de envío</span><strong className={quote.valid?'':'shipping-price-pending'}>{quote.valid?(deliveryFee===0?'Gratis':money(deliveryFee)):'Por confirmar'}</strong></div><div className="breakdown-total"><strong>Total ilustrativo</strong><strong>{quote.valid?money(total):'Pendiente'}</strong></div></div><p className="shipping-summary-zone" aria-live="polite">{quote.label}</p><button type="submit" form="demoCheckout" className="btn btn-primary full large" disabled={!agreed||!quote.valid}>Confirmar compra de prueba <Icon name="right" size={17}/></button><p className="muted-disclaimer">Al confirmar se mostrará una pantalla de demostración. No se procesará ningún pago.</p></aside></div></div>;
}
function Confirmation({order,navigate}) {
  if(!order)return <div className="container page-content"><h1>No hay pedido de prueba</h1><button className="btn btn-primary" onClick={()=>navigate('/')}>Volver</button></div>;
  return <section className="container confirmation-page"><div className="confirmation-card"><div className="success-icon"><Icon name="check" size={35}/></div><span className="eyebrow">FIN DEL RECORRIDO DE PRUEBA</span><h1>¡Tu idea <em>floreció!</em></h1><p>Has completado correctamente el recorrido simulado de MadeByU. <strong>Esto NO es una compra real.</strong></p><div className="order-id">Referencia ficticia: <strong>{order.code}</strong></div><div className="confirmation-list"><div><span>Artículos simulados</span><strong>{order.items.reduce((a,b)=>a+b.qty,0)}</strong></div><div><span>Entrega seleccionada</span><strong>{order.deliveryZone||'Retiro en punto habilitado'}</strong></div>{order.deliveryDate&&<div><span>Fecha solicitada</span><strong>{order.deliveryDate.split('-').reverse().join('/')}</strong></div>}<div><span>Subtotal de productos</span><strong>{money(order.subtotal)}</strong></div><div><span>Tarifa de envío</span><strong>{order.deliveryFee===0?'Gratis':money(order.deliveryFee)}</strong></div><div><span>Total ilustrativo</span><strong>{money(order.total)}</strong></div></div><div className="confirmation-buttons"><button className="btn btn-primary" onClick={()=>navigate('/pruebas')}>Registrar resultado de test UX <Icon name="right" size={18}/></button><button className="btn btn-outline" onClick={()=>navigate('/')}>Volver al inicio</button></div><p className="muted-disclaimer">El pedido de prueba no se conserva al recargar. Tu perfil permanece guardado en este navegador.</p></div></section>;
}
function Tests({navigate}) {
  const [pid,setPid]=useState('P01');
  const [rows,setRows]=useState(UX_TASKS.map(()=>({outcome:'pendiente',seconds:'',notes:''})));
  const [rating,setRating]=useState('');
  const [comment,setComment]=useState('');
  const [active,setActive]=useState(null);
  const [started,setStarted]=useState(null);
  const setRow=(i,field,value)=>setRows(old=>old.map((r,j)=>j===i?{...r,[field]:value}:r));
  const begin=i=>{setActive(i);setStarted(Date.now())};
  const finish=(i,outcome)=>{const sec=active===i&&started!==null?((Date.now()-started)/1000).toFixed(1):'';setRows(old=>old.map((r,j)=>j===i?{...r,outcome,seconds:sec||r.seconds}:r));setActive(null);setStarted(null)};
  const exportReport=()=>{const txt=[`MadeByU · Registro de pruebas UX`,`Participante (código anónimo): ${pid}`,`Fecha: ${new Date().toLocaleDateString('es-SV')}`,`Importante: completado por evaluador. No representa datos inventados.`,...UX_TASKS.flatMap((t,i)=>[`\nTarea ${i+1}: ${t}`,`Resultado: ${rows[i].outcome}`,`Duración cronometrada: ${rows[i].seconds||'No medida'} segundos`,`Observaciones: ${rows[i].notes||'(sin observaciones)'}`]),`\nFacilidad percibida (1–5): ${rating||'No indicada'}`,`Comentario general: ${comment||'(sin comentarios)'}`].join('\n');const blob=new Blob([txt],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`MadeByU_test_${pid.replace(/[^a-zA-Z0-9_-]/g,'')||'anonimo'}.txt`;a.click();URL.revokeObjectURL(url)};
  return <div className="container page-content ux-tests"><span className="eyebrow">ANEXO DE INVESTIGACIÓN UX</span><h1>Registro de <em>pruebas de usabilidad.</em></h1><p>Esta sección sirve para realizar sesiones con participantes reales. No contiene respuestas ni resultados ficticios. Pide consentimiento y registra únicamente un código de participante, sin datos personales.</p><div className="test-header"><label>Código anónimo del participante <input value={pid} maxLength={18} onChange={e=>setPid(e.target.value)} placeholder="P01" /></label><div><strong>Guía del evaluador</strong><span>Lee las tareas, observa sin dar pistas y anota problemas que aparezcan.</span></div></div><div className="test-rows">{UX_TASKS.map((task,i)=><div className="test-row" key={i}><span className="test-number">Tarea {i+1}</span><h2>{task}</h2><div className="test-buttons"><button className="btn btn-outline" onClick={()=>begin(i)} disabled={active!==null}>Iniciar cronómetro</button><button className="btn btn-soft" onClick={()=>finish(i,'completada')}>Completada</button><button className="btn btn-outline" onClick={()=>finish(i,'no completada')}>No completada</button><span className="test-status">{rows[i].outcome}{rows[i].seconds?` · ${rows[i].seconds}s`:''}{active===i?' · cronometrando…':''}</span></div><textarea rows={2} placeholder="Qué hizo, qué dijo, dónde dudó…" value={rows[i].notes} onChange={e=>setRow(i,'notes',e.target.value)}/></div>)}</div><div className="test-bottom"><label>Facilidad global percibida (1 = difícil, 5 = fácil) <select value={rating} onChange={e=>setRating(e.target.value)}><option value="">Sin responder</option>{[1,2,3,4,5].map(v=><option key={v} value={v}>{v}</option>)}</select></label><label>Comentario general <textarea rows={3} value={comment} onChange={e=>setComment(e.target.value)} placeholder="Percepción del participante y dificultades observadas…"/></label><button className="btn btn-primary large" onClick={exportReport}>Descargar registro en .txt <Icon name="right" size={19}/></button><p className="muted-disclaimer">Los resultados se descargan al dispositivo y no se guardan en un servidor. No afirmes haber realizado una prueba hasta que el participante la complete realmente.</p></div><button className="text-link" onClick={()=>navigate('/')}>Volver a la tienda <Icon name="right" size={17}/></button></div>;
}
function Footer({navigate}) {return <footer className="footer"><div className="container footer-top"><div><strong className="footer-logo">✿ MadeByU.</strong><p>Flores bonitas, a tu manera.<br/>Una propuesta académica creada con cariño en El Salvador.</p></div><div><h3>Explora</h3><button onClick={()=>navigate('/catalogo/arreglos')}>Por arreglos florales</button><button onClick={()=>navigate('/catalogo/ocasiones')}>Por ocasiones</button><button onClick={()=>navigate('/catalogo/flores')}>Por tipos de flores</button></div><div><h3>Tu experiencia</h3><button onClick={()=>navigate('/crear')}>Crea tu ramo</button><button onClick={()=>navigate('/carrito')}>Ver carrito</button><button onClick={()=>navigate('/perfil')}>Mi perfil</button><button onClick={()=>navigate('/pruebas')}>Registro de test UX</button></div><div><h3>Importante</h3><p>Precios sujetos a validación. Imágenes de referencia generadas con IA. Los pedidos, pagos y envíos no son reales.</p></div></div><div className="container footer-bottom"><span>© 2026 MadeByU · Prototipo académico, no comercial</span><span>Hecho para aprender, validar y mejorar ♡</span></div></footer>}
export default function App() {
  const auth=useDemoAuth();
  const [cart,setCart]=useState([]);
  const logout=()=>{setCart([]);auth.logout();};
  return <Storefront key={auth.user?.id||'guest'} auth={{...auth,logout}} cart={cart} setCart={setCart}/>;
}
function Storefront({auth,cart,setCart}) {
  const {profile,update,storageError}=useProfile(auth.user);
  const [route,setRoute]=useState(readRoute);
  const [order,setOrder]=useState(null);
  const [toast,setToast]=useState('');
  useEffect(()=>{const handler=()=>{setRoute(readRoute());window.scrollTo({top:0,behavior:'instant'})};window.addEventListener('hashchange',handler);return()=>window.removeEventListener('hashchange',handler)},[]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),3000);return()=>clearTimeout(timer)},[toast]);
  const navigate=(next)=>{if(readRoute()===next){window.scrollTo({top:0,behavior:'smooth'});return;}window.location.hash=next};
  const add=(item,qty=1)=>{setCart(current=>{const found=current.find(i=>i.id===item.id);return found?current.map(i=>i.id===item.id?{...i,qty:i.qty+qty}:i):[...current,{...item,qty}]});setToast(`${item.name} agregado al carrito`)};
  const quantity=(id,change)=>setCart(current=>current.map(i=>i.id===id?{...i,qty:i.qty+change}:i).filter(i=>i.qty>0));
  const remove=id=>setCart(current=>current.filter(i=>i.id!==id));
  const confirm=o=>{setOrder(o);setCart([]);navigate('/confirmacion')};
  const cartCount=cart.reduce((sum,it)=>sum+it.qty,0);
  const parts=route.split('?')[0].split('/');
  let page;
  if(parts[1]==='catalogo')page=<Catalog route={route} navigate={navigate} onAdd={add}/>;
  else if(parts[1]==='producto')page=<ProductPage product={products.find(p=>p.id===parts[2])} navigate={navigate} onAdd={add}/>;
  else if(parts[1]==='crear')page=<FloralStudio navigate={navigate} onAdd={add}/>;
  else if(parts[1]==='carrito')page=<Cart cart={cart} navigate={navigate} onQty={quantity} onRemove={remove}/>;
  else if(parts[1]==='checkout')page=<Checkout cart={cart} navigate={navigate} onConfirm={confirm} profile={profile}/>;
  else if(['perfil','ingresar','registro','recuperar'].includes(parts[1]))page=auth.user?<Profile profile={profile} update={update} storageError={storageError||auth.warning} navigate={navigate} user={auth.user} onLogout={auth.logout}/>:<DemoAuth key={parts[1]} mode={parts[1]==='registro'?'register':parts[1]==='recuperar'?'reset':'login'} auth={auth} navigate={navigate}/>;
  else if(parts[1]==='confirmacion')page=<Confirmation order={order} navigate={navigate}/>;
  else if(parts[1]==='pruebas')page=<Tests navigate={navigate}/>;
  else page=<Home navigate={navigate} onAdd={add}/>;
  return <>{parts[1]!=='crear'&&<><Header navigate={navigate} cartCount={cartCount} user={auth.user}/></>}<main id="mainContent">{page}</main>{parts[1]!=='crear'&&<Footer navigate={navigate}/>} {toast&&<div role="status" className="toast"><Icon name="check" size={19}/><span>{toast}</span><button onClick={()=>navigate('/carrito')}>Ver carrito</button></div>}</>;
}
