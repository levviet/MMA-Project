import { 
    View, Text, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '@/constants/images';
import { login } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";

const SignIn = () => {
    const { refetch } = useGlobalContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter your email and password");
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result) {
            refetch();
            router.push("/");
        } else {
            Alert.alert("Error", "Invalid email or password. Please try again!");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Background Image */}
                <View style={styles.imageContainer}>
                    <Image source={images.onboarding} style={styles.image} resizeMode='cover' />
                    <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} style={styles.gradient} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.welcomeText}>Welcome to Vit</Text>

                    <Text style={styles.title}>
                        Sign in to continue
                    </Text>

                    {/* Email Input */}
                    <TextInput 
                        style={styles.input} 
                        placeholder="Enter your email" 
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    {/* Password Input */}
                    <TextInput 
                        style={styles.input} 
                        placeholder="Enter your password" 
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    {/* Sign In Button */}
                    <TouchableOpacity onPress={handleLogin} style={styles.loginButton} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    imageContainer: {
        width: '100%',
        height: '50%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 120, 
    },
    content: {
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 16,
        fontFamily: 'Rubik-Regular',
        color: '#A0A0A0',
        textAlign: 'center',
        marginTop: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: 'Rubik-Bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 10,
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        fontSize: 16,
        marginTop: 15,
    },
    loginButton: {
        backgroundColor: '#FF6F61',
        borderRadius: 10,
        width: '100%',
        paddingVertical: 15,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontFamily: 'Rubik-Medium',
        color: '#fff',
    },
});

export default SignIn;
