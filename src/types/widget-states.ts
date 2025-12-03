export enum ChatWidgetState {
  CLOSED = 'CLOSED',                     // Widget button only
  MINIMIZED = 'MINIMIZED',               // Chat minimized (preserves conversation)
  DEPARTMENT_SELECT = 'DEPARTMENT_SELECT', // Select department/category
  FAQ_ARTICLES = 'FAQ_ARTICLES',         // Browse FAQs/Articles
  PRE_CHAT_FORM = 'PRE_CHAT_FORM',       // Collect user info
  CHAT_ACTIVE = 'CHAT_ACTIVE',           // Active chat conversation
  LOADING = 'LOADING',                   // Initializing conversation
}