import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  useEffect(() => {
    if (!getToken()) return;
    api
      .get('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const d = await api.post('/auth/login', { email, password });
    setToken(d.token);
    setUser(d.user);
    return d.user;
  };

  // signup ab login nahi karata, sirf OTP bhejta hai
  const signup = async (name, email, password) => {
    return await api.post('/auth/signup', { name, email, password });
  };

  const verifyEmail = async (email, otp) => {
    const d = await api.post('/auth/verify-email', { email, otp });
    setToken(d.token);
    setUser(d.user);
    return d.user;
  };

  const updateUser = (u) => setUser(u);

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, verifyEmail, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);