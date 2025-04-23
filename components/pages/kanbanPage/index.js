console.log('Kanban Page');
import { createElement } from '../../../utils/index.js';
import { KanbanView } from '../../organisms/KanbanView/index.js';
import { KANBAN_CARD } from '../../../constants/index.js';

export class KanbanPage {
  init(container) {
    container.className = 'kanban-page';
    container.appendChild(createElement('h1', {}, 'Kanban Page'));
    
    const kanbanContainer = createElement('div', { id: 'kanbanView', className: 'kanban-view' });

    const columns = [
      { id: 'todo', label: 'To Do' },
      { id: 'inProgress', label: 'In Progress' },
      { id: 'done', label: 'Done' },
    ];

    columns.forEach(({ id, label }) => {
      const column = createElement('div', { id, className: 'column' }, '');
      column.appendChild(createElement('h3', {}, label));
    
      if (id === 'todo') {
        for (let i = 1; i <= KANBAN_CARD; i++) {
          const testCard = createElement('div', {
            className: 'card KanbanCard',
            id: `card${i}`,
            draggable: true
          }, `Task ${i}`);
          column.appendChild(testCard);
        }
      }
    
      kanbanContainer.appendChild(column);
    });
    
    container.appendChild(kanbanContainer);
    new KanbanView('kanbanView');
  }
}

