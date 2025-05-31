'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import "../styles/globals.css";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <div className="theme-container">{children}</div>;
}
