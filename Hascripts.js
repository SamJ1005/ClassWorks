document.addEventListener('DOMContentLoaded', () => {
    const monthDisplay = document.getElementById('month-display');
    const habitsListEl = document.getElementById('habits-list');
    const daysHeaderEl = document.getElementById('days-header');
    const addHabitForm = document.getElementById('add-habit-form');
    const newHabitInput = document.getElementById('new-habit-input');
    const overallPie = document.getElementById('overall-pie');
    const overallPercentage = document.getElementById('overall-percentage');
    const habitTemplate = document.getElementById('habit-row-template');
    const pieLegendEl = document.getElementById('pie-legend');

    const vibrantColors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#06b6d4", "#a855f7", "#ef4444", "#14b8a6"];

    let habits = JSON.parse(localStorage.getItem('habits')) || [];

    // Assign colors to any existing habits that might literally not have one
    habits.forEach((habit, index) => {
        if (!habit.color) {
            habit.color = vibrantColors[index % vibrantColors.length];
        }
    });

    // Determine current month and days
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const monthName = today.toLocaleString('default', { month: 'long', year: 'numeric' });

    // For storing month ID to reset habits when month changes
    const monthId = `${currentYear}-${currentMonth}`;
    let savedMonthId = localStorage.getItem('monthId');
    if (savedMonthId !== monthId) {
        // New month, clear checkboxes but keep habits
        habits.forEach(h => h.days = Array(daysInMonth).fill(false));
        localStorage.setItem('monthId', monthId);
        saveHabits();
    }

    monthDisplay.textContent = monthName;

    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    function createEmptyDays() {
        return Array(daysInMonth).fill(false);
    }

    function updateOverallProgress() {
        pieLegendEl.innerHTML = '';

        if (habits.length === 0) {
            overallPie.style.background = `conic-gradient(rgba(255,255,255,0.05) 0% 100%)`;
            overallPercentage.textContent = '0%';
            return;
        }

        let totalDays = habits.length * daysInMonth;
        let totalCheckedDays = 0;

        let conicGradients = [];
        let currentAngle = 0; // out of 100

        habits.forEach(habit => {
            // How many days of THIS habit are checked
            let checked = habit.days.slice(0, daysInMonth).filter(d => Boolean(d)).length;
            totalCheckedDays += checked;

            // Percentage of TOTAL POSSIBLE checkmarks across ALL habits
            let percentOfTotal = (checked / totalDays) * 100;
            if (percentOfTotal > 0) {
                conicGradients.push(`${habit.color} ${currentAngle}% ${currentAngle + percentOfTotal}%`);
                currentAngle += percentOfTotal;
            }

            // Populate the Legend regardless so they can see all habits
            const item = document.createElement('div');
            item.className = 'legend-item';
            item.innerHTML = `
                <div class="legend-color" style="background-color: ${habit.color}"></div>
                <span class="legend-name">${habit.name}</span>
                <span class="legend-value">${checked} d</span>
            `;
            pieLegendEl.appendChild(item);
        });

        if (currentAngle < 100) {
            conicGradients.push(`rgba(255,255,255,0.05) ${currentAngle}% 100%`);
        }

        const percentage = Math.round((totalCheckedDays / totalDays) * 100);
        overallPie.style.background = `conic-gradient(${conicGradients.join(', ')})`;
        overallPercentage.textContent = `${percentage}%`;
    }

    function generateHeader() {
        daysHeaderEl.innerHTML = '';

        // Add the sticky column for the habit names (header)
        const nameColHeader = document.createElement('div');
        nameColHeader.className = 'habit-name-col';
        nameColHeader.textContent = 'Habit List';
        daysHeaderEl.appendChild(nameColHeader);

        // the flex container for days so they map nicely 
        const headerDaysContainer = document.createElement('div');
        headerDaysContainer.className = 'days-container';

        // Add columns for each day of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const dateObj = new Date(currentYear, currentMonth, i);
            const dayName = dateObj.toLocaleString('default', { weekday: 'short' });

            const dayCol = document.createElement('div');
            dayCol.className = 'day-col';

            const dayDateSpan = document.createElement('span');
            dayDateSpan.className = 'day-date';
            dayDateSpan.textContent = i;

            const dayNameSpan = document.createElement('span');
            dayNameSpan.className = 'day-name';
            dayNameSpan.textContent = dayName;

            // Highlight current day in header
            if (i === today.getDate()) {
                dayDateSpan.style.color = 'var(--primary)';
                dayNameSpan.style.color = 'var(--primary)';
            }

            dayCol.appendChild(dayDateSpan);
            dayCol.appendChild(dayNameSpan);
            headerDaysContainer.appendChild(dayCol);
        }

        daysHeaderEl.appendChild(headerDaysContainer);
    }

    function updateHabitProgress(habit, rowEl) {
        const checkedCount = habit.days.filter(d => Boolean(d)).length;
        const percentage = Math.round((checkedCount / daysInMonth) * 100);

        const miniProgress = rowEl.querySelector('.habit-mini-progress');
        miniProgress.textContent = `${checkedCount} / ${daysInMonth} days`;

        const smallCircle = rowEl.querySelector('.small-progress-circle');
        const smallPercentage = rowEl.querySelector('.small-percentage');

        // Use habit's specific color for its small ring
        smallCircle.style.background = `conic-gradient(${habit.color} ${percentage}%, rgba(255,255,255,0.1) 0%)`;
        smallPercentage.textContent = `${percentage}%`;

        updateOverallProgress();
    }

    function renderHabit(habit, index) {
        const clone = habitTemplate.content.cloneNode(true);
        const row = clone.querySelector('.habit-row');

        row.querySelector('.habit-name').textContent = habit.name;
        row.querySelector('.color-dot').style.backgroundColor = habit.color;

        const daysContainer = row.querySelector('.days-container');

        // Align habit days with daysInMonth
        if (!habit.days || habit.days.length !== daysInMonth) {
            const oldDays = habit.days || [];
            habit.days = Array(daysInMonth).fill(false);
            for (let i = 0; i < Math.min(oldDays.length, daysInMonth); i++) {
                habit.days[i] = oldDays[i];
            }
        }

        for (let i = 0; i < daysInMonth; i++) {
            const dayCol = document.createElement('div');
            dayCol.className = 'day-col';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'day-checkbox';
            checkbox.checked = habit.days[i];

            if (habit.days[i]) {
                checkbox.style.backgroundColor = habit.color;
                checkbox.style.borderColor = habit.color;
            }

            // Highlight today's column slightly 
            if (i + 1 === today.getDate()) {
                dayCol.style.backgroundColor = 'rgba(255,255,255,0.02)';
                dayCol.style.borderRadius = '8px';
            }

            checkbox.addEventListener('change', (e) => {
                const checkedDate = i + 1; // 1-indexed day of the month
                const todayDate = today.getDate();

                // Allow checking only for today and the 2 previous days
                if (checkedDate > todayDate || checkedDate < todayDate - 2) {
                    e.preventDefault();
                    e.target.checked = !e.target.checked; // Revert visually
                    alert("You can only check off habits for today and the 2 previous days. Try not to cheat the Checkboxes!");
                    return;
                }

                habit.days[i] = e.target.checked;

                if (e.target.checked) {
                    checkbox.style.backgroundColor = habit.color;
                    checkbox.style.borderColor = habit.color;
                } else {
                    checkbox.style.backgroundColor = '';
                    checkbox.style.borderColor = '';
                }

                saveHabits();
                updateHabitProgress(habit, row);
            });

            dayCol.appendChild(checkbox);
            daysContainer.appendChild(dayCol);
        }

        // Delete logic
        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete the habit "${habit.name}"?`)) {
                row.style.opacity = '0';
                row.style.transform = 'translateX(-30px)';
                setTimeout(() => {
                    habits.splice(index, 1);
                    saveHabits();
                    renderAllHabits();
                }, 300);
            }
        });

        habitsListEl.appendChild(row);
        updateHabitProgress(habit, row);
    }

    function renderAllHabits() {
        habitsListEl.innerHTML = '';
        habits.forEach((habit, index) => {
            renderHabit(habit, index);
        });
        updateOverallProgress();
    }

    addHabitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = newHabitInput.value.trim();
        if (value) {
            const newHabit = {
                id: Date.now(),
                name: value,
                color: vibrantColors[habits.length % vibrantColors.length], // Assign a distinctive color
                days: createEmptyDays()
            };
            habits.push(newHabit);
            saveHabits();
            renderAllHabits();
            newHabitInput.value = '';

            // Auto scroll table to the bottom slowly if feeling long
            const tableScroll = document.querySelector('.table-scroll');
            if (tableScroll) {
                setTimeout(() => {
                    tableScroll.scrollBy({ top: 100, behavior: 'smooth' });
                }, 100);
            }
        }
    });

    // Initialize Check
    generateHeader();
    renderAllHabits();
});
