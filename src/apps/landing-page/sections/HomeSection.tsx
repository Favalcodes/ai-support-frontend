import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui';
import Golden from '../../../assets/golden-bg.png'

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-primary-800 to-dark-800"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-white">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/20 backdrop-blur-sm border border-primary-400/30 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary-400 rounded-full mr-2 animate-pulse"></span>
              AI-Powered Customer Support
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Support that
              <span className="block text-primary-400">
                never sleeps
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-secondary-200 mb-8 leading-relaxed">
              Deliver instant, accurate support 24/7 with our intelligent AI assistant. 
              Seamlessly escalate to human agents when needed.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  className="shadow-glow-cyan"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  variant="secondary"
                  size="lg"
                  className="border-white/30 hover:bg-white/10"
                >
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Features List */}
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-secondary-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-400" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Right Content - Chat Preview */}
          <div className="relative">
            <img src={Golden} alt='Golden retriever and getLync' />
            {/* Floating Stats Cards */}
            {/* <div className="absolute -top-10 -left-10 bg-white rounded-xl shadow-2xl p-4 z-20 animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">2.5s</p>
                  <p className="text-xs text-gray-500">Avg Response</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 bg-white rounded-xl shadow-2xl p-4 z-20 animate-float" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                  <p className="text-xs text-gray-500">Resolved</p>
                </div>
              </div>
            </div> */}

            {/* Chat Window Mockup */}
            {/* <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-primary-500/20">
 
              <div className="bg-primary-500 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Support Assistant</h3>
                    <p className="text-white/80 text-xs">Online • Responds instantly</p>
                  </div>
                </div>
              </div>

  
              <div className="p-4 space-y-3 bg-gray-50 h-80">
              
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-xs">
                    <p className="text-sm text-gray-800">Hi! How can I help you today?</p>
                  </div>
                </div>

     
                <div className="flex justify-end">
                  <div className="bg-primary-500 rounded-lg rounded-tr-none p-3 shadow-sm max-w-xs">
                    <p className="text-sm text-white">I need help with billing</p>
                  </div>
                </div>

             
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-xs">
                    <p className="text-sm text-gray-800">I'd be happy to help with billing! Let me find the relevant information...</p>
                  </div>
                </div>

             
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            
              <div className="border-t p-3 bg-white">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent outline-none text-sm"
                    disabled
                  />
                  <button className="text-primary-600">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div> */}
          </div>

        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};