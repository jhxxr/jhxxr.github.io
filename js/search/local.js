window.onload=()=>{let e,t=[];const n=document.getElementById("search-mask"),c=document.querySelector("#local-search .search-dialog"),s=()=>{utils.animateIn(n,"to_show 0.5s"),c.style.display="block",setTimeout((()=>{document.querySelector("#local-search .search-box-input").focus()}),100),document.addEventListener("keydown",(function e(t){"Escape"===t.code&&(o(),document.removeEventListener("keydown",e))})),i(),window.addEventListener("resize",i)},i=()=>{window.innerWidth<768&&c.style.setProperty("--search-height",window.innerHeight+"px")},o=()=>{utils.animateOut(c,"search_close .5s"),utils.animateOut(n,"to_hide 0.5s"),window.removeEventListener("resize",i)};n.addEventListener("click",o),utils.addEventListenerPjax(document.querySelector("#local-search .search-close-button"),"click",o);utils.addEventListenerPjax(document.querySelector("#search-button > .search"),"click",s),GLOBAL_CONFIG.rightside.enable&&document.getElementById("menu-search").addEventListener("click",(function(){rm.hideRightMenu(),s();let e=document.getElementsByClassName("search-box-input")[0],t=document.createEvent("HTMLEvents");t.initEvent("input",!0,!0),e.value=selectTextNow,e.dispatchEvent(t)}));let a="",l=0;const r=10;let d=[];function u(){const e=document.getElementById("search-results");document.getElementById("search-input").addEventListener("keydown",(function(n){13===n.keyCode&&(n.preventDefault(),e.innerHTML="",a=this.value.trim(),""!==a?(d=function(e){const n=new RegExp(e.split("").join(".*"),"i");return t.filter((e=>n.test(e.title)||n.test(e.content)))}(a),m(d,l),function(e){const t=Math.ceil(e/r),n=document.getElementById("search-pagination");n.innerHTML="";const c=document.createElement("ul");c.className="pagination-list";for(let e=0;e<t;e++){const t=document.createElement("li");t.className="pagination-item",t.textContent=e+1,e===l&&t.classList.add("select"),t.addEventListener("click",(function(){l=e,m(d,e),document.querySelectorAll(".pagination-item").forEach((function(e){e.classList.remove("select")})),t.classList.add("select")})),c.appendChild(t)}n.appendChild(c)}(d.length)):function(){const e=document.getElementById("search-results"),t=document.getElementById("search-pagination"),n=document.getElementById("search-tips");e.innerHTML="",t.innerHTML="",n.innerHTML=""}())}))}function m(e,t){const n=document.getElementById("search-results");n.innerHTML="";const c=document.getElementById("search-tips");c.innerHTML="";const s=t*r,i=s+r;if(!e.length){const e=document.createElement("span");return e.className="search-result-empty",e.textContent=GLOBAL_CONFIG.lang.search.empty.replace(/\$\{query}/,a),void n.appendChild(e)}e.slice(s,i).forEach((function(e){const t=document.createElement("li");t.className="search-result-item";const c=document.createElement("a");c.className="search-result-title",c.href=e.link;const s=function(e,t){const n=new RegExp(`(${t.split(" ").join("|")})`,"gi");return e.replace(n,"<em>$1</em>")}(e.title,a);c.innerHTML=s,t.appendChild(c),n.appendChild(t)}));const o=document.createElement("span");o.className="search-result-count",o.innerHTML=`共 <b>${e.length}</b> 条结果`,c.appendChild(o)}fetch("/search.xml").then((e=>e.text())).then((n=>{let c=(new DOMParser).parseFromString(n,"text/xml").getElementsByTagName("entry");for(let e=0;e<c.length;e++){let n=c[e],s=n.getElementsByTagName("title")[0].textContent,i=n.getElementsByTagName("url")[0].textContent,o=n.getElementsByTagName("content")[0].textContent;t.push({title:s,link:i,content:o})}e=lunr((function(){this.ref("link"),this.field("title",{boost:10}),this.field("content"),t.forEach((function(e){this.add(e)}),this)}))})).catch((e=>console.error("Error loading search data:",e))),u(),window.addEventListener("DOMContentLoaded",(e=>{u()}))};