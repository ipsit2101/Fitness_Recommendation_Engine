import React, { use } from "react";
import {
  Box,
  Typography,
  Button,
  Paper
} from "@mui/material";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
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
        px: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          p: 4,
          borderRadius: 4,
          background: "linear-gradient(135deg, #f5f7fa, #ffffff)"
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            backgroundColor: "#e3f2fd",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2
          }}
        >
          <InsightsOutlinedIcon sx={{ fontSize: 36, color: "#1976d2" }} />
        </Box>

        <Typography variant="h6" fontWeight={600} gutterBottom>
          No Recommendations Yet
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          We don’t have enough activity data to generate personalized
          recommendations. Start tracking your workouts to unlock insights.
        </Typography>

        <Button
          variant="contained"
          size="medium"
          onClick={() => navigate("/activities")}
          sx={{
            borderRadius: 3,
            px: 3,
            textTransform: "none"
          }}
        >
          Keep Adding Activities
        </Button>
      </Paper>
    </Box>
  );
};

export default NoRecommendations;
