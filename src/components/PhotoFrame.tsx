import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";

interface PhotoFrameProps {
  label?: string;
}

const PhotoFrame = ({ label = "Add Photo" }: PhotoFrameProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, rotate: Math.random() > 0.5 ? 1 : -1 }}
      className="relative w-48 h-48 rounded-lg border-4 border-dashed border-primary/30 bg-secondary/50 flex items-center justify-center cursor-pointer overflow-hidden group transition-colors hover:border-primary/60"
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {preview ? (
        <img
          src={preview}
          alt="Uploaded"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
          <ImagePlus className="w-8 h-8" />
          <span className="text-sm font-medium">{label}</span>
        </div>
      )}
      <span className="absolute -top-2 -right-2 text-primary text-lg animate-pulse-heart">
        ♥
      </span>
    </motion.div>
  );
};

export default PhotoFrame;
