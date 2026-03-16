const $=id=>document.getElementById(id),$$=(s,c=document)=>c.querySelectorAll(s);
const theme={
  init(){const s=localStorage.getItem('theme'),h=new Date().getHours();this.set(s||(h>=6&&h<18?'light':'dark'),!1)},
  set(t,save=!0){document.documentElement.setAttribute('data-theme',t==='light'?'light':'');if(save){localStorage.setItem('theme',t);const e=$('theme-text');if(e)e.textContent=t==='light'?'浅色':'深色'}},
  toggle(){this.set(document.documentElement.getAttribute('data-theme')==='light'?'dark':'light')}
};
