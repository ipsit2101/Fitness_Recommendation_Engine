import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
import React, { act, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { getActivityDetails } from '../service/api';
import NoRecommendations from './NoRecommendations';

const ActivityDetails = () => {

  const {id} = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {

    const fetchActivityDetails = async () => {
      try {
        const response = await getActivityDetails(id);
        console.log("Activity Details API response:", response);
        setActivity(response.data);
        setRecommendation(response.data.recommendation);
      } catch (error) {
        console.error('Error fetching activity details:', error);
      }
    };

    fetchActivityDetails();
  }, [id]);

  if (!activity) {
    return <NoRecommendations />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Activity Details</Typography>
                    <Typography>Type: {activity.activityType}</Typography>
                    <Typography>Duration: {activity.duration} minutes</Typography>
                    <Typography>Calories Burned: {activity.caloriesBurned}</Typography>
                    <Typography>Date: {new Date(activity.createdAt).toLocaleString()}</Typography>
                </CardContent>
            </Card>

            {recommendation && (
                <Card>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>AI Recommendation</Typography>
                        <Typography variant="h6">Analysis</Typography>
                        <Typography paragraph>{recommendation.analysis}</Typography>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h6">Improvements</Typography>
                        {recommendation?.improvements?.map((improvement, index) => (
                            <Typography key={index} paragraph>• {improvement}</Typography>
                        ))}
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h6">Suggestions</Typography>
                        {recommendation?.suggestions?.map((suggestion, index) => (
                            <Typography key={index} paragraph>• {suggestion}</Typography>
                        ))}
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Typography variant="h6">Safety Guidelines</Typography>
                        {recommendation?.safetyInstructions?.map((safety, index) => (
                            <Typography key={index} paragraph>• {safety}</Typography>
                        ))}
                    </CardContent>
                </Card>
            )}
        </Box>
  )
}

export default ActivityDetails
