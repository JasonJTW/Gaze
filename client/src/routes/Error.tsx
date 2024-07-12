import {
  ThemeProvider,
  createTheme,
  Container,
  Typography,
  CssBaseline,
} from "@mui/material";
import Nav from "../components/Nav";
function Error() {
  const theme = createTheme({
    palette: {
      background: {
        default: "#010c1e", // Default background color
      },
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            backgroundColor: "#010c1e",
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Nav />
      <Container
        sx={{
          minHeight: "100%",
          minWidth: "100%",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container
          sx={{
            display: "flex",
            width: "auto",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-end",
            minHeight: "400px",
          }}
        >
          <Typography variant="h1" sx={{ color: "#c6cdd7" }}>
            404
          </Typography>
          <Typography variant="overline" sx={{ color: "#d6c9d0" }}>
            What's my age again ?
          </Typography>
        </Container>
      </Container>
    </ThemeProvider>
  );
}

export default Error;
