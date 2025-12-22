import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React, { use, useEffect, useState } from 'react'
import { getActivities } from '../service/api';
import { useNavigate } from 'react-router';

const ActivityLists = () => {

  const [activities, setActivities] = useState([]);
  const navigate = useNavigate(); 

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <Grid container spacing={3} justifyContent="center">
      {activities.map((activity) => (
        <Grid item xs={12} sm={6} md={4} key={activity.activityId}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 1,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              cursor: "pointer",

              "&:hover": {
                transform: "translateY(-6px)",
                boxShadow: "0 16px 40px rgba(0,0,0,0.15)",

                "& .activity-title": {
                  color: "primary.main",
                  transform: "scale(1.05)",
                },

                "& .accent-bar": {
                  width: "100%",
                },
              },
            }}

            onClick={() => navigate(`/activities/${activity.activityId}`)}  
          >
            {/* Accent Bar */}
            <Box
              sx={{
                height: 6,
                background: "linear-gradient(90deg, #2563eb, #16a34a)",
              }}
            />

            <CardContent>
              <Typography variant="h6">
                {activity.activityType}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Duration: {activity.duration} minutes
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Calories Burned: {activity.caloriesBurned} kcal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ActivityLists
