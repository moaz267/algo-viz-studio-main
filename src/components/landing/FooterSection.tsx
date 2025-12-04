import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, Code2, ArrowRight } from "lucide-react";

const FooterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="relative py-20 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-card/50 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.1)_0%,transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center gap-3 mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Code2 className="w-8 h-8 text-primary" />
            </motion.div>
            <span className="text-2xl font-bold text-foreground">AlgoViz</span>
          </motion.div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Making algorithm learning visual, interactive, and fun.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link to="https://github.com/moaz267/algo-viz-studio-main.git">
          <Button
            variant="outline"
            size="lg"
            className="group"
          >
            <Github className="w-5 h-5" />
            View on GitHub
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
          </Link>
          <Link to="/explanation">
            <Button
              variant="outline"
              size="lg"
              className="group"
            >
              About the Project
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground"
        >
          <p>© 2026 algorithm project </p>
          <p>© all right reverse to Moaz elhenawy 2026 </p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors duration-300">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors duration-300">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors duration-300">Contact</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterSection;
