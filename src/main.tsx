import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize demo data for the system on first load
if (!localStorage.getItem('initialized')) {
  const demoUsers = [
    {
      id: 'dept_1',
      name: 'Department Admin',
      email: 'admin@university.edu',
      password: 'password',
      role: 'department'
    },
    {
      id: 'student_1',
      name: 'Student User',
      email: 'student@university.edu',
      password: 'password',
      role: 'student'
    },
    {
      id: 'alumni_1',
      name: 'Alumni User',
      email: 'alumni@university.edu',
      password: 'password',
      role: 'alumni'
    }
  ];
  
  localStorage.setItem('users', JSON.stringify(demoUsers));
  localStorage.setItem('initialized', 'true');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
  </StrictMode>
);