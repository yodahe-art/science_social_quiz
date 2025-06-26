document.addEventListener('DOMContentLoaded', () => {
    // Page elements
    const pages = {
        landing: document.getElementById('landing-page'),
        section: document.getElementById('section-page'),
        subject: document.getElementById('subject-page'), // This will now list Grades
        grade: document.getElementById('grade-page'),     // New page to list Units for a Grade
        question: document.getElementById('question-page'),
        review: document.getElementById('review-page'),
        progress: document.getElementById('progress-tracker'),
        bookmarks: document.getElementById('bookmarks-page')
    };

    // Button/Card elements
    const naturalScienceCard = document.getElementById('natural-science-card');
    const socialScienceCard = document.getElementById('social-science-card');
    const backButton = document.getElementById('back-button');
    const themeToggleButton = document.getElementById('theme-toggle');

    // Content display elements
    const sectionTitle = document.getElementById('section-title');
    const subjectListContainer = document.getElementById('subject-list');

    const subjectPageTitle = document.getElementById('subject-page-title'); // Title for page listing grades
    const gradeListContainer = document.getElementById('grade-list'); // Container for grades on subject page

    const gradePageTitle = document.getElementById('grade-page-title'); // Title for page listing units
    const unitListContainerForGrade = document.getElementById('unit-list-for-grade'); // Container for units on grade page

    const unitTitle = document.getElementById('unit-title'); // For question page header (now includes grade)
    const questionContainer = document.getElementById('question-container');
    const explanationContainer = document.getElementById('explanation-container');
    const explanationText = document.getElementById('explanation-text');
    const timerDisplay = document.getElementById('timer');

    // Buttons on question page
    const submitAnswerButton = document.getElementById('submit-answer');
    const nextQuestionButton = document.getElementById('next-question');
    const reviewAnswersButton = document.getElementById('review-answers');
    const bookmarkQuestionButton = document.getElementById('bookmark-question');

    // State variables
    let currentPage = 'landing';
    let historyStack = []; // To manage back button functionality
    let currentSection = null; // 'natural' or 'social'
    let currentSubject = null; // e.g., 'Physics'
    let currentGrade = null; // e.g., 'Grade 9'
    let currentUnit = null; // e.g., 'Unit 1'
    let currentQuestionIndex = 0;
    let questionsForUnit = [];
    let userAnswers = []; // To store { questionIndex, selectedOption, isCorrect }
    let score = 0;
    let timerInterval;
    let bookmarkedQuestions = JSON.parse(localStorage.getItem('bookmarkedQuestions')) || [];
    let progressData = JSON.parse(localStorage.getItem('progressData')) || {};


    // --- Navigation ---
    function navigateTo(pageId, context = {}) {
        if (!pages[pageId]) {
            console.error(`Page with id ${pageId} not found.`);
            return;
        }

        // Hide current page
        if (pages[currentPage]) {
            pages[currentPage].classList.remove('current-page');
        }

        // Show new page
        pages[pageId].classList.add('current-page');

        // Add current page to history if it's not a repetitive navigation
        if (currentPage !== pageId || Object.keys(context).length > 0) { // Push if page changes or context is new
            if (historyStack.length === 0 || historyStack[historyStack.length - 1].page !== currentPage ||
                JSON.stringify(historyStack[historyStack.length - 1].context) !== JSON.stringify(getNavContext())) {
                 historyStack.push({ page: currentPage, context: getNavContext() });
            }
        }

        currentPage = pageId;
        updateBackButtonState();
        window.scrollTo(0, 0); // Scroll to top on page change

        // Handle context for specific pages
        if (pageId === 'section') {
            currentSection = context.sectionType;
            loadSubjects(context.sectionType);
        } else if (pageId === 'subject') { // This page now lists grades for the subject
            currentSection = context.sectionType; // Ensure section is maintained
            currentSubject = context.subjectName;
            loadGradesForSubject(currentSection, currentSubject);
        } else if (pageId === 'grade') { // This new page lists units for the grade
            currentSection = context.sectionType;
            currentSubject = context.subjectName;
            currentGrade = context.gradeName;
            loadUnitsForGrade(currentSection, currentSubject, currentGrade);
        } else if (pageId === 'question') {
            currentSection = context.sectionType;
            currentSubject = context.subjectName;
            currentGrade = context.gradeName;
            currentUnit = context.unitName;
            loadQuestions(currentSection, currentSubject, currentGrade, context.unitName, context.targetQuestionId);
        }
    }

    function getNavContext() {
        switch(currentPage) {
            case 'landing': return {};
            case 'section': return { sectionType: currentSection };
            case 'subject': return { sectionType: currentSection, subjectName: currentSubject };
            case 'grade': return { sectionType: currentSection, subjectName: currentSubject, gradeName: currentGrade };
            case 'question': return { sectionType: currentSection, subjectName: currentSubject, gradeName: currentGrade, unitName: currentUnit };
            default: return {};
        }
    }

    function goBack() {
        if (historyStack.length > 0) {
            const previous = historyStack.pop();
            if (pages[currentPage]) {
                 pages[currentPage].classList.remove('current-page');
            }
            pages[previous.page].classList.add('current-page');
            currentPage = previous.page;

            // Restore context
            if (previous.context) {
                currentSection = previous.context.sectionType;
                currentSubject = previous.context.subjectName;
                currentGrade = previous.context.gradeName;
                currentUnit = previous.context.unitName;

                // Reload data if necessary, e.g., if going back to a list page
                if (currentPage === 'section' && currentSection) {
                    loadSubjects(currentSection);
                } else if (currentPage === 'subject' && currentSection && currentSubject) {
                    loadGradesForSubject(currentSection, currentSubject); // Changed from loadUnits
                } else if (currentPage === 'grade' && currentSection && currentSubject && currentGrade) {
                    loadUnitsForGrade(currentSection, currentSubject, currentGrade);
                }
            }
            updateBackButtonState();
        }
    }

    function updateBackButtonState() {
        if (historyStack.length > 0 && currentPage !== 'landing') {
            backButton.style.display = 'inline-block';
        } else {
            backButton.style.display = 'none';
        }
    }

    // --- Event Listeners ---
    if (naturalScienceCard) {
        naturalScienceCard.addEventListener('click', () => {
            navigateTo('section', { sectionType: 'Natural Science' });
        });
    }

    if (socialScienceCard) {
        socialScienceCard.addEventListener('click', () => {
            navigateTo('section', { sectionType: 'Social Science' });
        });
    }

    if (backButton) {
        backButton.addEventListener('click', goBack);
    }

    // --- Data Loading and Page Rendering ---
    function loadSubjects(sectionType) {
        sectionTitle.textContent = sectionType;
        subjectListContainer.innerHTML = ''; // Clear previous subjects

        // Ensure examData is loaded
        if (!window.examData || !window.examData[sectionType] || !window.examData[sectionType].subjects) {
            console.error(`Data for section "${sectionType}" not found.`);
            subjectListContainer.innerHTML = '<p>Error: Subject data could not be loaded.</p>';
            return;
        }

        const subjects = window.examData[sectionType].subjects;
        if (Object.keys(subjects).length === 0) {
            subjectListContainer.innerHTML = '<p>No subjects available for this section yet.</p>';
            return;
        }

        for (const subjectName in subjects) {
            const subjectItem = document.createElement('div');
            subjectItem.classList.add('list-item');
            subjectItem.textContent = subjectName;
            subjectItem.dataset.subjectName = subjectName; // Store for event listener
            subjectItem.addEventListener('click', () => {
                // Pass currentSection along with subjectName for context
                navigateTo('subject', { sectionType: sectionType, subjectName: subjectName });
            });
            subjectListContainer.appendChild(subjectItem);
        }
    }

    // Renamed from loadUnits - this now loads Grades for a given Subject
    function loadGradesForSubject(section, subjectName) {
        if (!subjectPageTitle || !gradeListContainer) {
            console.error("Subject page elements (title or grade list container) not found.");
            return;
        }
        subjectPageTitle.textContent = `${subjectName} - Select Grade`;
        gradeListContainer.innerHTML = '';

        if (!window.examData?.[section]?.subjects?.[subjectName]?.grades) {
            console.error(`Data for grades in "${subjectName}" under "${section}" not found.`);
            gradeListContainer.innerHTML = '<p>Error: Grade data could not be loaded.</p>';
            return;
        }

        const grades = window.examData[section].subjects[subjectName].grades;
        if (Object.keys(grades).length === 0) {
            gradeListContainer.innerHTML = '<p>No grades available for this subject yet.</p>';
            return;
        }

        for (const gradeName in grades) {
            const gradeItem = document.createElement('div');
            gradeItem.classList.add('list-item');
            gradeItem.textContent = gradeName;
            gradeItem.dataset.gradeName = gradeName;
            gradeItem.addEventListener('click', () => {
                navigateTo('grade', { sectionType: section, subjectName: subjectName, gradeName: gradeName });
            });
            gradeListContainer.appendChild(gradeItem);
        }
    }

    // New function to load Units for a given Grade
    function loadUnitsForGrade(section, subjectName, gradeName) {
        if (!gradePageTitle || !unitListContainerForGrade) {
            console.error("Grade page elements (title or unit list container) not found for units.");
            return;
        }
        gradePageTitle.textContent = `${subjectName} - ${gradeName} - Select Unit`;
        unitListContainerForGrade.innerHTML = '';

        if (!window.examData?.[section]?.subjects?.[subjectName]?.grades?.[gradeName]?.units) {
            console.error(`Data for units in "${gradeName}" of "${subjectName}" under "${section}" not found.`);
            unitListContainerForGrade.innerHTML = '<p>Error: Unit data for this grade could not be loaded.</p>';
            return;
        }

        const units = window.examData[section].subjects[subjectName].grades[gradeName].units;
        if (Object.keys(units).length === 0) {
            unitListContainerForGrade.innerHTML = '<p>No units available for this grade yet.</p>';
            return;
        }

        for (const unitName in units) {
            const unitItem = document.createElement('div');
            unitItem.classList.add('list-item');
            unitItem.textContent = unitName;
            unitItem.dataset.unitName = unitName;
            unitItem.addEventListener('click', () => {
                navigateTo('question', { sectionType: section, subjectName: subjectName, gradeName: gradeName, unitName: unitName });
            });
            unitListContainerForGrade.appendChild(unitItem);
        }
    }

    // Modified loadQuestions to include grade
    function loadQuestions(section, subject, grade, unit, targetQuestionId = null) { // Added targetQuestionId from bookmark jump
        console.log(`Loading questions for: ${unit} of ${grade}, ${subject} (${section})`);
        unitTitle.textContent = `${subject} - ${grade} - ${unit}`;

        currentQuestionIndex = 0;
        userAnswers = [];
        score = 0;

        if (window.examData?.[section]?.subjects?.[subject]?.grades?.[grade]?.units?.[unit]) {
            questionsForUnit = window.examData[section].subjects[subject].grades[grade].units[unit];
            if (questionsForUnit && questionsForUnit.length > 0) {
                if (targetQuestionId) { // Handle jumping to a specific question
                    const targetIdx = questionsForUnit.findIndex(q => q.id === targetQuestionId);
                    if (targetIdx !== -1) currentQuestionIndex = targetIdx;
                }
                displayQuestion(currentQuestionIndex);
                startTimer(questionsForUnit.length); // Start timer here
                submitAnswerButton.style.display = 'inline-block';
                nextQuestionButton.style.display = 'none';
                explanationContainer.style.display = 'none';
                reviewAnswersButton.style.display = 'none';
                bookmarkQuestionButton.style.display = 'inline-block';
            } else {
                questionContainer.innerHTML = '<p>No questions available for this unit yet.</p>';
                submitAnswerButton.style.display = 'none';
                bookmarkQuestionButton.style.display = 'none';
                stopTimer(); // Stop timer if no questions
            }
        } else {
            questionContainer.innerHTML = '<p>Error: Could not load questions for this unit.</p>';
            submitAnswerButton.style.display = 'none';
            bookmarkQuestionButton.style.display = 'none';
            stopTimer(); // Stop timer on error
        }
    }

    function displayQuestion(index) {
        if (questionsForUnit && questionsForUnit[index]) {
            const question = questionsForUnit[index];
            questionContainer.innerHTML = `
                <p><strong>Question ${index + 1} of ${questionsForUnit.length}:</strong></p>
                <p>${question.text}</p>
                <ul class="options-list">
                    ${question.options.map((opt, i) => `<li data-index="${i}" role="button" tabindex="0">${String.fromCharCode(65 + i)}. ${opt}</li>`).join('')}
                </ul>
            `;

            const optionElements = questionContainer.querySelectorAll('.options-list li');
            optionElements.forEach(opt => {
                opt.addEventListener('click', handleOptionSelect);
                opt.addEventListener('keydown', (e) => { // Accessibility: allow selection with Enter/Space
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleOptionSelect(e);
                    }
                });
            });

            submitAnswerButton.style.display = 'inline-block';
            nextQuestionButton.style.display = 'none';
            explanationContainer.style.display = 'none';
            explanationText.textContent = '';
            // Reset styles from previous question
            optionElements.forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
                opt.style.pointerEvents = 'auto'; // Re-enable clicking
            });
            updateBookmarkButtonState(question.id);

        } else {
            // End of questions for the unit
            questionContainer.innerHTML = `<p>You have completed all questions in this unit!</p><p>Your score: ${score} out of ${questionsForUnit.length}</p>`;
            submitAnswerButton.style.display = 'none';
            nextQuestionButton.style.display = 'none';
            explanationContainer.style.display = 'none';
            reviewAnswersButton.style.display = 'inline-block';
            bookmarkQuestionButton.style.display = 'none';
            stopTimer(); // Stop timer when unit is completed normally
            saveUnitProgress();
        }
    }

    function handleOptionSelect(event) {
        const selectedOption = event.currentTarget;
        // Only allow selection if an answer hasn't been submitted yet for this question
        if (submitAnswerButton.style.display === 'none') return;

        const optionElements = questionContainer.querySelectorAll('.options-list li');
        optionElements.forEach(opt => opt.classList.remove('selected'));
        selectedOption.classList.add('selected');
    }

    function handleSubmitAnswer() {
        const selectedOptionEl = questionContainer.querySelector('.options-list li.selected');
        if (!selectedOptionEl) {
            alert('Please select an answer before submitting.');
            return;
        }

        const question = questionsForUnit[currentQuestionIndex];
        const selectedAnswerIndex = parseInt(selectedOptionEl.dataset.index);
        const correctAnswerIndex = question.answer;
        const isCorrect = selectedAnswerIndex === correctAnswerIndex;

        userAnswers.push({
            questionId: question.id,
            questionText: question.text,
            options: question.options,
            selectedAnswer: selectedAnswerIndex,
            correctAnswer: correctAnswerIndex,
            isCorrect: isCorrect,
            explanation: question.explanation
        });

        if (isCorrect) {
            score++;
            selectedOptionEl.classList.add('correct');
            // Placeholder: playSound('correct.mp3');
        } else {
            selectedOptionEl.classList.add('incorrect');
            // Placeholder: playSound('incorrect.mp3');
            // Also highlight the correct answer
            const correctOptionEl = questionContainer.querySelector(`.options-list li[data-index="${correctAnswerIndex}"]`);
            if (correctOptionEl) {
                correctOptionEl.classList.add('correct');
            }
        }

        // Show explanation
        explanationText.textContent = question.explanation;
        explanationContainer.style.display = 'block';

        // Disable options
        const optionElements = questionContainer.querySelectorAll('.options-list li');
        optionElements.forEach(opt => opt.style.pointerEvents = 'none'); // Disable further clicks

        submitAnswerButton.style.display = 'none';
        if (currentQuestionIndex < questionsForUnit.length - 1) {
            nextQuestionButton.style.display = 'inline-block';
        } else {
            // Last question, show review button
            reviewAnswersButton.style.display = 'inline-block';
            // Update final message if not already shown by displayQuestion
            if (!questionContainer.innerHTML.includes("final score")) { // Avoid duplicating score message
                 questionContainer.innerHTML += `<p>Your final score: ${score} out of ${questionsForUnit.length}</p>`;
            }
            saveUnitProgress();
        }
    }

    function handleNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questionsForUnit.length) {
            displayQuestion(currentQuestionIndex);
        } else {
            // Should be handled by handleSubmitAnswer's logic, but as a fallback:
            displayQuestion(currentQuestionIndex); // This will show the end-of-unit message
        }
    }

    // --- Timer Functionality ---
    const TIME_PER_QUESTION_SECONDS = 60; // 1 minute per question

    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function startTimer(numberOfQuestions) {
        clearInterval(timerInterval); // Clear any existing timer
        let totalSeconds = numberOfQuestions * TIME_PER_QUESTION_SECONDS;
        timerDisplay.textContent = formatTime(totalSeconds);
        timerDisplay.parentElement.style.display = 'block'; // Show timer container

        timerInterval = setInterval(() => {
            totalSeconds--;
            timerDisplay.textContent = formatTime(totalSeconds);

            if (totalSeconds <= 0) {
                clearInterval(timerInterval);
                handleTimeUp();
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        if (timerDisplay && timerDisplay.parentElement) {
             timerDisplay.parentElement.style.display = 'none'; // Hide timer when not active
        }
    }

    function handleTimeUp() {
        alert("Time's up!");
        // Disable further interactions on the question page
        const optionElements = questionContainer.querySelectorAll('.options-list li');
        optionElements.forEach(opt => opt.style.pointerEvents = 'none');
        submitAnswerButton.style.display = 'none';
        nextQuestionButton.style.display = 'none';
        bookmarkQuestionButton.style.display = 'none';

        // Show explanation for the current question if one was selected, or just mark it
        const currentQuestionUserAnswer = userAnswers.find(ua => ua.questionId === questionsForUnit[currentQuestionIndex]?.id);
        if (!currentQuestionUserAnswer && questionsForUnit[currentQuestionIndex]) { // If current question wasn't answered
            userAnswers.push({
                questionId: questionsForUnit[currentQuestionIndex].id,
                questionText: questionsForUnit[currentQuestionIndex].text,
                options: questionsForUnit[currentQuestionIndex].options,
                selectedAnswer: null, // No answer selected
                correctAnswer: questionsForUnit[currentQuestionIndex].answer,
                isCorrect: false,
                explanation: "Time ran out before answering.",
                timedOut: true
            });
        } else if (currentQuestionUserAnswer) {
            currentQuestionUserAnswer.timedOut = true; // Mark existing answer as timed out
        }


        // Display final score and review button
        questionContainer.innerHTML += `<p><strong>Time's Up!</strong> Your final score for this attempt: ${score} out of ${questionsForUnit.length}</p>`;
        reviewAnswersButton.style.display = 'inline-block';
        saveUnitProgress(); // Save whatever progress was made
    }


    // --- Event Listeners (add for new buttons) ---
    if (submitAnswerButton) {
        submitAnswerButton.addEventListener('click', handleSubmitAnswer);
    }
    if (nextQuestionButton) {
        nextQuestionButton.addEventListener('click', handleNextQuestion);
    }
    if (reviewAnswersButton) {
        reviewAnswersButton.addEventListener('click', () => {
            if (!currentUnit || !currentSubject || !currentSection || !currentGrade) {
                console.error("Cannot enter review mode: current context is incomplete.");
                return;
            }
            navigateTo('review', {
                unitName: currentUnit,
                subjectName: currentSubject,
                sectionType: currentSection,
                gradeName: currentGrade, // Pass currentGrade
                answers: userAnswers
            });
        });
    }


    // --- Review Mode ---
    function displayReview(context) {
        const reviewContent = document.getElementById('review-content');
        if (!reviewContent || !context || !context.answers || !context.gradeName) { // Check for gradeName
            reviewContent.innerHTML = '<p>No review data available or error loading review (missing context).</p>';
            return;
        }

        const answersToReview = context.answers;
        // Update heading to include grade
        let reviewHTML = `<h2>Review: ${context.subjectName} - ${context.gradeName} - ${context.unitName}</h2>`;

        if (answersToReview.length === 0) {
            reviewHTML += '<p>No questions were answered in this attempt.</p>';
            reviewContent.innerHTML = reviewHTML;
            return;
        }

        answersToReview.forEach((ans, index) => {
            reviewHTML += `
                <div class="review-question-item">
                    <h4>Question ${index + 1}: ${ans.questionText}</h4>
                    <ul class="options-list review-options">
            `;
            ans.options.forEach((optionText, optIndex) => {
                let classes = '';
                if (optIndex === ans.selectedAnswer) {
                    classes += ans.isCorrect ? ' selected correct' : ' selected incorrect';
                } else if (optIndex === ans.correctAnswer) {
                    classes += ' correct'; // Highlight correct if not selected
                }
                reviewHTML += `<li class="${classes.trim()}">${String.fromCharCode(65 + optIndex)}. ${optionText}</li>`;
            });
            reviewHTML += `</ul>`;
            if (ans.selectedAnswer === null && ans.timedOut) {
                reviewHTML += `<p class="user-answer-indicator"><strong>Your Answer:</strong> Not answered (Time ran out)</p>`;
            } else if (ans.selectedAnswer !== null) {
                 reviewHTML += `<p class="user-answer-indicator"><strong>Your Answer:</strong> ${String.fromCharCode(65 + ans.selectedAnswer)}. ${ans.options[ans.selectedAnswer]}</p>`;
            } else {
                 reviewHTML += `<p class="user-answer-indicator"><strong>Your Answer:</strong> Not answered</p>`;
            }
            reviewHTML += `<p class="correct-answer-indicator"><strong>Correct Answer:</strong> ${String.fromCharCode(65 + ans.correctAnswer)}. ${ans.options[ans.correctAnswer]}</p>`;
            reviewHTML += `<div class="explanation-review"><p><strong>Explanation:</strong> ${ans.explanation}</p></div>`;
            if (ans.timedOut) {
                reviewHTML += `<p style="color: orange; font-style: italic;">(Question may have been affected by time running out)</p>`;
            }
            reviewHTML += `</div><hr>`;
        });

        reviewContent.innerHTML = reviewHTML;
    }


    // --- Bookmark Functionality ---
    function updateBookmarkButtonState(questionId) {
        if (!currentSection || !currentSubject || !currentGrade || !currentUnit) return; // Ensure context is valid
        const isBookmarked = bookmarkedQuestions.some(bq =>
            bq.id === questionId &&
            bq.section === currentSection &&
            bq.subject === currentSubject &&
            bq.grade === currentGrade && // Add grade to check
            bq.unit === currentUnit
        );

        if (isBookmarked) {
            bookmarkQuestionButton.textContent = 'Unbookmark Question';
            bookmarkQuestionButton.classList.add('bookmarked');
        } else {
            bookmarkQuestionButton.textContent = 'Bookmark Question';
            bookmarkQuestionButton.classList.remove('bookmarked');
        }
    }

    function toggleBookmark() {
        if (!questionsForUnit || !questionsForUnit[currentQuestionIndex] || !currentSection || !currentSubject || !currentGrade || !currentUnit) return;

        const question = questionsForUnit[currentQuestionIndex];
        const bookmarkIndex = bookmarkedQuestions.findIndex(bq =>
            bq.id === question.id &&
            bq.section === currentSection &&
            bq.subject === currentSubject &&
            bq.grade === currentGrade && // Add grade to check
            bq.unit === currentUnit
        );

        if (bookmarkIndex > -1) {
            bookmarkedQuestions.splice(bookmarkIndex, 1); // Unbookmark
        } else {
            bookmarkedQuestions.push({
                id: question.id,
                text: question.text,
                section: currentSection,
                subject: currentSubject,
                grade: currentGrade, // Store grade
                unit: currentUnit
            }); // Bookmark
        }
        localStorage.setItem('bookmarkedQuestions', JSON.stringify(bookmarkedQuestions));
        updateBookmarkButtonState(question.id); // Will use the updated currentGrade
    }

    if (bookmarkQuestionButton) {
        bookmarkQuestionButton.addEventListener('click', toggleBookmark);
    }


    // --- Theme Toggle ---
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', theme);
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
    applyTheme(savedTheme);

    // --- Progress Tracker ---
    function saveUnitProgress() {
        if (!currentSection || !currentSubject || !currentGrade || !currentUnit || !questionsForUnit) return;

        // Initialize structure if not present
        progressData[currentSection] = progressData[currentSection] || { subjects: {} };
        progressData[currentSection].subjects[currentSubject] = progressData[currentSection].subjects[currentSubject] || { grades: {} };
        progressData[currentSection].subjects[currentSubject].grades[currentGrade] = progressData[currentSection].subjects[currentSubject].grades[currentGrade] || { units: {} };

        const unitStats = progressData[currentSection].subjects[currentSubject].grades[currentGrade].units[currentUnit] || { attempted: 0, correct: 0, completedCount: 0, bestScore: 0 };

        unitStats.attempted = questionsForUnit.length;
        unitStats.correct = score;
        unitStats.completedCount = (unitStats.completedCount || 0) + 1;
        unitStats.lastAttemptDate = new Date().toISOString();
        if (score > unitStats.bestScore) {
            unitStats.bestScore = score;
        }

        progressData[currentSection].subjects[currentSubject].grades[currentGrade].units[currentUnit] = unitStats;

        // Update overall stats
        let totalAttemptedOverall = 0;
        let totalCorrectOverall = 0;
        let totalUnitsCompleted = 0;

        for (const sectionKey in progressData) {
            if (sectionKey === 'overallStats') continue;
            for (const subjectKey in progressData[sectionKey].subjects) {
                for (const gradeKey in progressData[sectionKey].subjects[subjectKey].grades) {
                    for (const unitKey in progressData[sectionKey].subjects[subjectKey].grades[gradeKey].units) {
                        const u = progressData[sectionKey].subjects[subjectKey].grades[gradeKey].units[unitKey];
                        // Consider if totalAttemptedOverall should sum u.attempted or u.attempted * u.completedCount
                        totalAttemptedOverall += u.attempted; // Summing questions in units completed at least once
                        totalCorrectOverall += u.bestScore; // Summing best scores for simplicity
                        if (u.completedCount > 0) totalUnitsCompleted++;
                    }
                }
            }
        }
        progressData.overallStats = {
            totalQuestionsInCompletedUnits: totalAttemptedOverall,
            totalBestCorrectAnswers: totalCorrectOverall,
            totalUnitsCompleted: totalUnitsCompleted, // This counts unique units completed at least once
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('progressData', JSON.stringify(progressData));
        console.log("Progress saved:", progressData);

        // Optionally, refresh unit list to show completion indicators if on the grade page
        if (currentPage === 'grade') {
            loadUnitsForGrade(currentSection, currentSubject, currentGrade);
        }
    }

    function displayProgress() {
        const progressContent = document.getElementById('progress-content');
        if (!progressContent) return;

        progressContent.innerHTML = '<h3>Overall Statistics</h3>';
        if (progressData.overallStats) {
            progressContent.innerHTML += `
                <p>Total Questions in Completed Units: ${progressData.overallStats.totalQuestionsInCompletedUnits || 0}</p>
                <p>Total Sum of Best Scores: ${progressData.overallStats.totalBestCorrectAnswers || 0}</p>
                <p>Total Unique Units Completed: ${progressData.overallStats.totalUnitsCompleted || 0}</p>
                <p><em>Last updated: ${progressData.overallStats.lastUpdated ? new Date(progressData.overallStats.lastUpdated).toLocaleString() : 'N/A'}</em></p>
            `;
        } else {
            progressContent.innerHTML += '<p>No overall progress tracked yet.</p>';
        }

        progressContent.innerHTML += '<h3>Progress by Unit</h3>';
        let hasUnitProgress = false;
        const mainUl = document.createElement('ul');
        mainUl.style.listStyleType = 'none';
        mainUl.style.paddingLeft = '0';

        for (const sectionKey in progressData) {
            if (sectionKey === 'overallStats' || !progressData[sectionKey].subjects) continue;

            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<h4>${sectionKey}</h4>`;
            const subjectUl = document.createElement('ul');
            subjectUl.style.paddingLeft = '20px'; // Indent subjects

            for (const subjectKey in progressData[sectionKey].subjects) {
                const subjectData = progressData[sectionKey].subjects[subjectKey];
                if (!subjectData.grades) continue;

                const subjectLi = document.createElement('li');
                subjectLi.innerHTML = `<h5>${subjectKey}</h5>`;
                const gradeUl = document.createElement('ul');
                gradeUl.style.paddingLeft = '20px'; // Indent grades

                for (const gradeKey in subjectData.grades) {
                    const gradeData = subjectData.grades[gradeKey];
                    if (!gradeData.units) continue;

                    const gradeLi = document.createElement('li');
                    gradeLi.innerHTML = `<h6>${gradeKey}</h6>`;
                    const unitUl = document.createElement('ul');
                    unitUl.style.paddingLeft = '20px'; // Indent units

                    for (const unitKey in gradeData.units) {
                        hasUnitProgress = true;
                        const unit = gradeData.units[unitKey];
                        const unitLi = document.createElement('li');
                        unitLi.innerHTML = `
                            <strong>${unitKey}</strong>:
                            Score: ${unit.correct}/${unit.attempted} (Best: ${unit.bestScore}/${unit.attempted}),
                            Completed ${unit.completedCount} time(s).
                            ${unit.lastAttemptDate ? `Last attempt: ${new Date(unit.lastAttemptDate).toLocaleDateString()}` : ''}
                        `;
                        unitUl.appendChild(unitLi);
                    }
                    if (unitUl.hasChildNodes()) {
                        gradeLi.appendChild(unitUl);
                        gradeUl.appendChild(gradeLi);
                    }
                }
                if (gradeUl.hasChildNodes()) {
                    subjectLi.appendChild(gradeUl);
                    subjectUl.appendChild(subjectLi);
                }
            }
            if (subjectUl.hasChildNodes()) {
                sectionDiv.appendChild(subjectUl);
                mainUl.appendChild(sectionDiv);
            }
        }

        if (!hasUnitProgress) {
            mainUl.innerHTML = '<li>No specific unit progress tracked yet. Complete some units!</li>';
        }
        progressContent.appendChild(mainUl);
    }

    // Modify navigateTo to call displayProgress, manage timer, and call displayReview
    const baseNavigateTo = navigateTo; // Original function from early steps
    navigateTo = function(pageId, context = {}) {
        // Stop timer if navigating away from question page
        if (currentPage === 'question' && pageId !== 'question') {
            stopTimer();
        }
        baseNavigateTo(pageId, context); // Calls the original navigation logic (showing/hiding pages, history)

        // Call specific content loaders/handlers AFTER the page is set up by baseNavigateTo
        if (pageId === 'progress') {
            displayProgress();
        } else if (pageId === 'review') {
            displayReview(context); // context should contain answers, unitName, etc.
        }
        // Note: loadSubjects, loadUnits, loadQuestions are already called within the original navigateTo
        // if their respective pageIds are matched. We are extending it here for new page types.
        else if (pageId === 'bookmarks') {
            displayBookmarks();
        }
    };

    // Modify goBack to also stop timer if leaving question page
    const originalGoBack = goBack;
    goBack = function() {
        if (currentPage === 'question' && historyStack.length > 0) {
            const previousPageId = historyStack[historyStack.length - 1].page;
            if (previousPageId !== 'question') { // Check if we are truly leaving the question context
                stopTimer();
            }
        }
        originalGoBack();
    };

    // Add event listener for a potential "View Progress" button if one exists
    // For now, assuming navigation to 'progress-tracker' page happens through other means (e.g. a nav link not yet defined)
    // Let's add a temporary button on the landing page for accessing progress for testing
    const landingPage = document.getElementById('landing-page');
    if (landingPage) {
        let progressButton = document.getElementById('view-progress-button');
        if (!progressButton) {
            progressButton = document.createElement('button');
            progressButton.id = 'view-progress-button';
            progressButton.textContent = 'View My Progress';
            progressButton.style.marginTop = '1rem';
            progressButton.addEventListener('click', () => navigateTo('progress'));
            // Insert it after the cards
            const sectionCards = landingPage.querySelector('.section-cards');
            if (sectionCards) {
                sectionCards.parentNode.insertBefore(progressButton, sectionCards.nextSibling);
            } else {
                landingPage.appendChild(progressButton);
            }
        }
    }

    let bookmarksButton = document.getElementById('view-bookmarks-button');
    if (landingPage && !bookmarksButton) {
        bookmarksButton = document.createElement('button');
        bookmarksButton.id = 'view-bookmarks-button';
        bookmarksButton.textContent = 'View Bookmarks';
        bookmarksButton.style.marginTop = '1rem';
        bookmarksButton.style.marginLeft = '0.5rem'; // Add some space if next to progress button
        bookmarksButton.addEventListener('click', () => navigateTo('bookmarks'));

        const progressBtn = landingPage.querySelector('#view-progress-button');
        if (progressBtn && progressBtn.nextSibling) {
            progressBtn.parentNode.insertBefore(bookmarksButton, progressBtn.nextSibling);
        } else if (progressBtn) {
            progressBtn.parentNode.appendChild(bookmarksButton);
        } else {
            const sectionCards = landingPage.querySelector('.section-cards');
            if (sectionCards) {
                sectionCards.parentNode.insertBefore(bookmarksButton, sectionCards.nextSibling);
            } else {
                landingPage.appendChild(bookmarksButton);
            }
        }
    }


    // Modify loadUnitsForGrade to display completion indicators
    const originalLoadUnitsForGrade = loadUnitsForGrade;
    loadUnitsForGrade = function(section, subjectName, gradeName) {
        originalLoadUnitsForGrade(section, subjectName, gradeName); // Call original to populate units

        if (!unitListContainerForGrade) return; // Guard against missing container
        const unitItems = unitListContainerForGrade.querySelectorAll('.list-item');
        unitItems.forEach(item => {
            const unitName = item.dataset.unitName;
            if (progressData[section]?.subjects[subjectName]?.grades[gradeName]?.units[unitName]?.completedCount > 0) {
                let indicator = item.querySelector('.completion-indicator');
                if (!indicator) {
                    indicator = document.createElement('span');
                    indicator.className = 'completion-indicator';
                    indicator.textContent = ' ✔️';
                    indicator.title = `Completed ${progressData[section].subjects[subjectName].grades[gradeName].units[unitName].completedCount} time(s). Best: ${progressData[section].subjects[subjectName].grades[gradeName].units[unitName].bestScore}/${progressData[section].subjects[subjectName].grades[gradeName].units[unitName].attempted}`;
                    item.appendChild(indicator);
                }
            }
        });
    };


    // --- Display Bookmarks Page ---
    function displayBookmarks() {
        const bookmarksContentList = document.getElementById('bookmarks-content-list');
        if (!bookmarksContentList) return;

        bookmarksContentList.innerHTML = ''; // Clear previous list
        bookmarkedQuestions = JSON.parse(localStorage.getItem('bookmarkedQuestions')) || []; // Refresh from localStorage

        if (bookmarkedQuestions.length === 0) {
            bookmarksContentList.innerHTML = '<p>You have no bookmarked questions yet. You can bookmark questions during a quiz.</p>';
            return;
        }

        const ul = document.createElement('ul');
        ul.className = 'bookmarks-list'; // For styling
        bookmarkedQuestions.forEach((bookmark, index) => {
            const li = document.createElement('li');
            li.className = 'bookmark-item';
            li.innerHTML = `
                <div class="bookmark-text">
                    <p><strong>${bookmark.subject} - ${bookmark.grade} - ${bookmark.unit}</strong></p>
                    <p>${bookmark.text.substring(0, 100)}${bookmark.text.length > 100 ? '...' : ''}</p>
                </div>
                <div class="bookmark-actions">
                    <button class="goto-question-btn" data-bookmark-index="${index}">Go to Question</button>
                    <button class="unbookmark-btn" data-bookmark-index="${index}">Unbookmark</button>
                </div>
            `;
            ul.appendChild(li);
        });
        bookmarksContentList.appendChild(ul);

        // Add event listeners for the new buttons
        bookmarksContentList.querySelectorAll('.goto-question-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookmarkIndex = parseInt(e.target.dataset.bookmarkIndex);
                const bookmark = bookmarkedQuestions[bookmarkIndex];
                if (bookmark) {
                    // The loadQuestions function is already set up to handle targetQuestionId
                    // when navigating to the 'question' page.
                    // We just need to ensure all context, including gradeName, is passed.
                    navigateTo('question', {
                        sectionType: bookmark.section,
                        subjectName: bookmark.subject,
                        gradeName: bookmark.grade, // Pass the stored grade
                        unitName: bookmark.unit,
                        targetQuestionId: bookmark.id
                    });
                }
            });
        });

        bookmarksContentList.querySelectorAll('.unbookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookmarkIndex = parseInt(e.target.dataset.bookmarkIndex);
                bookmarkedQuestions.splice(bookmarkIndex, 1); // Remove from array
                localStorage.setItem('bookmarkedQuestions', JSON.stringify(bookmarkedQuestions)); // Update localStorage
                displayBookmarks(); // Refresh the list
            });
        });
    }

    // Modify loadQuestions to handle targetQuestionId
    const originalLoadQuestions = loadQuestions;
    loadQuestions = function(section, subject, unit, targetQuestionId = null) {
        originalLoadQuestions(section, subject, unit); // This sets up questionsForUnit

        if (targetQuestionId && questionsForUnit && questionsForUnit.length > 0) {
            const targetIndex = questionsForUnit.findIndex(q => q.id === targetQuestionId);
            if (targetIndex !== -1) {
                currentQuestionIndex = targetIndex;
                displayQuestion(currentQuestionIndex); // Display the specific bookmarked question
            }
        }
    };


    // Initial setup
    updateBackButtonState(); // Ensure back button is hidden on landing
    navigateTo('landing'); // Start on the landing page
});
