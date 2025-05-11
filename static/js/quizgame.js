// Questions
const questions = [
    {question:"Which muscle helps flex the elbow?",options:["Biceps brachii","Triceps brachii","Deltoid","Latissimus dorsi"],correct:0,category:"upper"},
    {question:"Which isolation movement trains the chest?",options:["Chest fly","Push-up","Dumbbell bench press","Barbell bench press"],correct:0,category:"upper"},
    {question:"Which exercise primarily targets the calves?",options:["Standing calf raise","Leg curl","Plank","Barbell row"],correct:0,category:"lower"},
    {question:"Which movement best develops the trapezius?",options:["Barbell shrug","Preacher curl","Leg extension","Lat pulldown"],correct:0,category:"upper"},
    {question:"The pectoralis major is activated during?",options:["Bench press","Deadlift","Barbell row","Hip thrust"],correct:0,category:"upper"},
    {question:"Primary hamstring movement?",options:["Knee flexion","Hip abduction","Shoulder adduction","Elbow extension"],correct:0,category:"lower"},
    {question:"Which exercise targets the biceps?",options:["Barbell curl","Push-up","Deadlift","Leg extension"],correct:0,category:"upper"},
    {question:"Compound leg exercise?",options:["Barbell squat","Seated calf raise","Leg curl","Hip abduction machine"],correct:0,category:"lower"},
    {question:"Best core stabilization move?",options:["Plank","Leg press","Lateral raise","Leg curl"],correct:0,category:"upper"},
    {question:"Bodyweight for triceps?",options:["Close-grip push-up","Pull-up","Bodyweight squat","Jumping jacks"],correct:0,category:"upper"}
  ];
  
  // State
  let currentQuestion=0, score=0, streak=0, timeLeft=60, timer, startTime, responseTimes=[], selectedCategory='all';
  
  // Shuffle util
  function shuffleArray(arr){ for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }}
  
  // Start
  function startGame(){ 
    shuffleArray(questions); 
    currentQuestion=0; 
    score=0; 
    streak=0; 
    timeLeft=60; 
    responseTimes=[]; 
    document.getElementById('questionContainer').classList.add('active');
    document.getElementById('startGame').style.display='none'; 
    document.getElementById('tryAgain').style.display='none'; 
    document.getElementById('resultsContainer').style.display='none'; 
    updateDisplay(); showQuestion(); startTimer(); 
  }
  
  // Timer
  function startTimer(){ 
    document.getElementById('timer').textContent=timeLeft; 
    document.getElementById('timerBarFill').style.width=(timeLeft/60*100)+'%'; timer=setInterval(()=>{ timeLeft--; 
    document.getElementById('timer').textContent=timeLeft; document.getElementById('timerBarFill').style.width=(timeLeft/60*100)+'%'; 
    if(timeLeft<=0) endGame(); },1000); 
  }
  
  // Show question + shuffle answers
  function showQuestion(){ 
    document.getElementById('questionContainer').classList.add('active');
    const bucket=questions.filter(q=>selectedCategory==='all'||q.category===selectedCategory); 
    if(currentQuestion>=bucket.length) return endGame(); 
    const q=bucket[currentQuestion]; 
    document.getElementById('questionText').textContent=q.question; 
    const optsArr=q.options.map((opt,i)=>( {text:opt,isCorrect:i===q.correct} )); 
    shuffleArray(optsArr); 
    const container=document.getElementById('answerOptions'); 
    container.innerHTML=''; 
    optsArr.forEach(optObj=>{ const btn=document.createElement('button'); 
    btn.className='answer-option'; 
    btn.textContent=optObj.text; btn.dataset.correct=optObj.isCorrect; 
    btn.onclick=()=>checkAnswer(btn); container.appendChild(btn); }); 
    startTime=Date.now(); 
  }
  
  // Check answer
  function checkAnswer(btn){  
    const opts=document.querySelectorAll('.answer-option'); 
    opts.forEach(b=>b.disabled=true); 
    const isCorrect=btn.dataset.correct==='true'; 
    const rt=(Date.now()-startTime)/1000; 
    responseTimes.push(rt); 
  
    if(isCorrect){ 
      btn.classList.add('correct-flash'); score+=10 + (rt<3?5:0); 
      streak++; 
      if(streak>1) showCombo(); 
    } 
    else { 
      btn.classList.add('shake'); const correctBtn=document.querySelector('.answer-option[data-correct="true"]'); 
      correctBtn.classList.add('correct-flash'); 
      score=Math.max(0,score-5); 
      streak=0; 
    } 
    updateDisplay(); 
    setTimeout(() => { currentQuestion++; showQuestion(); }, 800); 
  }
  
  // Update display
  function updateDisplay(){ 
    document.getElementById('score').textContent=score; 
    document.getElementById('streak').textContent=streak; 
  }
  
  // Combo
  function showCombo(){ 
    const combo=document.getElementById('comboBar657'); 
    combo.textContent=`🔥 Streak x${streak}!`; 
    combo.style.display='block'; 
    setTimeout(()=>combo.style.display='none',800); 
  }
  
  // End game
  function endGame(){ 
    clearInterval(timer); 
    document.getElementById('finalScore').textContent=score; 
    document.getElementById('correctAnswers').textContent=responseTimes.filter(t=>t<3).length; 
    document.getElementById('avgResponseTime').textContent=((responseTimes.reduce((a,b)=>a+b,0)/responseTimes.length)||0).toFixed(2); 
    document.getElementById('bestStreak').textContent=streak; document.getElementById('resultsContainer').style.display='block'; 
    document.getElementById('tryAgain').style.display='inline-block'; 
    updateLeaderboard(); 
  }
  
  // Leaderboard
  function updateLeaderboard(){ 
    let lb=JSON.parse(localStorage.getItem('leaderboard')||'[]'); 
    lb.push({score,date:new Date().toLocaleDateString()}); 
    lb.sort((a,b)=>b.score-a.score); lb=lb.slice(0,5); 
    localStorage.setItem('leaderboard',JSON.stringify(lb)); 
    document.getElementById('leaderboard').innerHTML=lb.map((e,i)=>`<div class="leaderboard-item">${i+1}. ${e.score}pts (${e.date})</div>`).join(''); 
  }
  
  // Listeners
  document.getElementById('startGame').onclick=startGame; 
  document.getElementById('tryAgain').onclick=startGame; 
  document.querySelectorAll('.category-filter button').forEach(btn=>btn.onclick=e=>{ selectedCategory=e.target.dataset.category; 
  document.querySelectorAll('.category-filter button').forEach(b=>b.classList.remove('active')); 
  e.target.classList.add('active'); });