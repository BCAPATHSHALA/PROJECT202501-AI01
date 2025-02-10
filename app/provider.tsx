"use client";
import { auth } from "@/configs/firebaseConfig";
import { AuthContext, AuthContextType } from "@/context/AuthContext";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";

// This is a provider component for useing the context API
function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      <div>{children}</div>
    </AuthContext.Provider>
  );
}

// Custom hook to use auth
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default Provider;
