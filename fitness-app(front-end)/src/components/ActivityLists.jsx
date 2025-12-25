import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Button,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useContext, useEffect, useState } from "react";
import { deleteActivity, getActivities } from "../service/api";
import { useNavigate } from "react-router";
import { activityIconMap } from "../service/activityTypeMap";
import { useSelector } from "react-redux";
import { AuthContext } from "react-oauth2-code-pkce";

const ActivityLists = () => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const {isAuthenticated} = useContext(AuthContext);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);


  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [token, isAuthenticated]);

  const handleDeleteClick = (e, activityId) => {
    e.stopPropagation(); // prevent card navigation
    setSelectedActivityId(activityId);
    setOpenDeleteDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedActivityId(null);
  };

  const handleConfirmDelete = async (e, activityId) => {
    e.stopPropagation(); // prevent card click navigation
    try {
      await deleteActivity(activityId);
      fetchActivities(); // refresh list
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <>
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
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                  mt={3}
                >
                  {/* Delete Button */}
                  <Button
                    size="small"
                    onClick={(e) => handleDeleteClick(e, activity.activityId)}
                    sx={{
                      px: 2,
                      py: 0.2,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      borderRadius: "999px",
                      textTransform: "none",
                      color: "#fff",
                      background: "linear-gradient(90deg, #ef4444, #dc2626)",
                      boxShadow: "0 6px 16px rgba(239,68,68,0.35)",
                      transition: "all 0.3s ease",

                      "&:hover": {
                        background: "linear-gradient(90deg, #dc2626, #b91c1c)",
                        boxShadow: "0 10px 26px rgba(220,38,38,0.45)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Delete
                  </Button>

                  {/* View Details */}
                  <Stack direction="row" spacing={1} alignItems="center">
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
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
    {/* ===== Confirmation Dialog ===== */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Confirm Delete
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this activity? This action
            cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog} disabled={isDeleting}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={(e) => handleConfirmDelete(e, selectedActivityId)}
            disabled={isDeleting}
            sx={{
              background:
                "linear-gradient(90deg, #ef4444, #dc2626)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #dc2626, #b91c1c)",
              },
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActivityLists;
