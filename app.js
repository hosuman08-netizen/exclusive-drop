(function(){
  var credits=+(localStorage.getItem('exclusive-drop_cr')||10);
  var root=document.getElementById('app');
  function save(){localStorage.setItem('exclusive-drop_cr',credits);}
  function left(){var e=new Date();e.setHours(24,0,0,0);var ms=e-Date.now();var h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000),s=Math.floor((ms%60000)/1000);
    return [h,m,s].map(function(x){return String(x).padStart(2,'0')}).join(':');}
  function render(){
    root.innerHTML='<div class="card" style="border-color:#f472b6"><b>18+</b> Fictional drop · 실결제 아님</div>'
      +'<div class="card">크레딧 <b style="color:var(--gold)">'+credits+'</b><div style="font-size:28px;margin:10px 0" id="cd">'+left()+'</div>'
      +'<button id="claim">드롭 수령 (-2)</button><button class="sec" id="free">무료 +2 (일1)</button><div id="log" class="sub" style="margin-top:8px"></div></div>';
    document.getElementById('claim').onclick=function(){
      if(credits<2){document.getElementById('log').textContent='크레딧 부족';return;}
      credits-=2;save();document.getElementById('log').textContent='드롭 수령 · 가상 아이템 #'+Math.floor(Math.random()*900+100);
      render();try{legionTrack('activate',{})}catch(e){}
    };
    document.getElementById('free').onclick=function(){
      var k='ed_free_'+new Date().toDateString(); if(localStorage.getItem(k)){document.getElementById('log').textContent='오늘 완료';return;}
      localStorage.setItem(k,'1');credits+=2;save();render();try{legionTrack('activate',{free:1})}catch(e){}
    };
  }
  try{legionTrack('session_start',{})}catch(e){}
  render(); setInterval(function(){var el=document.getElementById('cd'); if(el)el.textContent=left();},1000);
})();
