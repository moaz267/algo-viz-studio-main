import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw, ChevronRight } from "lucide-react";
import { useState } from "react";

const Visualizer = () => {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-lg font-bold gradient-text">Algorithm Visualizer</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button 
              variant={isRunning ? "outline" : "hero"} 
              size="sm"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Pause" : "Run"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Greedy Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <h2 className="text-xl font-bold text-primary">Greedy Algorithm</h2>
            </div>
            
            {/* Visualization Area */}
            <div className="aspect-video bg-background/50 rounded-xl border border-border/50 flex items-center justify-center mb-4">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-muted-foreground"
              >
                Greedy visualization will appear here
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Jobs Completed</p>
                <p className="text-2xl font-bold text-primary">0</p>
              </div>
              <div className="bg-background/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Profit</p>
                <p className="text-2xl font-bold text-primary">$0</p>
              </div>
            </div>
          </motion.div>

          {/* DP Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
              <h2 className="text-xl font-bold text-secondary">Dynamic Programming</h2>
            </div>
            
            {/* Visualization Area */}
            <div className="aspect-video bg-background/50 rounded-xl border border-border/50 flex items-center justify-center mb-4">
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="text-muted-foreground"
              >
                DP visualization will appear here
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Jobs Completed</p>
                <p className="text-2xl font-bold text-secondary">0</p>
              </div>
              <div className="bg-background/30 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Profit</p>
                <p className="text-2xl font-bold text-secondary">$0</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Job Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 glass-card p-6"
        >
          <h3 className="text-lg font-bold mb-4">Job Schedule Input</h3>
          <p className="text-muted-foreground mb-4">Add jobs with deadlines and profits to visualize the algorithms.</p>
          
          <div className="flex gap-4 flex-wrap">
            <Button variant="outline">Add Sample Jobs</Button>
            <Button variant="outline">Clear All</Button>
            <Button variant="glow">
              Compare Results
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Visualizer;
