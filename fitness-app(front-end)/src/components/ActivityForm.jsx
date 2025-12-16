import { Box, Button, duration, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'
import { addActivity } from '../service/api';

const ActivityForm = ({ onActivityAdded }) => {

  const [activity, setActivity] = useState({
    activityType: "RUNNING",
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      await addActivity(activity);
      console.log('type of onActivityAdded: ', typeof(onActivityAdded));
      onActivityAdded();
      setActivity({
        activityType: "RUNNING",
        duration: '',
        caloriesBurned: '',
        additionalMetrics: {}
      });
    } catch (error) {
      console.error('Error:', error);
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
          <MenuItem value={"RUNING"}>Running</MenuItem>
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
