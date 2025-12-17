import { Card, CardContent, Grid, Typography } from '@mui/material';
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
    <Grid container spacing={2}>
      {activities.map((activity) => (
        <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}}>
          <Card sx={{cursor: 'pointer'}} onClick={() => navigate(`/activities/${activity.activityId}`)}>
            <CardContent>
              <Typography variant='h6'>
                {activity.activityType}
              </Typography>
              <Typography>
                Duration: {activity.duration} minutes
              </Typography>
              <Typography>
                Calories Burned: {activity.caloriesBurned} kcal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ActivityLists
