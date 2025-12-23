import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";

const Login = ({ onLogin }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background: `
          linear-gradient(
            180deg,
            #e6f4ff 0%,
            #eafaf3 40%,
            #ffffff 100%
          )
        `,
      }}
    >
      <Card
        sx={{
          width: 420,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
          animation: "float 6s ease-in-out infinite",
          transition: "all 0.35s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 30px 70px rgba(0,0,0,0.18)",
          },
          "@keyframes float": {
            "0%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-10px)" },
            "100%": { transform: "translateY(0px)" },
          },
        }}
      >
        {/* Gradient Header */}
        <Box
          sx={{
            py: 3,
            textAlign: "center",
            background: "linear-gradient(90deg, #2563eb, #16a34a)",
            color: "#fff",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 1.5,
            }}
          >
            <LockOutlined sx={{ fontSize: 32 }} />
          </Box>

          <Typography variant="h5" fontWeight={700}>
            AI Fitness Companion
          </Typography>

          <Typography
            variant="body2"
            sx={{ opacity: 0.9 }}
          >
            Train smarter. Track better. Stay consistent.
          </Typography>
        </Box>

        {/* Content */}
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          {/* Short Bio */}
          <Typography
            variant="body1"
            fontWeight={500}
            sx={{ mb: 1 }}
          >
            Your personalized fitness dashboard
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Log workouts, analyze performance metrics, and get AI-powered
            insights to continuously improve your health and fitness journey.
          </Typography>

          {/* Subtle divider */}
          <Box
            sx={{
              height: 1,
              width: "60%",
              mx: "auto",
              mb: 3,
              background:
                "linear-gradient(90deg, transparent, #c7d2fe, transparent)",
            }}
          />

          {/* Login Button */}
          <Button
            fullWidth
            size="large"
            onClick={onLogin}
            sx={{
              py: 1.4,
              borderRadius: 3,
              fontWeight: 700,
              color: "#fff",
              background: "linear-gradient(90deg, #2563eb, #16a34a)",
              boxShadow: "0 10px 25px rgba(37,99,235,0.35)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 16px 35px rgba(22,163,74,0.45)",
                background: "linear-gradient(90deg, #1d4ed8, #15803d)",
              },
            }}
          >
            LOGIN
          </Button>

          {/* Footer text */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 3 }}
          >
            Secure login powered by Keycloak
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
