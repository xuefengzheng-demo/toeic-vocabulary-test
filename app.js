class ToeicApp {
    constructor() {
        this.currentQuestions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.timer = null;
        this.timeLimit = 15; // seconds per question

        this.screens = {
            start: document.getElementById('start-screen'),
            quiz: document.getElementById('quiz-screen'),
            result: document.getElementById('result-screen')
        };

        this.elements = {
            progress: document.getElementById('progress'),
            timerFill: document.getElementById('timer-fill'),
            timerText: document.getElementById('timer-text'),
            question: document.getElementById('question-text'),
            options: document.getElementById('options'),
            finalScore: document.getElementById('final-score'),
            resultMsg: document.getElementById('result-message'),
            resultDesc: document.getElementById('result-desc'),
            explanationContainer: document.getElementById('explanation-container'),
            explanation: document.getElementById('explanation-text')
        };
    }

    showScreen(screenId) {
        Object.values(this.screens).forEach(s => s.classList.add('hidden'));
        this.screens[screenId].classList.remove('hidden');
    }

    startQuiz(category) {
        const pool = toeicQuestions[category] || [];
        if (pool.length === 0) {
            alert('该分类暂无题目');
            return;
        }

        // Shuffle and pick up to 10
        this.currentQuestions = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
        this.currentIndex = 0;
        this.score = 0;
        this.showScreen('quiz');
        this.loadQuestion();
    }

    loadQuestion() {
        const q = this.currentQuestions[this.currentIndex];
        this.elements.progress.innerText = `第 ${this.currentIndex + 1}/${this.currentQuestions.length} 题`;
        this.elements.question.innerText = q.question;
        this.elements.explanationContainer.classList.add('hidden');

        this.elements.options.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => this.checkAnswer(idx);
            this.elements.options.appendChild(btn);
        });

        this.startTimer();
    }

    startTimer() {
        clearInterval(this.timer);
        let timeLeft = this.timeLimit;
        this.elements.timerFill.style.width = '100%';
        this.elements.timerFill.style.background = 'var(--secondary)';
        this.elements.timerText.innerText = `${timeLeft}s`;

        this.timer = setInterval(() => {
            timeLeft--;
            this.elements.timerText.innerText = `${timeLeft}s`;
            const percentage = (timeLeft / this.timeLimit) * 100;
            this.elements.timerFill.style.width = `${percentage}%`;

            if (timeLeft <= 5) {
                this.elements.timerFill.style.background = 'var(--error)';
            }

            if (timeLeft <= 0) {
                clearInterval(this.timer);
                this.checkAnswer(-1); // Timeout
            }
        }, 1000);
    }

    checkAnswer(choiceIdx) {
        clearInterval(this.timer);
        const q = this.currentQuestions[this.currentIndex];
        const buttons = this.elements.options.querySelectorAll('.option-btn');

        if (choiceIdx === q.correct) {
            this.score += 10;
            if (choiceIdx !== -1) buttons[choiceIdx].classList.add('correct');
        } else {
            if (choiceIdx !== -1) buttons[choiceIdx].classList.add('wrong');
            buttons[q.correct].classList.add('correct');
        }

        // Disable all buttons
        buttons.forEach(b => b.disabled = true);

        // Show explanation
        setTimeout(() => {
            this.elements.explanation.innerText = q.explanation;
            this.elements.explanationContainer.classList.remove('hidden');
        }, 400);
    }

    nextQuestion() {
        this.elements.explanationContainer.classList.add('hidden');
        this.currentIndex++;
        if (this.currentIndex < this.currentQuestions.length) {
            this.loadQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        this.showScreen('result');
        this.elements.finalScore.innerText = this.score;

        let msg = '';
        let desc = '';
        const total = this.currentQuestions.length * 10;
        const ratio = this.score / total;

        if (ratio >= 0.9) {
            msg = '卓越 (Excellent)';
            desc = '你的托业词汇水平非常出色，足以应对复杂的商务环境。';
        } else if (ratio >= 0.7) {
            msg = '优秀 (Great)';
            desc = '掌握情况良好，继续保持，职场沟通无障碍。';
        } else if (ratio >= 0.6) {
            msg = '合格 (Pass)';
            desc = '基本功尚可，建议加强核心商务词汇的深度记忆。';
        } else {
            msg = '需加油 (Keep Going)';
            desc = '托业词汇需要系统积累，建议每天坚持复习。';
        }

        this.elements.resultMsg.innerText = msg;
        this.elements.resultDesc.innerText = desc;
    }
}

const app = new ToeicApp();
document.addEventListener('DOMContentLoaded', () => {
    // App is ready
});
