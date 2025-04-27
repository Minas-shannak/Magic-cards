import { CardList } from '../../organisms/CardList/index.js';
import { Button } from '../../atoms/Button/index.js';
import { INITIAL_COUNTER, CARD_TEXT } from '../../../constants/index.js';
import { Counter, cardStorage, createElement } from '../../../utils/index.js';
import { Tab } from '../../atoms/Tab/index.js';
import { TabContainer } from '../../molecules/TabContainer/index.js';
import { TableView } from '../../organisms/TableView/index.js';
import { KanbanView } from '../../organisms/KanbanView/index.js';
import { CalendarView } from '../../organisms/CalendarView/index.js';

export class HomePage {
    constructor() {
        this.counter = new Counter(INITIAL_COUNTER);
        this.cardList = new CardList(this.counter);
        this.tableView = new TableView();
        this.kanbanView = new KanbanView();
        this.calendarView = new CalendarView();
        this.tabContainer = null;
        this.activeTab = null;
    }

    async init(pageContent) {
        await this.cardList.loadCards();
        this.tableView.setData(this.cardList.cards);

        const tab1 = new Tab('Table View', () => this.setActiveTab(tab1, this.tableView.element));
        const tab2 = new Tab('Card Grid', () => this.setActiveTab(tab2, this.cardList.element, true));
        const tab3 = new Tab('Kanban View', () => this.setActiveTab(tab3, this.kanbanView.element));
        const tab4 = new Tab('Calendar View', () => this.setActiveTab(tab4, this.calendarView.element));

        this.tabContainer = new TabContainer([tab1, tab2, tab3, tab4]);
        this.contentContainer = createElement('div', { className: 'tab-content' });

        pageContent.append(this.tabContainer.element, this.contentContainer);
        this.setActiveTab(tab1, this.tableView.element);
    }

    setActiveTab(tab, view, showCounter = false) {
        if (this.activeTab === tab) return;

        this.tabContainer.tabs.forEach(t => t.element.classList.remove('active'));
        tab.element.classList.add('active');

        this.activeTab = tab;
        this.showView(view, showCounter);
    }

    showView(view, showCounter = false) {
        this.contentContainer.innerHTML = '';

        if (showCounter) {
            const counterWrapper = createElement('div', { className: 'counter-wrapper' });
            const counterBtnContainer = createElement('div', { className: 'counter-btn-container' });

            const selectAllButton = new Button(CARD_TEXT.SELECT_ALL, () => this.cardList.selectAll());
            const deselectAllButton = new Button(
                CARD_TEXT.DESELECT_ALL,
                () => this.handleDeselectAll(),
                'secondary'
            );

            counterBtnContainer.append(selectAllButton.element, deselectAllButton.element);
            counterWrapper.appendChild(this.counter.element);
            counterWrapper.appendChild(counterBtnContainer);
            this.contentContainer.appendChild(counterWrapper);
        }

        if (this.contentContainer !== view.parentNode) {
            this.contentContainer.appendChild(view);
        }
    }

    handleDeselectAll() {
        this.cardList.deselectAll();
        this.counter.reset();
        cardStorage.save([]);
    }
}
