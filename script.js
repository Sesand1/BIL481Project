let fitnessGoal = 0;
let currentProgress = 0;
let calendarInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log("JavaScript is loaded and working!");

    // Tüm formları seç
    const forms = document.querySelectorAll('form');

    // Her form için submit event listener ekle
    forms.forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Varsayılan davranışı engelle
            const formData = new FormData(form); // Form verilerini al
            const formId = form.id; // Formun id'sini al

            // Veriyi uygun listeye ve takvime ekle
            switch (formId) {
                case 'sports-reminder-form':
                    handleSportsForm(formData);
                    break;
                case 'academic-form':
                    handleAcademicForm(formData);
                    break;
                case 'general-form':
                    handleGeneralForm(formData);
                    break;
                case 'quiz-exam-form':
                    handleQuizExamForm(formData);
                    break;
                case 'fitness-goal-form':
                    handleFitnessGoalForm(formData);
                    break;
                case 'fitness-progress-form':
                    handleFitnessProgressForm(formData);
                    break;
                case 'calorie-form':
                    handleCalorieForm(formData);
                    break;
                case 'study-session-form':
                    handleStudySessionForm(formData);
                    break;
                case 'assignment-form':
                    handleAssignmentForm(formData);
                    break;
                default:
                    console.error(`Unknown form ID: ${formId}`);
            }

            form.reset(); // Formu sıfırla
        });
    });

    renderCalendar();
});

function handleSportsForm(formData) {
    const list = document.getElementById('sports-reminders-list');
    const date = formData.get('date');
    const time = formData.get('time');
    const note = formData.get('note');

    appendToList(list, `Date: ${date} | Time: ${time} | Note: ${note}`);

    const start = `${date}T${time}`; 
    addEventToCalendar(note, start, 'sports'); 
}

function handleAcademicForm(formData) {
    const list = document.getElementById('academic-list');
    const date = formData.get('date');
    const time = formData.get('time');
    const note = formData.get('note');

    appendToList(list, `Date: ${date} | Time: ${time} | Note: ${note}`);

    const start = `${date}T${time}`;
    addEventToCalendar(note, start, 'academic'); 
}

function handleGeneralForm(formData) {
    const list = document.getElementById('general-container');
    const date = formData.get('date');
    const time = formData.get('time');
    const note = formData.get('note');

    appendToList(list, `Date: ${date} | Time: ${time} | Note: ${note}`);

    const start = `${date}T${time}`; 
    addEventToCalendar(note, start, 'general'); 
}

function handleQuizExamForm(formData) {
    const list = document.getElementById('quiz-exam-list');
    const date = formData.get('date');
    const time = formData.get('time');
    const subject = formData.get('subject');
    const type = formData.get('type');

    appendToList(list, `Date: ${date} | Time: ${time} | Subject: ${subject} (${type})`);

    const note = `${type.toUpperCase()}: ${subject}`;
    const start = `${date}T${time}`;

    addEventToCalendar(note, start, 'academic');
}

function handleStudySessionForm(formData) {
    const list = document.getElementById('study-session-list');
    const date = formData.get('date');
    const time = formData.get('time');
    const subject = formData.get('subject');

    appendToList(list, `Date: ${date} | Time: ${time} | Subject: ${subject}`);

    const start = `${date}T${time}`;
    addEventToCalendar(`Study: ${subject}`, start, 'academic');
}

function handleAssignmentForm(formData) {
    const list = document.getElementById('assignment-list');
    const dueDate = formData.get('due-date');
    const title = formData.get('title');
    const details = formData.get('details');

    appendToList(list, `Due: ${dueDate} | Title: ${title} | Details: ${details}`);

    const start = `${dueDate}T00:00`;
    addEventToCalendar(`Assignment: ${title}`, start, 'academic');
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = Math.min((currentProgress / fitnessGoal) * 100, 100);
    progressBar.style.width = `${progressPercent}%`;
    progressBar.textContent = `${Math.round(progressPercent)}%`;

    if (currentProgress >= fitnessGoal) {
        progressBar.style.backgroundColor = '#0078D7';
        progressBar.textContent = 'Goal Achieved!';
    }
}

function addFitnessProgress(date, reps, notes) {
    const fitnessProgressList = document.getElementById('fitness-progress-list');
    const listItem = document.createElement('li');
    listItem.textContent = `Date: ${date} | Reps: ${reps} | Notes: ${notes || 'N/A'}`;
    fitnessProgressList.appendChild(listItem);
}

function handleCalorieForm(formData) {
    const list = document.getElementById('calorie-list');
    const totalCalories = document.getElementById('total-calories');
    const food = formData.get('food');
    const calories = parseInt(formData.get('calories'), 10);

    appendToList(list, `${food}: ${calories} kcal`);

    const currentTotal = parseInt(totalCalories.textContent.replace(/\D/g, ''), 10) || 0;
    totalCalories.textContent = `Total Calories: ${currentTotal + calories}`;
}

