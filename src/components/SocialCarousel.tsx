"use client";

import { motion } from "framer-motion";

const SOCIALS = [
  { label: "Instagram",  handle: "@om.domo",       href: "https://www.instagram.com/om.domo/",        icon: "IG", color: "from-pink-500 to-orange-400",    bg: "bg-pink-500/10 border-pink-500/20"    },
  { label: "TikTok",     handle: "@omdomo.com",     href: "https://www.tiktok.com/@omdomo.com",        icon: "TT", color: "from-slate-300 to-slate-500",    bg: "bg-slate-700/20 border-slate-600/20"  },
  { label: "X / Twitter",handle: "@omdomocom",      href: "https://twitter.com/omdomocom",             icon: "X",  color: "from-slate-100 to-slate-400",    bg: "bg-slate-700/10 border-slate-600/20"  },
  { label: "YouTube",    handle: "@omdomocom",      href: "https://www.youtube.com/@omdomocom",        icon: "YT", color: "from-red-500 to-red-700",        bg: "bg-red-500/10 border-red-500/20"      },
  { label: "Facebook",   handle: "omdomocom",       href: "https://www.facebook.com/omdomocom",        icon: "FB", color: "from-blue-500 to-blue-700",      bg: "bg-blue-500/10 border-blue-500/20"    },
  { label: "LinkedIn",   handle: "omdomo",          href: "https://www.linkedin.com/company/omdomo",   icon: "LI", color: "from-blue-400 to-cyan-500",      bg: "bg-cyan-500/10 border-cyan-500/20"    },
  { label: "Pinterest",  handle: "omdomocom",       href: "https://www.pinterest.es/omdomocom",        icon: "PI", color: "from-red-400 to-pink-500",       bg: "bg-red-400/10 border-red-400/20"      },
  { label: "Tienda",     handle: "omdomo.com",      href: "https://www.omdomo.com",                    icon: "🛍", color: "from-purple-500 to-cyan-500",    bg: "bg-purple-500/10 border-purple-500/20"},
];

// Duplicate for infinite loop
const ITEMS = [...SOCIALS, ...SOCIALS, ...SOCIALS];

function SocialPill({ item }: { item: typeof SOCIALS[0] }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border ${item.bg} backdrop-blur-sm hover:scale-105 transition-transform flex-shrink-0 group`}
    >
      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-xs font-black text-white group-hover:scale-110 transition-transform`}>
        {item.icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-200 leading-none">{item.label}</p>
        <p className="text-xs text-slate-500 leading-none mt-0.5">{item.handle}</p>
      </div>
    </a>
  );
}

export function SocialCarousel() {
  return (
    <div className="border-t border-slate-800/40 py-3 bg-slate-950/60 backdrop-blur-md overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950/80 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-3 w-max"
        animate={{ x: ["0%", "-33.33%"] }}
        transition={{
          duration: 30,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {ITEMS.map((item, i) => (
          <SocialPill key={`${item.label}-${i}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}
