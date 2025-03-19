import { Client, Account, Avatars, Databases, Query, ID } from "react-native-appwrite";
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

//Hàm fetching data trên Appwrite
export async function getLatestProperties() {
  try {
    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

//Hàm lấy Property
export async function getProperties({ filter, query, limit }: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc('$createdAt')];

    if (filter && filter !== 'All') {
      buildQuery.push(Query.equal('type', filter));
    }

    if (query) {
      buildQuery.push(
        Query.or([
          Query.search('name', query),
          Query.search('address', query),
          Query.search('type', query),
        ])
      )
    }

    if (limit) {
      buildQuery.push(Query.limit(limit));
    }

    const result = await databases.listDocuments(
      config.databaseId!,
      config.propertiesCollectionId!,
      buildQuery,
    );

    return result.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPropertyById({ id }: { id: string }) {
  try {
    const result = await databases.getDocument(
      config.databaseId!,
      config.propertiesCollectionId!,
      id,
    )
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function register(email: string, password: string, name: string): Promise<any> {
  try {
    // Đăng ký tài khoản mới
    const user = await account.create("unique()", email, password, name);
    console.log("Registration successful:", user);

    // Tạo session ngay sau khi đăng ký
    const session = await account.createSession(email, password);
    console.log("Session created successfully:", session);

    // Gửi email xác thực
    const verificationResponse = await account.createVerification(
      process.env.EXPO_PUBLIC_APPWRITE_VERIFICATION_URL as string
    );
    console.log("Verification email sent:", verificationResponse);

    return user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Registration error:", error.message);
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during registration.");
  }
}