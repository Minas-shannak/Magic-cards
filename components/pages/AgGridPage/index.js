import { AgDataGrid } from '../../organisms/AgDataGrid/index.js';
import { createElement } from '../../../utils/index.js';
import { createAddCardForm } from '../../../utils/AgGridManage/index.js';

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

    const addCardForm = createAddCardForm((newCard) => {
        this.grid.addCard(newCard);
      });

    existingPageContent.append(title, addCardForm, this.grid.gridWrapper);
    return existingPageContent;
  }
}