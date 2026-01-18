import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [loading] = useState(false);

  const login = (data) => {
    const userData = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      token: data.token
    };
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", data.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  const updateUserName = (newName) => {
    if (user) {
      const updatedUser = { ...user, name: newName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserName, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
