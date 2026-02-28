```
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import React, { useState, useMemo, useCallback } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../components/AuthContext';
import { calculateRisk, RiskInput } from '../utils/riskEngine';
import { supabase } from '../utils/supabase';
import { Trade } from '../utils/types';

export default function DashboardScreen() {
    const { session, user } = useAuth();
    const router = useRouter();
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!session) {
        router.replace('/login');
        return;
      }
      fetchTrades();
    }, [session])
  );

    const fetchTrades = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('trades')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching trades', error);
        } else if (data) {
            setTrades(data as Trade[]);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace('/login');
    };

    const riskInput = useMemo<RiskInput>(() => {
        if (trades.length === 0) {
            return {
                currentDrawdownPercent: 0,
                consecutiveLosses: 0,
                averageWinRate: 0,
                leverageUsed: 0,
                timeInTradeMins: 0,
            };
        }

        // Calculate dynamic values based on the last 10 trades
        const wins = trades.filter(t => t.win).length;
        const losses = trades.length - wins;
        let maxConsecutiveLosses = 0;
        let currentConsecutiveLosses = 0;

        for (const trade of trades) {
            if (!trade.win) {
                currentConsecutiveLosses++;
                if (currentConsecutiveLosses > maxConsecutiveLosses) {
                    maxConsecutiveLosses = currentConsecutiveLosses;
                }
            } else {
                currentConsecutiveLosses = 0;
            }
        }

        const avgDrawdown = trades.reduce((acc, t) => acc + (t.drawdown_percent || 0), 0) / trades.length;
        const avgLeverage = trades.reduce((acc, t) => acc + (t.leverage_used || 0), 0) / trades.length;
        const avgTime = trades.reduce((acc, t) => acc + (t.time_in_trade_mins || 0), 0) / trades.length;

        return {
            currentDrawdownPercent: avgDrawdown,
            consecutiveLosses: maxConsecutiveLosses,
            averageWinRate: trades.length > 0 ? wins / trades.length : 0,
            leverageUsed: avgLeverage,
            timeInTradeMins: avgTime,
        };
    }, [trades]);

    const riskResult = useMemo(() => calculateRisk(riskInput), [riskInput]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CRITICAL': return 'text-red-600';
            case 'DANGER': return 'text-orange-500';
            case 'WARNING': return 'text-yellow-500';
            default: return 'text-emerald-500';
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-zinc-950">
                <ActivityIndicator size="large" color="#ef4444" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-zinc-950 px-6 pt-16 pb-8">
            <View className="flex-row justify-between items-center mb-10">
                <View>
                    <Text className="text-zinc-400 text-sm font-semibold uppercase tracking-widest">System Status</Text>
                    <Text className={`text - 4xl font - black mt - 1 ${ getStatusColor(riskResult.status) } `}>                        {trades.length === 0 ? 'NO DATA' : riskResult.status}
                    </Text>
                </View>
                <TouchableOpacity onPress={handleLogout} className="bg-zinc-800 px-4 py-2 rounded-lg">
                    <Text className="text-red-500 font-bold text-xs uppercase tracking-wider">Log out</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-col space-y-4">
                {/* Risk Score */}
                <View className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <Text className="text-zinc-400 text-sm mb-2">Total Risk Score</Text>
                    <View className="flex-row items-end">
                        <Text className="text-white text-5xl font-bold">{riskResult.riskScore}</Text>
                        <Text className="text-zinc-500 text-xl font-bold mb-1 ml-1">/ 100</Text>
                    </View>
                    <Text className="text-zinc-600 text-xs mt-3">Based on last {trades.length} trades</Text>
                </View>

                <View className="flex-row space-x-4">
                    {/* Discipline */}
                    <View className="flex-1 bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <Text className="text-zinc-400 text-sm mb-2">Discipline</Text>
                        <View className="flex-row items-end">
                            <Text className="text-white text-4xl font-bold">{riskResult.discipline}</Text>
                            <Text className="text-zinc-500 text-base font-bold mb-1 ml-1">%</Text>
                        </View>
                    </View>

                    {/* Emotion */}
                    <View className="flex-1 bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                        <Text className="text-zinc-400 text-sm mb-2">Emotional Heat</Text>
                        <View className="flex-row items-end">
                            <Text className="text-white text-4xl font-bold">{riskResult.emotionalHeat}</Text>
                            <Text className="text-zinc-500 text-base font-bold mb-1 ml-1">%</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="mt-auto pb-4">
        <View className="flex-row space-x-4 mb-4">
          <TouchableOpacity 
            className="flex-1 bg-zinc-900 border border-zinc-800 py-4 rounded-xl items-center active:bg-zinc-800"
            onPress={() => router.push('/history')}
          >
            <Text className="text-zinc-300 font-bold">History</Text>
          </TouchableOpacity>
           <TouchableOpacity 
            className="flex-1 bg-red-600 rounded-xl py-4 items-center active:bg-red-700 shadow-sm shadow-red-900"
            onPress={() => router.push('/add-trade')}
          >
            <Text className="text-white font-bold">+ New Trade</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-zinc-600 text-center text-xs mt-2">RiskOS Next Gen Dashboard</Text>
      </View>
    </View>
  );
}
