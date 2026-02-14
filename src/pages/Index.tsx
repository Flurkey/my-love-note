import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import PhotoFrame from "@/components/PhotoFrame";
import { Heart, Send, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { saveCard } from "@/lib/cards";
import { isSupabaseConfigured } from "@/lib/supabase";

const generateId = () => Math.random().toString(36).substring(2, 10);

/** Build share URL with correct origin and base path (for GitHub Pages). */
const getShareUrl = (id: string) => {
  const base = (import.meta.env.VITE_BASE_PATH ?? import.meta.env.BASE_URL) || "/";
  return `${window.location.origin}${base.replace(/\/$/, "")}/card?id=${id}`;
};

const Index = () => {
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePhotoChange = useCallback((index: number, dataUrl: string | null) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = dataUrl;
      return next;
    });
  }, []);

  const generateShareLink = async () => {
    const id = generateId();
    const data = {
      to: toName,
      from: fromName,
      message,
      photos: photos.filter(Boolean) as string[],
    };
    localStorage.setItem(`valentine-${id}`, JSON.stringify(data));
    const link = getShareUrl(id);
    setShareLink(link);

    if (isSupabaseConfigured()) {
      setSaving(true);
      const result = await saveCard(id, data);
      setSaving(false);
      if (result.ok) {
        toast.success("Your Valentine's card is ready! Share the link with anyone 💖");
      } else {
        toast.error("Card saved locally, but cloud save failed. Link may only work on this device.");
      }
    } else {
      toast.success("Your Valentine's card is ready! 💖 (Link works on this device only until you add cloud storage.)");
    }
  };

  const copyLink = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copied! Send it to your Valentine 💌");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <FloatingHearts />

      <div className="relative z-10 flex flex-col items-center py-6 px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-2">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse-heart fill-primary shrink-0" />
            <h1 className="text-3xl min-[380px]:text-4xl sm:text-5xl md:text-7xl font-handwriting text-primary font-bold leading-tight">
              Happy Valentine's Day
            </h1>
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-pulse-heart fill-primary shrink-0" />
          </div>
          <p className="text-muted-foreground text-base sm:text-lg font-handwriting">
            A little love note, just for you ♥
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl shadow-primary/10 border border-border p-4 sm:p-6 md:p-8 lg:p-12 relative"
        >
          <span className="absolute top-3 left-3 sm:top-4 sm:left-4 text-lg sm:text-2xl text-primary/40 select-none">💕</span>
          <span className="absolute top-3 right-3 sm:top-4 sm:right-4 text-lg sm:text-2xl text-primary/40 select-none">💗</span>
          <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-lg sm:text-2xl text-primary/40 select-none hidden sm:inline" aria-hidden>💖</span>
          <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-lg sm:text-2xl text-primary/40 select-none hidden sm:inline" aria-hidden>💕</span>

          <div className="mb-4 sm:mb-6">
            <label className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-1 block">To</label>
            <input
              type="text"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              placeholder="My Dearest..."
              className="w-full bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none text-2xl sm:text-3xl font-handwriting text-foreground placeholder:text-muted-foreground/50 py-2 transition-colors min-h-[44px]"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 my-6 sm:my-8">
            <PhotoFrame label="📸" onPhotoChange={(url) => handlePhotoChange(0, url)} />
            <PhotoFrame label="📸" onPhotoChange={(url) => handlePhotoChange(1, url)} />
          </div>

          <div className="mb-4 sm:mb-6">
            <label className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-1 block">My Love Letter</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write something sweet from the heart..."
              rows={4}
              className="w-full bg-secondary/30 rounded-lg border border-primary/20 focus:border-primary outline-none text-base sm:text-lg font-handwriting text-foreground placeholder:text-muted-foreground/50 p-3 sm:p-4 resize-none transition-colors min-h-[100px]"
            />
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-primary/20" />
            <span className="text-primary text-xl animate-pulse-heart">♥</span>
            <div className="flex-1 h-px bg-primary/20" />
          </div>

          <div className="mb-4">
            <label className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-1 block">With all my love,</label>
            <input
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none text-2xl sm:text-3xl font-handwriting text-foreground placeholder:text-muted-foreground/50 py-2 transition-colors min-h-[44px]"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
            <PhotoFrame label="💞" onPhotoChange={(url) => handlePhotoChange(2, url)} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 sm:mt-8 flex flex-col items-center gap-4 w-full max-w-2xl"
        >
          <button
            onClick={() => void generateShareLink()}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 sm:px-8 sm:py-3 rounded-full font-handwriting text-lg sm:text-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-transform min-h-[48px] min-w-[44px] touch-manipulation disabled:opacity-70 disabled:pointer-events-none"
          >
            {saving ? (
              <>
                <span className="inline-block w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Send className="w-5 h-5 shrink-0" />
                Send to My Valentine
              </>
            )}
          </button>

          {shareLink && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="w-full bg-card border border-border rounded-xl p-3 sm:p-4"
            >
              <p className="text-xs sm:text-sm text-muted-foreground font-handwriting mb-3 text-center">
                {isSupabaseConfigured()
                  ? "Share this link with your Valentine — they can open it on any device! 💕"
                  : "⚠️ This link only works on this device/browser. To share with anyone, add Supabase (see README). 💕"}
              </p>
              <div className="flex flex-col min-[400px]:flex-row gap-2 min-[400px]:items-center">
                <input
                  readOnly
                  value={shareLink}
                  className="flex-1 min-w-0 bg-secondary/30 rounded-lg border border-primary/20 px-3 py-2.5 text-xs sm:text-sm text-foreground truncate outline-none"
                />
                <button
                  onClick={copyLink}
                  className="flex items-center justify-center gap-1 bg-primary text-primary-foreground px-4 py-3 rounded-lg text-sm font-medium hover:opacity-90 active:opacity-80 transition-opacity shrink-0 min-h-[44px] touch-manipulation"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 sm:mt-8 text-muted-foreground font-handwriting text-base sm:text-lg text-center px-2"
        >
          Made with 💖 on Valentine's Day 2026
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
