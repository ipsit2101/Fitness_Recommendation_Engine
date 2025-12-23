import DirectionsRun from "@mui/icons-material/DirectionsRun";
import DirectionsWalk from "@mui/icons-material/DirectionsWalk";
import DirectionsBike from "@mui/icons-material/DirectionsBike";
import Pool from "@mui/icons-material/Pool";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
import SelfImprovement from "@mui/icons-material/SelfImprovement";
import Favorite from "@mui/icons-material/Favorite";
import AccessibilityNew from "@mui/icons-material/AccessibilityNew";
import Whatshot from "@mui/icons-material/Whatshot";
import SportsMma from "@mui/icons-material/SportsMma";
import Psychology from "@mui/icons-material/Psychology";
import Hiking from "@mui/icons-material/Hiking";
import Spa from "@mui/icons-material/Spa";
import MusicNote from "@mui/icons-material/MusicNote";
import DownhillSkiing from "@mui/icons-material/DownhillSkiing";
import FlashOn from "@mui/icons-material/FlashOn";

export const activityIconMap = {
  RUNNING: {
    icon: DirectionsRun,
    color: "#2563eb", // blue
  },
  WALKING: {
    icon: DirectionsWalk,
    color: "#14b8a6", // teal
  },
  CYCLING: {
    icon: DirectionsBike,
    color: "#16a34a", // green
  },
  SWIMMING: {
    icon: Pool,
    color: "#06b6d4", // cyan
  },
  WEIGHT_TRAINING: {
    icon: FitnessCenter,
    color: "#f97316", // orange
  },
  YOGA: {
    icon: SelfImprovement,
    color: "#7c3aed", // purple
  },
  CARDIO: {
    icon: Favorite,
    color: "#ec4899", // pink
  },
  STRETCHING: {
    icon: AccessibilityNew,
    color: "#22c55e", // light green
  },
  CROSSFIT: {
    icon: Whatshot,
    color: "#ef4444", // red
  },
  BOXING: {
    icon: SportsMma,
    color: "#dc2626", // dark red
  },
  MEDITATION: {
    icon: Psychology,
    color: "#6366f1", // indigo
  },
  HIKING: {
    icon: Hiking,
    color: "#92400e", // brown
  },
  PILATES: {
    icon: Spa,
    color: "#8b5cf6", // lavender
  },
  DANCE: {
    icon: MusicNote,
    color: "#f43f5e", // rose
  },
  SKIING: {
    icon: DownhillSkiing,
    color: "#0ea5e9", // icy blue
  },
  OTHERS: {
    icon: FlashOn,
    color: "#64748b", // gray
  },
};
