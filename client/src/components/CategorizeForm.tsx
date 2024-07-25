import {
  Box,
  Autocomplete,
  ListItem,
  TextField,
  Button,
  createFilterOptions,
  ThemeProvider,
  createTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect, useState, Fragment } from "react";
import { CategoryOptionType } from "../types/CategoryOptionType";
import { SeriesOptionType } from "../types/SeriesOptionType";
const hostName = import.meta.env.VITE_ServerHostName;

interface CategorizeFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  displayValue: string;
  category: CategoryOptionType[];
  setCategory: React.Dispatch<React.SetStateAction<SeriesOptionType[]>>;
  series: SeriesOptionType[];
  setSeries: React.Dispatch<React.SetStateAction<SeriesOptionType[]>>;
  photographer: string | null;
  setPhotographer: React.Dispatch<React.SetStateAction<string | null>>;
}

function CategorizeForm({
  handleSubmit,
  displayValue,
  category,
  setCategory,
  series,
  setSeries,
  photographer,
  setPhotographer,
}: CategorizeFormProps) {
  const categoryFilter = createFilterOptions<CategoryOptionType>();

  const seriesFilter = createFilterOptions<SeriesOptionType>();

  const [categorySelections, setCategorySelections] = useState<
    CategoryOptionType[]
  >([]);

  const [seriesSelections, setSeriesSelections] = useState<SeriesOptionType[]>(
    []
  );

  const handlePhotographerClear = () => {
    setPhotographer("");
  };

  async function getCategoryTitle() {
    try {
      const response = await fetch(`${hostName}/api/variant/get_category`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Failed to fetch getCategoryAPI."
        );
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error fetching getCategoryAPI:", errorMessage);
      alert("Failed to call getCategoryAPI: " + errorMessage);
    }
  }

  useEffect(() => {
    const fetchCategoryTitles = async () => {
      const titles = await getCategoryTitle();
      if (titles) {
        setCategorySelections(titles);
      }
    };
    fetchCategoryTitles();
  }, []);

  async function getSeriesTitle() {
    try {
      const response = await fetch(`${hostName}/api/variant/get_series`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.message || "Failed to fetch getSeriesAPI."
        );
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error("Error fetching getSeriesAPI:", errorMessage);
      alert("Failed to call getSeriesAPI: " + errorMessage);
    }
  }

  useEffect(() => {
    const fetchSeriesTitles = async () => {
      const titles = await getSeriesTitle();
      if (titles) {
        setSeriesSelections(titles);
      }
    };
    fetchSeriesTitles();
  }, []);

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
            marginBottom: "10px",
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
            "& .MuiInputBase-root": {
              "& .MuiInputAdornment-root .MuiIconButton-root": {
                color: "#d6c9d0", // Clear icon color
                "&:hover": {
                  color: "#4caf50", // Clear icon hover color
                },
              },
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
      MuiChip: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.primary.main,
            color: "#d6c9d0",
            "& .MuiChip-deleteIcon": {
              color: "#ffffff", // 删除图标的颜色
            },
            "&:hover": {
              backgroundColor: "#4caf50",
            },
          }),
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        // noValidate
        sx={{ mt: 1, mb: 4, display: displayValue }}
      >
        <TextField
          id="photographer"
          value={photographer}
          onChange={(e) => setPhotographer(e.target.value)}
          label="Photographer"
          name="photographer"
          variant="outlined"
          size="small"
          type="name"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {photographer && (
                  <IconButton onClick={handlePhotographerClear}>
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
        <Autocomplete
          size="small"
          freeSolo
          multiple
          options={categorySelections}
          disableClearable={false}
          forcePopupIcon
          value={category}
          isOptionEqualToValue={(option, value) => option.title === value.title}
          onChange={(event, newValue) => {
            setCategory(
              typeof newValue === "string"
                ? [{ title: newValue }]
                : newValue.map((value) =>
                    typeof value === "string"
                      ? { title: value }
                      : value.inputValue
                      ? { title: value.inputValue }
                      : value
                  )
            );
          }}
          filterOptions={(options, params) => {
            const categoryFiltered = categoryFilter(options, params);

            const { inputValue } = params;

            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.title
            );
            if (inputValue !== "" && !isExisting) {
              categoryFiltered.push({
                inputValue,
                title: `Add new "${inputValue}" category`,
              });
            }

            return categoryFiltered;
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
                    backgroundColor: "rgba(255, 255, 255, 1) !important",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(25, 255, 255, 1) !important",
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
              // autoFocus
              /// Hide clearButton
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Fragment>{params.InputProps.endAdornment}</Fragment>
                ),
              }}
              sx={{
                '& input[type="search"]::-webkit-search-cancel-button': {
                  display: "none",
                },
                '& input[type="search"]::-ms-clear': {
                  display: "none",
                },
              }}
            />
          )}
        />
        <Autocomplete
          size="small"
          freeSolo
          multiple
          options={seriesSelections}
          disableClearable={false}
          forcePopupIcon
          value={series}
          isOptionEqualToValue={(option, value) => option.title === value.title}
          onChange={(event, newValue) => {
            setSeries(
              typeof newValue === "string"
                ? [{ title: newValue }]
                : newValue.map((value) =>
                    typeof value === "string"
                      ? { title: value }
                      : value.inputValue
                      ? { title: value.inputValue }
                      : value
                  )
            );
          }}
          filterOptions={(options, params) => {
            const seriesFiltered = seriesFilter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
              (option) => inputValue === option.title
            );
            if (inputValue !== "" && !isExisting) {
              seriesFiltered.push({
                inputValue,
                title: `Add new "${inputValue}" category`,
              });
            }

            return seriesFiltered;
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
                    backgroundColor: "rgba(255, 255, 255, 1) !important",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(25, 255, 255, 1) !important",
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
              id="series"
              label="Series"
              name="series"
              type="search"
              // autoFocus
              /// Hide clearButton
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Fragment>{params.InputProps.endAdornment}</Fragment>
                ),
              }}
              sx={{
                '& input[type="search"]::-webkit-search-cancel-button': {
                  display: "none",
                },
                '& input[type="search"]::-ms-clear': {
                  display: "none",
                },
              }}
            />
          )}
        />
        {/* <TextField
          margin="normal"
          required
          fullWidth
          name="series"
          label="Series"
          type="series"
          id="series"
          autoComplete="series"
        /> */}
        <Button
          type="submit"
          fullWidth
          // variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Save
        </Button>
      </Box>
    </ThemeProvider>
  );
}

export default CategorizeForm;
