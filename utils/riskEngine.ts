export interface RiskInput {
    currentDrawdownPercent: number; // e.g., 5.0 for 5%
    consecutiveLosses: number;
    averageWinRate: number; // e.g., 0.45 for 45%
    leverageUsed: number; // e.g., 10 for 10x
    timeInTradeMins: number; // Average or current
}

export interface RiskOutput {
    riskScore: number;     // 0 to 100
    discipline: number;    // 0 to 100
    emotionalHeat: number; // 0 to 100
    status: 'SAFE' | 'WARNING' | 'DANGER' | 'CRITICAL';
}

export const calculateRisk = (input: RiskInput): RiskOutput => {
    // 1. Emotional Heat (Factors: consecutive losses, drawdown, time in trade)
    let emotionalHeat = (input.consecutiveLosses * 15) + (input.currentDrawdownPercent * 5);
    if (input.timeInTradeMins > 120) {
        emotionalHeat += 10; // Fatigue factor
    }
    emotionalHeat = Math.min(100, Math.max(0, emotionalHeat));

    // 2. Discipline (Factors: leverage, win rate vs risk)
    let discipline = 100 - (input.leverageUsed * 2);
    if (input.averageWinRate < 0.3) {
        discipline -= 20; // Low win rate requires higher discipline
    }
    discipline = Math.min(100, Math.max(0, discipline));

    // 3. Overall Risk Score (Weighted average)
    let riskScore = (emotionalHeat * 0.6) + ((100 - discipline) * 0.4) + (input.currentDrawdownPercent * 2);
    riskScore = Math.min(100, Math.max(0, Math.round(riskScore)));

    // Status evaluation
    let status: RiskOutput['status'] = 'SAFE';
    if (riskScore >= 80) status = 'CRITICAL';
    else if (riskScore >= 60) status = 'DANGER';
    else if (riskScore >= 40) status = 'WARNING';

    return {
        riskScore: Math.round(riskScore),
        discipline: Math.round(discipline),
        emotionalHeat: Math.round(emotionalHeat),
        status
    };
};
