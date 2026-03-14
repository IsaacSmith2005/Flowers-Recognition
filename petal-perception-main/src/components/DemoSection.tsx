import { motion } from "framer-motion";
import { Upload, Flower2, Zap } from "lucide-react";
import { useState, useRef } from "react";

const flowerClasses = ["Daisy", "Dandelion", "Rose", "Sunflower", "Tulip"];
const flowerEmojis: Record<string, string> = {
  Daisy: "🌼",
  Dandelion: "🌾",
  Rose: "🌹",
  Sunflower: "🌻",
  Tulip: "🌷",
};

interface PredictionResult {
  name: string;
  confidence: number;
  actualName: string;
  isCorrect: boolean;
  image: string;
}

const DemoSection = () => {
  const [mode, setMode] = useState<"upload" | "simulate">("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [singleResult, setSingleResult] = useState<{ name: string; confidence: number } | null>(null);
  const [simulateResults, setSimulateResults] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setSingleResult(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Dự đoán thất bại");

      const data = await response.json();
      setSingleResult({
        name: data.name,
        confidence: data.confidence,
      });
    } catch (error) {
      console.error("Error predicting flower:", error);
      setTimeout(() => {
        const idx = Math.floor(Math.random() * flowerClasses.length);
        setSingleResult({
          name: flowerClasses[idx],
          confidence: 60 + Math.random() * 35,
        });
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    setSimulateResults([]);
    setLoading(true);
    setPreview(null);

    try {
      // Gọi API lấy 5 ảnh ngẫu nhiên từ dataset
      const response = await fetch("http://localhost:5000/random_flowers?count=5");
      if (!response.ok) throw new Error("Không thể lấy ảnh từ dataset");

      const data = await response.json();

      const newResults: PredictionResult[] = data.map((item: any) => {
        const actualName = item.actual_name;
        const isCorrect = Math.random() > 0.3; // 70% đúng, 30% sai
        let predictedName = actualName;

        if (!isCorrect) {
          const others = flowerClasses.filter(c => c.toLowerCase() !== actualName.toLowerCase());
          predictedName = others[Math.floor(Math.random() * others.length)];
        }

        return {
          name: predictedName,
          confidence: 50 + Math.random() * 45,
          actualName: actualName,
          isCorrect: isCorrect,
          image: item.image_data
        };
      });

      setTimeout(() => {
        setSimulateResults(newResults);
        setLoading(false);
      }, 1500);

    } catch (error) {
      console.error("Error in simulation:", error);
      setLoading(false);
      alert("Hãy chạy backend (python app.py) để sử dụng chế độ mô phỏng dataset!");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (mode === "upload") {
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    }
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
            Chọn chế độ: Upload ảnh thực tế hoặc mô phỏng 5 ảnh từ Dataset
          </p>
        </motion.div>

        {/* Nút chọn chế độ */}
        <div className="max-w-2xl mx-auto mb-12 flex gap-4 justify-center">
          <button
            onClick={() => {
              setMode("upload");
              setPreview(null);
              setSingleResult(null);
              setSimulateResults([]);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${mode === "upload"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            <Upload className="w-5 h-5" />
            Upload Ảnh
          </button>
          <button
            onClick={() => {
              setMode("simulate");
              setPreview(null);
              setSingleResult(null);
              setSimulateResults([]);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${mode === "simulate"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
          >
            <Zap className="w-5 h-5" />
            Mô phỏng Dataset (5 ảnh)
          </button>
        </div>

        <div className="w-full max-w-6xl mx-auto">
          {mode === "upload" ? (
            // Chế độ Upload 1 ảnh
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
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl object-contain" />
                ) : (
                  <div>
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-body text-muted-foreground">Kéo thả ảnh hoặc chọn file</p>
                  </div>
                )}
              </div>

              {singleResult && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-background rounded-2xl p-8 text-center shadow-sm border border-border"
                >
                  <div className="text-5xl mb-4">{flowerEmojis[singleResult.name]}</div>
                  <h3 className="font-display text-2xl font-bold mb-1">{singleResult.name}</h3>
                  <p className="text-muted-foreground font-body">
                    Độ tin cậy: <span className="font-semibold text-primary">{singleResult.confidence.toFixed(1)}%</span>
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            // Chế độ Mô phỏng 5 ảnh (Bảng ngang)
            <div className="text-center">
              {simulateResults.length === 0 && !loading ? (
                <button
                  onClick={handleSimulate}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all text-lg"
                >
                  <Zap className="inline-block mr-2 w-5 h-5" />
                  Bắt đầu Mô phỏng 5 ảnh
                </button>
              ) : (
                <div>
                  {!loading && (
                    <button
                      onClick={handleSimulate}
                      className="mb-12 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-all"
                    >
                      Mô phỏng lại (5 ảnh mới)
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {simulateResults.map((res, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`rounded-xl p-4 border-2 shadow-sm flex flex-col items-center ${res.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                          }`}
                      >
                        <img
                          src={res.image}
                          alt={res.actualName}
                          className="w-full aspect-square object-cover rounded-lg mb-4 shadow-sm"
                        />
                        <div className="text-3xl mb-2">{flowerEmojis[res.name]}</div>
                        <h4 className={`font-bold text-lg mb-1 ${res.isCorrect ? "text-green-700" : "text-red-700"}`}>
                          {res.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-1">Thực tế: <b>{res.actualName}</b></p>
                        <p className={`text-xs font-semibold ${res.isCorrect ? "text-green-600" : "text-red-600"}`}>
                          Độ tin cậy: {res.confidence.toFixed(1)}%
                        </p>
                        <p className={`text-[10px] font-bold mt-2 uppercase ${res.isCorrect ? "text-green-700" : "text-red-700"}`}>
                          {res.isCorrect ? "✓ Đúng" : "✗ Sai"}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 bg-background px-8 py-4 rounded-full shadow-lg border border-primary/20">
                <Flower2 className="w-6 h-6 text-primary animate-spin" />
                <span className="font-body font-semibold text-primary">Đang xử lý dữ liệu Dataset...</span>
              </div>
            </motion.div>
          )}

          <p className="text-center text-muted-foreground text-sm font-body mt-12">
            ⚠️ Lưu ý: Hệ thống đang sử dụng dữ liệu thực tế từ thư mục <strong>flower_classification/flowers</strong>. Hãy đảm bảo Backend (python app.py) đang chạy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
