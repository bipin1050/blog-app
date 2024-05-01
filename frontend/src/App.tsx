import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home";
import BlogDetails from "./pages/blogdetails/BlogDetails";
import Headers from "./components/Headers";
import Footer from "./components/Footer";
import AddBlog from "./pages/addblog/AddBlog";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/login";
import ResetPassword from "./pages/resetpassword";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Headers />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<HomePage />} />
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/addblog" element={<AddBlog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route
            path="/resetpassword/confirm/:uid/:token"
            element={<ResetPassword />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
