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
  /**
   * Configuration comes from either source, merged with window winning:
   *
   *   <script src="chat-widget.js" data-company-id="..."></script>
   *   window.chatWidgetConfig = { companyId: '...' }
   *
   * The data-attribute form is a common embed pattern and is what the demo page
   * shipped alongside this file already used, but only the window form was read,
   * so that page logged "companyId is required" and never mounted.
   */
  const currentScriptEl =
    document.currentScript ||
    document.querySelector('script[src*="chat-widget.js"]');

  function readDatasetConfig(el) {
    if (!el || !el.dataset) return {};
    const d = el.dataset;
    const out = {};
    if (d.companyId) out.companyId = d.companyId;
    if (d.apiUrl) out.apiUrl = d.apiUrl;
    if (d.position) out.position = d.position;
    if (d.primaryColor) out.primaryColor = d.primaryColor;
    if (d.title) out.title = d.title;
    if (d.welcomeMessage) out.welcomeMessage = d.welcomeMessage;
    if (d.placeholder) out.placeholder = d.placeholder;
    if (d.autoOpen) out.autoOpen = d.autoOpen === 'true';
    return out;
  }

  const config = Object.assign(
    {},
    readDatasetConfig(currentScriptEl),
    window.chatWidgetConfig || {}
  );

  if (!config.companyId) {
    console.error(
      'Chat Widget: companyId is required. Set window.chatWidgetConfig = { companyId: "..." } ' +
      'or add data-company-id to the script tag.'
    );
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
  const currentScript = currentScriptEl;
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
        background: var(--cw-primary-color, #4563FF);
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
        background: var(--cw-primary-color, #4563FF);
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
        background: var(--cw-primary-color, #4563FF);
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
        color: var(--cw-primary-color, #4563FF);
        border-bottom-color: var(--cw-primary-color, #4563FF);
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

      /* Attribution bar.
         Quiet by design and outside the scrolling content, so it stays pinned to
         the base of the widget on every tab. Hide it for white-label customers
         by removing this block and the anchor above. */
      .cw-powered-by {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 10px 12px;
        flex-shrink: 0;
        background: #ffffff;
        border-top: 1px solid #E9ECFF;
        color: #9A9EB6;
        font-size: 11px;
        font-weight: 500;
        text-decoration: none;
        transition: color 0.15s ease;
      }

      .cw-powered-by:hover {
        color: #0E1752;
      }

      .cw-powered-by b {
        color: #0E1752;
        font-weight: 700;
      }

      .cw-powered-by b.cw-powered-accent {
        color: #4563FF;
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
        background: var(--cw-primary-color, #4563FF);
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
        border-color: var(--cw-primary-color, #4563FF);
        color: var(--cw-primary-color, #4563FF);
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
        stroke: var(--cw-primary-color, #4563FF);
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

      /* Accordion styles */
      .cw-accordion-item {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        overflow: hidden;
        transition: box-shadow 0.2s;
      }

      .cw-accordion-item:hover {
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      }

      .cw-accordion-header {
        width: 100%;
        text-align: left;
        padding: 12px;
        background: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        transition: background-color 0.2s;
      }

      .cw-accordion-header:hover {
        background: #f9fafb;
      }

      .cw-accordion-title {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .cw-faq-category-badge {
        display: inline-block;
        padding: 2px 8px;
        font-size: 12px;
        font-weight: 500;
        color: #4563FF;
        background: #cffafe;
        border-radius: 4px;
        width: fit-content;
      }

      .cw-faq-question {
        font-size: 14px;
        font-weight: 500;
        color: #111827;
        margin: 0;
      }

      .cw-accordion-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        color: #9ca3af;
        transition: transform 0.2s;
      }

      .cw-accordion-icon-expanded {
        transform: rotate(180deg);
      }

      .cw-accordion-content {
        padding: 0 12px 12px 12px;
        border-top: 1px solid #f3f4f6;
      }

      .cw-faq-answer {
        font-size: 14px;
        color: #374151;
        margin: 8px 0 0 0;
        line-height: 1.5;
      }

      .cw-loading-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid var(--cw-primary-color, #4563FF);
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
        background: var(--cw-primary-color, #4563FF);
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

      .cw-secondary-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: white;
        color: #374151;
        padding: 12px 24px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .cw-secondary-btn:hover {
        background: #f9fafb;
        border-color: #9ca3af;
      }

      /* Conversation list item */
      .cw-conversation-item {
        width: 100%;
        text-align: left;
        padding: 16px;
        background: #f9fafb;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s;
        display: flex;
        align-items: flex-start;
      }

      .cw-conversation-item:hover {
        background: #f3f4f6;
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
        border-color: var(--cw-primary-color, #4563FF);
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
        border-color: var(--cw-primary-color, #4563FF);
      }

      .cw-submit-btn {
        width: 100%;
        background: var(--cw-primary-color, #4563FF);
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
        background: var(--cw-primary-color, #4563FF);
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
        background: var(--cw-primary-color, #4563FF);
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
        border-color: var(--cw-primary-color, #4563FF);
      }

      .cw-send-btn {
        width: 40px;
        height: 40px;
        background: var(--cw-primary-color, #4563FF);
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

        <!-- Attribution, pinned to the base across every tab -->
        <a class="cw-powered-by" href="https://rlayai.co" target="_blank" rel="noreferrer noopener">
          <svg viewBox="0 0 28 14" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
            <path d="M7 3.2a3.8 3.8 0 1 0 0 7.6c3.4 0 4.6-7.6 8-7.6a3.8 3.8 0 1 1 0 7.6c-1.2 0-2.1-.9-2.8-2"></path>
          </svg>
          <span>Powered by <b>rlay</b><b class="cw-powered-accent">Ai</b></span>
        </a>
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
    conversations: [],
    conversationsLoading: false,
    departments: [],
    faqLoading: true,
    faqs: [],
    articlesLoading: true,
    articles: [],
    selectedDepartment: null,
    selectedArticle: null,
    isConnected: false,
    isTyping: false,
    widgetConfig: null,
    companyInfo: null,
    expandedFaqId: null,
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

      console.log('-----WIDGET CONFIG-----', state.widgetConfig)
      // if(state.widgetConfig.is_active) {
      //   // Inject widget HTML
      injectWidget();
      // }
    } catch (error) {
      /**
       * Degrade rather than disappear.
       *
       * This fallback existed but was commented out, so any hiccup reaching the
       * API — a deploy, a blip, a CORS mistake — meant the widget rendered
       * nothing at all on the customer's live site. It now mounts with defaults
       * and picks up the real configuration on the next load.
       */
      console.warn('Chat Widget: could not load remote config, using defaults:', error.message);

      state.widgetConfig = {
        position: config.position || 'bottom-right',
        primary_color: config.primaryColor || '#4563FF',
        title: config.title || 'Support',
        welcome_message: config.welcomeMessage || 'Hi! How can we help you today?',
        placeholder_text: config.placeholder || 'Type your message...',
        auto_open: false,
        is_active: true,
      };

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

    // if (state.user) {
    //   const data = {
    //     first_name: user.firstName,
    //     last_name: user.lastName,
    //     email: user.email,
    //     company_id: config.companyId,
    //   };

    //   await startConversation(data);
    // }
  }

  console.log('Chat Widget: Initialized successfully! 🎉');

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

  // Add event listeners for FAQ accordion items
  const faqHeaders = elements.content.querySelectorAll('.cw-accordion-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', (e) => {
      e.preventDefault();
      const faqId = header.getAttribute('data-faq-id');
      toggleFaq(faqId);
    });
  });
}

// Render FAQs
function renderFAQs() {
  if (state.faqLoading) {
    return '<div class="cw-loading-spinner"></div>';
  }
  if (state.faqs.length === 0) {
    return '<div class="cw-empty-state">No FAQs Found</div>';
  }

  return state.faqs.slice(0, 15).map(faq => `
      <div class="cw-accordion-item">
        <button class="cw-accordion-header" data-faq-id="${faq.id}">
          <div class="cw-accordion-title">
            ${faq.category_name ? `<span class="cw-faq-category-badge">${escapeHtml(faq.category_name)}</span>` : ''}
            <p class="cw-faq-question">${escapeHtml(faq.question)}</p>
          </div>
          <svg class="cw-accordion-icon ${state.expandedFaqId === faq.id ? 'cw-accordion-icon-expanded' : ''}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        ${state.expandedFaqId === faq.id && faq.answer ? `
          <div class="cw-accordion-content">
            <p class="cw-faq-answer">${escapeHtml(faq.answer)}</p>
          </div>
        ` : ''}
      </div>
    `).join('');
}

// Toggle FAQ accordion
function toggleFaq(faqId) {
  state.expandedFaqId = state.expandedFaqId === faqId ? null : faqId;
  renderHomeTab();
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
  // Load conversations ONLY if not already loaded and not currently loading
  if (state.user && !state.conversationsLoading && state.conversations.length === 0) {
    loadConversations();
  }

  // Show loading state
  if (state.conversationsLoading) {
    elements.content.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
          <div style="width: 32px; height: 32px; border: 2px solid var(--cw-primary-color, #4563FF); border-top-color: transparent; border-radius: 50%; animation: cw-spin 1s linear infinite;"></div>
        </div>
      `;
    return;
  }

  // Show empty state if no conversations
  if (state.conversations.length === 0) {
    const html = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 24px;">
          <div style="width: 64px; height: 64px; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 style="font-size: 18px; font-weight: 600; color: #111827; margin: 0 0 8px 0;">No conversations yet</h3>
          <p style="color: #6b7280; text-align: center; margin: 0 0 24px 0;">Start a conversation with our team</p>
          <button class="cw-primary-btn" id="cw-start-new-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Start new conversation
          </button>
        </div>
      `;

    elements.content.innerHTML = html;

    document.getElementById('cw-start-new-btn').addEventListener('click', () => {
      if (!state.user) {
        state.messagesView = 'form';
        loadDepartments();
        renderCurrentView();
      } else {
        state.messagesView = 'departments';
        loadDepartments();
        renderCurrentView();
      }
    });
    return;
  }

  // Show conversations list
  const conversationsList = state.conversations.map(conv => `
      <button class="cw-conversation-item" data-conversation-id="${conv.id}">
        <div style="flex: 1;">
          <p style="font-size: 14px; font-weight: 500; color: #111827; margin: 0 0 4px 0;">
            ${escapeHtml(conv.last_message || 'New conversation')}
          </p>
          <span style="font-size: 12px; color: #6b7280; display: inline-block;">
            ${formatTime(conv.last_activity || conv.updated_at)}
          </span>
          ${conv.status ? `
            <span style="margin-left: 8px; font-size: 12px; padding: 2px 8px; border-radius: 4px; ${conv.status === 'OPEN' ? 'background: #d1fae5; color: #065f46;' : 'background: #f3f4f6; color: #374151;'
      }">
              ${escapeHtml(conv.status)}
            </span>
          ` : ''}
        </div>
      </button>
    `).join('');

  const html = `
      <div style="display: flex; flex-direction: column; height: 100%;">
        <div style="flex: 1; overflow-y: auto; padding: 16px;">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${conversationsList}
          </div>
        </div>
        <div style="padding: 16px; border-top: 1px solid #e5e7eb;">
          <button id="cw-start-new-btn" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: var(--cw-primary-color, #4563FF); color: white; padding: 12px 16px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Start new conversation
          </button>
        </div>
      </div>
    `;

  elements.content.innerHTML = html;

  // Add click handlers for conversations
  document.querySelectorAll('.cw-conversation-item').forEach(item => {
    item.addEventListener('click', () => {
      const conversationId = item.getAttribute('data-conversation-id');
      selectConversation(conversationId);
    });
  });

  // Add click handler for start new button
  document.getElementById('cw-start-new-btn').addEventListener('click', () => {
    if (!state.user) {
      state.messagesView = 'form';
      loadDepartments();
      renderCurrentView();
    } else {
      state.messagesView = 'departments';
      loadDepartments();
      renderCurrentView();
    }
  });
}

// Render departments
function renderDepartments() {
  const html = `
      <div class="cw-department-selection">
        <div>
          <h3 style="font-size: 20px; font-weight: bold; color: #111827; margin: 0 0 8px 0;">Choose a team (Optional)</h3>
          <p style="color: #6b7280; font-size: 14px; margin: 0;">Select the team that can best help you, or continue without selecting</p>
        </div>
        <div class="cw-department-grid">
          ${renderDepartmentCards()}
        </div>
        <div style="margin-top: 16px; text-align: center;">
          <button id="cw-skip-department-btn" class="cw-secondary-btn" style="width: 100%;">Continue without selecting</button>
        </div>
      </div>
    `;

  elements.content.innerHTML = html;

  document.querySelectorAll('[data-department-id]').forEach(card => {
    card.addEventListener('click', () => {
      state.selectedDepartment = card.dataset.departmentId;
      // Start conversation directly with selected department
      startConversation({
        first_name: state.user.firstName,
        last_name: state.user.lastName,
        email: state.user.email,
        category_id: state.selectedDepartment,
        company_id: config.companyId,
      });
    });
  });

  // Skip department selection
  const skipBtn = document.getElementById('cw-skip-department-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      state.selectedDepartment = null;
      // Start conversation without department
      startConversation({
        first_name: state.user.firstName,
        last_name: state.user.lastName,
        email: state.user.email,
        company_id: config.companyId,
      });
    });
  }
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

  // Render department options if available
  const departmentOptions = state.departments.length > 0
    ? state.departments.map(dept => `<option value="${dept.id}">${escapeHtml(dept.name)}</option>`).join('')
    : '';

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

          ${departmentOptions ? `
          <div class="cw-form-group">
            <label class="cw-form-label">How can we help? (Optional)</label>
            <select class="cw-form-input" name="department">
              <option value="">Select a department</option>
              ${departmentOptions}
            </select>
          </div>
          ` : ''}

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
  const formData = new FormData(e.target);
  const departmentValue = formData.get('department');

  const data = {
    first_name: formData.get('firstName'),
    last_name: formData.get('lastName'),
    email: formData.get('email'),
    company_id: config.companyId,
  };
  // Add category_id only if a department was selected (optional)
  if (departmentValue) {
    data.category_id = departmentValue;
  }

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
        message: message,
        user_id: state.user.id,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const result = await response.json();

    // Add AI response from backend
    if (result.data && result.data.aiMessage) {
      state.messages.push({
        id: result.data.aiMessage.id,
        role: 'ASSISTANT',
        content: result.data.aiMessage.content,
        timestamp: result.data.aiMessage.created_at,
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
  // Show article detail view if an article is selected
  if (state.selectedArticle) {
    const html = `
        <div style="display: flex; flex-direction: column; height: 100%; overflow-y: auto;">
          <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
            <button id="cw-article-back-btn" style="padding: 8px; background: none; border: none; border-radius: 8px; cursor: pointer; transition: background-color 0.2s;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4b5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div style="flex: 1;">
              <h3 style="font-weight: 600; color: #111827; margin: 0; font-size: 14px;">${escapeHtml(state.selectedArticle.title)}</h3>
              ${state.selectedArticle.category_name ? `<p style="font-size: 12px; color: #4563FF; margin: 4px 0 0 0;">${escapeHtml(state.selectedArticle.category_name)}</p>` : ''}
            </div>
          </div>
          <div style="flex: 1; overflow-y: auto; padding: 24px;">
            <div style="font-size: 14px; line-height: 1.7; color: #374151; max-width: none;">
              ${state.selectedArticle.content}
            </div>
          </div>
        </div>
      `;

    elements.content.innerHTML = html;

    // Add back button handler
    document.getElementById('cw-article-back-btn').addEventListener('click', () => {
      state.selectedArticle = null;
      renderArticlesTab();
    });

    document.getElementById('cw-article-back-btn').addEventListener('mouseenter', (e) => {
      e.target.closest('button').style.background = '#f3f4f6';
    });

    document.getElementById('cw-article-back-btn').addEventListener('mouseleave', (e) => {
      e.target.closest('button').style.background = 'none';
    });

    return;
  }

  // Show articles list
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

  // Add click handlers and hover effects to articles
  document.querySelectorAll('.cw-article-item').forEach(item => {
    item.addEventListener('click', () => {
      const articleId = item.getAttribute('data-article-id');
      const article = state.articles.find(a => a.id === articleId);
      if (article) {
        state.selectedArticle = article;
        renderArticlesTab();
      }
    });

    item.addEventListener('mouseenter', () => {
      item.style.background = '#f3f4f6';
    });

    item.addEventListener('mouseleave', () => {
      item.style.background = '#f9fafb';
    });
  });
}

// Render articles list
function renderArticles() {
  if (state.articlesLoading) {
    return '<div style="display: flex; align-items: center; justify-content: center; padding: 32px;"><div style="width: 24px; height: 24px; border: 2px solid var(--cw-primary-color, #4563FF); border-top-color: transparent; border-radius: 50%; animation: cw-spin 1s linear infinite;"></div></div>';
  }
  if (state.articles.length === 0) {
    return '<div style="text-align: center; padding: 32px;"><p style="color: #6b7280;">No articles available yet</p></div>';
  }

  return '<div style="display: flex; flex-direction: column; gap: 8px;">' +
    state.articles.slice(0, 15).map(article => `
        <button class="cw-article-item" data-article-id="${article.id}" style="width: 100%; text-align: left; padding: 16px; background: #f9fafb; border: none; border-radius: 8px; cursor: pointer; transition: background-color 0.2s;">
          <h4 style="font-weight: 500; color: #111827; font-size: 14px; margin: 0 0 8px 0;">${escapeHtml(article.title)}</h4>
          ${article.excerpt ? `<p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(stripHtml(article.excerpt))}</p>` : ''}
          <div style="display: flex; align-items: center; justify-content: space-between;">
            ${article.category_name ? `<span style="font-size: 12px; color: #4563FF;">${escapeHtml(article.category_name)}</span>` : '<span></span>'}
            <span style="font-size: 12px; color: #6b7280;">${estimateReadTime(article.content)}</span>
          </div>
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

// Load conversations from backend
async function loadConversations() {
  if (!state.user || !state.user.id) {
    console.warn('Cannot load conversations: user not logged in');
    return;
  }

  // Prevent multiple simultaneous loads
  if (state.conversationsLoading) {
    return;
  }

  try {
    state.conversationsLoading = true;
    renderMessagesList();

    const response = await fetch(`${apiBaseUrl}/conversation?user_id=${state.user.id}&company_id=${config.companyId}&limit=10`);
    if (response.ok) {
      const result = await response.json();
      state.conversations = result.data || [];
    } else {
      state.conversations = [];
    }
  } catch (error) {
    console.error('Failed to load conversations:', error);
    state.conversations = [];
  } finally {
    state.conversationsLoading = false;
    renderMessagesList();
  }
}

// Select a conversation from the list
async function selectConversation(conversationId) {
  try {
    // Set the conversation
    state.conversation = { id: conversationId };

    // Load conversation history
    const response = await fetch(`${apiBaseUrl}/conversation/${conversationId}/messages`);
    if (response.ok) {
      const result = await response.json();
      state.messages = result.data || [];
    }

    // Switch to chat view
    state.messagesView = 'chat';
    renderCurrentView();
  } catch (error) {
    console.error('Failed to load conversation history:', error);
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

// Strip HTML tags
function stripHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Format time (relative time)
function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

// Estimate read time for articles
function estimateReadTime(content) {
  const wordsPerMinute = 200;
  const plainText = stripHtml(content);
  const wordCount = plainText.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Initialize widget
init();
}) ();
