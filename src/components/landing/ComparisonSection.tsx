import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Brain, Clock, Target, TrendingUp, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AlgorithmData {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  description: string;
  features: Array<{
    icon: LucideIcon;
    label: string;
    value: string;
  }>;
}

const algorithmData: Record<string, AlgorithmData> = {
  greedy: {
    title: "Greedy",
    subtitle: "Fast & Efficient",
    icon: Zap,
    color: "primary",
    description: "Makes the locally optimal choice at each step. Quick execution but may miss the global optimum.",
    features: [
      { icon: Clock, label: "Time Complexity", value: "O(n log n)" },
      { icon: Layers, label: "Space", value: "O(1)" },
      { icon: TrendingUp, label: "Speed", value: "Very Fast" },
    ],
  },
  dynamic: {
    title: "Dynamic",
    subtitle: "Optimal Solution",
    icon: Brain,
    color: "secondary",
    description: "Breaks problems into subproblems and stores solutions. Guaranteed to find the best answer.",
    features: [
      { icon: Clock, label: "Time Complexity", value: "O(n²)" },
      { icon: Layers, label: "Space", value: "O(n)" },
      { icon: Target, label: "Result", value: "Optimal" },
    ],
  },
};

const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.05)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            Algorithm Comparison
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Side-by-Side <span className="gradient-text">Analysis</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how these two approaches stack up against each other
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Greedy Card */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <AlgorithmCard data={algorithmData.greedy} />
          </motion.div>

          {/* Dynamic Card */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <AlgorithmCard data={algorithmData.dynamic} />
          </motion.div>
        </div>

        {/* VS Badge
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5, type: "spring" }}
          className="absolute right-1/2 top-1/2 -translate-x-1/2 translate-y-8 hidden md:flex z-20"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/30rounded-full blur-xl" />
            <div className="relative glass-card px-6 py-4 rounded-full border-primary/30">
              <span className="text-2xl font-bold gradient-text">VS</span>
            </div>
          </motion.div>
        </motion.div> */}
      </div>
    </section>
  );
};

interface AlgorithmCardProps {
  data: AlgorithmData;
}

const AlgorithmCard = ({ data }: AlgorithmCardProps) => {
  const Icon = data.icon;
  const colorClass = data.color === "primary" ? "text-primary" : "text-secondary";
  const bgColorClass = data.color === "primary" ? "bg-primary/10" : "bg-secondary/10";
  const borderColorClass = data.color === "primary" ? "hover:border-primary/50" : "hover:border-secondary/50";
  const glowColor = data.color === "primary" 
    ? "hover:shadow-[0_0_40px_hsl(var(--primary)/0.2)]" 
    : "hover:shadow-[0_0_40px_hsl(var(--secondary)/0.2)]";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative glass-card p-8 h-full border border-border/50 ${borderColorClass} ${glowColor} transition-all duration-500`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          className={`p-3 rounded-xl ${bgColorClass}`}
        >
          <Icon className={`w-7 h-7 ${colorClass}`} />
        </motion.div>
        <div>
          <h3 className={`text-2xl font-bold ${colorClass}`}>{data.title}</h3>
          <p className="text-sm text-muted-foreground">{data.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-foreground/80 mb-8 leading-relaxed">
        {data.description}
      </p>

      {/* Features */}
      <div className="space-y-4">
        {data.features.map((feature, idx) => {
          const FeatureIcon = feature.icon;
          return (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl bg-background/30 group-hover:bg-background/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FeatureIcon className={`w-4 h-4 ${colorClass}`} />
                <span className="text-sm text-foreground/70">{feature.label}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{feature.value}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Decorative Element */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-4 right-4 w-20 h-20 opacity-5"
        style={{
          background: `conic-gradient(from 0deg, hsl(var(--${data.color})), transparent)`,
          borderRadius: "50%",
        }}
      />
    </motion.div>
  );
};

export default ComparisonSection;
