"use strict";
/* ---------- 工具 ---------- */
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad=n=>String(n).padStart(2,"0");
const fmtD=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayStr=()=>fmtD(new Date());
const dOff=n=>{const d=new Date();d.setDate(d.getDate()+n);return fmtD(d);};
function toast(msg){let t=$("#toast");if(!t){t=document.createElement("div");t.id="toast";t.style.cssText="position:fixed;left:50%;top:70px;transform:translateX(-50%);background:#111827;color:#fff;padding:8px 18px;border-radius:8px;z-index:99;font-size:13px;display:none";document.body.appendChild(t);}t.textContent=msg;t.style.display="block";clearTimeout(t._h);t._h=setTimeout(()=>t.style.display="none",1600);}
function copyText(t){const done=()=>toast("已复制到剪贴板");if(navigator.clipboard){navigator.clipboard.writeText(t).then(done);}else{const ta=document.createElement("textarea");ta.value=t;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();done();}}
function textOf(s){s=String(s??"");if(!/<[a-z][\s\S]*>/i.test(s))return s;const d=document.createElement("div");d.innerHTML=s;return d.innerText||"";}
const sum50=s=>{const t=textOf(s).replace(/\s+/g," ");return t.length>50?t.slice(0,50)+"…":t;};

/* ---------- 格式常量 ---------- */
const FMT_ELS=[["h1","一级标题（章）"],["h2","二级标题（节）"],["h3","三级标题（目）"],["h4","四级标题（子目）"],["h5","五级（①）"],["body","正文"],["tbTitle","表格标题"],["table","表格"],["fig","图形"]];
const FONTS=["仿宋","黑体","楷体","宋体","Times New Roman","Arial","微软雅黑"];
const SIZES=["初号","小初","一号","小一","二号","小二","三号","小三","四号","小四","五号"];
const SIZE_PT={"初号":42,"小初":36,"一号":26,"小一":24,"二号":22,"小二":18,"三号":16,"小三":15,"四号":14,"小四":12,"五号":10.5};
const ALIGNS=[["left","左对齐"],["center","居中"],["right","右对齐"],["justify","两端对齐"]];
const LINES=[["单倍","单倍"],["1.5倍","1.5倍"],["2倍","2倍"],["固定28磅","固定28磅"]];
const STRUCT_DEF=`一、××××××　　　　　（一级标题，章）
（一）××××××　　　（二级标题，节）
1. ××××××　　　　　（三级标题，目）
（1）××××××　　　（四级标题，子目）
① ××××××　　　　 （五级，少见，多用于注释型列举）`;
function defStyles(){return{h1:{font:"黑体",size:"三号",bold:1,align:"left",indent:2,line:"固定28磅",space:0},h2:{font:"楷体",size:"三号",bold:1,align:"left",indent:2,line:"固定28磅",space:0},h3:{font:"仿宋",size:"三号",bold:1,align:"left",indent:2,line:"固定28磅",space:0},h4:{font:"仿宋",size:"三号",bold:0,align:"left",indent:2,line:"固定28磅",space:0},h5:{font:"仿宋",size:"三号",bold:0,align:"left",indent:2,line:"固定28磅",space:0},body:{font:"仿宋",size:"三号",bold:0,align:"justify",indent:2,line:"固定28磅",space:0},tbTitle:{font:"黑体",size:"小四",bold:1,align:"center",indent:0,line:"单倍",space:3},table:{font:"宋体",size:"小四",bold:0,align:"center",indent:0,line:"单倍",space:0},fig:{font:"楷体",size:"小四",bold:0,align:"center",indent:0,line:"单倍",space:3}};}

/* ---------- 数据与预置 ---------- */
const LS="sbw_v1";
const CATS=["工商管理","人力资源管理","市场营销","物流管理","数字经济","数字贸易","创新创业","劳动与社会保障"];
function seed(){
 const products=[
  {id:"p1",seed:1,name:"人力资源管理智能仿真与竞赛对抗平台",cat:"人力资源管理",price:"28万/套",params:"V4.0；覆盖人力资源战略、招聘、培训、薪酬、绩效全流程模拟；含竞赛对抗、智能评分与复盘模块；支持全院跨班组对抗实验。",points:"全国大学生人力资源管理综合能力竞赛官方指定比赛平台，申报“对抗竞赛类”实验室核心产品。"},
  {id:"p2",seed:1,name:"人力资源大数据分析综合实践平台",cat:"人力资源管理",price:"30万/套（100万版32万）",params:"V3.0；覆盖数据采集、清洗、建模、可视化全分析流程；内置真实企业人力资源数据集；已在上海对外经贸大学(2024)、苏州城市学院(2025)部署。",points:"河南省人力资源数据分析大赛官方指定平台；100万预算版四核心之一。"},
  {id:"p3",seed:1,name:"数字经济综合实训平台",cat:"数字经济",price:"目录价48万/套（案例成交24.8万）",params:"四大行业场景（餐饮外卖/网络直播/共享交通/数字文旅）+8种以上大数据分析方法；支持200+学生并发实训。",points:"中南林业科技大学成交案例；适配数字经济实训中心申报。"},
  {id:"p4",seed:1,name:"数字经济智能对抗实训平台",cat:"数字经济",price:"目录价42万/套（案例成交24.8万）",params:"支持运营5年、每年2周期；4大预测分析指标；智能对抗决策与复盘。",points:"与综合实训平台组成“综合+对抗”组合，数字经济方向标准配置。"},
  {id:"p5",seed:1,name:"数智化商业决策实训平台",cat:"工商管理",price:"35万/套",params:"V3.0；围绕商业决策核心，含运营共享中心、智能研发、数字制造等业务流程。",points:"河南质量工程职业学院案例成交价；适配商科综合决策课程。"},
  {id:"p6",seed:1,name:"创新创业实战模拟竞赛对抗平台",cat:"创新创业",price:"35万/套",params:"V4.0；模拟创业者从0到1全过程，覆盖组建团队、融资、市场开拓、经营决策。",points:"郑州西亚斯学院成交案例；适配创新创业实验室申报。"}];
 const hardware=[
  {id:"h1",seed:1,name:"教师电脑",model:"i5-12400/16G/512G SSD/23.8寸显示器",unit:"套",price:0.87,qty:2,amount:1.74},
  {id:"h2",seed:1,name:"学生电脑",model:"i5-12400/8G/256G SSD/21.5寸显示器",unit:"套",price:0.66,qty:60,amount:39.6},
  {id:"h3",seed:1,name:"投影仪",model:"激光投影 4500流明/含幕布吊架",unit:"台",price:1.3,qty:2,amount:2.6},
  {id:"h4",seed:1,name:"服务器",model:"2×至强银牌4314/64G/4×1.2T SAS",unit:"台",price:2.21,qty:2,amount:4.42}];
 const s2=defStyles();Object.values(s2).forEach(v=>{v.size="小四";v.line="1.5倍";});s2.body.font="微软雅黑";s2.h1.font="黑体";s2.h2.font="黑体";s2.h3.font="微软雅黑";
 return{products,hardware,
 proposals:[
  {id:"s1",seed:1,title:"新商科实验教学中心建设项目申报书",type:"项目申报书",client:"某财经大学经济管理学院",year:"2025",keypoints:"以“数智化转型”为主线；突出跨专业实训与虚拟仿真；申报省级实验教学示范中心。",content:"一、项目背景…\n二、建设基础…\n三、建设内容…\n四、预算与绩效目标…"},
  {id:"s2",seed:1,title:"数智化商科实训基地建设方案",type:"建设方案",client:"某职业技术学院商学院",year:"2024",keypoints:"按“岗课赛证”融通设计；分三期建设；配套师资培训与课程资源包。",content:"一、建设背景与依据…\n二、建设目标与思路…\n三、建设内容与预算…"}],
 policies:[
  {id:"z1",seed:1,name:"“十四五”数字经济发展规划（国发〔2021〕29号）",org:"国务院",date:"2021-12",keywords:"数字经济,产业数字化,数据要素",summary:"数据要素价值释放、产业数字化转型、数字经济治理体系。",usage:"论证数字化实训平台的时代必要性"},
  {id:"z2",seed:1,name:"新一代人工智能发展规划（国发〔2017〕35号）",org:"国务院",date:"2017-07",keywords:"人工智能,教育体系,AI+X",summary:"把高端人才队伍建设作为人工智能发展的重中之重，完善人工智能教育体系。",usage:"建设背景“人工智能+X”复合人才培养"},
  {id:"z3",seed:1,name:"中国教育现代化2035",org:"中共中央、国务院",date:"2019-02",keywords:"融合发展,共建共享,应用型",summary:"加大应用型、复合型、技术技能型人才培养比重。",usage:"指导思想与必要性论证"},
  {id:"z4",seed:1,name:"关于深化产教融合的若干意见（国办发〔2017〕95号）",org:"国务院办公厅",date:"2017-12",keywords:"产教融合,校企合作",summary:"深化产教融合，推进校企合作，健全多元化办学体制。",usage:"可行性分析“企业深度参与协同育人”"},
  {id:"z5",seed:1,name:"人力资源服务业创新发展行动计划（2023-2025年）",org:"人力资源社会保障部",date:"2023-01",keywords:"数字化转型,智能匹配",summary:"全面提升数字化水平，鼓励数字技术与人力资源管理服务深度融合。",usage:"行业趋势论证"},
  {id:"z6",seed:1,name:"“十五五”数字福建规划（闽政〔2026〕7号）",org:"福建省人民政府",date:"2026",keywords:"教育数字化,人工智能赋能教育",summary:"做强做优做大融合创新的数字经济；深入实施教育数字化战略，促进人工智能助力教育变革。",usage:"福建省内高校数字经济方向项目申报的省级政策依据"}],
 todos:[
  {id:"t1",title:"申报书初稿交付",meta:"某财经大学经济管理学院 · 方案交付",due:dOff(-2)},
  {id:"t2",title:"报价单确认与盖章",meta:"某职业技术学院商学院 · 报价提交",due:dOff(0)},
  {id:"t3",title:"补充产品参数清单",meta:"内部 · 其他",due:dOff(0)}],
 formats:[
  {id:"f1",seed:1,name:"标准公文格式（三号仿宋）",structure:STRUCT_DEF,styles:defStyles()},
  {id:"f2",seed:1,name:"商务通用（小四·1.5倍行距）",structure:STRUCT_DEF,styles:s2}],
 skills:[
  {id:"k1",seed:1,name:"申报书撰写专家",desc:"按标准九章结构撰写完整项目申报书，正式书面语，预算自洽。",prompt:"以高校项目申报书的标准九章结构（项目背景与政策依据/学校现状与需求分析/建设目标与思路/建设内容与产品方案/资金预算与用途/组织实施与进度/预期效益/保障措施）撰写，语言正式、论证充分。"},
  {id:"k2",seed:1,name:"建设方案撰写",desc:"侧重建设内容、实施路径与进度安排的建设方案。",prompt:"以建设方案体例撰写，突出建设内容分解、软硬件配置、实施路径与分阶段进度安排，弱化申报审批性表述。"},
  {id:"k3",seed:1,name:"报价方案撰写",desc:"侧重预算明细、价格依据与商务条款。",prompt:"以报价方案体例撰写，预算明细逐项列示（名称/型号/单位/单价/数量/金额），合计等于分项之和，并附价格依据与商务说明。"},
  {id:"k4",seed:1,name:"政策论证强化",desc:"在背景章节逐条深度引用勾选政策，强化立项依据。",prompt:"在“项目背景与政策依据”章节对每条勾选政策做“政策要点→本项目对应响应”的逐条论证，引用必须含文件名与文号，不得编造。"}],
 fundOptions:[],
 llm:{provider:"deepseek",baseUrl:"https://api.deepseek.com",model:"deepseek-chat",key:""}};}
