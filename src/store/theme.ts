import { create } from 'zustand';

export type Theme = {
  primaryColor: string
  dangerColor: string
  warningColor: string
  bgPrimaryColor: string
  bgSecondaryColor: string
  titleColor: string
  paragraphColor: string
  mutedColor: string
  borderColor: string
}
  
export const lightTheme: Theme = {
  primaryColor: '#00E588',
  dangerColor: '#EA6565',
  warningColor: '#E59500',
  bgPrimaryColor: '#FFFFFF',
  bgSecondaryColor: '#F9FAFB',
  titleColor: '#0A0A0A',
  paragraphColor: '#393939',
  mutedColor: '#868686',
  borderColor: '#D9D9D9',
}

export const darkTheme: Theme = {
  primaryColor: '#00E588',
  dangerColor: '#EA6565',
  warningColor: '#E59500',
  bgPrimaryColor: '#0A0A0A',
  bgSecondaryColor: '#1A1B1A',
  titleColor: '#FFFFFF',
  paragraphColor: '#D9D9D9',
  mutedColor: '#868686',
  borderColor: '#393939',
}


export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeMode = keyof typeof themes;

type ThemeState = {
  mode: ThemeMode;
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark', 
  theme: darkTheme,
  setMode: (mode) =>
    set(() => ({
      mode,
      theme: themes[mode],
    })),
}));