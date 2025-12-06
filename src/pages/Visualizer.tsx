import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Trash2, Package, Scale, Check, ArrowRight, ArrowDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Item {
  id: number;
  weight: number;
  value: number;
  ratio: number;
}

interface GreedyTableRow {
  item: Item;
  decision: 'pending' | 'taken' | 'skipped';
  remainingCapacity: number;
  originalIndex: number;
}

interface GreedyStep {
  phase: 'sorting' | 'deciding' | 'complete';
  currentRowIndex: number | null;
  rows: GreedyTableRow[];
  message: string;
  totalValue: number;
  totalWeight: number;
}

interface DPStep {
  selectedItems: number[];
  currentItem: number | null;
  totalWeight: number;
  totalValue: number;
  message: string;
  dpTable?: (number | null)[][];
  dpPhase?: 'building' | 'backtracking' | 'complete';
  currentCell?: { row: number; col: number };
  backtrackPath?: { row: number; col: number }[];
  filledCells?: { row: number; col: number }[];
}

const springTransition = {
  type: "spring" as const,
  stiffness: 45,
  damping: 14
};

const bounceTransition = {
  type: "spring" as const,
  stiffness: 60,
  damping: 10
};

const STEP_DELAY = 3000;

type Phase = 'idle' | 'greedy' | 'transition' | 'dp' | 'complete';

