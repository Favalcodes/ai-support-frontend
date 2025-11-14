import React, { useState } from 'react';
import { Mail, Calendar, Building, Star } from 'lucide-react';
import { Conversation } from '../../../types/conversation.types';
import { Avatar, Badge, Button, Textarea } from '../../../components/ui';
import { formatDate } from '../../../utils/formatters';

interface CustomerInfoPanelProps {
  conversation: Conversation;
}

export const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({
  conversation,
}) => {
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    // TODO: Call API to save notes
    setTimeout(() => {
      setIsSavingNotes(false);
      setNotes('');
    }, 1000);
  };

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
          <div className="bg-gradient-to-br from-blush-50 to-sky-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-xs text-gray-600">Total Chats</p>
          </div>
          <div className="bg-gradient-to-br from-blush-50 to-sky-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">4.8</p>
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
                <span className="text-gray-600">Acme Corporation</span>
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

          {/* Recent History */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Recent History
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    Password Reset
                  </span>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
                <p className="text-xs text-gray-600">Resolved by Mike Chen</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    Feature Request
                  </span>
                  <span className="text-xs text-gray-500">1 week ago</span>
                </div>
                <p className="text-xs text-gray-600">Resolved by You</p>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Internal Notes
            </h4>
            <Textarea
              placeholder="Add private notes about this customer..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none text-sm"
            />
            <Button
              onClick={handleSaveNotes}
              loading={isSavingNotes}
              disabled={!notes.trim() || isSavingNotes}
              variant="secondary"
              size="sm"
              className="w-full mt-2"
            >
              Save Note
            </Button>
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