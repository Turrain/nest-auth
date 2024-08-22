import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

import { BrowserRouter } from 'react-router-dom';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import CssBaseline from '@mui/joy/CssBaseline';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <CssVarsProvider defaultMode="dark" disableTransitionOnChange>
     <CssBaseline />
     <GlobalStyles
        styles={{
          ':root': {
            '--Form-maxWidth': '800px',
            '--Transition-duration': '0.4s', // set to `none` to disable transition
          },
        }}
      />
     <BrowserRouter>
      <App />
    </BrowserRouter>

    </CssVarsProvider>
  </StrictMode>,
)
