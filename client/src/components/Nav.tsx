import {
  AppBar,
  Toolbar,
  IconButton,
  Link,
  ThemeProvider,
  createTheme,
  useScrollTrigger,
  Slide,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";

const pages = ["Upload", "Management", "Content"];

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  children: React.ReactElement;
}

function HideOnScroll(props: Props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function Nav() {
  const theme = createTheme({
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            backgroundColor: "#010c1e",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background:
              "linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%)",
            backdropFilter: "blur(10px)",
            boxShadow: "none",
            // minHeight: "100px",
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
      MuiToolbar: {
        styleOverrides: {
          dense: {
            height: 80,
            minHeight: 80,
          },
        },
      },
    },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <HideOnScroll window={undefined}>
          <AppBar>
            <Toolbar variant="dense">
              <IconButton>
                <MenuIcon />
              </IconButton>
              {pages.map((page) => (
                <Link
                  component={RouterLink}
                  to={`/${page}`}
                  color="primary"
                  underline="none"
                  key={page}
                  sx={{
                    "&:hover": {
                      color: "#cdc1c8",
                      fontWeight: "bold",
                    },
                  }}
                >
                  {page}
                </Link>
              ))}
            </Toolbar>
          </AppBar>
        </HideOnScroll>
        <Toolbar variant="dense" />
      </ThemeProvider>
    </>
  );
}

export default Nav;
