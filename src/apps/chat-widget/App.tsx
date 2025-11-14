import React from 'react';
import { ChatWidgetContainer } from './components/ChatWidgetContainer';

export const ChatWidgetApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Demo Page Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Chat Widget Demo
        </h1>
        <p className="text-gray-600 mb-4">
          This is a demo page showing how the chat widget appears on your website.
          The widget is positioned in the bottom-right corner.
        </p>
        <p className="text-gray-600 mb-4">
          Click the floating button to open the chat widget and start a conversation.
        </p>

        {/* Demo Features */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Features:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Floating chat button with bounce animation</li>
            <li>Unread message counter badge</li>
            <li>Expandable chat window</li>
            <li>AI-powered responses (demo)</li>
            <li>Typing indicators</li>
            <li>Message timestamps</li>
            <li>File attachment button</li>
            <li>Fully responsive design</li>
            <li>Customizable colors and position</li>
            <li>Easy to embed with a single script tag</li>
          </ul>
        </div>

        {/* Integration Code */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How to Integrate:
          </h2>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
              <code>{`<!-- Add this script to your website -->
<script>
  (function() {
    window.SupportHubConfig = {
      companyId: 'YOUR_COMPANY_ID',
      primaryColor: '#00D9DF',
      position: 'bottom-right'
    };
    var script = document.createElement('script');
    script.src = 'https://cdn.supporthub.ai/widget.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`}</code>
            </pre>
          </div>
        </div>

        {/* Customization */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Customization Options:
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-semibold">Option</th>
                  <th className="text-left py-2 font-semibold">Type</th>
                  <th className="text-left py-2 font-semibold">Default</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-200">
                  <td className="py-2">companyId</td>
                  <td className="py-2">string</td>
                  <td className="py-2">required</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">primaryColor</td>
                  <td className="py-2">string</td>
                  <td className="py-2">#00D9DF</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-2">position</td>
                  <td className="py-2">'bottom-right' | 'bottom-left'</td>
                  <td className="py-2">bottom-right</td>
                </tr>
                <tr>
                  <td className="py-2">companyName</td>
                  <td className="py-2">string</td>
                  <td className="py-2">SupportHub</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidgetContainer position="bottom-right" />
    </div>
  );
};