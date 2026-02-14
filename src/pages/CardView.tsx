import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import FloatingHearts from "@/components/FloatingHearts";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getCard } from "@/lib/cards";

export interface CardData {
  to: string;
  from: string;
  message: string;
  photos: string[];
}

const CardView = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) {
      setCardData(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      // Try cloud first so shared links work for anyone
      const fromCloud = await getCard(id);
      if (cancelled) return;
      if (fromCloud) {
        setCardData(fromCloud);
        setLoading(false);
        return;
      }
      // Fallback: same device (localStorage)
      try {
        const stored = localStorage.getItem(`valentine-${id}`);
        if (stored) setCardData(JSON.parse(stored));
      } catch {
        // ignore
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <div className="text-center font-handwriting">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4 animate-pulse-heart fill-primary" />
          <p className="text-muted-foreground">Loading your card…</p>
        </div>
      </div>
    );
  }

  if (!id || !cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
        <div className="text-center font-handwriting max-w-sm">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4 animate-pulse-heart fill-primary" />
          <h1 className="text-3xl sm:text-4xl text-primary mb-2">Oops!</h1>
          <p className="text-muted-foreground text-lg sm:text-xl">This love letter seems to have gotten lost 💔</p>
          <p className="text-muted-foreground text-xs sm:text-sm mt-2">
            The link may be wrong or the card was created on another device without cloud save.
          </p>
        </div>
      </div>
    );
  }

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
            Someone special made this for you ♥
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
          <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-lg sm:text-2xl text-primary/40 select-none hidden sm:inline">💖</span>
          <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-lg sm:text-2xl text-primary/40 select-none hidden sm:inline">💕</span>

          <div className="mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider block mb-1">To</span>
            <p className="text-2xl sm:text-3xl font-handwriting text-foreground border-b-2 border-primary/30 py-2">
              {cardData.to || "My Love"}
            </p>
          </div>

          {cardData.photos.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 my-6 sm:my-8">
              {cardData.photos.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotate: -3 }}
                  animate={{ opacity: 1, rotate: i % 2 === 0 ? 2 : -2 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="relative w-36 h-36 min-[400px]:w-40 min-[400px]:h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-lg border-4 border-primary/20 overflow-hidden shadow-lg shrink-0"
                >
                  <img src={src} alt={`Memory ${i + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute -top-2 -right-2 text-primary text-lg animate-pulse-heart">♥</span>
                </motion.div>
              ))}
            </div>
          )}

          {cardData.message && (
            <div className="mb-4 sm:mb-6">
              <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider block mb-1">My Love Letter</span>
              <div className="bg-secondary/30 rounded-lg border border-primary/20 p-3 sm:p-4">
                <p className="text-base sm:text-lg font-handwriting text-foreground whitespace-pre-wrap leading-relaxed">
                  {cardData.message}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-primary/20" />
            <span className="text-primary text-xl animate-pulse-heart">♥</span>
            <div className="flex-1 h-px bg-primary/20" />
          </div>

          <div>
            <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider block mb-1">With all my love,</span>
            <p className="text-2xl sm:text-3xl font-handwriting text-foreground border-b-2 border-primary/30 py-2">
              {cardData.from || "Your Valentine"}
            </p>
          </div>
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

export default CardView;
