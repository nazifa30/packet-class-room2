 // Add event listener for the Quiz button
 document.getElementById('addQuizButton').addEventListener('click', function() {
    // Create a new div to hold the quiz question and answers
    const quizDiv = document.createElement('div');
    quizDiv.className = 'quiz-item mb-3 border p-2 rounded'; // Style for quiz item

    // Create elements for the quiz question
    quizDiv.innerHTML = `
        <div class="mb-2">
            <label for="question" class="form-label">Question</label>
            <input type="text" class="form-control form-control-sm" placeholder="Enter your question" required>
        </div>
        <div class="mb-2">
            <label for="answer1" class="form-label">A</label>
            <input type="text" class="form-control form-control-sm" placeholder="choice A" required>
        </div>
        <div class="mb-2">
            <label for="answer2" class="form-label">B</label>
            <input type="text" class="form-control form-control-sm" placeholder="choice B" required>
        </div>
        <div class="mb-2">
            <label for="answer3" class="form-label">C</label>
            <input type="text" class="form-control form-control-sm" placeholder="choice C" required>
        </div>
        <div class="mb-2">
            <label for="answer4" class="form-label">D</label>
            <input type="text" class="form-control form-control-sm" placeholder="choice D" required>
        </div>
        <div class="mb-2">
            <label for="correctIndex" class="form-label">Correct Answer Index (1-4)</label>
            <input type="number" class="form-control form-control-sm" min="1" max="4" placeholder="Index" required>
        </div>
        <div class="mb-2">
            <label for="explanation" class="form-label">Explanation</label>
            <input type="text" class="form-control form-control-sm" placeholder="Why is this answer correct?" required>
        </div>
        <button class="btn btn-danger btn-sm remove-quiz-button" type="button">Remove</button>
    `;

    // Append the new quiz div to the quiz container
    document.getElementById('quizContainer').appendChild(quizDiv);

    // Add event listener to the remove button
    quizDiv.querySelector('.remove-quiz-button').addEventListener('click', function() {
        quizDiv.remove(); // Remove the quiz item from the DOM
    });
});

// Add event listener for the Flashcard button
document.getElementById('addFlashcardButton').addEventListener('click', function() {
    // Create a new div to hold the flashcard
    const flashcardDiv = document.createElement('div');
    flashcardDiv.className = 'flashcard-item mb-3 border p-2 rounded'; // Style for flashcard item

    // Create a style element for placeholder color
    const style = document.createElement('style');
    style.innerHTML = `
        input::placeholder {
            color: white !important; /* Placeholder text color */
        }
    `;
    document.head.appendChild(style);

    // Create elements for the flashcard inputs
    flashcardDiv.innerHTML = `
        <div class="mb-2">
            <label for="front" class="form-label">Front</label>
            <input type="text" class="form-control form-control-sm" style="color: white; background-color: black;" placeholder="Enter term" required>
        </div>
        <div class="mb-2">
            <label for="back" class="form-label">Back</label>
            <input type="text" class="form-control form-control-sm" style="color: white; background-color: black;" placeholder="Enter definition" required>
        </div>
        <button class="btn btn-danger btn-sm remove-flashcard-button" type="button">✖</button>
    `;

    // Append the new flashcard div to the flashcard container
    document.getElementById('flashcardContainer').appendChild(flashcardDiv);

    // Add event listener to the remove button
    flashcardDiv.querySelector('.remove-flashcard-button').addEventListener('click', function() {
        flashcardDiv.remove(); // Remove the flashcard item from the DOM
    });
});


// Function to show content based on navigation clicks
function showContent(section) {
    // Hide the welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.style.display = 'none';

    // Hide all content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((sec) => {
        sec.style.display = 'none';
    });

    // Show the selected section
    const selectedContent = document.getElementById(section + 'Content');
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }
}


let capsules = JSON.parse(localStorage.getItem('capsules')) || [];

