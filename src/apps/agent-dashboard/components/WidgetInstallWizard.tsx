import React, { useState } from 'react';
import {
  Check,
  Copy,
  CheckCircle,
  ChevronRight,
  Code,
  Palette,
  MessageSquare,
  Globe,
  X,
} from 'lucide-react';
import { widgetService, type WidgetConfig } from '../../../services/widget.service';
import { Button } from '../../../components/ui';

interface WidgetInstallWizardProps {
  onClose: () => void;
}

export const WidgetInstallWizard: React.FC<WidgetInstallWizardProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<Partial<WidgetConfig>>({
    position: 'bottom-right',
    primary_color: '#0891b2',
    title: 'Support Chat',
    welcome_message: 'Hi! How can we help you today?',
    placeholder_text: 'Type your message...',
    auto_open: false,
    auto_open_delay: 0,
    is_active: true,
  });
  const [installCode, setInstallCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateWidget = async () => {
    try {
      setIsCreating(true);
      setError(null);

      // Save configuration
      await widgetService.updateConfig(config);

      // Get install code
      const { code } = await widgetService.getInstallCode();
      setInstallCode(code);

      handleNext();
    } catch (err: any) {
      console.error('Failed to create widget:', err);
      setError(err.response?.data?.message || 'Failed to create widget configuration');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(installCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    setConfig({ ...config, ...updates });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Widget Installation Wizard</h2>
              <p className="text-gray-600 mt-1">
                Set up your chat widget in {totalSteps} easy steps
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      step < currentStep
                        ? 'bg-green-500 text-white'
                        : step === currentStep
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-colors ${
                        step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Appearance</span>
              <span>Messages</span>
              <span>Behavior</span>
              <span>Install</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Appearance */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Palette className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Widget Appearance</h3>
                  <p className="text-gray-600">Customize how your widget looks</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Widget Position
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'bottom-right', label: 'Bottom Right' },
                      { value: 'bottom-left', label: 'Bottom Left' },
                      { value: 'top-right', label: 'Top Right' },
                      { value: 'top-left', label: 'Top Left' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateConfig({ position: option.value as any })}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          config.position === option.value
                            ? 'border-cyan-600 bg-cyan-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="color"
                      value={config.primary_color}
                      onChange={(e) => updateConfig({ primary_color: e.target.value })}
                      className="w-20 h-12 rounded-lg border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.primary_color}
                      onChange={(e) => updateConfig({ primary_color: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="#0891b2"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Choose a color that matches your brand
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Widget Title
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => updateConfig({ title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Support Chat"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Messages */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Welcome Messages</h3>
                  <p className="text-gray-600">Set up your greeting and placeholder text</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Welcome Message
                  </label>
                  <textarea
                    value={config.welcome_message}
                    onChange={(e) => updateConfig({ welcome_message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    placeholder="Hi! How can we help you today?"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    This is the first message visitors will see
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input Placeholder
                  </label>
                  <input
                    type="text"
                    value={config.placeholder_text}
                    onChange={(e) => updateConfig({ placeholder_text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Type your message..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Shown in the message input field
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Behavior */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Widget Behavior</h3>
                  <p className="text-gray-600">Configure how the widget behaves</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="font-medium text-gray-900">Auto-open Widget</label>
                    <p className="text-sm text-gray-600 mt-1">
                      Automatically open the widget when users visit your site
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.auto_open}
                      onChange={(e) => updateConfig({ auto_open: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                  </label>
                </div>

                {config.auto_open && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto-open Delay (seconds)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={config.auto_open_delay}
                      onChange={(e) =>
                        updateConfig({ auto_open_delay: parseInt(e.target.value) || 0 })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Delay before auto-opening (0 for immediate)
                    </p>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Ready to Install!</h4>
                  <p className="text-sm text-blue-700">
                    Click "Create Widget" to save your configuration and get the installation
                    code.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Installation */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Installation Complete!</h3>
                  <p className="text-gray-600">Add this code to your website</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Installation Code
                  </label>
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{installCode}</code>
                    </pre>
                    <button
                      onClick={handleCopyCode}
                      className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm flex items-center gap-2 transition-colors"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-600" />
                    How to Install
                  </h4>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        1
                      </span>
                      <span>Copy the installation code above</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        2
                      </span>
                      <span>
                        Open your website's HTML file or template
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        3
                      </span>
                      <span>
                        Paste the code just before the closing{' '}
                        <code className="bg-white px-2 py-1 rounded text-xs">
                          &lt;/body&gt;
                        </code>{' '}
                        tag
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        4
                      </span>
                      <span>Save and deploy your changes</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                        ✓
                      </span>
                      <span className="font-medium">
                        Your chat widget is now live on your website!
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Tip:</strong> You can customize your widget settings anytime from the
                    Widget Settings page. Changes will be reflected automatically on your website.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Step {currentStep} of {totalSteps}
          </div>
          <div className="flex gap-3">
            {currentStep > 1 && currentStep < 4 && (
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
            )}
            {currentStep < 3 && (
              <Button onClick={handleNext} rightIcon={<ChevronRight className="w-4 h-4" />}>
                Next
              </Button>
            )}
            {currentStep === 3 && (
              <Button
                onClick={handleCreateWidget}
                loading={isCreating}
                leftIcon={<Check className="w-4 h-4" />}
              >
                Create Widget
              </Button>
            )}
            {currentStep === 4 && (
              <Button onClick={onClose} leftIcon={<CheckCircle className="w-4 h-4" />}>
                Done
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
