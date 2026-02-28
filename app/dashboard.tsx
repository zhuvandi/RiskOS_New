import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { calculateRisk, RiskInput } from '../utils/riskEngine';

// Test Data
const DUMMY_TRADE_DATA: RiskInput = {
    currentDrawdownPercent: 6.5,
    consecutiveLosses: 3,
    averageWinRate: 0.35,
    leverageUsed: 15,
    timeInTradeMins: 45,
};

export default function DashboardScreen() {
    const riskResult = useMemo(() => calculateRisk(DUMMY_TRADE_DATA), []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CRITICAL': return 'text-red-600';
            case 'DANGER': return 'text-orange-500';
            case 'WARNING': return 'text-yellow-500';
            default: return 'text-emerald-500';
        }
    };

    return (
        <View className="flex-1 bg-zinc-950 px-6 pt-16 pb-8">
            <View className="mb-10">
                <Text className="text-zinc-400 text-sm font-semibold uppercase tracking-widest">System Status</Text>
                <Text className={`text-4xl font-black mt-1 ${getStatusColor(riskResult.status)}`}>
                    {riskResult.status}
                </Text>
            </View>

            <View className="flex-col space-y-4">
                {/* Risk Score */}
                <View className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
                    <Text className="text-zinc-400 text-sm mb-2">Total Risk Score</Text>
                    <View className="flex-row items-end">
                        <Text className="text-white text-5xl font-bold">{riskResult.riskScore}</Text>
                        <Text className="text-zinc-500 text-xl font-bold mb-1 ml-1">/ 100</Text>
                    </View>
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

            <View className="mt-auto">
                <Text className="text-zinc-600 text-center text-xs">RiskOS Next Gen Dashboard</Text>
            </View>
        </View>
    );
}
