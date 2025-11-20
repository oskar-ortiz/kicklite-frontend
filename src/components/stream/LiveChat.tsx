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
  MoreVertical,
  Pin,
} from 'lucide-react';
// ✅ CORREGIDO: Ruta correcta para Avatar
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

export default function LiveChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      user: 'TheKing',
      message: '¡Bienvenidos al stream! 🔥',
      badge: 'founder',
      color: '#a855f7',
      timestamp: new Date(),
      isPinned: true
    },
    {
      id: 2,
      user: 'ModGamer',
      message: 'Recuerden seguir las reglas del chat',
      badge: 'mod',
      color: '#10b981',
      timestamp: new Date()
    },
    {
      id: 3,
      user: 'ProPlayer99',
      message: 'Increíble jugada!',
      badge: 'sub',
      color: '#3b82f6',
      timestamp: new Date()
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(1247);
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
        user: 'TuUsuario',
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
      {/* Chat Header */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
            <h3 className="text-white font-bold text-lg">Chat en Vivo</h3>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-white">
                {onlineUsers.toLocaleString()}
              </span>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-400" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-slate-800/50">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`group relative ${msg.isPinned ? 'bg-amber-500/10 rounded-lg p-3 border border-amber-500/20' : ''}`}
            >
              {msg.isPinned && (
                <div className="flex items-center gap-2 mb-2 text-amber-400 text-xs font-medium">
                  <Pin className="w-3 h-3" />
                  <span>Mensaje fijado</span>
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* ✅ Avatar Component */}
                <Avatar size="sm" alt={msg.user} />

                <div className="flex-1 min-w-0">
                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {msg.badge && (
                      <div className={`p-1 rounded ${badges[msg.badge].bg}`}>
                        {(() => {
                          const BadgeIcon = badges[msg.badge].icon;
                          return <BadgeIcon className={`w-3 h-3 ${badges[msg.badge].color}`} />;
                        })()}
                      </div>
                    )}
                    <span
                      className="font-bold text-sm"
                      style={{ color: msg.color }}
                    >
                      {msg.user}
                    </span>
                    <span className="text-xs text-slate-500">
                      {msg.timestamp.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-sm text-slate-200 break-words leading-relaxed">
                    {msg.message}
                  </p>
                </div>

                {/* Message Actions */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <button className="p-1 hover:bg-white/5 rounded">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-slate-900/50 backdrop-blur-xl border-t border-white/5 p-4">
        <div className="relative">
          {/* Emoji Picker */}
          <AnimatePresence>
            {showEmojis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 mb-2 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl p-3 shadow-2xl"
              >
                <div className="grid grid-cols-5 gap-2">
                  {emojis.map((emoji, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setInputMessage(inputMessage + emoji)}
                      className="w-10 h-10 text-2xl hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-2">
            {/* Emoji Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowEmojis(!showEmojis)}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all flex-shrink-0"
            >
              <Smile className="w-5 h-5 text-slate-400" />
            </motion.button>

            {/* Input */}
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Envía un mensaje..."
                rows={1}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all resize-none"
              />
            </div>

            {/* Send Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-purple-500/30"
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}