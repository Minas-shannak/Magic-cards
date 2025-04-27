import { createElement, taskStorage } from '../../../utils/index.js';
import { CalendarDay } from '../../atoms/CalendarDay/index.js';
import { CalendarHeader } from '../../molecules/CalendarHeader/index.js';

export class CalendarView {
    constructor() {
        this.currentDate = new Date();
        this.tasks = this.loadTasks();
        
        this.element = createElement('div', { className: 'calendar-view' });
        this.header = new CalendarHeader(
            () => this.changeMonth(-1), 
            () => this.changeMonth(1)
        );
        this.daysContainer = createElement('div', { className: 'calendar-days' });
        
        this.element.append(this.header.element, this.daysContainer);
        this.render();
    }

    getDateKey(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    loadTasks() {
        let tasks = taskStorage.load() || [];
        
        if (tasks.length === 0) {
            tasks = this.generateSampleTasks();
            taskStorage.save(tasks);
        }
        
        return tasks;
    }

    generateSampleTasks() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        return Array.from({ length: 10 }, (_, i) => ({
            id: crypto.randomUUID(),
            name: `Task ${i + 1}`,
            date: this.getDateKey(new Date(year, month, Math.floor(Math.random() * daysInMonth) + 1))
        }));
    }

    render() {
        this.daysContainer.innerHTML = '';
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
        
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        
        this.header.updateMonthYear(
            `${this.currentDate.toLocaleString('default', { month: 'long' })} ${year}`
        );
        
        this.renderDayNames();
        this.renderEmptyDays(firstDayOfMonth);
        
        for (let day = 1; day <= lastDateOfMonth; day++) {
            const date = new Date(year, month, day);
            const dateKey = this.getDateKey(date);
            const isToday = isCurrentMonth && day === today.getDate();
            
            const tasksForDay = this.tasks.filter(task => {
                const taskDate = new Date(task.date);
                return taskDate.getFullYear() === date.getFullYear() && 
                       taskDate.getMonth() === date.getMonth() && 
                       taskDate.getDate() === date.getDate();
            });
            
            const calendarDay = new CalendarDay(
                day, 
                dateKey, 
                isToday, 
                tasksForDay, 
                this
            );
            
            this.daysContainer.appendChild(calendarDay.render());
        }
    }

    renderDayNames() {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            const dayNameElement = createElement('div', { className: 'day-name' }, day);
            this.daysContainer.appendChild(dayNameElement);
        });
    }

    renderEmptyDays(count) {
        for (let i = 0; i < count; i++) {
            const emptyDay = createElement('div', { className: 'day empty' });
            this.daysContainer.appendChild(emptyDay);
        }
    }

    changeMonth(offset) {
        this.currentDate.setMonth(this.currentDate.getMonth() + offset);
        this.tasks = this.loadTasks();
        this.render();
    }
}