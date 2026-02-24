import React from 'react';
import { Panel, StockSheet } from '../utils/optimizer';

interface SidebarProps {
    panels: Panel[];
    setPanels: (panels: Panel[]) => void;
    stock: StockSheet[];
    setStock: (stock: StockSheet[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ panels, setPanels, stock, setStock }) => {
    const addPanel = () => {
        setPanels([...panels, { id: Date.now(), name: `Part ${panels.length + 1}`, width: 20, height: 10, count: 1, allowRotation: true }]);
    };

    const addStock = () => {
        setStock([...stock, { id: Date.now(), name: `Sheet ${stock.length + 1}`, width: 96, height: 48, count: 1 }]);
    };

    const updatePanel = (id: number | string, field: keyof Panel, value: string | number | boolean) => {
        setPanels(panels.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const updateStock = (id: number | string, field: keyof StockSheet, value: string | number) => {
        setStock(stock.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removePanel = (id: number | string) => setPanels(panels.filter(p => p.id !== id));
    const removeStock = (id: number | string) => setStock(stock.filter(s => s.id !== id));

    return (
        <div className="animate-fade-in" style={{ flex: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
            <section style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Parts to Cut</h3>
                    <button className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={addPanel}>+ Add</button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '0.5rem 0' }}>Name</th>
                            <th>W</th>
                            <th>H</th>
                            <th>#</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {panels.map(panel => (
                            <tr key={panel.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.5rem 0' }}>
                                    <input
                                        className="panel-input"
                                        value={panel.name}
                                        onChange={(e) => updatePanel(panel.id, 'name', e.target.value)}
                                        style={{ background: 'transparent', border: 'none', padding: 0 }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="panel-input"
                                        value={panel.width}
                                        onChange={(e) => updatePanel(panel.id, 'width', parseFloat(e.target.value) || 0)}
                                        style={{ width: '70px' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="panel-input"
                                        value={panel.height}
                                        onChange={(e) => updatePanel(panel.id, 'height', parseFloat(e.target.value) || 0)}
                                        style={{ width: '70px' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="panel-input"
                                        value={panel.count}
                                        onChange={(e) => updatePanel(panel.id, 'count', parseInt(e.target.value) || 0)}
                                        style={{ width: '50px' }}
                                    />
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button onClick={() => removePanel(panel.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {panels.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', marginTop: '0.5rem' }}>
                        No parts added yet
                    </p>
                )}
            </section>

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stock Sheets</h3>
                    <button className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={addStock}>+ Add</button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '0.5rem 0' }}>Name</th>
                            <th>W</th>
                            <th>H</th>
                            <th>#</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {stock.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.5rem 0' }}>
                                    <input
                                        className="panel-input"
                                        value={s.name}
                                        onChange={(e) => updateStock(s.id, 'name', e.target.value)}
                                        style={{ background: 'transparent', border: 'none', padding: 0 }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="panel-input"
                                        value={s.width}
                                        onChange={(e) => updateStock(s.id, 'width', parseFloat(e.target.value) || 0)}
                                        style={{ width: '70px' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="panel-input"
                                        value={s.height}
                                        onChange={(e) => updateStock(s.id, 'height', parseFloat(e.target.value) || 0)}
                                        style={{ width: '70px' }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        className="panel-input"
                                        value={s.count}
                                        onChange={(e) => updateStock(s.id, 'count', parseInt(e.target.value) || 0)}
                                        style={{ width: '50px' }}
                                    />
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button onClick={() => removeStock(s.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.1rem' }}>×</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {stock.length === 0 && (
                    <p style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', marginTop: '0.5rem' }}>
                        No stock sheets defined
                    </p>
                )}
            </section>

            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Blade Kerf</span>
                    <input className="panel-input" type="number" step="0.03125" defaultValue="0.125" style={{ width: '70px', height: '28px' }} />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
