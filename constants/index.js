console.log('Hello World');

const API_URL = 'https://api.magicthegathering.io/v1/cards';
const BURGER_ICON_LINES = 3;
const COLUMN_STATUSES = ['To Do', 'In Progress', 'Done'];
const DATE_FORMAT_OPTIONS = { weekday: 'short', month: 'short', day: 'numeric' };
const DAYS_IN_WEEK = 7;
const DEFAULT_CARD_FETCH_SIZE = 70;
const DEFAULT_STATUS = 'To Do';
const DEFAULT_TASK_COUNT = 15;
const FALLBACK_IMAGE = "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130550&type=card";
const INITIAL_COUNTER = 0;
const MAX_CARDS = 7;
const MAX_TASKS = 8;
const MAX_VISIBLE_TASKS = 3;
const ROW_HIGHT = 70;
const DEFAULT_CELL_STYLE = { padding: '8px', fontSize: '14px', color: 'var(--color-gray-80)', textAlign: 'center' }
const CELL_STYLE = { ...DEFAULT_CELL_STYLE, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }

const CARD_TEXT = {
    DE_SELECT: 'Deselect',
    DESELECT_ALL: 'Deselect ALL',
    SELECT_ALL: 'Select All',
    SELECT: 'Select',
    SELECTED: 'Selected',
    SHOW_LESS: 'Show Less',
    SHOW_MORE: 'Show More',
}

const APP_PAGES = [
    { text: 'Home', href: 'home' },
    { text: 'About Us', href: 'about-us' },
    { text: 'Profile', href: 'profile' },
  ];
export {
    API_URL,
    APP_PAGES,
    BURGER_ICON_LINES,
    CARD_TEXT,
    CELL_STYLE,
    COLUMN_STATUSES,
    DATE_FORMAT_OPTIONS,
    DAYS_IN_WEEK,
    DEFAULT_CARD_FETCH_SIZE,
    DEFAULT_STATUS,
    DEFAULT_TASK_COUNT,
    FALLBACK_IMAGE,
    INITIAL_COUNTER,
    MAX_CARDS,
    MAX_TASKS,
    MAX_VISIBLE_TASKS,
    ROW_HIGHT,
}