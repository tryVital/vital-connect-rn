import '@react-navigation/native';

// Override the theme in react native navigation to accept our custom theme props.
declare module '@react-navigation/native' {
  export type ExtendedTheme = {
    dark: boolean;
    colors: {
      primary: string;
      secondary: string;
      background: string;
      primary: string;
      backgroundSection: string;
      text: string;
      border: string;
      notification: string;
      ['purple.400']: string;
      ['black.400']: string;
      ['gray.400']: string;
      ['gray.400']: string;
    };
  };
  export function useTheme(): ExtendedTheme;
}

