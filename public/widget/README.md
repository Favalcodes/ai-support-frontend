# AI Support Chat Widget

A lightweight, embeddable chat widget for providing AI-powered customer support on any website.

## Features

- **Zero Dependencies**: Pure vanilla JavaScript, no external libraries required
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Conversation Persistence**: Maintains conversation state across page reloads using localStorage
- **Real-time AI Responses**: Connects to your AI support backend
- **Customizable Styling**: Configure colors, position, and messaging
- **Typing Indicators**: Visual feedback during AI response generation
- **Minimize/Maximize**: Users can minimize the widget while browsing
- **User Information Collection**: Captures customer details before starting conversation

## Quick Start

### 1. Basic Installation

Add this script tag to your HTML file, just before the closing `</body>` tag:

```html
<script
  src="https://your-domain.com/widget/chat-widget.js"
  data-company-id="your-company-id"
  data-api-url="https://your-api.com/api/v1"
></script>
```

### 2. Required Configuration

The only **required** attribute is:

- `data-company-id`: Your unique company identifier

### 3. Optional Configuration

Customize the widget with these optional attributes:

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-api-url` | string | `http://localhost:3000/api/v1` | Your API endpoint |
| `data-position` | string | `bottom-right` | Widget position: `bottom-right`, `bottom-left`, `top-right`, `top-left` |
| `data-primary-color` | string | `#4563FF` | Primary color (hex code) |
| `data-title` | string | `Support Chat` | Widget header title |
| `data-welcome-message` | string | `Hi! How can we help you today?` | Initial greeting |
| `data-placeholder` | string | `Type your message...` | Input placeholder text |
| `data-category-id` | string | `null` | Knowledge base category ID |
| `data-auto-open` | boolean | `false` | Auto-open widget on page load |

## Examples

### Basic Example

```html
<script
  src="https://cdn.yourdomain.com/widget/chat-widget.js"
  data-company-id="comp_abc123"
  data-api-url="https://api.yourdomain.com/api/v1"
></script>
```

### Fully Customized Example

```html
<script
  src="https://cdn.yourdomain.com/widget/chat-widget.js"
  data-company-id="comp_abc123"
  data-api-url="https://api.yourdomain.com/api/v1"
  data-position="bottom-left"
  data-primary-color="#7c3aed"
  data-title="Help Center"
  data-welcome-message="Welcome to our support! How can I assist you today?"
  data-placeholder="Ask us anything..."
  data-category-id="cat_general_support"
  data-auto-open="true"
></script>
```

### Different Positions

```html
<!-- Bottom Right (default) -->
<script src="..." data-position="bottom-right"></script>

<!-- Bottom Left -->
<script src="..." data-position="bottom-left"></script>

<!-- Top Right -->
<script src="..." data-position="top-right"></script>

<!-- Top Left -->
<script src="..." data-position="top-left"></script>
```

## Color Customization

Use any hex color code to match your brand:

```html
<!-- Cyan (default) -->
<script src="..." data-primary-color="#4563FF"></script>

<!-- Purple -->
<script src="..." data-primary-color="#7c3aed"></script>

<!-- Green -->
<script src="..." data-primary-color="#059669"></script>

<!-- Red -->
<script src="..." data-primary-color="#dc2626"></script>
```

## How It Works

### 1. User Visits Your Website
The widget appears as a floating button in the configured position.

### 2. User Opens Chat
When clicked, the widget expands and prompts for:
- First Name
- Last Name
- Email Address

### 3. Conversation Starts
After submitting details, a new conversation is created via your API, and the user can start chatting.

### 4. Conversation Persistence
The widget stores the conversation ID and user ID in localStorage, so returning users can continue their conversation.

### 5. Real-time Responses
Messages are sent to your AI backend, and responses are displayed with typing indicators.

## API Requirements

Your backend API must provide these endpoints:

### 1. Start Conversation
```
POST /conversation
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "company_id": "comp_abc123",
  "category_id": "cat_support" // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conv_xyz789"
    },
    "user": {
      "id": "user_456"
    }
  }
}
```

### 2. Send Message
```
POST /conversation/{conversationId}/messages
```

**Request Body:**
```json
{
  "message": "I need help with my account"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "I'd be happy to help you with your account. What specific issue are you experiencing?"
  }
}
```

### 3. Get Conversation Messages
```
GET /conversation/{conversationId}/messages
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "msg_1",
      "message": "I need help",
      "role": "USER",
      "created_at": "2025-01-01T10:00:00Z"
    },
    {
      "id": "msg_2",
      "message": "How can I help you?",
      "role": "AI",
      "created_at": "2025-01-01T10:00:05Z"
    }
  ]
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Considerations

- All API requests are made over HTTPS in production
- User data is validated on the backend
- Conversation IDs are used for authorization
- XSS protection through HTML escaping

## Troubleshooting

### Widget Doesn't Appear

1. Check browser console for errors
2. Verify `data-company-id` is set correctly
3. Ensure script is loaded (check Network tab)
4. Check for CSS conflicts with your website

### Messages Don't Send

1. Verify `data-api-url` points to correct endpoint
2. Check API is responding (test with curl/Postman)
3. Check browser console for network errors
4. Verify CORS is configured on your API

### Styling Issues

1. Widget uses high z-index (999999) to appear above content
2. All styles are scoped with `.ai-support-widget` class
3. Check for CSS conflicts with `!important` rules

## Performance

- **Initial Load**: ~15KB uncompressed (~5KB gzipped)
- **Runtime**: Minimal memory footprint
- **Network**: Only API calls for messages
- **No External Dependencies**: Pure vanilla JavaScript

## CDN Hosting

For best performance, host the widget file on a CDN:

1. Upload `chat-widget.js` to your CDN
2. Enable gzip compression
3. Set cache headers (e.g., `Cache-Control: public, max-age=31536000`)
4. Use versioned URLs for cache busting

Example:
```html
<script src="https://cdn.yourdomain.com/widget/chat-widget.v1.0.0.js"></script>
```

## License

Proprietary - All rights reserved

## Support

For questions or issues, contact: support@yourdomain.com
