import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../utils/supabase';

export default function AddTradeScreen() {
    const router = useRouter();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [pair, setPair] = useState('BTC/USD');
    const [type, setType] = useState<'LONG' | 'SHORT'>('LONG');
    const [amount, setAmount] = useState('');
    const [entryPrice, setEntryPrice] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [emotionScore, setEmotionScore] = useState(5);

    const handleSubmit = async () => {
        if (!amount || isNaN(Number(amount))) {
            Alert.alert('Validation Error', 'Please enter a valid amount (lot size).');
            return;
        }
        if (!entryPrice || isNaN(Number(entryPrice))) {
            Alert.alert('Validation Error', 'Please enter a valid entry price.');
            return;
        }
        if (!user) {
            Alert.alert('Auth Error', 'You must be logged in.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.from('trades').insert({
            user_id: user.id,
            pair,
            type,
            amount: Number(amount),
            entry_price: Number(entryPrice),
            stop_loss: stopLoss ? Number(stopLoss) : null,
            emotion_score: emotionScore,
            status: 'OPEN',
        });
        setLoading(false);

        if (error) {
            Alert.alert('Error inserting trade', error.message);
        } else {
            Alert.alert('Success', 'Trade logged successfully!');
            router.replace('/dashboard');
        }
    };

    return (
        <ScrollView className="flex-1 bg-zinc-950 p-6">
            <View className="mb-6 flex-row items-center justify-between mt-10">
                <Text className="text-3xl font-black text-white">Log Trade</Text>
                <TouchableOpacity onPress={() => router.back()} disabled={loading}>
                    <Text className="text-red-500 font-bold">Cancel</Text>
                </TouchableOpacity>
            </View>

            {/* Pair */}
            <View className="mb-6">
                <Text className="text-zinc-400 font-bold mb-2">Trading Pair</Text>
                <TextInput
                    className="bg-zinc-900 border border-zinc-800 rounded-xl text-white px-4 py-4"
                    value={pair}
                    onChangeText={setPair}
                    placeholder="e.g. BTC/USD"
                    placeholderTextColor="#71717a"
                />
            </View>

            {/* Long/Short Toggle */}
            <View className="flex-row space-x-4 mb-6">
                <TouchableOpacity
                    className={`flex-1 py-4 rounded-xl items-center border ${type === 'LONG' ? 'bg-emerald-600 border-emerald-500' : 'bg-zinc-900 border-zinc-800'}`}
                    onPress={() => setType('LONG')}
                >
                    <Text className={`font-bold ${type === 'LONG' ? 'text-white' : 'text-zinc-400'}`}>LONG</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-4 rounded-xl items-center border ${type === 'SHORT' ? 'bg-red-600 border-red-500' : 'bg-zinc-900 border-zinc-800'}`}
                    onPress={() => setType('SHORT')}
                >
                    <Text className={`font-bold ${type === 'SHORT' ? 'text-white' : 'text-zinc-400'}`}>SHORT</Text>
                </TouchableOpacity>
            </View>

            {/* Amount / Lot */}
            <View className="mb-6">
                <Text className="text-zinc-400 font-bold mb-2">Position Size (Amount / Lot)</Text>
                <TextInput
                    className="bg-zinc-900 border border-zinc-800 rounded-xl text-white px-4 py-4"
                    value={amount}
                    onChangeText={setAmount}
                    placeholder="e.g. 0.1"
                    placeholderTextColor="#71717a"
                    keyboardType="decimal-pad"
                />
            </View>

            {/* Entry Price */}
            <View className="mb-6">
                <Text className="text-zinc-400 font-bold mb-2">Entry Price</Text>
                <TextInput
                    className="bg-zinc-900 border border-zinc-800 rounded-xl text-white px-4 py-4"
                    value={entryPrice}
                    onChangeText={setEntryPrice}
                    placeholder="e.g. 64500"
                    placeholderTextColor="#71717a"
                    keyboardType="decimal-pad"
                />
            </View>

            {/* Stop Loss Price */}
            <View className="mb-6">
                <Text className="text-zinc-400 font-bold mb-2">Stop Loss</Text>
                <TextInput
                    className="bg-zinc-900 border border-zinc-800 rounded-xl text-white px-4 py-4"
                    value={stopLoss}
                    onChangeText={setStopLoss}
                    placeholder="Optional"
                    placeholderTextColor="#71717a"
                    keyboardType="decimal-pad"
                />
            </View>

            {/* Emotional State */}
            <View className="mb-10">
                <Text className="text-zinc-400 font-bold mb-2">Emotional Heat (1-10)</Text>
                <View className="flex-row justify-between mb-2">
                    <Text className="text-emerald-500 text-xs">Calm</Text>
                    <Text className="text-red-500 text-xs">Stressed</Text>
                </View>
                <View className="flex-row justify-between flex-wrap gap-y-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                        <TouchableOpacity
                            key={score}
                            onPress={() => setEmotionScore(score)}
                            className={`w-[45px] h-[45px] rounded-lg items-center justify-center border ${emotionScore === score
                                    ? score > 7 ? 'bg-red-600 border-red-500' : score < 4 ? 'bg-emerald-600 border-emerald-500' : 'bg-yellow-600 border-yellow-500'
                                    : 'bg-zinc-900 border-zinc-800'
                                }`}
                        >
                            <Text className={`font-bold ${emotionScore === score ? 'text-white' : 'text-zinc-500'}`}>
                                {score}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <TouchableOpacity
                className="bg-red-600 rounded-xl py-4 items-center mb-10 active:bg-red-700"
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white font-bold text-lg">Log Trade</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}
