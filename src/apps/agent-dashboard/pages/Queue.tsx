import React from 'react';
import { Card, CardBody } from '../../../components/ui';

export const QueuePage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Unassigned Queue</h1>
        <p className="text-gray-600">Conversations waiting for agent assignment</p>
      </div>

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
    </div>
  );
};