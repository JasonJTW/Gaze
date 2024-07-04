import {
  Container,
  ThemeProvider,
  createTheme,
  Typography,
  ImageList,
  ImageListItem,
} from "@mui/material";
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
            borderRadius: "5px",
            minWidth: "30px",
          },
        },
      },
    },
  });

  const getData = async () => {
    try {
      //* fetch getPhoto API from server
      const response = await fetch(`${hostName}/api/photo`, {
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
              Management
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
            }}
          >
            {data.map((item, index) => (
              <ImageListItem key={index}>
                <img
                  src={item.url}
                  loading="lazy"
                  alt={item.original_name}
                  style={{
                    borderRadius: "5px",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Container>
      </ThemeProvider>
    </>
  );
}
