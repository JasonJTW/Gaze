import { Container, Grid, Typography } from "@mui/material";

export default function Signup() {
  return (
    <Container
      sx={{
        minHeight: "100%",
        minWidth: "100%",
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container>
        <Grid item md={6}>
          <Container>
            <Typography variant="h1" sx={{ color: "#c6cdd7" }}>
              Registration"
            </Typography>
            <Typography variant="overline" sx={{ color: "#d6c9d0" }}>
              Join us and share your thought.
            </Typography>
          </Container>
        </Grid>
        <Grid item md={6}>
          <Container>
            <Typography variant="h1" sx={{ color: "#c6cdd7" }}>
              Here's the registration form
            </Typography>
            <Typography variant="overline" sx={{ color: "#d6c9d0" }}>
              Join us and share your thought.
            </Typography>
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
}
