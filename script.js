let answers = JSON.parse(sessionStorage.getItem('quizAnswers')) || {
    q1: [],
    q2: [],
    q3: [],
    q4: [],
    q5: []
};

function selectOption(element, style, questionNum) {
    const questionKey = `q${questionNum}`;
    const isSelected = element.classList.contains('selected');

    if (isSelected) {
        element.classList.remove('selected');
        answers[questionKey] = answers[questionKey].filter(s => s !== style);
    } else {
        if (answers[questionKey].length >= 2) {
            alert('You can select up to 2 options only. Deselect an option to choose another.');
            return;
        }
        element.classList.add('selected');
        answers[questionKey].push(style);
    }
    sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
    console.log(`Question ${questionNum} selections:`, answers[questionKey]); // Debug
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
    console.log(`Checking selections for Q${currentQuestion}:`, answers[questionKey]); // Debug
    if (!Array.isArray(answers[questionKey]) || answers[questionKey].length === 0) {
        alert('Please select at least one option before moving on!');
        return;
    }
    sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
    if (currentQuestion < totalQuestions) {
        console.log(`Navigating to question${currentQuestion + 1}.html`); // Debug
        window.location.href = `question${currentQuestion + 1}.html`;
    } else {
        console.log('Navigating to results.html'); // Debug
        window.location.href = 'results.html';
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
    const progressPercentage = (currentQuestion / totalQuestions) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressDots.forEach((dot, index) => {
        if (index < currentQuestion) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}