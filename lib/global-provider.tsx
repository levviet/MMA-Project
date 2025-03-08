import React, { createContext, useContext, ReactNode } from "react";
import { useAppwrite } from "@/lib/useAppwrite";
import { getCurrentUser } from "./appwrite";

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: rawUser,
    loading,
    refetch
  } = useAppwrite({
    fn: getCurrentUser,
  });

  // Chuẩn hóa dữ liệu `user`, chỉ lấy các trường cần thiết
  const user: User | null = rawUser
    ? {
        $id: rawUser.$id,
        name: rawUser.name,
        email: rawUser.email,
        avatar: rawUser.avatar,
      }
    : null;

  const isLoggedIn = !!user;

  // Đảm bảo `refetch` có thể nhận undefined
  const safeRefetch = (newParams?: Record<string, string | number>) => {
    return refetch(newParams ?? {}); // Tránh undefined bằng cách truyền giá trị mặc định
  };

  return (
    <GlobalContext.Provider value={{ isLoggedIn, user, loading, refetch: safeRefetch }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }

  return context;
};

export default GlobalProvider;