let db=null;
try{db=JSON.parse(localStorage.getItem(LS));}catch(e){}
if(!db||!Array.isArray(db.products)){db=seed();localStorage.setItem(LS,JSON.stringify(db));}
const persist=()=>localStorage.setItem(LS,JSON.stringify(db));
db.llm=db.llm||{provider:"deepseek",baseUrl:"https://api.deepseek.com",model:"deepseek-chat",key:""};
if(!Array.isArray(db.hardware)||!db.hardware.length||(db.hardware[0]&&db.hardware[0].model===undefined))db.hardware=seed().hardware;
if(!Array.isArray(db.formats)||!db.formats.length)db.formats=seed().formats;
if(!Array.isArray(db.skills)||!db.skills.length)db.skills=seed().skills;
if(!Array.isArray(db.fundOptions))db.fundOptions=[];
const PROVIDERS={deepseek:{base:"https://api.deepseek.com",model:"deepseek-chat"},qwen:{base:"https://dashscope.aliyuncs.com/compatible-mode/v1",model:"qwen-plus"},doubao:{base:"https://ark.cn-beijing.volces.com/api/v3",model:"doubao-1-5-pro-32k-250115"},custom:{base:"",model:""}};

/* ---------- 渲染 ---------- */
function renderTodos(){
 const list=db.todos.filter(t=>!t.done).sort((a,b)=>a.due<b.due?-1:1);
 $("#todoCnt").textContent=list.length;
 $("#todoList").innerHTML=list.length?list.map(t=>{
  const td=todayStr();let cls="",badge="";
  if(t.due<td){cls="overdue";badge=`<span class="badge red">逾期</span>`;}
  else if(t.due===td)badge=`<span class="badge">今天</span>`;
  else badge=`<span class="badge gray">${t.due}</span>`;
  const late=t.due<td?`（逾期 ${Math.round((new Date(td)-new Date(t.due))/864e5)} 天）`:"";
  return `<div class="todo ${cls}"><div class="t"><b>${esc(t.title)}</b>${badge}<div class="meta">${esc(t.meta)} · 截止 ${t.due} ${late}</div></div>
  <button class="btn btn-sm" data-todo="done" data-id="${t.id}">✓ 搞定</button>
  <button class="btn btn-sm" data-todo="plus" data-id="${t.id}">📅 +1天</button>
  <button class="btn btn-sm btn-danger" data-todo="del" data-id="${t.id}">🗑</button></div>`;
 }).join(""):`<div style="color:#6b7280;font-size:13px">今天没有待办 ✨</div>`;
}
const EMPTY=`<div class="card item" style="grid-column:1/-1;color:#6b7280">暂无数据，点击右上角「新增」录入。</div>`;
function renderProducts(){
 const q=$("#prodSearch").value.trim();
 const list=db.products.filter(p=>!q||(p.name+p.cat+textOf(p.params)+p.points).includes(q));
 $("#prodCnt").textContent=`共 ${db.products.length} 款`;
 $("#prodGrid").innerHTML=list.map(p=>`<div class="card item">
  <div class="head"><b>${esc(p.name)}</b><span class="tag">${esc(p.cat)}</span></div>
  <div class="row"><span class="k">参考报价：</span><b>${esc(p.price)}</b></div>
  <div class="row"><span class="k">参数提炼：</span>${esc(sum50(p.params))||"（空）"}</div>
  <div class="row"><span class="k">卖点：</span>${esc(sum50(p.points))}</div>
  <div class="acts"><button class="btn btn-sm" data-act="view" data-kind="product" data-id="${p.id}">👁 完整参数</button>
  <button class="btn btn-sm" data-act="edit" data-kind="product" data-id="${p.id}">✎ 编辑</button>
  <button class="btn btn-sm btn-danger" data-act="del" data-kind="product" data-id="${p.id}">🗑 删除</button></div></div>`).join("")||EMPTY;
}
function renderHardware(){
 const q=$("#hwSearch").value.trim();
 const list=db.hardware.filter(p=>!q||(p.name+p.model).includes(q));
 $("#hwCnt").textContent=`共 ${db.hardware.length} 项`;
 $("#hwGrid").innerHTML=list.map(p=>`<div class="card item">
  <div class="head"><b>${esc(p.name)}</b><span class="tag">${esc(p.unit)}</span></div>
  <div class="row"><span class="k">型号规格：</span>${esc(p.model)}</div>
  <div class="row"><span class="k">单价：</span><b>${esc(p.price)} 万</b>　<span class="k">数量：</span><b>${esc(p.qty)}</b></div>
  <div class="row"><span class="k">金额：</span><b>${esc(p.amount)} 万元</b></div>
  <div class="acts"><button class="btn btn-sm" data-act="edit" data-kind="hardware" data-id="${p.id}">✎ 编辑</button>
  <button class="btn btn-sm btn-danger" data-act="del" data-kind="hardware" data-id="${p.id}">🗑 删除</button></div></div>`).join("")||EMPTY;
}
function renderProposals(){
 const q=$("#propSearch").value.trim();
 const list=db.proposals.filter(p=>!q||(p.title+p.client+p.keypoints).includes(q));
 $("#propCnt").textContent=`共 ${db.proposals.length} 份`;
 $("#propGrid").innerHTML=list.map(p=>`<div class="card item">
  <div class="head"><b>${esc(p.title)}</b><span class="tag ${p.type==="建设方案"?"green":""}">${esc(p.type)}</span></div>
  <div class="row"><span class="k">客户：</span><b>${esc(p.client)}</b>　<span class="k">年份：</span><b>${esc(p.year)}</b></div>
  <div class="row"><span class="k">要点：</span>${esc(p.keypoints)}</div>
  <div class="row"><span class="k">可复用内容：</span>${esc((p.content||"").slice(0,120))}${(p.content||"").length>120?"…":""}</div>
  <div class="acts"><button class="btn btn-sm" data-act="copy" data-id="${p.id}">⧉ 复制要点</button>
  <button class="btn btn-sm" data-act="edit" data-kind="proposal" data-id="${p.id}">✎ 编辑</button>
  <button class="btn btn-sm btn-danger" data-act="del" data-kind="proposal" data-id="${p.id}">🗑 删除</button></div></div>`).join("")||EMPTY;
}
function renderPolicies(){
 const q=$("#polSearch").value.trim();
 const list=db.policies.filter(p=>!q||(p.name+p.org+p.keywords+p.summary).includes(q));
 $("#polCnt").textContent=`共 ${db.policies.length} 条`;
 $("#polGrid").innerHTML=list.map(p=>`<div class="card item">
  <div class="head"><b>${esc(p.name)}</b><span class="tag orange">${esc(p.org)}</span></div>
  <div class="row"><span class="k">时间：</span><b>${esc(p.date)}</b>　<span class="k">关键词：</span><b>${esc(p.keywords)}</b></div>
  <div class="row">${esc(p.summary)}</div>
  <div class="row"><span class="k">适用：</span>${esc(p.usage)}</div>
  <div class="acts"><button class="btn btn-sm" data-act="edit" data-kind="policy" data-id="${p.id}">✎ 编辑</button>
  <button class="btn btn-sm btn-danger" data-act="del" data-kind="policy" data-id="${p.id}">🗑 删除</button></div></div>`).join("")||EMPTY;
}
function renderFormats(){
 $("#fmtCnt").textContent=`共 ${db.formats.length} 套`;
 $("#fmtGrid").innerHTML=db.formats.map(f=>{const st=f.styles||{};const b=st.body||{},h=st.h1||{};
  return `<div class="card item">
  <div class="head"><b>${esc(f.name)}</b><span class="tag">格式</span></div>
  <div class="row"><span class="k">一级标题：</span>${esc(h.font||"")} ${esc(h.size||"")}${h.bold?" 加粗":""}</div>
  <div class="row"><span class="k">正文：</span>${esc(b.font||"")} ${esc(b.size||"")} · ${esc(b.line||"")} · ${esc(b.align||"")}</div>
  <div class="row" style="white-space:pre-line;color:#6b7280;font-size:12px">${esc((f.structure||"").split("\n").slice(0,3).join("\n"))}…</div>
  <div class="acts"><button class="btn btn-sm" data-act="edit" data-kind="format" data-id="${f.id}">✎ 编辑</button>
  <button class="btn btn-sm btn-danger" data-act="del" data-kind="format" data-id="${f.id}">🗑 删除</button></div></div>`;}).join("")||EMPTY;
}
/* ---------- 政策智能匹配 ---------- */
const polUser=new Map();
const POL_KW={"工商管理":["商科","产教融合","校企合作"],"人力资源管理":["人力资源"],"市场营销":["营销","产教融合"],"物流管理":["物流","产教融合"],"数字经济":["数字经济","数字化","人工智能","AI"],"数字贸易":["数字贸易","数字经济"],"创新创业":["创新创业","创业"],"劳动与社会保障":["社会保障","劳动"],"新商科":["商科","教育现代化"],"对抗竞赛":["竞赛","以赛促学"],"大数据分析":["大数据","数字化"]};
function polScore(p,terms){const text=p.name+p.keywords+p.summary+p.usage;let s=0;for(const t of terms){if(t&&text.includes(t))s++;}return s;}
function collectTerms(){
 const major=($("#fMajor")?$("#fMajor").value:"").trim();const S=new Set();
 const addK=k=>{(POL_KW[k]||[]).forEach(t=>S.add(t));};
 if(major){S.add(major);addK(major);for(const k in POL_KW){if(k!==major&&(k.includes(major)||major.includes(k)))addK(k);}}
 $$(".gp").filter(c=>c.checked).forEach(c=>{const p=db.products.find(x=>x.id===c.value);if(p){S.add(p.cat);addK(p.cat);}});
 return [...S].filter(Boolean);
}
function autoMatchPolicies(){
 const cbs=$$(".gpol");if(!cbs.length)return;
 const terms=collectTerms();
 const rec=new Set(db.policies.filter(p=>polScore(p,terms)>0).map(p=>p.id));
 cbs.forEach(cb=>{const id=cb.value;cb.checked=polUser.has(id)?polUser.get(id):rec.has(id);});
}
function renderGen(){
 $("#fTemplates").innerHTML=db.proposals.map(p=>`<label class="chk"><input type="checkbox" class="gtpl" value="${p.id}"><span class="n">${esc(p.title)}</span><span class="m">${esc(p.type)}</span></label>`).join("")||`<div style="color:#6b7280">方案文库为空，可不用模板。</div>`;
 $("#genFunds").innerHTML=db.fundOptions.length?db.fundOptions.map(o=>`<label class="chk"><input type="checkbox" class="gfund" value="${esc(o)}"><span class="n">${esc(o)}</span></label>`).join(""):`<div style="color:#6b7280;font-size:12px">暂无选项，请在下方输入添加（如：中央财政专项 / 省级财政 / 学校自筹 / 企业配套）。</div>`;
 $("#genProducts").innerHTML=db.products.map(p=>`<label class="chk"><input type="checkbox" class="gp" value="${p.id}"><span class="n">${esc(p.name)}</span><span class="m">${esc(p.cat)} · ${esc(p.price)}</span></label>`).join("")||`<div style="color:#6b7280">产品库为空，请先到「产品资料库」新增。</div>`;
 $("#genHardware").innerHTML=db.hardware.map(p=>`<label class="chk"><input type="checkbox" class="ghw" value="${p.id}"><span class="n">${esc(p.name)}</span><span class="m">${esc(p.model)} · ${esc(p.amount)}万</span></label>`).join("")||`<div style="color:#6b7280">硬件库为空，请先到「硬件库」新增。</div>`;
 $("#genPolicies").innerHTML=db.policies.map(p=>`<label class="chk"><input type="checkbox" class="gpol" value="${p.id}"><span class="n">${esc(p.name)}</span><span class="m">${esc(p.org)} · ${esc(p.date)}</span></label>`).join("")||`<div style="color:#6b7280">政策库为空，请先到「政策资料库」新增。</div>`;
 const curF=$("#fFormat").value;$("#fFormat").innerHTML=`<option value="">不套用（默认样式）</option>`+db.formats.map(f=>`<option value="${f.id}">${esc(f.name)}</option>`).join("");if(curF)$("#fFormat").value=curF;
 const curK=$("#fSkill").value;$("#fSkill").innerHTML=db.skills.map(k=>`<option value="${k.id}">${esc(k.name)}</option>`).join("")||`<option value="">（无技能）</option>`;if(curK)$("#fSkill").value=curK;
 syncSkillDesc();
 autoMatchPolicies();
}
function syncSkillDesc(){const k=db.skills.find(x=>x.id===$("#fSkill").value);$("#skillDesc").textContent=k?`${k.desc||""}（技能提示词将注入生成指令）`:"暂无技能，可新建或导入。";}
function syncLlmUi(){$("#llmProvider").value=db.llm.provider||"deepseek";$("#llmBase").value=db.llm.baseUrl||"";$("#llmModel").value=db.llm.model||"";$("#llmKey").value=db.llm.key||"";}
function renderAll(){renderTodos();renderProducts();renderHardware();renderProposals();renderPolicies();renderFormats();renderGen();syncLlmUi();}

