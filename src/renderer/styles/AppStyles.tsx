import { GlobalStyles } from '@mui/material';
import React from 'react';

export const AppStyles = () => (
  <GlobalStyles
    styles={{
      '*': {
        userSelect: 'none',
      },

      '::-webkit-scrollbar': {
        width: '4px',
        height: '4px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
      },

      '::-webkit-scrollbar-thumb': {
        background: '#cecece',
      },

      '::-webkit-scrollbar-thumb:hover': {
        background: '#b8b8b8',
      },

      body: {
        overflow: 'hidden',
      },
    }}
  />
);
