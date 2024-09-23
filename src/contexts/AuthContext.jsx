import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Kullanıcı bilgisini almak için kullanılan fonksiyon
  const getUser = async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login/success`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const resObject = await response.json();
        setUser(resObject.user);
        console.log("User authenticated:", resObject.user);
      } else {
        throw new Error("Authentication has failed!");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Mevcut tokenları kontrol etme
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Query parametrelerinden token alımı ve yönlendirme
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const refreshToken = queryParams.get("refreshToken");

    if (token && refreshToken) {
      // Token'ları localStorage'a kaydet
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      // Kullanıcı bilgilerini al ve ardından anasayfaya yönlendir
      getUser(token);

      // URL'deki query parametrelerini temizle
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const logout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setUser(null); // Kullanıcıyı null yaparak oturumu sonlandır
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
