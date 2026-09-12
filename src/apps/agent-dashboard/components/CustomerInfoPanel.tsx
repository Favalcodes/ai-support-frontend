import React, { useState, useEffect } from 'react';
import { Mail, Calendar, Building, Save, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Conversation } from '../../../types/conversation.types';
import { Avatar, Badge, Button, Textarea } from '../../../components/ui';
import { formatDate } from '../../../utils/formatters';
import { conversationService } from '../../../services/conversation.service';

interface CustomerInfoPanelProps {
  conversation: Conversation;
}

export const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({
  conversation,
}) => {
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load notes when conversation changes
  useEffect(() => {
    const loadNotes = async () => {
      if (!conversation.id) return;
      
      try {
        setIsLoadingNotes(true);
        const existingNotes = await conversationService.getConversationNotes(conversation.id);
        setNotes(existingNotes);
      } catch (error) {
        console.error('Failed to load notes:', error);
      } finally {
        setIsLoadingNotes(false);
      }
    };

    loadNotes();
  }, [conversation.id]);

  const handleSaveNotes = async () => {
    if (!notes.trim() || !conversation.id) return;

    try {
      setIsSavingNotes(true);
      await conversationService.saveConversationNotes(conversation.id, notes);
      setSaveSuccess(true);
      toast.success('Notes saved successfully');

      // Hide success message after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to save notes:', error);
      toast.error('Failed to save notes. Please try again.');
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Auto-save notes after 2 seconds of inactivity
  useEffect(() => {
    if (!notes.trim() || isLoadingNotes) return;

    const timer = setTimeout(() => {
      handleSaveNotes();
    }, 2000);

    return () => clearTimeout(timer);
  }, [notes]);

  const userName = `${conversation.user?.first_name} ${conversation.user?.last_name}`;

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6">
        {/* Customer Profile */}
        <div className="text-center mb-6">
          <Avatar name={userName} size="xl" className="mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">{userName}</h3>
          <p className="text-sm text-gray-600">{conversation.user?.email}</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-primary-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">-</p>
            <p className="text-xs text-gray-600">Total Chats</p>
          </div>
          <div className="bg-primary-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">-</p>
            <p className="text-xs text-gray-600">Avg Rating</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 truncate">
                  {conversation.user?.email}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">
                  {conversation.company?.name || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">
                  Customer since {formatDate(conversation.created_at, 'MMM yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Category */}
          {conversation.category && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Category
              </h4>
              <Badge variant="info">{conversation.category.name}</Badge>
            </div>
          )}

          {/* Status */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Status
            </h4>
            <div className="flex gap-2">
              <Badge
                variant={
                  conversation.status === 'OPEN'
                    ? 'success'
                    : conversation.status === 'RESOLVED'
                    ? 'default'
                    : 'default'
                }
              >
                {conversation.status}
              </Badge>
              {conversation.needs_human_agent && (
                <Badge variant="warning">Escalated</Badge>
              )}
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-gray-500 uppercase">
                Internal Notes
              </h4>
              {saveSuccess && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span className="text-xs">Saved</span>
                </div>
              )}
            </div>
            <Textarea
              placeholder="Add private notes about this customer... (auto-saves)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoadingNotes}
              rows={4}
              className="resize-none text-sm"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {isSavingNotes ? 'Saving...' : 'Auto-save enabled'}
              </span>
              <Button
                onClick={handleSaveNotes}
                loading={isSavingNotes}
                disabled={!notes.trim() || isSavingNotes || isLoadingNotes}
                variant="secondary"
                size="sm"
              >
                <Save className="w-3 h-3 mr-1" />
                Save Now
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200">
            <Button variant="ghost" size="sm" className="w-full mb-2">
              View Full History
            </Button>
            <Button variant="ghost" size="sm" className="w-full">
              Export Conversation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
