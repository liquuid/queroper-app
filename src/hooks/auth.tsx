import React, { createContext , useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api';

interface SignIntCredendials {
    email: string;
    password: string;
}

interface AuthState {
    token: string;
    user: object;
}

interface AuthContextData {
    user: object;
    loading: boolean;
    signIn(credentials: SignIntCredendials): Promise<void>;
    signOut(): void;
}

const AuthContext = createContext<AuthContextData>(
     {} as AuthContextData,
 );

const AuthProvider: React.FC = ({ children }) => {
     const [data, setData] = useState<AuthState>({} as AuthState);
     const [loading, setLoading ] = useState(true);

     useEffect(() => {
        async function loadStoragedData(): Promise<void> {
            const token = await AsyncStorage.getItem('@QueroPet:token');
            const user = await AsyncStorage.getItem('@QueroPet:user');

            if(token && user ){
                setData({ token: token, user: JSON.parse(user) });
            }
            setLoading(false);
        }
        loadStoragedData();
     }, [])
     const signIn = useCallback(async ({ email, password })=>{
         const response = await api.post('sessions', {
             email,
             password
         });
         const { token, user } = response.data;

         await AsyncStorage.setItem('@QueroPet:token', token);
         await AsyncStorage.setItem('@QueroPet:user', JSON.stringify(user));

         setData({ token, user});
     },[]);

     const signOut = useCallback(async ()=>{
        await AsyncStorage.removeItem('@QueroPet:token');
        await AsyncStorage.removeItem('@QueroPet:user');
        setData({} as AuthState);

     },[]);
    return(
        <AuthContext.Provider value={{ user: data.user, loading , signIn, signOut }} >
            {children}
        </AuthContext.Provider>
    );
 };

 function useAuth(): AuthContextData {
     const context = useContext(AuthContext);

     if (!context){
         throw new Error('useAuth must be used within an AuthProvider');
     }
     return context;
 }

 export  { AuthProvider, useAuth }
