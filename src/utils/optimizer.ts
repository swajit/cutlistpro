/**
 * Simple 2D Guillotine Cut Optimizer (TypeScript)
 */

export interface Panel {
    id: number | string;
    name: string;
    width: number;
    height: number;
    count: number;
    allowRotation?: boolean;
    originalId?: number | string;
}

export interface StockSheet {
    id: number | string;
    name: string;
    width: number;
    height: number;
    count: number;
}

export interface Placement extends Panel {
    x: number;
    y: number;
    w: number;
    h: number;
    rotated: boolean;
}

export interface SheetResult {
    sheetId: number | string;
    width: number;
    height: number;
    placements: Placement[];
    efficiency: string;
}

export interface OptimizationResults {
    sheets: SheetResult[];
    unplaced: Panel[];
    totalEfficiency: string | number;
    totalWaste: string;
    sheetsUsed: number;
}

interface FreeRect {
    x: number;
    y: number;
    w: number;
    h: number;
}

type SplitHeuristic = 'ShorterAxis' | 'LongerAxis';
type SortOrder = 'Area' | 'Width' | 'Height' | 'MaxSide';

const runOptimizationPass = (
    panels: Panel[],
    stockSheets: StockSheet[],
    kerf: number,
    sortOrder: SortOrder,
    splitHeuristic: SplitHeuristic
): OptimizationResults => {
    const results: SheetResult[] = [];
    const remainingPanels = [...panels].sort((a, b) => {
        if (sortOrder === 'Area') return (b.width * b.height) - (a.width * a.height);
        if (sortOrder === 'Width') return b.width - a.width || b.height - a.height;
        if (sortOrder === 'Height') return b.height - a.height || b.width - a.width;
        if (sortOrder === 'MaxSide') return Math.max(b.width, b.height) - Math.max(a.width, a.height);
        return 0;
    });

    for (let sheetIdx = 0; sheetIdx < stockSheets.length; sheetIdx++) {
        const sheet = stockSheets[sheetIdx];
        const sheetResults: SheetResult = {
            sheetId: sheet.id || sheetIdx,
            width: sheet.width,
            height: sheet.height,
            placements: [],
            efficiency: "0"
        };

        let freeRects: FreeRect[] = [{ x: 0, y: 0, w: sheet.width, h: sheet.height }];

        for (let i = 0; i < remainingPanels.length; i++) {
            const panel = remainingPanels[i];
            let bestRectIdx = -1;
            let bestRotated = false;
            let minShortSideFit = Infinity;
            let minLongSideFit = Infinity;

            for (let j = 0; j < freeRects.length; j++) {
                const fr = freeRects[j];

                if (panel.width <= fr.w && panel.height <= fr.h) {
                    const leftoverW = fr.w - panel.width;
                    const leftoverH = fr.h - panel.height;
                    const shortSideFit = Math.min(leftoverW, leftoverH);
                    const longSideFit = Math.max(leftoverW, leftoverH);

                    if (shortSideFit < minShortSideFit || (shortSideFit === minShortSideFit && longSideFit < minLongSideFit)) {
                        minShortSideFit = shortSideFit;
                        minLongSideFit = longSideFit;
                        bestRectIdx = j;
                        bestRotated = false;
                    }
                }

                if (panel.allowRotation && panel.height <= fr.w && panel.width <= fr.h) {
                    const leftoverW = fr.w - panel.height;
                    const leftoverH = fr.h - panel.width;
                    const shortSideFit = Math.min(leftoverW, leftoverH);
                    const longSideFit = Math.max(leftoverW, leftoverH);

                    if (shortSideFit < minShortSideFit || (shortSideFit === minShortSideFit && longSideFit < minLongSideFit)) {
                        minShortSideFit = shortSideFit;
                        minLongSideFit = longSideFit;
                        bestRectIdx = j;
                        bestRotated = true;
                    }
                }
            }

            if (bestRectIdx !== -1) {
                const fr = freeRects.splice(bestRectIdx, 1)[0];
                const w = bestRotated ? panel.height : panel.width;
                const h = bestRotated ? panel.width : panel.height;

                sheetResults.placements.push({
                    ...panel,
                    x: fr.x, y: fr.y, w, h, rotated: bestRotated
                });

                const remainingW = fr.w - w;
                const remainingH = fr.h - h;

                if (remainingW > 0 || remainingH > 0) {
                    // Split Heuristic logic
                    let splitVertical: boolean;
                    if (splitHeuristic === 'ShorterAxis') {
                        splitVertical = (remainingW > remainingH);
                    } else { // LongerAxis
                        splitVertical = (remainingW <= remainingH);
                    }

                    if (splitVertical) {
                        if (remainingW > kerf) {
                            freeRects.push({ x: fr.x + w + kerf, y: fr.y, w: remainingW - kerf, h: fr.h });
                        }
                        if (remainingH > kerf) {
                            freeRects.push({ x: fr.x, y: fr.y + h + kerf, w: w, h: remainingH - kerf });
                        }
                    } else {
                        if (remainingH > kerf) {
                            freeRects.push({ x: fr.x, y: fr.y + h + kerf, w: fr.w, h: remainingH - kerf });
                        }
                        if (remainingW > kerf) {
                            freeRects.push({ x: fr.x + w + kerf, y: fr.y, w: remainingW - kerf, h: h });
                        }
                    }
                }

                remainingPanels.splice(i, 1);
                i--;
            }
        }

        if (sheetResults.placements.length > 0) {
            const usedArea = sheetResults.placements.reduce((sum, p) => sum + (p.w * p.h), 0);
            sheetResults.efficiency = ((usedArea / (sheet.width * sheet.height)) * 100).toFixed(1);
            results.push(sheetResults);
        }
        if (remainingPanels.length === 0) break;
    }

    const totalUsedArea = results.reduce((sum, s) => sum + s.placements.reduce((pSum, p) => pSum + (p.w * p.h), 0), 0);
    const totalStockArea = results.reduce((sum, s) => sum + (s.width * s.height), 0);
    const totalWaste = totalStockArea - totalUsedArea;

    return {
        sheets: results,
        unplaced: remainingPanels,
        totalEfficiency: totalStockArea > 0 ? ((totalUsedArea / totalStockArea) * 100).toFixed(1) : 0,
        totalWaste: totalWaste.toFixed(2),
        sheetsUsed: results.length
    };
};

export const optimize = (
    panels: Panel[],
    stockSheets: StockSheet[],
    options: { kerf: number } = { kerf: 0.125 }
): OptimizationResults => {
    const sortingOrders: SortOrder[] = ['Area', 'Width', 'Height', 'MaxSide'];
    const heuristics: SplitHeuristic[] = ['ShorterAxis', 'LongerAxis'];

    let bestResult: OptimizationResults | null = null;
    let minWaste = Infinity;

    for (const sort of sortingOrders) {
        for (const heuristic of heuristics) {
            const result = runOptimizationPass(panels, stockSheets, options.kerf, sort, heuristic);
            const waste = parseFloat(result.totalWaste);

            // Criteria: Least sheets used first, then least waste
            if (!bestResult ||
                result.sheetsUsed < bestResult.sheetsUsed ||
                (result.sheetsUsed === bestResult.sheetsUsed && waste < minWaste)) {
                bestResult = result;
                minWaste = waste;
            }
        }
    }

    return bestResult!;
};
