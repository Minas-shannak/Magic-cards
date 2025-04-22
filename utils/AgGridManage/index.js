import { createElement} from '../../../utils/index.js';
import { Button } from '../../components/atoms/Button/index.js';

/**
 * Utility function to create a delete button for ag-Grid
 */
const createDeleteButton = (params) => {
    const button = new Button('Delete', () => {
        const rowData = params.node.data;
        const grid = params.context.agDataGrid;

        if (params.api) {
            params.api.applyTransaction({ remove: [rowData] });

            grid.rowData = grid.rowData.filter(card => card !== rowData);
            grid.saveToLocalStorage();
        }
    }, 'secondary');

    return button.element;
};

/**
 * Add new row
 */

const createAddCardForm = (addCardCallback) => {
    const form = createElement('form', { className: 'card-form' });

    const fields = ['name', 'manaCost', 'power', 'toughness', 'type', 'rarity', 'setName', 'artist'];
    const inputs = {};

    fields.forEach(field => {
        const label = createElement('label', {}, `${field}: `);
        const input = createElement('input', { name: field, required: true });
        label.appendChild(input);
        form.appendChild(label);
        inputs[field] = input;
    });

    const submitBtn = new Button('Add Card', (e) => {
        e.preventDefault();
        const newCard = {};
        fields.forEach(field => newCard[field] = inputs[field].value);

        addCardCallback(newCard);
        form.reset();
    });

    form.appendChild(submitBtn.element); 

    return form;
};


export {
    createDeleteButton, 
    createAddCardForm,
}
