import {
  Container,
  ThemeProvider,
  createTheme,
  Typography,
  ImageList,
  ImageListItem,
  // ListSubheader,
  Button,
} from "@mui/material";
import React from "react";
import {
  LazyLoadImage,
  trackWindowScroll,
  ScrollPosition,
} from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
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
  interface ImageItemProps {
    item: DataItem;
    scrollPosition: ScrollPosition; // 或者你可以使用更具体的类型
  }
  //TODO Fix scrollbar lag

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
      if (response.status === 429) {
        // 429 Too Many Requests
        const errorData = await response.json();
        alert(`Rate limit exceeded: ${errorData.message}`);
        return;
      }

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

  //* Custom ImageList Item
  const ImageItem: React.FC<ImageItemProps> = ({ item, scrollPosition }) => {
    return (
      <ImageListItem
        key={item.id}
        sx={{
          position: "relative",
          /// border transition speed
          // transition: "0.1s ease-in-out",
          border: "1px solid transparent",
          borderRadius: "20px",
          overflow: "hidden",
          "&:hover": {
            border: "1px solid #ccc",
          },
          "&:hover img": {
            opacity: "0.5 !important",
            filter: "blur(5px)",
          },
          "&:hover button": {
            opacity: 1,
            right: 5,
            top: 5,
          },
        }}
      >
        <RouterLink to={`/Content?id=${item.id}`}>
          <LazyLoadImage
            src={item.url}
            height="100%"
            width="100%"
            effect="blur"
            placeholderSrc={item.url}
            scrollPosition={scrollPosition}
            style={{
              borderRadius: "20px",
              willChange: "opacity, filter",
              width: "100%",
              height: "auto",
              display: "block",
              /// opacity & blur transition speed
              WebkitTransition: "0.3s ease-in-out",
              WebkitTransitionProperty: "opacity filter",
            }}
            wrapperProps={{
              style: {
                backgroundPosition: "center",
              },
            }}
            threshold={10}
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
    );
  };
  // Wrap the ImageItem component with trackWindowScroll
  const ScrollableImageItem = React.memo(trackWindowScroll(ImageItem));

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
            {/* FIXME: ListSubheader's width full width   */}
            {/* <ImageListItem
              key="Subheader"
              cols={3}
              sx={{
                width: "100%",
              }}
            >
              <ListSubheader
                component="div"
                color="primary"
                sx={{
                  backgroundColor: "#010c1e",
                }}
              >
                Portraits
              </ListSubheader>
            </ImageListItem> */}

            {data.map((item, index) => (
              <ScrollableImageItem key={index} item={item} />
            ))}
          </ImageList>
        </Container>
      </ThemeProvider>
    </>
  );
}
