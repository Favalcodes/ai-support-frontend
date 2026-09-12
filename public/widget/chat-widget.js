// (function() {
//   'use strict';

//   // Prevent multiple initializations
//   if (window.AISupportWidget) {
//     console.warn('AI Support Widget already initialized');
//     return;
//   }

//   class AISupportWidget {
//     constructor(config) {
//       this.config = {
//         companyId: config.companyId,
//         apiUrl: config.apiUrl || 'http://localhost:3000/api/v1',
//         position: config.position || 'bottom-right',
//         primaryColor: config.primaryColor || '#713600', // Chocolate truffle primary color
//         secondaryColor: config.secondaryColor || '#C05800', // Caramel color
//         welcomeMessage: config.welcomeMessage || 'Hi! How can we help you today?',
//         placeholderText: config.placeholderText || 'Type your message...',
//         title: config.title || 'getLync Support',
//         categoryId: config.categoryId || null,
//         autoOpen: config.autoOpen || false,
//         showKnowledgeBase: config.showKnowledgeBase !== false, // Show by default
//         ...config
//       };

//       this.isOpen = false;
//       this.isMinimized = false;
//       this.conversationId = null;
//       this.userId = null;
//       this.messages = [];
//       this.isTyping = false;

//       this.init();
//     }

//     init() {
//       this.loadUserData();
//       this.injectStyles();
//       this.createWidget();
//       this.attachEventListeners();

//       if (this.config.autoOpen) {
//         setTimeout(() => this.openChat(), 1000);
//       }
//     }

//     loadUserData() {
//       const stored = localStorage.getItem('ai_support_user_data');
//       if (stored) {
//         try {
//           const data = JSON.parse(stored);
//           this.userId = data.userId;
//           this.conversationId = data.conversationId;
//         } catch (e) {
//           console.error('Failed to load user data:', e);
//         }
//       }
//     }

//     saveUserData() {
//       localStorage.setItem('ai_support_user_data', JSON.stringify({
//         userId: this.userId,
//         conversationId: this.conversationId
//       }));
//     }

//     injectStyles() {
//       const styles = `
//         .ai-support-widget * {
//           box-sizing: border-box;
//           margin: 0;
//           padding: 0;
//         }

//         .ai-support-widget {
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
//           position: fixed;
//           z-index: 999999;
//           ${this.getPositionStyles()}
//         }

//         .ai-support-widget-button {
//           width: 60px;
//           height: 60px;
//           border-radius: 50%;
//           background: ${this.config.primaryColor};
//           border: none;
//           cursor: pointer;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: transform 0.2s, box-shadow 0.2s;
//         }

//         .ai-support-widget-button:hover {
//           transform: scale(1.05);
//           box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
//         }

//         .ai-support-widget-button svg {
//           width: 28px;
//           height: 28px;
//           fill: white;
//         }

//         .ai-support-widget-container {
//           position: fixed;
//           ${this.getPositionStyles()}
//           width: 400px;
//           height: 600px;
//           max-height: 90vh;
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
//           display: none;
//           flex-direction: column;
//           overflow: hidden;
//           animation: slideUp 0.3s ease-out;
//         }

//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .ai-support-widget-container.open {
//           display: flex;
//         }

//         .ai-support-widget-container.minimized {
//           height: 60px;
//         }

//         .ai-support-widget-header {
//           background: ${this.config.primaryColor};
//           color: white;
//           padding: 16px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           cursor: pointer;
//         }

//         .ai-support-widget-header-title {
//           font-size: 16px;
//           font-weight: 600;
//           flex: 1;
//         }

//         .ai-support-widget-header-actions {
//           display: flex;
//           gap: 8px;
//         }

//         .ai-support-widget-header-button {
//           background: transparent;
//           border: none;
//           color: white;
//           cursor: pointer;
//           padding: 4px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           opacity: 0.8;
//           transition: opacity 0.2s;
//         }

//         .ai-support-widget-header-button:hover {
//           opacity: 1;
//         }

//         .ai-support-widget-header-button svg {
//           width: 20px;
//           height: 20px;
//           fill: white;
//         }

//         .ai-support-widget-messages {
//           flex: 1;
//           overflow-y: auto;
//           padding: 16px;
//           background: #f9fafb;
//         }

//         .ai-support-widget-container.minimized .ai-support-widget-messages,
//         .ai-support-widget-container.minimized .ai-support-widget-input-container {
//           display: none;
//         }

//         .ai-support-widget-message {
//           margin-bottom: 12px;
//           display: flex;
//           gap: 8px;
//         }

//         .ai-support-widget-message.user {
//           justify-content: flex-end;
//         }

//         .ai-support-widget-message-content {
//           max-width: 75%;
//           padding: 10px 14px;
//           border-radius: 12px;
//           font-size: 14px;
//           line-height: 1.5;
//           word-wrap: break-word;
//         }

//         .ai-support-widget-message.bot .ai-support-widget-message-content {
//           background: white;
//           color: #374151;
//           border: 1px solid #e5e7eb;
//         }

//         .ai-support-widget-message.user .ai-support-widget-message-content {
//           background: ${this.config.primaryColor};
//           color: white;
//         }

//         .ai-support-widget-typing {
//           display: flex;
//           gap: 4px;
//           padding: 10px 14px;
//           background: white;
//           border-radius: 12px;
//           width: fit-content;
//           border: 1px solid #e5e7eb;
//         }

//         .ai-support-widget-typing-dot {
//           width: 8px;
//           height: 8px;
//           border-radius: 50%;
//           background: #9ca3af;
//           animation: typing 1.4s infinite;
//         }

//         .ai-support-widget-typing-dot:nth-child(2) {
//           animation-delay: 0.2s;
//         }

//         .ai-support-widget-typing-dot:nth-child(3) {
//           animation-delay: 0.4s;
//         }

//         @keyframes typing {
//           0%, 60%, 100% {
//             transform: translateY(0);
//             opacity: 0.7;
//           }
//           30% {
//             transform: translateY(-10px);
//             opacity: 1;
//           }
//         }

//         .ai-support-widget-input-container {
//           padding: 16px;
//           background: white;
//           border-top: 1px solid #e5e7eb;
//         }

//         .ai-support-widget-form {
//           display: flex;
//           gap: 8px;
//         }

//         .ai-support-widget-input {
//           flex: 1;
//           padding: 10px 14px;
//           border: 1px solid #d1d5db;
//           border-radius: 8px;
//           font-size: 14px;
//           outline: none;
//           transition: border-color 0.2s;
//         }

