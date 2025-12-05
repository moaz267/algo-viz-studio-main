import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Trash2, Package, Scale } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Item {
  id: number;
  weight: number;
  value: number;
  ratio: number;
}

interface TreeNode {
  id: string;
  itemId: number | null;
  included: boolean;
  weight: number;
  value: number;
  children: TreeNode[];
  isOptimal?: boolean;
  isCurrent?: boolean;
}

interface Step {
  selectedItems: number[];
  currentItem: number | null;
  totalWeight: number;
  totalValue: number;
  message: string;
  tree?: TreeNode;
}

const Visualizer = () => {
  // Items that show difference between Greedy and DP
  const [items, setItems] = useState<Item[]>([
    { id: 1, weight: 10, value: 60, ratio: 6 },
    { id: 2, weight: 20, value: 100, ratio: 5 },
    { id: 3, weight: 30, value: 120, ratio: 4 },
  ]);
  const [capacity, setCapacity] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [greedySteps, setGreedySteps] = useState<Step[]>([]);
  const [dpSteps, setDpSteps] = useState<Step[]>([]);
  const [greedyResult, setGreedyResult] = useState({ items: [] as number[], value: 0, weight: 0 });
  const [dpResult, setDpResult] = useState({ items: [] as number[], value: 0, weight: 0 });
  const [newWeight, setNewWeight] = useState("");
  const [newValue, setNewValue] = useState("");

  // Build decision tree for visualization
  const buildDecisionTree = useCallback((
    itemIndex: number,
    currentWeight: number,
    currentValue: number,
    selectedItems: number[],
    optimalPath: number[]
  ): TreeNode | null => {
    if (itemIndex >= items.length) return null;

    const item = items[itemIndex];
    const nodeId = `${itemIndex}-${currentWeight}`;

    const excludeChild = buildDecisionTree(
      itemIndex + 1,
      currentWeight,
      currentValue,
      selectedItems,
      optimalPath
    );

    let includeChild: TreeNode | null = null;
    if (currentWeight + item.weight <= capacity) {
      includeChild = buildDecisionTree(
        itemIndex + 1,
        currentWeight + item.weight,
        currentValue + item.value,
        [...selectedItems, item.id],
        optimalPath
      );
    }

    const children: TreeNode[] = [];
    if (excludeChild) children.push(excludeChild);
    if (includeChild) children.push(includeChild);

    return {
      id: nodeId,
      itemId: item.id,
      included: selectedItems.includes(item.id),
      weight: currentWeight,
      value: currentValue,
      children,
      isOptimal: optimalPath.includes(item.id),
    };
  }, [items, capacity]);

  // Greedy Algorithm
  const runGreedy = useCallback(() => {
    const sortedItems = [...items].sort((a, b) => b.ratio - a.ratio);
    const steps: Step[] = [];
    const selected: number[] = [];
    let totalWeight = 0;
    let totalValue = 0;

    steps.push({
      selectedItems: [],
      currentItem: null,
      totalWeight: 0,
      totalValue: 0,
      message: "Starting Greedy - Sorting items by value/weight ratio"
    });

    for (const item of sortedItems) {
      steps.push({
        selectedItems: [...selected],
        currentItem: item.id,
        totalWeight,
        totalValue,
        message: `Checking Item ${item.id}: W=${item.weight}, V=${item.value}, Ratio=${item.ratio.toFixed(2)}`
      });

      if (totalWeight + item.weight <= capacity) {
        selected.push(item.id);
        totalWeight += item.weight;
        totalValue += item.value;
        steps.push({
          selectedItems: [...selected],
          currentItem: item.id,
          totalWeight,
          totalValue,
          message: `✓ Selected Item ${item.id} - Total Weight: ${totalWeight}/${capacity}`
        });
      } else {
        steps.push({
          selectedItems: [...selected],
          currentItem: item.id,
          totalWeight,
          totalValue,
          message: `✗ Exceeds capacity - Skipping Item ${item.id}`
        });
      }
    }

    steps.push({
      selectedItems: [...selected],
      currentItem: null,
      totalWeight,
      totalValue,
      message: `Greedy Complete! Total Value: $${totalValue}`
    });

    return { steps, result: { items: selected, value: totalValue, weight: totalWeight } };
  }, [items, capacity]);

  // Dynamic Programming Algorithm
  const runDP = useCallback(() => {
    const n = items.length;
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    const steps: Step[] = [];

    steps.push({
      selectedItems: [],
      currentItem: null,
      totalWeight: 0,
      totalValue: 0,
      message: "Starting DP - Building solution table"
    });

    for (let i = 1; i <= n; i++) {
      const item = items[i - 1];
      for (let w = 0; w <= capacity; w++) {
        if (item.weight <= w) {
          dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - item.weight] + item.value);
        } else {
          dp[i][w] = dp[i - 1][w];
        }
      }
      steps.push({
        selectedItems: [],
        currentItem: item.id,
        totalWeight: 0,
        totalValue: dp[i][capacity],
        message: `Processing Item ${item.id} - Best value so far: $${dp[i][capacity]}`
      });
    }

    const selected: number[] = [];
    let w = capacity;
    let totalWeight = 0;

    for (let i = n; i > 0 && w > 0; i--) {
      if (dp[i][w] !== dp[i - 1][w]) {
        selected.push(items[i - 1].id);
        totalWeight += items[i - 1].weight;
        w -= items[i - 1].weight;
      }
    }

    selected.reverse();

    const tree = buildDecisionTree(0, 0, 0, [], selected);
    
    steps.push({
      selectedItems: [...selected],
      currentItem: null,
      totalWeight,
      totalValue: dp[n][capacity],
      message: `DP Complete! Optimal Value: $${dp[n][capacity]}`,
      tree: tree || undefined
    });

    return { steps, result: { items: selected, value: dp[n][capacity], weight: totalWeight } };
  }, [items, capacity, buildDecisionTree]);

  const runAlgorithms = useCallback(() => {
    const greedy = runGreedy();
    const dp = runDP();
    setGreedySteps(greedy.steps);
    setDpSteps(dp.steps);
    setGreedyResult(greedy.result);
    setDpResult(dp.result);
    setCurrentStep(0);
    setIsRunning(true);
  }, [runGreedy, runDP]);

  useEffect(() => {
    if (!isRunning) return;

    const maxSteps = Math.max(greedySteps.length, dpSteps.length);
    if (currentStep >= maxSteps - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 3300);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, greedySteps.length, dpSteps.length]);

  const reset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setGreedySteps([]);
    setDpSteps([]);
    setGreedyResult({ items: [], value: 0, weight: 0 });
    setDpResult({ items: [], value: 0, weight: 0 });
  };

  const addItem = () => {
    const weight = parseInt(newWeight);
    const value = parseInt(newValue);
    if (weight > 0 && value > 0) {
      const newItem: Item = {
        id: items.length + 1,
        weight,
        value,
        ratio: value / weight
      };
      setItems([...items, newItem]);
      setNewWeight("");
      setNewValue("");
      reset();
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id).map((item, idx) => ({ ...item, id: idx + 1, ratio: item.value / item.weight })));
    reset();
  };

  const currentGreedyStep = greedySteps[Math.min(currentStep, greedySteps.length - 1)];
  const currentDpStep = dpSteps[Math.min(currentStep, dpSteps.length - 1)];

  // Tree Node Component
  const TreeNodeComponent = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => {
    const item = items.find(i => i.id === node.itemId);
    
    return (
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: depth * 0.1 }}
          className={`px-3 py-2 rounded-lg border-2 text-xs ${
            node.isOptimal 
              ? "bg-secondary/30 border-secondary text-secondary-foreground" 
              : "bg-background/50 border-border/50"
          }`}
        >
          <div className="font-bold">Item {node.itemId}</div>
          {item && <div>W:{item.weight} V:{item.value}</div>}
        </motion.div>
        
        {node.children.length > 0 && (
          <div className="flex gap-4 mt-2">
            {node.children.map((child, idx) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className={`w-px h-4 ${idx === 1 ? "bg-secondary" : "bg-border/50"}`} />
                <div className={`text-[10px] mb-1 ${idx === 1 ? "text-secondary" : "text-muted-foreground"}`}>
                  {idx === 0 ? "Skip" : "Take"}
                </div>
                <TreeNodeComponent node={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

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
          <h1 className="text-lg font-bold gradient-text">Knapsack Problem - Algorithm Comparison</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button 
              variant={isRunning ? "outline" : "hero"} 
              size="sm"
              onClick={() => isRunning ? setIsRunning(false) : runAlgorithms()}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Pause" : "Run"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Items Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">Available Items</h3>
            <div className="ml-auto flex items-center gap-2">
              <Scale className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Capacity:</span>
              <input
                type="number"
                value={capacity}
                onChange={(e) => { setCapacity(parseInt(e.target.value) || 1); reset(); }}
                className="w-16 px-2 py-1 rounded bg-background/50 border border-border/50 text-center"
                min="1"
              />
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative bg-background/50 rounded-xl p-3 border border-border/50 group"
                >
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-destructive-foreground" />
                  </button>
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">Item {item.id}</div>
                    <div className="text-sm">Weight: <span className="font-bold text-primary">{item.weight}</span></div>
                    <div className="text-sm">Value: <span className="font-bold text-secondary">${item.value}</span></div>
                    <div className="text-xs text-muted-foreground mt-1">Ratio: {item.ratio.toFixed(2)}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add New Item */}
            <div className="bg-background/30 rounded-xl p-3 border border-dashed border-border/50">
              <div className="text-xs text-muted-foreground mb-2 text-center">Add Item</div>
              <input
                type="number"
                placeholder="Weight"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full px-2 py-1 rounded bg-background/50 border border-border/50 text-sm mb-1"
              />
              <input
                type="number"
                placeholder="Value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="w-full px-2 py-1 rounded bg-background/50 border border-border/50 text-sm mb-2"
              />
              <Button size="sm" variant="outline" className="w-full" onClick={addItem}>
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Visualization Grid */}
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
            
            {/* Tree Visualization */}
            <div className="bg-background/50 rounded-xl border border-border/50 p-4 mb-4 min-h-[250px] overflow-auto">
              {currentGreedyStep ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentGreedyStep.message}
                  </p>
                  
                  {/* Greedy Decision Path */}
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-muted-foreground mb-2">Decision Path (by ratio)</div>
                    <div className="flex items-center gap-2">
                      {[...items].sort((a, b) => b.ratio - a.ratio).map((item, idx) => {
                        const isSelected = currentGreedyStep.selectedItems.includes(item.id);
                        const isCurrent = currentGreedyStep.currentItem === item.id;
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center"
                          >
                            <motion.div
                              animate={{
                                scale: isCurrent ? 1.15 : 1,
                                borderColor: isSelected ? "hsl(var(--primary))" : isCurrent ? "hsl(var(--secondary))" : "hsl(var(--border))"
                              }}
                              className={`px-3 py-2 rounded-lg border-2 transition-colors ${
                                isSelected ? "bg-primary/20 border-primary" : 
                                isCurrent ? "bg-secondary/20 border-secondary" : 
                                "bg-background/30 border-border/50"
                              }`}
                            >
                              <div className="text-xs font-bold">#{item.id}</div>
                              <div className="text-[10px]">W:{item.weight}</div>
                              <div className="text-[10px]">V:${item.value}</div>
                              <div className="text-[10px] text-muted-foreground">R:{item.ratio.toFixed(1)}</div>
                            </motion.div>
                            {idx < items.length - 1 && (
                              <div className="w-4 h-px bg-border/50 mx-1" />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    {/* Selection indicator */}
                    <div className="mt-4 flex gap-2">
                      {currentGreedyStep.selectedItems.map(id => (
                        <motion.div
                          key={id}
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="px-2 py-1 bg-primary/20 rounded text-xs text-primary"
                        >
                          Item {id} ✓
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Press &quot;Run&quot; to start simulation
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-background/30 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Items</p>
                <p className="text-xl font-bold text-primary">{greedyResult.items.length}</p>
              </div>
              <div className="bg-background/30 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Weight</p>
                <p className="text-xl font-bold text-primary">{greedyResult.weight}/{capacity}</p>
              </div>
              <div className="bg-background/30 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Value</p>
                <p className="text-xl font-bold text-primary">${greedyResult.value}</p>
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
            
            {/* Tree Visualization */}
            <div className="bg-background/50 rounded-xl border border-border/50 p-4 mb-4 min-h-[250px] overflow-auto">
              {currentDpStep ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentDpStep.message}
                  </p>
                  
                  {/* Decision Tree */}
                  {currentDpStep.tree ? (
                    <div className="flex justify-center overflow-x-auto pb-4">
                      <TreeNodeComponent node={currentDpStep.tree} />
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {items.map((item) => {
                        const isSelected = currentDpStep.selectedItems.includes(item.id);
                        const isCurrent = currentDpStep.currentItem === item.id;
                        return (
                          <motion.div
                            key={item.id}
                            animate={{
                              scale: isCurrent ? 1.15 : 1,
                            }}
                            className={`px-3 py-2 rounded-lg border-2 transition-colors ${
                              isSelected ? "bg-secondary/20 border-secondary" : 
                              isCurrent ? "bg-primary/20 border-primary animate-pulse" : 
                              "bg-background/30 border-border/50"
                            }`}
                          >
                            <div className="text-xs font-bold">#{item.id}</div>
                            <div className="text-[10px]">W:{item.weight} V:${item.value}</div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Selection indicator */}
                  {currentDpStep.selectedItems.length > 0 && (
                    <div className="mt-4 flex gap-2 justify-center">
                      {currentDpStep.selectedItems.map(id => (
                        <motion.div
                          key={id}
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="px-2 py-1 bg-secondary/20 rounded text-xs text-secondary"
                        >
                          Item {id} ✓
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Press &quot;Run&quot; to start simulation
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-background/30 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Items</p>
                <p className="text-xl font-bold text-secondary">{dpResult.items.length}</p>
              </div>
              <div className="bg-background/30 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Weight</p>
                <p className="text-xl font-bold text-secondary">{dpResult.weight}/{capacity}</p>
              </div>
              <div className="bg-background/30 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Value</p>
                <p className="text-xl font-bold text-secondary">${dpResult.value}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Comparison Result */}
        {greedyResult.value > 0 && dpResult.value > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 glass-card p-6"
          >
            <h3 className="text-lg font-bold mb-4 text-center">Comparison Result</h3>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">${greedyResult.value}</div>
                <div className="text-sm text-muted-foreground">Greedy</div>
                <div className="text-xs text-muted-foreground">Items: {greedyResult.items.join(", ")}</div>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">vs</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">${dpResult.value}</div>
                <div className="text-sm text-muted-foreground">Dynamic Programming</div>
                <div className="text-xs text-muted-foreground">Items: {dpResult.items.join(", ")}</div>
              </div>
            </div>
            {dpResult.value > greedyResult.value && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-center mt-4"
              >
                <p className="text-secondary font-bold">
                  ✨ DP is better by ${dpResult.value - greedyResult.value}!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Greedy chose by highest ratio but missed the optimal combination
                </p>
              </motion.div>
            )}
            {dpResult.value === greedyResult.value && (
              <p className="text-center mt-4 text-muted-foreground">
                Both algorithms found the same solution
              </p>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default Visualizer;
