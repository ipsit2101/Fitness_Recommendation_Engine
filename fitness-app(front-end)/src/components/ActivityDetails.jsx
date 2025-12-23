import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  Grid,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StraightenIcon from "@mui/icons-material/Straighten";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getActivityDetails } from "../service/api";
import NoRecommendations from "./NoRecommendations";
import { ArrowBack } from "@mui/icons-material";
import HeightIcon from "@mui/icons-material/Height";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const ActivityDetails = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);


  useEffect(() => {
    let mounted = true;

    const fetchActivityDetails = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await getActivityDetails(id);

        if (!mounted) return;

        // IMPORTANT: response.data may be null
        if (response?.data) {
          setActivity(response.data);
          setRecommendation(response.data.recommendation);
        } else {
          setActivity(null);
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Error fetching activity details:", err);
        setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchActivityDetails();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={52} />
        <Typography variant="body2" color="text.secondary">
          Loading activity details...
        </Typography>
      </Box>
    );
  }

  if (error || !activity) {
    return <NoRecommendations />;
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
      {/* ================= ACTIVITY DETAILS ================= */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
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
            p: 2.5,
            background: "linear-gradient(90deg, #2563eb, #16a34a)",
            color: "#fff",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <FitnessCenterIcon />
            <Typography variant="h5" fontWeight={700}>
              Activity Details
            </Typography>
          </Stack>
        </Box>

        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/activities")}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: "none",
              color: "#2563eb",
              backgroundColor: "#e0ecff",
              transition: "all 0.3s ease",

              "&:hover": {
                backgroundColor: "#dbeafe",
                transform: "translateY(-2px)",
              },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>


        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Typography 
                  fontWeight={600}
                  sx={{
                      textTransform: "capitalize",
                      background:
                        "linear-gradient(90deg, #2563eb, #16a34a)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                >
                  Type: {activity.activityType}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <TimerOutlinedIcon color="success" />
                  <Typography>
                    {activity.duration} minutes
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <LocalFireDepartmentOutlinedIcon sx={{ color: "#ef4444" }} />
                  <Typography>
                    {activity.caloriesBurned} kcal
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarMonthIcon color="primary" />
                  <Typography>
                    {new Date(activity.createdAt).toLocaleString()}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <HeightIcon sx={{ color: "#0ea5e9" }} />
                  <Typography>
                    Height:{" "}
                    {activity.activityMetrics.height
                      ? `${activity.activityMetrics.height} cm`
                      : "Not Provided"}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <MonitorWeightIcon sx={{ color: "#f59e0b" }} />
                  <Typography>
                    Weight:{" "}
                    {activity.activityMetrics.weight
                      ? `${activity.activityMetrics.weight} kg`
                      : "Not Provided"}
                  </Typography>
                </Stack>


                <Stack direction="row" spacing={1} alignItems="center">
                  <FavoriteIcon sx={{ color: "#ec4899" }} />
                  <Typography>
                    Avg Heart Rate:{" "}
                    {activity.activityMetrics.avgHeartRate
                      ? `${activity.activityMetrics.avgHeartRate} bpm`
                      : "Not Provided"}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <StraightenIcon color="secondary" />
                  <Typography>
                    Distance:{" "}
                    {activity.activityMetrics.distanceKm
                      ? `${activity.activityMetrics.distanceKm} km`
                      : "Not Provided"}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon color="error" />
                  <Typography>
                    {activity.activityMetrics.location || "Not Provided"}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ================= AI RECOMMENDATIONS ================= */}
      {recommendation && (
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 18px 45px rgba(0,0,0,0.12)",
            animation: "fadeIn 0.8s ease",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <PsychologyIcon color="primary" />
              <Typography variant="h5" fontWeight={700}
                sx={{
                      textTransform: "capitalize",
                      background:
                        "linear-gradient(90deg, #2563eb, #16a34a)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
              >
                AI Recommendation
              </Typography>
            </Stack>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Analysis
            </Typography>
            <Typography paragraph>{recommendation.analysis}</Typography>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <TipsAndUpdatesIcon color="success" />
              <Typography variant="h6" fontWeight={600}>
                Improvements
              </Typography>
            </Stack>
            {recommendation.improvements?.map((item, i) => (
              <Typography key={i} paragraph>
                • {item}
              </Typography>
            ))}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Suggestions
            </Typography>
            {recommendation.suggestions?.map((item, i) => (
              <Typography key={i} paragraph>
                • {item}
              </Typography>
            ))}

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <HealthAndSafetyIcon color="error" />
              <Typography variant="h6" fontWeight={600}>
                Safety Guidelines
              </Typography>
            </Stack>
            {recommendation.safetyInstructions?.map((item, i) => (
              <Typography key={i} paragraph>
                • {item}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetails;
