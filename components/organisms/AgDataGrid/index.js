import { createElement } from '../../../utils/index.js';
import { API_URL , DEFAULT_CARD_FETCH_SIZE } from '../../../constants/index.js';
import { LoadingSpinner } from '../../atoms/LoadingSpinner/index.js';
import { createDeleteButton } from '../../../utils/AgGridManage/index.js';

export class AgDataGrid {
    constructor(gridOptions) {
        this.spinner = new LoadingSpinner();
        this._gridWrapper = createElement('div', {className: 'ag-theme-quartz', style: 'height: 500px; width: 80%;',});
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
                agDataGrid: this
            }
        };
    }

    async loadData() {
        this.spinner.show();
    
        const response = await fetch(API_URL);
        const data = await response.json();
        this.rowData = data.cards.slice(0, DEFAULT_CARD_FETCH_SIZE);
    
        this.renderGrid();
    
        this.spinner.hide();
    }
    
    renderGrid() {
        this.gridOptions.rowData = this.rowData;
    
        this.gridOptions.onGridReady = (params) => {
            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;
        };
    
        agGrid.createGrid(this._gridWrapper, this.gridOptions);
    }
    
    addCard(newCard) {
        console.log('Adding new card:', newCard);
        this.gridApi.applyTransaction({ add: [newCard] });
    }

    deleteCard(){
        return createDeleteButton;
    }

    get gridWrapper() {
        return this._gridWrapper;
    }
}
