import {
  ThemeProvider,
  createTheme,
  Container,
  Typography,
} from "@mui/material";

function Category() {
  const theme = createTheme({
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            backgroundColor: "#010c1e",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableRipple: true,
          variant: "outlined",
          color: "primary",
        },
        styleOverrides: {
          root: {
            // padding: "4px",
            borderRadius: "10px",
            minWidth: "30px",
          },
        },
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
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
              Category "
            </Typography>
            <Typography variant="overline" sx={{ color: "#d6c9d0" }}>
              The category is a simulacrum, obscuring the truth of the real.
            </Typography>
          </Container>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Category;
