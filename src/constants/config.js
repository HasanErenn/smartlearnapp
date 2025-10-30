// App Configuration Constants - Smart Learn
export const APP_CONFIG = {
  APP_NAME: 'Smart Learn',
  VERSION: '1.0.0',
  API_BASE_URL: 'https://api.smartlearn.com',
  TIMEOUT: 10000,
};

// Screen names for navigation
export const SCREEN_NAMES = {
  HOME: 'Home',
  EXPLORE: 'Explore', 
  ABOUT: 'About',
  SETTINGS: 'Settings',
  CATEGORY_DETAIL: 'CategoryDetail',
  SEARCH_RESULTS: 'SearchResults',
};

// Categories data for Smart Learn - Updated Brand Colors
export const CATEGORIES = [
  {
    id: 1,
    title: 'Arts & Music',
    titleTR: 'Sanat ve Müzik',
    key: 'arts_music',
    color: '#60BFB2',
  },
  {
    id: 2,
    title: 'Mother Language',
    titleTR: 'Ana Dil',
    key: 'mother_language',
    color: '#FF8629',
  },
  {
    id: 3,
    title: 'Foreign Languages', 
    titleTR: 'Yabancı Dil',
    key: 'foreign_languages',
    color: '#FFB54A',
  },
  {
    id: 4,
    title: 'Natural & Social Sciences',
    titleTR: 'Doğa ve Sosyal Bilimler',
    key: 'natural_sciences',
    color: '#BC5140',
  },
  {
    id: 5,
    title: 'Physical Education',
    titleTR: 'Beden Eğitimi',
    key: 'physical_education',
    color: '#BA89FF',
  },
  {
    id: 6,
    title: 'Mathematics',
    titleTR: 'Matematik',
    key: 'mathematics',
    color: '#E74C3C',
  },
  {
    id: 7,
    title: 'Ethics & Religion',
    titleTR: 'Etik ve Din',
    key: 'ethics_religion',
    color: '#61A8D7',
  },
];

export const TIME_OPTIONS = [
  { key: '15_25_mins', value: '15 - 25 mins' },
  { key: '25_45_mins', value: '25 - 45 mins' }, 
  { key: '1_2_hours', value: '1 - 2 hours' },
  { key: '5_hours', value: '5 hours' },
  { key: 'one_month', value: 'One Month' },
  { key: 'all', value: 'All' }
];

export const AGE_RANGE = {
  min: 6,
  max: 14
};