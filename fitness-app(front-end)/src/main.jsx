import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import { store } from './store/store'

import App from './App'
import { authConfig } from './oauth2Config'
import { AuthProvider } from 'react-oauth2-code-pkce'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme'
import { BrowserRouter } from 'react-router'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <AuthProvider authConfig={authConfig}>
        <Provider store={store}>
          <App />
        </Provider>
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
)
