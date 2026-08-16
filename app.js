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
  {id:"k4",seed:1,name:"政策论证强化",desc:"在背景章节逐条深度引用勾选政策，强化立项依据。",prompt:"在“项目背景与政策依据”章节对每条勾选政策做“政策要点→本项目对应响应”的逐条论证，引用必须含文件名与文号，不得编造。"},
 {id:"k5",seed:1,name:"去 AI 味润色",desc:"降低生成文本的 AI 感，更像人工撰写的正式文稿。",prompt:"全文须降低 AI 痕迹，模拟资深方案撰写人员的真实笔触：①删除或改写“综上所述、值得注意的是、首先…其次…最后、总而言之、不难发现、赋能、助力、打造、构建、旨在、具有重要意义、发挥着重要作用”等高频套话；②不堆砌排比句与对仗短语，同一段内不重复使用同一句式；③少用空洞形容词与连续破折号、感叹号，论证用具体事实、数据与政策依据展开；④句子长短交错、自然衔接，允许朴实的过渡；⑤不得因润色而删减章节、要点与预算数据，结构与内容必须完整保留。"}],
 fundOptions:["科研与教改项目经费","校企合作与经营收入","其他"],
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
/* 兼容旧数据：补齐预置资金来源选项（用户自增项保留在后） */
(()=>{let ch=false;for(const o of seed().fundOptions){if(!db.fundOptions.includes(o)){db.fundOptions.splice(db.fundOptions.includes("其他")?db.fundOptions.indexOf("其他"):db.fundOptions.length,0,o);ch=true;}}if(db.fundOptions.includes("其他")&&db.fundOptions.indexOf("其他")!==db.fundOptions.length-1){db.fundOptions=db.fundOptions.filter(x=>x!=="其他").concat("其他");ch=true;}if(ch)localStorage.setItem(LS,JSON.stringify(db));})();
/* 兼容旧数据：移除已废弃的历史预置资金来源选项 */
(()=>{const HIST=["财政性资金","学校自筹"];const n=db.fundOptions.length;db.fundOptions=db.fundOptions.filter(x=>!HIST.includes(x));if(db.fundOptions.length!==n)localStorage.setItem(LS,JSON.stringify(db));})();
/* 兼容旧数据：移除误录入的纯数字无效资金来源选项（如“1”） */
(()=>{const n=db.fundOptions.length;db.fundOptions=db.fundOptions.filter(x=>!/^\d+$/.test(String(x).trim()));if(db.fundOptions.length!==n)localStorage.setItem(LS,JSON.stringify(db));})();
/* 兼容旧数据：预置技能按名补齐（含新增的“去 AI 味润色”） */
(()=>{let ch=false;for(const k of seed().skills){if(!db.skills.some(x=>x.name===k.name)){db.skills.push({id:uid(),name:k.name,desc:k.desc,prompt:k.prompt,seed:1});ch=true;}}if(ch)localStorage.setItem(LS,JSON.stringify(db));})();
/* 兼容旧数据：预置产品的类别同步为最新种子值（用户自建产品不动） */
(()=>{const sp=seed().products;let ch=false;db.products.forEach(p=>{if(!p.seed)return;const s=sp.find(x=>x.name===p.name);if(s&&p.cat!==s.cat){p.cat=s.cat;ch=true;}});if(ch)localStorage.setItem(LS,JSON.stringify(db));})();
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
/* 领域/类别标签配色：不同类别不同颜色 */
const CAT_COLORS=["#1d4fa8","#15803d","#b45309","#7c3aed","#0e7490","#be185d","#4d7c0f","#9333ea","#0f766e","#c2410c"];
function catColor(cat){const c=String(cat||"").split("、")[0].trim();if(!c)return "#6b7280";let i=CATS.indexOf(c);if(i<0){let h=0;for(const ch of c)h=(h*31+ch.charCodeAt(0))>>>0;i=h%CAT_COLORS.length;}return CAT_COLORS[i%CAT_COLORS.length];}
function renderProducts(){
 const q=$("#prodSearch").value.trim();
 const list=db.products.filter(p=>!q||(p.name+p.cat+textOf(p.params)+p.points).includes(q));
 $("#prodCnt").textContent=`共 ${db.products.length} 款`;
 $("#prodGrid").innerHTML=list.map(p=>`<div class="card item">
  <div class="head"><b>${esc(p.name)}</b><span class="tag" style="background:${catColor(p.cat)}1a;color:${catColor(p.cat)}">${esc(p.cat)}</span></div>
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
  <div class="row"><span class="k">单价：</span><b>${esc(p.price)} 万 / ${esc(p.unit)}</b></div>
  ${p.amount?`<div class="row"><span class="k">参考金额：</span><b>${esc(p.amount)} 万元</b></div>`:""}
  <div class="acts"><button class="btn btn-sm" data-act="edit" data-kind="hardware" data-id="${p.id}">✎ 编辑</button>
  <button class="btn btn-sm btn-danger" data-act="del" data-kind="hardware" data-id="${p.id}">🗑 删除</button></div></div>`).join("")||EMPTY;
}
function renderProposals(){
 const q=$("#propSearch").value.trim();
 const list=db.proposals.filter(p=>!q||(p.title+p.client+p.keypoints+textOf(p.content)).includes(q));
 $("#propCnt").textContent=`共 ${db.proposals.length} 份`;
 $("#propGrid").innerHTML=list.map(p=>`<div class="card item">
  <div class="head"><b>${esc(p.title)}</b><span class="tag ${p.type==="建设方案"?"green":""}">${esc(p.type)}</span></div>
  <div class="row"><span class="k">客户：</span><b>${esc(p.client)}</b>　<span class="k">年份：</span><b>${esc(p.year)}</b></div>
  <div class="row"><span class="k">要点：</span>${esc(p.keypoints)}</div>
  <div class="row"><span class="k">可复用内容：</span>${esc(textOf(p.content).replace(/\s+/g," ").slice(0,120))}${textOf(p.content).length>120?"…":""}</div>
  <div class="acts"><button class="btn btn-sm" data-act="copy" data-id="${p.id}">⧉ 复制要点</button>
  <button class="btn btn-sm" data-act="edit" data-kind="proposal" data-id="${p.id}">✎ 编辑</button>
  <button class="btn btn-sm btn-danger" data-act="del" data-kind="proposal" data-id="${p.id}">🗑 删除</button></div></div>`).join("")||EMPTY;
}
function renderPolicies(){
 const q=$("#polSearch").value.trim();
 const list=db.policies.filter(p=>!q||(p.name+p.org+p.keywords+textOf(p.summary)).includes(q));
 $("#polCnt").textContent=`共 ${db.policies.length} 条`;
 $("#polGrid").innerHTML=list.map(p=>`<div class="card item">
  <div class="head"><b>${esc(p.name)}</b><span class="tag orange">${esc(p.org)}</span></div>
  <div class="row"><span class="k">时间：</span><b>${esc(p.date)}</b>　<span class="k">关键词：</span><b>${esc(p.keywords)}</b></div>
  <div class="row">${esc(sum50(p.summary))||""}</div>
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
function polScore(p,terms){const text=p.name+p.keywords+textOf(p.summary)+p.usage;let s=0;for(const t of terms){if(t&&text.includes(t))s++;}return s;}
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
/* ---------- 专业 → 产品智能匹配（可手动覆盖） ---------- */
const prodUser=new Map();
const MAJOR_SYN={"人资":"人力资源管理","人力资源":"人力资源管理","物流":"物流管理","营销":"市场营销","社会保障":"劳动与社会保障","工商":"工商管理","创业":"创新创业","电商":"数字贸易"};
function majorCats(major){
 const S=new Set();
 if(!major)return S;
 for(const c of CATS){if(c===major||c.includes(major)||major.includes(c))S.add(c);}
 for(const k in MAJOR_SYN){if(major.includes(k))S.add(MAJOR_SYN[k]);}
 return S;
}
function autoMatchProducts(){
 const cbs=$$(".gp");if(!cbs.length)return;
 const major=($("#fMajor")?$("#fMajor").value:"").trim();
 if(!major)return; // 专业为空时不动已有勾选
 const cats=majorCats(major);
 cbs.forEach(cb=>{const p=db.products.find(x=>x.id===cb.value);if(!p)return;cb.checked=prodUser.has(p.id)?prodUser.get(p.id):String(p.cat||"").split("、").some(c=>cats.has(c));});
}
function renderGen(){
 $("#fTemplates").innerHTML=db.proposals.map(p=>`<label class="chk"><input type="checkbox" class="gtpl" value="${p.id}"><span class="n">${esc(p.title)}</span><span class="m">${esc(p.type)}</span></label>`).join("")||`<div style="color:#6b7280">方案文库为空，可不用模板。</div>`;
 $("#genFunds").innerHTML=db.fundOptions.map(o=>`<label class="chk"><input type="checkbox" class="gfund" value="${esc(o)}"><span class="n">${esc(o)}</span></label>`).join("");syncFundOther();
 $("#genProducts").innerHTML=db.products.map(p=>`<label class="chk"><input type="checkbox" class="gp" value="${p.id}"><span class="n">${esc(p.name)}</span><span class="m">${esc(p.cat)} · ${esc(p.price)}</span></label>`).join("")||`<div style="color:#6b7280">产品库为空，请先到「产品资料库」新增。</div>`;
 $("#genHardware").innerHTML=db.hardware.map(p=>`<div class="chkrow"><label class="chk"><input type="checkbox" class="ghw" value="${p.id}"><span class="n">${esc(p.name)}</span><span class="m">${esc(p.model)} · ${esc(p.price)}万/${esc(p.unit)}</span></label><span class="hwq">数量<input type="number" min="1" step="1" value="${p.qty||1}" data-hwq="${p.id}"></span></div>`).join("")||`<div style="color:#6b7280">硬件库为空，请先到「硬件库」新增。</div>`;
 $("#genPolicies").innerHTML=db.policies.map(p=>`<label class="chk"><input type="checkbox" class="gpol" value="${p.id}"><span class="n">${esc(p.name)}</span><span class="m">${esc(p.org)} · ${esc(p.date)}</span></label>`).join("")||`<div style="color:#6b7280">政策库为空，请先到「政策资料库」新增。</div>`;
 const curF=$("#fFormat").value;$("#fFormat").innerHTML=`<option value="">不套用（默认样式）</option>`+db.formats.map(f=>`<option value="${f.id}">${esc(f.name)}</option>`).join("");if(curF)$("#fFormat").value=curF;
 const curK=$$(".gskill:checked").map(c=>c.value);
 $("#genSkills").innerHTML=db.skills.map(k=>`<label class="chk"><input type="checkbox" class="gskill" value="${k.id}" ${curK.includes(k.id)?"checked":""}><span class="n">${esc(k.name)}</span><span class="m">${esc(k.desc||"")}</span></label>`).join("")||`<div style="color:#6b7280">技能库为空，请到「🧩 Skill 技能库」新建或导入。</div>`;
 syncSkillDesc();
 autoMatchProducts();
 autoMatchPolicies();
}
function syncSkillDesc(){const ks=$$(".gskill:checked").map(c=>db.skills.find(x=>x.id===c.value)).filter(Boolean);$("#skillDesc").textContent=ks.length?`已选 ${ks.length} 项技能：${ks.map(k=>k.name).join("、")}（提示词将注入生成指令）`:"未勾选技能，可到「Skill 技能库」新建或导入。";}
function syncLlmUi(){$("#llmProvider").value=db.llm.provider||"deepseek";$("#llmBase").value=db.llm.baseUrl||"";$("#llmModel").value=db.llm.model||"";$("#llmKey").value=db.llm.key||"";syncModelList();}
const MODEL_HINTS={deepseek:["deepseek-chat（对话模型，性价比高）","deepseek-reasoner（深度推理）"],qwen:["qwen-plus（均衡推荐）","qwen-turbo（快速）","qwen-max（最强）","qwen-long（长文本）"],doubao:["doubao-1-5-pro-32k（推荐）","doubao-1-5-lite-32k（快速）","doubao-seed-1-6-250615"],custom:[]};
function syncModelList(){$("#modelList").innerHTML=(MODEL_HINTS[db.llm.provider]||[]).map(m=>`<option value="${m.split("（")[0]}">${m}</option>`).join("");}
function renderAll(){renderTodos();renderProducts();renderHardware();renderProposals();renderPolicies();renderFormats();renderSkillHub();renderGen();syncLlmUi();}

/* ---------- 弹窗与表单 ---------- */
function openModal(html){$("#modalBox").innerHTML=html;$("#mask").hidden=false;}
function closeModal(){$("#mask").hidden=true;}
$("#mask").addEventListener("click",e=>{if(e.target.id==="mask")closeModal();});
async function parseFile(f){if(/\.docx$/i.test(f.name)){if(!window.mammoth)throw new Error("mammoth 未加载（需联网）");return{html:(await mammoth.convertToHtml({arrayBuffer:await f.arrayBuffer()})).value,text:(await mammoth.extractRawText({arrayBuffer:await f.arrayBuffer()})).value};}
 if(/\.pdf$/i.test(f.name)){if(!window.pdfjsLib)throw new Error("PDF 解析组件未加载（需联网）");pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";const doc=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;let text="";for(let i=1;i<=doc.numPages;i++){const pg=await doc.getPage(i);const c=await pg.getTextContent();text+=c.items.map(it=>it.str).join("")+"\n";}return{html:esc(text).replace(/\r?\n/g,"<br>"),text};}
 if(/\.(xlsx|xls|csv)$/i.test(f.name)){if(!window.XLSX)throw new Error("Excel 解析组件未加载（需联网）");const wb=XLSX.read(await f.arrayBuffer(),{type:"array"});const text=wb.SheetNames.map(n=>"【工作表："+n+"】\n"+XLSX.utils.sheet_to_txt(wb.Sheets[n])).join("\n");return{html:esc(text).replace(/\r?\n/g,"<br>"),text};}
 const t=await f.text();return{html:esc(t).replace(/\r?\n/g,"<br>"),text:t};}
function bindFileRich(btnId,inputId,rteId){$("#"+btnId).onclick=()=>$("#"+inputId).click();
 $("#"+inputId).onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const r=await parseFile(f);$("#"+rteId).innerHTML+=r.html;toast("文件内容已导入（保留表格等原格式）");}catch(err){alert("解析失败："+err.message);}e.target.value="";};}
function bindFile(btnId,inputId,taId){$("#"+btnId).onclick=()=>$("#"+inputId).click();
 $("#"+inputId).onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const r=await parseFile(f);const ta=$("#"+taId);ta.value=(ta.value?ta.value+"\n":"")+r.text;toast("文件内容已填入");}catch(err){alert("解析失败："+err.message);}e.target.value="";};}
function libForm(id){
 const p=id?db.products.find(x=>x.id===id):{name:"",cat:"",price:"",params:"",points:""};
 const catSel=new Set(String(p.cat||"").split("、").filter(Boolean));
 const otherCats=[...catSel].filter(c=>!CATS.includes(c));
 const paramsHtml=/<[a-z][\s\S]*>/i.test(p.params)?p.params:esc(p.params).replace(/\r?\n/g,"<br>");
 openModal(`<h3>${id?"编辑":"新增"}产品</h3>
 <div class="field"><label>产品名称 *</label><input id="mName" value="${esc(p.name)}"></div>
 <div class="field"><label>领域/类别（可多选）</label><div class="chklist">${CATS.map(c=>`<label class="chk"><input type="checkbox" class="mcat" value="${c}" ${catSel.has(c)?"checked":""}><span class="n">${c}</span></label>`).join("")}<label class="chk"><input type="checkbox" id="mCatOther" ${otherCats.length?"checked":""}><span class="n">其他</span></label></div><input id="mCatCustom" placeholder="自定义类别，多个用、分隔" value="${esc(otherCats.join("、"))}" style="${otherCats.length?"":"display:none;"}margin-top:6px"></div>
 <div class="field"><label>参考报价</label><input id="mPrice" value="${esc(p.price)}" placeholder="如：28万/套"></div>
 <div class="field"><label>核心参数（20000 字以内，上传 Word 保留表格原格式）　<button class="btn btn-sm" type="button" id="mUp1">📎 上传 txt/md/docx 导入</button><input type="file" id="mFile1" accept=".txt,.md,.docx" hidden></label><div class="rte" id="mParams" contenteditable="true">${paramsHtml}</div><div style="font-size:11px;color:#6b7280;margin-top:4px">当前 <span id="mCnt">0</span> / 20000 字</div></div>
 <div class="field"><label>卖点　<button class="btn btn-sm" type="button" id="mUp2">📎 上传 txt/md/docx 填入</button><input type="file" id="mFile2" accept=".txt,.md,.docx" hidden></label><textarea id="mPoints">${esc(p.points)}</textarea></div>
 <div class="acts"><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 const cnt=()=>{$("#mCnt").textContent=$("#mParams").innerText.length;};cnt();
 $("#mParams").addEventListener("input",cnt);
 $("#mCatOther").onchange=e=>{$("#mCatCustom").style.display=e.target.checked?"":"none";};
 bindFileRich("mUp1","mFile1","mParams");bindFile("mUp2","mFile2","mPoints");
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{const name=$("#mName").value.trim();if(!name){alert("请填写名称");return;}
  const rte=$("#mParams");if(rte.innerText.length>20000){alert("核心参数超过 20000 字，请精简");return;}
  const cats=$$(".mcat").filter(c=>c.checked).map(c=>c.value);if($("#mCatOther").checked){const cv=$("#mCatCustom").value.trim();cats.push(...(cv?cv.split(/[、,，]/).map(s=>s.trim()).filter(Boolean):["其他"]));}
  const data={name,cat:cats.join("、")||"其他",price:$("#mPrice").value.trim(),params:rte.innerHTML,points:$("#mPoints").value.trim()};
  if(id)Object.assign(p,data);else db.products.push({id:uid(),...data});
  persist();closeModal();renderAll();toast("已保存（外部卡片自动提炼 50 字摘要）");};
}
function hwForm(id){
 const p=id?db.hardware.find(x=>x.id===id):{name:"",model:"",unit:"套",price:""};
 openModal(`<h3>${id?"编辑":"新增"}硬件</h3>
 <div class="field"><label>设备名称 *</label><input id="mName" value="${esc(p.name)}"></div>
 <div class="field"><label>型号规格</label><input id="mModel" value="${esc(p.model)}" placeholder="如：i5-12400/16G/512G SSD"></div>
 <div class="field"><label>单位</label><input id="mUnit" value="${esc(p.unit)}" placeholder="套 / 台 / 批"></div>
 <div class="field"><label>单价（万元）</label><input id="mPrice" type="number" step="0.01" min="0" value="${esc(p.price)}"></div>
 <div style="color:#6b7280;font-size:12px;margin:-4px 0 10px">数量无需在此填写：在方案生成台勾选该硬件时逐项输入，预算明细表金额按“单价×数量”自动计算。</div>
 <div class="acts"><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{const name=$("#mName").value.trim();if(!name){alert("请填写设备名称");return;}
  const data={name,model:$("#mModel").value.trim(),unit:$("#mUnit").value.trim()||"套",price:parseFloat($("#mPrice").value)||0};
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
/* ---------- 推荐技能（移植自其他软件，一键安装） ---------- */
const EXTRA_SKILLS=[
 {name:"WPS AI · 文档排版助手",desc:"移植自 WPS AI：生成后输出 Word 排版执行清单",
  prompt:"你是文档排版助手。用户生成方案初稿后，请根据套用的格式规范，逐条输出《Word 排版执行清单》：各级标题的字体/字号/加粗/居中设置、正文首行缩进与行距、表格样式，让用户在 Word 里按清单逐项设置即可交付。"},
 {name:"标书合规审查专家",desc:"移植自标书审查软件：逐条核查初稿合规性",
  prompt:"你是标书合规审查专家。请以评审视角逐条审查当前初稿：①政策引用是否带文号、文号是否真实存在；②预算合计与分项是否一致；③产品参数描述是否有过度承诺；④未提供的学校信息是否用了占位符。逐条列出问题与修改建议，不确定的明确标注不确定。"},
 {name:"Coze 方案生成 Bot",desc:"移植自 Coze 智能体：先提纲后分章生成的工作流",
  prompt:"你是“方案大师”Bot，按以下工作流执行：第一步先输出章节提纲（不写正文）等待用户确认；第二步用户确认后逐章生成，每章先引政策依据、再述建设内容、最后列该章预算；第三步全篇完成后输出预算汇总表。"},
 {name:"Dify 知识库问答约束",desc:"移植自 Dify 知识库节点：只依据已给材料回答",
  prompt:"回答时优先引用用户提供的材料（附件、已勾选的政策、产品参数）；材料中找不到依据时，明确说明“知识库中未找到”，不得自行杜撰数据或政策文号。"}
];
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
  persist();closeModal();renderGen();renderSkillHub();toast("已保存");};
}
function skillMgr(){
 const extra=EXTRA_SKILLS.map((k,i)=>db.skills.some(s=>s.name===k.name)?"":`<div class="chk"><span class="n" style="flex:1">${k.name}<span class="m" style="margin-left:8px">${k.desc}</span></span><button class="btn btn-sm" data-install="${i}">安装</button></div>`).join("");
 openModal(`<h3>⚙ 技能管理</h3>
 <p class="hint" style="margin:0 0 8px">技能=附加到生成的专业指令，生成时所选技能的提示词会一并发给大模型。</p>
 ${db.skills.map(k=>`<div class="chk"><span class="n" style="flex:1">${esc(k.name)}<span class="m" style="margin-left:8px">${esc(k.desc)}</span></span>
 <button class="btn btn-sm" data-act="edit" data-kind="skill" data-id="${k.id}">✎</button>
 <button class="btn btn-sm btn-danger" data-act="del" data-kind="skill" data-id="${k.id}">🗑</button></div>`).join("")||EMPTY}
 <h3 style="margin-top:14px">📥 推荐技能（移植自其他软件，一键安装）</h3>
 ${extra||`<p class="hint">推荐技能已全部安装 ✔</p>`}
 <p class="hint" style="margin-top:8px">也可到顶部「🧩 Skill 技能库」页签新建/导入技能：支持 .json（含 name/prompt）、.md、.txt（整文作为提示词）。</p>
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
 <div class="field"><label>可复用内容（正文摘录，上传保留原格式）　<button class="btn btn-sm" type="button" id="mUp1">📎 上传 txt/md/docx（自动识别标题/类型/客户学校，可再调整）</button><input type="file" id="mFile1" accept=".txt,.md,.docx" hidden></label><div class="rte" id="mContent" contenteditable="true" style="min-height:150px">${/<[a-z][\s\S]*>/i.test(p.content)?p.content:esc(p.content).replace(/\r?\n/g,"<br>")}</div></div>
 <div class="acts"><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 $("#mUp1").onclick=()=>$("#mFile1").click();
 $("#mFile1").onchange=async e=>{const f=e.target.files[0];if(!f)return;
  try{const r=await parseFile(f);
   const lines=r.text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
   if(lines.length){const t=lines[0].replace(/^[#\s]+/,"").slice(0,60);if(t)$("#mTitle").value=t;}
   $("#mType").value=/建设方案/.test(r.text)?"建设方案":"项目申报书";
   const m=r.text.match(/([\u4e00-\u9fa5A-Za-z]{1,12})(大学|学院|学校|技师学院)/);
   if(m){let n=m[1];for(;;){const mm=n.match(/^(的|于|在|为|给|由|与|和|面向|委托|联合|项目|及|或|本|该|此|我|拟|将|对)/);if(!mm||n.length-mm[1].length<2)break;n=n.slice(mm[1].length);}$("#mClient").value=n+m[2];}
   const y=(r.text.match(/(20\d{2})\s*年/)||[])[1];if(y)$("#mYear").value=y;
   $("#mContent").innerHTML+=($("#mContent").innerHTML?"<br>":"")+r.html;toast("已导入并自动识别标题/类型/客户学校，可自行调整");}catch(err){alert("解析失败："+err.message);}e.target.value="";};
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{const title=$("#mTitle").value.trim();if(!title){alert("请填写标题");return;}
  const data={title,type:$("#mType").value,client:$("#mClient").value.trim(),year:$("#mYear").value.trim(),keypoints:$("#mKeys").value.trim(),content:$("#mContent").innerHTML.trim()};
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
 <div class="field"><label>正文内容（上传保留原格式）　<button class="btn btn-sm" type="button" id="mUp1">📎 上传 txt/md/docx（自动识别名称/单位/时间/关键词，可再调整）</button><input type="file" id="mFile1" accept=".txt,.md,.docx" hidden></label><div class="rte" id="mSum" contenteditable="true" style="min-height:150px">${/<[a-z][\s\S]*>/i.test(p.summary)?p.summary:esc(p.summary).replace(/\r?\n/g,"<br>")}</div></div>
 <div class="field"><label>适用场景</label><input id="mUse" value="${esc(p.usage)}" placeholder="如：建设背景引用"></div>
 <div class="acts"><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 $("#mUp1").onclick=()=>$("#mFile1").click();
 $("#mFile1").onchange=async e=>{const f=e.target.files[0];if(!f)return;
  try{const r=await parseFile(f);const t=r.text;
   const lines=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
   if(lines.length&&!$("#mName").value.trim())$("#mName").value=lines[0].replace(/^[#\s]+/,"").slice(0,80);
   const om=t.match(/[\u4e00-\u9fa5]{0,18}(?:人民政府|教育部|委员会|办公厅|教育厅|财政局|发展改革委|局)(?=[\s：:，。、\d]|$)/);if(om&&!$("#mOrg").value.trim())$("#mOrg").value=om[0];
   const dm=t.match(/\d{4}\s*年\s*\d{1,2}\s*月(?:\s*\d{1,2}\s*日)?/);if(dm&&!$("#mDate").value.trim())$("#mDate").value=dm[0].replace(/\s+/g,"");
   if(!$("#mKeys").value.trim()){const ws=lines[0].replace(/关于|印发|通知|意见|办法|方案|规划|决定|函|的/g," ").split(/[、，。\s《》（）()·]+/).filter(w=>/[\u4e00-\u9fa5]{2,}/.test(w)&&w.length<=20).map(w=>w.replace(/[^\u4e00-\u9fa5]/g,"").slice(0,8)).filter(w=>w.length>=2).slice(0,5);if(ws.length)$("#mKeys").value=ws.join("、");}
   if(!$("#mUse").value.trim())$("#mUse").value=/职业教育|职业院校/.test(t)?"职教/实训类项目建设背景与立项依据引用":"建设背景与政策依据章节引用";
   $("#mSum").innerHTML+=($("#mSum").innerHTML?"<br>":"")+r.html;toast("已导入正文并自动识别名称/单位/时间/关键词/适用场景，可自行调整");}catch(err){alert("解析失败："+err.message);}e.target.value="";};
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{const name=$("#mName").value.trim();if(!name){alert("请填写政策名称");return;}
  const data={name,org:$("#mOrg").value.trim(),date:$("#mDate").value.trim(),keywords:$("#mKeys").value.trim(),summary:$("#mSum").innerHTML.trim(),usage:$("#mUse").value.trim()};
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
/* ---------- Skill 技能库页 ---------- */
function renderSkillHub(){
 if(!$("#skillGrid"))return;
 $("#skillCnt").textContent=db.skills.length?"（"+db.skills.length+"）":"";
 $("#skillGrid").innerHTML=db.skills.map(k=>`<div class="card item" style="margin:0"><b>${esc(k.name)}</b>${k.seed?" <span class='m'>预置</span>":""}<span class="m">${esc(k.desc||"")}</span><div style="font-size:12px;color:#4b5563;margin:8px 0;line-height:1.7;max-height:72px;overflow:auto">${esc(k.prompt||"").slice(0,200)}${(k.prompt||"").length>200?"…":""}</div><div class="acts" style="justify-content:flex-end"><button class="btn btn-sm" data-act="edit" data-kind="skill" data-id="${k.id}">✎ 编辑</button><button class="btn btn-sm btn-danger" data-act="del" data-kind="skill" data-id="${k.id}">🗑 删除</button></div></div>`).join("")||EMPTY;
}
$("#btnSkillCreate").onclick=()=>{const name=$("#skName").value.trim();if(!name){alert("请填写技能名称");return;}
 db.skills.push({id:uid(),name,desc:$("#skDesc").value.trim(),prompt:$("#skPrompt").value.trim()});persist();
 $("#skName").value="";$("#skDesc").value="";$("#skPrompt").value="";renderSkillHub();renderGen();toast("技能已保存，可在方案生成台第 8 步套用");};
$("#btnSkillImport").onclick=()=>$("#skillFile").click();
$("#skillFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;
 try{if(/\.json$/i.test(f.name)){const d=JSON.parse(await f.text());if(!d||!d.name||!d.prompt)throw new Error("JSON 需含 name 与 prompt 字段");db.skills.push({id:uid(),name:d.name,desc:d.desc||"",prompt:d.prompt});}
 else{const t=await f.text();db.skills.push({id:uid(),name:f.name.replace(/\.[^.]+$/,""),desc:"外部导入技能",prompt:t});}
 persist();renderGen();renderSkillHub();toast("技能已导入");}catch(err){alert("导入失败："+err.message);}e.target.value="";};
function syncFundOther(){const on=$$(".gfund").some(c=>c.checked&&c.value==="其他");$("#fundOther").style.display=on?"block":"none";}
const KIND={product:"products",hardware:"hardware",proposal:"proposals",policy:"policies",format:"formats",skill:"skills"};
document.addEventListener("click",e=>{
 const ib=e.target.closest("button[data-install]");
 if(ib){const k=EXTRA_SKILLS[+ib.dataset.install];if(k){db.skills.push({id:uid(),name:k.name,desc:k.desc,prompt:k.prompt});persist();renderGen();skillMgr();toast("已安装技能："+k.name);}return;}
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
 else if(e.target.classList.contains("gp")){prodUser.set(e.target.value,e.target.checked);autoMatchPolicies();}
 else if(e.target.classList.contains("gfund"))syncFundOther();
 else if(e.target.classList.contains("gskill"))syncSkillDesc();
});
$("#fMajor").addEventListener("input",()=>{autoMatchProducts();autoMatchPolicies();});
$("#btnPolMatch").onclick=()=>{polUser.clear();prodUser.clear();autoMatchProducts();autoMatchPolicies();toast("已按专业重新智能匹配产品与政策");};
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
/* 检测模型：调用服务商 /models 接口，确认实际配置的模型与可用模型清单 */
$("#btnTestModel").onclick=async()=>{
 const btn=$("#btnTestModel");btn.disabled=true;btn.textContent="⏳ 检测中…";
 const base=(db.llm.baseUrl||"").replace(/\/+$/,"");
 const model=(db.llm.model||"").trim();
 try{
  if(!base)throw new Error("请先填写 API 接口地址");
  const res=await fetch(base+"/models",{headers:{"Authorization":"Bearer "+(db.llm.key||"")}});
  if(!res.ok)throw new Error(`HTTP ${res.status}：接口不可达或 Key 无效（${(await res.text().catch(()=>"" )).slice(0,120)}）`);
  const j=await res.json();const ids=(j.data||[]).map(m=>m.id).filter(Boolean).sort();
  if(model&&ids.includes(model)){openModal(`<h3>✅ 模型检测成功</h3><p style="margin-bottom:8px">您当前配置并实际调用的模型为：<b style="color:#1d4fa8">${esc(model)}</b></p><p class="hint" style="margin-bottom:8px">该模型名已在服务商返回的可用模型清单中核验存在。模型版本以「模型名称」输入框为准，文件名/备注不影响实际调用。</p><div class="rte" style="max-height:260px">该服务商共 ${ids.length} 个可用模型：<br>${ids.map(esc).join("<br>")}</div><div class="acts"><button class="btn btn-primary" id="mOk">关闭</button></div>`);$("#mOk").onclick=closeModal;}
  else if(ids.length){openModal(`<h3>⚠ 未在模型清单中找到「${esc(model)}」</h3><p class="hint" style="margin-bottom:8px">请把「模型名称」改为下方清单中的准确名称后重新检测（点击名称可自动填入）：</p><div class="rte" style="max-height:280px">${ids.map(m=>`<a href="#" data-m="${esc(m)}" style="color:#1d4fa8;display:block;margin:2px 0">${esc(m)}</a>`).join("")}</div><div class="acts"><button class="btn btn-primary" id="mOk">关闭</button></div>`);
   $("#modalBox").querySelectorAll("a[data-m]").forEach(a=>a.onclick=e=>{e.preventDefault();$("#llmModel").value=a.dataset.m;db.llm.model=a.dataset.m;persist();toast("已填入模型名称，可再次检测");});
   $("#mOk").onclick=closeModal;}
  else{toast("清单为空，无法核验；将直接尝试调用当前模型名");}
 }catch(err){alert("模型检测失败："+err.message);}
 finally{btn.disabled=false;btn.textContent="🔍 检测模型";};
};

/* ---------- 生成：提示词 + 流式调用 + 本地模板 ---------- */
function parseWan(s){const m=String(s||"").match(/(\d+(?:\.\d+)?)\s*万/);if(m)return parseFloat(m[1]);const m2=String(s||"").replace(/[,，]/g,"").match(/(\d{4,7})(?!\d)/);return m2?Math.round(parseInt(m2,10)/10000):0;}
function wrapName(n){return /[《〈]/.test(n)?n:"《"+n+"》";}
function fmtSpecText(f){if(!f)return "";const L=FMT_ELS.map(([k,l])=>{const s=f.styles[k]||{};return `${l}：${s.font} ${s.size}${s.bold?" 加粗":""} ${ALIGNS.find(a=>a[0]===s.align)?.[1]||""} 首行缩进${s.indent||0}字符 行距${s.line} 段前段后${s.space||0}pt`;});return `结构格式：\n${f.structure||""}\n各级格式：${L.join("；")}`;}
function buildMessages(project,school,major,type,prods,hw,pols,tpls,words,funds,skills,fmt,tplText){
 const rules=["使用正式书面语，标题层级用“一、/（一）/1./（1）/①”五级；",
 "“建设背景与政策依据”部分必须逐条引用用户勾选的政策（含文件名与文号），不得编造任何政策文件名或文号；",
 "“建设内容”部分必须逐款融入用户勾选的产品（名称、核心参数、卖点），参数不得夸大或虚构；",
 "“预算”部分仅写资金构成、使用管理与价格依据说明，不要自行绘制预算明细表，系统会根据勾选产品与硬件自动插入标准《项目预算明细表》（含明细与合计，合计=分项之和）；",
 "正文中不要自行撰写“附件”章节，系统会在文末自动附上所选产品核心参数表格；",
 "对可推断的一般性内容（政策背景、行业趋势、常规建设思路等）可直接补全展开，尽量不留占位；但学校成立时间、专业开设年份、在校生/专业学生人数、教师人数、现有设备清单等确定性数据一律禁止编造，保留“（待核实：请学校提供×××）”字样，供用户后续确认；"];
 if(tplText)rules.push(`用户上传了现有文件模版，内容摘录如下，请从中提取项目背景、学校情况、建设需求等可用信息并融入正文：\n"""\n${tplText.slice(0,5000)}\n"""`);
 if(db.train&&db.train.style&&db.train.on)rules.push(`以下写作规范由历史方案自动训练总结而来，请严格遵守：${db.train.style.slice(0,1500)}`);
 if(words.total||words.chapter||words.max)rules.push(`字数要求：全文不少于 ${words.total} 字${words.max?`，且全文不超过 ${words.max} 字（请在该上限内合理分配各章节篇幅）`:""}，且“一、/二、…”每个章节不少于 ${words.chapter} 字，论证充分展开；`);
 if(hw.length)rules.push("用户勾选了硬件配置，须在“建设内容”中单列硬件小节（设备名称/型号规格/单位/单价/数量/金额），并纳入预算明细；");
 if(funds.length)rules.push(`项目资金来源为：${funds.join("、")}；须在预算章节说明资金构成与使用管理；`);
 if(fmt)rules.push(`文档格式须符合「${fmt.name}」：${fmtSpecText(fmt).replace(/\n/g," ")}`);
 skills.forEach(k=>{if(k&&k.prompt)rules.push(`技能要求（${k.name}）：${k.prompt}`);});
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
 L.push(...budgetTableText(prods,hw).split("\n").filter(Boolean));
 if(funds.length)L.push(`资金来源：${funds.join("、")}。`);
 L.push("");L.push("五、组织实施与进度安排");
 L.push("按“方案论证→采购招标→部署调试→试运行”四阶段推进，明确月份与责任人。");
 L.push("");L.push("六、预期效益分析");
 L.push("从人才培养、学科发展、教学改革、社会服务、竞赛成果等维度展开（建议至少 4 个维度）。");
 L.push("");L.push("七、保障措施");
 L.push("管理机制、管理队伍、环境条件、资金筹措与政府采购合规保障。");
 if(words.total||words.chapter){L.push("");L.push(`（字数要求：整体 ≥${words.total} 字${words.max?` 且 ≤${words.max} 字`:""}、每章节 ≥${words.chapter} 字；在 Word 中完善时请按此扩充。）`);}
 L.push(appendixText(prods));
 return L.join("\n");
}
/* 文末附件章节：所选产品核心参数按表格原样呈现 */
/* 项目预算明细表：根据勾选产品+硬件程序化生成（明细+合计） */
function budgetTableText(prods,hw){
 if(!prods.length&&!hw.length)return "";
 const rows=[];let i=1,total=0;
 prods.forEach(p=>{const pr=parseWan(p.price);rows.push(`| ${i++} | ${p.name} | 软件平台 | 套 | ${pr||"—"} | 1 | ${pr||"—"} | 软件产品，含部署与培训 |`);total+=pr||0;});
 hw.forEach(h=>{const a=parseFloat(h.amount)||0;rows.push(`| ${i++} | ${h.name} | ${h.model} | ${h.unit} | ${h.price} | ${h.qty} | ${a} | 硬件设备 |`);total+=a;});
 total=Math.round(total*100)/100;
 return ["","表1 项目预算明细表（单位：万元）","| 序号 | 项目名称 | 型号规格 | 单位 | 单价 | 数量 | 金额 | 备注 |",...rows,`| 合计 | — | — | — | — | — | ${total} | 合计等于分项之和，最终以正式报价为准 |`,""].join("\n");
}
/* 将预算明细表插入预算章节标题后；找不到章节则放在附件前/文末 */
function insertBudgetTable(text,prods,hw){
 const tbl=budgetTableText(prods,hw);if(!tbl)return text;
 const lines=text.split(/\r?\n/);
 let idx=lines.findIndex(l=>/^[一二三四五六七八九十]+、/.test(l)&&/资金预算|预算与用途|经费预算|预算明细/.test(l));
 if(idx<0)idx=lines.findIndex(l=>/^[一二三四五六七八九十]+、/.test(l)&&/预算/.test(l));
 if(idx>=0){lines.splice(idx+1,0,...tbl.split("\n").filter(Boolean));return lines.join("\n");}
 const ai=lines.findIndex(l=>l.trim()==="附件");
 if(ai>=0){lines.splice(ai,0,...tbl.split("\n").filter(Boolean));return lines.join("\n");}
 return text+tbl;
}
function html2mdLines(html){
 const doc=new DOMParser().parseFromString(html,"text/html");const out=[];
 const walk=el=>{for(const n of el.children){const tag=n.tagName.toLowerCase();
  if(tag==="table"){n.querySelectorAll("tr").forEach(tr=>{out.push("| "+[...tr.querySelectorAll("td,th")].map(c=>(c.innerText||"").trim().replace(/\s+/g," ")).join(" | ")+" |");});out.push("");}
  else if(["p","div","li","h1","h2","h3","h4","h5","h6","blockquote","pre"].includes(tag)){if(n.querySelector("table"))walk(n);else{const t=(n.innerText||"").trim();if(t)out.push(t);}}
  else if(["ul","ol","section","article","body"].includes(tag))walk(n);
  else{const t=(n.innerText||"").trim();if(t)out.push(t);}}};
 if(doc.body.children.length)walk(doc.body);else{const t=(doc.body.innerText||"").trim();if(t)out.push(...t.split(/\r?\n/));}
 return out;
}
function paramsToLines(params){return /<[a-z][\s\S]*>/i.test(params)?html2mdLines(params):textOf(params).trim().split(/\r?\n/);}
function appendixText(prods){
 if(!prods.length)return "";
 const L=["","附件"];const zh="一二三四五六七八九十";
 prods.forEach((p,i)=>{L.push(`附件${zh[i]||i+1}：${p.name}——核心参数`);L.push("");const lines=paramsToLines(p.params).filter((l,j,a)=>l.trim()||((a[j-1]||"").trim()&&j<a.length-1));L.push(...(lines.length?lines:["（该产品核心参数为空，请到产品资料库补充）"]));L.push("");});
 return "\n"+L.join("\n");
}
function gatherGen(){
 return{
  project:$("#fProject").value.trim()||"（未命名项目）",
  school:$("#fSchool").value.trim()||"（学校待补充）",
  major:$("#fMajor").value.trim(),
  type:$("#fType").value,
  tpls:$$(".gtpl").filter(c=>c.checked).map(c=>db.proposals.find(p=>p.id===c.value)).filter(Boolean),
  prods:$$(".gp").filter(c=>c.checked).map(c=>db.products.find(p=>p.id===c.value)).filter(Boolean),
  hw:$$(".ghw").filter(c=>c.checked).map(c=>{const rec=db.hardware.find(p=>p.id===c.value);if(!rec)return null;const el=document.querySelector(`input[data-hwq="${c.value}"]`);const q=Math.max(1,parseFloat(el&&el.value)||1);return{...rec,qty:q,amount:Math.round((parseFloat(rec.price)||0)*q*100)/100};}).filter(Boolean),
  pols:$$(".gpol").filter(c=>c.checked).map(c=>db.policies.find(p=>p.id===c.value)).filter(Boolean),
  funds:$$(".gfund").filter(c=>c.checked).map(c=>c.value==="其他"?(($("#fundOther").value.trim()?"其他（"+$("#fundOther").value.trim()+"）":"其他")):c.value),
  words:{total:parseInt($("#fWordsTotal").value,10)||0,max:parseInt($("#fWordsMax")?$("#fWordsMax").value:0,10)||0,chapter:parseInt($("#fWordsChapter").value,10)||0},
  fmt:db.formats.find(f=>f.id===$("#fFormat").value)||null,
  skills:$$(".gskill:checked").map(c=>db.skills.find(k=>k.id===c.value)).filter(Boolean),
  tplText:tplFiles.map(f=>f.text).join("\n\n")};
}
$("#btnGen").onclick=async()=>{
 const g=gatherGen();const ta=$("#genResult");
 if(!db.llm.key){ta.value=localDraft(g.project,g.school,g.type,g.prods,g.hw,g.pols,g.words,g.funds);toast("未配置 API Key，已用本地模板拼装框架");return;}
 const btn=$("#btnGen");btn.disabled=true;btn.textContent="⏳ 生成中…";ta.value="";
 try{await streamChat(buildMessages(g.project,g.school,g.major,g.type,g.prods,g.hw,g.pols,g.tpls,g.words,g.funds,g.skills,g.fmt,g.tplText),t=>{ta.value+=t;ta.scrollTop=ta.scrollHeight;});
  ta.value=insertBudgetTable(ta.value,g.prods,g.hw);ta.value+=appendixText(g.prods);updateChecklist();toast("生成完成（已自动插入预算明细表与产品参数附件）");}
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
  if(/^附件/.test(l))return out.push(`<h2 style="${S("h1")}">${l}</h2>`);
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

/* ---------- 现有文件模版上传（自动补充项目基本信息） ---------- */
let tplFiles=[];
function renderTplFiles(){$("#tplFiles").innerHTML=tplFiles.map((f,i)=>`<span class="chip">📄 ${esc(f.name)}（${f.text.length}字）<button data-tplrm="${i}">✕</button></span>`).join("");}
$("#tplFiles").addEventListener("click",e=>{const b=e.target.closest("button[data-tplrm]");if(b){tplFiles.splice(+b.dataset.tplrm,1);renderTplFiles();}});
function autofillFromTpl(t){
 const pn=t.match(/项目名称\s*[:：]\s*([^\n\r]{4,60})/);if(pn)$("#fProject").value=pn[1].trim();
 else{const ls=t.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);if(ls.length)$("#fProject").value=ls[0].replace(/^[#\s]+/,"").slice(0,60);}
 const m=t.match(/([\u4e00-\u9fa5A-Za-z]{1,12})(大学|学院|学校|技师学院)/);
 if(m){let n=m[1];for(;;){const mm=n.match(/^(的|于|在|为|给|由|与|和|面向|委托|联合|项目|及|或|本|该|此|我|拟|将|对)/);if(!mm||n.length-mm[1].length<2)break;n=n.slice(mm[1].length);}$("#fSchool").value=n+m[2];}
 for(const c of CATS){if(t.includes(c)){$("#fMajor").value=c;break;}}
 if(/建设方案/.test(t))$("#fType").value="建设方案";else if(/报价|投标/.test(t))$("#fType").value="报价方案";
 $$(".gfund").forEach(cb=>{if(cb.value!=="其他"&&t.includes(cb.value))cb.checked=true;});syncFundOther();
 autoMatchProducts();autoMatchPolicies();
}
$("#btnTplUp").onclick=()=>$("#tplFile").click();
$("#tplFile").onchange=async e=>{const files=[...e.target.files];if(!files.length)return;
 for(const f of files){try{const r=await parseFile(f);tplFiles.push({name:f.name,text:r.text.slice(0,20000)});}catch(err){alert("解析失败："+f.name+"："+err.message);}}
 e.target.value="";renderTplFiles();autofillFromTpl(tplFiles.map(x=>x.text).join("\n"));toast("已检索文件并自动补充项目基本信息，可自行调整");};

/* ---------- 修订对话框待确认清单 / 导出对话 Word ---------- */
function updateChecklist(){
 const el=$("#chatChecklist");if(!el)return;
 const lines=($("#genResult").value||"").split(/\r?\n/).filter(l=>/待补充|待核实/.test(l)).map(l=>l.trim()).slice(0,20);
 el.innerHTML=lines.length?`<div style="font-size:12px;color:#374151;margin-bottom:6px"><b>📋 待确认清单</b>（大模型标注/自动补写的部分，点击可快速下达指示） <button class="btn btn-sm" id="btnCkRefresh" type="button">🔄 刷新</button></div>`+lines.map((l,i)=>`<div class="chip" style="cursor:pointer;max-width:100%" data-ck="${i}">${esc(l.length>60?l.slice(0,60)+"…":l)}</div>`).join("")+`<div style="height:6px"></div>`:"";
 el.querySelectorAll("[data-ck]").forEach(c=>c.onclick=()=>{$("#chatInput").value="请处理以下内容："+lines[+c.dataset.ck]+"　（如是确定性数据请标注待学校提供，不要编造）";$("#chatInput").focus();});
 const rb=$("#btnCkRefresh");if(rb)rb.onclick=updateChecklist;
}
$("#btnChatWord").onclick=()=>{
 const bubs=$$("#chatLog .bub");if(!bubs.length){alert("暂无对话内容");return;}
 const html=bubs.map(b=>`<p style="margin:6px 0"><b>${b.classList.contains("u")?"我":"AI 助手"}：</b>${esc(b.textContent).replace(/\r?\n/g,"<br>")}</p>`).join("");
 const doc=`<html><head><meta charset="utf-8"><title>修订对话记录</title></head><body><h2>修订对话记录（${todayStr()}）</h2>${html}</body></html>`;
 const blob=new Blob(["\ufeff",doc],{type:"application/msword"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="修订对话记录_"+todayStr()+".doc";a.click();toast("对话已导出 Word");};

/* ---------- 方案文库：定时自动训练 ---------- */
db.train=db.train||{on:false,time:"09:00",freq:"daily",lastRun:0,style:"",logs:[]};
function trainModal(){
 const t=db.train;
 openModal(`<h3>🕒 定时自动训练（方案文库 → 大模型）</h3>
 <p class="hint" style="margin-bottom:8px">原理：定时把方案文库的历史方案交给大模型，自动总结《写作规范与风格要点》并在每次生成时注入指令，让输出越来越贴近您的体例与规范。（调用 API 的模型无法真正改权重，此为该场景下的标准做法）</p>
 <label class="chk"><input type="checkbox" id="trOn" ${t.on?"checked":""}><span class="n">启用定时训练（页面需保持打开）</span></label>
 <div class="field"><label>训练时间点</label><input id="trTime" type="time" value="${t.time||"09:00"}"></div>
 <div class="field"><label>频率</label><select id="trFreq"><option value="hourly" ${t.freq==="hourly"?"selected":""}>每小时</option><option value="daily" ${t.freq==="daily"?"selected":""}>每天</option><option value="weekly" ${t.freq==="weekly"?"selected":""}>每周</option></select></div>
 <div class="field"><label>已学写作规范（可手动微调）</label><textarea id="trStyle" style="min-height:100px">${esc(t.style||"")}</textarea></div>
 <div class="field"><label>训练记录</label><div class="hint" style="max-height:90px;overflow:auto">${(t.logs||[]).slice(-5).map(l=>esc(l)).join("<br>")||"暂无"}</div></div>
 <div class="acts"><button class="btn" id="trNow">⚡ 立即训练一次</button><button class="btn" id="mCancel">取消</button><button class="btn btn-primary" id="mOk">保存</button></div>`);
 $("#mCancel").onclick=closeModal;
 $("#mOk").onclick=()=>{db.train.on=$("#trOn").checked;db.train.time=$("#trTime").value;db.train.freq=$("#trFreq").value;db.train.style=$("#trStyle").value.trim();persist();closeModal();toast("训练设置已保存");};
 $("#trNow").onclick=async()=>{$("#trNow").disabled=true;$("#trNow").textContent="⏳ 训练中…";try{await runTrain();toast("训练完成，写作规范已更新");closeModal();}catch(err){alert("训练失败："+err.message);$("#trNow").disabled=false;$("#trNow").textContent="⚡ 立即训练一次";}};
}
async function runTrain(){
 if(!db.llm.key)throw new Error("请先在大模型配置中填写 API Key");
 const docs=db.proposals.slice(-6).map(p=>`《${p.title}》（${p.type}）要点：${p.keypoints||""}\n正文摘录：${textOf(p.content).slice(0,1200)}`).join("\n\n");
 if(!db.proposals.length)throw new Error("方案文库为空，请先添加历史方案再训练");
 let out="";await streamChat([{role:"system",content:"你是方案写作教练。请从用户的历史方案中总结《写作规范与风格要点》：章节结构习惯、政策引用方式、预算表述方式、语言风格、格式规范，输出不超过 800 字、逐条列出，直接输出内容。"},{role:"user",content:docs}],t=>{out+=t;});
 db.train.style=out.trim();db.train.lastRun=Date.now();db.train.logs.push(todayStr()+" "+new Date().toTimeString().slice(0,5)+" 训练完成（样本 "+db.proposals.length+" 份）");db.train.logs=db.train.logs.slice(-20);persist();
}
setInterval(()=>{const t=db.train;if(!t||!t.on||!db.llm.key)return;const now=new Date();const hm=String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0");
 const gap=t.freq==="hourly"?36e5:t.freq==="weekly"?7*864e5:864e5;
 if(Date.now()-(t.lastRun||0)<gap)return;
 if(t.freq==="hourly"||(t.time||"09:00")===hm){runTrain().then(()=>toast("🕒 自动训练完成，写作规范已更新")).catch(()=>{});}},60000);

renderAll();
$("#btnTrainPanel").onclick=trainModal;
renderTplFiles();
updateChecklist();
