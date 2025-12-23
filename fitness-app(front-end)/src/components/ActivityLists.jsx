import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useEffect, useState } from "react";
import { getActivities } from "../service/api";
import { useNavigate } from "react-router";
import { activityIconMap } from "../service/activityTypeMap";

const ActivityLists = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivities();
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchActivities();
  }, []);

  return (
    <Grid container spacing={4} justifyContent="center">
      {activities.map((activity) => {
        const activityConfig =
          activityIconMap[activity.activityType] ||
          activityIconMap.OTHERS;

        const ActivityIcon = activityConfig.icon;

        return (
          <Grid item xs={12} sm={6} md={4} key={activity.activityId}>
            <Card
              onClick={() =>
                navigate(`/activities/${activity.activityId}`)
              }
              sx={{
                height: "100%",
                borderRadius: 2,
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
                transition: "all 0.35s ease",

                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 22px 50px rgba(0,0,0,0.18)",
                },
              }}
            >
              {/* Gradient Accent Bar */}
              <Box
                sx={{
                  height: 16,
                  background:
                    "linear-gradient(90deg, #2563eb, #16a34a)",
                }}
              />

              <CardContent sx={{ p: 3 }}>
                {/* Header */}
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  mb={2}
                >
                  <ActivityIcon
                    sx={{
                      fontSize: 28,
                      color: activityConfig.color,
                    }}
                  />

                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      textTransform: "capitalize",
                      background:
                        "linear-gradient(90deg, #2563eb, #16a34a)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {activity.activityType}
                  </Typography>
                </Stack>

                {/* Metrics */}
                <Stack spacing={1.2}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <TimerOutlinedIcon
                      sx={{ fontSize: 20, color: "#16a34a" }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {activity.duration} minutes
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <LocalFireDepartmentOutlinedIcon
                      sx={{ fontSize: 20, color: "#ef4444" }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {activity.caloriesBurned} kcal burned
                    </Typography>
                  </Stack>
                </Stack>

                {/* Footer */}
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="flex-end"
                  mt={3}
                >
                  <Typography
                    variant="caption"
                    color="primary"
                    fontWeight={600}
                  >
                    View Details
                  </Typography>
                  <ArrowForwardIosIcon
                    sx={{
                      fontSize: 14,
                      color: "primary.main",
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ActivityLists;
