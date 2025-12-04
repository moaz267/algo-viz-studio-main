import { motion } from "framer-motion";

export const AnimatedBlobs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Cyan Blob */}
      <motion.div
        animate={{
          x: [0, 100, 50, 0],
          y: [0, -50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(187 92% 55% / 0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      
      {/* Purple Blob */}
      <motion.div
        animate={{
          x: [0, -80, 50, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 -right-1/4 w-[700px] h-[700px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, hsl(260 80% 60% / 0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      
      {/* Pink Blob */}
      <motion.div
        animate={{
          x: [0, 60, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, hsl(320 80% 55% / 0.4) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
    </div>
  );
};
