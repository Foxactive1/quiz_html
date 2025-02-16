document.addEventListener("DOMContentLoaded", async function () {
    const questionEl = document.getElementById("question");
    const optionsContainer = document.getElementById("options-container");
    const resultEl = document.getElementById("result");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // Carregar perguntas do JSON
    async function loadQuestions() {
        try {
            const response = await fetch("questions.json");
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

    // Iniciar carregamento
    loadQuestions();
});
