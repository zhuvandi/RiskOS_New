-- Create trades table
CREATE TABLE public.trades (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    type text NOT NULL CHECK (type IN ('LONG', 'SHORT')),
    amount numeric NOT NULL,
    status text NOT NULL CHECK (status IN ('OPEN', 'CLOSED', 'LIQUIDATED')),
    timestamp timestamp with time zone DEFAULT now() NOT NULL,
    drawdown_percent numeric,
    leverage_used numeric,
    win boolean,
    time_in_trade_mins integer
);

-- Enable Row Level Security
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Create Policy for users to see only their own trades
CREATE POLICY "Users can view own trades" 
ON public.trades FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" 
ON public.trades FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" 
ON public.trades FOR UPDATE 
USING (auth.uid() = user_id);

-- Create risk_logs table
CREATE TABLE public.risk_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    risk_score integer NOT NULL,
    discipline integer NOT NULL,
    emotional_heat integer NOT NULL,
    status text NOT NULL,
    timestamp timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.risk_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own risk logs" 
ON public.risk_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own risk logs" 
ON public.risk_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);