function handleFitnessGoalForm(formData) {
    const goal = formData.get('goal'); 
    fitnessGoal = parseInt(goal, 10);
    currentProgress = 0; 

    const goalDisplay = document.getElementById('goal-display'); 
    goalDisplay.textContent = `Goal: ${fitnessGoal} reps`; 

    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = "0%";
    progressBar.textContent = "0%"; 

    updateProgressBar(); 
}

function handleFitnessProgressForm(formData) {
    const date = formData.get('date');
    const reps = parseInt(formData.get('reps'), 10);
    const notes = formData.get('notes');
    currentProgress += reps;
    addFitnessProgress(date, reps, notes);
    updateProgressBar();
}

function appendToList(list, content) {
    if (list) {
        const listItem = document.createElement('li');
        listItem.textContent = content;
        list.appendChild(listItem);
    } else {
        console.error('List not found for content:', content);
    }
}

function addEventToCalendar(title, start, category) {
    if (calendarInstance) {
        calendarInstance.addEvent({
            title,
            start,
            extendedProps: {
                category
            }
        });
    } else {
        console.error('Calendar instance not initialized.');
    }
}

let eventToDelete = null;  // Silinecek etkinlik

function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) {
        console.error('Calendar element not found!');
        return;
    }

    calendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            {
                title: 'Meeting with John',
                start: '2024-12-15T10:00:00',
                end: '2024-12-15T12:00:00',
                category: 'academic',  // You can set the category as needed
            },
            {
                title: 'Yoga Class',
                start: '2024-12-16T08:00:00',
                end: '2024-12-16T09:00:00',
                category: 'sports',  // You can set the category as needed
            }
        ]
,        
        editable: true,  // Etkinlikleri taşımayı aktif hale getirir
        eventDidMount: function(info) {
            const category = info.event.extendedProps.category;
            // Kategorilere göre renk belirleme
            if (category === 'academic') {
                info.el.style.backgroundColor = '#0078D7';
            } else if (category === 'sports') {
                info.el.style.backgroundColor = '#FF5733';
            } else if (category === 'general') {
                info.el.style.backgroundColor = '#378006';
            }

            // Çarpı simgesini etkinlik üzerine ekleyelim
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.innerHTML = '×';  // Çarpı işareti
            info.el.appendChild(deleteIcon);

            // Çarpı simgesine tıklandığında etkinliği silme işlemi
            deleteIcon.addEventListener('click', function(e) {
                e.stopPropagation();  // Çarpıya tıklanınca eventClick işlevini tetiklemesin
                eventToDelete = info.event; // Silinecek etkinliği kaydet
                deleteModal.style.display = 'flex';  // Modal'ı göster
            });
        }
    });

    calendarInstance.render();

    // Modal öğeleri
    const deleteModal = document.getElementById('deleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDelete');

    // Silme butonuna tıklanırsa, etkinliği takvimden sil
    confirmDelete.onclick = function() {
        if (eventToDelete) {
            eventToDelete.remove();  // Etkinliği takvimden sil
            deleteModal.style.display = 'none';  // Modal'ı kapat
        }
    };

    // İptal butonuna tıklanırsa, modal'ı kapat
    cancelDelete.onclick = function() {
        deleteModal.style.display = 'none';
    };

    // Modal dışına tıklanırsa, modal'ı kapat
    window.onclick = function(event) {
        if (event.target === deleteModal) {
            deleteModal.style.display = 'none';
        }
    };
}



function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('#tabs button');

    tabs.forEach(tab => {
        tab.style.visibility = 'hidden'; 
        tab.style.height = '0'; 
        tab.style.opacity = '0'; 
        tab.style.transform = 'translateY(10px)'; 
    });

    buttons.forEach(button => {
        button.classList.remove('active');
    });

    const activeTab = document.getElementById(tabName.toLowerCase());
    if (activeTab) {
        activeTab.style.visibility = 'visible'; 
        activeTab.style.height = 'auto'; 
        activeTab.style.opacity = '1';
        activeTab.style.transform = 'translateY(0)'; 

        const activeButton = Array.from(buttons).find(button => button.textContent.toLowerCase() === tabName.toLowerCase());
        if (activeButton) {
            activeButton.classList.add('active');
        }

        if (tabName.toLowerCase() === 'aio') {
            console.log('Rendering Calendar for All-in-One Tab');
            if (!calendarInstance) {
                renderCalendar();
            }
        }
    }
}

function showNestedTab(nestedTabName) {
    const nestedTabs = document.querySelectorAll('.nested-tab-content');
    nestedTabs.forEach(tab => {
        if (tab.id === nestedTabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    const buttons = document.querySelectorAll('#sports-tabs button, #academic-tabs button');
    buttons.forEach(button => {
        if (button.innerText.toLowerCase().replace(/\s+/g, '-') === nestedTabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

