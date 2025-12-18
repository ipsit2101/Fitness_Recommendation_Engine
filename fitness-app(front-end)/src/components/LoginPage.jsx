import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = ({ onLogin }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e3f2fd, #ffffff)",
        px: 2
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: 380,
          p: 4,
          borderRadius: 4,
          textAlign: "center"
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#e3f2fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 32, color: "#1976d2" }} />
        </Box>

        <Typography variant="h5" fontWeight={600} gutterBottom>
          Welcome Back
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Sign in to continue to your fitness dashboard
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onLogin}
          sx={{
            py: 1.2,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600
          }}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
