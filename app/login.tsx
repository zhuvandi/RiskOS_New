import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../components/AuthContext';
import { supabase } from '../utils/supabase';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { session, loading: sessionLoading } = useAuth();

    useEffect(() => {
        if (session) {
            router.replace('/dashboard');
        }
    }, [session]);

    const signUpWithEmail = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });
        setLoading(false);

        if (error) Alert.alert('Registration Failed', error.message);
        else Alert.alert('Success', 'Check your email for the confirmation link (if enabled).');
    };

    const signInWithEmail = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);

        if (error) Alert.alert('Login Failed', error.message);
        // On success, useEffect will redirect to dashboard
    };

    if (sessionLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-zinc-950">
                <ActivityIndicator size="large" color="#ef4444" />
            </View>
        );
    }

    return (
        <View className="flex-1 items-center justify-center bg-zinc-950 p-6">
            <View className="w-full max-w-sm">
                <Text className="text-4xl font-bold text-white text-center mb-2">
                    RiskOS
                </Text>

                <Text className="text-zinc-500 text-center mb-10">
                    System Core Online. Please Authenticate.
                </Text>

                <TextInput
                    className="bg-zinc-900 border border-zinc-800 rounded-xl text-white px-4 py-4 mb-4"
                    placeholder="Email address"
                    placeholderTextColor="#71717a"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    className="bg-zinc-900 border border-zinc-800 rounded-xl text-white px-4 py-4 mb-8"
                    placeholder="Password"
                    placeholderTextColor="#71717a"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TouchableOpacity
                    className="bg-red-600 rounded-xl py-4 items-center mb-4 active:bg-red-700"
                    onPress={signInWithEmail}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-zinc-800 rounded-xl py-4 items-center active:bg-zinc-700"
                    onPress={signUpWithEmail}
                    disabled={loading}
                >
                    <Text className="text-white font-bold text-lg">Register</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
