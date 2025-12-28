import React, { ReactNode } from 'react';
import { MedicationProvider, useMedications } from '../context/MedicationContext';
import { WaterProvider } from '../context/WaterContext';
import { DailyProvider } from '../context/DailyContext';

const DailyProviderWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { medications } = useMedications();
  
  return (
    <DailyProvider medications={medications}>
      {children}
    </DailyProvider>
  );
};

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <MedicationProvider>
      <WaterProvider>
        <DailyProviderWrapper>
          {children}
        </DailyProviderWrapper>
      </WaterProvider>
    </MedicationProvider>
  );
};


