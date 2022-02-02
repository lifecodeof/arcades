import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
})

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
  , document.getElementById('root')
)
