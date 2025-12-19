import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RigisterAccount from './Components/RigisterAccount.jsx'
import Dashboard from './Components/Dashboard.jsx'
import Developer from './Components/Developer.jsx';
import Notfound from './Notfound.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/account-rigistration' element={<RigisterAccount/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/developer-dashboard' element={<Developer/>}/>
        <Route path="*" element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
