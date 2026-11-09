import React, { useId } from 'react';
import floralAtlas from './assets/floral-atlas.png';

const CELLS = {claveles:0,margaritas:1,rosas:2,girasoles:3,eucalipto:4,clasico:5,papel:6,caja:7,liston:8};
const PLACEMENTS = [
  [330,290,1.12,-9],[241,315,1.04,-19],[425,312,1.08,14],
  [304,382,1.03,12],[385,226,.96,-12],[186,255,.94,-22],
  [487,258,.96,18],[273,204,.93,10],[439,398,.94,22],
  [211,402,.98,-14],[343,166,.9,-4],[149,340,.92,-24],
  [524,345,.92,17],[332,457,.97,10],[453,190,.88,-16],
  [205,174,.86,9],[496,433,.88,-10],[164,430,.88,14],
  [396,463,.88,-9],[272,467,.9,17]
];
const BLOOM_COLORS = {Rosa:'#f1a6ba','Melocotón':'#efb09b',Lila:'#c9b4e0',Marfil:'#fff5dc',Vino:'#a65876'};
const PAPER_COLORS = {'Azul salvia':'#a6c5c6','Rosa polvo':'#e9bac5',Marfil:'#f3eee4',Kraft:'#d4b296'};
const RIBBON_COLORS = {'Verde salvia':'#5e9e93',Rosa:'#d88da2',Crema:'#e8d0b4',Vino:'#915771'};

// Remap neutral luminance to the exact selected swatch. Shadows go toward
// black and highlights toward white, independently of the source image hue.
function MaterialColor({id,color}) {
  const rgb=[1,3,5].map(start=>parseInt(color.slice(start,start+2),16)/255);
  return <filter id={id} colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
    <feColorMatrix type="saturate" values="0"/>
    <feComponentTransfer>
      <feFuncR type="table" tableValues={`0 ${rgb[0]} 1`}/>
      <feFuncG type="table" tableValues={`0 ${rgb[1]} 1`}/>
      <feFuncB type="table" tableValues={`0 ${rgb[2]} 1`}/>
      <feFuncA type="identity"/>
    </feComponentTransfer>
  </filter>;
}

function Atlas({id}) {return <defs><image id={id} href={floralAtlas} width="300" height="300" preserveAspectRatio="none"/></defs>;}
function Piece({id,type,x=0,y=0,width=100,height=100,tint='none'}) {
  const cell=CELLS[type]??0;
  return <svg x={x} y={y} width={width} height={height} viewBox="0 0 100 100" overflow="hidden" style={{filter:tint}}><svg width="100" height="100" viewBox={`${(cell%3)*100} ${Math.floor(cell/3)*100} 100 100`} overflow="hidden"><use href={`#${id}`}/></svg></svg>;
}

export function FlowerThumbnail({type,color}) {
  const id=`photo-${useId().replace(/:/g,'')}`;
  const palette={'#efb09b':'Melocotón','#c9b4e0':'Lila','#fff5dc':'Marfil','#a65876':'Vino'}[color]||'Rosa';
  return <svg className="flower-thumbnail photo-thumbnail" viewBox="0 0 100 100" aria-hidden="true"><Atlas id={id}/><defs><MaterialColor id={`${id}-bloom`} color={BLOOM_COLORS[palette]||BLOOM_COLORS.Rosa}/></defs><Piece id={id} type={type} tint={type==='rosas'||type==='claveles'?`url(#${id}-bloom)`:'none'}/></svg>;
}

