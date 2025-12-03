import React, { useState, useEffect } from 'react';
import {
  Settings,
  Palette,
  MessageSquare,
  Globe,
  Code,
  Save,
  Eye,
  Copy,
  CheckCircle,
} from 'lucide-react';
import { widgetService, type WidgetConfig } from '../../../services/widget.service';
import { Button, Input, Card, CardBody, Spinner, Badge } from '../../../components/ui';

export const WidgetSettingsPage: React.FC = () => {
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [installCode, setInstallCode] = useState<string>('');
  const [showInstallCode, setShowInstallCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'appearance' | 'messages' | 'behavior' | 'install'>(
    'appearance'
  );

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const widgetConfig = await widgetService.getConfig();
      setConfig(widgetConfig);
    } catch (err: any) {
      console.error('Failed to load widget config:', err);
      setError('Failed to load widget configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    try {
      setIsSaving(true);
      setError(null);

      await widgetService.updateConfig({
        position: config.position,
        primary_color: config.primary_color,
        title: config.title,
        welcome_message: config.welcome_message,
        placeholder_text: config.placeholder_text,
        auto_open: config.auto_open,
        auto_open_delay: config.auto_open_delay,
        is_active: config.is_active,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to save widget config:', err);
      setError(err.response?.data?.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGetInstallCode = async () => {
    try {
      const { code } = await widgetService.getInstallCode();
      setInstallCode(code);
      setShowInstallCode(true);
      setActiveTab('install');
    } catch (err: any) {
      console.error('Failed to get install code:', err);
      setError('Failed to generate installation code');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(installCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    if (config) {
      setConfig({ ...config, ...updates });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Failed to load widget configuration</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chat Widget Settings</h1>
              <p className="text-gray-600 mt-1">
                Customize and configure your embeddable chat widget
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleGetInstallCode}
                variant="secondary"
                leftIcon={<Code className="w-4 h-4" />}
              >
                Get Install Code
              </Button>
              <Button
                onClick={handleSave}
                loading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Widget Status:</span>
            <Badge variant={config.is_active ? 'success' : 'default'}>
              {config.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Success/Error Messages */}
        {saveSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Configuration saved successfully!
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Panel */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('appearance')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'appearance'
                    ? 'text-cyan-600 border-b-2 border-cyan-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Palette className="w-4 h-4 inline mr-2" />
                Appearance
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'messages'
                    ? 'text-cyan-600 border-b-2 border-cyan-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Messages
              </button>
              <button
                onClick={() => setActiveTab('behavior')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'behavior'
                    ? 'text-cyan-600 border-b-2 border-cyan-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Behavior
              </button>
              <button
                onClick={() => setActiveTab('install')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === 'install'
                    ? 'text-cyan-600 border-b-2 border-cyan-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Code className="w-4 h-4 inline mr-2" />
                Install
              </button>
            </div>

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <Card>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Widget Appearance
                      </h3>

                      <div className="space-y-4">
                        {/* Position */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Position
                          </label>
                          <select
                            value={config.position}
                            onChange={(e) =>
                              updateConfig({
                                position: e.target.value as WidgetConfig['position'],
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          >
                            <option value="bottom-right">Bottom Right</option>
                            <option value="bottom-left">Bottom Left</option>
                            <option value="top-right">Top Right</option>
                            <option value="top-left">Top Left</option>
                          </select>
                        </div>

                        {/* Primary Color */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Primary Color
                          </label>
                          <div className="flex gap-3">
                            <Input
                              type="color"
                              value={config.primary_color}
                              onChange={(e) =>
                                updateConfig({ primary_color: e.target.value })
                              }
                              className="w-20 h-10"
                            />
                            <Input
                              type="text"
                              value={config.primary_color}
                              onChange={(e) =>
                                updateConfig({ primary_color: e.target.value })
                              }
                              placeholder="#0891b2"
                              className="flex-1"
                            />
                          </div>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Widget Title
                          </label>
                          <Input
                            value={config.title}
                            onChange={(e) => updateConfig({ title: e.target.value })}
                            placeholder="Support Chat"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <Card>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Widget Messages
                      </h3>

                      <div className="space-y-4">
                        {/* Welcome Message */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Welcome Message
                          </label>
                          <textarea
                            value={config.welcome_message}
                            onChange={(e) =>
                              updateConfig({ welcome_message: e.target.value })
                            }
                            placeholder="Hi! How can we help you today?"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                          />
                        </div>

                        {/* Placeholder Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Input Placeholder
                          </label>
                          <Input
                            value={config.placeholder_text}
                            onChange={(e) =>
                              updateConfig({ placeholder_text: e.target.value })
                            }
                            placeholder="Type your message..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Behavior Tab */}
            {activeTab === 'behavior' && (
              <Card>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Widget Behavior
                      </h3>

                      <div className="space-y-4">
                        {/* Auto Open */}
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

                        {/* Auto Open Delay */}
                        {config.auto_open && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Auto-open Delay (seconds)
                            </label>
                            <Input
                              type="number"
                              min="0"
                              max="60"
                              value={config.auto_open_delay}
                              onChange={(e) =>
                                updateConfig({ auto_open_delay: parseInt(e.target.value) || 0 })
                              }
                            />
                          </div>
                        )}

                        {/* Active Status */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <label className="font-medium text-gray-900">Widget Active</label>
                            <p className="text-sm text-gray-600 mt-1">
                              Enable or disable the widget on your website
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={config.is_active}
                              onChange={(e) => updateConfig({ is_active: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Install Tab */}
            {activeTab === 'install' && (
              <Card>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Installation Code
                      </h3>

                      {!showInstallCode ? (
                        <div className="text-center py-12">
                          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">
                            Generate installation code to embed the widget on your website
                          </p>
                          <Button onClick={handleGetInstallCode} leftIcon={<Code className="w-4 h-4" />}>
                            Generate Install Code
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">
                              Copy and paste this code before the closing{' '}
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                &lt;/body&gt;
                              </code>{' '}
                              tag in your HTML:
                            </p>
                          </div>

                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{installCode}</code>
                            </pre>
                            <button
                              onClick={handleCopyCode}
                              className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm flex items-center gap-2"
                            >
                              {copied ? (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>

                          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-700">
                              After adding the code to your website, the chat widget will appear in
                              the configured position. Make sure to save your configuration changes
                              before installing.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardBody>
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  </div>

                  <div className="bg-gray-100 rounded-lg p-4 relative h-96">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500 text-sm text-center">
                        Widget preview
                        <br />
                        Position: {config.position}
                      </p>
                    </div>

                    {/* Simulated Widget Button */}
                    <div
                      className={`absolute ${
                        config.position === 'bottom-right'
                          ? 'bottom-4 right-4'
                          : config.position === 'bottom-left'
                          ? 'bottom-4 left-4'
                          : config.position === 'top-right'
                          ? 'top-4 right-4'
                          : 'top-4 left-4'
                      }`}
                    >
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                        style={{ backgroundColor: config.primary_color }}
                      >
                        <MessageSquare className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium text-gray-900">{config.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Color:</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: config.primary_color }}
                        />
                        <span className="font-medium text-gray-900">{config.primary_color}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Auto-open:</span>
                      <span className="font-medium text-gray-900">
                        {config.auto_open ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