// Function to add flashcard row
function addFlashcardRow(front = "", back = "") {
    const row = document.createElement('div');
    row.className = 'row g-2 align-items-end';
    row.innerHTML = `
        <div class="col">
            <label class="form-label">Front</label>
            <input type="text" class="form-control fc-front" value="${front}">
        </div>
        <div class="col">
            <label class="form-label">Back</label>
            <input type="text" class="form-control fc-back" value="${back}">
        </div>
        <div class="col-auto">
            <button class="btn-outline-danger btnDel" onclick="this.parentElement.parentElement.remove()">✖</button>
        </div>
    `;
    document.getElementById('flashcardContainer').appendChild(row);
}

// Function to add quiz row
function addQuizRow() {
    const row = document.createElement('div');
    row.className = 'row g-2 align-items-end';
    row.innerHTML = `
        <div class="col">
            <label class="form-label">Question</label>
            <input type="text" class="form-control quiz-question" placeholder="Enter Question">
        </div>
        <div class="col">
            <label class="form-label">Answer</label>
            <input type="text" class="form-control quiz-answer" placeholder="Enter Answer">
        </div>
        <div class="col-auto">
            <button class="btn-outline-danger btnDel" onclick="this.parentElement.parentElement.remove()">✖</button>
        </div>
    `;
    document.getElementById('quizContainer').appendChild(row);
}

// Save button functionality
document.getElementById('saveButton').addEventListener('click', function() {
    const title = document.getElementById('title').value;
    const subject = document.getElementById('subject').value;
    const level = document.getElementById('level').value;
    const description = document.getElementById('description').value;
    const notes = document.getElementById('notes').value;
    const flashcards = Array.from(document.querySelectorAll('.fc-front')).map((front, index) => ({
        front: front.value,
        back: document.querySelectorAll('.fc-back')[index].value
    })).filter(card => card.front || card.back);
    const quizzes = Array.from(document.querySelectorAll('.quiz-question')).map((question, index) => ({
        question: question.value,
        answer: document.querySelectorAll('.quiz-answer')[index].value
    })).filter(quiz => quiz.question && quiz.answer);

    if (!title || (!notes && flashcards.length === 0 && quizzes.length === 0)) {
        alert('Please fill in the title and at least one of notes, flashcards, or quizzes.');
        return;
    }

    const capsule = {
        id: Date.now(),
        title,
        subject,
        level,
        description,
        notes,
        flashcards,
        quizzes,
        updatedAt: new Date().toISOString(),
    };

    capsules.push(capsule);
    localStorage.setItem('capsules', JSON.stringify(capsules));
    alert('Capsule saved!');

    updateCapsuleSelector();
});

// Update capsule selector dropdown
function updateCapsuleSelector() {
    const selector = document.getElementById('dropdownMenuButton').nextElementSibling;
    selector.innerHTML = '';
    capsules.forEach(capsule => {
        const option = document.createElement('li');
        option.innerHTML = `<a class="dropdown-item" href="#" onclick="loadCapsule(${capsule.id})">${capsule.title}</a>`;
        selector.appendChild(option);
    });
}

// Load capsule content
function loadCapsule(id) {
    const selectedCapsule = capsules.find(c => c.id === id);
    if (selectedCapsule) {
        document.getElementById('title').value = selectedCapsule.title;
        document.getElementById('subject').value = selectedCapsule.subject;
        document.getElementById('level').value = selectedCapsule.level;
        document.getElementById('description').value = selectedCapsule.description;
        document.getElementById('notes').value = selectedCapsule.notes;

        // Clear existing flashcards and quizzes
        document.getElementById('flashcardContainer').innerHTML = '';
        document.getElementById('quizContainer').innerHTML = '';

        // Render flashcards
        selectedCapsule.flashcards.forEach(card => addFlashcardRow(card.front, card.back));
        
        // Render quizzes
        selectedCapsule.quizzes.forEach(quiz => addQuizRow(quiz.question, quiz.answer));
    }
}

// Initialize the dropdown on page load
document.addEventListener('DOMContentLoaded', updateCapsuleSelector);
document.getElementById('addFlashcardButton').addEventListener('click', addFlashcardRow);
document.getElementById('addQuizButton').addEventListener('click', addQuizRow);