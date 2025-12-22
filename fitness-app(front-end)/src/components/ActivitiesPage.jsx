import { Box, Divider, Typography } from "@mui/material";
import ActivityForm from "../components/ActivityForm";
import ActivityLists from "../components/ActivityLists";
import ActivityForm2 from "./ActivityForm2";

const ActivitiesPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        //background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 60%)",
        p: 0,
        m: 0
      }}
    >
      <ActivityForm2 onActivityAdded={() => window.location.reload()} />

      {/* Divider */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Divider sx={{ maxWidth: 900, mx: "auto" }} />
      </Box>

      {/* Title */}
      <Typography
        variant="h5"
        textAlign="center"
        sx={{ mb: 4, color: "primary.main" }}
      >
        Your Activities
      </Typography>

      <ActivityLists />
    </Box>
  );
};

export default ActivitiesPage;
