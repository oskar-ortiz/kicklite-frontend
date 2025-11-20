import { useState, useRef, useEffect } from 'react';
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
  Pin,
} from 'lucide-react';
import Avatar from '../common/Avatar';

interface Message {
  id: number;
  user: string;
  message: string;
  badge?: 'mod' | 'vip' | 'sub' | 'founder';
  color: string;
  timestamp: Date;
  isPinned?: boolean;
}

function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: 'TheKing',
      message: 'Welcome everyone to the stream! 🔥',
      badge: 'founder',
      color: '#a855f7',
      timestamp: new Date(),
      isPinned: true
    },
    {
      id: 2,
      user: 'ModGamer',
      message: 'Remember to follow the chat rules',
      badge: 'mod',
      color: '#10b981',
      timestamp: new Date()
    },
    {
      id: 3,
      user: 'ProPlayer99',
      message: 'Amazing play!',
      badge: 'sub',
      color: '#3b82f6',
      timestamp: new Date()
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [onlineUsers] = useState(1247);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const emojis = ['😀', '😂', '❤️', '🔥', '👍', '🎮', '⚡', '💎', '👑', '🏆'];

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
        id: messages.length + 1,
        user: 'You',
        message: inputMessage,
        color: '#8b5cf6',
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
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

      {/* HEADER */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-white font-bold text-lg">Chatting</h3>
          </div>

          <div className="flex items-center gap-2">
            <motion.div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-white">
                {onlineUsers.toLocaleString()}
              </span>
            </motion.div>

            <button aria-label="chat-settings" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`group relative ${
              msg.isPinned ? 'bg-amber-500/10 p-3 rounded-lg border border-amber-500/20' : ''
            }`}
          >
            {msg.isPinned && (
              <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-medium">
                <Pin className="w-3 h-3" />
                <span>Pinned Message</span>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Avatar size="sm" alt={msg.user} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {msg.badge && (
                    <div className={`p-1 rounded ${badges[msg.badge].bg}`}>
                      {(() => {
                        const Icon = badges[msg.badge].icon;
                        return <Icon className={`w-3 h-3 ${badges[msg.badge].color}`} />;
                      })()}
                    </div>
                  )}

                  <span className="font-bold text-sm" style={{ color: msg.color }}>
                    {msg.user}
                  </span>

                  <span className="text-xs text-slate-500">
                    {msg.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="text-sm text-slate-200 break-words">{msg.message}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-t border-white/5 p-4">
        <div className="relative">

          {/* EMOJI PICKER */}
          <AnimatePresence>
            {showEmojis && (
              <motion.div className="absolute bottom-full left-0 mb-2 bg-slate-800/95 p-3 rounded-xl border border-white/10 shadow-xl grid grid-cols-5 gap-2">
                {emojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => setInputMessage((prev) => prev + emoji)}
                    className="text-2xl hover:bg-white/10 rounded-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-2">

            {/* Emoji Toggle */}
            <button
              aria-label="toggle-emoji-picker"
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-3 bg-white/5 rounded-xl border border-white/10"
            >
              <Smile className="w-5 h-5 text-slate-400" />
            </button>

            {/* Input */}
            <textarea
              aria-label="chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Send a message..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none"
              rows={1}
            />

            {/* Send */}
            <button
              aria-label="send-message"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="p-3 bg-purple-600 rounded-xl disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-white" />
            </button>

          </div>
        </div>
      </div>

    </div>
  );
}

export default LiveChat;
