import { motion } from "framer-motion";

const flowers = [
  { name: "Daisy", vi: "Hoa Cúc", color: "bg-flower-daisy", emoji: "🌼" },
  { name: "Dandelion", vi: "Bồ Công Anh", color: "bg-flower-dandelion", emoji: "🌾" },
  { name: "Rose", vi: "Hoa Hồng", color: "bg-flower-rose", emoji: "🌹" },
  { name: "Sunflower", vi: "Hoa Hướng Dương", color: "bg-flower-sunflower", emoji: "🌻" },
  { name: "Tulip", vi: "Hoa Tulip", color: "bg-flower-tulip", emoji: "🌷" },
];

const FlowersSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            5 loại hoa nhận diện
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-body">
            Hệ thống phân loại 5 loại hoa phổ biến với đặc trưng riêng biệt
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {flowers.map((flower, i) => (
            <motion.div
              key={flower.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div
                className={`${flower.color} rounded-2xl aspect-square flex items-center justify-center text-6xl group-hover:scale-105 transition-transform shadow-sm`}
              >
                {flower.emoji}
              </div>
              <div className="mt-3 text-center">
                <p className="font-display font-semibold text-lg">{flower.name}</p>
                <p className="text-muted-foreground font-body text-sm">{flower.vi}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlowersSection;
