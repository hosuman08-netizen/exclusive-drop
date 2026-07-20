(function(){
  var credits=+(localStorage.getItem('exclusive-drop_cr')||10);
  var root=document.getElementById('app');
  var SHARE_BASE='https://hosuman08-netizen.github.io/exclusive-drop/';
  var lastDrop='';
  function save(){localStorage.setItem('exclusive-drop_cr',credits);}
  function dayKey(off){var d=new Date();d.setDate(d.getDate()+(off||0));return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  function kId(){try{var id=localStorage.getItem('ed_k_id');if(!id){id='e'+Math.random().toString(36).slice(2,8);localStorage.setItem('ed_k_id',id);}return id;}catch(e){return 'share';}}
  function shareUrl(){return SHARE_BASE+'?utm_source=share&utm_medium=app&ref='+encodeURIComponent(kId());}
  function hist(){try{return JSON.parse(localStorage.getItem('ed_hist')||'[]');}catch(e){return[];}}
  function pushHist(n){
    try{
      var h=hist(); h.unshift({n:n,t:Date.now(),d:dayKey(0)});
      localStorage.setItem('ed_hist',JSON.stringify(h.slice(0,10)));
      var best=+(localStorage.getItem('ed_best')||0);
      if(n>best) localStorage.setItem('ed_best',String(n));
    }catch(e){}
  }
  function todayClaims(){try{return +(localStorage.getItem('ed_day_'+dayKey(0))||0);}catch(e){return 0;}}
  function bumpToday(){try{localStorage.setItem('ed_day_'+dayKey(0),String(todayClaims()+1));}catch(e){}}
  function bumpStreak(){
    try{
      var st=JSON.parse(localStorage.getItem('ed_streak')||'{}');
      if(!st||typeof st!=='object')st={last:null,count:0};
      var t=dayKey(0); if(st.last===t) return st;
      var y=dayKey(-1),y2=dayKey(-2),froze=false;
      if(st.last&&st.last!==y&&st.last===y2&&(st.count||0)>=3){
        var ready=!st.shieldLast||((new Date(t)-new Date(st.shieldLast))/86400000)>=7;
        if(ready){st.shieldLast=t;st.last=y;froze=true;try{legionTrack('streak_freeze',{count:st.count})}catch(e){}}
      }
      st.count=(st.last===y)?(st.count||0)+1:1; st.last=t;
      localStorage.setItem('ed_streak',JSON.stringify(st));
      try{legionTrack('streak',{count:st.count,froze:froze})}catch(e){}
      return st;
    }catch(e){return {count:0};}
  }
  function left(){var e=new Date();e.setHours(24,0,0,0);var ms=Math.max(0,e-Date.now());var h=Math.floor(ms/3600000),m=Math.floor((ms%3600000)/60000),s=Math.floor((ms%60000)/1000);
    return [h,m,s].map(function(x){return String(x).padStart(2,'0')}).join(':');}
  function render(){
    var st=JSON.parse(localStorage.getItem('ed_streak')||'{}');
    var sc=st.count||0;
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast))/86400000)>=7;
    var h=hist();
    var best=+(localStorage.getItem('ed_best')||0);
    root.innerHTML='<div class="card" style="border-color:#f472b6"><b>18+</b> Fictional drop · 실결제 아님</div>'
      +'<div class="card">크레딧 <b style="color:var(--gold)">'+credits+'</b> · 🔥 '+sc+'일'+(sc>=3&&ready?' · 🛡️':'')
      +' · 오늘 '+todayClaims()+'회'+(best?' · best #'+best:'')
      +'<div style="font-size:28px;margin:10px 0" id="cd">'+left()+'</div>'
      +'<button id="claim">드롭 수령 (-2)</button><button class="sec" id="free">무료 +2 (일1)</button>'
      +'<div id="log" class="sub" style="margin-top:8px">'+(lastDrop||'첫 드롭을 수령하세요')+'</div>'
      +(h.length?'<div class="sub" style="margin-top:8px">최근: '+h.slice(0,5).map(function(x){return '#'+x.n;}).join(' · ')+'</div>':'')
      +'<div id="sharePeak" style="display:none;margin-top:10px;padding:10px;border:1px solid #f472b644;border-radius:12px"><button class="sec" id="shareBtn">📤 드롭 공유</button></div>'
      +'<div id="moneyPipe" style="margin-top:12px;padding:10px;border:1px solid #c5a46e44;border-radius:12px;background:#16121c;text-align:center;font-size:12px">'
      +'<div style="color:#e0b552;font-weight:700;margin-bottom:4px">💎 크레딧 · 후원 (18+ 엔터)</div>'
      +'<a style="color:#ece8f1;margin:0 6px" href="mailto:hoyashi95@gmail.com?subject=%5BDrop%5D%20support">☕ 후원</a>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/soft-paywall/?utm_source=drop&utm_medium=pipe">🔒 Soft Paywall</a>'
      +'<a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=drop&utm_medium=pipe">🎮 Arcade</a></div></div>';
    document.getElementById('claim').onclick=function(){
      if(credits<2){document.getElementById('log').textContent='크레딧 부족 · 무료+2 또는 후원';try{legionTrack('money_pipe_shown',{app:'drop',empty:1})}catch(e){}return;}
      credits-=2;save();var n=Math.floor(Math.random()*900+100); var c=+(localStorage.getItem('ed_claimed')||0)+1; localStorage.setItem('ed_claimed',c);
      pushHist(n); bumpToday();
      lastDrop='드롭 #'+n+' · 누적 '+c+'회 · 정진'; bumpStreak(); render();
      document.getElementById('sharePeak').style.display='block';
      try{legionTrack('activate',{})}catch(e){} try{legionTrack('share_peak_shown',{})}catch(e){} try{legionTrack('money_pipe_shown',{app:'drop'})}catch(e){}
    };
    document.getElementById('free').onclick=function(){
      var k='ed_free_'+new Date().toDateString(); if(localStorage.getItem(k)){document.getElementById('log').textContent='오늘 완료';return;}
      localStorage.setItem(k,'1');credits+=2;save();render();try{legionTrack('activate',{free:1})}catch(e){}
    };
    var sb=document.getElementById('shareBtn');
    if(sb) sb.onclick=function(){
      var text=(lastDrop||'Exclusive Drop')+' (fictional 18+)\n'+shareUrl();
      if(navigator.share)navigator.share({text:text,url:shareUrl()}).catch(function(){});
      else if(navigator.clipboard)navigator.clipboard.writeText(text);
      try{legionTrack('share_peak',{})}catch(e){}
    };
  }
  try{var q=new URLSearchParams(location.search||'');var ref=q.get('ref');if(ref&&ref!=='share'&&ref!==kId()&&!localStorage.getItem('ed_k_from')){localStorage.setItem('ed_k_from',ref);try{legionTrack('k_link',{from:ref})}catch(e){}}}catch(e){}
  try{legionTrack('session_start',{})}catch(e){}
  render(); setInterval(function(){var el=document.getElementById('cd'); if(el)el.textContent=left();},1000);
})();

/* LEGION_WAVE_30_pipe_ensure */ /* pipe already present wave 30 */

/* LEGION_WAVE_75_share_counter */
document.addEventListener('click',function(ev){try{var el=ev.target;if(!el)return;var tx=(el.textContent||'')+(el.id||'');if(/share|copy/i.test(tx)||/\uacf5\uc720|\ubcf5\uc0ac/.test(tx)){localStorage.setItem('lw_p36_exclusiv_share_counter',String((+(localStorage.getItem('lw_p36_exclusiv_share_counter')||0))+1));}}catch(e){}},true);
