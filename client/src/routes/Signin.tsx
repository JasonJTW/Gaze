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
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useState } from "react";

const hostName = import.meta.env.VITE_ServerHostName;
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
    MuiFormControl: {
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
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          "& .MuiIconButton-root": {
            color: "#d6c9d0", // 修改 endAdornment 的 icon 顏色
          },
          "& .MuiIconButton-root:hover": {
            color: "#1565c0", // 修改 hover 狀態下的 icon 顏色
          },
          "& .MuiIconButton-root.Mui-focused": {
            color: "#4caf50", // 修改 focus 狀態下的 icon 顏色
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
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    alert(
      `email: ${email}
      password: ${password}`
    );

    // TODO: Implement Sign in function
    try {
      const response = await fetch(`${hostName}/api/user/signin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      const result = await response.json();

      console.log("result: ", result);
      if (!response.ok) {
        throw new Error(result.message);
      }
      alert("Sign in successfully");
      // TODO: Store JWT in cookie
    } catch (err) {
      const error = err as Error;
      console.error(error);
      alert("Failed to sign in: " + error.message);
    }
  };

  /// password visibility state
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

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
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <FormControl fullWidth variant="outlined" margin="normal" required>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                label="Password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      // onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            {/* //TODO: Implement remember me */}
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
            {/* // TODO: Implement forgot password and sign up link */}
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
