import { motion } from "framer-motion";
import { Image, Palette, Grid3X3, Brain } from "lucide-react";

const steps = [
  {
    icon: Image,
    title: "Ảnh đầu vào",
    desc: "Ảnh màu kích thước bất kỳ, resize về 128×128 pixel",
  },
  {
    icon: Palette,
    title: "Color Histogram",
    desc: "Chuyển sang HSV, tính histogram 3 kênh (8×8×8 bins)",
  },
  {
    icon: Grid3X3,
    title: "LBP Texture",
    desc: "Trích xuất kết cấu bề mặt bằng Local Binary Pattern",
  },
  {
    icon: Brain,
    title: "SVM Classifier",
    desc: "Phân loại bằng SVM với kernel RBF, kết hợp 2 đặc trưng",
  },
];

const PipelineSection = () => {
  return (
    <section id="pipeline" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Quy trình xử lý
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Từ ảnh đầu vào đến kết quả phân loại qua 4 bước chính
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-background rounded-2xl p-8 text-center group hover:shadow-lg transition-shadow"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
              )}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <step.icon className="w-7 h-7" />
              </div>
              <div className="text-accent font-body text-sm font-semibold mb-2">
                Bước {i + 1}
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground font-body text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PipelineSection;
