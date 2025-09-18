import React from 'react';
import { useLocalStorage } from './utils.js';
const AppContext=React.createContext(null); export const useApp=()=>React.useContext(AppContext);
export function AppProvider({children}){const [entries,setEntries]=useLocalStorage('entries',[]);const value={entries};return <AppContext.Provider value={value}>{children}</AppContext.Provider>}
