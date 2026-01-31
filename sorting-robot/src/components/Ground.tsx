import React from 'react';
import { COLORS } from '../utils/constants';

export const Ground: React.FC<{ y: number, width: number }> = ({ y, width }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        width: width,
        height: 20, // Slightly thicker
        backgroundColor: COLORS.text,
        borderRadius: 10,
        opacity: 0.3,
      }}
    />
  );
};
