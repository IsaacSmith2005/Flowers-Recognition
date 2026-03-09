import { motion } from "framer-motion";
import heroImage from "@/assets/hero-flowers.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Botanical flowers illustration"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <p className="text-accent font-body font-semibold tracking-widest uppercase text-sm mb-4">
            Đề tài Xử lý Ảnh
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            Phân loại Hoa
            <span className="block text-primary">dựa trên Màu sắc & Kết cấu</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-8 font-body">
            Sử dụng SVM kết hợp Color Histogram (HSV) và Local Binary Pattern (LBP)
            để nhận diện 5 loại hoa: Daisy, Dandelion, Rose, Sunflower, Tulip.
          </p>
          <div className="flex gap-4">
            <a
              href="#pipeline"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-body font-semibold hover:opacity-90 transition-opacity"
            >
              Xem quy trình
            </a>
            <a
              href="#demo"
              className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-body font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Demo thử
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
