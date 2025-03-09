import { Client, Account, Avatars, Databases } from "react-native-appwrite";
import * as Linking from "expo-linking";

export const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT as string,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID as string,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string,
  galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID as string,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID as string,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID as string,
  propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID as string
};

export const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

//Hàm đăng nhập với kiểu dữ liệu rõ ràng
export async function login(email: string, password: string): Promise<any> {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Đăng nhập thành công:", session);
    return session;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Lỗi đăng nhập:", error.message);
      throw new Error(error.message); // Trả về lỗi rõ ràng
    }
    throw new Error("Đã xảy ra lỗi không xác định khi đăng nhập.");
  }
}

//Hàm đăng xuất với kiểu dữ liệu rõ ràng
export async function logout(): Promise<boolean> {
  try {
    await account.deleteSession("current");
    console.log("Đã đăng xuất");
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Lỗi khi đăng xuất:", error.message);
    }
    return false;
  }
}

//Hàm lấy thông tin user với kiểu dữ liệu rõ ràng
export async function getCurrentUser(): Promise<{ avatar: string } | null> {
  try {
    const user = await account.get();
    if (user.$id) {
      const userAvatar = avatar.getInitials(user.name);
      return { ...user, avatar: userAvatar.toString() };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Không thể lấy thông tin user:", error.message);
    }
  }
  return null;
}