/* ---------- 弹窗与表单 ---------- */
function openModal(html){$("#modalBox").innerHTML=html;$("#mask").hidden=false;}
function closeModal(){$("#mask").hidden=true;}
$("#mask").addEventListener("click",e=>{if(e.target.id==="mask")closeModal();});
async function parseFile(f){if(/\.docx$/i.test(f.name)){if(!window.mammoth)throw new Error("mammoth 未加载（需联网）");return{html:(await mammoth.convertToHtml({arrayBuffer:await f.arrayBuffer()})).value,text:(await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()})).value};}const t=await f.text();return{html:esc(t).replace(/\r?\n/g,"<br>"),text:t};}
function bindFileRich(btnId,inputId,rteId){$("#"+btnId).onclick=()=>$("#"+inputId).click();
 $("#"+inputId).onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const r=await parseFile(f);$("#"+rteId).innerHTML+=r.html;toast("文件内容已导入（保留表格等原格式）");}catch(err){alert("解析失败："+err.message);}e.target.value="";};}
function bindFile(btnId,inputId,taId){$("#"+btnId).onclick=()=>$("#"+inputId).click();
 $("#"+inputId).onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const r=await parseFile(f);const ta=$("#"+taId);ta.value=(ta.value?ta.value+"\n":"")+r.text;toast("文件内容已填入");}catch(err){alert("解析失败："+err.message);}e.target.value="";};}
