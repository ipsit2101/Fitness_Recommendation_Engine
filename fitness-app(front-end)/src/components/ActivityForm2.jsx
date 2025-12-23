import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import React, { useState } from "react";
import { addActivity } from "../service/api";
import { cities } from "../store/cities";

// Icons
import FitnessCenter from "@mui/icons-material/FitnessCenter";
import TimerOutlined from "@mui/icons-material/TimerOutlined";
import LocalFireDepartmentOutlined from "@mui/icons-material/LocalFireDepartmentOutlined";
import Height from "@mui/icons-material/Height";
import MonitorWeight from "@mui/icons-material/MonitorWeight";
import Favorite from "@mui/icons-material/Favorite";
import Straighten from "@mui/icons-material/Straighten";
import LocationOn from "@mui/icons-material/LocationOn";
import InsightsOutlined from "@mui/icons-material/InsightsOutlined";

const ActivityForm2 = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    activityType: "",
    duration: "",
    caloriesBurned: "",
    additionalMetrics: {
      height: "",
      weight: "",
      avgHeartRate: "",
      distanceKm: "",
      location: "",
    },
  });

  const cleanAdditionalMetrics = (metrics) => {
    const cleaned = {};
    Object.entries(metrics).forEach(([k, v]) => {
      if (v !== "" && v !== null && v !== undefined) cleaned[k] = v;
    });
    return cleaned;
  };

  const handleMetricChange = (key, value) => {
    setActivity((prev) => ({
      ...prev,
      additionalMetrics: {
        ...prev.additionalMetrics,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...activity,
      additionalMetrics: cleanAdditionalMetrics(activity.additionalMetrics),
    };
    await addActivity(payload);
    onActivityAdded();
  };

  return (
    <Card
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: 4,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          background: "linear-gradient(90deg, #2563eb, #16a34a)",
          color: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Add Activity
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Track your workout and fitness metrics
        </Typography>
      </Box>

      <CardContent sx={{ p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* BASIC INFO */}
          <Grid container spacing={2} mb={3}>
            <Box sx={{width: "30%"}}>
              <TextField
                select
                fullWidth
                label="Activity Type"
                value={activity.activityType}
                onChange={(e) =>
                  setActivity({ ...activity, activityType: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FitnessCenter color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                {[
                  "RUNNING",
                  "WALKING",
                  "CYCLING",
                  "SWIMMING",
                  "YOGA",
                  "WEIGHT_TRAINING",
                  "STRETCHING",
                  "CROSSFIT",
                  "BOXING",
                  "MEDITATION",
                  "HIKING",
                  "CARDIO",
                  "DANCE",
                  "PILATES",
                  "SKIING",
                  "OTHERS",
                ].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Grid item xs={12} md={4}>
              <TextField
                label="Duration (min)"
                type="number"
                fullWidth
                value={activity.duration}
                onChange={(e) =>
                  setActivity({ ...activity, duration: e.target.value })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TimerOutlined sx={{ color: "#16a34a" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Calories Burned"
                type="number"
                fullWidth
                value={activity.caloriesBurned}
                onChange={(e) =>
                  setActivity({
                    ...activity,
                    caloriesBurned: e.target.value,
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalFireDepartmentOutlined sx={{ color: "#ef4444" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {/* ADDITIONAL METRICS HEADER */}
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <InsightsOutlined color="primary" />
            <Typography variant="subtitle1" fontWeight={700} color="primary">
              Additional Metrics
            </Typography>
          </Box>

          {/* ADDITIONAL METRICS */}
          <Grid container spacing={2} mb={4}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Height (cm)"
                type="number"
                fullWidth
                value={activity.additionalMetrics.height}
                onChange={(e) =>
                  handleMetricChange("height", e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Height sx={{ color: "#0ea5e9" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Weight (kg)"
                type="number"
                fullWidth
                value={activity.additionalMetrics.weight}
                onChange={(e) =>
                  handleMetricChange("weight", e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonitorWeight sx={{ color: "#f59e0b" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Avg Heart Rate (bpm)"
                type="number"
                fullWidth
                value={activity.additionalMetrics.avgHeartRate}
                onChange={(e) =>
                  handleMetricChange("avgHeartRate", e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Favorite sx={{ color: "#ec4899" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Distance (km)"
                type="number"
                fullWidth
                value={activity.additionalMetrics.distanceKm}
                onChange={(e) =>
                  handleMetricChange("distanceKm", e.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Straighten color="secondary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Box sx={{width: "30%"}}>
              <Autocomplete
                options={cities}
                value={activity.additionalMetrics.location || null}
                onChange={(e, value) =>
                  handleMetricChange("location", value)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location (City)"
                    placeholder="Search city"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <InputAdornment position="start">
                            <LocationOn color="error" />
                          </InputAdornment>
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          </Grid>

          {/* SUBMIT */}
          <Button
            type="submit"
            fullWidth
            sx={{
              py: 1.4,
              fontWeight: 700,
              borderRadius: 3,
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
            ADD ACTIVITY
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityForm2;
