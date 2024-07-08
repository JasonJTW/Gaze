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
  exif: Record<string, unknown> | null;
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

  //* Get image's id from url
  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const queryId = param.get("id");
    setId(queryId);
  }, []);

  //* Fetch data from api
  useEffect(() => {
    getData(id);
  }, [id]);

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

  //* Exclude these from exif data:
  const excludedKeys = [
    "SubExif",
    // "XResolution",
    // "YResolution",
    "ResolutionUnit",
    "GPSInfoIFDPointer",
    "GPSInfo",
    // "ExifIFDPointer",
    // "XDimension",
    // "YDimension",
    // "Orientation",
    // "YCbCrPositioning",
  ];

  // TODO:
  // const includeSubExif = [
  //   /// Aperture
  //   "FNumber",
  //   "LensMake",
  //   "LensModel",
  //   /// ISO
  //   "PhotographicSensitivity",
  //   /// FocalLength
  //   "FocalLengthIn35mmFilm",
  //   /// XY Resolution
  //   "XDimension"
  //   "YDimension"
  //   /// Shutter
  // ];

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
              <Grid item xs={8}>
                <Container
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
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
                  <div style={{ width: "auto", marginTop: "10px" }}>
                    <Typography
                      variant="overline"
                      color={"#c6cdd7"}
                      marginLeft={2}
                      marginRight={8}
                    >
                      " {data[0].original_name} "
                    </Typography>
                    <Typography variant="overline" color={"#c6cdd7"}>
                      By_
                    </Typography>
                    <Typography
                      variant="overline"
                      color={"#d6c9d0"}
                      marginLeft={2}
                    >
                      {data[0].photographer || "undefined"}
                    </Typography>
                  </div>
                </Container>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h2" color={"#c6cdd7"}>
                  MetaData
                </Typography>
                <hr />
                {data[0].exif &&
                  Object.entries(data[0].exif).map(([key, value]) =>
                    !excludedKeys.includes(key) ? (
                      <Container
                        key={key}
                        sx={{
                          width: "auto",
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        <Typography
                          variant="body1"
                          color={"white"}
                          gutterBottom
                        >
                          {key}:
                        </Typography>
                        <Typography
                          variant="body2"
                          color={"#d6c9d0"}
                          gutterBottom
                        >
                          - {JSON.stringify(value)}
                        </Typography>
                      </Container>
                    ) : null
                  )}
                /// Sub Exif
                {data[0].exif &&
                  (data[0].exif as { SubExif: Record<string, unknown> })
                    .SubExif && (
                    <>
                      <Typography variant="h5" color={"#c6cdd7"}>
                        SubExif
                      </Typography>
                      <hr />
                      {Object.entries(
                        (data[0].exif as { SubExif: Record<string, unknown> })
                          .SubExif
                      ).map(([key, value]) => (
                        <Container
                          key={key}
                          sx={{
                            width: "auto",
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          <Typography
                            variant="body1"
                            color={"white"}
                            gutterBottom
                          >
                            {key}:
                          </Typography>
                          <Typography
                            variant="body2"
                            color={"#d6c9d0"}
                            gutterBottom
                          >
                            - {JSON.stringify(value)}
                          </Typography>
                        </Container>
                      ))}
                    </>
                  )}
                /// GPS Info
                {data[0].exif &&
                  (data[0].exif as { GPSInfo: Record<string, unknown> })
                    .GPSInfo && (
                    <>
                      <Typography variant="h5" color={"#c6cdd7"}>
                        GPSInfo
                      </Typography>
                      <hr />
                      {Object.entries(
                        (data[0].exif as { GPSInfo: Record<string, unknown> })
                          .GPSInfo
                      ).map(([key, value]) => (
                        <Container
                          key={key}
                          sx={{
                            width: "auto",
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          <Typography
                            variant="body1"
                            color={"white"}
                            gutterBottom
                          >
                            {key}:
                          </Typography>
                          <Typography
                            variant="body2"
                            color={"#d6c9d0"}
                            gutterBottom
                          >
                            - {JSON.stringify(value)}
                          </Typography>
                        </Container>
                      ))}
                    </>
                  )}
              </Grid>
            </>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Content;
