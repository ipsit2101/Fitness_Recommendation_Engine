import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack
} from "@mui/material";
import InsightsOutlined from "@mui/icons-material/InsightsOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router";

const NoRecommendations = ({ onActionClick }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: "100%",
          borderRadius: 4,
          textAlign: "center",
          boxShadow: "0 18px 45px rgba(0,0,0,0.12)",
          animation: "fadeIn 0.6s ease",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(10px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {/* Gradient Header */}
        <Box
          sx={{
            py: 3,
            background: "linear-gradient(90deg, #2563eb, #16a34a)",
            color: "#fff",
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 1.5,
            }}
          >
            <InsightsOutlined sx={{ fontSize: 36 }} />
          </Box>

          <Typography variant="h6" fontWeight={700}>
            No Recommendations Yet
          </Typography>
        </Box>

        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            We need a bit more activity data to generate personalized insights.
            Keep tracking your workouts and your AI coach will kick in soon 💪
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/activities")}
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: 4,
              py: 1.3,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: "none",
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
            Keep Adding Activities
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NoRecommendations;
