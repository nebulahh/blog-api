import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider } from './context/authProvider'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
    <AuthProvider>
         <Routes>
          <Route path='*' element={<App />}/>
         </Routes>
    </AuthProvider>
    </Router>
  </React.StrictMode>,
)
