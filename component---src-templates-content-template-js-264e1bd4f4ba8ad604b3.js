(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{"/4ef":function(e,t,a){},"0v46":function(e,t,a){},N1om:function(e,t,a){var r=a("sgoq")((function(e,t,a){return e+(a?"-":"")+t.toLowerCase()}));e.exports=r},XFRJ:function(e,t,a){"use strict";a("rzGZ"),a("Dq+y"),a("8npG"),a("Ggvi"),a("E5k/"),a("aHCT"),a("y7hu"),a("m4Pe");var r=a("jsr+"),n=a("Wbzz"),l=a("q1tI"),o=a.n(l),c=a("u1fg");var s=function(e){var t,a=e.className,l=e.wrapperClassName,s=e.link,i=e.content,u=e.stack,m=e.bold,d=e.thickBorder,p=e.upperCase,g=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,["className","wrapperClassName","link","content","stack","bold","thickBorder","upperCase"]),f=o.a.createElement("div",{className:"arrow__container arrows--horizontal "+a},i.map((function(e,t){var a={backgroundColor:e.backgroundColor?e.backgroundColor:"transparent",color:e.backgroundColor===c.black?"white":c.black};return o.a.createElement("div",Object.assign({key:"arrow"+t,className:"arrow__wrapper"},g),o.a.createElement("div",{className:"arrow__rectangle "+(m?"bold":"")+" "+(d?"arrow__rectangle--thick-border":""),style:a},e.link?o.a.createElement(n.Link,{to:e.link},p?e.text.toUpperCase():e.text):p?e.text.toUpperCase():e.text),o.a.createElement("div",{className:"arrow__point "+(d?"arrow__point--thick-border":""),style:a}))})));return u||s?!u&&s?t=o.a.createElement("div",{className:"spacing--after-small auto-bottom-margin"},o.a.createElement(n.Link,{to:s,style:{display:"inline-block"}},f)):u&&(t=o.a.createElement("div",{className:"col-10 spacing--after "+l},o.a.createElement("div",{className:"arrow__container arrow__container--with-link",style:{display:"flex",flexDirection:"column"}},i.map((function(e){var t={backgroundColor:e.backgroundColor?e.backgroundColor:"transparent",color:e.backgroundColor===c.black?"white":c.black};return o.a.createElement(n.Link,Object.assign({key:e.text,to:e.path,className:"arrow__wrapper--stacked "+a},g),o.a.createElement(r.a,{flex:!0,className:"arrow__rectangle",style:t},o.a.createElement("p",{className:"arrow--stacked-title"},o.a.createElement("span",null,e.text))),o.a.createElement("div",{className:"arrow__point",style:t}))}))))):t=o.a.createElement("div",{className:"col-10 spacing--after"},f),t};s.defaultProps={className:"",wrapperClassName:""},t.a=s},Zosa:function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));var r={0:"light-violet",1:"green",2:"dark-orange",3:"light-orange",4:"yellow",5:"pink",6:"violet",7:"light-blue",8:"light-green",9:"part9-light-blue",10:"turqouise",11:"purple",12:"pale-pink",13:"sqlgreen"}},gqR3:function(e,t){e.exports={en:"Online instructional materials for COMP 227 from the University of the Pacific"}},jyfX:function(e,t,a){var r=a("sZCt")("kebabCase",a("N1om"),a("Eszj"));r.placeholder=a("wuTn"),e.exports=r},kl3L:function(e,t,a){"use strict";a("q8oJ"),a("rzGZ"),a("Dq+y"),a("8npG"),a("Ggvi"),a("gu/5"),a("eoYm"),a("l54/");var r=a("jsr+"),n=a("Wbzz"),l=a("q1tI"),o=a.n(l),c=a("ymbu"),s=a.n(c),i=a("c7NW"),u=a.n(i),m=a("9Koi"),d=function(e){return String.fromCharCode(e.charCodeAt(0)-1)},p=function(e){return String.fromCharCode(e.charCodeAt(0)+1)},g=function(e,t){return Object.keys(s.a[t]).includes(e.toString())},f=function(e,t,a){return p(e)in s.a[a][t]},h=function(e,t,a){return!e&&g(t+1,a)||e&&f(e,t,a)},b=function(e){return"en"===e?"/part":"/"+e+"/part"},k=function(e){var t=e.part,a=e.letter,l=e.lang,c=Object(m.a)().t;return o.a.createElement(r.a,{className:"container spacing spacing--after-large prev-next__container"},!a&&g(t-1,l)?o.a.createElement(o.a.Fragment,null,o.a.createElement(n.Link,{to:""+b(l)+(t-1),className:"col-4--mobile push-right-1 prev"},o.a.createElement(r.a,{flex:!0,dirColumn:!0},o.a.createElement("p",null,"Part"," ",t-1),o.a.createElement("b",null,c("previousPart")))),h(a,t,l)&&o.a.createElement("div",{className:"col-1--mobile separator"})):a?"a"!==a?o.a.createElement(o.a.Fragment,null,o.a.createElement(n.Link,{to:""+b(l)+t+"/"+u()(s.a[l][t][d(a)]),className:"col-4--mobile push-right-1 prev"},o.a.createElement(r.a,{flex:!0,dirColumn:!0},o.a.createElement("p",null,"Part"," ",""+t+d(a)),o.a.createElement("b",null,c("previousPart")))),h(a,t,l)&&o.a.createElement("div",{className:"col-1--mobile separator"})):g(t-1,l)?o.a.createElement(o.a.Fragment,null,o.a.createElement(n.Link,{to:""+b(l)+(t-1),className:"col-4--mobile push-right-1 prev"},o.a.createElement(r.a,{flex:!0,dirColumn:!0},o.a.createElement("p",null,"Part"," ",t-1),o.a.createElement("b",null,c("previousPart")))),h(a,t,l)&&o.a.createElement("div",{className:"col-1--mobile separator"})):o.a.createElement(r.a,{className:"push-right-1"}):o.a.createElement(r.a,{className:"push-right-1"}),!a&&g(t+1,l)?(console.log("a",g(t+1,l)),o.a.createElement(n.Link,{to:""+b(l)+(t+1),className:"col-4--mobile push-left-1 next"},o.a.createElement(r.a,{flex:!0,dirColumn:!0},o.a.createElement("p",null,"Part"," ",t+1),o.a.createElement("b",null,c("nextPart"))))):a?f(a,t,l)?o.a.createElement(n.Link,{to:""+b(l)+t+"/"+u()(s.a[l][t][p(a)]),className:"col-4--mobile push-left-1 next"},o.a.createElement(r.a,{flex:!0,dirColumn:!0},o.a.createElement("p",null,"Part"," ",""+t+p(a)),o.a.createElement("b",null,c("nextPart")))):g(t+1,l)?o.a.createElement(n.Link,{to:""+b(l)+(t+1),className:"col-4--mobile push-left-1 next"},o.a.createElement(r.a,{flex:!0,dirColumn:!0},o.a.createElement("p",null,"Part"," ",t+1),o.a.createElement("b",null,c("nextPart")))):o.a.createElement(r.a,{className:"push-left-1"}):o.a.createElement(r.a,{className:"push-left-1"}))};k.defaultProps={part:void 0,letter:void 0},t.a=k},"l54/":function(e,t,a){},m4Pe:function(e,t,a){},mt4B:function(e,t,a){"use strict";a.d(t,"a",(function(){return l}));a("rzGZ"),a("Dq+y"),a("8npG"),a("Ggvi"),a("E5k/"),a("rXWv");var r=a("q1tI"),n=a.n(r);var l=function(e){var t=e.className,a=e.backgroundColor,r=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,["className","backgroundColor"]),l=a?{backgroundColor:a}:null;return n.a.createElement("div",Object.assign({className:"banner "+t,style:l},r))};l.defaultProps={className:""}},rXWv:function(e,t,a){},tkMx:function(e,t,a){"use strict";a.r(t),a.d(t,"default",(function(){return q})),a.d(t,"contentPageQuery",(function(){return X}));a("q8oJ"),a("8npG"),a("m210"),a("4DPX"),a("rzGZ"),a("pJf4"),a("YbXK"),a("cFtU"),a("xPXs");var r=a("q1tI"),n=a.n(r),l=a("XFRJ"),o=a("y2O/"),c=a.n(o),s=a("mt4B"),i=a("9Koi"),u=a("jsr+"),m=(a("/4ef"),function(e){var t=e.part,a=e.letter,r=Object(i.a)(),l=r.t,o="https://github.com/comp227/comp227/edit/source/src/content/"+t+"/"+r.i18n.language+"/"+("part"+t)+a+".md";return n.a.createElement(u.a,{flex:!0,className:"container spacing",centered:!0},n.a.createElement("a",{className:"edit-link",target:"__BLANK",href:o},n.a.createElement("span",null,l("proposeChanges"))))}),d=a("Bl7J"),p=a("76ZC"),g=a.n(p),f=a("kl3L"),h=a("vrFN"),b=(a("0v46"),a("XSxc")),k=a("Wbzz"),E=a("jyfX"),v=a.n(E),y=a("ymbu"),N=a.n(y),C=a("c7NW"),w=a.n(C),x=a("xB9W");var A=function(e){var t,a;function r(t){var a;return(a=e.call(this,t)||this).componentDidMount=function(){var e=Array.from(document.querySelectorAll("h3")).map((function(e){return e.id=v()(e.innerText),e.classList.add("offset"),{text:e.innerText,id:e.id,level:e.nodeName}}));a.setState({headings:e}),window.addEventListener("scroll",a.scrollHandler)},a.scrollHandler=function(){a.scrollTimer&&clearTimeout(a.scrollTimer),a.scrollTimer=setTimeout((function(){var e=window.scrollY,t=a.state.headings[0],r=a.state.headings,n=Array.isArray(r),l=0;for(r=n?r:r[Symbol.iterator]();;){var o;if(n){if(l>=r.length)break;o=r[l++]}else{if((l=r.next()).done)break;o=l.value}var c=o,s=document.getElementById(c.id);if(s&&s.offsetTop>=e)break;t=c}a.state.selectedItem!==t.id&&a.setState({selectedItem:t.id})}),50)},a.loopThroughPartsNode=function(e){var t=a.state.headings,r=a.props,l=r.part,o=r.letter,c=r.currentPath,s=r.currentPartTitle,i=r.colorCode,u=r.lang,m=[];for(var d in e)s!==e[d]?m.push(n.a.createElement(k.Link,{key:d,className:"left-navigation-link",style:{borderColor:i},to:Object(x.a)(u,l,"/"+w()(e[d]))},d+" "+e[d])):m.push(n.a.createElement(b.a,{containerClassName:"accordion--side-navigation",style:{color:i},titleStyle:{backgroundColor:i,borderColor:i},initiallyOpened:!0,key:d,title:o+" "+e[d],selectedItem:a.state.selectedItem,list:t.map((function(e){return{id:e.id,href:c+"#"+e.id,text:e.text}}))}));return m},a.state={headings:[],selectedItem:null},a}a=e,(t=r).prototype=Object.create(a.prototype),t.prototype.constructor=t,t.__proto__=a;var l=r.prototype;return l.componentWillUnmount=function(){window.removeEventListener("scroll",this.scrollHandler)},l.render=function(){var e=this.props.part;return n.a.createElement(u.a,{className:"scroll-navigation-container"},n.a.createElement(u.a,{className:"scroll-navigation-container-inner"},n.a.createElement(u.a,{tag:"ul",dirColumn:!0,className:"scroll-navigation "+this.props.className},this.loopThroughPartsNode(N.a[this.props.lang][e]))))},r}(r.Component);A.defaultProps={className:"",lang:"en"};var P=A,_=a("K4iA"),I=a("u1fg"),S=a("GkXj"),O=a.n(S),T=a("gqR3"),j=a.n(T),D=a("5I0T"),B=a.n(D),F=a("Zosa"),L=a("33yf"),G=a.n(L);function M(e){return function(e){if(Array.isArray(e)){for(var t=0,a=new Array(e.length);t<e.length;t++)a[t]=e[t];return a}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}var q=function(e){var t,a;function r(t){var a;return(a=e.call(this,t)||this).handleScroll=function(){window.scrollY>300&&!a.state.showArrowUp?a.setState({showArrowUp:!0,isDark:"dark"===document.documentElement.dataset.theme}):window.scrollY<=300&&a.state.showArrowUp&&a.setState({showArrowUp:!1,isDark:"dark"===document.documentElement.dataset.theme})},a.state={h1Title:"",otherTitles:"",showArrowUp:!1,isDark:!1},a}a=e,(t=r).prototype=Object.create(a.prototype),t.prototype.constructor=t,t.__proto__=a;var o=r.prototype;return o.componentDidMount=function(){var e=Array.from(document.querySelectorAll("a:not(.skip-to-content")),t=document.querySelector("h1"),a=document.querySelectorAll("h3"),r=Array.from(a).map((function(e){return e.innerText})),n=this.props.data.markdownRemark.frontmatter;e.map((function(e){e.style="border-color: "+I[F.a[n.part]];var t=e.style.color;return e.style.color="STRONG"===e.parentNode.tagName?I[F.a[n.part]+("light"===document.documentElement.dataset.theme?"-alt":"")]:t,!e.classList.contains("language-switcher__language")&&(e.target="_blank"),e.onmouseover=function(){e.style.color=t,e.style.backgroundColor=I[F.a[n.part]]},e.onmouseleave=function(){e.style.backgroundColor="transparent",e.style.color="STRONG"===e.parentNode.tagName?I[F.a[n.part]+("light"===document.documentElement.dataset.theme?"-alt":"")]:t},null})),this.setState({h1Title:t.innerText,otherTitles:M(r),isDark:"dark"===document.documentElement.dataset.theme}),window.addEventListener("scroll",this.handleScroll)},o.componentWillUnmount=function(){window.removeEventListener("scroll",this.handleScroll)},o.render=function(){var e=this.props.data.markdownRemark,t=e.frontmatter,a=e.html,r=t.mainImage,o=t.letter,i=t.part,p=t.lang,b=I[F.a[i]+(this.state.isDark?"-dark":"")],k=I[F.a[i]+(this.state.isDark?"":"-dark")],E=I[F.a[i]],v={replace:function(e){var t=e.type,a=e.name,r=e.attribs,l=e.children;if("tag"===t&&"picture"===a){var o=l[0].attribs.alt?l[0].attribs.alt:"comp227 content";return n.a.createElement("picture",null,n.a.createElement("img",{style:{borderColor:E},alt:o,src:l[0].attribs.src}))}return"tag"===t&&"pre"===a?n.a.createElement("pre",null,O()(l,v)):"tag"===t&&"content"===r.class?n.a.createElement(u.a,{className:"course-content"},n.a.createElement(u.a,{className:"course-content-inner"},O()(l,v))):"tag"===t&&"tasks"===r.class?n.a.createElement(s.a,{style:{backgroundColor:b,borderColor:E},className:"spacing tasks content-banner"},n.a.createElement(u.a,{className:"course-content",style:{borderColor:E,backgroundColor:"transparent"}},n.a.createElement(u.a,{className:"course-content-inner"},"pre"===l.name?n.a.createElement("pre",null,O()(l,v)):O()(l,v)))):"tag"===t&&"strong"===a?n.a.createElement("strong",{style:{color:k}},O()(l,v)):void 0}};return n.a.createElement(d.a,{isCoursePage:!0},n.a.createElement(h.a,{lang:p,title:"COMP227 part"+i+" | "+this.state.h1Title,description:j.a[p],keywords:[].concat(M(B.a),[this.state.h1Title],M(this.state.otherTitles))}),this.state.showArrowUp&&n.a.createElement("div",{className:"arrow-go-up",onClick:function(){return window.scrollTo({top:0,left:0,behavior:"smooth"})}},n.a.createElement("img",{src:c.a,alt:"arrow-up"})),n.a.createElement("div",{className:"course-container spacing--after"},n.a.createElement(s.a,{className:"part-main__banner spacing--mobile--small",backgroundColor:E,style:{backgroundImage:"url("+G.a.resolve(r.publicURL)+")",backgroundColor:E}},n.a.createElement("div",{className:"container spacing--after"},n.a.createElement(l.a,{className:"breadcrumb",content:[{backgroundColor:E,text:"COMP227",link:"/"+("en"===p?"":p+"/")+"#course-contents"},{backgroundColor:E,text:"Part "+i,link:Object(x.a)(p,i)},{backgroundColor:I.black,text:N.a[p][i][o]}]}))),n.a.createElement(u.a,{className:"course",id:"course-main-content"},n.a.createElement(P,{part:i,letter:o,lang:p,currentPartTitle:N.a[p][i][o],currentPath:Object(x.a)(p,i,"/"+w()(N.a[p][i][o])),colorCode:E}),n.a.createElement(u.a,{className:"course-content-container"},n.a.createElement(u.a,{className:"course-content",autoBottomMargin:!0},n.a.createElement(u.a,{className:"course-content-inner"},n.a.createElement("p",{className:"col-1 letter",style:{borderColor:E}},o),n.a.createElement(_.a,{headingLevel:"h1",text:N.a[p][i][o]}))),g()(a,v))),n.a.createElement(m,{part:i,letter:o,lang:p}),n.a.createElement(f.a,{part:i,letter:o,lang:p})))},r}(r.Component),X="3474053423"},u1fg:function(e){e.exports=JSON.parse('{"white":"#ffffff","black":"#33332d","main":"#e1e1e1","turquoise":"#82F7EB","blue":"#706BE4","pale-pink":"#F9B9D3","purple":"#D4A8E2","sqlgreen":"#C5FF73","smartly-purple":"#f8f5f9","light-violet":"#B2BBF0","light-violet-alt":"#576CE0","light-violet-dark":"#182986","green":"#AEFFDA","green-alt":"#008549","green-dark":"#003f22","dark-orange":"#F0AC8A","dark-orange-alt":"#CB4A3A","dark-orange-dark":"#4c2303","light-orange":"#EEB268","light-orange-alt":"#AA632C","light-orange-dark":"#3d2d0f","yellow":"#F7F382","yellow-alt":"#937206","yellow-dark":"#5B4703","pink":"#E693CB","pink-alt":"#a62d80","pink-dark":"#3d102f","violet":"#B795F3","violet-alt":"#4c14b0","violet-dark":"#220950","light-blue":"#82D2F7","light-blue-alt":"#0b7db1","light-blue-dark":"#043850","light-green":"#D4FCB5","light-green-alt":"#3C8406","light-green-dark":"#295b04","part9-light-blue":"#AFF4FE","part9-light-blue-alt":"#038296","part9-light-blue-dark":"#01515D"}')},xB9W:function(e,t,a){"use strict";t.a=function(e,t,a){return void 0===a&&(a=""),"en"===e?"/part"+t+a:"/"+e+"/part"+t+a}},xPXs:function(e,t,a){},"y2O/":function(e,t){e.exports="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48dGl0bGU+aWNfYXJyb3dfdXB3YXJkXzQ4cHg8L3RpdGxlPg0KICAgIDxnIGNsYXNzPSJuYy1pY29uLXdyYXBwZXIiIGZpbGw9IiMxMTExMTEiPg0KICAgICAgICA8cGF0aCBkPSJNOCAyNGwyLjgzIDIuODNMMjIgMTUuNjZWNDBoNFYxNS42NmwxMS4xNyAxMS4xN0w0MCAyNCAyNCA4IDggMjR6Ii8+DQogICAgPC9nPg0KPC9zdmc+"},y7hu:function(e,t,a){"use strict";a("t+fG")("link",(function(e){return function(t){return e(this,"a","href",t)}}))},ymbu:function(e,t){e.exports={en:{0:{a:"Syllabus",b:"General info",c:"Fundamentals of Web apps",d:"Configuring your machine for this course"},1:{a:"Introduction to React",b:"JavaScript",c:"Component state, event handlers",d:"A more complex state, debugging React apps"}}}}}]);
//# sourceMappingURL=component---src-templates-content-template-js-264e1bd4f4ba8ad604b3.js.map