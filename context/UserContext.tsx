import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';

type UserContextType = {
  username: string | null;
  setUsername: (name: string) => Promise<void>;
};

export const UserContext = createContext<UserContextType>({
  username: null,
  setUsername: async () => {},
});

type Props = {
  children: ReactNode;
};

export function UserProvider({ children }: Props) {
  const [username, setUsernameState] = useState<string | null>(null);

  // Load stored username
  useEffect(() => {
    const loadUsername = async () => {
      const stored = await AsyncStorage.getItem('username');
      if (stored) setUsernameState(stored);

      // For testing: clear username on app start
      //setUsernameState("");
    };

    loadUsername();
  }, []);

  const setUsername = async (name: string) => {
    console.log('Setting username:', name);
    await AsyncStorage.setItem('username', name);
    setUsernameState(name);
  };

  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}
