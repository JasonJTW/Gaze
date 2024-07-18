import {
  Typography,
  ThemeProvider,
  createTheme,
  Container,
  Dialog,
  DialogContent,
  IconButton,
  Zoom,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, forwardRef } from "react";
import { imageItem } from "../types/imageItem";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { FullscreenImageDialogProps } from "../types/fullScreenImageDialog";
const hostName = import.meta.env.VITE_ServerHostName;
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
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main, // MenuIcon color
          "&:hover": {
            color: "#cdc1c8", // MenuIcon color when hovered
          },
        }),
      },
    },
  },
});
function splitArrayIntoColumns<T>(array: T[], columns: number): T[][] {
  const result: T[][] = Array.from({ length: columns }, () => []);
  array.forEach((item, index) => {
    result[index % columns].push(item);
  });
  return result;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Zoom ref={ref} {...props} />;
});
const FullscreenImageDialog: React.FC<FullscreenImageDialogProps> = ({
  open,
  imageUrl,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      TransitionComponent={Transition}
      sx={{
        ".MuiBackdrop-root": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(15px)",
        },
        ".MuiDialog-paper": {
          backgroundColor: "transparent",
        },
      }}
    >
      <IconButton
        edge="end"
        color="inherit"
        onClick={onClose}
        aria-label="close"
        sx={{ position: "absolute", top: 10, right: 20 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Fullscreen"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

function Gallery() {
  const [images, setImages] = useState<imageItem[]>([]);

  useEffect(() => {
    getAllImages();
  }, []);

  const columns = splitArrayIntoColumns(images, 3);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedImage(null);
  };

  async function getAllImages() {
    try {
      const response = await fetch(`${hostName}/api/gallery/all`);
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to fetch images.");
      }
      const result = await response.json();
      setImages(result.data);
    } catch (error) {
      console.error("Error fetching images: ", error);
      const errorMessage = (error as Error).message;
      alert("Failed to fetch images: " + errorMessage);
    }
  }
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
            Gallery "
          </Typography>
          <Typography variant="overline" sx={{ color: "#d6c9d0" }}>
            Manage your gallery.
          </Typography>
        </Container>

        <Container sx={{ display: "flex", gap: "20px" }}>
          {/* //* Photo-gallery */}
          {columns.map((column, columnIndex) => (
            <Container
              sx={{ margin: 0, padding: "0px !important" }}
              key={columnIndex}
            >
              {/* //* Column */}
              <Container
                key={columnIndex}
                sx={{
                  margin: 0,
                  padding: "0px !important",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                {/* //* Photo */}
                {column.map((image, index) => (
                  <LazyLoadImage
                    effect="blur"
                    key={index}
                    src={image.url}
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "cover",
                      borderRadius: "10px",
                      display: "block",
                      cursor: "pointer",
                    }}
                    threshold={10}
                    placeholderSrc={image.url}
                    onClick={() => handleImageClick(image.url)}
                  />
                ))}
              </Container>
              <FullscreenImageDialog
                open={dialogOpen}
                imageUrl={selectedImage}
                onClose={handleCloseDialog}
              />
            </Container>
          ))}
        </Container>
      </Container>
    </ThemeProvider>
  );
}

export default Gallery;
