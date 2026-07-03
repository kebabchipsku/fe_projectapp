import { useEffect } from "react";
import { Routes, useLocation } from "react-router-dom";
import HelpCenter from "./components/main/HelpCenter";
import mainRoute from "./routes/mainRoute";
import dashboardRoute from "./routes/dashboardRoute/indexRoute";
import authRoute from "./routes/authRoute";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods?.autoInit();
  }, [location.pathname]);

  return (
    <>
      <Routes>
        {mainRoute()}
        {dashboardRoute()}
        {authRoute()}
      </Routes>

      {/* Tombol bantuan dan modal panduan tampil di semua halaman aplikasi. */}
      <HelpCenter />
    </>
  );
}

export default App;
