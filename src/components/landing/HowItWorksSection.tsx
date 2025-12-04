import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Upload, Zap, Brain, BarChart2, Download } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    icon: Upload,
    title: "Input Jobs",
    description: "Enter your job scheduling data with deadlines and profits",
  },
  {
    icon: Zap,
    title: "Visualize Greedy",
    description: "Watch the greedy algorithm select jobs in real-time",
  },
  {
    icon: Brain,
    title: "Visualize DP",
    description: "See dynamic programming build optimal solutions step by step",
  },
  {
    icon: BarChart2,
    title: "Compare Results",
    description: "Analyze the differences in solutions and understand trade-offs",
  },
  {
    icon: Download,
    title: "Export & Replay",
    description: "Save your visualizations or replay for deeper understanding",
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Five simple steps to master algorithm visualization
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical Line */}
            <motion.div 
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              style={{ originY: 0 }}
              className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary/20" 
            />

            {/* Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className={`relative flex items-center gap-8 ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Content Card */}
                    <motion.div
                      whileHover={{ scale: 1.03, y: -3 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`flex-1 ml-20 md:ml-0 ${
                        index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                      }`}
                    >
                      <div className="glass-card-hover p-6 border border-border/50 hover:border-primary/30 hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)] transition-all duration-500">
                        <h3 className="text-xl font-bold mb-2 text-foreground">{step.title}</h3>
                        <p className="text-foreground/70">{step.description}</p>
                      </div>
                    </motion.div>

                    {/* Icon Circle */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: index * 0.15 + 0.2, type: "spring" }}
                      className="absolute left-0 md:left-1/2 -translate-x-0 md:-translate-x-1/2 z-10"
                    >
                      <div className="relative group">
                        {/* Glow */}
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                          className="absolute inset-0 rounded-full bg-primary blur-md"
                        />
                        {/* Icon Container */}
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          className="relative w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center group-hover:border-primary group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-all duration-300"
                        >
                          <Icon className="w-7 h-7 text-primary" />
                        </motion.div>
                        {/* Step Number */}
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center"
                        >
                          {index + 1}
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
