import { Container, Typography } from "@mui/material";

export default function Personal() {
  return (
    <>
      <Container sx={{ display: "flex" }}>
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
            Personal "
          </Typography>
          <Typography variant="overline" sx={{ color: "#d6c9d0" }}>
            Your personal data.
          </Typography>
        </Container>
      </Container>
    </>
  );
}
