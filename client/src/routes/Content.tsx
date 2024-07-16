import {
  Typography,
  createTheme,
  ThemeProvider,
  Container,
  Grid,
  Box,
  TextField,
  Button,
  Autocomplete,
  ListItem,
  createFilterOptions,
} from "@mui/material";
import { useEffect, useState, Fragment } from "react";
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
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    alert(
      `Category: ${data.get("category")}
      Series: ${data.get("series")}`
    );
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
  const filter = createFilterOptions<CategoryOptionType>();
  interface CategoryOptionType {
    inputValue?: string;
    title: string;
  }
  const [category, setCategory] = useState<CategoryOptionType>({ title: "" });
  const categorySelections: CategoryOptionType[] = [
    {
      title: "portrait",
    },
    {
      title: "landscape",
    },
    {
      title: "cityscape",
    },
    {
      title: "macro",
    },
    {
      title: "animal",
    },
    {
      title: "food",
    },
    {
      title: "2portrait",
    },
    {
      title: "2landscape",
    },
    {
      title: "2cityscape",
    },
    {
      title: "2macro",
    },
    {
      title: "2animal",
    },
    {
      title: "2food",
    },
    {
      title: "3portrait",
    },
    {
      title: "3landscape",
    },
    {
      title: "3cityscape",
    },
    {
      title: "3macro",
    },
    {
      title: "3animal",
    },
    {
      title: "3food",
    },
  ];

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
              {/*//* Right side */}
              <Grid item xs={4}>
                <Typography variant="h4" color={"#c6cdd7"}>
                  Information
                </Typography>
                <hr />
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  // noValidate
                  sx={{ mt: 1, mb: 4 }}
                >
                  {/* //TODO: Implement drop down selection */}
                  <Autocomplete
                    freeSolo
                    options={categorySelections}
                    disableClearable={false}
                    forcePopupIcon
                    value={category}
                    isOptionEqualToValue={(option, value) =>
                      option.title === value.title
                    }
                    onChange={(event, newValue) => {
                      if (newValue === null) {
                        // 處理清除操作
                        setCategory({ title: "" });
                      } else if (typeof newValue === "string") {
                        setCategory({
                          title: newValue,
                        });
                      } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        setCategory({
                          title: newValue.inputValue,
                        });
                      } else {
                        setCategory(newValue);
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some(
                        (option) => inputValue === option.title
                      );
                      if (inputValue !== "" && !isExisting) {
                        filtered.push({
                          inputValue,
                          title: `Add new "${inputValue}" category`,
                        });
                      }

                      return filtered;
                    }}
                    getOptionLabel={(option) => {
                      // Value selected with enter, right from the input
                      if (typeof option === "string") {
                        return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      // Regular option
                      return option.title;
                    }}
                    renderOption={(props, option, { selected }) => {
                      const { key, ...optionProps } = props;
                      return (
                        <ListItem
                          key={key}
                          selected={selected}
                          {...optionProps}
                          sx={{
                            // color: selected
                            //   ? "#4caf50 !important"
                            //   : "#d6c9d0 !important",
                            // backgroundColor: selected
                            //   ? "rgba(25, 255, 255, 1)"
                            //   : "transparent",
                            "&.Mui-selected": {
                              color: "#4caf50 !important",
                              backgroundColor:
                                "rgba(255, 255, 255, 1) !important",
                            },
                            "&:hover": {
                              backgroundColor:
                                "rgba(25, 255, 255, 1) !important",
                              color: "#ffffff !important",
                            },
                          }}
                        >
                          {option.title}
                        </ListItem>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        margin="normal"
                        fullWidth
                        id="category"
                        label="Category"
                        name="category"
                        type="search"
                        autoFocus
                        /// Hide clearButton
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <Fragment>
                              {params.InputProps.endAdornment}
                            </Fragment>
                          ),
                        }}
                        sx={{
                          '& input[type="search"]::-webkit-search-cancel-button':
                            {
                              display: "none",
                            },
                          '& input[type="search"]::-ms-clear': {
                            display: "none",
                          },
                        }}
                      />
                    )}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="series"
                    label="Series"
                    type="series"
                    id="series"
                    autoComplete="series"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    // variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Save
                  </Button>
                </Box>
                <Typography variant="h4" color={"#c6cdd7"}>
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
