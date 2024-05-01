import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import Loading from "../../components/Loading";
import Cookies from "js-cookie";
import SearchBar from "../../components/SearchBar";

const HomePage = () => {
  const [blogs, setBlogs] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  async function fetchBlogs() {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs/" + query, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.results);
        setBlogs(data.results);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Problem fetching the data:", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchBlogs();
  }, [query]);

  return (
    <div className="max-w-[1150px] mx-auto pt-6 px-4 lg:px-0 flex flex-row flex-wrap gap-5">
      <SearchBar setQuery={setQuery}/>
      {loading ? (
        <Loading />
      ) : blogs.length > 0 ? (
        blogs.map((blog, idx) => (
          <div key={idx} className="mx-px max-[600px]:mx-auto min-w-300px">
            <BlogCard blog={blog} />
          </div>
        ))
      ) : (
        <div className="w-[100%] relative h-[80vh]">
          <div className="text-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            No Blogs found
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
