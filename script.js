document.addEventListener("DOMContentLoaded", async function () {
    const questionEl = document.getElementById("question");
    const optionsContainer = document.getElementById("options-container");
    const resultEl = document.getElementById("result");
    const quizContainer = document.getElementById("quiz-container");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // Carregar perguntas do JSON
    async function loadQuestions() {
        try {
            // Mostrar indicador de carregamento
            quizContainer.innerHTML = "<p>Carregando perguntas...</p>";
            const response = await fetch("./questions.json");
            questions = await response.json();
            showQuestion();
        } catch (error) {
            console.error("Erro ao carregar as perguntas:", error);
            questionEl.textContent = "Erro ao carregar as perguntas.";
        }
    }

    // Exibir pergunta atual
    function showQuestion() {
        if (currentQuestionIndex >= questions.length) {
            resultEl.textContent = `Você acertou ${score} de ${questions.length} perguntas!`;
            questionEl.textContent = "Fim do questionário!";
            optionsContainer.innerHTML = "";
            saveProgress();  // Salvar o progresso no localStorage
            return;
        }

        let questionData = questions[currentQuestionIndex];
        questionEl.textContent = questionData.question;
        optionsContainer.innerHTML = "";

        questionData.options.forEach((option, index) => {
            let button = document.createElement("button");
            button.textContent = option;
            button.onclick = () => checkAnswer(index);
            optionsContainer.appendChild(button);
        });
    }

    // Verificar resposta
    function checkAnswer(selectedIndex) {
        if (selectedIndex === questions[currentQuestionIndex].answer) {
            score++;
        }
        currentQuestionIndex++;
        showQuestion();
    }

    // Salvar progresso no localStorage
    function saveProgress() {
        localStorage.setItem("quizScore", score);
        localStorage.setItem("quizIndex", currentQuestionIndex);
    }

    // Carregar progresso do localStorage
    function loadProgress() {
        score = localStorage.getItem("quizScore") || 0;
        currentQuestionIndex = localStorage.getItem("quizIndex") || 0;
    }

    // Iniciar carregamento das perguntas
    loadProgress(); // Carregar progresso se houver
    loadQuestions();
});
