import React from 'react';
import './delivery.css';

export const DELIVERY_ZONES=[
  {id:'cercana',name:'Antiguo Cuscatlán · muy cerca del taller',cents:199,promotion:true},
  {id:'intermedia',name:'Santa Elena, Merliot, San Benito, San Francisco y Santa Tecla centro',cents:299},
  {id:'san-salvador',name:'Escalón y sectores céntricos seleccionados de San Salvador',cents:399}
];
export const PROMO_MINIMUM=0;
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
export function deliveryQuote(delivery,zoneId,subtotal){
  if(delivery==='retiro')return {fee:0,label:'Retiro en punto habilitado',valid:true};
  const zone=DELIVERY_ZONES.find(z=>z.id===zoneId);
  if(!zone)return {fee:null,label:'Selecciona una zona de entrega',valid:false};
  if(zone.promotion&&subtotal<PROMO_MINIMUM)return {fee:null,label:`Promoción disponible desde ${money(PROMO_MINIMUM)}`,valid:false};
  return {fee:zone.cents/100,label:zone.name,valid:true,promotion:!!zone.promotion};
}
export default function DeliveryOptions({delivery,zoneId,subtotal,onDelivery,onZone}){
  const quote=deliveryQuote(delivery,zoneId,subtotal);
  return <>
    <div className="delivery-options">
      <label className={delivery==='retiro'?'selected':''}><input type="radio" name="delivery" checked={delivery==='retiro'} onChange={()=>onDelivery('retiro')}/><div><strong>Retiro en punto habilitado</strong><small>Recoge tu ramo en el punto y horario coordinados.</small></div><b>Gratis</b></label>
      <label className={delivery==='domicilio'?'selected':''}><input type="radio" name="delivery" checked={delivery==='domicilio'} onChange={()=>onDelivery('domicilio')}/><div><strong>Entrega a domicilio</strong><small>Selecciona tu zona para conocer la tarifa.</small></div><b>Desde $1.99</b></label>
    </div>
    {delivery==='domicilio'&&<div className="shipping-panel">
      <label className="shipping-select-label" htmlFor="deliveryZone">Zona de entrega</label>
      <select id="deliveryZone" value={zoneId} required onChange={e=>onZone(e.target.value)}><option value="">Selecciona la zona de tu dirección</option>{DELIVERY_ZONES.map(zone=><option key={zone.id} value={zone.id}>{zone.name} · {money(zone.cents/100)}{zone.promotion?' · promoción':''}</option>)}<option value="consultar">Otra zona · consultar cobertura</option></select>
      <div className="shipping-rates" aria-label="Tarifas de envío">{DELIVERY_ZONES.map(zone=><div key={zone.id} className={zone.id===zoneId?'is-selected':''}><span>{zone.name}{zone.promotion&&<small>Entrega cercana programada{PROMO_MINIMUM?` · pedidos desde ${money(PROMO_MINIMUM)}`:''}</small>}</span><strong>{money(zone.cents/100)}</strong></div>)}</div>
      <div className="shipping-explanation"><h3>¿Qué incluye la tarifa?</h3><p>El traslado del pedido hasta la dirección indicada dentro de la zona seleccionada. Se suma al precio del ramo y aparece por separado en tu resumen.</p><p>La cobertura exacta y el horario se confirman según la dirección de despacho, la ruta y la disponibilidad de transporte.</p></div>
      {quote.promotion&&<p className="shipping-promo">Tarifa promocional de $1.99 para entregas muy cercanas al taller y programadas con anticipación. Sin monto mínimo de compra. Selecciona la fecha deseada para coordinarla.</p>}
      {!quote.valid&&<p className="shipping-pending" role="status">{zoneId==='consultar'?'Esta dirección requiere confirmar cobertura y cotizar el envío antes de continuar.':zoneId==='cercana'?quote.label:'Selecciona una zona para calcular el envío y el total.'}</p>}
    </div>}
  </>;
}
