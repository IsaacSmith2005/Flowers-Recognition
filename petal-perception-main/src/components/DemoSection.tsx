import { motion } from "framer-motion";
import { Upload, Flower2 } from "lucide-react";
import { useState, useRef } from "react";

const flowerClasses = ["Daisy", "Dandelion", "Rose", "Sunflower", "Tulip"];
const flowerEmojis: Record<string, string> = {
  Daisy: "🌼",
  Dandelion: "🌾",
  Rose: "🌹",
  Sunflower: "🌻",
  Tulip: "🌷",
};

const DemoSection = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<{ name: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setResult(null);
      // Simulate prediction
      setLoading(true);
      setTimeout(() => {
        const idx = Math.floor(Math.random() * flowerClasses.length);
        setResult({
          name: flowerClasses[idx],
          confidence: 60 + Math.random() * 35,
        });
        setLoading(false);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <section id="demo" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Demo thử nghiệm
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Upload ảnh hoa để xem kết quả phân loại (mô phỏng)
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary transition-colors bg-background"
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            {preview ? (
              <img
                src={preview}
                alt="Uploaded flower"
                className="max-h-64 mx-auto rounded-xl object-contain"
              />
            ) : (
              <div>
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="font-body text-muted-foreground">
                  Kéo thả ảnh vào đây hoặc <span className="text-primary font-semibold">chọn file</span>
                </p>
              </div>
            )}
          </div>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-3 bg-background px-6 py-3 rounded-full shadow-sm">
                <Flower2 className="w-5 h-5 text-primary animate-spin" />
                <span className="font-body text-muted-foreground">Đang phân tích...</span>
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-background rounded-2xl p-8 text-center shadow-sm"
            >
              <div className="text-5xl mb-4">{flowerEmojis[result.name]}</div>
              <h3 className="font-display text-2xl font-bold mb-1">{result.name}</h3>
              <p className="text-muted-foreground font-body">
                Độ tin cậy: <span className="font-semibold text-primary">{result.confidence.toFixed(1)}%</span>
              </p>
              <div className="mt-4 w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
            </motion.div>
          )}

          <p className="text-center text-muted-foreground text-sm font-body mt-6">
            ⚠️ Đây là bản demo mô phỏng. Model thực tế chạy trên Python với OpenCV + scikit-learn.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
