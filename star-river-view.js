// Fixed constellation coordinates: column, span, row, row span.
// Reading order remains the original 47-item order in the document.
const positions=[
 [1,7,1,2],[2,4,3,1],[9,4,1,1],[10,3,2,1],[2,4,4,1],[1,6,5,1],
 [6,7,3,2],[8,5,5,1],[2,4,6,1],[9,4,6,1],[1,6,7,1],[1,5,8,1],
 [7,3,7,1],[7,6,8,1],[1,7,9,1],[10,3,7,1],[9,4,9,1],[1,4,10,1],
 [1,5,11,1],[6,6,10,1],[7,6,11,1],[1,5,12,1],[6,7,12,2],[1,5,13,1],
 [1,7,14,1],[9,4,14,1],[1,5,15,1],[9,4,15,1],[2,5,16,1],[8,5,16,1],
 [1,8,17,2],[10,3,17,1],[10,3,18,1],[8,5,19,1],[1,6,19,1],[8,5,20,1],
 [1,4,20,1],[8,5,21,1],[2,6,21,2],[9,4,22,1],[1,5,23,1],[9,4,23,1],
 [9,4,24,1],[1,5,24,1],[7,6,25,1],[1,7,26,1],[9,4,26,1]
];
export function riverChapter(data,{esc,meta,favorite}){
 const breaks={'star-01':10,'star-07':6};
 const words=item=>breaks[item.id]?'<span class="river-line">'+esc(item.text.slice(0,breaks[item.id]))+'</span><span class="river-line">'+esc(item.text.slice(breaks[item.id]))+'</span>':esc(item.text);
 return '<section class="story-section star-chapter galaxy-river" id="starlight" aria-labelledby="stars-title">'+
 '<canvas class="river-canvas" aria-hidden="true"></canvas>'+
 '<header class="river-heading"><p class="river-eyebrow"><span></span>写给你的一片星空<span></span></p><h2 id="stars-title">你发过的光，<br>我都记得。</h2><p class="river-subtitle">那些说给你的话，一直都算数。</p></header>'+
 '<div class="star-wall river-wall" aria-label="47句星光文字墙">'+data.starWall.map((item,i)=>{const [column,span,row,rows]=positions[i];return '<article class="star-quote '+(item.featured?'featured':'')+' '+(item.text.length>24?'long-quote':'')+'" data-star="'+item.id+'" style="--river-column:'+column+';--river-span:'+span+';--river-row:'+row+';--river-rows:'+rows+';--delay:-'+i%9+'s;--duration:'+(11+i%5)+'s"><div class="star-drift">'+(item.featured?'<span class="river-quotation" aria-hidden="true">“</span>':'<span class="river-small-star" aria-hidden="true"></span>')+'<blockquote>'+words(item)+'</blockquote><div class="star-meta">'+meta(item)+favorite(item)+'</div></div></article>';}).join('')+'</div>'+
 '<footer class="river-ending"><span aria-hidden="true"></span><p>每一点光，都有一个关于你的落点。</p></footer></section>';
}
