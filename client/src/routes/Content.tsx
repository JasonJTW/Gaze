import {
  Typography,
  createTheme,
  ThemeProvider,
  Container,
  Grid,
} from "@mui/material";

import { useEffect, useState } from "react";
const hostName = import.meta.env.VITE_ServerHostName;

interface DataItem {
  id: number;
  url: string;
  photographer: string | null;
  category: string | null;
  original_name: string;
  exif: object | null;
}
function Content() {
  const [data, setData] = useState<DataItem[]>([]);
  const [id, setId] = useState<string | null>(null);
  const getData = async (id: string | null) => {
    if (!id) {
      return;
    }
    try {
      const response = await fetch(`${hostName}/api/photo/details?id=${id}`, {
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
    const param = new URLSearchParams(window.location.search);
    const queryId = param.get("id");
    setId(queryId);
  }, []);

  useEffect(() => {
    getData(id);
  }, [id]);

  useEffect(() => {
    /// exif object keys
    if (data.length === 0) return;
    const exif = data[0].exif;
    let exifKeys: string[] = [];
    if (exif) {
      exifKeys = Object.keys(exif);
      console.log(exifKeys);
    }
  }, [data]);
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

  return (
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
        <Grid container>
          {data.length > 0 && (
            <>
              <Grid item xs={6}>
                <Container
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "end",
                    maxHeight: "100%",
                  }}
                >
                  <img
                    src={data[0].url}
                    alt={data[0].original_name}
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0px 2px 50px 10px rgba(0, 0, 0, 0.5)",
                      display: "block",
                      width: "100%",
                      height: "auto",
                    }}
                  />
                  <div style={{ width: "auto" }}>
                    <Typography variant="overline" color={"#c6cdd7"}>
                      Filename:
                    </Typography>
                    <Typography
                      variant="overline"
                      color={"#c6cdd7"}
                      marginLeft={4}
                    >
                      {data[0].original_name}
                    </Typography>
                  </div>
                </Container>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h2" color={"#c6cdd7"}>
                  exif
                </Typography>
                <hr />
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Content;
