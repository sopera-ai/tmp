document.addEventListener('DOMContentLoaded', () => {
    const leftColumn = document.getElementById('left-column');
    const rightColumn = document.getElementById('right-column');
    const nextButton = document.getElementById('next-btn');
    const downloadButton = document.getElementById('download-btn');
    const annotationCount = document.getElementById('annotation-count');

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
            question: '2.氛围 (Vibe):',
            options: [
                { value: 'Documentary', text: '纪录片风格' },
                { value: 'Dark and Gritty', text: '黑暗阴郁' },
                { value: 'Warm and Wholesome', text: '温暖治愈' },
                { value: 'Retro or Nostalgic', text: '复古怀旧' },
                { value: 'Surreal or Dreamlike', text: '奇幻超现实' },
                { value: 'Fast-Paced and Energetic', text: '快速动感' },
                { value: 'Suspenseful or Thrilling', text: '悬疑惊悚' }
            ]
        },
        {
            type: 'dropdown',
            question: '3.主题 (Theme):',
            options: [
                { value: '爱情', text: '爱情' },
                { value: '成长', text: '成长' },
                { value: '权力与背叛', text: '权力与背叛' },
                { value: '人性与道德', text: '人性与道德' },
                { value: '动作', text: '动作' },
                { value: '喜剧', text: '喜剧' },
                { value: '合家欢', text: '合家欢' },
                { value: '音乐', text: '音乐' },
                { value: '自我发现', text: '自我发现' }
            ]
        },
        {
            type: 'dropdown',
            question: '4.机位（摄像机状态）:',
            options: [
                { value: '固定机位', text: '固定机位' },
                { value: '移动机位', text: '移动机位' }
            ]
        },
        {
            type: 'text',
            question: '5.场景:'
            
        },
        {
            type: 'dropdown',
            question: '6.拍摄对象状态:',
            options: [
                { value: '运动状态', text: '运动状态' },
                { value: '固定状态', text: '固定状态' }
            ]
        },
        {
            type: 'text',
            question: '7.情节:'   
        },
        {
            type: 'dropdown',
            question: '8.景别:',
            options: [
                { value: '远景', text: '远景' },
                { value: '全景', text: '全景' },
                { value: '中景', text: '中景' },
                { value: '近景', text: '近景' },
                { value: '特写', text: '特写' }
                
            ]
        },
        {
            type: 'text',
            question: '9.角色:'
        },
        {
            type: 'dropdown',
            question: '10.视角:',
            options: [
                { value: '俯拍', text: '俯拍' },
                { value: '仰拍', text: '仰拍' },
                { value: '平视', text: '平视' },
                { value: '混合', text: '混合' }
            ]
        },
        {
            type: 'text',
            question: '11.动作:'
        },
        {
            type: 'dropdown',
            question: '12.运镜:',
            options: [
                { value: '推', text: '推' },
                { value: '拉', text: '拉' },
                { value: '摇', text: '摇' },
                { value: '移', text: '移' },
                { value: '跟', text: '跟' },
                { value: '甩', text: '甩' },
                { value: '混合', text: '混合' }
                
            ]
        },
        {
            type: 'text',
            question: '13.道具:'
        },
        {
            type: 'text',
            question: '14.灯光:'
        },
        {
            type: 'text',
            question: '15.表情:'
        },
        {
            type: 'text',
            question: '16.色彩:'
        },
        {
            type: 'text',
            question: '17.视效:'
        },
        {
            type: 'text',
            question: '18.声音:'
        },
        {
            type: 'text',
            question: '19.画面:'
        },
        {
            type: 'text',
            question: '20.台词:'
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
            showTagsIcon.textContent = '>';  // Dropdown icon
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
        annotationCount.textContent = `Currently annotated: ${data.length+1} items`;
        alert("save!")
        
        if (Object.values(answers).every(value => value !== undefined)) {//&& value !== ''
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
