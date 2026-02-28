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
}
