import { Button } from '../../components/atoms/Button/index.js';

/**
 * Utility function to create HTML elements dynamically
 */
const createElement = (tag, attributes = {}, textContent = '', styles = {}) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => element[key] = value);
    if (textContent) element.textContent = textContent;
    Object.assign(element.style, styles);
    return element;
};

/**
 * LocalStorage Utility for managing state
 */
class LocalStorageUtil {
    constructor(key) {
        this.key = key;
    }

    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    load() {
        return JSON.parse(localStorage.getItem(this.key)) || [];
    }

    clear() {
        localStorage.removeItem(this.key);
    }
}

const cardStorage = new LocalStorageUtil('selectedCards');

/**
 * Counter Class (Handles counting selected items)
 */
class Counter {
    constructor(count = 0) {
        this._count = count;
        this._element = createElement('h3', { id: 'selected-counter' }, `Selected: ${count}`);
    }

    get element() {
        return this._element;
    }

    get count(){ return this._count }
    set count(value){ this._count = value }

    increment() {
        this.count++;
        this.element.innerText = `Selected: ${this.count}`;
    }

    decrement () {
        if (this.count > 0) this.count--;
        this.element.innerText = `Selected: ${this.count}`;
    }

    reset(){
        this.count = 0;
        this.element.innerText = `Selected: ${this.count}`;
    }
}

/**
 * Class for creating a delete button for ag-Grid
 */
class DeleteButton {
    constructor(params) {
        this.params = params;
        this.button = new Button('Delete', this.handleClick.bind(this), 'secondary');
    }

    handleClick() {
        const rowData = this.params.node.data;
        const grid = this.params.context.agDataGrid;

        if (this.params.api) {
            this.params.api.applyTransaction({ remove: [rowData] });
            grid.rowData = grid.rowData.filter(card => card !== rowData);
        }
    }

    get element() {
        return this.button.element;
    }
}


/**
 * Class for creating a form to add new cards
 */
class AddCardForm {
    constructor(addCardCallback) {
        this.addCardCallback = addCardCallback;
        this.fields = ['name', 'manaCost', 'power', 'toughness', 'type', 'rarity', 'setName', 'artist'];
        this.inputs = {};
        this.form = this.createForm();
    }

    createForm() {
        const form = createElement('form', { className: 'card-form' });

        this.fields.forEach(field => {
            const label = createElement('label', {}, `${field}: `);
            const input = createElement('input', { name: field, required: true });
            label.appendChild(input);
            form.appendChild(label);
            this.inputs[field] = input;
        });

        const submitBtn = new Button('Add Card', this.handleSubmit.bind(this));
        form.appendChild(submitBtn.element);

        return form;
    }

    handleSubmit(e) {
        e.preventDefault();
        const newCard = {};

        this.fields.forEach(field => {
            newCard[field] = this.inputs[field].value;
        });

        this.addCardCallback(newCard);
        this.form.reset();
    }

    get element() {
        return this.form;
    }
}


export {
    Counter,
    createElement,
    cardStorage,
    LocalStorageUtil,
    DeleteButton,
    AddCardForm,
}