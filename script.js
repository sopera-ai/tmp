document.addEventListener('DOMContentLoaded', () => {
    const leftColumn = document.getElementById('left-column');
    const rightColumn = document.getElementById('right-column');
    const nextButton = document.getElementById('next-btn');
    const downloadButton = document.getElementById('download-btn');

    let data = [];
    let currentQuestionIndex = 0;
    
    // JSON data for questions
    const questions = [
        {
            type: 'text',
            question: '1.标题:'
        },
        {
            type: 'dropdown',
            question: '2.机位（摄像机状态）:',
            options: [
                { value: 'Option1', text: 'Option 1' },
                { value: 'Option2', text: 'Option 2' },
                { value: 'Option3', text: 'Option 3' }
            ]
        },
        {
            type: 'dropdown',
            question: '3.拍摄对象状态:',
            options: [
                { value: 'Option1', text: 'Option 1' },
                { value: 'Option2', text: 'Option 2' },
                { value: 'Option3', text: 'Option 3' }
            ]
        },
        {
            type: 'tags',
            question: '4.景别:',
            options: [
                { value: 'Tag1', text: 'Tag 1' },
                { value: 'Tag2', text: 'Tag 2' },
                { value: 'Tag3', text: 'Tag 3' },
                { value: 'Tag4', text: 'Tag 4' },
                { value: 'Tag5', text: 'Tag 5' }
            ]
        },
        {
            type: 'tags',
            question: '5.视角:',
            options: [
                { value: 'Tag1', text: 'Tag 1' },
                { value: 'Tag2', text: 'Tag 2' },
                { value: 'Tag3', text: 'Tag 3' },
                { value: 'Tag4', text: 'Tag 4' },
                { value: 'Tag5', text: 'Tag 5' }
            ]
        },
        {
            type: 'tags',
            question: '6.运镜:',
            options: [
                { value: 'Tag1', text: 'Tag 1' },
                { value: 'Tag2', text: 'Tag 2' },
                { value: 'Tag3', text: 'Tag 3' },
                { value: 'Tag4', text: 'Tag 4' },
                { value: 'Tag5', text: 'Tag 5' }
            ]
        },
        {
            type: 'tags',
            question: '7.场景:',
            options: [
                { value: 'Tag1', text: 'Tag 1' },
                { value: 'Tag2', text: 'Tag 2' },
                { value: 'Tag3', text: 'Tag 3' },
                { value: 'Tag4', text: 'Tag 4' },
                { value: 'Tag5', text: 'Tag 5' }
            ]
        },
        {
            type: 'tags',
            question: '8.情节:',
            options: [
                { value: 'Tag1', text: 'Tag 1' },
                { value: 'Tag2', text: 'Tag 2' },
                { value: 'Tag3', text: 'Tag 3' },
                { value: 'Tag4', text: 'Tag 4' },
                { value: 'Tag5', text: 'Tag 5' }
            ]
        },
        {
            type: 'tags',
            question: '9.角色:',
            options: [
                { value: 'Tag1', text: 'Tag 1' },
                { value: 'Tag2', text: 'Tag 2' },
                { value: 'Tag3', text: 'Tag 3' },
                { value: 'Tag4', text: 'Tag 4' },
                { value: 'Tag5', text: 'Tag 5' }
            ]
        },
        {
            type: 'text',
            question: '3.Enter text:'
        }
    ];

    function renderQuestion(question, index, container) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = question.question;
        questionDiv.appendChild(label);
        
        if (question.type === 'dropdown') {
            const select = document.createElement('select');
            question.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.text;
                select.appendChild(opt);
            });
            select.id = `dropdown-${index}`;
            questionDiv.appendChild(select);
        } else if (question.type === 'tags') {
            const showTagsIcon = document.createElement('span');
            showTagsIcon.textContent = '🡇';  // Dropdown icon
            showTagsIcon.className = 'show-tags-icon';
            showTagsIcon.id = `show-tags-${index}`;
            questionDiv.appendChild(showTagsIcon);
            
            const tagContainer = document.createElement('div');
            tagContainer.className = 'tag-options';
            tagContainer.id = `tags-${index}`;
            tagContainer.style.display = 'none';  // Initially hidden
            
            question.options.forEach(option => {
                const tagDiv = document.createElement('div');
                tagDiv.className = 'tag';
                tagDiv.textContent = option.text;
                tagDiv.dataset.value = option.value;
                tagContainer.appendChild(tagDiv);
            });
            questionDiv.appendChild(tagContainer);
            
            const selectedTagsContainer = document.createElement('div');
            selectedTagsContainer.className = 'selected-tags';
            selectedTagsContainer.id = `selected-tags-${index}`;
            questionDiv.appendChild(selectedTagsContainer);
        } else if (question.type === 'text') {
            const textarea = document.createElement('textarea');
            textarea.id = `text-input-${index}`;
            questionDiv.appendChild(textarea);
        }
        
        container.appendChild(questionDiv);
    }

    function renderQuestions() {
        questions.forEach((question, index) => {
            if (index % 2 === 0) {
                renderQuestion(question, index, leftColumn);
            } else {
                renderQuestion(question, index, rightColumn);
            }
        });
    }

    function getCurrentAnswers() {
        const answers = {};
        questions.forEach((question, index) => {
            const element = document.getElementById(`dropdown-${index}`) ||
                            document.getElementById(`tags-${index}`) ||
                            document.getElementById(`text-input-${index}`);
            
            if (question.type === 'dropdown') {
                answers[question.question] = element.value;
            } else if (question.type === 'tags') {
                const selectedTags = Array.from(element.querySelectorAll('.tag.selected'))
                                           .map(tag => tag.dataset.value);
                answers[question.question] = selectedTags;
            } else if (question.type === 'text') {
                answers[question.question] = element.value;
            }
        });
        return answers;
    }


    function setupTagButtons() {
        questions.forEach((question, index) => {
            if (question.type === 'tags') {
                const showTagsIcon = document.getElementById(`show-tags-${index}`);
                const tagContainer = document.getElementById(`tags-${index}`);
                const selectedTagsContainer = document.getElementById(`selected-tags-${index}`);
                
                showTagsIcon.addEventListener('click', () => {
                    tagContainer.style.display = tagContainer.style.display === 'none' ? 'flex' : 'none';
                });
                
                tagContainer.addEventListener('click', (e) => {
                    if (e.target.classList.contains('tag')) {
                        e.target.classList.toggle('selected');
                        const value = e.target.dataset.value;
                        const tagText = e.target.textContent;

                        if (e.target.classList.contains('selected')) {
                            selectedTagsContainer.innerHTML += `<div class="tag">${tagText}</div>`;
                        } else {
                            const tagToRemove = Array.from(selectedTagsContainer.children)
                                                    .find(child => child.textContent === tagText);
                            if (tagToRemove) selectedTagsContainer.removeChild(tagToRemove);
                        }
                    }
                });
            }
        });
    }

    // Handle 'Next' button click
    nextButton.addEventListener('click', () => {
        const answers = getCurrentAnswers();
        
        if (Object.values(answers).every(value => value !== undefined && value !== '')) {
            data.push(answers);

            // Reset form for the next set of questions
            currentQuestionIndex++;
            leftColumn.innerHTML = '';  // Clear the previous questions
            rightColumn .innerHTML = ''; 
            renderQuestions();
            setupTagButtons();
        } else {
            alert('Please fill out all fields.');
        }
    });
    // Download JSON
    downloadButton.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    renderQuestions();  // Initial render
    setupTagButtons();  // Setup tag buttons functionality
});
