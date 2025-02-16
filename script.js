document.addEventListener("DOMContentLoaded", function () { const quizContainer = document.getElementById("quiz-container"); const questionElement = document.getElementById("question"); const optionsContainer = document.getElementById("options-container"); const resultElement = document.getElementById("result"); const restartButton = document.getElementById("restart");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Carregar perguntas de um JSON externo
fetch("questions.json")
    .then(response => response.json())
    .then(data => {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("JSON inválido ou vazio.");
        }
        questions = data;
        showQuestion();
    })
    .catch(error => {
        console.error("Erro ao carregar as perguntas:", error);
        resultElement.textContent = "Erro ao carregar o quiz. Tente novamente mais tarde.";
        resultElement.style.color = "red";
    });

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showFinalResult();
        return;
    }

    const question = questions[currentQuestionIndex];
    if (!question || !question.options || question.answer === undefined) {
        console.error("Erro: Pergunta inválida.");
        resultElement.textContent = "Erro interno: pergunta inválida.";
        resultElement.style.color = "red";
        return;
    }

    questionElement.textContent = question.question;
    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.setAttribute("aria-label", `Opção ${index + 1}: ${option}`);
        button.addEventListener("click", () => checkAnswer(index));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    if (!question || !question.options || question.answer === undefined) {
        console.error("Erro: Resposta não definida.");
        resultElement.textContent = "Erro interno: resposta não encontrada.";
        resultElement.style.color = "red";
        return;
    }

    if (selectedIndex === question.answer) {
        score++;
        resultElement.textContent = "Correto!";
        resultElement.style.color = "green";
    } else {
        resultElement.textContent = `Errado! A resposta correta era: ${question.options[question.answer]}`;
        resultElement.style.color = "red";
    }

    currentQuestionIndex++;
    setTimeout(showQuestion, 1000);
}

function showFinalResult() {
    questionElement.textContent = "Quiz Finalizado!";
    optionsContainer.innerHTML = "";
    resultElement.textContent = `Você acertou ${score} de ${questions.length} perguntas!`;
    resultElement.style.color = "white";
    restartButton.style.display = "block";
}

restartButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    resultElement.textContent = "";
    restartButton.style.display = "none";
    showQuestion();
});

});

