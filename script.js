document.addEventListener('DOMContentLoaded', function() {
    
    // Quiz Data (Questions, Answers, Concepts, Remediation)
    const quizData = [
        {
            id: 1,
            question: "기술은 단순히 기계나 도구만을 의미하며, 만드는 과정이나 지식은 포함되지 않는다.",
            answer: "X", // False
            concept: "기술의 정의",
            remediation: "기술은 단순한 도구뿐만 아니라, 문제를 해결하고 대상을 변화시키는 모든 '활동', '지식', '수단'을 포괄하는 광범위한 개념입니다."
        },
        {
            id: 2,
            question: "3D 프린터나 스마트 공장은 재료를 가공하여 제품을 만드는 '제조 기술'에 해당한다.",
            answer: "O", // True
            concept: "제조 기술",
            remediation: "맞습니다. 제조 기술은 원자재를 가공하여 인간에게 유용한 제품으로 변환하는 모든 기술적 활동을 말합니다."
        },
        {
            id: 3,
            question: "생명 기술은 식물이나 동물 등 생명체만을 대상으로 하며, 식품 생산과는 관련이 없다.",
            answer: "X", // False
            concept: "생명 기술",
            remediation: "생명 기술은 의료뿐만 아니라 농업, 식품 생산(발효 식품, 유전자 변형 작물 등) 등 다양한 분야에서 활용됩니다."
        },
        {
            id: 4,
            question: "수송 기술은 단순히 이동하는 것뿐만 아니라, 효율적이고 안전한 이동을 위한 시스템을 포함한다.",
            answer: "O", // True
            concept: "수송 기술",
            remediation: "정확합니다. 수송 기술은 이동 수단, 이동통로, 지원 시설, 그리고 이를 운영하는 시스템 전체를 포함합니다."
        },
        {
            id: 5,
            question: "초고층 빌딩을 짓는 것은 '통신 기술'의 대표적인 사례이다.",
            answer: "X", // False
            concept: "건설 기술",
            remediation: "초고층 빌딩, 댐, 교량 등을 짓는 것은 '건설 기술'의 영역입니다. 통신 기술은 정보를 전달하는 기술입니다."
        }
    ];

    const quizContainer = document.getElementById('quiz-items');
    const quizForm = document.getElementById('quiz-form');
    const feedbackSection = document.getElementById('feedback-section');
    const scoreDisplay = document.getElementById('score-display');
    const diagnosticMsg = document.getElementById('diagnostic-msg');
    const remediationContent = document.getElementById('remediation-content');
    const errorMsg = document.getElementById('error-msg');
    const nextLessonSection = document.getElementById('next-lesson');

    // 1. Render Questions
    function renderQuiz() {
        quizData.forEach((item, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-item';
            
            questionDiv.innerHTML = `
                <span class="question-text">Q${index + 1}. ${item.question}</span>
                <div class="options">
                    <label>
                        <input type="radio" name="q${item.id}" value="O"> O (그렇다)
                    </label>
                    <label>
                        <input type="radio" name="q${item.id}" value="X"> X (아니다)
                    </label>
                </div>
            `;
            quizContainer.appendChild(questionDiv);
        });
    }

    renderQuiz();

    // 2. Handle Submission
    quizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset state
        errorMsg.style.display = 'none';
        remediationContent.innerHTML = '';
        
        // Use FormData to get answers
        const formData = new FormData(quizForm);
        let score = 0;
        let answeredCount = 0;
        let incorrectItems = [];

        // Check each question
        for (let i = 0; i < quizData.length; i++) {
            const item = quizData[i];
            const userAnswer = formData.get(`q${item.id}`);

            if (!userAnswer) {
                errorMsg.style.display = 'block';
                return; // Stop processing if incomplete
            }

            answeredCount++;
            if (userAnswer === item.answer) {
                score++;
            } else {
                incorrectItems.push({
                    ...item,
                    userAnswer: userAnswer
                });
            }
        }

        // 3. Display Results
        displayFeedback(score, incorrectItems);
    });

    // 4. Feedback Logic
    function displayFeedback(score, incorrectItems) {
        // Show section
        feedbackSection.style.display = 'block';
        nextLessonSection.classList.add('active'); // Emphasize next lesson
        
        // Calculate Percentage
        const total = quizData.length;
        const percentage = (score / total) * 100;

        // Score Display
        scoreDisplay.textContent = `점수: ${score} / ${total}`;
        
        // Diagnostic Message
        let message = "";
        let colorClass = "";
        
        if (percentage === 100) {
            message = "훌륭합니다! 학습 내용을 완벽하게 이해하셨습니다.";
            colorClass = "text-success";
        } else if (percentage >= 60) {
            message = "잘했습니다! 일부 헷갈리는 개념만 다시 확인해봅시다.";
            colorClass = "text-warning";
        } else {
            message = "학습 내용의 복습이 필요합니다. 아래 보충 설명을 꼼꼼히 읽어보세요.";
            colorClass = "text-danger";
        }
        diagnosticMsg.textContent = message;

        // Remediation Content (Only for incorrect answers)
        if (incorrectItems.length > 0) {
            incorrectItems.forEach(item => {
                const div = document.createElement('div');
                div.className = 'remediation-item';
                div.innerHTML = `
                    <span class="concept-tag">${item.concept}</span>
                    <p><strong>문제:</strong> ${item.question}</p>
                    <p style="color:red;">당신의 답: ${item.userAnswer} ➜ 정답: ${item.answer}</p>
                    <p style="margin-top:0.5rem; background-color:#f9f9f9; padding:0.5rem; border-radius:4px;">
                        💡 <strong>보충 설명:</strong> ${item.remediation}
                    </p>
                `;
                remediationContent.appendChild(div);
            });
        } else {
            remediationContent.innerHTML = '<p style="text-align:center; color: var(--accent-color);">틀린 문제가 없습니다. 완벽합니다!</p>';
        }

        // Scroll to feedback
        feedbackSection.scrollIntoView({ behavior: 'smooth' });
    }
});
