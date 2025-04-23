let answers = JSON.parse(sessionStorage.getItem('quizAnswers')) || {
    q1: [],
    q2: [],
    q3: [],
    q4: [],
    q5: [],
    q6: []
};

function selectOption(element, style, questionNum) {
    const questionKey = `q${questionNum}`;
    const isSelected = element.classList.contains('selected');

    if (isSelected) {
        element.classList.remove('selected');
        answers[questionKey] = answers[questionKey].filter(s => s !== style);
    } else {
        element.classList.add('selected');
        answers[questionKey].push(style);
    }
    sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
}

function restoreSelections(questionNum) {
    const questionKey = `q${questionNum}`;
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        const style = option.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (answers[questionKey].includes(style)) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

function nextQuestion(currentQuestion, totalQuestions) {
    const questionKey = `q${currentQuestion}`;
    if (answers[questionKey].length === 0) {
        alert('Please select at least one option before moving on!');
        return;
    }
    sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
    if (currentQuestion < totalQuestions) {
        window.location.href = `question${currentQuestion + 1}.html`;
    } else {
        submitQuizToServer();
        window.location.href = 'result.html';
    }
}

function prevQuestion(currentQuestion) {
    sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
    if (currentQuestion > 1) {
        window.location.href = `question${currentQuestion - 1}.html`;
    } else {
        window.location.href = 'form.html';
    }
}

function updateProgress(currentQuestion, totalQuestions) {
    const progressBar = document.getElementById('progress-bar');
    const progressDots = document.querySelectorAll('.progress-dot');
    const progressPercentage = ((currentQuestion - 1) / totalQuestions) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressDots.forEach((dot, index) => {
        if (index < currentQuestion) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function submitQuizToServer() {
    const userName = sessionStorage.getItem('userName');
    const userEmail = sessionStorage.getItem('userEmail');
    const data = {
        name: userName,
        email: userEmail,
        answers: JSON.stringify(answers)
    };

    fetch('submit_quiz.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data).toString()
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            console.log('Quiz submitted successfully');
        } else {
            console.error('Error:', result.error);
        }
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}