//         .ai-support-widget-input:focus {
//           border-color: ${this.config.primaryColor};
//         }

//         .ai-support-widget-send-button {
//           padding: 10px 16px;
//           background: ${this.config.primaryColor};
//           color: white;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 14px;
//           font-weight: 500;
//           transition: opacity 0.2s;
//         }

//         .ai-support-widget-send-button:hover {
//           opacity: 0.9;
//         }

//         .ai-support-widget-send-button:disabled {
//           opacity: 0.5;
//           cursor: not-allowed;
//         }

//         .ai-support-widget-email-form {
//           padding: 24px;
//           display: flex;
//           flex-direction: column;
//           gap: 16px;
//         }

//         .ai-support-widget-email-form h3 {
//           font-size: 18px;
//           font-weight: 600;
//           color: #111827;
//           margin-bottom: 8px;
//         }

//         .ai-support-widget-email-form p {
//           font-size: 14px;
//           color: #6b7280;
//           margin-bottom: 16px;
//         }

//         .ai-support-widget-form-group {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .ai-support-widget-form-group label {
//           font-size: 13px;
//           font-weight: 500;
//           color: #374151;
//         }

//         .ai-support-widget-form-group input {
//           padding: 10px 14px;
//           border: 1px solid #d1d5db;
//           border-radius: 8px;
//           font-size: 14px;
//           outline: none;
//           transition: border-color 0.2s;
//         }

//         .ai-support-widget-form-group input:focus {
//           border-color: ${this.config.primaryColor};
//         }

//         .ai-support-widget-start-button {
//           padding: 12px;
//           background: ${this.config.primaryColor};
//           color: white;
//           border: none;
//           border-radius: 8px;
//           cursor: pointer;
//           font-size: 14px;
//           font-weight: 500;
//           margin-top: 8px;
//         }

//         @media (max-width: 480px) {
//           .ai-support-widget-container {
//             width: 100%;
//             height: 100%;
//             max-height: 100vh;
//             border-radius: 0;
//             bottom: 0 !important;
//             right: 0 !important;
//             left: 0 !important;
//             top: 0 !important;
//           }
//         }
//       `;

//       const styleSheet = document.createElement('style');
//       styleSheet.textContent = styles;
//       document.head.appendChild(styleSheet);
//     }

//     getPositionStyles() {
//       const positions = {
//         'bottom-right': 'bottom: 20px; right: 20px;',
//         'bottom-left': 'bottom: 20px; left: 20px;',
//         'top-right': 'top: 20px; right: 20px;',
//         'top-left': 'top: 20px; left: 20px;'
//       };
//       return positions[this.config.position] || positions['bottom-right'];
//     }

//     createWidget() {
//       const widgetDiv = document.createElement('div');
//       widgetDiv.className = 'ai-support-widget';
//       widgetDiv.innerHTML = `
//         <button class="ai-support-widget-button" id="ai-support-toggle">
//           <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.6 15.72 3.63 17.2L2.2 21.8C2.08 22.15 2.24 22.53 2.56 22.7C2.68 22.77 2.81 22.8 2.95 22.8C3.11 22.8 3.27 22.75 3.4 22.65L8.2 19.37C9.53 20.09 10.72 20.5 12 20.5C17.52 20.5 22 16.02 22 10.5C22 4.98 17.52 2 12 2ZM12 18C11.21 18 10.43 17.88 9.69 17.64L9.41 17.54L5.95 19.62L6.86 16.41L6.69 16.08C5.65 14.59 5 12.85 5 11C5 7.69 8.13 5 12 5C15.87 5 19 7.69 19 11C19 14.31 15.87 18 12 18Z"/>
//           </svg>
//         </button>
//         <div class="ai-support-widget-container" id="ai-support-container">
//           <div class="ai-support-widget-header" id="ai-support-header">
//             <div class="ai-support-widget-header-title">${this.config.title}</div>
//             <div class="ai-support-widget-header-actions">
//               <button class="ai-support-widget-header-button" id="ai-support-minimize">
//                 <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M19 13H5v-2h14v2z"/>
//                 </svg>
//               </button>
//               <button class="ai-support-widget-header-button" id="ai-support-close">
//                 <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
//                 </svg>
//               </button>
//             </div>
//           </div>
//           <div class="ai-support-widget-messages" id="ai-support-messages"></div>
//           <div class="ai-support-widget-input-container">
//             <form class="ai-support-widget-form" id="ai-support-form">
//               <input
//                 type="text"
//                 class="ai-support-widget-input"
//                 id="ai-support-input"
//                 placeholder="${this.config.placeholderText}"
//                 autocomplete="off"
//               />
//               <button type="submit" class="ai-support-widget-send-button">Send</button>
//             </form>
//           </div>
//         </div>
//       `;

//       document.body.appendChild(widgetDiv);
//       this.elements = {
//         toggle: document.getElementById('ai-support-toggle'),
//         container: document.getElementById('ai-support-container'),
//         header: document.getElementById('ai-support-header'),
//         minimize: document.getElementById('ai-support-minimize'),
//         close: document.getElementById('ai-support-close'),
//         messages: document.getElementById('ai-support-messages'),
//         form: document.getElementById('ai-support-form'),
//         input: document.getElementById('ai-support-input')
//       };
//     }

//     attachEventListeners() {
//       this.elements.toggle.addEventListener('click', () => this.toggleChat());
//       this.elements.close.addEventListener('click', () => this.closeChat());
//       this.elements.minimize.addEventListener('click', () => this.minimizeChat());
//       this.elements.header.addEventListener('click', (e) => {
//         if (this.isMinimized && e.target === this.elements.header) {
//           this.maximizeChat();
//         }
//       });
//       this.elements.form.addEventListener('submit', (e) => {
//         e.preventDefault();
//         this.sendMessage();
//       });
//     }

//     toggleChat() {
//       if (this.isOpen) {
//         this.closeChat();
//       } else {
//         this.openChat();
//       }
//     }

//     async openChat() {
//       this.isOpen = true;
//       this.elements.container.classList.add('open');
//       this.elements.toggle.style.display = 'none';

//       if (!this.conversationId) {
//         this.showEmailForm();
//       } else {
//         await this.loadConversation();
//         this.elements.input.focus();
//       }
//     }

//     closeChat() {
//       this.isOpen = false;
//       this.elements.container.classList.remove('open');
//       this.elements.toggle.style.display = 'flex';
//     }

//     minimizeChat() {
//       this.isMinimized = true;
//       this.elements.container.classList.add('minimized');
//     }