const Visualizer = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, weight: 10, value: 60, ratio: 6 },
    { id: 2, weight: 20, value: 100, ratio: 5 },
    { id: 3, weight: 30, value: 120, ratio: 4 },
  ]);
  const [capacity, setCapacity] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [greedySteps, setGreedySteps] = useState<GreedyStep[]>([]);
  const [dpSteps, setDpSteps] = useState<DPStep[]>([]);
  const [greedyResult, setGreedyResult] = useState({ items: [] as number[], value: 0, weight: 0 });
  const [dpResult, setDpResult] = useState({ items: [] as number[], value: 0, weight: 0 });
  const [newWeight, setNewWeight] = useState("");
  const [newValue, setNewValue] = useState("");

  // Greedy Algorithm - uses simple decision table (NOT DP!)
  const runGreedy = useCallback(() => {
    const sortedItems = [...items].sort((a, b) => b.ratio - a.ratio);
    const steps: GreedyStep[] = [];
    
    // Initial unsorted state
    const initialRows: GreedyTableRow[] = items.map((item, idx) => ({
      item,
      decision: 'pending' as const,
      remainingCapacity: capacity,
      originalIndex: idx
    }));
    
    steps.push({
      phase: 'sorting',
      currentRowIndex: null,
      rows: initialRows,
      message: "📋 Initial items (unsorted). We will sort by Value/Weight ratio...",
      totalValue: 0,
      totalWeight: 0
    });
    
    // After sorting
    const sortedRows: GreedyTableRow[] = sortedItems.map((item, idx) => ({
      item,
      decision: 'pending' as const,
      remainingCapacity: capacity,
      originalIndex: items.findIndex(i => i.id === item.id)
    }));
    
    steps.push({
      phase: 'sorting',
      currentRowIndex: null,
      rows: sortedRows,
      message: "✅ Items sorted by ratio (highest first). Now making greedy decisions...",
      totalValue: 0,
      totalWeight: 0
    });
    
    // Decision steps
    let remainingCap = capacity;
    let totalValue = 0;
    let totalWeight = 0;
    const currentRows = [...sortedRows];
    const selectedIds: number[] = [];
    
    for (let i = 0; i < sortedItems.length; i++) {
      const item = sortedItems[i];
      
      // Highlight current row being checked
      steps.push({
        phase: 'deciding',
        currentRowIndex: i,
        rows: currentRows.map((r, idx) => ({ ...r, remainingCapacity: idx <= i ? remainingCap : capacity })),
        message: `🔍 Checking Item ${item.id}: Weight=${item.weight}, Value=$${item.value}, Ratio=${item.ratio.toFixed(2)}`,
        totalValue,
        totalWeight
      });
      
      if (item.weight <= remainingCap) {
        // Take the item
        remainingCap -= item.weight;
        totalValue += item.value;
        totalWeight += item.weight;
        selectedIds.push(item.id);
        currentRows[i] = { ...currentRows[i], decision: 'taken', remainingCapacity: remainingCap };
        
        steps.push({
          phase: 'deciding',
          currentRowIndex: i,
          rows: currentRows.map(r => ({ ...r })),
          message: `✅ TAKEN Item ${item.id}! Weight ${item.weight} ≤ ${remainingCap + item.weight}. Remaining capacity: ${remainingCap}`,
          totalValue,
          totalWeight
        });
      } else {
        // Skip the item
        currentRows[i] = { ...currentRows[i], decision: 'skipped', remainingCapacity: remainingCap };
        
        steps.push({
          phase: 'deciding',
          currentRowIndex: i,
          rows: currentRows.map(r => ({ ...r })),
          message: `❌ SKIPPED Item ${item.id}! Weight ${item.weight} > ${remainingCap}. Cannot fit.`,
          totalValue,
          totalWeight
        });
      }
    }
    
    // Final step
    steps.push({
      phase: 'complete',
      currentRowIndex: null,
      rows: currentRows,
      message: `🎯 Greedy Complete! Total Value: $${totalValue} | Total Weight: ${totalWeight}/${capacity}`,
      totalValue,
      totalWeight
    });
    
    return { steps, result: { items: selectedIds, value: totalValue, weight: totalWeight } };
  }, [items, capacity]);

  // DP Algorithm
  const runDP = useCallback(() => {
    const n = items.length;
    const dp: (number | null)[][] = Array(n + 1).fill(null).map((_, i) => 
      Array(capacity + 1).fill(null).map((_, j) => (i === 0 || j === 0) ? 0 : null)
    );
    const steps: DPStep[] = [];
    const filledCells: { row: number; col: number }[] = [];

    for (let j = 0; j <= capacity; j++) {
      filledCells.push({ row: 0, col: j });
    }
    for (let i = 1; i <= n; i++) {
      filledCells.push({ row: i, col: 0 });
    }

    steps.push({
      selectedItems: [],
      currentItem: null,
      totalWeight: 0,
      totalValue: 0,
      message: "🚀 Starting DP - Creating table (Row 0 and Column 0 = 0)",
      dpTable: dp.map(row => [...row]),
      dpPhase: 'building',
      filledCells: [...filledCells]
    });

    for (let i = 1; i <= n; i++) {
      const item = items[i - 1];
      
      for (let w = 1; w <= capacity; w++) {
        const topValue = dp[i - 1][w] ?? 0;
        
        if (item.weight <= w) {
          const diagonalCol = w - item.weight;
          const diagonalValue = (dp[i - 1][diagonalCol] ?? 0) + item.value;
          
          if (diagonalValue > topValue) {
            dp[i][w] = diagonalValue;
          } else {
            dp[i][w] = topValue;
          }
        } else {
          dp[i][w] = topValue;
        }
        
        filledCells.push({ row: i, col: w });
      }
      
      steps.push({
        selectedItems: [],
        currentItem: item.id,
        totalWeight: 0,
        totalValue: dp[i][capacity] ?? 0,
        message: `📝 Item ${item.id} (W=${item.weight}, V=$${item.value}): Row ${i} complete. Best so far: $${dp[i][capacity]}`,
        dpTable: dp.map(row => [...row]),
        dpPhase: 'building',
        currentCell: { row: i, col: capacity },
        filledCells: [...filledCells]
      });
    }

    // Backtracking
    const selected: number[] = [];
    let w = capacity;
    let totalWeight = 0;
    const backtrackPath: { row: number; col: number }[] = [{ row: n, col: capacity }];

    for (let i = n; i > 0 && w > 0; i--) {
      const currentVal = dp[i][w] ?? 0;
      const aboveVal = dp[i - 1][w] ?? 0;
      
      if (currentVal !== aboveVal) {
        selected.push(items[i - 1].id);
        totalWeight += items[i - 1].weight;
        const newW = w - items[i - 1].weight;
        backtrackPath.push({ row: i - 1, col: newW });
        w = newW;
      } else {
        backtrackPath.push({ row: i - 1, col: w });
      }
    }

    selected.reverse();

    steps.push({
      selectedItems: [...selected],
      currentItem: null,
      totalWeight,
      totalValue: dp[n][capacity] ?? 0,
      message: `🔙 Backtracking: Tracing optimal path from F(${n}, ${capacity})...`,
      dpTable: dp.map(row => [...row]),
      dpPhase: 'backtracking',
      backtrackPath,
      filledCells: [...filledCells]
    });

    steps.push({
      selectedItems: [...selected],
      currentItem: null,
      totalWeight,
      totalValue: dp[n][capacity] ?? 0,
      message: `🎯 DP Complete! Optimal Value: $${dp[n][capacity]} with Items [${selected.join(", ")}]`,
      dpTable: dp.map(row => [...row]),
      dpPhase: 'complete',
      backtrackPath,
      filledCells: [...filledCells]
    });

    return { steps, result: { items: selected, value: dp[n][capacity] ?? 0, weight: totalWeight } };
  }, [items, capacity]);

  const runAlgorithms = useCallback(() => {
    const greedy = runGreedy();
    const dp = runDP();
    setGreedySteps(greedy.steps);
    setDpSteps(dp.steps);
    setGreedyResult(greedy.result);
    setDpResult(dp.result);
    setCurrentStep(0);
    setPhase('greedy');
    setIsRunning(true);
  }, [runGreedy, runDP]);

  // Main animation loop
  useEffect(() => {
    if (!isRunning) return;

    if (phase === 'greedy') {
      if (currentStep >= greedySteps.length - 1) {
        setTimeout(() => {
          setPhase('transition');
          setTimeout(() => {
            setPhase('dp');
            setCurrentStep(0);
          }, 2000);
        }, STEP_DELAY);
        return;
      }
    } else if (phase === 'dp') {
      if (currentStep >= dpSteps.length - 1) {
        setPhase('complete');
        setIsRunning(false);
        return;
      }
    } else {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, STEP_DELAY);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, greedySteps.length, dpSteps.length, phase]);

  const reset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setPhase('idle');
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

  // Greedy Decision Table Component (NOT a DP table!)
  const GreedyDecisionTable = ({ step }: { step: GreedyStep }) => {
    return (
      <div className="w-full">
        <div className="mb-4 p-3 bg-warning/10 border border-warning/30 rounded-lg text-center">
          <p className="text-sm text-warning font-medium">
            ⚠️ This is a <strong>Greedy Decision Table</strong> — NOT a DP computation table.
            <br />
            <span className="text-muted-foreground">Each row shows a simple take/skip decision based on ratio order.</span>
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary/10">
                <th className="p-3 border-2 border-border/50 text-left font-bold">#</th>
                <th className="p-3 border-2 border-border/50 text-center font-bold">Item</th>
                <th className="p-3 border-2 border-border/50 text-center font-bold">Weight</th>
                <th className="p-3 border-2 border-border/50 text-center font-bold">Value</th>
                <th className="p-3 border-2 border-border/50 text-center font-bold">Ratio (V/W)</th>
                <th className="p-3 border-2 border-border/50 text-center font-bold">Decision</th>
                <th className="p-3 border-2 border-border/50 text-center font-bold">Remaining Cap.</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {step.rows.map((row, idx) => {
                  const isCurrentRow = step.currentRowIndex === idx;
                  const isTaken = row.decision === 'taken';
                  const isSkipped = row.decision === 'skipped';
                  const isPending = row.decision === 'pending';
                  
                  return (
                    <motion.tr
                      key={row.item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        backgroundColor: isCurrentRow 
                          ? 'hsl(var(--dp) / 0.2)' 
                          : isTaken 
                            ? 'hsl(var(--accent) / 0.15)' 
                            : isSkipped 
                              ? 'hsl(var(--destructive) / 0.1)' 
                              : 'transparent'
                      }}
                      transition={{ 
                        layout: { duration: 0.5, type: "spring", stiffness: 100 },
                        duration: 0.3,
                        delay: step.phase === 'sorting' ? idx * 0.1 : 0
                      }}
                      className={`transition-all ${isCurrentRow ? 'ring-2 ring-dp ring-offset-2 ring-offset-background' : ''}`}
                    >
                      <td className="p-3 border-2 border-border/50 text-center font-mono text-muted-foreground">
                        {idx + 1}
                      </td>
                      <td className="p-3 border-2 border-border/50 text-center">
                        <motion.span 
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                            isTaken ? 'bg-accent text-accent-foreground' : 
                            isSkipped ? 'bg-destructive/50 text-destructive-foreground' : 
                            'bg-primary/20 text-primary'
                          }`}
                          animate={isCurrentRow ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5, repeat: isCurrentRow ? Infinity : 0 }}
                        >
                          {row.item.id}
                        </motion.span>
                      </td>
                      <td className="p-3 border-2 border-border/50 text-center font-mono">
                        {row.item.weight}
                      </td>
                      <td className="p-3 border-2 border-border/50 text-center font-mono text-accent">
                        ${row.item.value}
                      </td>
                      <td className="p-3 border-2 border-border/50 text-center">
                        <span className="px-2 py-1 bg-primary/20 rounded font-mono text-primary font-bold">
                          {row.item.ratio.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3 border-2 border-border/50 text-center">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-sm ${
                            isTaken 
                              ? 'bg-accent text-accent-foreground' 
                              : isSkipped 
                                ? 'bg-destructive text-destructive-foreground' 
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {isTaken && <Check className="w-4 h-4" />}
                          {isTaken ? 'TAKEN' : isSkipped ? 'SKIPPED' : '—'}
                        </motion.div>
                      </td>
                      <td className="p-3 border-2 border-border/50 text-center">
                        <motion.span 
                          className="font-mono font-bold"
                          key={row.remainingCapacity}
                          initial={{ scale: 1.3, color: 'hsl(var(--accent))' }}
                          animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                          transition={{ duration: 0.3 }}
                        >
                          {isPending ? '—' : row.remainingCapacity}
                        </motion.span>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {/* Summary row */}
        <motion.div 
          className="mt-4 p-4 bg-primary/10 border-2 border-primary/30 rounded-xl flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xs text-muted-foreground uppercase">Total Value</div>
              <div className="text-2xl font-bold text-accent">${step.totalValue}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground uppercase">Total Weight</div>
              <div className="text-2xl font-bold text-primary">{step.totalWeight}/{capacity}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase">Items Taken</div>
            <div className="text-lg font-bold">
              {step.rows.filter(r => r.decision === 'taken').map(r => `#${r.item.id}`).join(', ') || '—'}
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // DP Table Component
  const DPTableComponent = ({ step }: { step: DPStep }) => {
    const table = step.dpTable;
    if (!table) return null;

    const n = items.length;
    const isPhaseBacktracking = step.dpPhase === 'backtracking' || step.dpPhase === 'complete';

    const isCellFilled = (row: number, col: number) => {
      return step.filledCells?.some(c => c.row === row && c.col === col) ?? false;
    };

    const isBacktrackCell = (row: number, col: number) => {
      return step.backtrackPath?.some(p => p.row === row && p.col === col) ?? false;
    };

    const isFinalCell = (row: number, col: number) => {
      return row === n && col === capacity;
    };

    const isCurrentRowCell = (row: number) => {
      return step.currentCell?.row === row;
    };

    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-2 border-border/50 bg-muted/30 text-muted-foreground font-bold sticky left-0 bg-card z-10">
                F(i,w)
              </th>
              {Array.from({ length: capacity + 1 }, (_, w) => (
                <th key={w} className="p-2 border-2 border-border/50 bg-muted/30 text-muted-foreground font-bold min-w-[50px]">
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <td className="p-3 border-2 border-border/50 bg-muted/30 text-muted-foreground font-bold sticky left-0 bg-card z-10">
                  {i === 0 ? 'i=0' : (
                    <div className="flex flex-col">
                      <span>i={i}</span>
                      <span className="text-[10px] text-primary">W:{items[i-1]?.weight} V:{items[i-1]?.value}</span>
                    </div>
                  )}
                </td>
                {row.map((cellValue, w) => {
                  const filled = isCellFilled(i, w);
                  const backtrack = isBacktrackCell(i, w);
                  const finalCell = isFinalCell(i, w);
                  const currentRow = isCurrentRowCell(i);
                  
                  return (
                    <motion.td
                      key={w}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: backtrack && isPhaseBacktracking ? [1, 1.1, 1] : 1, 
                        opacity: isPhaseBacktracking && !backtrack ? 0.4 : 1,
                      }}
                      transition={{ duration: 0.5, delay: w * 0.02 }}
                      className={`p-2 border-2 text-center min-w-[50px] font-bold relative transition-all duration-500 ${
                        backtrack && isPhaseBacktracking
                          ? "bg-accent/40 border-accent text-accent shadow-[0_0_15px_hsl(var(--accent)/0.6)]" 
                          : filled && cellValue !== null
                            ? currentRow && !isPhaseBacktracking
                              ? "bg-dp/50 border-dp text-foreground shadow-[0_0_10px_hsl(var(--dp)/0.5)]"
                              : "bg-primary/20 border-primary/50 text-foreground"
                            : "bg-background/20 border-border/30 text-muted-foreground/50"
                      }`}
                    >
                      {finalCell && filled && isPhaseBacktracking && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 border-4 border-primary rounded shadow-[0_0_15px_hsl(var(--primary)/0.7)]"
                        />
                      )}
                      
                      {backtrack && isPhaseBacktracking && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center"
                        >
                          <Check className="w-2.5 h-2.5 text-accent-foreground" />
                        </motion.div>
                      )}
                      
                      <span className="relative z-10 text-xs">
                        {cellValue !== null ? cellValue : '—'}
                      </span>
                    </motion.td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary/20 border-2 border-primary/50 rounded" />
            <span className="text-muted-foreground">Filled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-dp/50 border-2 border-dp rounded" />
            <span className="text-muted-foreground">Current Row</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent/40 border-2 border-accent rounded" />
            <span className="text-muted-foreground">Optimal Path</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-background" dir="ltr">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Button>
          </Link>
          <h1 className="text-lg font-bold gradient-text">
            0/1 Knapsack - Algorithm Comparison
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button 
              variant={isRunning ? "outline" : "default"} 
              size="sm"
              onClick={() => isRunning ? setIsRunning(false) : runAlgorithms()}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Pause" : "Run"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Items Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass rounded-2xl p-6 mb-8"
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

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
            <AnimatePresence>
              {items.map((item, idx) => (
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
                    <div className="text-sm">Value: <span className="font-bold text-accent">${item.value}</span></div>
                    <div className="text-xs text-muted-foreground mt-1">Ratio: {item.ratio.toFixed(2)}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

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

        {/* Phase Indicator */}
        {phase !== 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className={`px-4 py-2 rounded-full border-2 font-bold transition-all ${
              phase === 'greedy' ? 'bg-primary/20 border-primary text-primary scale-110' : 
              phase === 'complete' ? 'bg-accent/20 border-accent text-accent' :
              'bg-muted/50 border-border text-muted-foreground'
            }`}>
              1. Greedy
            </div>
            <ArrowRight className="w-6 h-6 text-muted-foreground" />
            <div className={`px-4 py-2 rounded-full border-2 font-bold transition-all ${
              phase === 'dp' ? 'bg-dp/20 border-dp text-dp scale-110' : 
              phase === 'complete' ? 'bg-accent/20 border-accent text-accent' :
              'bg-muted/50 border-border text-muted-foreground'
            }`}>
              2. DP
            </div>
          </motion.div>
        )}

        {/* Sequential Visualization */}
        <div className="space-y-8">
          {/* GREEDY SECTION */}
          {(phase === 'greedy' || phase === 'transition' || phase === 'complete') && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass border-2 border-primary/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-4 h-4 rounded-full bg-primary"
                  animate={phase === 'greedy' ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 2, repeat: phase === 'greedy' ? Infinity : 0 }}
                />
                <h2 className="text-2xl font-bold text-primary">Greedy Algorithm</h2>
                {phase !== 'greedy' && (
                  <span className="ml-auto text-accent font-bold">✓ Complete</span>
                )}
              </div>
              
              <div className="bg-background/50 rounded-xl border border-border/50 p-6 min-h-[300px]">
                {currentGreedyStep ? (
                  <div>
                    <motion.div 
                      key={currentGreedyStep.message}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg font-semibold mb-6 p-4 bg-primary/10 rounded-lg border border-primary/30"
                    >
                      {currentGreedyStep.message}
                    </motion.div>
                    
                    {/* Greedy Decision Table */}
                    <GreedyDecisionTable step={currentGreedyStep} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Press "Run" to start the simulation
                  </div>
                )}
              </div>

              {/* Greedy Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-background/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Items</p>
                  <p className="text-2xl font-bold text-primary">{greedyResult.items.length}</p>
                </div>
                <div className="bg-background/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Weight</p>
                  <p className="text-2xl font-bold text-primary">{greedyResult.weight}/{capacity}</p>
                </div>
                <div className="bg-background/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Value</p>
                  <p className="text-2xl font-bold text-primary">${greedyResult.value}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Transition Message */}
          {phase === 'transition' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="text-2xl font-bold text-dp animate-pulse flex items-center justify-center gap-3">
                <ArrowDown className="w-6 h-6" />
                Now running Dynamic Programming...
                <ArrowDown className="w-6 h-6" />
              </div>
            </motion.div>
          )}

          {/* DP SECTION */}
          {(phase === 'dp' || phase === 'complete') && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass border-2 border-dp/30 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div 
                  className="w-4 h-4 rounded-full bg-dp"
                  animate={phase === 'dp' ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 2, repeat: phase === 'dp' ? Infinity : 0 }}
                />
                <h2 className="text-2xl font-bold text-dp">Dynamic Programming Algorithm</h2>
                {phase === 'complete' && (
                  <span className="ml-auto text-accent font-bold">✓ Complete</span>
                )}
              </div>
              
              <div className="bg-background/50 rounded-xl border border-border/50 p-6 min-h-[300px]">
                {currentDpStep ? (
                  <div>
                    <motion.div 
                      key={currentDpStep.message}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg font-semibold mb-6 p-4 bg-dp/10 rounded-lg border border-dp/30"
                    >
                      {currentDpStep.message}
                    </motion.div>
                    
                    {/* DP Table - Full Width */}
                    {currentDpStep.dpTable && (
                      <div className="mb-6">
                        <div className="text-sm text-muted-foreground mb-3 text-center font-semibold uppercase tracking-wider">
                          {currentDpStep.dpPhase === 'building' 
                            ? '📊 DP Table (Building...)' 
                            : currentDpStep.dpPhase === 'backtracking'
                              ? '🔙 DP Table (Backtracking...)'
                              : '✅ DP Table (Complete)'}
                        </div>
                        <DPTableComponent step={currentDpStep} />
                      </div>
                    )}
                    
                    {/* DP Chosen Items */}
                    {currentDpStep.selectedItems.length > 0 && (
                      <motion.div 
                        className="mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="text-sm text-muted-foreground mb-3 text-center font-semibold uppercase tracking-wider">
                          🎯 Selected Items by DP
                        </div>
                        <div className="flex gap-3 justify-center flex-wrap">
                          {currentDpStep.selectedItems.map((id, idx) => {
                            const item = items.find(i => i.id === id);
                            return (
                              <motion.div
                                key={id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.15 }}
                                className="px-4 py-3 bg-accent/30 border-2 border-accent rounded-lg shadow-[0_0_15px_hsl(var(--accent)/0.4)]"
                              >
                                <div className="font-bold text-accent text-lg">#{id}</div>
                                {item && <div className="text-xs text-foreground/80">W:{item.weight} V:${item.value}</div>}
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Will start after Greedy finishes
                  </div>
                )}
              </div>

              {/* DP Stats */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-background/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Items</p>
                  <p className="text-2xl font-bold text-dp">{dpResult.items.length}</p>
                </div>
                <div className="bg-background/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Weight</p>
                  <p className="text-2xl font-bold text-dp">{dpResult.weight}/{capacity}</p>
                </div>
                <div className="bg-background/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Value</p>
                  <p className="text-2xl font-bold text-dp">${dpResult.value}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Final Comparison */}
          {phase === 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass border-2 border-accent/30 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6 text-center">📊 Final Results</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-6 text-center">
                  <div className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Greedy</div>
                  <div className="text-4xl font-bold text-primary mb-2">${greedyResult.value}</div>
                  <div className="text-sm text-muted-foreground">Weight: {greedyResult.weight}/{capacity}</div>
                  <div className="text-sm text-muted-foreground">Items: [{greedyResult.items.join(", ")}]</div>
                </div>
                
                <div className="bg-dp/10 border-2 border-dp/30 rounded-xl p-6 text-center">
                  <div className="text-sm font-bold uppercase tracking-wider text-dp mb-2">DP</div>
                  <div className="text-4xl font-bold text-dp mb-2">${dpResult.value}</div>
                  <div className="text-sm text-muted-foreground">Weight: {dpResult.weight}/{capacity}</div>
                  <div className="text-sm text-muted-foreground">Items: [{dpResult.items.join(", ")}]</div>
                </div>
              </div>
              
              {dpResult.value > greedyResult.value && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="p-6 bg-accent/10 border-2 border-accent/30 rounded-xl text-center"
                >
                  <p className="text-2xl text-accent font-bold mb-2">
                    🏆 DP wins by ${dpResult.value - greedyResult.value}!
                  </p>
                  <p className="text-muted-foreground">
                    Greedy chose items with highest ratio but missed the optimal solution.
                  </p>
                </motion.div>
              )}
              
              {dpResult.value === greedyResult.value && (
                <div className="p-6 bg-muted/30 border-2 border-border/30 rounded-xl text-center">
                  <p className="text-xl text-muted-foreground font-bold">
                    🤝 Both algorithms reached the same result!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Visualizer;
