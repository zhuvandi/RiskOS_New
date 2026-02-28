import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center bg-zinc-950 p-6">
            <View className="w-full max-w-sm">
                <Text className="text-4xl font-bold text-white text-center mb-8">
                    RiskOS
                </Text>

                <Text className="text-zinc-400 text-center mb-8">
                    System Core Online. Please Authenticate.
                </Text>

                <TouchableOpacity
                    className="bg-red-600 rounded-xl py-4 items-center mb-4 active:bg-red-700"
                    onPress={() => router.replace('/dashboard')}
                >
                    <Text className="text-white font-bold text-lg">
                        Enter Dashboard
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
