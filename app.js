import {calculate,money} from './finance.js';
const $=id=>document.getElementById(id), key='income-demo-v1', colors=['#fa693b','#f7b955','#83a99c','#889cc8','#c0a5cf','#a5a8b2'];
const blank=()=>({income:'',expenses:['住房','餐饮','交通','其他'].map(name=>({name,amount:''}))});
let state=blank();
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const motions=new Map();
function animateValue(id,value,format){
 const el=$(id),previous=Number(el.dataset.value||0);
 cancelAnimationFrame(motions.get(id));el.dataset.value=value;
 if(reducedMotion.matches||previous===value){el.textContent=format(value);return;}
 const start=performance.now();
 function frame(now){const progress=Math.min((now-start)/420,1);el.textContent=format(previous+(value-previous)*(1-(1-progress)**3));if(progress<1)motions.set(id,requestAnimationFrame(frame));}
 motions.set(id,requestAnimationFrame(frame));
}
let chartSignature='';

try{const saved=localStorage.getItem(key);if(saved){const data=JSON.parse(saved);if(data.version!==1||typeof data.state.income!=='string')throw Error();calculate(data.state.income,data.state.expenses);state=data.state;}}catch{$('storage').textContent='无法读取草稿，当前从空白开始';}
function rows(){
 $('income').value=state.income;$('expenses').replaceChildren();
 state.expenses.forEach((item,i)=>{
  const row=document.createElement('div');row.className='expense-row';row.style.setProperty('--category',colors[i%colors.length]);
  for(const field of ['name','amount']){const input=document.createElement('input');input.value=item[field];input.setAttribute('aria-label',`第${i+1}项支出${field==='name'?'名称':'金额'}`);input.setAttribute('aria-describedby','error');if(field==='name')input.maxLength=20;else{input.inputMode='decimal';input.placeholder='0.00';}input.addEventListener('input',()=>{item[field]=input.value;update();});row.append(input);}
  const remove=document.createElement('button');remove.textContent='×';remove.className='delete';remove.setAttribute('aria-label',`删除第${i+1}项支出`);remove.onclick=()=>{state.expenses.splice(i,1);rows();update();$('add').focus();};row.append(remove);$('expenses').append(row);
 });$('add').disabled=state.expenses.length>=30;
}
function update(save=true){
 let r;try{r=calculate(state.income,state.expenses);$('error').textContent='';}catch(e){$('error').textContent=e.message+'；请修正后查看结果。';for(const id of ['balance','total','rate','chart-total']){cancelAnimationFrame(motions.get(id));delete $(id).dataset.value;$(id).textContent='—';}$('insight').textContent='输入尚未有效，结果与保存已暂停。';$('storage').textContent='修改尚未保存';$('chart').style.background='#e7e7dc';$('chart').setAttribute('aria-label','输入无效，暂无图表');$('legend').textContent='请先修正输入';return;}
 animateValue('balance',r.balance,value=>money(Math.round(value)));$('balance').classList.toggle('negative',r.balance<0);animateValue('total',r.total,value=>`¥ ${money(Math.round(value))}`);$('chart-total').textContent=`¥ ${money(r.total)}`;if(r.rate===null){cancelAnimationFrame(motions.get('rate'));delete $('rate').dataset.value;$('rate').textContent='—';}else animateValue('rate',r.rate,value=>`${value.toFixed(1)}%`);
 $('insight').textContent=r.income===0?'收入为零，暂无法计算储蓄率。':r.balance<0?`本月超支 ¥ ${money(-r.balance)}，可以重新看看支出安排。`:`每收入 100 元，留下 ${r.rate.toFixed(1)} 元。`;
 $('legend').replaceChildren();let offset=0;const stops=[], descriptions=[];
 r.items.forEach((item,i)=>{if(item.amount<=0)return;const p=item.amount/r.total*100,c=colors[i%colors.length];stops.push(`${c} ${offset}% ${offset+p}%`);offset+=p;const row=document.createElement('div');row.className='legend-item';const dot=document.createElement('span');dot.className='swatch';dot.style.background=c;const label=document.createElement('span');label.className='legend-name';label.textContent=item.name;const amount=document.createElement('small');amount.textContent=`¥ ${money(item.amount)}`;label.append(amount);const ratio=document.createElement('span');ratio.textContent=`${p.toFixed(1)}%`;row.append(dot,label,ratio);$('legend').append(row);descriptions.push(`${item.name} ${p.toFixed(1)}%`);});
 const signature=stops.join(',');if(signature!==chartSignature&&!reducedMotion.matches){$('chart').getAnimations().forEach(a=>a.cancel());$('chart').animate([{opacity:.4,transform:'scale(.94) rotate(-12deg)'},{opacity:1,transform:'scale(1) rotate(0deg)'}],{duration:480,easing:'cubic-bezier(.2,.7,.2,1)'});}chartSignature=signature;
 $('chart').style.background=stops.length?`conic-gradient(${stops.join(',')})`:'#e7e7dc';$('chart').setAttribute('aria-label',stops.length?`支出分布：${descriptions.join('，')}。金额见图例。`:'暂无支出');if(!stops.length){const p=document.createElement('p');p.className='empty';p.textContent='还没有支出，每一笔开销都将在这里呈现。';$('legend').append(p);}
 if(save)try{localStorage.setItem(key,JSON.stringify({version:1,state}));$('storage').textContent='已保存在此浏览器';}catch{$('storage').textContent='浏览器无法保存，关闭后数据会丢失';}
}
$('income').oninput=e=>{state.income=e.target.value;update();};
$('add').onclick=()=>{if(state.expenses.length>=30)return;state.expenses.push({name:'新支出',amount:''});rows();update();$('expenses').lastElementChild.classList.add('new-row');$('expenses').lastElementChild.firstElementChild.focus();};
$('clear').onclick=()=>{if(!confirm('清空当前收入和所有支出？此操作无法撤销。'))return;state=blank();rows();update();};
$('example').onclick=()=>{if((state.income||state.expenses.some(x=>x.amount))&&!confirm('用示例替换当前收支数据？'))return;state={income:'12000',expenses:[{name:'住房',amount:'3000'},{name:'餐饮',amount:'1800'},{name:'交通',amount:'400'},{name:'生活购物',amount:'800'},{name:'休闲娱乐',amount:'600'}]};rows();update();};
rows();update(false);
