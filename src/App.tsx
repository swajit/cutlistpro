import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Visualizer from './components/Visualizer';
import Stats from './components/Stats';
import { optimize, Panel, StockSheet, OptimizationResults } from './utils/optimizer';
import './index.css';

function App() {
    const [panels, setPanels] = useState<Panel[]>([
        { id: 1, name: 'Side L', width: 24, height: 30, count: 1, allowRotation: true },
        { id: 2, name: 'Side R', width: 24, height: 30, count: 1, allowRotation: true },
        { id: 3, name: 'Top', width: 24, height: 24, count: 1, allowRotation: true },
        { id: 4, name: 'Bottom', width: 24, height: 24, count: 1, allowRotation: true },
        { id: 5, name: 'Shelf', width: 22.5, height: 23, count: 3, allowRotation: true },
    ]);

    const [stock, setStock] = useState<StockSheet[]>([
        { id: 101, name: 'Plywood 3/4', width: 96, height: 48, count: 1 },
    ]);

    const [results, setResults] = useState<OptimizationResults | null>(null);

    const handleOptimize = () => {
        // Flatten panels based on count
        const flattenedPanels: Panel[] = [];
        panels.forEach(p => {
            for (let i = 0; i < p.count; i++) {
                flattenedPanels.push({ ...p, originalId: p.id });
            }
        });

        // Flatten stock based on count
        const flattenedStock: StockSheet[] = [];
        stock.forEach(s => {
            for (let i = 0; i < s.count; i++) {
                flattenedStock.push({ ...s });
            }
        });

        const output = optimize(flattenedPanels, flattenedStock, { kerf: 0.125 });
        setResults(output);
    };

    // Run initial optimization
    useEffect(() => {
        handleOptimize();
    }, []);

    return (
        <div id="root">
            <div className="sidebar glass">
                <h1 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ background: 'var(--accent)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>C</span>
                    <span>CUTLIST <span style={{ color: 'var(--accent)' }}>PRO</span></span>
                </h1>
                <Sidebar
                    panels={panels}
                    setPanels={setPanels}
                    stock={stock}
                    setStock={setStock}
                />
            </div>

            <div className="main-content">
                <header className="top-bar glass">
                    <Stats results={results} />
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-secondary">Reset</button>
                        <button className="btn" onClick={handleOptimize}>Run Optimization</button>
                    </div>
                </header>

                <main className="visualizer-container">
                    <Visualizer results={results} />
                </main>
            </div>
        </div>
    );
}

export default App;
