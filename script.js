let answers = JSON.parse(sessionStorage.getItem('quizAnswers')) || {
    q1: [],
    q2: [],
    q3: [],
    q4: [],
    q5: []
};

// Ensure answers is valid and has arrays for q1 through q5
try {
    if (!answers || typeof answers !== 'object') {
        console.error('Invalid sessionStorage.quizAnswers, resetting to default');
        answers = { q1: [], q2: [], q3: [], q4: [], q5: [] };
        sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
    } else {
        // Ensure each question key exists and is an array
        ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(key => {
            if (!Array.isArray(answers[key])) {
                console.warn(`answers[${key}] is not an array, resetting to []`);
                answers[key] = [];
            }
        });
        sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
    }
    console.log('Initialized answers:', answers);
} catch (e) {
    console.error('Error parsing sessionStorage.quizAnswers:', e);
    answers = { q1: [], q2: [], q3: [], q4: [], q5: [] };
    sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
}

function selectOption(element, style, questionNum) {
    const questionKey = `q${questionNum}`;
    const isSelected = element.classList.contains('selected');

    try {
        if (!Array.isArray(answers[questionKey])) {
            console.warn(`answers[${questionKey}] is not an array, resetting to []`);
            answers[questionKey] = [];
        }

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
        console.log(`Question ${questionNum} selections:`, answers[questionKey]);
    } catch (e) {
        console.error(`Error in selectOption for Q${questionNum}:`, e);
    }
}

function restoreSelections(questionNum) {
    const questionKey = `q${questionNum}`;
    try {
        const options = document.querySelectorAll('.option');
        if (!Array.isArray(answers[questionKey])) {
            console.warn(`answers[${questionKey}] is not an array, resetting to []`);
            answers[questionKey] = [];
            sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
        }
        options.forEach(option => {
            const style = option.getAttribute('onclick').match(/'([^']+)'/)[1];
            if (answers[questionKey].includes(style)) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        console.log(`Restored selections for Q${questionNum}:`, answers[questionKey]);
    } catch (e) {
        console.error(`Error in restoreSelections for Q${questionNum}:`, e);
    }
}

function nextQuestion(currentQuestion, totalQuestions) {
    const questionKey = `q${currentQuestion}`;
    try {
        console.log(`Checking selections for Q${currentQuestion}:`, answers[questionKey]);
        if (!Array.isArray(answers[questionKey]) || answers[questionKey].length === 0) {
            alert('Please select at least one option before moving on!');
            console.warn(`No valid selections for Q${currentQuestion}`);
            return;
        }
        sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
        if (currentQuestion < totalQuestions) {
            console.log(`Navigating to question${currentQuestion + 1}.html`);
            window.location.href = `question${currentQuestion + 1}.html`;
        } else {
            console.log('Navigating to result.html');
            window.location.href = 'result.html';
        }
    } catch (e) {
        console.error(`Error in nextQuestion for Q${currentQuestion}:`, e);
        alert('An error occurred. Please try again.');
    }
}

function prevQuestion(currentQuestion) {
    try {
        sessionStorage.setItem('quizAnswers', JSON.stringify(answers));
        if (currentQuestion > 1) {
            console.log(`Navigating to question${currentQuestion - 1}.html`);
            window.location.href = `question${currentQuestion - 1}.html`;
        } else {
            console.log('Navigating to form.html');
            window.location.href = 'form.html';
        }
    } catch (e) {
        console.error('Error in prevQuestion:', e);
        alert('An error occurred. Please try again.');
    }
}

function updateProgress(currentQuestion, totalQuestions) {
    try {
        const progressBar = document.getElementById('progress-bar');
        const progressDots = document.querySelectorAll('.progress-dot');
        const progressPercentage = (currentQuestion / totalQuestions) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressDots.forEach((dot, index) => {
            if (index < currentQuestion) dot.classList.add('active');
            else dot.classList.remove('active');
        });
        console.log(`Progress updated: ${progressPercentage}% for Q${currentQuestion}`);
    } catch (e) {
        console.error('Error in updateProgress:', e);
    }
}