import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import FloatingHearts from "@/components/FloatingHearts";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

interface CardData {
  to: string;
  from: string;
  message: string;
  photos: string[];
}

const CardView = () => {
  const [searchParams] = useSearchParams();

  const cardData = useMemo<CardData | null>(() => {
    try {
      const id = searchParams.get("id");
      if (!id) return null;
      const stored = localStorage.getItem(`valentine-${id}`);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }, [searchParams]);

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center font-handwriting">
          <Heart className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse-heart fill-primary" />
          <h1 className="text-4xl text-primary mb-2">Oops!</h1>
          <p className="text-muted-foreground text-xl">This love letter seems to have gotten lost 💔</p>
          <p className="text-muted-foreground text-sm mt-2">The card may only be viewable on the device it was created on.</p>
        </div>
      </div>
    );
  }

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
            Someone special made this for you ♥
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
            <span className="text-sm text-muted-foreground uppercase tracking-wider block mb-1">To</span>
            <p className="text-3xl font-handwriting text-foreground border-b-2 border-primary/30 py-2">
              {cardData.to || "My Love"}
            </p>
          </div>

          {cardData.photos.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 my-8">
              {cardData.photos.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotate: -3 }}
                  animate={{ opacity: 1, rotate: i % 2 === 0 ? 2 : -2 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className="relative w-48 h-48 rounded-lg border-4 border-primary/20 overflow-hidden shadow-lg"
                >
                  <img src={src} alt={`Memory ${i + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute -top-2 -right-2 text-primary text-lg animate-pulse-heart">♥</span>
                </motion.div>
              ))}
            </div>
          )}

          {cardData.message && (
            <div className="mb-6">
              <span className="text-sm text-muted-foreground uppercase tracking-wider block mb-1">My Love Letter</span>
              <div className="bg-secondary/30 rounded-lg border border-primary/20 p-4">
                <p className="text-lg font-handwriting text-foreground whitespace-pre-wrap leading-relaxed">
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
            <span className="text-sm text-muted-foreground uppercase tracking-wider block mb-1">With all my love,</span>
            <p className="text-3xl font-handwriting text-foreground border-b-2 border-primary/30 py-2">
              {cardData.from || "Your Valentine"}
            </p>
          </div>
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

export default CardView;
