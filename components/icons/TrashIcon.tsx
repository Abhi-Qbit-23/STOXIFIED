
import React from 'react';

interface IconProps {
  className?: string;
}

export const TrashIcon: React.FC<IconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.24.086 3.305.247m0 0a48.537 48.537 0 01-4.117-2.173L6.76 4.22a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75l.586 1.487c.523.326 1.041.618 1.55.874m-4.117-2.173a2.25 2.25 0 012.244-2.077H15.92a2.25 2.25 0 012.244 2.077L19.228 5.79m-14.456 0H19.228" />
  </svg>
);