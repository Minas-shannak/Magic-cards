import { AgDataGrid } from '../../organisms/AgDataGrid/index.js';
import { createElement } from '../../../utils/index.js';
import { AddCardForm } from '../../../utils/index.js';


export class AgGridPage {
  constructor() {
    this.grid = new AgDataGrid();
  }

  async init(pageContent) {
    await this.grid.loadData();
    this.draw(pageContent);
  }

  draw(existingPageContent) {
    const title = createElement('h2', {
      innerText: 'AG Grid Page',
      className: 'page-title',
    });

    const addCardForm = new AddCardForm((newCard) => {
      this.grid.addCard(newCard);
    }).element;

    existingPageContent.append(title, addCardForm, this.grid.gridWrapper);
    return existingPageContent;
  }
}
