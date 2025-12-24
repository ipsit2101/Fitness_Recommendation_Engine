import { Box } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Navigate,Route, Routes, useNavigate } from 'react-router'
import { logout, setCredentials } from './store/authSlice';
import { useDispatch } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import ActivityDetails from './components/ActivityDetails';
import Login from './components/LoginPage';
import ActivitiesPage from './components/ActivitiesPage';
import { keycloakLogout } from './oauth2Config';
import SignIn from './components/SignIn';

function App() {

  const { token, tokenData, logIn, logOut, isAuthenticated, refreshToken } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  const userId = tokenData ? tokenData.sub : null;

  useEffect(() => {
    if (isAuthenticated) {
      refreshToken(); // THIS PREVENTS FIRST 401 AFTER IDLE
    }
  }, [isAuthenticated, refreshToken]);


  useEffect(() => {
    if (token) {
      dispatch(setCredentials({       
        token,
        user: tokenData
      }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  const handleLogout = () => {
    logOut(); 
    dispatch(logout());
    keycloakLogout();     // Redux state cleanup  
  };

  return (
    <>
        {!token ? (
          <Login onLogin={() => {logIn()}} />
        ) : (
        <Box component="section" sx={{ p: 2, m: 2 }}>
          <SignIn logOut={logOut} handleLogout={handleLogout} />
          <Routes key={ userId || "guest" }>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="activities/:id" element={<ActivityDetails />} />
            <Route path="/" element={!token ? <Login onLogin={() => {logIn()}} /> : <Navigate to="/activities" replace />} />
          </Routes>
        </Box>
        )
      }
    </>
  )
}

export default App
