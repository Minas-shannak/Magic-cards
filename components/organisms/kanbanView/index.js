import { createElement } from '../../../utils/index.js';
import { KanbanStorage } from '../../../utils/index.js';
// import { KANBAN_CARD } from '../../../constants/index.js';

export class KanbanView {
  constructor() {
    this.columns = [
      { id: 'todo', label: 'To Do' },
      { id: 'inProgress', label: 'In Progress' },
      { id: 'done', label: 'Done' }
    ];
    this.stateManager = KanbanStorage;
    this.element = createElement('div', { className: 'kanban-page' });
    this.kanbanContainer = createElement('div', { id: 'kanbanView', className: 'kanban-view' });

    this.element.appendChild(createElement('h1', {}, 'Kanban Page'));
    this.element.appendChild(this.kanbanContainer);

    this.render();
    this.initDragAndDrop();
    this.loadState();
  }

  render() {
    this.kanbanContainer.innerHTML = '';

    this.columns.forEach(({ id, label }) => {
      const column = createElement('div', { id, className: 'column' });
      column.appendChild(createElement('h3', {}, label));

      // إنشاء بطاقات مبدئية في عمود "To Do"
      if (id === 'todo') {
        for (let i = 1; i <= 4; i++) {
          const testCard = createElement('div', {
            className: 'card KanbanCard',
            id: `card${i}`,
            draggable: true
          }, `Task ${i}`);
          column.appendChild(testCard);
        }
      }

      this.kanbanContainer.appendChild(column);
    });
  }

  initDragAndDrop() {
    this.kanbanContainer.addEventListener('dragstart', this.dragStart);
    this.kanbanContainer.addEventListener('dragend', this.dragEnd.bind(this));
    this.kanbanContainer.addEventListener('dragover', this.dragOver);
    this.kanbanContainer.addEventListener('drop', this.dropCard.bind(this));
  }

  dragStart(event) {
    if (event.target.classList.contains('card')) {
      event.target.classList.add('dragging');
      event.dataTransfer.setData('text', event.target.id);
    }
  }

  dragEnd(event) {
    if (event.target.classList.contains('card')) {
      event.target.classList.remove('dragging');
      this.saveState();
    }
  }

  dragOver(event) {
    event.preventDefault();
  }

  dropCard(event) {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData('text');
    const card = document.getElementById(draggedId);

    const column = event.target.closest('.column');
    if (column && card) {
      column.appendChild(card);
      this.saveState();
    }
  }

  saveState() {
    const state = {};
    this.columns.forEach(({ id }) => {
      const cards = document.querySelectorAll(`#${id} .card`);
      state[id] = Array.from(cards).map(c => c.id);
    });
    this.stateManager.save(state);
  }

  loadState() {
    const saved = this.stateManager.load();
    if (!saved) return;

    this.columns.forEach(({ id }) => {
      const column = document.getElementById(id);
      if (!column) return;

      (saved[id] || []).forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card) {
          column.appendChild(card);
        }
      });
    });
  }
}
