import { Box, Button, duration, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import { addActivity } from '../service/api';

const ActivityForm = ({ onActivityAdded }) => {

  const [activity, setActivity] = useState({
    activityType: '',
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting activity:", activity);
      const response = await addActivity(activity);
      console.log("API response:", response);
      
      console.log('type of onActivityAdded: ', typeof(onActivityAdded));
      onActivityAdded();
      setActivity({
        activityType: '',
        duration: '',
        caloriesBurned: '',
        additionalMetrics: {}
      });
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error Status:', error.response.status);
        console.error('Error Data:', error.response.data); // This is crucial for details
        console.error('Error Headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
      }
    }
  }

  return (
    <Box component="form" sx={{ mb: 2 }} onSubmit={handleSubmit}>
      <FormControl sx={{width: 200, mb: 2}}>
        <InputLabel>Activity Type</InputLabel>
        <Select
          value={activity.activityType}              
          onChange={(e) => {setActivity({...activity, activityType: e.target.value})}}
        >
          <MenuItem value={"RUNNING"}>Running</MenuItem>
          <MenuItem value={"WALKING"}>Walking</MenuItem>
          <MenuItem value={"CYCLING"}>Cycling</MenuItem>
        </Select>
      </FormControl>    
      <TextField fullWidth 
        label="Calories Burnt" 
        type="number" sx={{mb: 2}}
        value={activity.caloriesBurned} 
        onChange={(e) => {setActivity({...activity, caloriesBurned: e.target.value})}}>
      </TextField>
      <TextField fullWidth 
        label="Duration (minutes)" 
        type="number" sx={{mb: 2}}
        value={activity.duration} 
        onChange={(e) => {setActivity({...activity, duration: e.target.value})}}>
      </TextField>

      <Button type='submit' variant="contained" >
        ADD ACTIVITY
      </Button>
    </Box>
  )
}

export default ActivityForm
