import React from 'react';
import { OptimizationResults } from '../utils/optimizer';

interface StatsProps {
    results: OptimizationResults | null;
}

const Stats: React.FC<StatsProps> = ({ results }) => {
    return (
        <div style={{ display: 'flex', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>EFFICIENCY</span>
                <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{results ? results.totalEfficiency + '%' : '--'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>WASTE</span>
                <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{results ? results.totalWaste + ' sq in' : '--'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>USED SHEETS</span>
                <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>{results ? results.sheetsUsed : '--'}</span>
            </div>
        </div>
    );
};

export default Stats;
