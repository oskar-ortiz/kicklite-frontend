import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Smile,
  Gift,
  Settings,
  Users,
  Crown,
  Shield,
  Star,
  MoreVertical,
  Pin,
  Trash2,
  X
} from 'lucide-react';
import Avatar from '../common/Avatar';

interface Message {
  id: number;
  user: string;
  message: string;
  avatar: string;
  badge?: 'mod' | 'vip' | 'sub' | 'founder';
  color: string;
  timestamp: Date;
  isPinned?: boolean;
}

const initialMessages: Message[] = [
  {
    id: 1,
    user: 'StreamKing',
    message: 'Welcome everyone to the stream! 🔥',
    avatar: '/images/avatars/user1.jpg',
    badge: 'founder',
    color: '#a855f7',
    timestamp: new Date(),
    isPinned: true
  },
  {
    id: 2,
    user: 'NightModeGaming',
    message: 'Amazing stream as always! Keep it up 💪',
    avatar: '/images/avatars/user2.jpg',
    badge: 'sub',
    color: '#06b6d4',
    timestamp: new Date(Date.now() - 1000 * 60 * 2)
  },
  {
    id: 3,
    user: 'ModeratorPro',
    message: 'Remember to follow the chat rules everyone!',
    avatar: '/images/avatars/user3.jpg',
    badge: 'mod',
    color: '#10b981',
    timestamp: new Date(Date.now() - 1000 * 60 * 5)
  }
];

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [onlineUsers] = useState(1247);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const emojis = ['😀', '😂', '❤️', '🔥', '👍', '🎮', '⚡', '💎', '👑', '🏆', '🎯', '💪'];

  const badges = {
    founder: { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    mod: { icon: Shield, color: 'text-green-400', bg: 'bg-green-500/20' },
    vip: { icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    sub: { icon: Gift, color: 'text-purple-400', bg: 'bg-purple-500/20' }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        user: 'YourUsername',
        message: inputMessage,
        avatar: '/images/avatars/default.jpg',
        color: '#8b5cf6',
        timestamp: new Date(),
        badge: 'sub'
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
      setShowEmojis(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[700px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-white/5 flex flex-col overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-5 w-5 text-purple-500" />
          <span className="text-sm text-white font-medium">
            {onlineUsers.toLocaleString()} chatting
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Pinned Message */}
        <AnimatePresence>
          {messages.find(m => m.isPinned) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white/5 rounded-lg p-3 border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Pin className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-slate-400">Pinned message</span>
                </div>
                <button className="text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-sm text-white">
                {messages.find(m => m.isPinned)?.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message List */}
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-3 group">
            <Avatar src={message.avatar} alt={`${message.user}'s avatar`} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm" style={{ color: message.color }}>
                  {message.user}
                </span>
                {message.badge && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full flex items-center space-x-1 ${
                      badges[message.badge].bg
                    }`}
                  >
                    {React.createElement(badges[message.badge].icon, {
                      className: `h-3 w-3 ${badges[message.badge].color}`
                    })}
                  </span>
                )}
                <span className="text-xs text-slate-500">
                  {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                    -Math.round((Date.now() - message.timestamp.getTime()) / 60000),
                    'minutes'
                  )}
                </span>
              </div>
              <p className="text-sm text-white break-words">{message.message}</p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-end space-x-2">
          <div className="relative flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Send a message..."
              className="w-full bg-slate-800/50 text-white rounded-lg pl-4 pr-12 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm h-[45px]"
              style={{ minHeight: '45px', maxHeight: '120px' }}
            />
            <div className="absolute right-2 bottom-2 flex items-center space-x-1">
              <button
                onClick={() => setShowEmojis(!showEmojis)}
                className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>
            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 bg-slate-800 rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1"
                >
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setInputMessage((prev) => prev + emoji);
                      }}
                      className="p-2 hover:bg-white/5 rounded text-xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="p-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Settings Menu */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="absolute inset-0 bg-slate-900 z-10"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-medium text-white">Chat Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white font-medium">Chat Mode</label>
                <select className="w-full bg-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="all">All Chat</option>
                  <option value="subscriber">Subscriber Only</option>
                  <option value="follower">Follower Only</option>
                  <option value="emote">Emote Only</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white font-medium">Message Delay</label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">Clear Chat History</span>
                <button className="text-red-400 hover:text-red-300 flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}