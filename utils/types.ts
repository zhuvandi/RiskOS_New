export interface Trade {
    id: string;
    user_id: string;
    type: 'LONG' | 'SHORT';
    amount: number;
    status: 'OPEN' | 'CLOSED' | 'LIQUIDATED';
    timestamp: string;
    // Risk-related fields
    drawdown_percent?: number;
    leverage_used?: number;
    win?: boolean;
    time_in_trade_mins?: number;
    // Trading Journal additions
    pair?: string;
    entry_price?: number;
    stop_loss?: number;
    emotion_score?: number; // 1-10
}
