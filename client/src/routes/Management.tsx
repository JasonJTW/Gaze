import {
  Container,
  ThemeProvider,
  createTheme,
  Typography,
  ImageList,
  ImageListItem,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
const hostName = import.meta.env.VITE_ServerHostName;
export default function Management() {
  interface DataItem {
    id: number;
    url: string;
    photographer: string | null;
    category: string | null;
    original_name: string;
    exif: object | null;
  }

  const [data, setData] = useState<DataItem[]>([]);
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

  const getData = async () => {
    try {
      //* fetch getPhoto API from server
      const response = await fetch(`${hostName}/api/photo/all`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to get data.");
      }
      const result = await response.json();
      console.log(result.data);
      setData(result.data);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error fetching data:", errorMessage);
      alert("Failed to get data: " + errorMessage);
    }
  };

  useEffect(() => {
    getData();
  }, []);
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
              Management "
            </Typography>
            <Typography variant="overline" sx={{ color: "#d6c9d0" }}>
              Manage your gallery.
            </Typography>
          </Container>
          <ImageList
            variant="masonry"
            cols={3}
            gap={10}
            sx={{
              margin: "60px",
              overflow: "visible",
              maxWidth: "1200px",
            }}
          >
            {data.map((item, index) => (
              <ImageListItem
                key={index}
                sx={{
                  position: "relative",
                  transition: "0.2s ease-in-out",
                  willChange: "border",
                  border: "1px solid transparent",
                  borderRadius: "20px",
                  "&:hover": {
                    border: "1px solid #ccc",
                    borderRadius: "20px",
                  },
                  "&:hover img": {
                    opacity: 0.5,
                    filter: "blur(5px)",
                    willChange: "opacity, filter",
                  },
                  "&:hover button": {
                    opacity: 1,
                    right: 5,
                    top: 5,
                    willChange: "opacity, right, top",
                  },
                }}
              >
                <RouterLink to={`/Content?id=${item.id}`}>
                  <img
                    src={item.url}
                    loading="lazy"
                    alt={item.original_name}
                    style={{
                      borderRadius: "20px",
                      transition: "0.2s ease-in-out",
                      willChange: "opacity, filter",
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                  />
                </RouterLink>
                <Button
                  color="primary"
                  variant="contained"
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    opacity: 0,
                    transition: "0.2s ease-in-out",
                  }}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    alert(`Delete ${item.original_name}?`);
                  }}
                >
                  x
                </Button>
              </ImageListItem>
            ))}
          </ImageList>
        </Container>
      </ThemeProvider>
    </>
  );
}
