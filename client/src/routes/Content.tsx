import {
  Typography,
  createTheme,
  ThemeProvider,
  Container,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import CategorizeForm from "../components/CategorizeForm";
const hostName = import.meta.env.VITE_ServerHostName;
import { CategoryOptionType } from "../types/CategoryOptionType";
import { SeriesOptionType } from "../types/SeriesOptionType";

interface imageDataItem {
  id: number;
  url: string;
  photographer: string | null;
  category: string | null;
  original_name: string;
  exif: Record<string, unknown> | null;
}

function Content() {
  //* State for CategorizeForm component
  const [category, setCategory] = useState<CategoryOptionType[]>([]);

  const [series, setSeries] = useState<SeriesOptionType[]>([]);

  const [imageData, setImageData] = useState<imageDataItem[]>([]);
  const [id, setId] = useState<string | null>(null);
  const [photographer, setPhotographer] = useState<string | null>(null);
  const getImageData = async (id: string | null) => {
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
      if (response.status === 429) {
        // 429 Too Many Requests
        const errorData = await response.json();
        alert(`Rate limit exceeded: ${errorData.message}`);
        return;
      }

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to get imageData.");
      }
      const result = await response.json();
      console.log(result.data);
      setImageData(result.data);
      setPhotographer(result.data[0].photographer);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error fetching imageData:", errorMessage);
      alert("Failed to get imageData: " + errorMessage);
    }
  };

  async function getImageTags(photoId: string | null) {
    if (!photoId) {
      return;
    }
    try {
      const response = await fetch(
        `${hostName}/api/variant/get_photo_tag?id=${photoId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (response.status === 429) {
        // 429 Too Many Requests
        const errorData = await response.json();
        alert(`Rate limit exceeded: ${errorData.message}`);
        return;
      }
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to get image tags");
      }
      const result = await response.json();
      console.log(result.data);

      //* Update image's category and series state
      const newCategories = result.data.category.filter(
        (category: CategoryOptionType) => category.title.trim() !== ""
      );
      const newSeries = result.data.series.filter(
        (series: SeriesOptionType) => series.title.trim() !== ""
      );

      setCategory(newCategories);
      setSeries(newSeries);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error fetching image tags:", errorMessage);
      alert("Failed to get image tags: " + errorMessage);
    }
  }

  //* Get image's id from url
  useEffect(() => {
    const param = new URLSearchParams(window.location.search);
    const queryId = param.get("id");
    setId(queryId);
  }, []);

  //* Fetch data from api
  useEffect(() => {
    getImageData(id);

    //* Fetch get_photo's_tags api
    getImageTags(id);
  }, [id]);

  async function callVariantsAPI(photoID: string | null) {
    if (!photoID) return;
    if (category.length == 0 && series.length == 0) {
      alert("Please select a category or series");
      return;
    }

    const categoryTags = category.length > 0 ? category : [{ title: "" }];
    const seriesTags = series.length > 0 ? series : [{ title: "" }];
    try {
      const response = await fetch(`${hostName}/api/variant/insert`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryArray: categoryTags,
          seriesArray: seriesTags,
          id: photoID,
        }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Failed to fetch variantInsertAPI."
        );
      }

      alert("Categorize successfully!");
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error inserting data to database: ", errorMessage);
      alert("Failed to insert category & serries to database: " + errorMessage);
    }
  }

  async function editPhotographer() {
    try {
      const response = await fetch(`${hostName}/api/photo/edit?id=${id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          photographer: photographer,
        }),
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to fetch edit API.");
      }
      alert("Update data successfully!");
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error update data to database: ", errorMessage);
      alert("Failed to update data to database: " + errorMessage);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(category);
    callVariantsAPI(id);
    editPhotographer();
  };

  const theme = createTheme({
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
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4caf50", // Outline border color when hovered
            },
            "& .MuiInputLabel-asterisk": {
              display: "none", // hide star sign after label
            },
            "& .MuiInputBase-input:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px #010c1e inset",
              WebkitTextFillColor: "#d6c9d0",
            },
            // "& .MuiInputBase-root": {
            //   "& .MuiInputAdornment-root .MuiIconButton-root": {
            //     color: "#d6c9d0", // Clear icon color
            //     "&:hover": {
            //       color: "#4caf50", // Clear icon hover color
            //     },
            //   },
            // },
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
      MuiAutocomplete: {
        styleOverrides: {
          inputRoot: {
            color: "#d6c9d0", // Text color
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d6c9d0", // Outline border color
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4caf50", // Outline border color when hovered
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4caf50", // Outline border color when focused
            },
          },
          popupIndicator: {
            "&.MuiAutocomplete-popupIndicator": {
              color: "#d6c9d0", // Ensures the icon is visible
            },
          },
          clearIndicator: {
            color: "#d6c9d0", // Clear indicator color
            "&:hover": {
              color: "#4caf50", // Clear indicator hover color
            },
          },
          paper: {
            backgroundColor: "rgba(255, 255, 255, 0.2)", // Dropdown menu background color with opacity
            backdropFilter: "blur(5px)", // Apply blur effect
            // WebkitBackdropFilter: "blur(5px)", // Apply blur effect for Safari
            color: "#d6c9d0", // Dropdown menu text color
            borderRadius: "10px", // Border radius
            border: "1px solid #fff", // Border color and width
          },
          option: {
            // backgroundColor: "rgba(255, 255, 255, 0.2)", // Dropdown option background color with opacity
            color: "#d6c9d0", // Dropdown option text color
            '&[aria-selected="true"]': {
              backgroundColor: "rgba(25, 255, 255, 1)", // Selected option background color
              color: "#4caf50", // Selected option text color
            },
            "&:hover": {
              backgroundColor: "rgba(25, 255, 255, 1)!important", // Hovered option background color
              color: "#ffffff", // Hovered option text color
            },
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
          {imageData.length > 0 && (
            <>
              {/*//* Left side img */}
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
                    src={imageData[0].url}
                    alt={imageData[0].original_name}
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
                      " {imageData[0].original_name} "
                    </Typography>
                    <Typography variant="overline" color={"#c6cdd7"}>
                      By_
                    </Typography>
                    <Typography
                      variant="overline"
                      color={"#d6c9d0"}
                      marginLeft={2}
                    >
                      {imageData[0].photographer || "undefined"}
                    </Typography>
                  </div>
                </Container>
              </Grid>
              {/*//* Right side */}
              <Grid item xs={4}>
                <Typography variant="h4" color={"#c6cdd7"}>
                  Information
                </Typography>
                <hr style={{ marginBottom: "20px" }} />
                <CategorizeForm
                  handleSubmit={handleSubmit}
                  displayValue={"true"}
                  category={category}
                  setCategory={setCategory}
                  series={series}
                  setSeries={setSeries}
                  photographer={photographer}
                  setPhotographer={setPhotographer}
                />
                <Typography variant="h4" color={"#c6cdd7"}>
                  Metadata
                </Typography>
                <hr />
                {imageData[0].exif &&
                  Object.entries(imageData[0].exif).map(([key, value]) =>
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
                {imageData[0].exif &&
                  (imageData[0].exif as { SubExif: Record<string, unknown> })
                    .SubExif && (
                    <>
                      <Typography variant="h5" color={"#c6cdd7"}>
                        SubExif
                      </Typography>
                      <hr />
                      {Object.entries(
                        (
                          imageData[0].exif as {
                            SubExif: Record<string, unknown>;
                          }
                        ).SubExif
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
                {imageData[0].exif &&
                  (imageData[0].exif as { GPSInfo: Record<string, unknown> })
                    .GPSInfo && (
                    <>
                      <Typography variant="h5" color={"#c6cdd7"}>
                        GPSInfo
                      </Typography>
                      <hr />
                      {Object.entries(
                        (
                          imageData[0].exif as {
                            GPSInfo: Record<string, unknown>;
                          }
                        ).GPSInfo
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
