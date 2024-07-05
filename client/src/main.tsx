import React from "react";
import ReactDOM from "react-dom/client";
import Upload from "./routes/Upload.tsx";
import Error from "./routes/Error.tsx";
import Management from "./routes/Management.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "./components/Layout.tsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Content from "./routes/Content.tsx";
const theme = createTheme({
  palette: {
    background: {
      default: "#010c1e", // Default background color
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout />,
      </ThemeProvider>
    ),
    errorElement: <Error />,
    children: [
      {
        path: "/upload",
        element: <Upload />,
      },
      {
        path: "/management",
        element: <Management />,
      },
      {
        path: "/content",
        element: <Content />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
