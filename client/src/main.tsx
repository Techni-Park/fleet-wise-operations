import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById("root")!).render(
   <AuthProvider>
     <BrowserRouter>
       <App />
     </BrowserRouter>
   </AuthProvider>
 );
