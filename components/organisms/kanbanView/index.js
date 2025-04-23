import { KanbanStorage } from "../../../utils/index.js";

export class KanbanView {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.columns = ['todo', 'inProgress', 'done'];
        this.stateManager = KanbanStorage;
        this.setup();
    }

    setup() {
        this.initDragAndDrop();
        this.loadState();
    }

    initDragAndDrop() {
        this.container.querySelectorAll('.card').forEach(card => {
            card.addEventListener('dragstart', this.dragStart);
            card.addEventListener('dragend', this.dragEnd.bind(this));
        });

        this.columns.forEach(id => {
            const column = document.getElementById(id);
            column.ondragover = this.dragOver;
            column.ondrop = this.dropCard.bind(this);
        });
    }

    dragStart(event) {
        event.target.classList.add('dragging');
        event.dataTransfer.setData('text', event.target.id);
    }

    dragEnd(event) {
        event.target.classList.remove('dragging');
        this.saveState();
    }

    dragOver(event) {
        event.preventDefault();
    }

    dropCard(event) {
        event.preventDefault();
        const draggedId = event.dataTransfer.getData('text');
        const card = document.getElementById(draggedId);
        if (event.target.classList.contains('column')) {
            event.target.appendChild(card);
            this.saveState();
        }
    }

    saveState() {
        const state = {};
        this.columns.forEach(id => {
            const cards = document.querySelectorAll(`#${id} .card`);
            state[id] = Array.from(cards).map(c => c.id);
        });
        this.stateManager.save(state);
    }

    loadState() {
        const saved = this.stateManager.load();
        if (!saved) return;
        this.columns.forEach(id => {
            const column = document.getElementById(id);
            (saved[id] || []).forEach(cardId => {
                const card = document.getElementById(cardId);
                card && column.appendChild(card);
            });
        });
    }
}