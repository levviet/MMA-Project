import { useEffect } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { account } from "@/lib/appwrite";

const VerifyEmail = () => {
  const { userId, secret } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log("userId nhận từ URL:", userId);
    console.log("secret nhận từ URL:", secret);

    if (userId && secret) {
      verifyEmail();
    }
  }, [userId, secret]);

  const verifyEmail = async () => {
    try {
      await account.updateVerification(userId as string, secret as string);
      Alert.alert("Thành công", "Xác thực email thành công!", [
        { text: "OK", onPress: () => router.push("/sign-in") },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Xác thực thất bại.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#FF6F61" />
      <Text>Đang xác thực email...</Text>
    </View>
  );
};

export default VerifyEmail;
