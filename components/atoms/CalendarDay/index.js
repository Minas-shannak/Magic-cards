import { createElement, taskStorage } from "../../../utils/index.js";
import { MAX_VISIBLE_TASKS, DATE_FORMAT_OPTIONS } from '../../../constants/index.js';

export class CalendarDay {
    constructor(day, dateKey, isToday, tasksForDay, calendar) {
        this.day = day;
        this.dateKey = dateKey;
        this.isToday = isToday;
        this.tasksForDay = tasksForDay;
        this.calendar = calendar;
        this.date = new Date(dateKey);
        
        this.element = this.createDayElement();
    }

    createDayElement() {
        const dayClass = this.isToday ? 'day today' : 'day';
        
        const dayContainer = createElement('div', {
            className: dayClass,
            id: `day-${this.day}`,
            'data-date': this.dateKey
        });

        const dayNumber = createElement('div', { className: 'day-number' }, this.day);
        dayContainer.appendChild(dayNumber);

        const taskContainer = createElement('div', { className: 'task-container' });
        
        this.tasksForDay.slice(0, MAX_VISIBLE_TASKS).forEach(task => {
            const taskElement = createElement('div', {
                className: 'task',
                draggable: true,
                'data-id': task.id
            }, task.name);
            
            taskElement.addEventListener('dragstart', (e) => this.onDragStart(e));
            taskContainer.appendChild(taskElement);
        });

        if (this.tasksForDay.length > MAX_VISIBLE_TASKS) {
            const moreTasks = createElement('div', 
                { className: 'more-tasks' }, 
                `+${this.tasksForDay.length - MAX_VISIBLE_TASKS} more`
            );
            taskContainer.appendChild(moreTasks);
        }

        dayContainer.appendChild(taskContainer);
        
        dayContainer.addEventListener('dragover', (e) => this.onDragOver(e));
        dayContainer.addEventListener('drop', (e) => this.onDrop(e));

        return dayContainer;
    }

    onDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.getAttribute('data-id'));
        event.dataTransfer.effectAllowed = 'move';
        event.currentTarget.style.opacity = '0.4';
    }

    onDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        event.currentTarget.classList.add('drag-over');
    }

    onDrop(event) {
        event.preventDefault();
        event.currentTarget.classList.remove('drag-over');
        
        const taskId = event.dataTransfer.getData('text/plain');
        
        if (!taskId) {
            console.error("Error: Dropped Task ID is missing.");
            return;
        }
        
        let tasks = taskStorage.load() || [];
        let taskFound = false;
        
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                taskFound = true;
                return { ...task, date: this.dateKey };
            }
            return task;
        });
        
        if (!taskFound) {
            console.error("Error: Task not found in storage.");
            return;
        }
    
        taskStorage.save(tasks);
        
        if (this.calendar) {
            this.calendar.render();
        } else {
            console.error("Error: Calendar reference is missing.");
        }
    }

    render() {
        return this.element;
    }
}