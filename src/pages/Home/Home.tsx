import { motion } from 'framer-motion';
import { Play, TrendingUp, Users, Sparkles, Eye, Radio, Heart, UserPlus, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
          
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-6"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">
                  #1 Plataforma para Streamers
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">streamora</span>
                <span className="text-white/40">.space</span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Stream. Crea. Conecta.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl">
                La plataforma de streaming más innovadora. Transmite en vivo, 
                construye tu comunidad y monetiza tu contenido sin límites.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/50 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    <Play className="w-5 h-5" />
                    Comenzar a Streamear
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl font-semibold text-white hover:bg-white/10 transition-all"
                >
                  Ver Streams en Vivo
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">500K+</div>
                  <div className="text-sm text-slate-400">Streamers Activos</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">10M+</div>
                  <div className="text-sm text-slate-400">Espectadores</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-slate-400">Contenido Live</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full max-w-2xl"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-75 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="relative aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl overflow-hidden mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                      >
                        <Play className="w-10 h-10 text-white ml-1" />
                      </motion.div>
                    </div>
                    
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-3 h-3 bg-red-500 rounded-full"
                      />
                      <span className="px-3 py-1 bg-red-500 rounded-full text-xs font-bold text-white">
                        EN VIVO
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full flex items-center gap-2">
                      <Users className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">24.5K</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      TK
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">
                        The King - Gameplay Épico
                      </h3>
                      <p className="text-slate-400 text-sm mb-2">
                        Valorant • Ranked • !discord
                      </p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400 font-medium">
                          +2.5K espectadores
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Streamers en Vivo */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Canales en Vivo</h2>
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all">
              Ver Todos
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'The King', viewers: 24532, category: 'Valorant', avatar: '👑', color: 'from-purple-600 to-pink-600' },
              { name: 'ProGamer', viewers: 18234, category: 'LOL', avatar: '🎮', color: 'from-blue-600 to-cyan-600' },
              { name: 'StreamQueen', viewers: 12456, category: 'Just Chatting', avatar: '👸', color: 'from-pink-600 to-orange-600' },
            ].map((streamer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative cursor-pointer"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-0 group-hover:opacity-75 blur-lg transition-opacity" />
                
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10">
                  <div className="relative aspect-video overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${streamer.color}`} />
                    <div className="absolute inset-0 bg-black/40" />
                    
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-red-500 rounded-lg flex items-center gap-2">
                      <Radio className="w-3 h-3 text-white animate-pulse" />
                      <span className="font-bold text-white text-xs">EN VIVO</span>
                    </div>

                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg flex items-center gap-2">
                      <Eye className="w-3 h-3 text-white" />
                      <span className="font-semibold text-white text-xs">
                        {streamer.viewers.toLocaleString()}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                        {streamer.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-sm mb-1">{streamer.name}</h3>
                        <p className="text-slate-400 text-xs">@{streamer.name.toLowerCase().replace(' ', '')}</p>
                      </div>
                    </div>

                    <p className="text-white text-sm mb-2">RANKED GRIND | !discord !prime</p>
                    <span className="px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium">
                      {streamer.category}
                    </span>

                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-white text-sm">
                        Ver Stream
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg">
                        <Heart className="w-5 h-5 text-slate-300" />
                      </button>
                      <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg">
                        <UserPlus className="w-5 h-5 text-slate-300" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Categorías Populares</h2>
              <p className="text-slate-400">Descubre los juegos más vistos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Valorant', viewers: 245000, icon: '🎯', gradient: 'from-red-500 to-purple-500', tag: 'HOT' },
              { name: 'League of Legends', viewers: 189000, icon: '⚔️', gradient: 'from-blue-500 to-cyan-500', tag: 'TRENDING' },
              { name: 'Minecraft', viewers: 134000, icon: '🟫', gradient: 'from-green-500 to-emerald-500', tag: null },
              { name: 'GTA V', viewers: 112000, icon: '🚗', gradient: 'from-orange-500 to-pink-500', tag: 'NEW' },
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative cursor-pointer"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${cat.gradient} opacity-0 group-hover:opacity-75 blur-xl transition-all rounded-2xl`} />
                
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5">
                  <div className="relative aspect-[4/5]">
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-80`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                    
                    {cat.tag && (
                      <div className="absolute top-3 right-3">
                        <div className={`px-3 py-1.5 bg-gradient-to-r ${cat.gradient} rounded-lg`}>
                          <span className="text-xs font-bold text-white">{cat.tag}</span>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl opacity-90">{cat.icon}</div>
                    </div>

                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <div className="px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg flex items-center gap-2">
                        <Eye className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white">
                          {(cat.viewers / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-2">{cat.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">{cat.viewers.toLocaleString()} espectadores</span>
                      <ArrowRight className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}