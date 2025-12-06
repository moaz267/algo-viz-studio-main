import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Code2, Lightbulb, ArrowRight, Zap, Brain, Scale, CheckCircle, XCircle, Clock, Target } from "lucide-react";
import { useState, useEffect } from "react";

// Animated DP Table Component
const AnimatedDPTable = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const items = [
    { id: 1, weight: 10, value: 60 },
    { id: 2, weight: 20, value: 100 },
    { id: 3, weight: 30, value: 120 },
  ];
  const capacity = 50;
  
  // Pre-calculated DP table steps
  const dpSteps = [
    { row: 0, description: "Initialize: All zeros (no items)" },
    { row: 1, description: "Item 1 (W:10, V:60): Can we fit it?" },
    { row: 2, description: "Item 2 (W:20, V:100): Better combinations?" },
    { row: 3, description: "Item 3 (W:30, V:120): Find optimal!" },
  ];

  // Full DP table values
  const fullTable = [
    [0, 0, 0, 0, 0, 0],  // 0 items
    [0, 0, 60, 60, 60, 60],  // Item 1
    [0, 0, 60, 100, 160, 160],  // Items 1,2
    [0, 0, 60, 100, 160, 220],  // Items 1,2,3
  ];
  
  const capacityHeaders = [0, 10, 20, 30, 40, 50];

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= dpSteps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setCurrentStep(prev => prev + 1), 2000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, dpSteps.length]);

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="bg-background/50 rounded-xl p-6 border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">DP Table Construction</h4>
        <Button size="sm" variant="outline" onClick={resetAnimation}>
          {isPlaying ? "Playing..." : "Play Animation"}
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        {dpSteps[currentStep]?.description}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left">Item</th>
              {capacityHeaders.map(cap => (
                <th key={cap} className="p-2 text-center min-w-[50px]">
                  W={cap}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fullTable.map((row, rowIdx) => (
              <motion.tr 
                key={rowIdx}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: rowIdx <= currentStep ? 1 : 0.3,
                  backgroundColor: rowIdx === currentStep ? "hsl(var(--secondary) / 0.1)" : "transparent"
                }}
                transition={{ duration: 0.5 }}
              >
                <td className="p-2 font-medium">
                  {rowIdx === 0 ? "None" : `Item ${rowIdx}`}
                </td>
                {row.map((val, colIdx) => (
                  <motion.td
                    key={colIdx}
                    className="p-2 text-center"
                    initial={{ scale: 1 }}
                    animate={{
                      scale: rowIdx === currentStep ? [1, 1.1, 1] : 1,
                      color: val > 0 && rowIdx <= currentStep ? "hsl(var(--secondary))" : "inherit"
                    }}
                    transition={{ duration: 0.3, delay: colIdx * 0.05 }}
                  >
                    <span className={`inline-block px-2 py-1 rounded ${
                      rowIdx <= currentStep 
                        ? val > 0 ? "bg-secondary/20" : "bg-background/50"
                        : "bg-background/20"
                    }`}>
                      {rowIdx <= currentStep ? val : "?"}
                    </span>
                  </motion.td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
        <p className="text-sm">
          <strong className="text-secondary">Optimal Solution:</strong> Items 2 & 3 
          <span className="text-muted-foreground"> (W:20+30=50, V:$100+$120=</span>
          <span className="text-secondary font-bold">$220</span>
          <span className="text-muted-foreground">)</span>
        </p>
      </div>
    </div>
  );
};

// Decision Tree Visualization
const DecisionTree = () => {
  return null;
};

const Explanation = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Home
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
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1)_0%,transparent_50%)]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Understanding the <span className="gradient-text">knapsack 0/1  Problem</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Learn the difference between Greedy and Dynamic Programming through the classic knapsack 0/1 Problem
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problem Definition */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 max-w-4xl mx-auto"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary/10">
                <Scale className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">What is the knapsack 0/1 Problem?</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Imagine you have a backpack with limited capacity and a set of items, each with a weight and value.
              The goal is to select items that give you the maximum total value without exceeding the backpack capacity.
            </p>
            <div className="bg-background/50 rounded-xl p-4 border border-border/50">
              <p className="font-mono text-sm">
                <span className="text-primary">Given:</span> n items, each with (weight, value), Capacity = W
                <br />
                <span className="text-secondary">Find:</span> Select items where total weight ≤ W and total value is maximized
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Greedy Algorithm */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card-hover p-8 border-l-4 border-primary">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-primary">Greedy Algorithm</h2>
                  <p className="text-sm text-muted-foreground">Make the locally optimal choice at each step</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Core Idea
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Greedy algorithm makes the best decision at the current moment without looking ahead.
                    For knapsack 0/1, we calculate the value/weight ratio for each item and pick items 
                    with the highest ratio first.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    Algorithm Steps
                  </h3>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm flex-shrink-0">1</span>
                      <span>Calculate value/weight ratio for each item</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm flex-shrink-0">2</span>
                      <span>Sort items by ratio in descending order</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm flex-shrink-0">3</span>
                      <span>Pick items in order while capacity allows</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    Time Complexity
                  </h3>
                  <p className="font-mono text-primary">O(n log n)</p>
                  <p className="text-xs text-muted-foreground mt-1">Due to sorting</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Advantages
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Very fast execution</li>
                      <li>• Simple to understand and implement</li>
                      <li>• Uses minimal memory</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-400">
                      <XCircle className="w-4 h-4" />
                      Disadvantages
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Does NOT guarantee optimal solution</li>
                      <li>• May miss better combinations</li>
                      <li>• Not suitable for 0/1 knapsack 0/1</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Programming */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card-hover p-8 border-l-4 border-secondary">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-secondary/10">
                  <Brain className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-secondary">Dynamic Programming</h2>
                  <p className="text-sm text-muted-foreground">Divide and conquer with memoization</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-secondary" />
                    Core Idea
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Dynamic Programming breaks the large problem into smaller subproblems, 
                    solves each subproblem once and stores the result. This guarantees finding 
                    the optimal solution by intelligently exploring all possibilities.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-secondary" />
                    Algorithm Steps
                  </h3>
                  <ol className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm flex-shrink-0">1</span>
                      <span>Create DP table of dimensions (n+1) × (W+1)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm flex-shrink-0">2</span>
                      <span>For each item and capacity: Take it or skip it?</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm flex-shrink-0">3</span>
                      <span className="font-mono text-xs">dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm flex-shrink-0">4</span>
                      <span>Backtrack to find selected items</span>
                    </li>
                  </ol>
                </div>

                {/* Animated DP Table */}
                <AnimatedDPTable />

                {/* Decision Tree */}
                
                <div className="bg-background/50 rounded-xl p-4 border border-border/50">
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-secondary" />
                    Time & Space Complexity
                  </h3>
                  <p className="font-mono text-secondary">O(n × W)</p>
                  <p className="text-xs text-muted-foreground mt-1">Where n = number of items, W = capacity</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Advantages
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Guarantees optimal solution</li>
                      <li>• Explores all possibilities</li>
                      <li>• Avoids redundant calculations</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-400">
                      <XCircle className="w-4 h-4" />
                      Disadvantages
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Slower than Greedy</li>
                      <li>• Uses more memory</li>
                      <li>• More complex to implement</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Quick Comparison</h2>
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead className="bg-background/50">
                  <tr>
                    <th className="p-4 text-left">Criteria</th>
                    <th className="p-4 text-center text-primary">Greedy</th>
                    <th className="p-4 text-center text-secondary">Dynamic Programming</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="p-4 font-medium">Time Complexity</td>
                    <td className="p-4 text-center font-mono text-primary">O(n log n)</td>
                    <td className="p-4 text-center font-mono text-secondary">O(n × W)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Space Complexity</td>
                    <td className="p-4 text-center text-primary">O(1)</td>
                    <td className="p-4 text-center text-secondary">O(n × W)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Guarantees Optimal</td>
                    <td className="p-4 text-center">
                      <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Implementation</td>
                    <td className="p-4 text-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Example */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Practical Example</h2>
              </div>

              <div className="bg-background/50 rounded-xl p-4 border border-border/50 mb-6">
                <p className="mb-2"><strong>knapsack 0/1 Capacity:</strong> 50 units</p>
                <p className="mb-4"><strong>Available Items:</strong></p>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="bg-background/50 rounded p-3">
                    <div className="font-bold">Item 1</div>
                    <div>Weight: 10, Value: $60</div>
                    <div className="text-xs text-primary mt-1">Ratio: 6.0</div>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <div className="font-bold">Item 2</div>
                    <div>Weight: 20, Value: $100</div>
                    <div className="text-xs text-primary mt-1">Ratio: 5.0</div>
                  </div>
                  <div className="bg-background/50 rounded p-3">
                    <div className="font-bold">Item 3</div>
                    <div>Weight: 30, Value: $120</div>
                    <div className="text-xs text-primary mt-1">Ratio: 4.0</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                  <h4 className="font-bold text-primary mb-2">Greedy Result</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Order by ratio: 1 → 2 → 3
                  </p>
                  <p className="text-sm">
                    Picks: Item 1 (W:10) + Item 2 (W:20) = 30
                  </p>
                  <p className="text-sm">
                    Item 3 (W:30) would exceed capacity (30+30=60 &gt; 50)
                  </p>
                  <p className="font-bold mt-2">
                    Weight: 30/50 | Value: <span className="text-primary">$160</span>
                  </p>
                </div>
                <div className="bg-secondary/10 rounded-xl p-4 border border-secondary/20">
                  <h4 className="font-bold text-secondary mb-2">DP Result</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Explores all combinations optimally
                  </p>
                  <p className="text-sm">
                    Finds: Item 2 (W:20) + Item 3 (W:30) = 50
                  </p>
                  <p className="text-sm">
                    Skips Item 1 for better combination!
                  </p>
                  <p className="font-bold mt-2">
                    Weight: 50/50 | Value: <span className="text-secondary">$220</span>
                  </p>
                </div>
              </div>
              
              <motion.div 
                initial={{ scale: 0.95 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="mt-6 p-4 bg-secondary/10 rounded-xl border border-secondary/20 text-center"
              >
                <p className="text-secondary font-bold text-lg">
                  DP beats Greedy by $60! (+37.5%)
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Greedy picked the highest ratio items but missed the optimal combination
                </p>
              </motion.div>
            </div>
          </motion.div>
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
            <h2 className="text-2xl font-bold mb-4">Try It Yourself!</h2>
            <p className="text-muted-foreground mb-8">
              Watch both algorithms solve the same problem side by side
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
