import React, { useState } from 'react';
import { Mail, Lock, Search, Send } from 'lucide-react';
import {
  Button,
  Input,
  Textarea,
  Avatar,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Modal,
  ModalFooter,
  Spinner,
} from './components/ui';

export const ComponentDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-navy-900 mb-2">
            UI Component Library
          </h1>
          <p className="text-gray-600">AI Support Platform Design System</p>
        </div>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Buttons</h2>
          <Card>
            <CardBody>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="danger">Danger Button</Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" size="sm">
                    Small
                  </Button>
                  <Button variant="primary" size="md">
                    Medium
                  </Button>
                  <Button variant="primary" size="lg">
                    Large
                  </Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" leftIcon={<Mail size={16} />}>
                    With Left Icon
                  </Button>
                  <Button variant="primary" rightIcon={<Send size={16} />}>
                    With Right Icon
                  </Button>
                  <Button variant="primary" loading>
                    Loading
                  </Button>
                  <Button variant="primary" disabled>
                    Disabled
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Inputs</h2>
          <Card>
            <CardBody>
              <div className="space-y-4 max-w-md">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  leftIcon={<Mail size={16} />}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  leftIcon={<Lock size={16} />}
                  required
                />
                <Input
                  label="Search"
                  placeholder="Search..."
                  leftIcon={<Search size={16} />}
                  helperText="Search for anything"
                />
                <Input
                  label="Error Example"
                  placeholder="This has an error"
                  error="This field is required"
                />
                <Textarea
                  label="Message"
                  placeholder="Type your message..."
                  rows={4}
                  helperText="Max 500 characters"
                />
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Avatars */}
        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Avatars</h2>
          <Card>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar name="John Doe" size="xs" />
                  <Avatar name="Sarah Mitchell" size="sm" />
                  <Avatar name="Mike Johnson" size="md" />
                  <Avatar name="Emily Rodriguez" size="lg" />
                  <Avatar name="Alex Chen" size="xl" />
                </div>
                <div className="flex items-center gap-4">
                  <Avatar
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                    alt="John"
                    size="md"
                  />
                  <Avatar
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                    alt="Sarah"
                    size="md"
                  />
                  <Avatar
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
                    alt="Mike"
                    size="md"
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Badges</h2>
          <Card>
            <CardBody>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="success" size="sm">
                    Small
                  </Badge>
                  <Badge variant="success" size="md">
                    Medium
                  </Badge>
                  <Badge variant="success" size="lg">
                    Large
                  </Badge>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Cards</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Basic Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600">
                  This is a basic card with header and body.
                </p>
              </CardBody>
            </Card>

            <Card hoverable>
              <CardHeader>
                <h3 className="font-semibold text-lg">Hoverable Card</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600">
                  This card has a hover effect. Try hovering over it!
                </p>
              </CardBody>
              <CardFooter>
                <Button variant="primary" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Modal */}
        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Modal</h2>
          <Card>
            <CardBody>
              <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                Open Modal
              </Button>
            </CardBody>
          </Card>
        </section>

        {/* Spinner */}
        <section>
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Spinners</h2>
          <Card>
            <CardBody>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <Spinner size="sm" />
                  <p className="text-xs text-gray-500 mt-2">Small</p>
                </div>
                <div className="text-center">
                  <Spinner size="md" />
                  <p className="text-xs text-gray-500 mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <Spinner size="lg" />
                  <p className="text-xs text-gray-500 mt-2">Large</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is a modal dialog. You can put any content here.
          </p>
          <Input label="Name" placeholder="Enter your name" />
          <Textarea label="Description" placeholder="Enter description" rows={3} />
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(false)}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};