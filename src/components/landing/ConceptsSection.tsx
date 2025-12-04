import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Zap, Brain } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ConceptItem {
  title: string;
  icon: LucideIcon;
  description: string;
  color: string;
  gradient: string;
  features: string[];
}

const concepts: ConceptItem[] = [
  {
    title: "Greedy Algorithm",
    icon: Zap,
    description: "Makes locally optimal choices at each step, hoping to find a global optimum. Fast but may miss the best solution.",
    color: "primary",
    gradient: "from-primary/20 to-primary/5",
    features: ["Fast execution", "Simple logic", "Local optimization"],
  },
  {
    title: "Dynamic Programming",
    icon: Brain,
    description: "Breaks problems into overlapping subproblems, solving each once and storing results. Guaranteed optimal solution.",
    color: "secondary",
    gradient: "from-secondary/20 to-secondary/5",
    features: ["Optimal solution", "Memoization", "Subproblem breakdown"],
  },
];

const ConceptsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Two Powerful <span className="gradient-text">Paradigms</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Understand the fundamental differences between these algorithmic approaches
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {concepts.map((concept, index) => (
            <motion.div
              key={concept.title}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.2 }}
            >
              <ConceptCard concept={concept} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface ConceptCardProps {
  concept: ConceptItem;
}

const ConceptCard = ({ concept }: ConceptCardProps) => {
  const Icon = concept.icon;
  const colorClass = concept.color === "primary" ? "text-primary" : "text-secondary";
  const bgColorClass = concept.color === "primary" ? "bg-primary/10" : "bg-secondary/10";
  const dotColorClass = concept.color === "primary" ? "bg-primary" : "bg-secondary";
  const borderColorClass = concept.color === "primary" ? "hover:border-primary/40" : "hover:border-secondary/40";
  const glowColor = concept.color === "primary" 
    ? "hover:shadow-[0_0_50px_hsl(var(--primary)/0.25)]" 
    : "hover:shadow-[0_0_50px_hsl(var(--secondary)/0.25)]";
  
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`group relative glass-card p-8 h-full border border-border/50 ${borderColorClass} ${glowColor} transition-all duration-500`}
    >
      {/* Glow Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-2xl -z-10"
        style={{
          background: `radial-gradient(circle at 50% 0%, hsl(var(--${concept.color}) / 0.15) 0%, transparent 60%)`,
        }}
      />
      
      {/* Icon */}
      <motion.div 
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}
        className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${concept.gradient} mb-6`}
      >
        <Icon className={`w-8 h-8 ${colorClass}`} />
      </motion.div>
      
      {/* Content */}
      <h3 className="text-2xl font-bold mb-3 text-foreground">{concept.title}</h3>
      <p className="text-foreground/70 mb-6 leading-relaxed">
        {concept.description}
      </p>
      
      {/* Features */}
      <div className="space-y-3">
        {concept.features.map((feature, idx) => (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center gap-3"
          >
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
              className={`w-2 h-2 rounded-full ${dotColorClass}`} 
            />
            <span className="text-sm text-foreground/80">{feature}</span>
          </motion.div>
        ))}
      </div>

      {/* Animated Corner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-4 right-4 w-16 h-16 opacity-10"
        style={{
          background: `conic-gradient(from 0deg, hsl(var(--${concept.color})), transparent)`,
          borderRadius: "50%",
        }}
      />
    </motion.div>
  );
};

export default ConceptsSection;