//     maximizeChat() {
//       this.isMinimized = false;
//       this.elements.container.classList.remove('minimized');
//     }

//     showEmailForm() {
//       this.elements.messages.innerHTML = `
//         <div class="ai-support-widget-email-form">
//           <h3>Welcome to ${this.config.title}!</h3>
//           <p>Please provide your details to get started</p>
//           <div class="ai-support-widget-form-group">
//             <label>First Name</label>
//             <input type="text" id="ai-support-first-name" required />
//           </div>
//           <div class="ai-support-widget-form-group">
//             <label>Last Name</label>
//             <input type="text" id="ai-support-last-name" required />
//           </div>
//           <div class="ai-support-widget-form-group">
//             <label>Email Address</label>
//             <input type="email" id="ai-support-email" required />
//           </div>
//           <button class="ai-support-widget-start-button" id="ai-support-start-chat">
//             Start Chat
//           </button>
//         </div>
//       `;

//       document.getElementById('ai-support-start-chat').addEventListener('click', () => {
//         this.startConversation();
//       });
//     }

//     async startConversation() {
//       const firstName = document.getElementById('ai-support-first-name').value.trim();
//       const lastName = document.getElementById('ai-support-last-name').value.trim();
//       const email = document.getElementById('ai-support-email').value.trim();

//       if (!firstName || !lastName || !email) {
//         alert('Please fill in all fields');
//         return;
//       }

//       try {
//         const response = await fetch(`${this.config.apiUrl}/conversation`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             email,
//             first_name: firstName,
//             last_name: lastName,
//             company_id: this.config.companyId,
//             category_id: this.config.categoryId
//           })
//         });

//         const result = await response.json();

//         if (result.success) {
//           this.conversationId = result.data.conversation.id;
//           this.userId = result.data.user.id;
//           this.saveUserData();

//           this.elements.messages.innerHTML = '';
//           this.addMessage('bot', this.config.welcomeMessage);
//           this.elements.input.focus();
//         } else {
//           alert('Failed to start conversation. Please try again.');
//         }
//       } catch (error) {
//         console.error('Failed to start conversation:', error);
//         alert('Failed to start conversation. Please try again.');
//       }
//     }

//     async loadConversation() {
//       try {
//         const response = await fetch(
//           `${this.config.apiUrl}/conversation/${this.conversationId}/messages`
//         );
//         const result = await response.json();

//         if (result.success) {
//           this.messages = result.data;
//           this.renderMessages();
//         }
//       } catch (error) {
//         console.error('Failed to load conversation:', error);
//       }
//     }

//     renderMessages() {
//       this.elements.messages.innerHTML = '';
//       this.messages.forEach(msg => {
//         this.addMessage(msg.role === 'USER' ? 'user' : 'bot', msg.message, false);
//       });
//       this.scrollToBottom();
//     }

//     addMessage(type, content, shouldScroll = true) {
//       const messageDiv = document.createElement('div');
//       messageDiv.className = `ai-support-widget-message ${type}`;
//       messageDiv.innerHTML = `
//         <div class="ai-support-widget-message-content">${this.escapeHtml(content)}</div>
//       `;
//       this.elements.messages.appendChild(messageDiv);

//       if (shouldScroll) {
//         this.scrollToBottom();
//       }
//     }

//     showTypingIndicator() {
//       if (this.isTyping) return;

//       this.isTyping = true;
//       const typingDiv = document.createElement('div');
//       typingDiv.className = 'ai-support-widget-message bot';
//       typingDiv.id = 'ai-support-typing';
//       typingDiv.innerHTML = `
//         <div class="ai-support-widget-typing">
//           <div class="ai-support-widget-typing-dot"></div>
//           <div class="ai-support-widget-typing-dot"></div>
//           <div class="ai-support-widget-typing-dot"></div>
//         </div>
//       `;
//       this.elements.messages.appendChild(typingDiv);
//       this.scrollToBottom();
//     }

//     hideTypingIndicator() {
//       this.isTyping = false;
//       const typingDiv = document.getElementById('ai-support-typing');
//       if (typingDiv) {
//         typingDiv.remove();
//       }
//     }

//     async sendMessage() {
//       const message = this.elements.input.value.trim();
//       if (!message) return;

//       this.addMessage('user', message);
//       this.elements.input.value = '';
//       this.showTypingIndicator();

//       try {
//         const response = await fetch(
//           `${this.config.apiUrl}/conversation/${this.conversationId}/messages`,
//           {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ message })
//           }
//         );

//         const result = await response.json();
//         this.hideTypingIndicator();

//         if (result.success) {
//           this.addMessage('bot', result.data.message);
//         } else {
//           this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
//         }
//       } catch (error) {
//         console.error('Failed to send message:', error);
//         this.hideTypingIndicator();
//         this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
//       }
//     }

//     scrollToBottom() {
//       setTimeout(() => {
//         this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
//       }, 100);
//     }

//     escapeHtml(text) {
//       const div = document.createElement('div');
//       div.textContent = text;
//       return div.innerHTML;
//     }
//   }

//   // Initialize widget when DOM is ready
//   function initWidget() {
//     const script = document.currentScript || document.querySelector('script[data-ai-support]');

//     if (!script) {
//       console.error('AI Support Widget: Could not find widget script tag');
//       return;
//     }

//     const config = {
//       companyId: script.getAttribute('data-company-id'),
//       apiUrl: script.getAttribute('data-api-url'),
//       position: script.getAttribute('data-position'),
//       primaryColor: script.getAttribute('data-primary-color'),
//       welcomeMessage: script.getAttribute('data-welcome-message'),
//       placeholderText: script.getAttribute('data-placeholder'),
//       title: script.getAttribute('data-title'),
//       categoryId: script.getAttribute('data-category-id'),
//       autoOpen: script.getAttribute('data-auto-open') === 'true'
//     };

//     if (!config.companyId) {
//       console.error('AI Support Widget: data-company-id attribute is required');
//       return;
//     }

//     window.AISupportWidget = new AISupportWidget(config);
//   }

//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initWidget);
//   } else {
//     initWidget();
//   }
// })();




/**
 * Chat Widget Embedded Script
 * Add this script to your website to load the chat widget
 *
 * Usage:
 * <script>
 *   window.chatWidgetConfig = {
 *     companyId: 'YOUR_COMPANY_ID',
 *     user: { // Optional - if not provided, user must login manually
 *       firstName: 'John',
 *       lastName: 'Doe',
 *       email: 'john@example.com'
 *     }
 *   };
 * </script>
 * <script src="path/to/chat-widget-embed.js"></script>
 */

