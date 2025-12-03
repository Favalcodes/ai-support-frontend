(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.AISupportWidget) {
    console.warn('AI Support Widget already initialized');
    return;
  }

  class AISupportWidget {
    constructor(config) {
      this.config = {
        companyId: config.companyId,
        apiUrl: config.apiUrl || 'http://localhost:3000/api/v1',
        position: config.position || 'bottom-right',
        primaryColor: config.primaryColor || '#0891b2',
        welcomeMessage: config.welcomeMessage || 'Hi! How can we help you today?',
        placeholderText: config.placeholderText || 'Type your message...',
        title: config.title || 'Support Chat',
        categoryId: config.categoryId || null,
        autoOpen: config.autoOpen || false,
        ...config
      };

      this.isOpen = false;
      this.isMinimized = false;
      this.conversationId = null;
      this.userId = null;
      this.messages = [];
      this.isTyping = false;

      this.init();
    }

    init() {
      this.loadUserData();
      this.injectStyles();
      this.createWidget();
      this.attachEventListeners();

      if (this.config.autoOpen) {
        setTimeout(() => this.openChat(), 1000);
      }
    }

    loadUserData() {
      const stored = localStorage.getItem('ai_support_user_data');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          this.userId = data.userId;
          this.conversationId = data.conversationId;
        } catch (e) {
          console.error('Failed to load user data:', e);
        }
      }
    }

    saveUserData() {
      localStorage.setItem('ai_support_user_data', JSON.stringify({
        userId: this.userId,
        conversationId: this.conversationId
      }));
    }

    injectStyles() {
      const styles = `
        .ai-support-widget * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .ai-support-widget {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          position: fixed;
          z-index: 999999;
          ${this.getPositionStyles()}
        }

        .ai-support-widget-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: ${this.config.primaryColor};
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .ai-support-widget-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .ai-support-widget-button svg {
          width: 28px;
          height: 28px;
          fill: white;
        }

        .ai-support-widget-container {
          position: fixed;
          ${this.getPositionStyles()}
          width: 400px;
          height: 600px;
          max-height: 90vh;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          display: none;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ai-support-widget-container.open {
          display: flex;
        }

        .ai-support-widget-container.minimized {
          height: 60px;
        }

        .ai-support-widget-header {
          background: ${this.config.primaryColor};
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }

        .ai-support-widget-header-title {
          font-size: 16px;
          font-weight: 600;
          flex: 1;
        }

        .ai-support-widget-header-actions {
          display: flex;
          gap: 8px;
        }

        .ai-support-widget-header-button {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .ai-support-widget-header-button:hover {
          opacity: 1;
        }

        .ai-support-widget-header-button svg {
          width: 20px;
          height: 20px;
          fill: white;
        }

        .ai-support-widget-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f9fafb;
        }

        .ai-support-widget-container.minimized .ai-support-widget-messages,
        .ai-support-widget-container.minimized .ai-support-widget-input-container {
          display: none;
        }

        .ai-support-widget-message {
          margin-bottom: 12px;
          display: flex;
          gap: 8px;
        }

        .ai-support-widget-message.user {
          justify-content: flex-end;
        }

        .ai-support-widget-message-content {
          max-width: 75%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .ai-support-widget-message.bot .ai-support-widget-message-content {
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .ai-support-widget-message.user .ai-support-widget-message-content {
          background: ${this.config.primaryColor};
          color: white;
        }

        .ai-support-widget-typing {
          display: flex;
          gap: 4px;
          padding: 10px 14px;
          background: white;
          border-radius: 12px;
          width: fit-content;
          border: 1px solid #e5e7eb;
        }

        .ai-support-widget-typing-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #9ca3af;
          animation: typing 1.4s infinite;
        }

        .ai-support-widget-typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .ai-support-widget-typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }

        .ai-support-widget-input-container {
          padding: 16px;
          background: white;
          border-top: 1px solid #e5e7eb;
        }

        .ai-support-widget-form {
          display: flex;
          gap: 8px;
        }

        .ai-support-widget-input {
          flex: 1;
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .ai-support-widget-input:focus {
          border-color: ${this.config.primaryColor};
        }

        .ai-support-widget-send-button {
          padding: 10px 16px;
          background: ${this.config.primaryColor};
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .ai-support-widget-send-button:hover {
          opacity: 0.9;
        }

        .ai-support-widget-send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .ai-support-widget-email-form {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .ai-support-widget-email-form h3 {
          font-size: 18px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
        }

        .ai-support-widget-email-form p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 16px;
        }

        .ai-support-widget-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ai-support-widget-form-group label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .ai-support-widget-form-group input {
          padding: 10px 14px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .ai-support-widget-form-group input:focus {
          border-color: ${this.config.primaryColor};
        }

        .ai-support-widget-start-button {
          padding: 12px;
          background: ${this.config.primaryColor};
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          margin-top: 8px;
        }

        @media (max-width: 480px) {
          .ai-support-widget-container {
            width: 100%;
            height: 100%;
            max-height: 100vh;
            border-radius: 0;
            bottom: 0 !important;
            right: 0 !important;
            left: 0 !important;
            top: 0 !important;
          }
        }
      `;

      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    getPositionStyles() {
      const positions = {
        'bottom-right': 'bottom: 20px; right: 20px;',
        'bottom-left': 'bottom: 20px; left: 20px;',
        'top-right': 'top: 20px; right: 20px;',
        'top-left': 'top: 20px; left: 20px;'
      };
      return positions[this.config.position] || positions['bottom-right'];
    }

    createWidget() {
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'ai-support-widget';
      widgetDiv.innerHTML = `
        <button class="ai-support-widget-button" id="ai-support-toggle">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 13.93 2.6 15.72 3.63 17.2L2.2 21.8C2.08 22.15 2.24 22.53 2.56 22.7C2.68 22.77 2.81 22.8 2.95 22.8C3.11 22.8 3.27 22.75 3.4 22.65L8.2 19.37C9.53 20.09 10.72 20.5 12 20.5C17.52 20.5 22 16.02 22 10.5C22 4.98 17.52 2 12 2ZM12 18C11.21 18 10.43 17.88 9.69 17.64L9.41 17.54L5.95 19.62L6.86 16.41L6.69 16.08C5.65 14.59 5 12.85 5 11C5 7.69 8.13 5 12 5C15.87 5 19 7.69 19 11C19 14.31 15.87 18 12 18Z"/>
          </svg>
        </button>
        <div class="ai-support-widget-container" id="ai-support-container">
          <div class="ai-support-widget-header" id="ai-support-header">
            <div class="ai-support-widget-header-title">${this.config.title}</div>
            <div class="ai-support-widget-header-actions">
              <button class="ai-support-widget-header-button" id="ai-support-minimize">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 13H5v-2h14v2z"/>
                </svg>
              </button>
              <button class="ai-support-widget-header-button" id="ai-support-close">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="ai-support-widget-messages" id="ai-support-messages"></div>
          <div class="ai-support-widget-input-container">
            <form class="ai-support-widget-form" id="ai-support-form">
              <input
                type="text"
                class="ai-support-widget-input"
                id="ai-support-input"
                placeholder="${this.config.placeholderText}"
                autocomplete="off"
              />
              <button type="submit" class="ai-support-widget-send-button">Send</button>
            </form>
          </div>
        </div>
      `;

      document.body.appendChild(widgetDiv);
      this.elements = {
        toggle: document.getElementById('ai-support-toggle'),
        container: document.getElementById('ai-support-container'),
        header: document.getElementById('ai-support-header'),
        minimize: document.getElementById('ai-support-minimize'),
        close: document.getElementById('ai-support-close'),
        messages: document.getElementById('ai-support-messages'),
        form: document.getElementById('ai-support-form'),
        input: document.getElementById('ai-support-input')
      };
    }

    attachEventListeners() {
      this.elements.toggle.addEventListener('click', () => this.toggleChat());
      this.elements.close.addEventListener('click', () => this.closeChat());
      this.elements.minimize.addEventListener('click', () => this.minimizeChat());
      this.elements.header.addEventListener('click', (e) => {
        if (this.isMinimized && e.target === this.elements.header) {
          this.maximizeChat();
        }
      });
      this.elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendMessage();
      });
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    async openChat() {
      this.isOpen = true;
      this.elements.container.classList.add('open');
      this.elements.toggle.style.display = 'none';

      if (!this.conversationId) {
        this.showEmailForm();
      } else {
        await this.loadConversation();
        this.elements.input.focus();
      }
    }

    closeChat() {
      this.isOpen = false;
      this.elements.container.classList.remove('open');
      this.elements.toggle.style.display = 'flex';
    }

    minimizeChat() {
      this.isMinimized = true;
      this.elements.container.classList.add('minimized');
    }

    maximizeChat() {
      this.isMinimized = false;
      this.elements.container.classList.remove('minimized');
    }

    showEmailForm() {
      this.elements.messages.innerHTML = `
        <div class="ai-support-widget-email-form">
          <h3>Welcome to ${this.config.title}!</h3>
          <p>Please provide your details to get started</p>
          <div class="ai-support-widget-form-group">
            <label>First Name</label>
            <input type="text" id="ai-support-first-name" required />
          </div>
          <div class="ai-support-widget-form-group">
            <label>Last Name</label>
            <input type="text" id="ai-support-last-name" required />
          </div>
          <div class="ai-support-widget-form-group">
            <label>Email Address</label>
            <input type="email" id="ai-support-email" required />
          </div>
          <button class="ai-support-widget-start-button" id="ai-support-start-chat">
            Start Chat
          </button>
        </div>
      `;

      document.getElementById('ai-support-start-chat').addEventListener('click', () => {
        this.startConversation();
      });
    }

    async startConversation() {
      const firstName = document.getElementById('ai-support-first-name').value.trim();
      const lastName = document.getElementById('ai-support-last-name').value.trim();
      const email = document.getElementById('ai-support-email').value.trim();

      if (!firstName || !lastName || !email) {
        alert('Please fill in all fields');
        return;
      }

      try {
        const response = await fetch(`${this.config.apiUrl}/conversation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            first_name: firstName,
            last_name: lastName,
            company_id: this.config.companyId,
            category_id: this.config.categoryId
          })
        });

        const result = await response.json();

        if (result.success) {
          this.conversationId = result.data.conversation.id;
          this.userId = result.data.user.id;
          this.saveUserData();

          this.elements.messages.innerHTML = '';
          this.addMessage('bot', this.config.welcomeMessage);
          this.elements.input.focus();
        } else {
          alert('Failed to start conversation. Please try again.');
        }
      } catch (error) {
        console.error('Failed to start conversation:', error);
        alert('Failed to start conversation. Please try again.');
      }
    }

    async loadConversation() {
      try {
        const response = await fetch(
          `${this.config.apiUrl}/conversation/${this.conversationId}/messages`
        );
        const result = await response.json();

        if (result.success) {
          this.messages = result.data;
          this.renderMessages();
        }
      } catch (error) {
        console.error('Failed to load conversation:', error);
      }
    }

    renderMessages() {
      this.elements.messages.innerHTML = '';
      this.messages.forEach(msg => {
        this.addMessage(msg.role === 'USER' ? 'user' : 'bot', msg.message, false);
      });
      this.scrollToBottom();
    }

    addMessage(type, content, shouldScroll = true) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `ai-support-widget-message ${type}`;
      messageDiv.innerHTML = `
        <div class="ai-support-widget-message-content">${this.escapeHtml(content)}</div>
      `;
      this.elements.messages.appendChild(messageDiv);

      if (shouldScroll) {
        this.scrollToBottom();
      }
    }

    showTypingIndicator() {
      if (this.isTyping) return;

      this.isTyping = true;
      const typingDiv = document.createElement('div');
      typingDiv.className = 'ai-support-widget-message bot';
      typingDiv.id = 'ai-support-typing';
      typingDiv.innerHTML = `
        <div class="ai-support-widget-typing">
          <div class="ai-support-widget-typing-dot"></div>
          <div class="ai-support-widget-typing-dot"></div>
          <div class="ai-support-widget-typing-dot"></div>
        </div>
      `;
      this.elements.messages.appendChild(typingDiv);
      this.scrollToBottom();
    }

    hideTypingIndicator() {
      this.isTyping = false;
      const typingDiv = document.getElementById('ai-support-typing');
      if (typingDiv) {
        typingDiv.remove();
      }
    }

    async sendMessage() {
      const message = this.elements.input.value.trim();
      if (!message) return;

      this.addMessage('user', message);
      this.elements.input.value = '';
      this.showTypingIndicator();

      try {
        const response = await fetch(
          `${this.config.apiUrl}/conversation/${this.conversationId}/messages`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
          }
        );

        const result = await response.json();
        this.hideTypingIndicator();

        if (result.success) {
          this.addMessage('bot', result.data.message);
        } else {
          this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        this.hideTypingIndicator();
        this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
      }
    }

    scrollToBottom() {
      setTimeout(() => {
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
      }, 100);
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Initialize widget when DOM is ready
  function initWidget() {
    const script = document.currentScript || document.querySelector('script[data-ai-support]');

    if (!script) {
      console.error('AI Support Widget: Could not find widget script tag');
      return;
    }

    const config = {
      companyId: script.getAttribute('data-company-id'),
      apiUrl: script.getAttribute('data-api-url'),
      position: script.getAttribute('data-position'),
      primaryColor: script.getAttribute('data-primary-color'),
      welcomeMessage: script.getAttribute('data-welcome-message'),
      placeholderText: script.getAttribute('data-placeholder'),
      title: script.getAttribute('data-title'),
      categoryId: script.getAttribute('data-category-id'),
      autoOpen: script.getAttribute('data-auto-open') === 'true'
    };

    if (!config.companyId) {
      console.error('AI Support Widget: data-company-id attribute is required');
      return;
    }

    window.AISupportWidget = new AISupportWidget(config);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
