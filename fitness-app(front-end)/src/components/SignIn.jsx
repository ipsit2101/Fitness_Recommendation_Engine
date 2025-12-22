import { Logout, PersonAdd } from '@mui/icons-material'
import { Box, Button } from '@mui/material'
import React from 'react'

const SignIn = ({ logOut, handleLogout }) => {
  return (
    <Box
        sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mb: 4,
            flexWrap: "wrap",
        }}
        >
        {/* LOGOUT BUTTON */}
        <Button
            startIcon={<Logout />}
            onClick={logOut}
            sx={{
            px: 3,
            py: 1.2,
            borderRadius: 3,
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(90deg, #ef4444, #dc2626)",
            boxShadow: "0 8px 20px rgba(239, 68, 68, 0.35)",
            transition: "all 0.3s ease",

            "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 14px 30px rgba(239, 68, 68, 0.5)",
                background: "linear-gradient(90deg, #dc2626, #b91c1c)",
            },
            }}
        >
            LOGOUT
        </Button>

        {/* SIGN IN AS ANOTHER USER */}
        <Button
            startIcon={<PersonAdd />}
            onClick={handleLogout}
            sx={{
            px: 3,
            py: 1.2,
            borderRadius: 3,
            fontWeight: 600,
            color: "#fff",
            background: "linear-gradient(90deg, #2563eb, #16a34a)",
            boxShadow: "0 8px 20px rgba(37, 99, 235, 0.35)",
            transition: "all 0.3s ease",

            "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 14px 30px rgba(22, 163, 74, 0.45)",
                background: "linear-gradient(90deg, #1d4ed8, #15803d)",
            },
            }}
        >
            SIGN IN AS ANOTHER USER
        </Button>
        </Box>
    )
}

export default SignIn
