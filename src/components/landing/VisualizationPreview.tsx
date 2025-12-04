import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, ChevronRight } from "lucide-react";

const VisualizationPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--secondary)/0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            Live Preview
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See Algorithms <span className="gradient-text-secondary">In Action</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch real-time visualizations of how each algorithm processes jobs differently
          </p>
        </motion.div>

        {/* Preview Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative glass-card p-2 rounded-2xl overflow-hidden group">
            {/* Glow Effect */}
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl -z-10"
            />

            {/* Preview Content */}
            <div className="relative bg-background/80 backdrop-blur-sm rounded-xl overflow-hidden">
              {/* Mock Browser Bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-card/50 rounded-lg px-4 py-1.5 text-xs text-muted-foreground text-center">
                    algorithm-visualizer.app
                  </div>
                </div>
              </div>

              {/* Visualization Preview Area */}
              <div className="aspect-[16/9] p-6 relative">
                {/* Animated Visualization Preview */}
                <div className="absolute inset-6 grid grid-cols-2 gap-4">
                  {/* Greedy Side */}
                  <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-primary"
                      />
                      <span className="text-xs font-medium text-primary">Greedy</span>
                    </div>
                    {/* Animated Bars */}
                    <div className="flex-1 flex items-end gap-2">
                      {[60, 80, 45, 90, 70].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={isInView ? { height: `${height}%` } : {}}
                          transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                          className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </div>

                  {/* DP Side */}
                  <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                        className="w-2 h-2 rounded-full bg-secondary"
                      />
                      <span className="text-xs font-medium text-secondary">Dynamic</span>
                    </div>
                    {/* Animated Bars */}
                    <div className="flex-1 flex items-end gap-2">
                      {[75, 85, 50, 95, 80].map((height, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={isInView ? { height: `${height}%` } : {}}
                          transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                          className="flex-1 bg-gradient-to-t from-secondary to-secondary/50 rounded-t-sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Indicators */}
                <motion.div
                  animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs"
                >
                  Processing...
                </motion.div>
              </div>
            </div>

            {/* Hover Overlay */}
            <Link to="/visualizer">
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-opacity"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-4"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center"
                  >
                    <Play className="w-8 h-8 text-primary fill-primary" />
                  </motion.div>
                  <span className="text-lg font-semibold text-foreground">Click to Start</span>
                </motion.div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link to="/visualizer">
            <Button variant="glow" size="xl" className="group">
              Start Visualization
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default VisualizationPreview;
