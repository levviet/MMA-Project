import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import { register } from "@/lib/appwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const SignUp = () => {
  const { refetch } = useGlobalContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const user = await register(email, password, name);
      setLoading(false);

      if (user) {
        refetch(); // Refresh user state
        Alert.alert("Success", "Account created successfully. You can now log in.");
        router.push("/sign-in"); // Redirect to login page
      }
    } catch (error: any) {
      setLoading(false);
      Alert.alert("Error", error.message || "Registration failed.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Background Image */}
        <View style={styles.imageContainer}>
          <Image source={images.onboarding} style={styles.image} resizeMode="cover" />
          <LinearGradient colors={["rgba(255,255,255,0)", "rgba(255,255,255,1)"]} style={styles.gradient} />
        </View>

        <View style={styles.content}>
          <Text style={styles.welcomeText}>Create a new account</Text>
          <Text style={styles.title}> Sign up to continue </Text>

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />

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

          {/* Sign Up Button */}
          <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton} disabled={loading}>
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
          </TouchableOpacity>

          {/* Link to Sign In */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <Text style={styles.signUpLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  imageContainer: {
    width: "100%",
    height: "35%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 120,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: "Rubik-Regular",
    color: "#A0A0A0",
    textAlign: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: "Rubik-Bold",
    color: "#333",
    textAlign: "center",
    marginTop: 10,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 16,
    marginTop: 15,
  },
  signUpButton: {
    backgroundColor: "#FF6F61",
    borderRadius: 10,
    width: "100%",
    paddingVertical: 15,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Rubik-Medium",
    color: "#fff",
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
    color: '#A0A0A0',
    marginRight: 5,
  },
  signUpLink: {
    fontSize: 16,
    fontFamily: 'Rubik-Medium',
    color: '#FF6F61',
  },
});

export default SignUp;
