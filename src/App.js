import React from 'react';
import tokenAuth from './config/token';
import AuthState from './contexts/auth/authState';
import ErrorState from './contexts/errors/errorState';
import PersonaState from './contexts/persona/personaState';
import AppRouter from './routers/AppRouter';

const token = localStorage.getItem('token');
if(token) tokenAuth(token);

function App() {

  return (
    
    <AuthState>
      <ErrorState>
        <PersonaState>
          <AppRouter />
        </PersonaState>
      </ErrorState>
    </AuthState>

  )
}

export default App;
