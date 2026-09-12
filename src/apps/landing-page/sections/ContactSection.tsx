import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const SUPPORT_EMAIL = 'support@rlayai.co';

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+234 800 000 0000',
    href: 'tel:+2348000000000',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: 'Lagos, Nigeria',
    href: null,
  },
];

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Opens the visitor's mail client with the message composed.
   *
   * There is no contact endpoint and no email service behind this form. It
   * previously ran a setTimeout and then showed "message sent", which meant
   * every enquiry was silently discarded while telling the sender otherwise.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `rlayAi enquiry from ${formData.name}`;
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      formData.company ? `Company: ${formData.company}` : null,
      '',
      formData.message,
    ]
      .filter((line) => line !== null)
      .join('\n');

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const fieldClass =
    'w-full px-4 py-3 rounded-xl bg-white border border-primary-100 text-dark-500 placeholder:text-dark-300 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all';

  return (
    <section id="contact" className="relative bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 sm:gap-12 lg:gap-16 items-start">
          {/* Pitch */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-ink-500 mb-4">
              Contact
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter text-dark-500 mb-5">
              Talk to a person
            </h2>
            <p className="text-base sm:text-lg text-dark-400 leading-relaxed mb-8 sm:mb-10">
              Questions about routing, data handling or what it takes to migrate? Send a
              note and we will get back to you.
            </p>

            <ul className="space-y-4">
              {contactInfo.map((info) => {
                const Icon = info.icon;
                const content = (
                  <>
                    <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 shrink-0">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-dark-300">
                        {info.label}
                      </span>
                      <span className="block text-dark-500 font-medium">{info.value}</span>
                    </span>
                  </>
                );

                return (
                  <li key={info.label}>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="flex items-center gap-4 group hover:opacity-80 transition-opacity"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Form */}
          <div className="rounded-2xl sm:rounded-3xl bg-primary-50 border border-primary-100 p-5 sm:p-7 lg:p-9">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-dark-500 mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-dark-500 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@company.com"
                    required
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-dark-500 mb-2">
                  Company <span className="font-normal text-dark-300">(optional)</span>
                </label>
                <input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-dark-500 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you are trying to solve..."
                  required
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <button
                type="submit"
                className="group flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all"
              >
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                Send message
              </button>

              <p className="text-xs text-dark-300 text-center">
                Opens in your mail app, addressed to {SUPPORT_EMAIL}.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
