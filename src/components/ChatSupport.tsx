import React, { useState } from 'react';
import { Mail, MessageCircle, Phone } from 'lucide-react';

interface ChatSupportProps {
  onEmailSupport: () => void;
  onStartChat: () => void;
  onCallSupport: () => void;
}

const ChatSupport: React.FC<ChatSupportProps> = ({
  onEmailSupport,
  onStartChat,
  onCallSupport
}) => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Get in Touch
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions or need support? Our team is here to help you succeed in your trading journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Email Support */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
            <div className="bg-blue-500/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Email Support</h3>
            <p className="text-gray-300 mb-6">
              Get help via email with detailed responses
            </p>
            <button
              onClick={onEmailSupport}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-all"
            >
              Send Email
            </button>
            <p className="text-gray-400 text-sm mt-4">support@aitrader.com</p>
          </div>
          
          {/* Live Chat */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
            <div className="bg-green-500/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Live Chat</h3>
            <p className="text-gray-300 mb-6">
              Chat with our support team in real-time
            </p>
            <button
              onClick={onStartChat}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold transition-all"
            >
              Start Chat
            </button>
            <p className="text-gray-400 text-sm mt-4">Available 24/7</p>
          </div>
          
          {/* Phone Support */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
            <div className="bg-purple-500/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Phone Support</h3>
            <p className="text-gray-300 mb-6">
              Speak directly with our experts
            </p>
            <button
              onClick={onCallSupport}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all"
            >
              Call Now
            </button>
            <p className="text-gray-400 text-sm mt-4">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;