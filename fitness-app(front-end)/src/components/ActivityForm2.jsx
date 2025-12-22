import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import { addActivity } from "../service/api";
import { cities } from "../store/cities";

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
      location: ""
    }
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
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...activity,
      additionalMetrics: cleanAdditionalMetrics(activity.additionalMetrics)
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
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.18)"
        }
      }}
    >
      {/* Gradient Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          background: "linear-gradient(90deg, #2563eb, #16a34a)",
          color: "#fff"
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
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Activity Type"
                value={activity.activityType}
                onChange={(e) =>
                  setActivity({ ...activity, activityType: e.target.value })
                }
              >
                {[
                  "RUNNING","WALKING","CYCLING","SWIMMING","YOGA",
                  "WEIGHT_TRAINING","STRETCHING","CROSSFIT","BOXING",
                  "MEDITATION","HIKING","CARDIO","DANCE","PILATES","SKIING","OTHERS"
                ].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Duration (min)"
                type="number"
                fullWidth
                value={activity.duration}
                onChange={(e) =>
                  setActivity({ ...activity, duration: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Calories Burned"
                type="number"
                fullWidth
                value={activity.caloriesBurned}
                onChange={(e) =>
                  setActivity({ ...activity, caloriesBurned: e.target.value })
                }
              />
            </Grid>
          </Grid>

          {/* ADDITIONAL METRICS */}
          <Typography
            variant="subtitle1"
            fontWeight={700}
            mb={1}
            color="primary"
          >
            Additional Metrics
          </Typography>

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
              />
            </Grid>

            <Grid item xs={12} md={6}>
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
                  />
                )}
              />
            </Grid>
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
                background: "linear-gradient(90deg, #1d4ed8, #15803d)"
              }
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
