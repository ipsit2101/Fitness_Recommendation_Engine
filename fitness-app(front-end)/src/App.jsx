import { Box, Button } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Navigate,Route, Routes, useLocation, useNavigate } from 'react-router'
import { logout, setCredentials } from './store/authSlice';
import { useDispatch } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import ActivityDetails from './components/ActivityDetails';
import ActivityForm from './components/ActivityForm';
import ActivityLists from './components/ActivityLists';
import Login from './components/LoginPage';
import ActivitiesPage from './components/ActivitiesPage';
import { keycloakLogout } from './oauth2Config';
import SignIn from './components/SignIn';

function App() {

  const { token, tokenData, logIn, logOut,isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({       
        token,
        user: tokenData
      }));
      setAuthReady(true);
      localStorage.removeItem('USER_LOGGED_OUT');
    }
  }, [token, tokenData, dispatch]);

  const handleLogout = () => {
    logOut();                  // Keycloak logout (REQUIRED)
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
          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="activities/:id" element={<ActivityDetails />} />
            <Route path="/" element={!token ? <Navigate to="/" /> : <Navigate to="/activities" replace />} />
          </Routes>
        </Box>
        )
      }
    </>
  )
}

export default App
