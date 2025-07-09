import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  getDocs,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  MessageCircle, 
  Users, 
  Send, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  User,
  Search,
  Filter,
  ChevronDown,
  X
} from 'lucide-react';

interface Chat {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: 'active' | 'closed';
  createdAt: any;
  updatedAt: any;
  userPlan: string;
  lastMessage?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: any;
  read: boolean;
  userName?: string;
  agentName?: string;
}

const ChatAdmin: React.FC = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.isAdmin) {
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);
      markChatAsRead(selectedChat);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = () => {
    const q = query(
      collection(db, 'chats'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatData: Chat[] = [];
      
      for (const doc of snapshot.docs) {
        const chat = { id: doc.id, ...doc.data() } as Chat;
        
        // Get unread count
        const messagesQuery = query(
          collection(db, 'chats', doc.id, 'messages'),
          where('sender', '==', 'user'),
          where('read', '==', false)
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        chat.unreadCount = messagesSnapshot.size;
        
        // Get last message
        const lastMessageQuery = query(
          collection(db, 'chats', doc.id, 'messages'),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        
        const lastMessageSnapshot = await getDocs(lastMessageQuery);
        if (!lastMessageSnapshot.empty) {
          chat.lastMessage = lastMessageSnapshot.docs[0].data().text;
        }
        
        chatData.push(chat);
      }
      
      setChats(chatData);
      setLoading(false);
    });

    return unsubscribe;
  };

  const loadMessages = (chatId: string) => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      setMessages(messageData);
    });

    return unsubscribe;
  };

  const markChatAsRead = async (chatId: string) => {
    try {
      // Get all unread user messages
      const q = query(
        collection(db, 'chats', chatId, 'messages'),
        where('sender', '==', 'user'),
        where('read', '==', false)
      );
      
      const snapshot = await getDocs(q);
      
      // Mark all as read
      snapshot.docs.forEach(async (doc) => {
        await updateDoc(doc.ref, { read: true });
      });
      
      // Update chat's unread count in the UI
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      setSendingMessage(true);
      
      await addDoc(collection(db, 'chats', selectedChat, 'messages'), {
        text: newMessage,
        sender: 'agent',
        timestamp: serverTimestamp(),
        read: true,
        agentId: user?.uid,
        agentName: user?.displayName || 'Support Agent'
      });
      
      // Update chat's last update time
      await updateDoc(doc(db, 'chats', selectedChat), {
        updatedAt: serverTimestamp()
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCloseChat = async (chatId: string) => {
    try {
      await updateDoc(doc(db, 'chats', chatId), {
        status: 'closed',
        closedAt: serverTimestamp(),
        closedBy: user?.uid
      });
      
      // If this was the selected chat, clear selection
      if (selectedChat === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error closing chat:', error);
    }
  };

  const handleReopenChat = async (chatId: string) => {
    try {
      await updateDoc(doc(db, 'chats', chatId), {
        status: 'active',
        reopenedAt: serverTimestamp(),
        reopenedBy: user?.uid
      });
    } catch (error) {
      console.error('Error reopening chat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFilteredChats = () => {
    return chats.filter(chat => {
      // Status filter
      if (statusFilter !== 'all' && chat.status !== statusFilter) {
        return false;
      }
      
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          chat.userEmail?.toLowerCase().includes(searchLower) ||
          chat.userName?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'elite':
        return <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">Elite</span>;
      case 'pro':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">Pro</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">Free</span>;
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
        <p className="text-red-400">Admin access required</p>
      </div>
    );
  }

  const filteredChats = getFilteredChats();

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
      <div className="flex flex-col md:flex-row h-[600px]">
        {/* Chat List */}
        <div className="w-full md:w-1/3 border-r border-white/20">
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-400" />
                <span>Support Chats</span>
              </h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
            
            {showFilters && (
              <div className="space-y-3 mb-3 p-3 bg-black/20 rounded-lg">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search users..."
                      className="w-full pl-10 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                  >
                    <option value="all" className="bg-gray-800">All Chats</option>
                    <option value="active" className="bg-gray-800">Active Chats</option>
                    <option value="closed" className="bg-gray-800">Closed Chats</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          
          <div className="overflow-y-auto h-[calc(600px-73px)]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <MessageCircle className="h-12 w-12 text-gray-500 mb-4" />
                <p className="text-gray-400">No chats found</p>
                {searchTerm || statusFilter !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`p-4 border-b border-white/10 cursor-pointer transition-colors ${
                    selectedChat === chat.id
                      ? 'bg-blue-600/20'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        chat.status === 'active' ? 'bg-green-500/20' : 'bg-gray-500/20'
                      }`}>
                        <User className={`h-5 w-5 ${
                          chat.status === 'active' ? 'text-green-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-white font-medium">{chat.userName || 'User'}</p>
                          {getPlanBadge(chat.userPlan)}
                        </div>
                        <p className="text-gray-400 text-xs">{chat.userEmail}</p>
                        {chat.lastMessage && (
                          <p className="text-gray-300 text-sm mt-1 line-clamp-1">
                            {chat.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-gray-400 text-xs">
                        {chat.updatedAt ? formatTimestamp(chat.updatedAt) : ''}
                      </div>
                      {chat.unreadCount ? (
                        <div className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mt-1">
                          {chat.unreadCount}
                        </div>
                      ) : null}
                      {chat.status === 'closed' && (
                        <div className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs mt-1">
                          Closed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="w-full md:w-2/3 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {chats.find(c => c.id === selectedChat)?.userName || 'User'}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {chats.find(c => c.id === selectedChat)?.userEmail}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {chats.find(c => c.id === selectedChat)?.status === 'active' ? (
                    <button
                      onClick={() => handleCloseChat(selectedChat)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm flex items-center space-x-1"
                    >
                      <X className="h-3 w-3" />
                      <span>Close Chat</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReopenChat(selectedChat)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center space-x-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Reopen Chat</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender === 'agent'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <div className="text-xs text-gray-300 mb-1">
                          {message.sender === 'agent' 
                            ? message.agentName || 'Support Agent' 
                            : message.userName || 'User'}
                        </div>
                        <div className="text-sm">{message.text}</div>
                        <div className="text-xs mt-1 opacity-70 text-right">
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/20">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={chats.find(c => c.id === selectedChat)?.status === 'closed'}
                  />
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim() || chats.find(c => c.id === selectedChat)?.status === 'closed'}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                {chats.find(c => c.id === selectedChat)?.status === 'closed' && (
                  <p className="text-yellow-400 text-xs mt-2">
                    This chat is closed. Reopen it to continue the conversation.
                  </p>
                )}
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageCircle className="h-16 w-16 text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Chat Selected</h3>
              <p className="text-gray-400 max-w-md">
                Select a chat from the list to view the conversation and respond to the user.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatAdmin;