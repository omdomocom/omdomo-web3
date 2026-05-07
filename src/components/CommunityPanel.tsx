"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, MessageCircle, ArrowLeft, Search, Users, Globe, Lock, MoreHorizontal } from "lucide-react";
import { UserAvatar, loadProfile, type UserProfile } from "./ProfilePanel";

// ─── Mock community data ────────────────────────────────────────────────
const COMMUNITY_USERS = [
  { id: "u1", name: "SolGuardian",    avatar: "🌟", avatarType: "emoji" as const, wallet: "0x7c3a…ed42", verified: true  },
  { id: "u2", name: "AvaRunner",      avatar: "🏃", avatarType: "emoji" as const, wallet: "0x0891…c2f1", verified: true  },
  { id: "u3", name: "OmMeditation",   avatar: "🧘", avatarType: "emoji" as const, wallet: "0x9333…ea55", verified: false },
  { id: "u4", name: "CryptoYogi",     avatar: "🔮", avatarType: "emoji" as const, wallet: "0x4ade…80ab", verified: true  },
  { id: "u5", name: "GenesisHolder",  avatar: "💎", avatarType: "emoji" as const, wallet: "0x1234…5678", verified: true  },
  { id: "u6", name: "NomadConscius",  avatar: "🦋", avatarType: "emoji" as const, wallet: "0xabcd…ef12", verified: false },
];

interface Post {
  id: string;
  userId: string;
  content: string;
  likes: number;
  liked: boolean;
  time: string;
  timestamp: number;
}

interface Message {
  id: string;
  fromMe: boolean;
  content: string;
  time: string;
  timestamp: number;
}

interface Conversation {
  id: string;
  userId: string;
  messages: Message[];
  unread: number;
}

const INITIAL_POSTS: Post[] = [
  { id: "p1", userId: "u1", content: "Acabo de reclamar mi NFT Genesis 🎉 El proceso fue súper fácil. ¡La comunidad Om Domo es increíble!", likes: 14, liked: false, time: "2m", timestamp: Date.now() - 120000 },
  { id: "p2", userId: "u3", content: "30 días de meditación completados ✨ Las recompensas OMMY van creciendo día a día 🧘 ¿Alguien más haciendo el reto diario?", likes: 9, liked: false, time: "18m", timestamp: Date.now() - 1080000 },
  { id: "p3", userId: "u2", content: "¿Alguien más esperando el Drop #1 Genesis Hoodie? El diseño es espectacular 🔥 Solo 100 unidades a €89. Voy a estar listo desde el primer minuto.", likes: 27, liked: false, time: "1h", timestamp: Date.now() - 3600000 },
  { id: "p4", userId: "u4", content: "La integración con Avalanche es súper rápida ⚡ Transacciones en segundos y fees casi nulas. Web3 así tiene sentido.", likes: 18, liked: false, time: "2h", timestamp: Date.now() - 7200000 },
  { id: "p5", userId: "u5", content: "Primer mes en la comunidad y ya tengo 5,320 OMMY acumulados 💎 Referí 3 amigos esta semana = +6,000 OMMY extra. El sistema de referidos funciona muy bien.", likes: 35, liked: false, time: "4h", timestamp: Date.now() - 14400000 },
  { id: "p6", userId: "u6", content: "Recién llegué a la comunidad 🌊 Compré mi primera hoodie Om Domo y estoy esperando el NFT. ¿Alguien puede explicarme el proceso de claim?", likes: 6, liked: false, time: "5h", timestamp: Date.now() - 18000000 },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c1", userId: "u1", unread: 2,
    messages: [
      { id: "m1", fromMe: false, content: "¡Hola! ¿Cuándo sale exactamente el Drop #1?", time: "10:32", timestamp: Date.now() - 600000 },
      { id: "m2", fromMe: true,  content: "¡Hola SolGuardian! El Drop #1 Genesis Hoodie es el 15 de Agosto 2026 🔥", time: "10:35", timestamp: Date.now() - 300000 },
      { id: "m3", fromMe: false, content: "¡Perfecto! ¿Tienes código de referido?", time: "10:40", timestamp: Date.now() - 60000 },
    ],
  },
  {
    id: "c2", userId: "u3", unread: 0,
    messages: [
      { id: "m1", fromMe: false, content: "Gracias por el tip de meditación de ayer 🙏", time: "ayer", timestamp: Date.now() - 86400000 },
      { id: "m2", fromMe: true,  content: "¡Con gusto! El reto de 30 días vale mucho la pena", time: "ayer", timestamp: Date.now() - 86000000 },
    ],
  },
  {
    id: "c3", userId: "u2", unread: 1,
    messages: [
      { id: "m1", fromMe: false, content: "¿Tienes NFT Genesis? ¿Qué rareza te salió?", time: "ayer", timestamp: Date.now() - 90000000 },
    ],
  },
];

// ─── Avatar adaptador ──────────────────────────────────────────────────
function CommunityAvatar({ user, size = "sm" }: { user: typeof COMMUNITY_USERS[0]; size?: "sm" | "md" }) {
  const fakeProfile: UserProfile = {
    username: user.name, usernameColor: "#f1f5f9", bio: "", avatar: user.avatar,
    avatarType: user.avatarType, bgTheme: "space", joinDate: "",
    email: "", birthday: "", gender: "", profileRewardClaimed: false, zodiacClaimed: false,
  };
  return <UserAvatar profile={fakeProfile} size={size} />;
}

// ─── Post card ────────────────────────────────────────────────────────
function PostCard({
  post, onLike, onReply,
}: {
  post: Post;
  onLike: (id: string) => void;
  onReply: (userId: string) => void;
}) {
  const user = COMMUNITY_USERS.find((u) => u.id === post.userId);
  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 border border-slate-700/30 hover:border-slate-600/40 transition-colors"
    >
      <div className="flex gap-3">
        <CommunityAvatar user={user} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold text-slate-200">{user.name}</span>
            {user.verified && (
              <span className="px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30">✓ NFT</span>
            )}
            <span className="text-xs text-slate-600 ml-auto">{post.time}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{post.content}</p>
          <div className="flex items-center gap-4 mt-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onLike(post.id)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                post.liked ? "text-pink-400" : "text-slate-500 hover:text-pink-400"
              }`}
            >
              <Heart size={13} fill={post.liked ? "currentColor" : "none"} />
              {post.likes}
            </motion.button>
            <button
              onClick={() => onReply(post.userId)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-400 transition-colors"
            >
              <MessageCircle size={13} />
              Mensaje
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Public feed ─────────────────────────────────────────────────────
function PublicFeed({
  myProfile,
  onStartConversation,
}: {
  myProfile: UserProfile;
  onStartConversation: (userId: string) => void;
}) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  function handlePost() {
    if (!text.trim()) return;
    setPosting(true);
    const newPost: Post = {
      id: `p${Date.now()}`,
      userId: "me",
      content: text.trim(),
      likes: 0, liked: false,
      time: "ahora",
      timestamp: Date.now(),
    };
    setTimeout(() => {
      setPosts([newPost, ...posts]);
      setText("");
      setPosting(false);
    }, 400);
  }

  function handleLike(id: string) {
    setPosts(posts.map((p) =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  }

  // Fake "me" user
  const meUser = { id: "me", name: myProfile.username || "Tú", avatar: myProfile.avatar, avatarType: myProfile.avatarType, wallet: "", verified: false };

  return (
    <div className="space-y-4">
      {/* Composer */}
      <div className="glass rounded-2xl p-4 border border-purple-500/20 space-y-3">
        <div className="flex gap-3">
          <UserAvatar profile={myProfile} size="sm" />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Comparte algo con la comunidad Om Domo…"
            rows={2}
            maxLength={280}
            className="flex-1 bg-slate-800/60 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-purple-500/50 focus:outline-none resize-none"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">{text.length}/280</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePost}
            disabled={!text.trim() || posting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-xs font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={12} />
            {posting ? "Publicando…" : "Publicar"}
          </motion.button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3">
        <AnimatePresence>
          {posts.map((post) => {
            if (post.userId === "me") {
              // Render own post
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl p-4 border border-purple-500/20"
                >
                  <div className="flex gap-3">
                    <UserAvatar profile={myProfile} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-200">{myProfile.username || "Tú"}</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs border border-cyan-500/30">Yo</span>
                        <span className="text-xs text-slate-600 ml-auto">{post.time}</span>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Heart size={13} /> {post.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }
            return (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onReply={onStartConversation}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Chat view ────────────────────────────────────────────────────────
function ChatView({
  conversation,
  myProfile,
  onBack,
  onSend,
}: {
  conversation: Conversation;
  myProfile: UserProfile;
  onBack: () => void;
  onSend: (convId: string, text: string) => void;
}) {
  const user = COMMUNITY_USERS.find((u) => u.id === conversation.userId);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  function handleSend() {
    if (!text.trim()) return;
    onSend(conversation.id, text.trim());
    setText("");
  }

  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-700/30 glass flex-shrink-0">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-700/40 text-slate-400 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <CommunityAvatar user={user} size="sm" />
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-200">{user.name}</p>
          <p className="text-xs text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> En línea
          </p>
        </div>
        {user.verified && (
          <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30">✓ NFT</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {conversation.messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.fromMe ? "flex-row-reverse" : "flex-row"}`}>
            {!msg.fromMe && <CommunityAvatar user={user} size="sm" />}
            {msg.fromMe && <UserAvatar profile={myProfile} size="sm" />}
            <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
              msg.fromMe
                ? "bg-gradient-to-br from-purple-600/80 to-cyan-600/60 text-white rounded-tr-sm"
                : "bg-slate-800/60 text-slate-200 rounded-tl-sm border border-slate-700/40"
            }`}>
              {msg.content}
              <p className={`text-xs mt-1 ${msg.fromMe ? "text-white/50 text-right" : "text-slate-600"}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700/30 glass flex-shrink-0">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={`Mensaje a ${user.name}…`}
            className="flex-1 bg-slate-800/60 rounded-xl px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-purple-500/50 focus:outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!text.trim()}
            className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center disabled:opacity-40 hover:bg-purple-500 transition-colors"
          >
            <Send size={14} className="text-white" />
          </motion.button>
        </div>
        <p className="text-xs text-slate-700 mt-1.5 flex items-center gap-1">
          <Lock size={9} /> Mensaje privado — solo visible entre vosotros
        </p>
      </div>
    </div>
  );
}

// ─── Conversations list ───────────────────────────────────────────────
function ConversationList({
  conversations,
  onOpen,
  onNewConversation,
}: {
  conversations: Conversation[];
  onOpen: (id: string) => void;
  onNewConversation: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? COMMUNITY_USERS.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar usuario…"
          className="w-full bg-slate-800/60 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 border border-slate-700/40 focus:border-purple-500/50 focus:outline-none"
        />
      </div>

      {/* Search results */}
      {filtered && filtered.length > 0 && (
        <div className="glass rounded-2xl border border-slate-700/30 overflow-hidden">
          <p className="text-xs text-slate-500 px-3 py-2 uppercase tracking-wider">Usuarios encontrados</p>
          {filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                setSearch("");
                // find or create conv
                onNewConversation();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/40 transition-colors text-left"
            >
              <CommunityAvatar user={u} size="sm" />
              <div>
                <p className="text-sm text-slate-200">{u.name}</p>
                <p className="text-xs text-slate-600 font-mono">{u.wallet}</p>
              </div>
              {u.verified && <span className="ml-auto text-xs text-purple-400">✓ NFT</span>}
            </button>
          ))}
        </div>
      )}

      {/* Existing conversations */}
      {!search && (
        <>
          <p className="text-xs text-slate-500 uppercase tracking-wider px-1">Conversaciones recientes</p>
          <div className="space-y-2">
            {conversations.map((conv) => {
              const user = COMMUNITY_USERS.find((u) => u.id === conv.userId);
              if (!user) return null;
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <motion.button
                  key={conv.id}
                  whileHover={{ x: 2 }}
                  onClick={() => onOpen(conv.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl glass border border-slate-700/30 hover:border-purple-500/30 transition-all text-left"
                >
                  <div className="relative flex-shrink-0">
                    <CommunityAvatar user={user} size="sm" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-slate-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                      <p className="text-xs text-slate-600">{lastMsg.time}</p>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {lastMsg.fromMe ? "Tú: " : ""}{lastMsg.content}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Todos los miembros */}
          <p className="text-xs text-slate-500 uppercase tracking-wider px-1 pt-2">Miembros activos</p>
          <div className="grid grid-cols-2 gap-2">
            {COMMUNITY_USERS.map((u) => (
              <motion.button
                key={u.id}
                whileHover={{ y: -2 }}
                onClick={() => onNewConversation()}
                className="flex items-center gap-2 p-2.5 rounded-xl glass border border-slate-700/30 hover:border-purple-500/30 transition-all text-left"
              >
                <CommunityAvatar user={u} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">{u.name}</p>
                  {u.verified && <p className="text-xs text-purple-400">✓ NFT</p>}
                </div>
              </motion.button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main CommunityPanel ─────────────────────────────────────────────
export function CommunityPanel() {
  const [tab, setTab] = useState<"publico" | "mensajes">("publico");
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [openConvId, setOpenConvId] = useState<string | null>(null);
  const [myProfile, setMyProfile] = useState<UserProfile>({
    username: "", usernameColor: "#f1f5f9", bio: "", avatar: "🧘", avatarType: "emoji", bgTheme: "space", joinDate: "",
    email: "", birthday: "", gender: "", profileRewardClaimed: false, zodiacClaimed: false,
  });

  useEffect(() => {
    setMyProfile(loadProfile());
    const handler = (e: Event) => {
      setMyProfile((e as CustomEvent).detail);
    };
    window.addEventListener("omdomo-profile-update", handler);
    return () => window.removeEventListener("omdomo-profile-update", handler);
  }, []);

  function handleStartConversation(userId: string) {
    // Find existing or create new
    const existing = conversations.find((c) => c.userId === userId);
    if (existing) {
      setOpenConvId(existing.id);
      setTab("mensajes");
    } else {
      const newConv: Conversation = {
        id: `c${Date.now()}`, userId, messages: [], unread: 0,
      };
      setConversations([newConv, ...conversations]);
      setOpenConvId(newConv.id);
      setTab("mensajes");
    }
  }

  function handleSend(convId: string, text: string) {
    const now = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    setConversations((convs) =>
      convs.map((c) =>
        c.id === convId
          ? {
              ...c,
              unread: 0,
              messages: [
                ...c.messages,
                { id: `m${Date.now()}`, fromMe: true, content: text, time: now, timestamp: Date.now() },
              ],
            }
          : c
      )
    );
    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = [
        "¡Genial! 😊", "Totalmente de acuerdo", "¿Tienes NFT Genesis?",
        "¡Gracias por el mensaje! La comunidad Om Domo es lo mejor 🌟",
        "El Drop #1 va a ser increíble 🔥", "Seguimos en contacto por aquí 🙏",
      ];
      const replyTime = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
      setConversations((convs) =>
        convs.map((c) =>
          c.id === convId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: `m${Date.now()}`, fromMe: false, content: replies[Math.floor(Math.random() * replies.length)], time: replyTime, timestamp: Date.now() },
                ],
              }
            : c
        )
      );
    }, 1500);
  }

  const openConv = conversations.find((c) => c.id === openConvId);
  const totalUnread = conversations.reduce((s, c) => s + c.unread, 0);

  return (
    <div className="space-y-4">
      {/* ── Stats bar ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Miembros",   value: "2,000+",   icon: <Users size={14} />,        color: "text-purple-300" },
          { label: "Posts hoy",  value: "47",        icon: <Globe size={14} />,        color: "text-cyan-300"   },
          { label: "Mensajes",   value: totalUnread || "—", icon: <MessageCircle size={14} />, color: totalUnread ? "text-orange-400" : "text-slate-500" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-3 border border-slate-700/30 text-center">
            <div className={`flex items-center justify-center mb-1 ${s.color}`}>{s.icon}</div>
            <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tab switcher ── */}
      <div className="flex gap-2 p-1 glass rounded-xl border border-slate-700/30">
        {[
          { id: "publico",   label: "Feed público",  icon: <Globe size={13} /> },
          { id: "mensajes",  label: "Mensajes",       icon: <MessageCircle size={13} />, badge: totalUnread },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id as typeof tab); if (t.id === "publico") setOpenConvId(null); }}
            className={`relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              tab === t.id ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.icon} {t.label}
            {t.badge ? (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-black">
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        {tab === "publico" && (
          <motion.div key="publico" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <PublicFeed myProfile={myProfile} onStartConversation={handleStartConversation} />
          </motion.div>
        )}

        {tab === "mensajes" && !openConv && (
          <motion.div key="convlist" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <ConversationList
              conversations={conversations}
              onOpen={(id) => {
                setOpenConvId(id);
                setConversations((cs) => cs.map((c) => c.id === id ? { ...c, unread: 0 } : c));
              }}
              onNewConversation={() => {
                // Abrir con primer usuario no existente como demo
                handleStartConversation("u4");
              }}
            />
          </motion.div>
        )}

        {tab === "mensajes" && openConv && (
          <motion.div
            key={`chat-${openConv.id}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass rounded-2xl border border-slate-700/30 overflow-hidden"
            style={{ height: "560px", display: "flex", flexDirection: "column" }}
          >
            <ChatView
              conversation={openConv}
              myProfile={myProfile}
              onBack={() => setOpenConvId(null)}
              onSend={handleSend}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
