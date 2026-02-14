import { useEffect, useState } from "react";

const HEART_CHARS = ["♥", "❤", "💕", "💗", "💖"];

interface FloatingHeart {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  char: string;
}

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    const isNarrow = typeof window !== "undefined" && window.innerWidth < 640;
    const count = isNarrow ? 10 : 20;
    const maxSize = isNarrow ? 18 : 24;
    const generated: FloatingHeart[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 10 + Math.random() * maxSize,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      char: HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)],
    }));
    setHearts(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute animate-float-heart text-primary opacity-0"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            animationIterationCount: "infinite",
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  );
};

export default FloatingHearts;
