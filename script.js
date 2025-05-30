// Elementos do DOM
const quizContainer = document.getElementById('quiz-container');
const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const feedbackEl = document.getElementById('feedback');
const resultContainer = document.getElementById('result-container');
const resultEl = document.getElementById('result');
const scoreDisplay = document.getElementById('score-display');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

// Estado do quiz
let questions = [];
let currentQuestion = 0;
let score = 0;

// Carregar questões do JSON
function loadQuestions() {
    fetch('./questions.json')
        .then(res => res.json())
        .then(data => {
            questions = data;
            initQuiz();
        })
        .catch(error => {
            console.error('Erro ao carregar questões:', error);
            questionEl.textContent = "Erro ao carregar questões.";
        });
}

// Inicializar quiz
function initQuiz() {
    currentQuestion = 0;
    score = 0;
    resultContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    feedbackEl.style.display = 'none';
    loadQuestion();
}

// Carregar uma pergunta
function loadQuestion() {
    const q = questions[currentQuestion];

    // Atualizar texto e barra de progresso
    questionEl.textContent = q.question;
    progressText.textContent = `Pergunta ${currentQuestion + 1} de ${questions.length}`;
    progressFill.style.width = `${(currentQuestion / questions.length) * 100}%`;

    // Renderizar opções
    optionsContainer.innerHTML = '';
    q.options.forEach((option, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span class="option-icon">${String.fromCharCode(65 + i)}</span> ${option}`;
        btn.addEventListener('click', () => checkAnswer(i));
        optionsContainer.appendChild(btn);
    });

    feedbackEl.style.display = 'none';
}

// Verificar resposta
function checkAnswer(selected) {
    const q = questions[currentQuestion];
    const buttons = document.querySelectorAll('.option-btn');

    // Bloquear clique
    buttons.forEach(btn => btn.disabled = true);

    // Mostrar feedback
    if (selected === q.answer) {
        feedbackEl.textContent = "Correto! 🎉";
        feedbackEl.className = "feedback correct";
        score++;
    } else {
        feedbackEl.textContent = `Incorreto! A resposta correta é: ${q.options[q.answer]}`;
        feedbackEl.className = "feedback incorrect";
    }

    feedbackEl.style.display = 'block';

    // Estilizar a resposta correta
    buttons[q.answer].style.backgroundColor = "rgba(0, 200, 83, 0.3)";
    buttons[q.answer].style.borderColor = "#69f0ae";

    // Avançar para próxima pergunta
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 2000);
}

// Mostrar resultados finais
function showResults() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    const percent = Math.round((score / questions.length) * 100);
    resultEl.textContent = getResultTitle(percent);
    messageEl.textContent = getResultMessage(percent);

    let count = 0;
    const interval = setInterval(() => {
        if (count <= percent) {
            scoreDisplay.textContent = `${count}%`;
            count++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

// Mensagens personalizadas
function getResultTitle(percent) {
    if (percent >= 80) return "Excelente! 🏆";
    if (percent >= 60) return "Bom trabalho! 👍";
    if (percent >= 40) return "Continue praticando! 💪";
    return "Vamos estudar mais! 📚";
}

function getResultMessage(percent) {
    if (percent >= 80) return "Você demonstrou um conhecimento avançado de desenvolvimento web!";
    if (percent >= 60) return "Você tem um bom entendimento de desenvolvimento web!";
    if (percent >= 40) return "Você conhece o básico, mas pode melhorar!";
    return "Recomendamos revisar os conceitos básicos de desenvolvimento web.";
}

// Reiniciar
restartBtn.addEventListener('click', initQuiz);

// Início
window.addEventListener('DOMContentLoaded', loadQuestions);