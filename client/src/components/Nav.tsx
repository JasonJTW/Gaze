import {
  AppBar,
  Toolbar,
  IconButton,
  Link,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";

const pages = ["Upload", "Management", "Content"];
function Nav() {
  const theme = createTheme({
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(67, 129, 168, 0.5)",
            backdropFilter: "blur(10px)",
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            marginLeft: "30px",
          },
        },
      },
    },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton>
              <MenuIcon />
            </IconButton>
            {pages.map((page) => (
              <Link
                component={RouterLink}
                to={`/${page}`}
                color="primary"
                underline="hover"
                key={page}
              >
                {page}
              </Link>
            ))}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </>
  );
}

export default Nav;
