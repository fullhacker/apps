/*
    Author: Ayo Ayco
    Email: ramon.aycojr@gmail.com
    Website: AyoAyco.com
    Blog: FullHacker.com
    Live: games.fullhacker.com/minesweeper
*/
import{StorageService}from"../services/storage.service.js";import{TimerService}from"../services/timer.service.js";import{LoggerService}from"../services/logger.service.js";import{levels}from"./levels.js";import{LeaderBoardService}from"../services/leader-board.service.js";const VERSION="0.3.4",MOBILE_BUSY_DELAY=250,PC_BUSY_DELAY=500,TEST_MODE=!1;export const Minesweeper=function(){const e=this,t=new StorageService,n=new TimerService,o=new LoggerService,i=new LeaderBoardService("mw-leaders","mw-all");let s=document.createElement("table");s.setAttribute("id","grid");let c=document.createElement("span"),r=document.createElement("span"),a=document.createElement("span"),l=document.createElement("div"),u=document.createElement("div");u.setAttribute("id","custom-wrapper");let d,m=document.getElementById("app"),f=document.createElement("div"),g=!1,p=!1,h=!1,v=void 0,b=void 0,w=!1,E=!1,M=[Z,V],T=[J,K,Q],x=!0,A=!1,L=t.getFromLocal("setting")||levels.beginner;TEST_MODE&&(L={rows:10,cols:10,mines:10,name:"test"}),t.saveToLocal("setting",L);let y=L.mines,S=[];function k(e,n){"custom"===e?function(){const e=[],t=document.createElement("input");t.placeholder="Rows",e.push(t);const n=document.createElement("input");n.placeholder="Columns",e.push(n);const o=document.createElement("input");o.placeholder="Bombs",e.push(o);const i=document.createElement("button");i.innerText="Okay";const s={rows:t.value,cols:n.value,bombs:o.value};i.onmousedown=(()=>k("custom-action",s)),e.forEach(e=>{e.style.marginRight="15px",e.style.width="100px",e.maxLength=3,e.type="number",e.width=50}),u.append(...e,i),l.append(u)}():"custom-action"===e?console.log("custom",n):(L=levels[e],t.saveToLocal("setting",L),document.getElementById("custom-wrapper")&&l.removeChild(u),_())}function _(){x=!0,s.innerHTML="",s.oncontextmenu=(()=>!1),y=L.mines,S=[];for(let e=0;e<L.rows;e++){let t=s.insertRow(e);t.oncontextmenu=(()=>!1);for(let e=0;e<L.cols;e++){let n=t.insertCell(e);D(n),"ontouchstart"in document.documentElement&&(g=!0,O(n));let o=document.createAttribute("data-status");o.value="default",n.setAttributeNode(o)}}let e=document.createAttribute("game-status");e.value="inactive",s.setAttributeNode(e),m.style.minWidth="260px",m.style.width=`${s.offsetWidth+40}px`,m.style.margin="0 auto",function(){const e=`Best Times (${L.name})`;i.update(L.name,f,e),m.append(f)}(),n.initialize(a),I(),function(e){for(let t=0;t<e;t++){let e=Math.floor(Math.random()*L.rows),t=Math.floor(Math.random()*L.cols),n=s.rows[e].cells[t];$(n)?te():S.push([e,t]),TEST_MODE&&(n.innerHTML="X")}TEST_MODE&&ee()}(L.mines)}function N(){A=!0,g?setTimeout(()=>A=!1,MOBILE_BUSY_DELAY):setTimeout(()=>A=!1,PC_BUSY_DELAY)}function I(e=y){"win"==s.getAttribute("game-status")?c.innerHTML="&#128513;":c.innerHTML=`${e}`}function O(e){let t=document.createElement("td");(t=e).addEventListener("touchleave",function(e){d===this&&(d=void 0)});t.addEventListener("touchend",function(e){d=void 0});t.addEventListener("touchstart",function(e){A||"object"!=typeof e||(t=this,H(d,t)||(d=t,setTimeout(()=>{H(d,t)&&(Q(t),N())},500)));var t})}function D(t){let n=document.createElement("td");n=t,w=!1,E=!1,B(),document.onkeydown=function(e){32==e.keyCode&&_(),B()},window.onblur=function(){B()},s.onmouseleave=function(){G()},document.oncontextmenu=(()=>!1),document.onmouseup=function(){B()},document.onmousedown=function(e){switch(e.button){case 0:v="left",p=!0;break;case 1:v="middle";break;case 2:h=!0}},n.onmouseup=function(t){v=void 0;let n=!1;if(b&&(b=!1,"2"==t.button?E=!0:"0"==t.button&&(n=!0),"clicked"==F(this)))V(this);else{switch(t.button){case 0:p=!1,E&&(w=!0);break;case 2:h=!1}if(G(),w||n)return w=!1,void(E=!1);A||"object"!=typeof t||"2"==t.button||M[t.button].call(e,this)}},n.onmousedown=function(t){if(w=!1,!A&&"object"==typeof t){switch(t.button){case 0:p=!0;break;case 2:h=!0}if(p&&h)return b=!0,void K(this);"1"==t.button?(v="middle",K(this)):"0"==t.button&&(v="left","clicked"==F(this)?K(this):J(this)),"2"==t.button&&T[t.button].call(e,this)}},n.onmousemove=function(e){(v||b)&&"object"==typeof e&&(G(),"middle"==v||p&&h?K(this):"left"==v&&("clicked"==F(this)?K(this):J(this)))},n.oncontextmenu=(()=>!1),n.onselectstart=(()=>!1),n.setAttribute("unselectable","on")}function H(e,t){return!!e&&e===t}function B(){v=void 0,b=void 0,p=!1,h=!1,G(),w=!0}function C(){if("done"==s.getAttribute("game-status"))return;const e="win"==s.getAttribute("game-status");for(let t=0;t<L.rows;t++)for(let n=0;n<L.cols;n++){let o=s.rows[t].cells[n];e?j(o):Y(o)}s.setAttribute("game-status","done");const t={time:n.stop(),status:e?"win":"loss",level:L.name};i.send(t,"time"),gtag&&gtag("event","mw-event",{event_category:"mw-game",event_label:"end-game"})}function j(e){if(I(0),$(e)){e.innerHTML=":)",e.className="correct",X(e,"clicked");let t=document.createAttribute("title");t.value="Correct",e.setAttributeNode(t),X(e,"clicked")}}function Y(e){if(U(e))if(e.className="flag",$(e)){e.innerHTML=":)",e.className="correct";let t=document.createAttribute("title");t.value="Correct",e.setAttributeNode(t)}else{e.innerHTML="X",e.className="wrong";let t=document.createAttribute("title");t.value="Wrong",e.setAttributeNode(t)}else $(e)&&(e.className="mine",X(e,"clicked"))}function R(e){return""!==e.innerHTML&&!U(e)}function U(e){return"flagged"==F(e)}function $(e){return W(S,e)>-1}function W(e,t){const n=t.parentNode.rowIndex,o=t.cellIndex;let i=-1;for(let t=0;t<e.length;t++){let s=e[t];if(s[0]===n&&s[1]===o){i=t;break}}return i}function X(e,t){e.setAttribute("data-status",t)}function z(e){return e.cellIndex}function P(e){return e.parentNode.rowIndex}function F(e){if(e)return e.getAttribute("data-status")}function V(e){if("active"!=s.getAttribute("game-status")||"clicked"!==F(e))return;const t=e.getAttribute("data-value");let n=parseInt(t,10);(function(e){let t=0,n=e.parentNode.rowIndex,o=e.cellIndex;for(let e=Math.max(n-1,0);e<=Math.min(n+1,L.rows-1);e++)for(let n=Math.max(o-1,0);n<=Math.min(o+1,L.cols-1);n++)U(s.rows[e].cells[n])&&t++;return t})(e)===n&&(!function(e){if("active"!=s.getAttribute("game-status"))return;let t=e.parentNode.rowIndex,n=e.cellIndex;for(let e=Math.max(t-1,0);e<=Math.min(t+1,L.rows-1);e++)for(let t=Math.max(n-1,0);t<=Math.min(n+1,L.cols-1);t++){let n=s.rows[e].cells[t];"flagged"!=F(n)&&ie(n)}}(e),TEST_MODE&&o.debug("middle click",e))}function q(){s.setAttribute("game-status","active"),n.start(),gtag&&gtag("event","mw-event",{event_category:"mw-game",event_label:"start-game"})}function G(){for(let e=0;e<L.rows;e++){if(s.rows[e])for(let t=0;t<L.cols;t++){let n=s.rows[e].cells[t];"highlighted"==F(n)&&X(n,"default")}}}function J(e){U(e)||"over"!=s.getAttribute("game-status")&&"done"!=s.getAttribute("game-status")&&"default"==F(e)&&X(e,"highlighted")}function K(e){let t=e.parentNode.rowIndex,n=e.cellIndex;J(e);for(let e=Math.max(t-1,0);e<=Math.min(t+1,L.rows-1);e++)for(let t=Math.max(n-1,0);t<=Math.min(n+1,L.cols-1);t++){J(s.rows[e].cells[t])}}function Q(e){if(U(e)&&N(),"inactive"==s.getAttribute("game-status")&&q(),"active"==s.getAttribute("game-status")&&"clicked"!=F(e)&&"empty"!=F(e)){if("default"==F(e)||"highlighted"==F(e)){if(y<=0)return;e.className="flag",y--,I(),X(e,"flagged"),g&&navigator.vibrate()}else e.className="",y++,I(),X(e,"default");TEST_MODE&&o.debug("right click",e)}}function Z(e){U(e)&&N(),"inactive"==s.getAttribute("game-status")&&q(),"active"==s.getAttribute("game-status")&&(TEST_MODE&&o.debug("click",e),"flagged"!=F(e)&&"over"!=s.getAttribute("game-status")&&("clicked"!=F(e)?($(e)&&x&&(!function(e,t){const n=W(e,t);n>-1&&e.splice(n,1)}(S,e),te(e),TEST_MODE&&ee()),ie(e)):V(e)))}function ee(){let e=0;for(let t=0;t<L.rows;t++)for(let n=0;n<L.cols;n++)$(s.rows[t].cells[n])&&o.debug(e+++" - mine: ["+t+","+n+"]")}function te(e){let t=!1;do{let n=Math.floor(Math.random()*L.rows),i=Math.floor(Math.random()*L.cols);const c=s.rows[n].cells[i];if(!$(c)&&!ne(e,c))return S.push([n,i]),TEST_MODE&&(c.innerHTML="X",TEST_MODE&&o.debug("transferred mine to: "+n+", "+i)),void(t=!0)}while(!t)}function ne(e,t){if(void 0===e)return;const n=Math.abs(P(e)-P(t)),o=Math.abs(z(e)-z(t));return 1===n&&1===o}function oe(e,t){const n=document.createElement("span");n.innerHTML=t,e.innerHTML="",e.appendChild(n)}function ie(e){if("active"==s.getAttribute("game-status"))if(e.className="clicked",X(e,"clicked"),x=!1,$(e))C(),c.innerHTML="&#128561;",s.setAttribute("game-status","over");else{const t=function(e){let t=0,n=e.parentNode.rowIndex,o=e.cellIndex;for(let e=Math.max(n-1,0);e<=Math.min(n+1,L.rows-1);e++){const n=s.rows[e];if(n)for(let e=Math.max(o-1,0);e<=Math.min(o+1,L.cols-1);e++){const o=n.cells[e],i=$(o);o&&i&&t++}}return t}(e);if(0==t)!function(e){oe(e," ");let t=e.parentNode.rowIndex,n=e.cellIndex;X(e,"empty");for(let e=Math.max(t-1,0);e<=Math.min(t+1,L.rows-1);e++){const t=s.rows[e];if(t)for(let e=Math.max(n-1,0);e<=Math.min(n+1,L.cols-1);e++){const n=t.cells[e];n&&!R(n)&&Z(n)}}}(e);else{oe(e,t.toString());const n=document.createAttribute("data-value");n.value=t,e.setAttributeNode(n)}!function(){let e=!0;for(let t=0;t<L.rows;t++)for(let n=0;n<L.cols;n++){const o=s.rows[t].cells[n];$(o)||""!=o.innerHTML||(e=!1)}e&&"active"==s.getAttribute("game-status")&&(s.setAttribute("game-status","win"),C())}()}}this.initialize=function(){m.innerHTML="";const e=document.createElement("h1");e.innerText="Minesweeper v0.3.4";const t=document.createElement("div");t.setAttribute("id","game-board"),t.append(function(){const e=document.createElement("div"),t=[],n=document.createElement("div");n.append(c),n.style.height="20px",e.append(n),t.push(n),document.createElement("div").append(r);const o=document.createElement("div");return o.append(a),o.style.height="20px",e.append(o),t.push(o),e.style.cursor="pointer",e.style.padding="10px 35px",e.style.display="flex",e.style.justifyContent="space-between",e.onmousedown=(()=>_()),e}(),s,function(){const e=document.createElement("div"),t=document.createElement("button");t.innerText="Reset",t.onmousedown=(()=>_()),e.append(t);let n=document.createElement("select");n.onchange=(()=>k(n.value)),Object.keys(levels).forEach(e=>{const t=document.createElement("option");t.value=levels[e].name,t.text=function(e){return e?`${e[0].toUpperCase()}${e.slice(1,e.length)}`:""}(levels[e].name),L.name===t.value&&(t.selected=!0),n.add(t,null)});const o=document.createElement("option");if(o.onmousedown=(()=>{}),o.value="custom",o.text="Custom",TEST_MODE){const t=document.createElement("span");t.innerText="Test Mode",e.append(t)}else e.append(n);return e}()),m.append(e,t),_()}};