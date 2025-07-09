import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MessageCircle, X, Send, User, ChevronDown, ChevronUp, Minimize2, Maximize2 } from 'lucide-react';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: any;
  read?: boolean;
  userName?: string;
}

const LiveChat: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Initialize chat when user logs in
  useEffect(() => {
    if (user) {
      initializeChat();
    }
  }, [user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for messages when chatId is available
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(newMessages);
      
      // Count unread messages when chat is not open
      if (!isOpen) {
        const unreadCount = newMessages.filter(msg => msg.sender === 'agent' && !msg.read).length;
        setUnreadCount(unreadCount);
      } else {
        setUnreadCount(0);
      }
    });

    return () => unsubscribe();
  }, [chatId, isOpen]);

  const initializeChat = async () => {
    if (!user) return;

    try {
      // Check if user already has an active chat
      const chatsQuery = query(
        collection(db, 'chats'),
        where('userId', '==', user.uid),
        where('status', '==', 'active')
      );

      const snapshot = await getDocs(chatsQuery);
      
      if (!snapshot.empty) {
        // Use existing chat
        setChatId(snapshot.docs[0].id);
      } else {
        // Create new chat
        const chatRef = await addDoc(collection(db, 'chats'), {
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName || 'User',
          status: 'active',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          userPlan: user.plan
        });
        
        setChatId(chatRef.id);
        
        // Add welcome message
        await addDoc(collection(db, 'chats', chatRef.id, 'messages'), {
          text: `Hello ${user.displayName || 'there'}! Welcome to AI Trader support. How can we help you today?`,
          sender: 'agent',
          timestamp: serverTimestamp(),
          read: false,
          agentId: 'system',
          agentName: 'AI Trader Support'
        });
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !chatId || !user) return;

    try {
      setLoading(true);
      
      // Add message to Firestore
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: newMessage,
        sender: 'user',
        timestamp: serverTimestamp(),
        read: true,
        userName: user.displayName || user.email
      });
      
      // Clear input
      setNewMessage('');
      
      // Simulate agent typing
      setAgentTyping(true);
      
      // Simulate agent response after a delay
      setTimeout(async () => {
        // Add automated response
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
          text: getAutomatedResponse(newMessage),
          sender: 'agent',
          timestamp: serverTimestamp(),
          read: isOpen,
          agentId: 'system',
          agentName: 'AI Trader Support'
        });
        
        setAgentTyping(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAutomatedResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! How can I help you with AI Trader today?";
    }
    
    if (lowerMessage.includes('plan') || lowerMessage.includes('subscription') || lowerMessage.includes('pricing')) {
      return "We offer three plans: Free (1 signal/day), Pro ($29.99/month for 5 signals/day), and Elite ($99/month for 15 signals/day). Would you like more details about any specific plan?";
    }
    
    if (lowerMessage.includes('payment') || lowerMessage.includes('paypal')) {
      return "We accept payments through PayPal, which supports credit cards, debit cards, and direct bank transfers. All transactions are secure and protected by PayPal's buyer protection.";
    }
    
    if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
      return "You can cancel your subscription anytime from your account settings. We offer a 30-day money-back guarantee if you're not satisfied with our service. Would you like me to guide you through the cancellation process?";
    }
    
    if (lowerMessage.includes('signal') || lowerMessage.includes('accuracy') || lowerMessage.includes('success')) {
      return "Our AI-generated signals have shown an average accuracy rate of 87% based on historical performance. However, please remember that past performance doesn't guarantee future results. We recommend using proper risk management with all trading decisions.";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! You can ask me about our plans, features, payment options, or technical issues. For more specialized assistance, our support team is available via email at support@aitrader.com.";
    }
    
    return "Thank you for your message. Our team will review it and get back to you soon. Is there anything else I can help you with in the meantime?";
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all flex items-center justify-center"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 flex flex-col transition-all overflow-hidden">
          {/* Chat Header */}
          <div className="bg-green-600 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">AI Trader Support</h3>
                <p className="text-green-100 text-xs">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={toggleMinimize} className="text-white hover:text-green-200">
                {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Chat Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto max-h-96 bg-gray-800">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <div className="text-sm">{message.text}</div>
                        <div className="text-xs mt-1 opacity-70 text-right">
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {agentTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-700 text-white rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-gray-900 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    disabled={loading || !newMessage.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default LiveChat;