export default function BouquetPreview({counts,palette,paper,ribbon,format,foliage}) {
  const id=`bouquet-${useId().replace(/:/g,'')}`;
  // Round-robin types spread the actual selected quantities throughout the bouquet.
  const remaining={...counts}, flowers=[];
  while(Object.values(remaining).some(n=>n>0)) {
    for(const type of ['claveles','margaritas','rosas','girasoles']) if(remaining[type]>0) {flowers.push(type);remaining[type]--;}
  }
  for(let i=flowers.length-1;i>0;i--) {
    const j=(i*7+3)%(i+1);
    [flowers[i],flowers[j]]=[flowers[j],flowers[i]];
  }
  const ordered=flowers.map((type,i)=>{
    const [x,y,scale,rotation]=PLACEMENTS[i];
    if(format==='caja') {
      const radius=Math.sqrt(i/Math.max(1,flowers.length-1));
      const angle=i*2.399963;
      const spread=flowers.length<=8?105:142;
      const boxY=350+Math.sin(angle)*radius*82;
      return {type,x:340+Math.cos(angle)*radius*spread,y:boxY,scale:.9+(boxY-268)/164*.12,rotation};
    }
    return {type,x,y,scale,rotation};
  }).sort((a,b)=>a.y-b.y);
  const label=`Simulación de tu ramo con ${flowers.length} flores: ${Object.entries(counts).filter(([,n])=>n).map(([type,n])=>`${n} ${type}`).join(', ')}. Tono ${palette}, follaje ${foliage}, ${format==='caja'?'caja':`papel ${paper}`}, listón ${ribbon}.`;
  return <svg className="bouquet-art photo-bouquet" viewBox="0 0 680 770" role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
    <Atlas id={id}/>
    <defs>
      <MaterialColor id={`${id}-bloom`} color={BLOOM_COLORS[palette]||BLOOM_COLORS.Rosa}/>
      <MaterialColor id={`${id}-paper`} color={PAPER_COLORS[paper]||PAPER_COLORS['Azul salvia']}/>
      <MaterialColor id={`${id}-ribbon`} color={RIBBON_COLORS[ribbon]||RIBBON_COLORS['Verde salvia']}/>
      <clipPath id={`${id}-box-front`}><rect x="100" y="453" width="480" height="260"/></clipPath>
      <clipPath id={`${id}-stems`}><rect x="0" y="0" width="680" height={format==='caja'?454:770}/></clipPath><radialGradient id={`${id}-shadow`}><stop stopColor="#25483c" stopOpacity=".2"/><stop offset="1" stopColor="#25483c" stopOpacity="0"/></radialGradient></defs>
    <ellipse cx="340" cy={format==='caja'?685:716} rx="180" ry="27" fill={`url(#${id}-shadow)`}/>
    {format!=='caja'&&<Piece id={id} type="papel" x={78} y={200} width={525} height={525} tint={`url(#${id}-paper)`}/>}
    {format==='caja'&&<Piece id={id} type="caja" x={120} y={360} width={440} height={340}/>}
    {format!=='caja'&&<g fill="none" strokeLinecap="round" opacity=".85">
      {ordered.map((f,i)=><path key={i} d={`M340 ${format==='caja'?470:607} Q${330+(f.x-340)*.35} 463 ${f.x} ${f.y+22}`} stroke={i%2?'#597841':'#6b894a'} strokeWidth={3+(i%3)}/>) }
    </g>}
    <g clipPath={format==='caja'?`url(#${id}-stems)`:undefined}>{[-34,-15,15,34].map((angle,i)=><g key={angle} transform={`rotate(${angle} 340 ${format==='caja'?475:590})`}><Piece id={id} type={foliage} x={format==='caja'?175:145+(i%2)*12} y={format==='caja'?95:65} width={format==='caja'?330:390} height={format==='caja'?360:460}/></g>)}</g>
    {format==='caja'&&<g clipPath={`url(#${id}-box-front)`}><Piece id={id} type="caja" x={120} y={360} width={440} height={340}/></g>}
    <g className="photo-blooms" style={{filter:'drop-shadow(0px 3px 3px #29473722)'}}>
      {ordered.map((f,i)=><g key={i} data-flower={f.type} transform={`translate(${f.x} ${f.y}) rotate(${f.rotation})`}><Piece id={id} type={f.type} x={-68*f.scale} y={-68*f.scale} width={136*f.scale} height={136*f.scale} tint={f.type==='claveles'||f.type==='rosas'?`url(#${id}-bloom)`:'none'}/></g>)}
    </g>
    <Piece id={id} type="liston" x={format==='caja'?263:262} y={format==='caja'?503:557} width={format==='caja'?154:158} height={format==='caja'?140:160} tint={`url(#${id}-ribbon)`}/>
  </svg>;
}

let atlasData;
// Embed the atlas once so the cart keeps the chosen composition, not a generic SVG.
export async function captureBouquet(svg) {
  atlasData ||= fetch(floralAtlas).then(r=>{if(!r.ok)throw new Error('No se pudo cargar la imagen floral');return r.blob();}).then(blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);})).catch(error=>{atlasData=null;throw error;});
  const data=await atlasData;
  const clone=svg.cloneNode(true);
  clone.setAttribute('width','680');clone.setAttribute('height','770');
  clone.querySelectorAll('defs image').forEach(img=>img.setAttribute('href',data));
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
}
