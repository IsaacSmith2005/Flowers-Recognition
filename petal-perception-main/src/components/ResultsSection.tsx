import { motion } from "framer-motion";
import { BarChart3, Clock, Database, Target } from "lucide-react";

const stats = [
  { icon: Database, label: "Mẫu huấn luyện", value: "1,500", unit: "ảnh" },
  { icon: Target, label: "Độ chính xác", value: "54.33", unit: "%" },
  { icon: BarChart3, label: "Thuật toán", value: "SVM", unit: "RBF Kernel" },
  { icon: Clock, label: "Xử lý", value: "Nhanh", unit: "Thời gian thực" },
];

const ResultsSection = () => {
  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Kết quả thực nghiệm
          </h2>
          <p className="opacity-80 text-lg max-w-xl mx-auto font-body">
            Kết hợp đặc trưng màu sắc và kết cấu cho hiệu quả tốt hơn
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-4 opacity-70" />
              <div className="font-display text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm opacity-70 font-body">{stat.unit}</div>
              <div className="text-sm opacity-90 font-body font-semibold mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
