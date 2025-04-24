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
const KanbanStorage = new LocalStorageUtil('selectedtask');

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

export {
    Counter,
    createElement,
    cardStorage,
    LocalStorageUtil,
    KanbanStorage,
}