// static/js/quiz.js

document.addEventListener('DOMContentLoaded', function () {
    const totalQuestions = 15;
    let currentQuestion = 1;
  
    const questionAnswers = JSON.parse(
      document.getElementById('quiz-data').textContent
    );
  
    function showQuestion(questionNumber) {
      document.querySelectorAll('.question-container').forEach((q, idx) => {
        q.style.display = idx === questionNumber - 1 ? 'block' : 'none';
      });
  
      document.getElementById('current-question').textContent = questionNumber;
      document.getElementById('prev-button').style.display = questionNumber > 1 ? 'block' : 'none';
      document.getElementById('next-button').style.display = questionNumber < totalQuestions ? 'block' : 'none';
      document.getElementById('submit-button').style.display = questionNumber === totalQuestions ? 'block' : 'none';
  
      updateProgress();
    }
  
    document.getElementById('next-button').addEventListener('click', function () {
      if (currentQuestion <= 3) {
        const selected = document.querySelector(`.question-container:nth-child(${currentQuestion}) .clickable-muscle.selected`);
        if (!selected || selected.dataset.muscle !== questionAnswers[currentQuestion].muscle) {
          alert('Please select the correct muscle before continuing.');
          return;
        }
      } else {
        const select = document.querySelector(`.question-container:nth-child(${currentQuestion}) select`);
        if (!select || !select.value) {
          alert('Please choose an answer.');
          return;
        }
      }
      if (currentQuestion < totalQuestions) {
        currentQuestion++;
        showQuestion(currentQuestion);
      }
    });
  
    document.getElementById('prev-button').addEventListener('click', function () {
      if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
      }
    });
  
    function updateProgress() {
      let answered = 0;
      document.querySelectorAll('.question-container').forEach((q, i) => {
        if (i < 3) {
          const sel = q.querySelector('.clickable-muscle.selected');
          if (sel && sel.dataset.muscle === questionAnswers[i + 1].muscle) answered++;
        } else {
          const sel = q.querySelector('select');
          if (sel && sel.value) answered++;
        }
      });
      const percent = (answered / totalQuestions) * 100;
      const progress = document.getElementById('quiz-progress');
      progress.style.width = `${percent}%`;
      progress.textContent = `${answered}/${totalQuestions} Questions Answered`;
    }
  
    // Setup muscle click handlers
    document.querySelectorAll('.clickable-muscle').forEach((m) => {
      m.addEventListener('click', function () {
        const q = m.closest('.question-container');
        q.querySelectorAll('.clickable-muscle').forEach((x) => x.classList.remove('selected'));
        m.classList.add('selected');
      });
    });
  
    // Initial render
    showQuestion(currentQuestion);
  });
    