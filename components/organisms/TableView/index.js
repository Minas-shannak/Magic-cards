import { CELL_STYLE, ROW_HIGHT } from '../../../constants/index.js';
import { createElement, tableStorage } from '../../../utils/index.js';
import { Button } from '../../atoms/Button/index.js';

class ImageRenderer {
    eGui;
    init(params) {
        const img = createElement('img', {
            src: params.value,
            className: 'image-cell',
        });

        this.eGui = createElement("span");
        this.eGui.appendChild(img);
    }

    getGui() {
        return this.eGui;
    }

    refresh(params) {
        return false;
    }
}

export class TableView {
    constructor() {
        this.data = tableStorage.load();
        this.container = createElement('div', { className: 'table-view' });
        this.gridDiv = createElement('div', { id: 'myGrid', className: 'ag-theme-alpine' });

        this.addButton = new Button('Add New Card', () => this.addRow());
        this.container.appendChild(this.addButton.element);
        this.container.appendChild(this.gridDiv);

        this.gridOptions = this.createGridOptions();
        this.render();
    }

    createGridOptions() {
        return {
            rowData: this.data,
            height: 'auto',
            getRowHeight: () => ROW_HIGHT,
            columnDefs: [
                { field: 'name', headerName: 'Name', width: 150, cellStyle: CELL_STYLE, editable: true },
                { field: 'manaCost', headerName: 'Mana Cost', width: 130, cellStyle: CELL_STYLE, editable: true },
                { field: 'type', headerName: 'Type', width: 200, cellStyle: CELL_STYLE, editable: true },
                { field: 'rarity', headerName: 'Rarity', width: 120, cellStyle: CELL_STYLE, editable: true },
                { field: 'setName', headerName: 'Set', width: 180, cellStyle: CELL_STYLE, editable: true },
                { field: 'power', headerName: 'Power', width: 100, cellStyle: CELL_STYLE, editable: true },
                { field: 'toughness', headerName: 'Toughness', width: 100, cellStyle: CELL_STYLE, editable: true },
                { field: 'imageUrl', headerName: 'Image', width: 80, cellRenderer: ImageRenderer },
                {
                    field: 'actions',
                    headerName: 'Actions',
                    width: 150,
                    cellStyle: CELL_STYLE,
                    cellRenderer: (params) => {
                        const deleteButton = new Button('Delete', () => this.deleteRow(params.node.rowIndex), 'secondary');
                        return deleteButton.element;
                    },
                },
            ],
            defaultColDef: {
                filter: true,
                editable: true,
                cellStyle: CELL_STYLE,
            },
            pagination: true,
            rowSelection: "multiple",
            onCellValueChanged: (event) => this.updateRow(event.node.rowIndex, event.data),
        };
    }

    render() {
        if (window.agGrid && window.agGrid.createGrid) {
            this.gridApi = new window.agGrid.createGrid(this.gridDiv, this.gridOptions);
        } else {
            console.error('agGrid is not loaded.');
        }
    }

    setData(newData) {
        this.data = newData;
        tableStorage.save(this.data);
        if (this.gridApi) {
            this.gridApi.setGridOption("rowData", this.data);
        }
    }

    addRow() {
        const newItem = {
            name: 'New Card',
            manaCost: 'N/A',
            type: 'N/A',
            rarity: 'N/A',
            setName: 'N/A',
            power: 'N/A',
            toughness: 'N/A',
            imageUrl: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130550&type=card',
        };
        this.data.unshift(newItem);
        this.setData(this.data);
    }

    deleteRow(index) {
        this.data.splice(index, 1);
        this.setData(this.data);
    }

    updateRow(index, updatedData) {
        this.data[index] = updatedData;
        tableStorage.save(this.data);
    }

    get element() {
        return this.container;
    }
}
