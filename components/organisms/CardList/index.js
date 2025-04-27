import { Card } from '../../molecules/Card/index.js';
import { cardStorage, createElement } from '../../../utils/index.js';
import { API_URL, DEFAULT_CARD_FETCH_SIZE } from '../../../constants/index.js';
import { LoadingSpinner } from '../../atoms/LoadingSpinner/index.js';
import { Button } from '../../atoms/Button/index.js';
import { Input } from '../../atoms/Input/index.js';
import { Select } from '../../atoms/Select/index.js';

export class CardList {
    constructor(counter) {
        this.cards = [];
        this.filteredCards = [];
        this.counter = counter;
        this.spinner = new LoadingSpinner();
        this._wrapper = createElement('div');
        this._cardsWrapper = createElement('div', { id: 'card-container', className: 'grid-container' });
        this._filterWrapper = this.createFilterControls();
        
        this._wrapper.append(this._filterWrapper, this._cardsWrapper);
    }

    createFilterControls() {
        const filterWrapper = createElement('div', { className: 'filter-controls' });
        
        // حقل البحث بالاسم
        const nameInput = new Input({
            placeholder: 'Search by name...',
            type: 'text',
            id: 'name-filter',
            onChange: () => this.applyFilters()
        });
        
        // فلتر النوع
        const typeSelect = new Select({
            id: 'type-filter',
            options: [
                { value: '', text: 'All Types' },
                { value: 'Creature', text: 'Creature' },
                { value: 'Artifact', text: 'Artifact' },
                { value: 'Enchantment', text: 'Enchantment' },
                { value: 'Instant', text: 'Instant' },
                { value: 'Sorcery', text: 'Sorcery' },
                { value: 'Land', text: 'Land' }
            ],
            onChange: () => this.applyFilters()
        });
        
        // فلتر الندرة
        const raritySelect = new Select({
            id: 'rarity-filter',
            options: [
                { value: '', text: 'All Rarities' },
                { value: 'Common', text: 'Common' },
                { value: 'Uncommon', text: 'Uncommon' },
                { value: 'Rare', text: 'Rare' },
                { value: 'Mythic Rare', text: 'Mythic Rare' }
            ],
            onChange: () => this.applyFilters()
        });
        
        // زر إعادة الضبط
        const resetButton = new Button('Reset Filters', () => this.resetFilters(), 'secondary');
        
        filterWrapper.append(
            nameInput.element,
            typeSelect.element,
            raritySelect.element,
            resetButton.element
        );
        
        return filterWrapper;
    }

    applyFilters() {
        const nameFilter = document.getElementById('name-filter').value.toLowerCase();
        const typeFilter = document.getElementById('type-filter').value;
        const rarityFilter = document.getElementById('rarity-filter').value;
        
        this.filteredCards = this.cards.filter(card => {
            const matchesName = card.name.toLowerCase().includes(nameFilter);
            const matchesType = !typeFilter || card.type.includes(typeFilter);
            const matchesRarity = !rarityFilter || card.rarity === rarityFilter;
            
            return matchesName && matchesType && matchesRarity;
        });
        
        this.renderCards();
    }

    resetFilters() {
        document.getElementById('name-filter').value = '';
        document.getElementById('type-filter').value = '';
        document.getElementById('rarity-filter').value = '';
        
        this.filteredCards = [...this.cards];
        this.renderCards();
    }

    async loadCards() {
        this.spinner.show();

        const response = await fetch(API_URL);
        const data = await response.json();
        this.cards = data.cards.slice(0, DEFAULT_CARD_FETCH_SIZE).map(card => new Card(card, this.counter));
        this.filteredCards = [...this.cards];

        this.renderCards();

        this.spinner.hide();
    }

    renderCards() {
        this._cardsWrapper.innerHTML = '';

        this.filteredCards.forEach(card => {
            this._cardsWrapper.appendChild(card.element);
        });
    }

    selectAll() {
        const selectedIds = cardStorage.load();
        const cardsToSelect = this.filteredCards.length > 0 ? this.filteredCards : this.cards;

        cardsToSelect.forEach(card => {
            if (!card.isSelected) {
                card.toggleSelection();
            }
            if (!selectedIds.includes(card.id)) {
                selectedIds.push(card.id);
            }
        });

        cardStorage.save(selectedIds);
    }

    deselectAll() {
        const cardsToDeselect = this.filteredCards.length > 0 ? this.filteredCards : this.cards;
        
        cardsToDeselect.forEach(card => {
            if (card.isSelected) {
                card.toggleSelection();
            }
        });
        
        // إذا كانت الفلترة نشطة، احذف فقط البطاقات المرئية
        if (this.filteredCards.length > 0 && this.filteredCards.length < this.cards.length) {
            const selectedIds = cardStorage.load();
            const filteredIds = this.filteredCards.map(card => card.id);
            const newSelectedIds = selectedIds.filter(id => !filteredIds.includes(id));
            cardStorage.save(newSelectedIds);
        } else {
            cardStorage.save([]);
        }
    }

    get element() {
        return this._wrapper;
    }

    get cardsWrapper() {
        return this._cardsWrapper;
    }
}