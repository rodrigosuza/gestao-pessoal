

import { useState, useEffect, useCallback } from 'react';
import { AppData } from '../types';

const DATA_KEY = 'fixx_app_data';

export const getDefaultData = (): AppData => ({
  saldo_conta: 0,
  despesas: {},
  cofre: {},
  deletedInstances: {},
});

export const useAppData = () => {
  const [appData, setAppDataState] = useState<AppData | null>(null);
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(DATA_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData) as AppData;
        // Basic validation to ensure essential keys exist
        if (parsedData.saldo_conta !== undefined && parsedData.despesas) {
           setAppDataState({ ...getDefaultData(), ...parsedData });
        } else {
           setAppDataState(getDefaultData());
        }
      } else {
        setAppDataState(getDefaultData());
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      setAppDataState(getDefaultData());
    } finally {
        setIsDataReady(true);
    }
  }, []);

  const setAppData = useCallback((updater: AppData | ((prev: AppData) => AppData)) => {
    setAppDataState(prevData => {
      const newData = typeof updater === 'function' ? updater(prevData || getDefaultData()) : updater;
      try {
        localStorage.setItem(DATA_KEY, JSON.stringify(newData));
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
      return newData;
    });
  }, []);


  return { appData: appData!, setAppData, isDataReady };
};