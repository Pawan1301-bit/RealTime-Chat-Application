import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import Temprary from './Context/Temprary.jsx';

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
  <Temprary>
    <App />
  </Temprary>
</BrowserRouter>

)
