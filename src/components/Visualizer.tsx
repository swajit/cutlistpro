import React, { useEffect, useRef, useState } from 'react';
import { OptimizationResults } from '../utils/optimizer';

interface VisualizerProps {
    results: OptimizationResults | null;
}

const Visualizer: React.FC<VisualizerProps> = ({ results }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentSheetIndex, setCurrentSheetIndex] = useState(0);

    // Reset current sheet index when results change
    useEffect(() => {
        setCurrentSheetIndex(0);
    }, [results]);

    useEffect(() => {
        if (!results || !results.sheets || results.sheets.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const sheet = results.sheets[currentSheetIndex];
        if (!sheet) return;

        const padding = 40;
        const scale = Math.min(
            (window.innerWidth - 450) / sheet.width,
            (window.innerHeight - 150) / sheet.height
        ) * 0.9;

        canvas.width = sheet.width * scale + padding * 2;
        canvas.height = sheet.height * scale + padding * 2;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Stock Sheet
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(padding, padding, sheet.width * scale, sheet.height * scale);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(padding, padding, sheet.width * scale, sheet.height * scale);

        // Draw Placements
        sheet.placements.forEach((p) => {
            const px = padding + p.x * scale;
            const py = padding + p.y * scale;
            const pw = p.w * scale;
            const ph = p.h * scale;

            ctx.fillStyle = 'rgba(249, 115, 22, 0.15)';
            ctx.fillRect(px, py, pw, ph);

            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 1;
            ctx.strokeRect(px, py, pw, ph);

            if (pw > 30 && ph > 20) {
                ctx.fillStyle = '#f8fafc';
                ctx.font = 'bold 10px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`${p.name}`, px + pw / 2, py + ph / 2);
                ctx.font = '8px Inter, sans-serif';
                ctx.fillText(`${p.width}" x ${p.height}"`, px + pw / 2, py + ph / 2 + 12);
            }
        });

    }, [results, currentSheetIndex]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem' }}>
            {!results || results.sheets.length === 0 ? (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📐</div>
                    <h2 style={{ opacity: 0.7 }}>No optimization run yet</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Add your dimensions and click Run Optimization</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <button
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '1.2rem', lineHeight: 1 }}
                            onClick={() => setCurrentSheetIndex(Math.max(0, currentSheetIndex - 1))}
                            disabled={currentSheetIndex === 0}
                        >
                            ←
                        </button>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>
                            Sheet <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{currentSheetIndex + 1}</span> of {results.sheets.length}
                        </div>
                        <button
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '1.2rem', lineHeight: 1 }}
                            onClick={() => setCurrentSheetIndex(Math.min(results.sheets.length - 1, currentSheetIndex + 1))}
                            disabled={currentSheetIndex === results.sheets.length - 1}
                        >
                            →
                        </button>
                    </div>
                    <div style={{ background: '#020617', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}>
                        <canvas ref={canvasRef}></canvas>
                    </div>
                </>
            )}
        </div>
    );
};

export default Visualizer;
