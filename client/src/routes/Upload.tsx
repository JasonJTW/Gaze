import { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Button,
  ImageListItem,
  ImageListItemBar,
  ImageList,
  Grid,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";

function Upload() {
  /// Maximum number of uploads
  const maxAllowedFiles = import.meta.env.VITE_maxAllowedFiles;
  const hostName = import.meta.env.VITE_ServerHostName;

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  /// Select files input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.round(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toFixed(dm) + " " + sizes[i];
  };

  /// Alert user and clear selected files if amounts > maxAllowedFiles
  useEffect(() => {
    if (selectedFiles.length < 1) return;
    if (fileInputRef.current && selectedFiles.length > maxAllowedFiles) {
      alert(`You can upload a maximum of ${maxAllowedFiles} files !`);
      /// Clear all files from selection
      setSelectedFiles([]);
      fileInputRef.current.value = "";
    }
    console.log(selectedFiles);
  }, [selectedFiles]); // eslint-disable-line react-hooks/exhaustive-deps

  const [previews, setPreviews] = useState<
    { name: string; url: string; size: string }[]
  >([]);
  useEffect(() => {
    if (selectedFiles.length > maxAllowedFiles) return;
    const newPreviews = selectedFiles.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      size: formatBytes(file.size),
    }));
    setPreviews(newPreviews);

    // 清理函數：當組件卸載或 selectedFiles 更新時，釋放這些物件 URL
    return () => {
      newPreviews.forEach((previews) => URL.revokeObjectURL(previews.url));
    };
  }, [selectedFiles]); // eslint-disable-line react-hooks/exhaustive-deps

  /// On file selection change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files && fileInputRef.current) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  /// Handle Remove selected files button
  const removeSelectedFiles = (index: number) => {
    const newSelectedFiles = selectedFiles.filter((_, i) => i != index);
    setSelectedFiles(newSelectedFiles);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    /// prevent default submit event
    event.preventDefault();

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("image", file);
    });
    console.log(formData);

    try {
      //* fetch uploadPhoto API from server
      const response = await fetch(`${hostName}/api/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "Accept-Charset": "UTF-8",
        },
      });
      /// Check response status code
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Upload failed.");
      }
      const result = await response.json();
      alert(result.message);
      window.location.reload();
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.log("Error uploading files:", errorMessage);
      alert("Upload failed: " + errorMessage);
    }
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
    <>
      <ThemeProvider theme={theme}>
        <Container
          sx={{
            minHeight: "100%",
            minWidth: "100%",
            margin: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid container columns={16}>
            <Grid
              item
              xs={8}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Container>
                <Typography variant="h1" sx={{ color: "#c6cdd7" }}>
                  Upload
                </Typography>
                <Typography variant="overline" sx={{ color: "#d6c9d0" }}>
                  Select and upload your works.
                </Typography>
                <form
                  action={`${hostName}/api/upload`}
                  method="POST"
                  encType="multipart/form-data"
                  onSubmit={handleSubmit}
                >
                  <Button
                    onClick={() => fileInputRef.current!.click()}
                    startIcon={<ImageIcon />}
                  >
                    select file
                  </Button>

                  <input
                    type="file"
                    name="image"
                    id="imageUpload"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    style={{ display: "none" }}
                  />
                  <Button type="submit" endIcon={<SendIcon />}>
                    Send
                  </Button>
                </form>
              </Container>
            </Grid>
            <Grid
              item
              xs={8}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageList sx={{ width: 800 }}>
                {previews.map((preview, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={preview.url}
                      style={{ borderRadius: "20px" }}
                      loading="lazy"
                    />
                    <ImageListItemBar
                      title={preview.name}
                      subtitle={<span>by_ Jyun Hao, Jhang</span>}
                      position="below"
                      sx={{
                        color: "#d6c9d0",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      actionIcon={
                        <>
                          <Typography variant="button">
                            {preview.size}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            disableRipple
                            onClick={() => removeSelectedFiles(index)}
                            sx={{
                              backgroundColor: "#7897ae",
                              textTransform: "none",
                              "&:hover": {
                                bgcolor: "#4a6d88",
                              },
                            }}
                          >
                            x
                          </Button>
                        </>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Upload;
