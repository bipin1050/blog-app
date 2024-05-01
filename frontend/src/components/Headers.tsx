import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import Cookies from "js-cookie";

const Headers = () => {
  const navigate = useNavigate();
  const {username, clearUser} = useUser();

  const handleLogout = async() => {
    try {
      const response  = await fetch("/api/users/logout/", {
        method: "POST",
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken") || "",
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        clearUser();
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="border-b-2 border-b-gray-200 sticky top-0 z-10 bg-white">
        <div className="flex justify-between flex-col sm:flex-row px-4 xl:px-0 max-w-[1150px] mx-auto">
          <div
            className="py-4 text-2xl font-mono text-sky-400 hover:cursor-pointer"
            onClick={() => {
              navigate("/");
            }}>
            Happy Reading !
          </div>
          <div>
            {username ? (
              <div className="flex flex-row gap-5">
                <div
                  onClick={() => {
                    navigate("/addblog");
                  }}
                  className="my-3 p-2 w-32 text-center text-xl font-sans rounded-lg bg-sky-400 text-white border-2 border-sky-400 hover:bg-white hover:text-sky-400 hover:cursor-pointer">
                  Add Blogs
                </div>
                <div
                  onClick={handleLogout}
                  className="my-3 p-2 w-24 text-center text-xl font-sans rounded-lg bg-sky-400 text-white border-2 border-sky-400 hover:bg-white hover:text-sky-400 hover:cursor-pointer">
                  Logout
                </div>
              </div>
            ) : (
              <div
                onClick={() => {
                  navigate("/login");
                }}
                className="my-3 p-2 w-24 text-center text-xl font-sans rounded-lg bg-sky-400 text-white border-2 border-sky-400 hover:bg-white hover:text-sky-400 hover:cursor-pointer">
                Login
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Headers;
