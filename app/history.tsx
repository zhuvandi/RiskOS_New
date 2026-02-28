import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../utils/supabase';
import { Trade } from '../utils/types';

export default function HistoryScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('trades')
            .select('*')
            .eq('user_id', user.id)
            .order('timestamp', { ascending: false });

        if (error) console.error('Error fetching history:', error);
        else if (data) setTrades(data as Trade[]);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [user])
    );

    const renderItem = ({ item }: { item: Trade }) => {
        const isLong = item.type === 'LONG';
        const isWin = item.win === true;
        const isLoss = item.win === false;

        return (
            <View className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-3 flex-row justify-between items-center">
                <View>
                    <Text className="text-white font-bold text-lg mb-1">{item.pair || 'Unknown Pair'}</Text>
                    <View className="flex-row items-center gap-2">
                        <Text className={isLong ? 'text-emerald-500 font-bold' : 'text-red-500 font-bold'}>
                            {item.type}
                        </Text>
                        <Text className="text-zinc-500">Lot: {item.amount}</Text>
                    </View>
                </View>
                <View className="items-end">
                    <Text className={`font-bold ${isWin ? 'text-emerald-400' : isLoss ? 'text-red-400' : 'text-zinc-400'}`}>
                        {isWin ? 'WIN' : isLoss ? 'LOSS' : item.status}
                    </Text>
                    {item.emotion_score && (
                        <Text className="text-zinc-500 text-xs mt-1">Emotion: {item.emotion_score}/10</Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-zinc-950 p-6">
            <View className="mb-6 flex-row items-center justify-between mt-10">
                <Text className="text-3xl font-black text-white">History</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text className="text-red-500 font-bold">Close</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#ef4444" className="mt-10" />
            ) : trades.length === 0 ? (
                <Text className="text-zinc-500 text-center mt-10 text-lg">No trades logged yet.</Text>
            ) : (
                <FlatList
                    data={trades}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}
