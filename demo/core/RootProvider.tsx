import { Themes } from '@dtdot/lego';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
      'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${(Themes.dark as any).colours.background};

    * {
      box-sizing: border-box;
    }
  }
`;

export interface RootProviderProps {
  children: React.ReactNode;
}

const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={Themes.dark}>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default RootProvider;
