import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Code2, Lightbulb, ArrowRight } from "lucide-react";

const topics = [
  {
    title: "What is Greedy Algorithm?",
    icon: Lightbulb,
    content: "A greedy algorithm makes the locally optimal choice at each step, hoping to find a global optimum. It's fast but may not always find the best solution.",
    color: "primary",
  },
  {
    title: "What is Dynamic Programming?",
    icon: Code2,
    content: "Dynamic Programming breaks complex problems into simpler subproblems, solving each once and storing results. It guarantees finding the optimal solution.",
    color: "secondary",
  },
  {
    title: "Job Scheduling Problem",
    icon: BookOpen,
    content: "Given a set of jobs with deadlines and profits, select jobs to maximize profit while meeting deadlines. This classic problem demonstrates the difference between approaches.",
    color: "primary",
  },
];

const Explanation = () => {
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
          <h1 className="text-lg font-bold gradient-text">Learn Algorithms</h1>
          <Link to="/visualizer">
            <Button variant="hero" size="sm" className="gap-2">
              Try Visualizer
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1)_0%,transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Understanding <span className="gradient-text">Algorithm Paradigms</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn the fundamental differences between Greedy and Dynamic Programming approaches,
              and when to use each one.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Topics */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="space-y-8 max-w-4xl mx-auto">
            {topics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <motion.div
                  key={topic.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card-hover p-8"
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-4 rounded-xl bg-${topic.color}/10`}>
                      <Icon className={`w-8 h-8 text-${topic.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{topic.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{topic.content}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to See It in Action?</h2>
            <p className="text-muted-foreground mb-8">
              Watch both algorithms solve the same problem side by side.
            </p>
            <Link to="/visualizer">
              <Button variant="glow" size="xl">
                Open Visualizer
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Explanation;
