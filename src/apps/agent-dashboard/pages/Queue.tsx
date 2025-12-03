import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, Button } from '../../../components/ui';
import { conversationService } from '../../../services/conversation.service';
import { userService } from '../../../services/user.service';
import { useAuthStore } from '../../../stores/authStore';
import type { Conversation } from '../../../types/conversation.types';
import type { User } from '../../../types/user.types';

export const QueuePage: React.FC = () => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user?.company_id) return;

    try {
      setLoading(true);
      setError(null);

      const [unassignedConversations, companyAgents] = await Promise.all([
        conversationService.getUnassignedConversations(user.company_id),
        userService.getCompanyAgents(user.company_id),
      ]);

      setConversations(unassignedConversations);
      setAgents(companyAgents);
    } catch (err) {
      console.error('Failed to load queue data:', err);
      setError('Failed to load queue data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.company_id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAssign = async (conversationId: string) => {
    const agentId = selectedAgent[conversationId];
    if (!agentId) {
      return;
    }

    try {
      setAssigningId(conversationId);
      setError(null);

      await conversationService.assignConversation(conversationId, agentId);

      // Remove from queue after successful assignment
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));

      // Clear selected agent for this conversation
      setSelectedAgent((prev) => {
        const updated = { ...prev };
        delete updated[conversationId];
        return updated;
      });
    } catch (err) {
      console.error('Failed to assign conversation:', err);
      setError('Failed to assign conversation. Please try again.');
    } finally {
      setAssigningId(null);
    }
  };

  const formatTimestamp = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Unassigned Queue</h1>
          <p className="text-gray-600">Conversations waiting for agent assignment</p>
        </div>
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading queue...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unassigned Queue</h1>
          <p className="text-gray-600">Conversations waiting for agent assignment</p>
        </div>
        <Button onClick={loadData} variant="secondary">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {conversations.length === 0 ? (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-sky-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No unassigned conversations
              </h3>
              <p className="text-gray-500">
                All conversations are currently assigned to agents
              </p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <Card key={conversation.id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                        <span className="text-sky-600 font-semibold">
                          {conversation.user?.first_name?.charAt(0).toUpperCase() ||
                           conversation.user?.email?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {conversation.user?.first_name && conversation.user?.last_name
                            ? `${conversation.user.first_name} ${conversation.user.last_name}`
                            : conversation.user?.email || 'Anonymous User'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatTimestamp(conversation.created_at)}
                        </p>
                      </div>
                    </div>

                    {conversation.category && (
                      <div className="mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {conversation.category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex items-center gap-2">
                    <select
                      value={selectedAgent[conversation.id] || ''}
                      onChange={(e) =>
                        setSelectedAgent((prev) => ({
                          ...prev,
                          [conversation.id]: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      disabled={assigningId === conversation.id}
                    >
                      <option value="">Select agent</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.first_name} {agent.last_name}
                        </option>
                      ))}
                    </select>

                    <Button
                      onClick={() => handleAssign(conversation.id)}
                      disabled={
                        !selectedAgent[conversation.id] ||
                        assigningId === conversation.id
                      }
                      loading={assigningId === conversation.id}
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};