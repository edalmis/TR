function N(){}function C(t,e){for(const n in e)t[n]=e[n];return t}function Z(t){return!!t&&(typeof t=="object"||typeof t=="function")&&typeof t.then=="function"}function D(t){return t()}function $(){return Object.create(null)}function P(t){t.forEach(D)}function L(t){return typeof t=="function"}function tt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let h;function et(t,e){return t===e?!0:(h||(h=document.createElement("a")),h.href=e,t===h.href)}function nt(t){return Object.keys(t).length===0}function M(t,...e){if(t==null){for(const i of e)i(void 0);return N}const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function it(t,e,n){t.$$.on_destroy.push(M(e,n))}function rt(t,e,n,i){if(t){const r=j(t,e,n,i);return t[0](r)}}function j(t,e,n,i){return t[1]&&i?C(n.ctx.slice(),t[1](i(e))):n.ctx}function ct(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const o=[],c=Math.max(e.dirty.length,r.length);for(let s=0;s<c;s+=1)o[s]=e.dirty[s]|r[s];return o}return e.dirty|r}return e.dirty}function lt(t,e,n,i,r,o){if(r){const c=j(e,n,i,o);t.p(c,r)}}function st(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function ot(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function ut(t,e,n){return t.set(n),e}function at(t){return t&&L(t.destroy)?t.destroy:N}let p=!1;function ft(){p=!0}function _t(){p=!1}function T(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function B(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let u=0;u<e.length;u++){const a=e[u];a.claim_order!==void 0&&l.push(a)}e=l}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let l=0;l<e.length;l++){const u=e[l].claim_order,a=(r>0&&e[n[r]].claim_order<=u?r+1:T(1,r,q=>e[n[q]].claim_order,u))-1;i[l]=n[a]+1;const w=a+1;n[w]=l,r=Math.max(w,r)}const o=[],c=[];let s=e.length-1;for(let l=n[r]+1;l!=0;l=i[l-1]){for(o.push(e[l-1]);s>=l;s--)c.push(e[s]);s--}for(;s>=0;s--)c.push(e[s]);o.reverse(),c.sort((l,u)=>l.claim_order-u.claim_order);for(let l=0,u=0;l<c.length;l++){for(;u<o.length&&c[l].claim_order>=o[u].claim_order;)u++;const a=u<o.length?o[u]:null;t.insertBefore(c[l],a)}}function H(t,e){if(p){for(B(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function dt(t,e,n){p&&!n?H(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function ht(t){t.parentNode&&t.parentNode.removeChild(t)}function mt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function I(t){return document.createElement(t)}function k(t){return document.createTextNode(t)}function pt(){return k(" ")}function yt(){return k("")}function bt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function gt(t){return function(e){return e.preventDefault(),t.call(this,e)}}function A(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const z=["width","height"];function F(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set&&z.indexOf(i)===-1?t[i]=e[i]:A(t,i,e[i])}function W(t,e){Object.keys(e).forEach(n=>{G(t,n,e[n])})}function G(t,e,n){e in t?t[e]=typeof t[e]=="boolean"&&n===""?!0:n:A(t,e,n)}function xt(t){return/-/.test(t)?W:F}function vt(t){return t.dataset.svelteH}function kt(t){return t===""?null:+t}function wt(t){return Array.from(t.childNodes)}function J(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function O(t,e,n,i,r=!1){J(t);const o=(()=>{for(let c=t.claim_info.last_index;c<t.length;c++){const s=t[c];if(e(s)){const l=n(s);return l===void 0?t.splice(c,1):t[c]=l,r||(t.claim_info.last_index=c),s}}for(let c=t.claim_info.last_index-1;c>=0;c--){const s=t[c];if(e(s)){const l=n(s);return l===void 0?t.splice(c,1):t[c]=l,r?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=c,s}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function K(t,e,n,i){return O(t,r=>r.nodeName===e,r=>{const o=[];for(let c=0;c<r.attributes.length;c++){const s=r.attributes[c];n[s.name]||o.push(s.name)}o.forEach(c=>r.removeAttribute(c))},()=>i(e))}function Et(t,e,n){return K(t,e,n,I)}function Q(t,e){return O(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>k(e),!0)}function Nt(t){return Q(t," ")}function jt(t,e){e=""+e,t.data!==e&&(t.data=e)}function At(t,e){t.value=e??""}function Ot(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function St(t,e,n){for(let i=0;i<t.options.length;i+=1){const r=t.options[i];if(r.__value===e){r.selected=!0;return}}(!n||e!==void 0)&&(t.selectedIndex=-1)}function qt(t){const e=t.querySelector(":checked");return e&&e.__value}function Ct(t,e,n){t.classList.toggle(e,!!n)}function R(t,e,{bubbles:n=!1,cancelable:i=!1}={}){return new CustomEvent(t,{detail:e,bubbles:n,cancelable:i})}function Dt(t,e){return new t(e)}let m;function b(t){m=t}function y(){if(!m)throw new Error("Function called outside component initialization");return m}function Pt(t){y().$$.on_mount.push(t)}function Lt(t){y().$$.after_update.push(t)}function Mt(t){y().$$.on_destroy.push(t)}function Tt(){const t=y();return(e,n,{cancelable:i=!1}={})=>{const r=t.$$.callbacks[e];if(r){const o=R(e,n,{cancelable:i});return r.slice().forEach(c=>{c.call(t,o)}),!o.defaultPrevented}return!0}}const d=[],E=[];let _=[];const x=[],S=Promise.resolve();let v=!1;function U(){v||(v=!0,S.then(X))}function Bt(){return U(),S}function V(t){_.push(t)}function Ht(t){x.push(t)}const g=new Set;let f=0;function X(){if(f!==0)return;const t=m;do{try{for(;f<d.length;){const e=d[f];f++,b(e),Y(e.$$)}}catch(e){throw d.length=0,f=0,e}for(b(null),d.length=0,f=0;E.length;)E.pop()();for(let e=0;e<_.length;e+=1){const n=_[e];g.has(n)||(g.add(n),n())}_.length=0}while(d.length);for(;x.length;)x.pop()();v=!1,g.clear(),b(t)}function Y(t){if(t.fragment!==null){t.update(),P(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(V)}}function It(t){const e=[],n=[];_.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),_=e}export{It as $,it as A,ut as B,rt as C,lt as D,st as E,ct as F,Z as G,y as H,b as I,X as J,C as K,ot as L,xt as M,Ct as N,at as O,L as P,At as Q,et as R,Tt as S,Ht as T,qt as U,kt as V,V as W,St as X,gt as Y,$ as Z,nt as _,pt as a,m as a0,D as a1,d as a2,U as a3,ft as a4,_t as a5,Lt as b,Nt as c,ht as d,yt as e,I as f,Et as g,wt as h,dt as i,A as j,Ot as k,k as l,Q as m,jt as n,Pt as o,E as p,Dt as q,vt as r,tt as s,Bt as t,H as u,bt as v,N as w,P as x,mt as y,Mt as z};