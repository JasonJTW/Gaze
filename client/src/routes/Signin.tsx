import {
  createTheme,
  ThemeProvider,
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

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
    MuiTypography: {
      defaultProps: {
        color: "#d6c9d0",
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            color: "#d6c9d0", // Text color
          },
          "& .MuiInputLabel-root": {
            color: "#d6c9d0", // Label color
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#d6c9d0", // Outline border color
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1565c0", // Outline border color on-hover
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#4caf50", // Outline border color when focused
            },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#4caf50", // Label color when focused
          },
          "& .MuiInputBase-input:focus": {
            color: "#4caf50", // Text color when focused
          },
          "& .MuiInputBase-input:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 100px #010c1e inset",
            WebkitTextFillColor: "#ffffff",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#d6c9d0", // Unchecked color
          "&.Mui-checked": {
            color: "#4caf50", // Checked color
          },
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

export default function SignIn() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    alert(
      `email: ${data.get("email")}
      password: ${data.get("password")}`
    );

    //TODO: Implement Sign in function
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              // variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
