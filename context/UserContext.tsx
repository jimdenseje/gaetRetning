import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState
} from 'react';

type AuthData = {
  username: string | null;
  token: string | null;
  tokenCreatedAt: string | null;
};

type UserContextType = AuthData & {
  setAuth: (username: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  username: null,
  token: null,
  tokenCreatedAt: null,
  setAuth: async () => {},
  logout: async () => {},
});

export function UserProvider({ children }: PropsWithChildren) {
  const [authData, setAuthData] = useState<AuthData>({
    username: null,
    token: null,
    tokenCreatedAt: null,
  });

  useEffect(() => {
    const loadAuth = async () => {
      const stored = await AsyncStorage.getItem('authData');
      if (stored) {
        setAuthData(JSON.parse(stored));
      }
    };

    loadAuth();
  }, []);

  const setAuth = async (username: string, token: string) => {
    const newAuth: AuthData = {
      username,
      token,
      tokenCreatedAt: new Date().toISOString().split('T')[0],
    };

    await AsyncStorage.setItem('authData', JSON.stringify(newAuth));
    setAuthData(newAuth);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authData');
    setAuthData({
      username: null,
      token: null,
      tokenCreatedAt: null,
    });
  };

  return (
    <UserContext.Provider
      value={{
        ...authData,
        setAuth,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}