function libForm(id){
 const p=id?db.products.find(x=>x.id===id):{name:"",cat:"",price:"",params:"",points:""};
 const customCat=p.cat&&!CATS.includes(p.cat);
 const paramsHtml=/<[a-z][\s\S]*>/i.test(p.params)?p.params:esc(p.params).replace(/\r?\n/g,"<br>");
 openModal(`<h3>${id?"编辑":"新增"}产品</h3>
 <div class="field"><label>产品名称 *</label><input id="mName" value="${esc(p.name)}"></div>
 <div class="field"><label>领域/类别</label><select id="mCat">${CATS.map(c=>`<option ${p.cat===c?"selected":""}>${c}</option>`).join("")}<option value="__other" ${customCat?"selected":""}>其他</option></select><input id="mCatCustom" placeholder="请输入类别" value="${customCat?esc(p.cat):""}" style="${customCat?"":"display:none;"}margin-top:6px"></div>
 <div class="field"><label>参考报价</label><input id="mPrice" value="${esc(p.price)}" placeholder="如：28万/套"></div>
 <div class="field"><label>核心参数（20000 字以内，上传 Word 保留表格原格式）　<button class="btn btn-sm" type="button" id="mUp1">📎 上传 txt/md/docx 导入</button><input type="file" id="mFile1" accept=".txt,.md,.docx" hidden></label><div class="rte" id="mParams" contenteditable="true">${paramsHtml}</div><div style="font-size:11px;color:#6b7280;margin-top:4px">当前 <span id="mCnt">0</span> / 20000 字</div></div>
 <div class="field"><label>卖点　<button class="btn btn-sm" type="button" id="mUp2">📎 上传 txt/md/docx 填入</button><input type="file" id="mFile2" accept=".txt,.md,.docx" hidden></label><textarea id="mPoints">${esc(p.points)}</textarea></div>
 <div class="acts"><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 const cnt=()=>{$("#mCnt").textContent=$("#mParams").innerText.length;};cnt();
 $("#mParams").addEventListener("input",cnt);
 $("#mCat").onchange=e=>{$("#mCatCustom").style.display=e.target.value==="__other"?"":"none";};
 bindFileRich("mUp1","mFile1","mParams");bindFile("mUp2","mFile2","mPoints");
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{const name=$("#mName").value.trim();if(!name){alert("请填写名称");return;}
  const rte=$("#mParams");if(rte.innerText.length>20000){alert("核心参数超过 20000 字，请精简");return;}
  let cat=$("#mCat").value;if(cat==="__other")cat=$("#mCatCustom").value.trim()||"其他";
  const data={name,cat,price:$("#mPrice").value.trim(),params:rte.innerHTML,points:$("#mPoints").value.trim()};
  if(id)Object.assign(p,data);else db.products.push({id:uid(),...data});
  persist();closeModal();renderAll();toast("已保存（外部卡片自动提炼 50 字摘要）");};
}
function hwForm(id){
 const p=id?db.hardware.find(x=>x.id===id):{name:"",model:"",unit:"套",price:"",qty:1,amount:""};
 openModal(`<h3>${id?"编辑":"新增"}硬件</h3>
 <div class="field"><label>设备名称 *</label><input id="mName" value="${esc(p.name)}"></div>
 <div class="field"><label>型号规格</label><input id="mModel" value="${esc(p.model)}" placeholder="如：i5-12400/16G/512G SSD"></div>
 <div class="field"><label>单位</label><input id="mUnit" value="${esc(p.unit)}" placeholder="套 / 台 / 批"></div>
 <div class="field"><label>单价（万元）</label><input id="mPrice" type="number" step="0.01" min="0" value="${esc(p.price)}"></div>
 <div class="field"><label>数量</label><input id="mQty" type="number" step="1" min="0" value="${esc(p.qty)}"></div>
 <div class="field"><label>金额（万元，可手填；改单价/数量时自动计算）</label><input id="mAmount" type="number" step="0.01" min="0" value="${esc(p.amount)}"></div>
 <div class="acts"><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 const calc=()=>{const a=parseFloat($("#mPrice").value)||0,q=parseFloat($("#mQty").value)||0;$("#mAmount").value=Math.round(a*q*100)/100;};
 $("#mPrice").oninput=calc;$("#mQty").oninput=calc;
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{const name=$("#mName").value.trim();if(!name){alert("请填写设备名称");return;}
  const data={name,model:$("#mModel").value.trim(),unit:$("#mUnit").value.trim()||"套",price:parseFloat($("#mPrice").value)||0,qty:parseFloat($("#mQty").value)||0,amount:parseFloat($("#mAmount").value)||0};
  if(id)Object.assign(p,data);else db.hardware.push({id:uid(),...data});
  persist();closeModal();renderAll();toast("已保存");};
}
function fmtRow(key,label,st){
 return `<div class="fmtrow"><b>${label}</b>
 <select id="fs_${key}_font">${FONTS.map(f=>`<option ${st.font===f?"selected":""}>${f}</option>`).join("")}</select>
 <select id="fs_${key}_size">${SIZES.map(s=>`<option ${st.size===s?"selected":""}>${s}</option>`).join("")}</select>
 <select id="fs_${key}_align">${ALIGNS.map(a=>`<option value="${a[0]}" ${st.align===a[0]?"selected":""}>${a[1]}</option>`).join("")}</select>
 <select id="fs_${key}_line">${LINES.map(l=>`<option value="${l[0]}" ${st.line===l[0]?"selected":""}>${l[1]}</option>`).join("")}</select>
 <select id="fs_${key}_indent"><option value="0" ${!st.indent?"selected":""}>无</option><option value="2" ${st.indent?"selected":""}>2字符</option></select>
 <select id="fs_${key}_space">${[0,3,6,12].map(s=>`<option value="${s}" ${st.space===s?"selected":""}>${s}pt</option>`).join("")}</select>
 <input type="checkbox" id="fs_${key}_bold" ${st.bold?"checked":""} title="加粗"></div>`;
}
function formatForm(id){
 const f=id?db.formats.find(x=>x.id===id):{name:"",structure:STRUCT_DEF,styles:defStyles()};
 const st=f.styles||defStyles();
 openModal(`<h3>${id?"编辑":"新增"}格式</h3>
 <div class="field"><label>格式名称 *</label><input id="mName" value="${esc(f.name)}" placeholder="如：标准公文格式（三号仿宋）"></div>
 <div class="field"><label>结构格式（标题层级）</label><textarea id="mStruct" style="min-height:110px">${esc(f.structure||STRUCT_DEF)}</textarea></div>
 <div class="field"><label>各级元素格式（字体 / 字号 / 对齐 / 行距 / 首行缩进 / 段距 / 加粗）</label>
 <div class="fmt-head"><span>元素</span><span>字体</span><span>字号</span><span>对齐</span><span>行距</span><span>首行缩进</span><span>段前/后</span><span>加粗</span></div>
 ${FMT_ELS.map(([k,l])=>fmtRow(k,l,st[k]||defStyles()[k])).join("")}</div>
 <div class="acts"><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{const name=$("#mName").value.trim();if(!name){alert("请填写格式名称");return;}
  const styles={};FMT_ELS.forEach(([k])=>{styles[k]={font:$(`#fs_${k}_font`).value,size:$(`#fs_${k}_size`).value,align:$(`#fs_${k}_align`).value,line:$(`#fs_${k}_line`).value,indent:parseInt($(`#fs_${k}_indent`).value,10)||0,space:parseInt($(`#fs_${k}_space`).value,10)||0,bold:$(`#fs_${k}_bold`).checked?1:0};});
  const data={name,structure:$("#mStruct").value,styles};
  if(id)Object.assign(f,data);else db.formats.push({id:uid(),...data});
  persist();closeModal();renderAll();toast("已保存，可在生成台套用");};
}
function skillForm(id){
 const k=id?db.skills.find(x=>x.id===id):{name:"",desc:"",prompt:""};
 openModal(`<h3>${id?"编辑":"新建"}技能（Skill）</h3>
 <div class="field"><label>技能名称 *</label><input id="mName" value="${esc(k.name)}" placeholder="如：申报书撰写专家"></div>
 <div class="field"><label>简介</label><input id="mDesc" value="${esc(k.desc)}" placeholder="一句话说明用途"></div>
 <div class="field"><label>技能提示词（生成时注入系统指令）　<button class="btn btn-sm" type="button" id="mUp1">📎 上传 md/txt 填入</button><input type="file" id="mFile1" accept=".md,.txt" hidden></label><textarea id="mPrompt" style="min-height:140px">${esc(k.prompt)}</textarea></div>
 <div class="acts"><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 bindFile("mUp1","mFile1","mPrompt");
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{const name=$("#mName").value.trim();if(!name){alert("请填写技能名称");return;}
  const data={name,desc:$("#mDesc").value.trim(),prompt:$("#mPrompt").value.trim()};
  if(id)Object.assign(k,data);else db.skills.push({id:uid(),...data});
  persist();closeModal();renderGen();toast("已保存");};
}
function skillMgr(){
 openModal(`<h3>⚙ 技能管理</h3>
 ${db.skills.map(k=>`<div class="chk"><span class="n" style="flex:1">${esc(k.name)}<span class="m" style="margin-left:8px">${esc(k.desc)}</span></span>
 <button class="btn btn-sm" data-act="edit" data-kind="skill" data-id="${k.id}">✎</button>
 <button class="btn btn-sm btn-danger" data-act="del" data-kind="skill" data-id="${k.id}">🗑</button></div>`).join("")||EMPTY}
 <div class="acts"><button class="btn btn-primary" id="mOk">完成</button></div>`);
 $("#mOk").onclick=closeModal;
}
function proposalForm(id){
 const p=id?db.proposals.find(x=>x.id===id):{title:"",type:"项目申报书",client:"",year:String(new Date().getFullYear()),keypoints:"",content:""};
 openModal(`<h3>${id?"编辑方案":"新增方案"}</h3>
 <div class="field"><label>标题 *</label><input id="mTitle" value="${esc(p.title)}"></div>
 <div class="field"><label>类型</label><select id="mType"><option ${p.type==="项目申报书"?"selected":""}>项目申报书</option><option ${p.type==="建设方案"?"selected":""}>建设方案</option></select></div>
 <div class="field"><label>客户学校</label><input id="mClient" value="${esc(p.client)}"></div>
 <div class="field"><label>年份</label><input id="mYear" value="${esc(p.year)}"></div>
 <div class="field"><label>要点</label><textarea id="mKeys">${esc(p.keypoints)}</textarea></div>
 <div class="field"><label>可复用内容（正文摘录）　<button class="btn btn-sm" type="button" id="mUp1">📎 上传 txt/md/docx 填入</button><input type="file" id="mFile1" accept=".txt,.md,.docx" hidden></label><textarea id="mContent" style="min-height:150px">${esc(p.content)}</textarea></div>
 <div class="acts"><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 bindFile("mUp1","mFile1","mContent");
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{const title=$("#mTitle").value.trim();if(!title){alert("请填写标题");return;}
  const data={title,type:$("#mType").value,client:$("#mClient").value.trim(),year:$("#mYear").value.trim(),keypoints:$("#mKeys").value.trim(),content:$("#mContent").value.trim()};
  if(id)Object.assign(p,data);else db.proposals.push({id:uid(),...data});
  persist();closeModal();renderAll();toast("已保存");};
}
function policyForm(id){
 const p=id?db.policies.find(x=>x.id===id):{name:"",org:"",date:"",keywords:"",summary:"",usage:""};
 openModal(`<h3>${id?"编辑政策":"新增政策"}</h3>
 <div class="field"><label>政策名称（含文号）*</label><input id="mName" value="${esc(p.name)}" placeholder="如：××规划（国发〔2021〕29号）"></div>
 <div class="field"><label>发文单位</label><input id="mOrg" value="${esc(p.org)}"></div>
 <div class="field"><label>时间</label><input id="mDate" value="${esc(p.date)}" placeholder="如：2021-12"></div>
 <div class="field"><label>关键词</label><input id="mKeys" value="${esc(p.keywords)}" placeholder="逗号分隔"></div>
 <div class="field"><label>核心要点　<button class="btn btn-sm" type="button" id="mUp1">📎 上传 txt/md/docx 填入</button><input type="file" id="mFile1" accept=".txt,.md,.docx" hidden></label><textarea id="mSum">${esc(p.summary)}</textarea></div>
 <div class="field"><label>适用场景</label><input id="mUse" value="${esc(p.usage)}" placeholder="如：建设背景引用"></div>
 <div class="acts"><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 bindFile("mUp1","mFile1","mSum");
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{const name=$("#mName").value.trim();if(!name){alert("请填写政策名称");return;}
  const data={name,org:$("#mOrg").value.trim(),date:$("#mDate").value.trim(),keywords:$("#mKeys").value.trim(),summary:$("#mSum").value.trim(),usage:$("#mUse").value.trim()};
  if(id)Object.assign(p,data);else db.policies.push({id:uid(),...data});
  persist();closeModal();renderAll();toast("已保存");};
}
function todoForm(){
 openModal(`<h3>新任务</h3>
 <div class="field"><label>任务标题 *</label><input id="tTitle" placeholder="如：申报书初稿交付"></div>
 <div class="field"><label>说明（客户/类型）</label><input id="tMeta" placeholder="如：××学院 · 方案交付"></div>
 <div class="field"><label>截止日期</label><input id="tDue" type="date" value="${todayStr()}"></div>
 <div class="acts"><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{const title=$("#tTitle").value.trim();if(!title){alert("请填写任务标题");return;}
  db.todos.push({id:uid(),title,meta:$("#tMeta").value.trim(),due:$("#tDue").value||todayStr()});
  persist();closeModal();renderTodos();};
}

/* ---------- 事件绑定 ---------- */
$$(".tabs button").forEach(b=>b.onclick=()=>{$$(".tabs button").forEach(x=>x.classList.toggle("on",x===b));$$(".view").forEach(v=>v.classList.toggle("on",v.id==="view-"+b.dataset.tab));});
$("#prodSearch").oninput=renderProducts;$("#hwSearch").oninput=renderHardware;$("#propSearch").oninput=renderProposals;$("#polSearch").oninput=renderPolicies;
$("#btnAddProduct").onclick=()=>libForm();$("#btnAddHw").onclick=()=>hwForm();$("#btnAddProp").onclick=()=>proposalForm();$("#btnAddPol").onclick=()=>policyForm();$("#btnAddTodo").onclick=todoForm;$("#btnAddFmt").onclick=()=>formatForm();
$("#btnSkillNew").onclick=()=>skillForm();$("#btnSkillMgr").onclick=skillMgr;
$("#btnSkillImport").onclick=()=>$("#skillFile").click();
$("#skillFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;
 try{if(/\.json$/i.test(f.name)){const d=JSON.parse(await f.text());if(!d||!d.name||!d.prompt)throw new Error("JSON 需含 name 与 prompt 字段");db.skills.push({id:uid(),name:d.name,desc:d.desc||"",prompt:d.prompt});}
 else{const t=await f.text();db.skills.push({id:uid(),name:f.name.replace(/\.[^.]+$/,""),desc:"外部导入技能",prompt:t});}
 persist();renderGen();toast("技能已导入");}catch(err){alert("导入失败："+err.message);}e.target.value="";};
$("#fSkill").onchange=syncSkillDesc;
$("#btnFundAdd").onclick=()=>{const v=$("#fundNew").value.trim();if(!v)return;if(db.fundOptions.includes(v)){toast("选项已存在");return;}db.fundOptions.push(v);persist();$("#fundNew").value="";renderGen();};
const KIND={product:"products",hardware:"hardware",proposal:"proposals",policy:"policies",format:"formats",skill:"skills"};
document.addEventListener("click",e=>{
 const bt=e.target.closest("button[data-act]");
 if(bt){const{act,kind,id}=bt.dataset;
  if(act==="del"){if(!confirm("确定删除该条目？"))return;db[KIND[kind]]=db[KIND[kind]].filter(x=>x.id!==id);persist();renderAll();return;}
  if(act==="edit"){({product:()=>libForm(id),hardware:()=>hwForm(id),proposal:()=>proposalForm(id),policy:()=>policyForm(id),format:()=>formatForm(id),skill:()=>skillForm(id)})[kind]();return;}
  if(act==="view"){const p=db.products.find(x=>x.id===id);openModal(`<h3>${esc(p.name)} · 完整核心参数</h3><div class="rte" style="max-height:420px">${/<[a-z][\s\S]*>/i.test(p.params)?p.params:esc(p.params).replace(/\r?\n/g,"<br>")}</div><div class="acts"><button class="btn btn-primary" id="mOk">关闭</button></div>`);$("#mOk").onclick=closeModal;return;}
  if(act==="copy"){const p=db.proposals.find(x=>x.id===id);copyText(p.keypoints);return;}}
 const tt=e.target.closest("button[data-todo]");
 if(tt){const{todo,id}=tt.dataset;const t=db.todos.find(x=>x.id===id);if(!t)return;
  if(todo==="done"||todo==="del")db.todos=db.todos.filter(x=>x.id!==id);
  else if(todo==="plus"){const d=new Date(t.due);d.setDate(d.getDate()+1);t.due=fmtD(d);}
  persist();renderTodos();}
});
document.addEventListener("change",e=>{
 if(e.target.classList.contains("gpol"))polUser.set(e.target.value,e.target.checked);
 else if(e.target.classList.contains("gp"))autoMatchPolicies();
});
$("#fMajor").addEventListener("input",autoMatchPolicies);
$("#btnPolMatch").onclick=()=>{polUser.clear();autoMatchPolicies();toast("已按专业与产品智能匹配政策");};
/* 备份导入导出与清理 */
function exportJson(){const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="申报方案工作台备份_"+todayStr()+".json";a.click();toast("已导出备份");}
function importJson(file){const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d||!Array.isArray(d.products))throw 0;db=Object.assign({products:[],hardware:[],proposals:[],policies:[],todos:[],formats:[],skills:[],fundOptions:[],llm:db.llm},d);if(!Array.isArray(db.hardware))db.hardware=[];if(!Array.isArray(db.formats))db.formats=[];if(!Array.isArray(db.skills))db.skills=[];if(!Array.isArray(db.fundOptions))db.fundOptions=[];persist();renderAll();toast("导入成功");}catch(err){alert("备份文件格式不正确");}};r.readAsText(file);}
$("#btnExport").onclick=exportJson;$("#btnExport2").onclick=exportJson;
$("#btnImportTop").onclick=()=>$("#importFile").click();$("#btnImport2").onclick=()=>$("#importFile").click();
$("#importFile").onchange=e=>{if(e.target.files[0])importJson(e.target.files[0]);e.target.value="";};
$("#btnClearSeed").onclick=()=>{if(!confirm("仅删除预置示例数据，保留您自己录入的内容，确定？"))return;for(const k of["products","hardware","proposals","policies","todos","formats","skills"])db[k]=db[k].filter(x=>!x.seed);persist();renderAll();toast("示例已清空");};
$("#btnClearAll").onclick=()=>{if(!confirm("将删除全部数据（含您录入的内容），确定？"))return;if(!confirm("再次确认：清空后不可恢复（除非有备份），继续？"))return;db={products:[],hardware:[],proposals:[],policies:[],todos:[],formats:[],skills:[],fundOptions:[],llm:db.llm};persist();renderAll();};
/* 大模型配置 */
$("#llmProvider").onchange=e=>{db.llm.provider=e.target.value;const p=PROVIDERS[e.target.value];if(p&&p.base){db.llm.baseUrl=p.base;db.llm.model=p.model;}persist();syncLlmUi();};
$("#llmBase").onchange=e=>{db.llm.baseUrl=e.target.value.trim();persist();};
$("#llmModel").onchange=e=>{db.llm.model=e.target.value.trim();persist();};
$("#llmKey").onchange=e=>{db.llm.key=e.target.value.trim();persist();};