(function () {
  'use strict';

  // Get configuration from global scope
  const config = window.chatWidgetConfig || {};

  if (!config.companyId) {
    console.error('Chat Widget: companyId is required in chatWidgetConfig');
    return;
  }

  // Resolve the API base URL, most specific source first:
  //   1. apiUrl in chatWidgetConfig (what the generated install snippet sets)
  //   2. a data-api-url attribute on the script tag
  //   3. the origin the widget script itself was served from
  //   4. localhost, for development
  //
  // This previously ignored config entirely and always used the hardcoded
  // localhost default, so every real installation pointed at the wrong host.
  const currentScript =
    document.currentScript ||
    document.querySelector('script[src*="chat-widget.js"]');
  const scriptSrc = currentScript ? currentScript.src : '';

  let apiBaseUrl =
    config.apiUrl ||
    (currentScript && currentScript.getAttribute('data-api-url')) ||
    '';

  if (!apiBaseUrl && scriptSrc && !scriptSrc.startsWith('file://')) {
    try {
      const url = new URL(scriptSrc);
      apiBaseUrl = `${url.protocol}//${url.host}/api/v1`;
    } catch (e) {
      console.warn('Chat Widget: could not determine API URL from script source');
    }
  }

  if (!apiBaseUrl) {
    apiBaseUrl = 'http://localhost:4001/api/v1';
  }

  // Normalise away a trailing slash so `${apiBaseUrl}/conversation` is well formed
  apiBaseUrl = apiBaseUrl.replace(/\/+$/, '');

  console.log('Chat Widget: Using API URL:', apiBaseUrl);

  // Widget HTML template
  const widgetHTML = `
    <style>
      /* Reset and base styles */
      #chat-widget-root,
      #chat-widget-root * {
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      /* Widget container */
      #chat-widget-root {
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 999999;
      }

      #chat-widget-root.position-left {
        right: auto;
        left: 16px;
      }

      /* Chat button */
      .cw-chat-button {
        position: relative;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: var(--cw-primary-color, #713600);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease-out;
      }

      .cw-chat-button:hover {
        transform: scale(1.1);
      }

      .cw-chat-button:active {
        transform: scale(0.95);
      }

      .cw-chat-button.animate-bounce {
        animation: cw-bounce-slow 2s ease-in-out infinite;
      }

      .cw-chat-button svg {
        width: 32px;
        height: 32px;
        fill: none;
        stroke: white;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      /* Unread badge */
      .cw-unread-badge {
        position: absolute;
        top: -4px;
        right: -4px;
        min-width: 24px;
        height: 24px;
        padding: 0 6px;
        background-color: #ef4444;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .cw-unread-badge span {
        color: white;
        font-size: 12px;
        font-weight: bold;
        line-height: 1;
      }

      /* Pulse ring */
      .cw-pulse-ring {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: var(--cw-primary-color, #713600);
        animation: cw-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        opacity: 0.2;
        pointer-events: none;
      }

      /* Chat widget window */
      .cw-widget {
        width: 400px;
        max-width: calc(100vw - 32px);
        height: 650px;
        max-height: calc(100vh - 100px);
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: cw-slide-up 0.3s ease-out;
        margin-bottom: 16px;
      }

      /* Header */
      .cw-header {
        background: var(--cw-primary-color, #713600);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
      }

      .cw-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
      }

      .cw-header-title {
        flex: 1;
        min-width: 0;
      }

      .cw-header-title h2 {
        color: white;
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 2px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .cw-header-status {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .cw-status-dot {
        width: 8px;
        height: 8px;
        background-color: #86efac;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .cw-status-text {
        color: rgba(255, 255, 255, 0.9);
        font-size: 14px;
        white-space: nowrap;
      }

      .cw-header-actions {
        display: flex;
        gap: 4px;
        flex-shrink: 0;
      }

      .cw-header-btn,
      .cw-back-btn {
        padding: 8px;
        background: transparent;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .cw-header-btn:hover,
      .cw-back-btn:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }

      .cw-header-btn svg,
      .cw-back-btn svg {
        width: 20px;
        height: 20px;
        fill: none;
        stroke: white;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      /* Tab navigation */
      .cw-tab-navigation {
        display: flex;
        border-bottom: 1px solid #e5e7eb;
        flex-shrink: 0;
        background: white;
      }

      .cw-tab-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 8px;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        color: #6b7280;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
        white-space: nowrap;
      }

      .cw-tab-btn:hover {
        color: #111827;
      }

      .cw-tab-btn.active {
        color: var(--cw-primary-color, #713600);
        border-bottom-color: var(--cw-primary-color, #713600);
      }

      .cw-tab-btn svg {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      /* Content area */
      .cw-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        background: white;
      }

      /* Home tab */
      .cw-home-tab {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .cw-welcome-section {
        padding: 24px;
        text-align: center;
        flex-shrink: 0;
      }

      .cw-welcome-icon {
        width: 64px;
        height: 64px;
        background: var(--cw-primary-color, #713600);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 16px;
        font-size: 32px;
      }

      .cw-welcome-section h3 {
        font-size: 24px;
        font-weight: bold;
        color: #111827;
        margin: 0 0 8px 0;
      }

      .cw-welcome-section p {
        color: #6b7280;
        font-size: 14px;
        margin: 0;
      }

      .cw-send-message-cta {
        padding: 0 16px;
        margin-bottom: 24px;
        flex-shrink: 0;
      }

      .cw-send-message-btn {
        width: 100%;
        background: white;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        padding: 14px 16px;
        color: #374151;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.2s;
      }

      .cw-send-message-btn:hover {
        border-color: var(--cw-primary-color, #713600);
        color: var(--cw-primary-color, #713600);
      }

      .cw-send-message-btn .cw-icon-box {
        width: 32px;
        height: 32px;
        background: #f3f4f6;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
        flex-shrink: 0;
      }

      .cw-send-message-btn:hover .cw-icon-box {
        background: rgba(113, 54, 0, 0.1);
      }

      .cw-send-message-btn svg {
        width: 16px;
        height: 16px;
        fill: none;
        stroke: #6b7280;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .cw-send-message-btn:hover svg {
        stroke: var(--cw-primary-color, #713600);
      }

      .cw-faqs-section {
        padding: 0 16px 24px;
        flex: 1;
        overflow-y: auto;
      }

      .cw-section-title {
        font-size: 14px;
        font-weight: 600;
        color: #374151;
        margin: 0 0 12px 0;
      }

      .cw-faq-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .cw-faq-item {
        width: 100%;
        text-align: left;
        padding: 12px;
        background: #f9fafb;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .cw-faq-item:hover {
        background: #f3f4f6;
      }

      .cw-faq-question {
        font-size: 14px;
        font-weight: 500;
        color: #111827;
        margin: 0 0 4px 0;
      }

      .cw-faq-category {
        font-size: 12px;
        color: var(--cw-primary-color, #713600);
        margin: 0;
      }

      .cw-loading-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid var(--cw-primary-color, #713600);
        border-top-color: transparent;
        border-radius: 50%;
        animation: cw-spin 1s linear infinite;
        margin: 32px auto;
      }

      /* Messages view */
      .cw-messages-view {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .cw-empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 24px;
        text-align: center;
      }

      .cw-empty-icon {
        width: 64px;
        height: 64px;
        background: #f3f4f6;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
      }

      .cw-empty-icon svg {
        width: 32px;
        height: 32px;
        fill: none;
        stroke: #9ca3af;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .cw-empty-state h3 {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 8px 0;
      }

      .cw-empty-state p {
        color: #6b7280;
        margin: 0 0 24px 0;
      }

      .cw-primary-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--cw-primary-color, #713600);
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .cw-primary-btn:hover {
        filter: brightness(0.9);
      }

      .cw-primary-btn svg {
        width: 20px;
        height: 20px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      /* Department selection */
      .cw-department-selection {
        padding: 24px;
      }

      .cw-department-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 16px;
      }

      .cw-department-card {
        padding: 16px;
        background: #f9fafb;
        border: 2px solid transparent;
        border-radius: 12px;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s;
      }

      .cw-department-card:hover {
        background: #f3f4f6;
        border-color: var(--cw-primary-color, #713600);
      }

      .cw-department-icon {
        font-size: 32px;
        margin-bottom: 8px;
        line-height: 1;
      }

      .cw-department-name {
        font-size: 14px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 4px 0;
      }

      .cw-department-desc {
        font-size: 12px;
        color: #6b7280;
        margin: 0;
      }

      /* Pre-chat form */
      .cw-pre-chat-form {
        padding: 24px;
      }

      .cw-form-group {
        margin-bottom: 16px;
      }

      .cw-form-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        margin: 0 0 6px 0;
      }

      .cw-form-input,
      .cw-form-textarea {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        transition: border-color 0.2s;
        font-family: inherit;
      }

      .cw-form-textarea {
        resize: vertical;
        min-height: 80px;
      }

      .cw-form-input:focus,
      .cw-form-textarea:focus {
        outline: none;
        border-color: var(--cw-primary-color, #713600);
      }

      .cw-submit-btn {
        width: 100%;
        background: var(--cw-primary-color, #713600);
        color: white;
        padding: 12px;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .cw-submit-btn:hover:not(:disabled) {
        filter: brightness(0.9);
      }

      .cw-submit-btn:disabled {
        background: #d1d5db;
        cursor: not-allowed;
      }

      /* Chat window */
      .cw-chat-container {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .cw-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .cw-message {
        display: flex;
        gap: 8px;
        max-width: 80%;
        align-items: flex-start;
      }

      .cw-message.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }

      .cw-message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--cw-primary-color, #713600);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: white;
        font-size: 14px;
        font-weight: 600;
      }

      .cw-message.user .cw-message-avatar {
        background: #e5e7eb;
        color: #374151;
      }

      .cw-message-bubble {
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
      }

      .cw-message.user .cw-message-bubble {
        background: var(--cw-primary-color, #713600);
        color: white;
        border-bottom-right-radius: 4px;
      }

      .cw-message.assistant .cw-message-bubble,
      .cw-message.agent .cw-message-bubble {
        background: #f3f4f6;
        color: #111827;
        border-bottom-left-radius: 4px;
      }

      .cw-typing-indicator {
        display: flex;
        gap: 4px;
        padding: 10px 14px;
      }

      .cw-typing-dot {
        width: 8px;
        height: 8px;
        background: #9ca3af;
        border-radius: 50%;
        animation: cw-typing 1.4s infinite;
      }

      .cw-typing-dot:nth-child(2) {
        animation-delay: 0.2s;
      }

      .cw-typing-dot:nth-child(3) {
        animation-delay: 0.4s;
      }

      /* Chat input */
      .cw-chat-input-container {
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        flex-shrink: 0;
        background: white;
      }

      .cw-chat-input-wrapper {
        display: flex;
        gap: 8px;
        align-items: flex-end;
      }

      .cw-chat-input {
        flex: 1;
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        resize: none;
        max-height: 120px;
        font-family: inherit;
        line-height: 1.5;
      }

      .cw-chat-input:focus {
        outline: none;
        border-color: var(--cw-primary-color, #713600);
      }

      .cw-send-btn {
        width: 40px;
        height: 40px;
        background: var(--cw-primary-color, #713600);
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
        flex-shrink: 0;
      }

      .cw-send-btn:hover:not(:disabled) {
        filter: brightness(0.9);
      }

      .cw-send-btn:disabled {
        background: #d1d5db;
        cursor: not-allowed;
      }

      .cw-send-btn svg {
        width: 20px;
        height: 20px;
        fill: none;
        stroke: white;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      /* Animations */
      @keyframes cw-bounce-slow {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes cw-ping {
        75%, 100% {
          transform: scale(2);
          opacity: 0;
        }
      }

      @keyframes cw-slide-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes cw-spin {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes cw-typing {
        0%, 60%, 100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-10px);
        }
      }

      /* Utility classes */
      .cw-hidden {
        display: none !important;
      }

      /* Scrollbar styling */
      .cw-content::-webkit-scrollbar,
      .cw-chat-messages::-webkit-scrollbar,
      .cw-faqs-section::-webkit-scrollbar {
        width: 6px;
      }

      .cw-content::-webkit-scrollbar-track,
      .cw-chat-messages::-webkit-scrollbar-track,
      .cw-faqs-section::-webkit-scrollbar-track {
        background: transparent;
      }

      .cw-content::-webkit-scrollbar-thumb,
      .cw-chat-messages::-webkit-scrollbar-thumb,
      .cw-faqs-section::-webkit-scrollbar-thumb {
        background: #d1d5db;
        border-radius: 3px;
      }

      .cw-content::-webkit-scrollbar-thumb:hover,
      .cw-chat-messages::-webkit-scrollbar-thumb:hover,
      .cw-faqs-section::-webkit-scrollbar-thumb:hover {
        background: #9ca3af;
      }

      /* Mobile responsive */
      @media (max-width: 480px) {
        #chat-widget-root {
          bottom: 0;
          right: 0;
          left: 0;
        }

        #chat-widget-root.position-left {
          left: 0;
          right: 0;
        }

        .cw-widget {
          width: 100vw;
          height: 100vh;
          max-width: 100vw;
          max-height: 100vh;
          border-radius: 0;
          margin-bottom: 0;
        }

        .cw-chat-button {
          position: fixed;
          bottom: 16px;
          right: 16px;
        }
        .cw-empty-state {
          color: #4b5563;
          width: 100vw;
          height: 20vh;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
        }
      }
    </style>

    <div id="chat-widget-root">
      <!-- Chat button -->
      <button class="cw-chat-button animate-bounce" id="cw-chat-button" aria-label="Open chat">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="cw-pulse-ring"></span>
        <div class="cw-unread-badge cw-hidden" id="cw-unread-badge">
          <span id="cw-unread-count">0</span>
        </div>
      </button>

      <!-- Chat widget window -->
      <div class="cw-widget cw-hidden" id="cw-widget">
        <!-- Header -->
        <div class="cw-header">
          <div class="cw-header-left">
            <button class="cw-back-btn cw-hidden" id="cw-back-btn" aria-label="Back">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div class="cw-header-title">
              <h2 id="cw-company-name">Support</h2>
              <div class="cw-header-status">
                <div class="cw-status-dot"></div>
                <span class="cw-status-text">We're online</span>
              </div>
            </div>
          </div>
          <div class="cw-header-actions">
            <button class="cw-header-btn" id="cw-minimize-btn" aria-label="Minimize">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <polyline points="4 14 10 14 10 20"></polyline>
                <polyline points="20 10 14 10 14 4"></polyline>
                <line x1="14" y1="10" x2="21" y2="3"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
            <button class="cw-header-btn" id="cw-close-btn" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Tab navigation -->
        <div class="cw-tab-navigation" id="cw-tab-navigation">
          <button class="cw-tab-btn active" data-tab="home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Home
          </button>
          <button class="cw-tab-btn" data-tab="messages">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Messages
          </button>
          <button class="cw-tab-btn" data-tab="articles">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Articles
          </button>
        </div>

        <!-- Content area -->
        <div class="cw-content" id="cw-content">
          <!-- Content will be dynamically loaded here -->
        </div>
      </div>
    </div>
  `;

  // ChatWidget State
  const state = {
    widgetState: 'CLOSED',
    activeTab: 'home',
    messagesView: 'list',
    unreadCount: 0,
    user: config.user || null,
    conversation: null,
    messages: [],
    departments: [],
    faqLoading: true,
    faqs: [],
    articlesLoading: true,
    articles: [],
    selectedDepartment: null,
    isConnected: false,
    isTyping: false,
    widgetConfig: null,
    companyInfo: null,
  };

  let elements = {};

  // Initialize widget
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadWidget);
    } else {
      loadWidget();
    }
  }

  // Load widget configuration from backend
  async function loadWidget() {
    console.log('Chat Widget: Loading configuration for company:', config.companyId);

    try {
      // Fetch widget configuration from backend
      const url = `${apiBaseUrl}/widget/public/${config.companyId}`;
      console.log('Chat Widget: Fetching config from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        console.warn('Chat Widget: Backend returned status:', response.status);
        throw new Error(`Failed to load widget configuration: ${response.status}`);
      }

      const data = await response.json();
      state.widgetConfig = data.data;
      console.log('Chat Widget: Configuration loaded successfully:', state.widgetConfig);

      // if(state.user) {

      // }

      // Inject widget HTML
      injectWidget();
    } catch (error) {
      console.warn('Chat Widget: Could not load backend config, using defaults:', error.message);
      // Still inject widget with defaults if config fails
      state.widgetConfig = {
        position: 'bottom-right',
        primary_color: '#713600',
        title: 'Support',
      };
      console.log('Chat Widget: Using default configuration');
      injectWidget();
    }
  }

  // Inject widget into page
  function injectWidget() {
    console.log('Chat Widget: Injecting widget into page');

    const container = document.createElement('div');
    container.innerHTML = widgetHTML;
    while (container.firstElementChild) {
      document.body.appendChild(container.firstElementChild);
    }

    // Get DOM elements
    elements = {
      root: document.getElementById('chat-widget-root'),
      chatButton: document.getElementById('cw-chat-button'),
      widget: document.getElementById('cw-widget'),
      closeBtn: document.getElementById('cw-close-btn'),
      minimizeBtn: document.getElementById('cw-minimize-btn'),
      backBtn: document.getElementById('cw-back-btn'),
      tabNavigation: document.getElementById('cw-tab-navigation'),
      content: document.getElementById('cw-content'),
      unreadBadge: document.getElementById('cw-unread-badge'),
      unreadCount: document.getElementById('cw-unread-count'),
      companyName: document.getElementById('cw-company-name'),
    };

    console.log('Chat Widget: DOM elements found:', {
      root: !!elements.root,
      chatButton: !!elements.chatButton,
      widget: !!elements.widget
    });

    // Apply configuration
    applyConfiguration();

    // Attach event listeners
    attachEventListeners();

    // Load initial data
    loadFAQs();
    loadArticles();

    console.log('Chat Widget: Initialized successfully! 🎉');
  }

  // Apply widget configuration
  function applyConfiguration() {
    const wConfig = state.widgetConfig;

    // Set position
    if (wConfig.position === 'bottom-left') {
      elements.root.classList.add('position-left');
    }

    // Set company name/title
    elements.companyName.textContent = wConfig.title || 'Support';

    // Set primary color
    if (wConfig.primary_color) {
      document.documentElement.style.setProperty('--cw-primary-color', wConfig.primary_color);
    }
  }

  // Attach event listeners
  function attachEventListeners() {
    elements.chatButton.addEventListener('click', handleButtonClick);
    elements.closeBtn.addEventListener('click', handleClose);
    elements.minimizeBtn.addEventListener('click', handleMinimize);
    elements.backBtn.addEventListener('click', handleBack);

    elements.tabNavigation.querySelectorAll('.cw-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        switchTab(tab);
      });
    });
  }

  // Handle button click
  function handleButtonClick() {
    if (state.widgetState === 'CLOSED' || state.widgetState === 'MINIMIZED') {
      openWidget();
    }
  }

  // Open widget
  function openWidget() {
    state.widgetState = 'CHAT_ACTIVE';
    elements.chatButton.classList.add('cw-hidden');
    elements.widget.classList.remove('cw-hidden');
    resetUnreadCount();
    renderCurrentView();
  }

  // Handle close
  function handleClose() {
    state.widgetState = 'CLOSED';
    elements.widget.classList.add('cw-hidden');
    elements.chatButton.classList.remove('cw-hidden');
    state.activeTab = 'home';
    state.messagesView = 'list';
  }

  // Handle minimize
  function handleMinimize() {
    state.widgetState = 'MINIMIZED';
    elements.widget.classList.add('cw-hidden');
    elements.chatButton.classList.remove('cw-hidden');
  }

  // Handle back
  function handleBack() {
    if (state.messagesView === 'chat') {
      state.messagesView = 'list';
      renderCurrentView();
    }
  }

  // Switch tab
  function switchTab(tab) {
    state.activeTab = tab;

    elements.tabNavigation.querySelectorAll('.cw-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    renderCurrentView();
  }

  // Render current view
  function renderCurrentView() {
    elements.backBtn.classList.toggle('cw-hidden', state.messagesView !== 'chat');
    elements.tabNavigation.classList.toggle('cw-hidden', state.messagesView === 'chat');

    if (state.messagesView === 'chat') {
      renderChatView();
    } else if (state.activeTab === 'home') {
      renderHomeTab();
    } else if (state.activeTab === 'messages') {
      renderMessagesTab();
    } else if (state.activeTab === 'articles') {
      renderArticlesTab();
    }
  }

  // Render home tab
  function renderHomeTab() {
    const html = `
      <div class="cw-home-tab">
        <div class="cw-welcome-section">
          <div class="cw-welcome-icon">👋</div>
          <h3>Hi there!</h3>
          <p>How can we help you today?</p>
        </div>

        <div class="cw-send-message-cta">
          <button class="cw-send-message-btn" id="cw-send-message-btn">
            <span>Send us a message</span>
            <div class="cw-icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </div>
          </button>
        </div>

        <div class="cw-faqs-section">
          <h4 class="cw-section-title">Popular questions</h4>
          <div class="cw-faq-list">
            ${renderFAQs()}
          </div>
        </div>
      </div>
    `;

    elements.content.innerHTML = html;

    document.getElementById('cw-send-message-btn').addEventListener('click', () => {
      state.activeTab = 'messages';
      switchTab('messages');
    });
  }

  // Render FAQs
  function renderFAQs() {
    if(state.faqLoading) {
      return '<div class="cw-loading-spinner"></div>';
    }
    if (state.faqs.length === 0) {
      return '<div class="cw-empty-state">No FAQs Found</div>';
    }

    return state.faqs.slice(0, 5).map(faq => `
      <button class="cw-faq-item">
        <p class="cw-faq-question">${escapeHtml(faq.question)}</p>
        ${faq.category_name ? `<p class="cw-faq-category">${escapeHtml(faq.category_name)}</p>` : ''}
      </button>
    `).join('');
  }

  // Render messages tab
  function renderMessagesTab() {
    if (state.messagesView === 'list') {
      renderMessagesList();
    } else if (state.messagesView === 'departments') {
      renderDepartments();
    } else if (state.messagesView === 'form') {
      renderPreChatForm();
    }
  }

  // Render messages list
  function renderMessagesList() {
    const html = `
      <div class="cw-messages-view">
        <div class="cw-empty-state">
          <div class="cw-empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3>No conversations yet</h3>
          <p>Start a conversation with our team</p>
          <button class="cw-primary-btn" id="cw-start-new-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Start new conversation
          </button>
        </div>
      </div>
    `;

    elements.content.innerHTML = html;

    document.getElementById('cw-start-new-btn').addEventListener('click', () => {
      state.messagesView = 'departments';
      loadDepartments();
      renderCurrentView();
    });
  }

  // Render departments
  function renderDepartments() {
    const html = `
      <div class="cw-department-selection">
        <div>
          <h3 style="font-size: 20px; font-weight: bold; color: #111827; margin: 0 0 8px 0;">Choose a team</h3>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Select the team that can best help you</p>
        </div>
        <div class="cw-department-grid">
          ${renderDepartmentCards()}
        </div>
      </div>
    `;

    elements.content.innerHTML = html;

    document.querySelectorAll('[data-department-id]').forEach(card => {
      card.addEventListener('click', () => {
        state.selectedDepartment = card.dataset.departmentId;
        state.messagesView = 'form';
        renderCurrentView();
      });
    });
  }

  // Render department cards
  function renderDepartmentCards() {
    if (state.departments.length === 0) {
      return '<div style="grid-column: 1 / -1;"><div class="cw-loading-spinner"></div></div>';
    }

    return state.departments.map(dept => `
      <button class="cw-department-card" data-department-id="${dept.id}">
        <div class="cw-department-icon">${dept.icon || '💬'}</div>
        <div class="cw-department-name">${escapeHtml(dept.name)}</div>
        <div class="cw-department-desc">${escapeHtml(dept.description || 'How can we help you?')}</div>
      </button>
    `).join('');
  }

  // Render pre-chat form
  function renderPreChatForm() {
    // Pre-fill form if user data provided
    const firstName = state.user?.firstName || '';
    const lastName = state.user?.lastName || '';
    const email = state.user?.email || '';

    const html = `
      <div class="cw-pre-chat-form">
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 4px 0;">Start a conversation</h3>
          <p style="font-size: 12px; color: #6b7280; margin: 0;">We'll need some details first</p>
        </div>

        <form id="cw-pre-chat-form">
          <div class="cw-form-group">
            <label class="cw-form-label">First Name *</label>
            <input type="text" class="cw-form-input" name="firstName" value="${escapeHtml(firstName)}" required>
          </div>

          <div class="cw-form-group">
            <label class="cw-form-label">Last Name *</label>
            <input type="text" class="cw-form-input" name="lastName" value="${escapeHtml(lastName)}" required>
          </div>

          <div class="cw-form-group">
            <label class="cw-form-label">Email *</label>
            <input type="email" class="cw-form-input" name="email" value="${escapeHtml(email)}" required>
          </div>


          <button type="submit" class="cw-submit-btn">Start conversation</button>
        </form>
      </div>
    `;

    elements.content.innerHTML = html;

    document.getElementById('cw-pre-chat-form').addEventListener('submit', handleFormSubmit);
  }

  // Handle form submit
  async function handleFormSubmit(e) {
    e.preventDefault();

    // if(user) {
    //   const data = {
    //   first_name: formData.get('firstName'),
    //   last_name: formData.get('lastName'),
    //   email: formData.get('email'),
    //   category_id: state.selectedDepartment,
    //   company_id: config.companyId,
    // };

    // await startConversation(data);
    // }

    const formData = new FormData(e.target);
    const data = {
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email: formData.get('email'),
      category_id: state.selectedDepartment,
      company_id: config.companyId,
    };

    await startConversation(data);
  }

  // Start conversation
  async function startConversation(userData) {
    try {
      // Call backend API to create conversation
      const response = await fetch(`${apiBaseUrl}/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }

      const result = await response.json();
      state.user = result.data.user;
      state.conversation = result.data.conversation;
      state.messages = result.data.messages || [];

      state.messagesView = 'chat';
      renderCurrentView();
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  }

  // Render chat view
  function renderChatView() {
    const html = `
      <div class="cw-chat-container">
        <div class="cw-chat-messages" id="cw-chat-messages">
          ${renderMessages()}
        </div>
        <div class="cw-chat-input-container">
          <div class="cw-chat-input-wrapper">
            <textarea
              class="cw-chat-input"
              id="cw-chat-input"
              placeholder="Type your message..."
              rows="1"
            ></textarea>
            <button class="cw-send-btn" id="cw-send-chat-btn" ${state.isTyping ? 'disabled' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    elements.content.innerHTML = html;

    const chatInput = document.getElementById('cw-chat-input');
    const sendBtn = document.getElementById('cw-send-chat-btn');

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    chatInput.addEventListener('input', function () {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    scrollToBottom();
  }

  // Render messages
  function renderMessages() {
    const messagesHtml = state.messages.map(msg => {
      const role = msg.role?.toLowerCase() || 'user';
      const initial = role === 'user' ? (state.user?.firstName?.charAt(0) || 'U') : 'A';

      return `
        <div class="cw-message ${role}">
          <div class="cw-message-avatar">${initial}</div>
          <div class="cw-message-bubble">${escapeHtml(msg.content)}</div>
        </div>
      `;
    }).join('');

    const typingHtml = state.isTyping ? `
      <div class="cw-message assistant">
        <div class="cw-message-avatar">A</div>
        <div class="cw-message-bubble">
          <div class="cw-typing-indicator">
            <div class="cw-typing-dot"></div>
            <div class="cw-typing-dot"></div>
            <div class="cw-typing-dot"></div>
          </div>
        </div>
      </div>
    ` : '';

    return messagesHtml + typingHtml;
  }

  // Send message
  async function sendMessage() {
    const input = document.getElementById('cw-chat-input');
    const message = input.value.trim();

    if (!message || state.isTyping) return;

    // Add user message optimistically
    const userMessage = {
      id: 'msg-' + Date.now(),
      role: 'USER',
      content: message,
      timestamp: new Date().toISOString(),
    };
    state.messages.push(userMessage);

    input.value = '';
    input.style.height = 'auto';

    state.isTyping = true;
    renderChatView();

    try {
      // Send message to backend
      const response = await fetch(`${apiBaseUrl}/conversation/${state.conversation.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          user_id: state.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();

      // Replace temp message with server response if needed
      // Add AI response
      if (result.data.response) {
        state.messages.push({
          id: result.data.id,
          role: 'ASSISTANT',
          content: result.data.response,
          timestamp: result.data.timestamp,
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      state.messages.push({
        id: 'error-' + Date.now(),
        role: 'ASSISTANT',
        content: 'Sorry, there was an error sending your message. Please try again.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      state.isTyping = false;
      renderChatView();
    }
  }

  // Add message
  function addMessage(message) {
    state.messages.push(message);
    renderChatView();
  }

  // Render articles tab
  function renderArticlesTab() {
    const html = `
      <div style="height: 100%; overflow-y: auto; display: flex; flex-direction: column;">
        <div style="padding: 24px; border-bottom: 1px solid #e5e7eb; flex-shrink: 0;">
          <h3 style="font-size: 20px; font-weight: bold; color: #111827; margin: 0 0 8px 0;">Help articles</h3>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Find answers in our documentation</p>
        </div>
        <div style="padding: 16px; flex: 1;">
          ${renderArticles()}
        </div>
      </div>
    `;

    elements.content.innerHTML = html;
  }

  // Render articles
  function renderArticles() {
    if(state.articlesLoading) {
      return '<div class="cw-loading-spinner"></div>';
    }
    if (state.articles.length === 0) {
      return '<div class="cw-empty-state">No Articles Found</div>';
    }

    return '<div style="display: flex; flex-direction: column; gap: 8px;">' +
      state.articles.slice(0, 15).map(article => `
        <button class="cw-faq-item">
          <p class="cw-faq-question">${escapeHtml(article.title)}</p>
          ${article.category_name ? `<p class="cw-faq-category">${escapeHtml(article.category_name)}</p>` : ''}
        </button>
      `).join('') +
      '</div>';
  }

  // Load FAQs from backend
  async function loadFAQs() {
    state.faqLoading = true
    try {
      const response = await fetch(`${apiBaseUrl}/knowledge/public/${config.companyId}/faqs`);
      if (response.ok) {
        const result = await response.json();
        state.faqs = result.data || [];
      }
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      state.faqs = [];
    } finally {
      state.faqLoading = false
    }
  }

  // Load articles from backend
  async function loadArticles() {
    state.articlesLoading = true
    try {
      const response = await fetch(`${apiBaseUrl}/knowledge/public/${config.companyId}/articles`);
      if (response.ok) {
        const result = await response.json();
        state.articles = result.data || [];
      }
    } catch (error) {
      console.error('Failed to load articles:', error);
      state.articles = [];
    } finally {
      state.articlesLoading = false
    }
  }

  // Load departments from backend
  async function loadDepartments() {
    try {
      const response = await fetch(`${apiBaseUrl}/departments/public/${config.companyId}`);
      if (response.ok) {
        const result = await response.json();
        state.departments = result.data || [];
        renderCurrentView();
      }
    } catch (error) {
      console.error('Failed to load departments:', error);
      state.departments = [];
      renderCurrentView();
    }
  }

  // Reset unread count
  function resetUnreadCount() {
    state.unreadCount = 0;
    elements.unreadCount.textContent = '0';
    elements.unreadBadge.classList.add('cw-hidden');
  }

  // Scroll to bottom
  function scrollToBottom() {
    setTimeout(() => {
      const messagesContainer = document.getElementById('cw-chat-messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }

  // Escape HTML
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize widget
  init();
})();

