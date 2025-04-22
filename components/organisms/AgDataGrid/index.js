import { createElement } from '../../../utils/index.js';
import { API_URL, DEFAULT_CARD_FETCH_SIZE } from '../../../constants/index.js';
import { LoadingSpinner } from '../../atoms/LoadingSpinner/index.js';
import { createDeleteButton } from '../../../utils/AgGridManage/index.js';
import { LocalStorageUtil } from '../../../utils/index.js';

const selectedCardsStorage = new LocalStorageUtil('selectedCards');
const cardDataStorage = new LocalStorageUtil('cardData');

export class AgDataGrid {
  constructor(gridOptions) {
    this.spinner = new LoadingSpinner();
    this._gridWrapper = createElement('div', {
      className: 'ag-theme-quartz',
      style: 'height: 500px; width: 80%;',
    });
    this.gridOptions = {
      columnDefs: [
        { field: 'name' },
        { field: 'manaCost' },
        {
          headerName: 'P/T',
          valueGetter: (params) =>
            `${params.data.power || 'N/A'} / ${params.data.toughness || 'N/A'}`,
        },
        { field: 'type' },
        { field: 'rarity' },
        { field: 'setName' },
        { field: 'artist' },
        {
          headerName: 'Actions',
          cellRenderer: this.deleteCard(),
        },
      ],
      defaultColDef: {
        sortable: true,
      },
      pagination: true,
      rowSelection: {
        mode: 'multiRow',
        checkboxes: true,
      },
      context: {
        agDataGrid: this,
      },
    };
  }

  async loadData() {
    this.spinner.show();

    const localData = this.loadFromLocalStorage();
    if (localData) {
      this.rowData = localData;
    } else {
      const response = await fetch(API_URL);
      const data = await response.json();
      this.rowData = data.cards.slice(0, DEFAULT_CARD_FETCH_SIZE);
      this.saveToLocalStorage();
    }

    this.renderGrid();
    this.spinner.hide();
  }

  renderGrid() {
    this.gridOptions.rowData = this.rowData;

    this.gridOptions.onGridReady = (params) => {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

      // Load selected cards from LocalStorageUtil
      const savedSelectedCards = selectedCardsStorage.load();
      if (savedSelectedCards && savedSelectedCards.length > 0) {
        this.gridApi.forEachNode((node) => {
          const isSelected = savedSelectedCards.some(
            (saved) =>
              saved.name === node.data.name &&
              saved.manaCost === node.data.manaCost
          );
          if (isSelected) {
            node.setSelected(true);
          }
        });
      }
    };

    this.gridOptions.onSelectionChanged = () => {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedCards = selectedNodes.map((node) => node.data);
      selectedCardsStorage.save(selectedCards); // Save selected cards using LocalStorageUtil
    };

    agGrid.createGrid(this._gridWrapper, this.gridOptions);
  }

  addCard(newCard) {
    console.log('Adding new card:', newCard);
    this.gridApi.applyTransaction({ add: [newCard] });
    this.rowData.push(newCard);
    this.saveToLocalStorage();
  }

  deleteCard() {
    return createDeleteButton;
  }

  saveToLocalStorage() {
    cardDataStorage.save(this.rowData); // Save the full card data using LocalStorageUtil
  }

  loadFromLocalStorage() {
    return cardDataStorage.load(); // Load card data using LocalStorageUtil
  }

  get gridWrapper() {
    return this._gridWrapper;
  }
}