/* ---------- 生成：提示词 + 流式调用 + 本地模板 ---------- */
function parseWan(s){const m=String(s||"").match(/(\d+(?:\.\d+)?)\s*万/);if(m)return parseFloat(m[1]);const m2=String(s||"").replace(/[,，]/g,"").match(/(\d{4,7})(?!\d)/);return m2?Math.round(parseInt(m2,10)/10000):0;}
function wrapName(n){return /[《〈]/.test(n)?n:"《"+n+"》";}
function fmtSpecText(f){if(!f)return "";const L=FMT_ELS.map(([k,l])=>{const s=f.styles[k]||{};return `${l}：${s.font} ${s.size}${s.bold?" 加粗":""} ${ALIGNS.find(a=>a[0]===s.align)?.[1]||""} 首行缩进${s.indent||0}字符 行距${s.line} 段前段后${s.space||0}pt`;});return `结构格式：\n${f.structure||""}\n各级格式：${L.join("；")}`;}
function buildMessages(project,school,major,type,prods,hw,pols,tpls,words,funds,skill,fmt){
 const rules=["使用正式书面语，标题层级用“一、/（一）/1./（1）/①”五级；",
 "“建设背景与政策依据”部分必须逐条引用用户勾选的政策（含文件名与文号），不得编造任何政策文件名或文号；",
 "“建设内容”部分必须逐款融入用户勾选的产品（名称、核心参数、卖点），参数不得夸大或虚构；",
 "“预算”部分按勾选产品与硬件的参考报价列明细（硬件含型号/单位/单价/数量/金额），合计必须等于分项之和；",
 "涉及学校自身数据（现有条件、师资、学生规模等）一律用“（待补充：……）”占位，禁止虚构；"];
 if(words.total||words.chapter)rules.push(`字数要求：全文不少于 ${words.total} 字，且“一、/二、…”每个章节不少于 ${words.chapter} 字，论证充分展开；`);
 if(hw.length)rules.push("用户勾选了硬件配置，须在“建设内容”中单列硬件小节（设备名称/型号规格/单位/单价/数量/金额），并纳入预算明细；");
 if(funds.length)rules.push(`项目资金来源为：${funds.join("、")}；须在预算章节说明资金构成与使用管理；`);
 if(fmt)rules.push(`文档格式须符合「${fmt.name}」：${fmtSpecText(fmt).replace(/\n/g," ")}`);
 if(skill&&skill.prompt)rules.push(`技能要求（${skill.name}）：${skill.prompt}`);
 rules.push("直接输出正文，不要输出任何解释性语言。");
 const sys=`你是高校商科实训实验室建设领域的资深方案撰写专家，服务于软件供应商浙江精创教育科技有限公司，长期为高校撰写${type}。写作要求：\n`+rules.map((r,i)=>`${i+1}. ${r}`).join("\n");
 let user=`请为以下项目撰写一份完整的${type}初稿：
【项目名称】${project}
【客户学校】${school}
【相关专业】${major||"（未填写）"}
【编制单位】浙江精创教育科技有限公司
【勾选产品】
${prods.map((p,i)=>`${i+1}. ${p.name}｜类别：${p.cat}｜参考报价：${p.price}｜参数：${textOf(p.params).slice(0,1500)}｜卖点：${p.points}`).join("\n")||"（未勾选产品）"}
【勾选硬件】
${hw.map((p,i)=>`${i+1}. ${p.name}｜型号：${p.model}｜单位：${p.unit}｜单价：${p.price}万｜数量：${p.qty}｜金额：${p.amount}万`).join("\n")||"（未勾选硬件）"}
【勾选政策依据】
${pols.map((p,i)=>`${i+1}. ${p.name}（${p.org}，${p.date}）关键词：${p.keywords}。要点：${p.summary}。适用：${p.usage}`).join("\n")||"（未勾选政策）"}`;
 if(tpls.length)user+=`\n【参考模板】请模仿以下历史方案的章节结构与措辞风格（学校/产品/预算等信息以本次勾选为准；多份模板冲突时以第一份为主）：\n`+tpls.map((t,i)=>`模板${i+1}《${t.title}》：\n${(t.content||t.keypoints||"").slice(0,2000)}`).join("\n---\n");
 user+=`\n\n建议章节：一、项目背景与政策依据；二、学校现状与需求分析；三、建设目标与思路；四、建设内容与产品方案（含参数与卖点融入）；五、资金预算与用途（明细合计=总额，注明资金来源）；六、组织实施与进度安排；七、预期效益分析；八、保障措施。`;
 return [{role:"system",content:sys},{role:"user",content:user}];
}
async function streamChat(messages,onChunk){
 const base=(db.llm.baseUrl||"").replace(/\/+$/,"");
 if(!base)throw new Error("未配置接口地址");
 const res=await fetch(base+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+(db.llm.key||"")},body:JSON.stringify({model:db.llm.model,messages,stream:true})});
 if(!res.ok){let t="";try{t=await res.text();}catch(e){}throw new Error(`HTTP ${res.status}：${t.slice(0,300)}`);}
 const reader=res.body.getReader();const dec=new TextDecoder();let buf="",raw="",emitted=false;
 const handle=d=>{if(d==="[DONE]")return;try{const j=JSON.parse(d);const c=j.choices&&j.choices[0];const t=c&&(c.delta&&c.delta.content||c.message&&c.message.content)||"";if(t){emitted=true;onChunk(t);}}catch(e){}};
 while(true){const{done,value}=await reader.read();if(done)break;const s=dec.decode(value,{stream:true});raw+=s;buf+=s;
  let i;while((i=buf.indexOf("\n"))>=0){const line=buf.slice(0,i).trim();buf=buf.slice(i+1);if(line.startsWith("data:"))handle(line.slice(5).trim());}}
 if(!emitted){try{const j=JSON.parse(raw);const t=j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content||"";if(t)onChunk(t);}catch(e){if(!raw.trim())throw new Error("接口无返回内容");}}
}
function localDraft(project,school,type,prods,hw,pols,words,funds){
 const d=new Date(),ds=`${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;const L=[];
 L.push(`${wrapName(project)}${type}（初稿框架）`);
 L.push(`编制单位：浙江精创教育科技有限公司　编制日期：${ds}`);L.push("");
 L.push("一、项目背景与政策依据");
 if(pols.length)pols.forEach((p,i)=>L.push(`${i+1}. 依据${wrapName(p.name)}（${p.org}，${p.date}）：${p.summary}`));
 else L.push("（未勾选政策，建议在政策资料库勾选后重新生成）");
 L.push("");L.push("二、学校现状与需求分析");
 L.push("（此处按学校实际情况补充：现有实验实训条件、相关课程开设情况、师资力量、学生规模与教学痛点，建议 300-500 字）");
 L.push("");L.push("三、建设内容与产品方案");
 if(prods.length)prods.forEach((p,i)=>{L.push(`${i+1}. ${p.name}（参考报价：${p.price}）`);L.push(`　参数：${sum50(p.params)}`);L.push(`　卖点：${p.points}`);});
 else L.push("（未勾选产品）");
 if(hw.length){L.push("硬件配置：");hw.forEach((p,i)=>L.push(`${i+1}. ${p.name}｜型号：${p.model}｜单位：${p.unit}｜单价：${p.price}万｜数量：${p.qty}｜金额：${p.amount}万`));}
 L.push("");L.push("四、资金预算与用途");
 const total=prods.reduce((s,p)=>s+parseWan(p.price),0)+hw.reduce((s,p)=>s+(parseFloat(p.amount)||0),0);
 prods.forEach((p,i)=>L.push(`${i+1}. ${p.name}：${p.price}`));
 hw.forEach((p,i)=>L.push(`${prods.length+i+1}. ${p.name}（${p.model}）×${p.qty}：${p.amount}万`));
 L.push(total?`合计约 ${Math.round(total*100)/100} 万元（最终以正式报价为准）。`:"合计：（待核算）");
 if(funds.length)L.push(`资金来源：${funds.join("、")}。`);
 L.push("");L.push("五、组织实施与进度安排");
 L.push("按“方案论证→采购招标→部署调试→试运行”四阶段推进，明确月份与责任人。");
 L.push("");L.push("六、预期效益分析");
 L.push("从人才培养、学科发展、教学改革、社会服务、竞赛成果等维度展开（建议至少 4 个维度）。");
 L.push("");L.push("七、保障措施");
 L.push("管理机制、管理队伍、环境条件、资金筹措与政府采购合规保障。");
 if(words.total||words.chapter){L.push("");L.push(`（字数要求：整体 ≥${words.total} 字、每章节 ≥${words.chapter} 字；在 Word 中完善时请按此扩充。）`);}
 return L.join("\n");
}
function gatherGen(){
 return{
  project:$("#fProject").value.trim()||"（未命名项目）",
  school:$("#fSchool").value.trim()||"（学校待补充）",
  major:$("#fMajor").value.trim(),
  type:$("#fType").value,
  tpls:$$(".gtpl").filter(c=>c.checked).map(c=>db.proposals.find(p=>p.id===c.value)).filter(Boolean),
  prods:$$(".gp").filter(c=>c.checked).map(c=>db.products.find(p=>p.id===c.value)).filter(Boolean),
  hw:$$(".ghw").filter(c=>c.checked).map(c=>db.hardware.find(p=>p.id===c.value)).filter(Boolean),
  pols:$$(".gpol").filter(c=>c.checked).map(c=>db.policies.find(p=>p.id===c.value)).filter(Boolean),
  funds:$$(".gfund").filter(c=>c.checked).map(c=>c.value),
  words:{total:parseInt($("#fWordsTotal").value,10)||0,chapter:parseInt($("#fWordsChapter").value,10)||0},
  fmt:db.formats.find(f=>f.id===$("#fFormat").value)||null,
  skill:db.skills.find(k=>k.id===$("#fSkill").value)||null};
}
$("#btnGen").onclick=async()=>{
 const g=gatherGen();const ta=$("#genResult");
 if(!db.llm.key){ta.value=localDraft(g.project,g.school,g.type,g.prods,g.hw,g.pols,g.words,g.funds);toast("未配置 API Key，已用本地模板拼装框架");return;}
 const btn=$("#btnGen");btn.disabled=true;btn.textContent="⏳ 生成中…";ta.value="";
 try{await streamChat(buildMessages(g.project,g.school,g.major,g.type,g.prods,g.hw,g.pols,g.tpls,g.words,g.funds,g.skill,g.fmt),t=>{ta.value+=t;ta.scrollTop=ta.scrollHeight;});toast("生成完成");}
 catch(err){ta.value+=(ta.value?"\n\n":"")+"【生成失败】"+err.message+"\n请检查 API Key / 接口地址 / 模型名称；或清空 Key 后使用本地模板拼装。";}
 finally{btn.disabled=false;btn.textContent="⚡ 生成初稿";}
};

/* ---------- 修订对话框 ---------- */
let chatHist=[],chatFiles=[];
function renderChips(){$("#chatAttach").innerHTML=chatFiles.map((f,i)=>`<span class="chip">📎 ${esc(f.name)}<button data-rm="${i}">✕</button></span>`).join("");}
$("#chatAttach").addEventListener("click",e=>{const b=e.target.closest("button[data-rm]");if(b){chatFiles.splice(+b.dataset.rm,1);renderChips();}});
$("#btnChatUp").onclick=()=>$("#chatFile").click();
$("#chatFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const r=await parseFile(f);chatFiles.push({name:f.name,text:r.text.slice(0,8000)});renderChips();toast("附件已加入，将随下一条提问发送");}catch(err){alert("解析失败："+err.message);}e.target.value="";};
function addBub(role,text){const d=document.createElement("div");d.className="bub "+(role==="user"?"u":"a");d.textContent=text;$("#chatLog").appendChild(d);$("#chatLog").scrollTop=$("#chatLog").scrollHeight;return d;}
async function sendChat(){
 const q=$("#chatInput").value.trim();
 if(!q&&!chatFiles.length)return;
 if(!db.llm.key){toast("请先在「大模型配置」填写 API Key，对话框需调用大模型");return;}
 const att=chatFiles.map(f=>`\n【附件 ${f.name}】\n${f.text}`).join("");
 const uText=q+(chatFiles.length?`\n（含附件：${chatFiles.map(f=>f.name).join("、")}）`:"");
 addBub("user",uText);
 chatHist.push({role:"user",content:q+att});
 chatFiles=[];renderChips();$("#chatInput").value="";
 const sys=`你是“申报方案工作台”的方案修订助手，服务于浙江精创教育科技有限公司。当前生成结果栏中的方案初稿如下（作为修订上下文）：\n"""\n${$("#genResult").value.slice(0,6000)}\n"""\n请结合上下文与附件回答用户的修订问题，给出可直接采纳的修改内容或具体修改建议；涉及政策文号、产品参数、预算数字时不得虚构。`;
 const bub=addBub("a","⏳ 思考中…");
 try{await streamChat([{role:"system",content:sys},...chatHist.slice(-8)],t=>{bub.textContent=(bub.textContent==="⏳ 思考中…"?t:bub.textContent+t);$("#chatLog").scrollTop=$("#chatLog").scrollHeight;});
  chatHist.push({role:"assistant",content:bub.textContent});}
 catch(err){bub.textContent="【回答失败】"+err.message;}
}
$("#btnChatSend").onclick=sendChat;
$("#chatInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}});

/* ---------- 结果操作 ---------- */
function cssFor(st){if(!st)return "";return `font-family:'${st.font}',serif;font-size:${SIZE_PT[st.size]||14}pt;${st.bold?"font-weight:bold;":""}text-align:${st.align};${st.indent?`text-indent:${st.indent}em;`:""}line-height:${st.line==="固定28磅"?"28pt":st.line==="单倍"?"normal":st.line==="1.5倍"?"1.5":"2"};margin:${st.space||0}pt 0;`;}
function md2html(text,fmt){
 const S=k=>fmt?cssFor(fmt.styles[k]):"";
 const lines=esc(text).split(/\r?\n/);let out=[],tbl=[];
 const flush=()=>{if(!tbl.length)return;const rows=tbl.filter(r=>!r.split("|").every(c=>/^[\s:-]*$/.test(c)));
  out.push(`<table border="1" cellspacing="0" cellpadding="4" style="border-collapse:collapse;width:100%;${S("table")}">${rows.map(r=>"<tr>"+r.split("|").filter((c,i,a)=>!(i===0&&c==="")&&!(i===a.length-1&&c==="")).map(c=>`<td style="${S("table")}">${c.trim()}</td>`).join("")+"</tr>").join("")}</table>`);tbl=[];};
 lines.forEach((l,idx)=>{
  if(l.trim().startsWith("|")){tbl.push(l.trim());return;}
  flush();
  if(!l.trim()){return;}
  if(idx===0&&!/^[一二三四五六七八九十]+、/.test(l)){out.push(`<h1 style="${S("h1")}text-align:center">${l}</h1>`);return;}
  if(/^([一二三四五六七八九十]+、)/.test(l))return out.push(`<h2 style="${S("h1")}">${l}</h2>`);
  if(/^（[一二三四五六七八九十]+）/.test(l))return out.push(`<h3 style="${S("h2")}">${l}</h3>`);
  if(/^（\d+）/.test(l)||/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(l))return out.push(`<h4 style="${S("h4")}">${l}</h4>`);
  if(/^\d+[\.、]/.test(l))return out.push(`<h4 style="${S("h3")}">${l}</h4>`);
  if(/^(表|Table)\s?\d/.test(l))return out.push(`<p style="${S("tbTitle")}">${l}</p>`);
  if(/^(图|Fig)\.?\s?\d/.test(l))return out.push(`<p style="${S("fig")}">${l}</p>`);
  out.push(`<p style="${S("body")}">${l}</p>`);
 });
 flush();return out.join("");
}
$("#btnCopyAll").onclick=()=>{const t=$("#genResult").value;if(!t.trim()){alert("暂无内容");return;}copyText(t);};
$("#btnSaveProp").onclick=()=>{const t=$("#genResult").value.trim();if(!t){alert("请先生成内容");return;}
 const project=$("#fProject").value.trim()||"未命名项目";const type=$("#fType").value;const school=$("#fSchool").value.trim()||"待定";
 db.proposals.push({id:uid(),title:`${project}（${type}·生成稿）`,type:/(建设方案|报价方案)/.test(type)?"建设方案":"项目申报书",client:school,year:String(new Date().getFullYear()),keypoints:"由方案生成台于 "+todayStr()+" 生成",content:t});
 persist();renderAll();toast("已存入方案文库");};
$("#btnWord").onclick=()=>{const text=$("#genResult").value;if(!text.trim()){alert("请先生成内容");return;}
 const fmt=db.formats.find(f=>f.id===$("#fFormat").value)||null;
 const title=($("#fProject").value.trim()||"方案")+"_"+$("#fType").value;
 const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(title)}</title></head><body>${md2html(text,fmt)}</body></html>`;
 const blob=new Blob(["\ufeff",html],{type:"application/msword"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=title+".doc";a.click();toast(fmt?`已导出 Word（套用格式：${fmt.name}）`:"已导出 Word");};

renderAll();
