'use client'
import '../style/globals.css'
import { Inter } from 'next/font/google'
import { store } from '../redux/store'
import { Provider } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Provider store={store}>
        {children}
      </Provider>
      </body>
    </html>
  )
}
