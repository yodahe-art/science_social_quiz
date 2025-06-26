document.addEventListener('DOMContentLoaded', () => {
    // Page elements
    const pages = {
        landing: document.getElementById('landing-page'),
        section: document.getElementById('section-page'),
        subject: document.getElementById('subject-page'),
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
    const subjectTitle = document.getElementById('subject-title');
    const unitListContainer = document.getElementById('unit-list');
    const unitTitle = document.getElementById('unit-title'); // For question page header
    const questionContainer = document.getElementById('question-container');
    const explanationContainer = document.getElementById('explanation-container');
    const explanationText = document.getElementById('explanation-text');
    const timerDisplay = document.getElementById('timer');

    // Buttons on question page
    const submitAnswerButton = document.getElementById('submit-answer');
    const nextQuestionButton = document.getElementById('next-question');
    const reviewAnswersButton = document.getElementById('review-answers');
    const bookmarkQuestionButton = document.getElementById('bookmark-question');

    // Search
    const searchBar = document.getElementById('search-bar');

    // State variables
    let currentPage = 'landing';
    let historyStack = []; // To manage back button functionality
    let currentSection = null; // 'natural' or 'social'
    let currentSubject = null; // e.g., 'Physics'
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
        } else if (pageId === 'subject') {
            currentSubject = context.subjectName;
            loadUnits(currentSection, context.subjectName);
        } else if (pageId === 'question') {
            currentUnit = context.unitName;
            loadQuestions(currentSection, currentSubject, context.unitName);
        }
    }

    function getNavContext() {
        switch(currentPage) {
            case 'landing': return {};
            case 'section': return { sectionType: currentSection };
            case 'subject': return { subjectName: currentSubject, sectionType: currentSection }; // sectionType is needed to go back to correct subject list
            case 'question': return { unitName: currentUnit, subjectName: currentSubject, sectionType: currentSection };
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
                currentUnit = previous.context.unitName;

                // Reload data if necessary, e.g., if going back to a list page
                if (currentPage === 'section' && currentSection) {
                    loadSubjects(currentSection);
                } else if (currentPage === 'subject' && currentSection && currentSubject) {
                    loadUnits(currentSection, currentSubject);
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

    function loadUnits(section, subjectName) {
        subjectTitle.textContent = subjectName;
        unitListContainer.innerHTML = ''; // Clear previous units

        // Ensure examData and specific path is loaded
        if (!window.examData ||
            !window.examData[section] ||
            !window.examData[section].subjects ||
            !window.examData[section].subjects[subjectName] ||
            !window.examData[section].subjects[subjectName].units) {
            console.error(`Data for units in "${subjectName}" under "${section}" not found.`);
            unitListContainer.innerHTML = '<p>Error: Unit data could not be loaded.</p>';
            return;
        }

        const units = window.examData[section].subjects[subjectName].units;
        if (Object.keys(units).length === 0) {
            unitListContainer.innerHTML = '<p>No units available for this subject yet.</p>';
            return;
        }

        for (const unitName in units) {
            const unitItem = document.createElement('div');
            unitItem.classList.add('list-item');
            unitItem.textContent = unitName;
            unitItem.dataset.unitName = unitName; // Store for event listener
            unitItem.addEventListener('click', () => {
                // Pass section, subject, and unit name for context
                navigateTo('question', { sectionType: section, subjectName: subjectName, unitName: unitName });
            });
            unitListContainer.appendChild(unitItem);
        }
    }

    // Placeholder for loading questions - will be implemented in next step
    function loadQuestions(section, subject, unit) {
        console.log(`Loading questions for: ${unit} of ${subject} (${section})`);
        unitTitle.textContent = `${subject} - ${unit}`; // Set the header on the question page

        currentQuestionIndex = 0;
        userAnswers = [];
        score = 0;

        // Actual question loading logic will go here
        // For now, just a placeholder
        if (window.examData && window.examData[section] && window.examData[section].subjects[subject] && window.examData[section].subjects[subject].units[unit]) {
            questionsForUnit = window.examData[section].subjects[subject].units[unit];
            if (questionsForUnit && questionsForUnit.length > 0) {
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
            navigateTo('review', {
                unitName: currentUnit,
                subjectName: currentSubject,
                sectionType: currentSection,
                answers: userAnswers // Pass the answers for review
            });
        });
    }


    // --- Review Mode ---
    function displayReview(context) {
        const reviewContent = document.getElementById('review-content');
        if (!reviewContent || !context || !context.answers) {
            reviewContent.innerHTML = '<p>No review data available or error loading review.</p>';
            return;
        }

        const answersToReview = context.answers;
        let reviewHTML = `<h2>Review: ${context.subjectName} - ${context.unitName}</h2>`;

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
        if (bookmarkedQuestions.some(bq => bq.id === questionId && bq.section === currentSection && bq.subject === currentSubject && bq.unit === currentUnit)) {
            bookmarkQuestionButton.textContent = 'Unbookmark Question';
            bookmarkQuestionButton.classList.add('bookmarked');
        } else {
            bookmarkQuestionButton.textContent = 'Bookmark Question';
            bookmarkQuestionButton.classList.remove('bookmarked');
        }
    }

    function toggleBookmark() {
        if (!questionsForUnit || !questionsForUnit[currentQuestionIndex]) return;

        const question = questionsForUnit[currentQuestionIndex];
        const bookmarkIndex = bookmarkedQuestions.findIndex(bq => bq.id === question.id && bq.section === currentSection && bq.subject === currentSubject && bq.unit === currentUnit);

        if (bookmarkIndex > -1) {
            bookmarkedQuestions.splice(bookmarkIndex, 1); // Unbookmark
        } else {
            bookmarkedQuestions.push({
                id: question.id,
                text: question.text,
                section: currentSection,
                subject: currentSubject,
                unit: currentUnit,
                // Could store question index within unit if needed for direct navigation
            }); // Bookmark
        }
        localStorage.setItem('bookmarkedQuestions', JSON.stringify(bookmarkedQuestions));
        updateBookmarkButtonState(question.id);
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

    // --- Search Functionality ---
    function filterCurrentlyDisplayedList(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        let itemsToFilter;
        let container;

        if (currentPage === 'section' && subjectListContainer) {
            itemsToFilter = subjectListContainer.querySelectorAll('.list-item');
            container = subjectListContainer;
        } else if (currentPage === 'subject' && unitListContainer) {
            itemsToFilter = unitListContainer.querySelectorAll('.list-item');
            container = unitListContainer;
        } else {
            // Search is not actively filtering a list on other pages in this simple version
            return;
        }

        let foundItems = 0;
        itemsToFilter.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = ''; // Show item
                foundItems++;
            } else {
                item.style.display = 'none'; // Hide item
            }
        });

        // Remove previous "no results" message if any
        const noResultsMsg = container.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.remove();
        }

        if (foundItems === 0 && searchTerm.length > 0) {
            const p = document.createElement('p');
            p.textContent = 'No matching items found.';
            p.className = 'no-results-message';
            container.appendChild(p);
        }
    }

    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value;
            // If on a page with lists, filter them.
            if (currentPage === 'section' || currentPage === 'subject') {
                filterCurrentlyDisplayedList(searchTerm);
            }
            // Future enhancement: Implement global search results display for other pages.
            // For now, it will only actively filter when on section/subject pages.
            // If search term is cleared, and on a list page, reload the full list.
            else if (searchTerm === '' && (currentPage === 'section' || currentPage === 'subject')) {
                 if (currentPage === 'section') loadSubjects(currentSection);
                 if (currentPage === 'subject') loadUnits(currentSection, currentSubject);
            }
        });

        searchBar.addEventListener('focus', () => {
            // If search bar is focused and empty, and on a list page, ensure full list is shown
            if (searchBar.value === '' && (currentPage === 'section' || currentPage === 'subject')) {
                if (currentPage === 'section' && currentSection) loadSubjects(currentSection);
                if (currentPage === 'subject' && currentSection && currentSubject) loadUnits(currentSection, currentSubject);
            }
        });
    }

    // --- Progress Tracker ---
    function saveUnitProgress() {
        if (!currentSection || !currentSubject || !currentUnit || !questionsForUnit) return;

        // Initialize structure if not present
        progressData[currentSection] = progressData[currentSection] || { subjects: {} };
        progressData[currentSection].subjects[currentSubject] = progressData[currentSection].subjects[currentSubject] || { units: {} };

        const unitStats = progressData[currentSection].subjects[currentSubject].units[currentUnit] || { attempted: 0, correct: 0, completedCount: 0, bestScore: 0 };

        unitStats.attempted = questionsForUnit.length; // Assumes all questions are attempted when unit is "finished"
        unitStats.correct = score;
        unitStats.completedCount = (unitStats.completedCount || 0) + 1;
        unitStats.lastAttemptDate = new Date().toISOString();
        if (score > unitStats.bestScore) {
            unitStats.bestScore = score;
        }

        progressData[currentSection].subjects[currentSubject].units[currentUnit] = unitStats;

        // Update overall stats (simple sum for now, could be more complex)
        let totalAttemptedOverall = 0;
        let totalCorrectOverall = 0;
        let totalUnitsCompleted = 0;

        for (const sectionKey in progressData) {
            if (sectionKey === 'overallStats') continue;
            for (const subjectKey in progressData[sectionKey].subjects) {
                for (const unitKey in progressData[sectionKey].subjects[subjectKey].units) {
                    const u = progressData[sectionKey].subjects[subjectKey].units[unitKey];
                    totalAttemptedOverall += u.attempted * u.completedCount; // Or just sum of all questions in completed units
                    totalCorrectOverall += u.correct; // This sums the score of the latest attempt. Might need refinement if we want sum of all correct answers ever.
                    if (u.completedCount > 0) totalUnitsCompleted++;
                }
            }
        }
        progressData.overallStats = {
            totalAttempted: totalAttemptedOverall, // This interpretation might need review based on desired metric
            totalCorrect: totalCorrectOverall,   // Same as above
            totalUnitsCompleted: totalUnitsCompleted,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem('progressData', JSON.stringify(progressData));
        console.log("Progress saved:", progressData);

        // Optionally, refresh unit/subject list to show completion indicators
        if (currentPage === 'subject') {
            loadUnits(currentSection, currentSubject);
        }
    }

    function displayProgress() {
        const progressContent = document.getElementById('progress-content');
        if (!progressContent) return;

        progressContent.innerHTML = '<h3>Overall Statistics</h3>';
        if (progressData.overallStats) {
            progressContent.innerHTML += `
                <p>Total Questions Attempted in Completed Units: ${progressData.overallStats.totalAttempted || 0}</p>
                <p>Total Correct Answers in Latest Attempts: ${progressData.overallStats.totalCorrect || 0}</p>
                <p>Total Units Completed: ${progressData.overallStats.totalUnitsCompleted || 0}</p>
                <p><em>Last updated: ${progressData.overallStats.lastUpdated ? new Date(progressData.overallStats.lastUpdated).toLocaleString() : 'N/A'}</em></p>
            `;
        } else {
            progressContent.innerHTML += '<p>No overall progress tracked yet.</p>';
        }

        progressContent.innerHTML += '<h3>Progress by Unit</h3>';
        let hasUnitProgress = false;
        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.paddingLeft = '0';


        for (const sectionKey in progressData) {
            if (sectionKey === 'overallStats' || !progressData[sectionKey].subjects) continue;

            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `<h4>${sectionKey}</h4>`;
            const subjectUl = document.createElement('ul');
            subjectUl.style.paddingLeft = '20px';

            for (const subjectKey in progressData[sectionKey].subjects) {
                if (!progressData[sectionKey].subjects[subjectKey].units) continue;

                const subjectLi = document.createElement('li');
                subjectLi.innerHTML = `<h5>${subjectKey}</h5>`;
                const unitUl = document.createElement('ul');
                unitUl.style.paddingLeft = '20px';

                for (const unitKey in progressData[sectionKey].subjects[subjectKey].units) {
                    hasUnitProgress = true;
                    const unit = progressData[sectionKey].subjects[subjectKey].units[unitKey];
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
                    subjectLi.appendChild(unitUl);
                    subjectUl.appendChild(subjectLi);
                }
            }
            if (subjectUl.hasChildNodes()) {
                sectionDiv.appendChild(subjectUl);
                ul.appendChild(sectionDiv);
            }
        }

        if (!hasUnitProgress) {
            ul.innerHTML = '<li>No specific unit progress tracked yet. Complete some units!</li>';
        }
        progressContent.appendChild(ul);
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


    // Modify loadUnits to display completion indicators
    const originalLoadUnits = loadUnits;
    loadUnits = function(section, subjectName) {
        originalLoadUnits(section, subjectName); // Call original to populate units

        // Now, iterate over the newly created unit items and add indicators
        const unitItems = unitListContainer.querySelectorAll('.list-item');
        unitItems.forEach(item => {
            const unitName = item.dataset.unitName; // We stored this earlier
            if (progressData[section]?.subjects[subjectName]?.units[unitName]?.completedCount > 0) {
                let indicator = item.querySelector('.completion-indicator');
                if (!indicator) {
                    indicator = document.createElement('span');
                    indicator.className = 'completion-indicator';
                    indicator.textContent = ' ✔️'; // Simple checkmark
                    indicator.title = `Completed ${progressData[section].subjects[subjectName].units[unitName].completedCount} time(s). Best: ${progressData[section].subjects[subjectName].units[unitName].bestScore}/${progressData[section].subjects[subjectName].units[unitName].attempted}`;
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
                    <p><strong>${bookmark.subject} - ${bookmark.unit}</strong></p>
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
                    // Need to find the specific question index within its unit
                    const questionsInUnit = window.examData[bookmark.section]?.subjects[bookmark.subject]?.units[bookmark.unit];
                    let questionIdxInUnit = -1;
                    if (questionsInUnit) {
                        questionIdxInUnit = questionsInUnit.findIndex(q => q.id === bookmark.id);
                    }

                    navigateTo('question', {
                        sectionType: bookmark.section,
                        subjectName: bookmark.subject,
                        unitName: bookmark.unit
                        // We'll also need to make loadQuestions potentially jump to a specific question index
                    });
                    // Post-navigation: jump to the question if questionIdxInUnit is valid
                    // This requires loadQuestions/displayQuestion to handle an optional target question ID/index.
                    // For now, it navigates to the unit. Fine-tuning jump can be an enhancement.
                    // Let's try to make it jump:
                    if (questionIdxInUnit !== -1) {
                        // This needs to be handled after questionsForUnit is loaded by navigateTo's call to loadQuestions
                        // We can pass it in context, and loadQuestions can use it.
                        // Modifying navigateTo and loadQuestions for this:
                        navigateTo('question', {
                            sectionType: bookmark.section,
                            subjectName: bookmark.subject,
                            unitName: bookmark.unit,
                            targetQuestionId: bookmark.id // Pass target ID
                        });
                    }
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
