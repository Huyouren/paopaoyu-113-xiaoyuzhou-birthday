const escapeText=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const heroNames=['紫泡泡','小绚绚','泡泡鱼','小南瓜','小辣椒','小子绚','绚宝','乖乖','宝宝','绚儿','绚宝宝','小紫','小小紫','小绚宝','绚宝儿','泡泡小鱼','宝宝鱼'];
const word=(name,className='')=>'<span class="nickname-bubble '+className+'" data-nickname="'+escapeText(name)+'">'+escapeText(name)+'</span>';
export function nicknameChapter(story){
const satellites=['小子绚','绚宝','乖乖','宝宝','绚儿','绚宝宝','小紫','小小紫','小绚宝','绚宝儿','泡泡小鱼','宝宝鱼'];
const families=story.nicknameFamilies.map(f=>({...f,names:f.names.filter(n=>!heroNames.includes(n))})).filter(f=>f.names.length);
return '<section class="story-section names-chapter nickname-universe" id="nicknames" aria-labelledby="nickname-title">'+
 '<div class="nickname-stage">'+
 '<header class="nickname-intro"><p class="nickname-kicker">03 / 专属称呼</p><h2 id="nickname-title">把喜欢，<br>叫成你的名字。</h2><p class="nickname-subtitle">有些名字，只有我这样叫你。</p></header>'+
 '<p class="nickname-dedication">写给我的紫泡泡</p>'+
 '<div class="nickname-orbits" aria-hidden="true"><span class="name-orbit orbit-a"></span><span class="name-orbit orbit-b"></span><span class="orbit-spark spark-a"></span><span class="orbit-spark spark-b"></span><span class="orbit-spark spark-c"></span></div>'+
 '<div class="nickname-object nickname-pearl"><div class="nickname-object-float"><img src="assets/nickname-pearl.webp" alt="" aria-hidden="true" loading="lazy"><div class="pearl-lettering">'+word('紫泡泡','name-hero')+'<p>晚安紫泡泡</p></div></div></div>'+
 '<div class="nickname-object nickname-ribbon"><div class="nickname-object-float"><img src="assets/nickname-ribbon.webp" alt="" aria-hidden="true" loading="lazy">'+word('小绚绚','name-feature')+'</div></div>'+
 '<div class="nickname-object nickname-fish"><div class="nickname-object-float"><img src="assets/nickname-fish.webp" alt="" aria-hidden="true" loading="lazy">'+word('泡泡鱼','name-feature')+'</div></div>'+
 '<div class="nickname-object nickname-pumpkin"><div class="nickname-object-float"><img src="assets/nickname-pumpkin.webp" alt="" aria-hidden="true" loading="lazy">'+word('小南瓜','name-feature')+'<p class="name-original">小冬瓜和小南瓜要在一起🥺</p></div></div>'+
 '<div class="nickname-object nickname-pepper"><div class="nickname-object-float"><img src="assets/nickname-star-pepper.webp" alt="" aria-hidden="true" loading="lazy">'+word('小辣椒','name-feature')+'</div></div>'+
 '<div class="nickname-satellites">'+satellites.map((n,i)=>'<div class="name-satellite satellite-'+i+'" style="--name-delay:-'+i%7+'s;--name-duration:'+(7+i%5)+'s">'+word(n)+'</div>').join('')+'</div>'+
 '<div class="name-glints" aria-hidden="true">'+Array.from({length:14},(_,i)=>'<i style="--glint-x:'+(8+i*19%84)+'%;--glint-y:'+(17+i*29%68)+'%;--glint-delay:-'+i%8+'s"></i>').join('')+'</div>'+
 '<p class="nickname-promise"><span></span>名字有很多，偏爱只有一个你。<span></span></p>'+
 '</div>'+
 '<div class="nickname-remainder"><div class="nickname-remainder-heading"><p>还有好多，想叫给你听。</p><span>49 种专属称呼</span></div><div class="nickname-name-tides">'+families.map((f,i)=>'<div class="nickname-tide" style="--tide-index:'+i+'"><h3>'+escapeText(f.name)+'</h3><div>'+f.names.map((n,j)=>'<span class="tide-word" style="--name-delay:-'+(i+j)%9+'s;--name-duration:'+(8+j%4)+'s">'+word(n)+'</span>').join('')+'</div></div>').join('')+'</div></div>'+
 '</section>';
}
