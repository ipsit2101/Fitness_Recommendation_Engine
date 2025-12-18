import { Box, Button } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { BrowserRouter as Router, Navigate,Route, Routes, useLocation } from 'react-router'
import { logout, setCredentials } from './store/authSlice';
import { useDispatch } from 'react-redux';
import { AuthContext } from 'react-oauth2-code-pkce';
import ActivityDetails from './components/ActivityDetails';
import ActivityForm from './components/ActivityForm';
import ActivityLists from './components/ActivityLists';
import Login from './components/LoginPage';

const ActivitiesPage = () => {
  return (
    <Box component="section" sx={{ p: 2}}>
      <ActivityForm onActivityAdded = { () => window.location.reload() } />
      <ActivityLists />
    </Box>
  );
}

function App() {

  const { token, tokenData, logIn, logOut,isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({       
        token,
        user: tokenData
      }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  return (
    <>
      <Router>
        {!token ? (
          <Login onLogin={() => {logIn()}} />
        ) : (
         <Box component="section" sx={{ p: 2}}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" onClick={logOut}>
            LOGOUT
          </Button>
        </Box>
        
          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="activities/:id" element={<ActivityDetails />} />
            <Route path="/" element={ token ? <Navigate to="/activities" replace />
                : <div>
                  Welcome! Please log in.
                </div>} />
          </Routes>
        </Box>
        )
      }
      </Router>
    </>
  )
}

export default App
