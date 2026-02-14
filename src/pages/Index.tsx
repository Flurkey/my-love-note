import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import FloatingHearts from "@/components/FloatingHearts";
import PhotoFrame from "@/components/PhotoFrame";
import { Heart, Send, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const generateId = () => Math.random().toString(36).substring(2, 10);

const Index = () => {
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePhotoChange = useCallback((index: number, dataUrl: string | null) => {
    setPhotos((prev) => {
      const next = [...prev];
      next[index] = dataUrl;
      return next;
    });
  }, []);

  const generateShareLink = () => {
    const id = generateId();
    const data = {
      to: toName,
      from: fromName,
      message,
      photos: photos.filter(Boolean) as string[],
    };
    localStorage.setItem(`valentine-${id}`, JSON.stringify(data));
    const link = `${window.location.origin}/card?id=${id}`;
    setShareLink(link);
    toast.success("Your Valentine's card is ready! 💖");
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

      <div className="relative z-10 flex flex-col items-center py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-primary animate-pulse-heart fill-primary" />
            <h1 className="text-5xl md:text-7xl font-handwriting text-primary font-bold">
              Happy Valentine's Day
            </h1>
            <Heart className="w-8 h-8 text-primary animate-pulse-heart fill-primary" />
          </div>
          <p className="text-muted-foreground text-lg font-handwriting">
            A little love note, just for you ♥
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl shadow-primary/10 border border-border p-8 md:p-12 relative"
        >
          <span className="absolute top-4 left-4 text-2xl text-primary/40">💕</span>
          <span className="absolute top-4 right-4 text-2xl text-primary/40">💗</span>
          <span className="absolute bottom-4 left-4 text-2xl text-primary/40">💖</span>
          <span className="absolute bottom-4 right-4 text-2xl text-primary/40">💕</span>

          <div className="mb-6">
            <label className="text-sm text-muted-foreground uppercase tracking-wider mb-1 block">To</label>
            <input
              type="text"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              placeholder="My Dearest..."
              className="w-full bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none text-3xl font-handwriting text-foreground placeholder:text-muted-foreground/50 py-2 transition-colors"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-6 my-8">
            <PhotoFrame label="Our Photo 💑" onPhotoChange={(url) => handlePhotoChange(0, url)} />
            <PhotoFrame label="A Memory 📸" onPhotoChange={(url) => handlePhotoChange(1, url)} />
          </div>

          <div className="mb-6">
            <label className="text-sm text-muted-foreground uppercase tracking-wider mb-1 block">My Love Letter</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write something sweet from the heart..."
              rows={5}
              className="w-full bg-secondary/30 rounded-lg border border-primary/20 focus:border-primary outline-none text-lg font-handwriting text-foreground placeholder:text-muted-foreground/50 p-4 resize-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-primary/20" />
            <span className="text-primary text-xl animate-pulse-heart">♥</span>
            <div className="flex-1 h-px bg-primary/20" />
          </div>

          <div className="mb-4">
            <label className="text-sm text-muted-foreground uppercase tracking-wider mb-1 block">With all my love,</label>
            <input
              type="text"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-transparent border-b-2 border-primary/30 focus:border-primary outline-none text-3xl font-handwriting text-foreground placeholder:text-muted-foreground/50 py-2 transition-colors"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <PhotoFrame label="Us Together 💞" onPhotoChange={(url) => handlePhotoChange(2, url)} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <button
            onClick={generateShareLink}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-handwriting text-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
            Send to My Valentine
          </button>

          {shareLink && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="w-full max-w-2xl bg-card border border-border rounded-xl p-4"
            >
              <p className="text-sm text-muted-foreground font-handwriting mb-3 text-center">
                ⚠️ This link only works on this device/browser since the card is saved locally. To share with someone else, consider taking a screenshot! 💕
              </p>
              <div className="flex items-center gap-3">
                <input
                  readOnly
                  value={shareLink}
                  className="flex-1 bg-secondary/30 rounded-lg border border-primary/20 px-3 py-2 text-sm text-foreground truncate outline-none"
                />
                <button
                  onClick={copyLink}
                  className="flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
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
          className="mt-8 text-muted-foreground font-handwriting text-lg"
        >
          Made with 💖 on Valentine's Day 2026
        </motion.p>
      </div>
    </div>
  );
};

export default Index;
