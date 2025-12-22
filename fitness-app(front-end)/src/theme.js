import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb", // blue-600
    },
    secondary: {
      main: "#16a34a", // green-600
    },
    background: {
      default: "#f8fafc", // gray-50
    },
  },
  typography: {
    fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          minHeight: "100vh",

          /* ✅ LINEAR GRADIENT BACKGROUND */
        //   background: `
        //     linear-gradient(
        //       180deg,
        //       #0f172a 0%,
        //       #1e293b 35%,
        //       #f8fafc 100%
        //     )
        //   `,
        background: `
          linear-gradient(
            180deg,
            #e6f4ff 0%,   /* soft blue */
            #eafaf3 35%,  /* aqua green */
            #f4fdf9 65%,  /* near white */
            #ffffff 100%
          )
        `,
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        },
      },
    },
  },
});

export default theme;
