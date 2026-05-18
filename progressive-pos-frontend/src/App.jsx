import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "./utils/ScrollToTop";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
      <ToastContainer />
    </BrowserRouter>
  );
}
