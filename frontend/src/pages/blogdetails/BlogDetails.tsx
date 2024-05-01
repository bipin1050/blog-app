import { useEffect, useState } from "react";
import { Card, Group, Image, Text, useMantineTheme } from "@mantine/core";
import image from "../../assets/images/img.jpg";
import BlogCard from "../home/BlogCard";
import Loading from "../../components/Loading";
import { useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { Comment } from "./Comment";

const Blog = () => {
  const theme = useMantineTheme();
  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  const { state } = useLocation();

  return (
    <div>
      <Card shadow="sm" padding="lg">
        <Card.Section>
          <Image src={image} height={520} />
        </Card.Section>

        <Group
          // position="apart"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
          <Text weight={700} size={25}>
            {state.blog.title}
          </Text>
        </Group>
        <Group
          position="apart"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
          <Text weight={500} size={18}>
            By {state.blog.author}
          </Text>
        </Group>
        <Group
          position="apart"
          style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
          <Text weight={500} size={18}>
            Published on {state.blog.creation_date.slice(0, 10)}
          </Text>
        </Group>
        {state.blog.content.map((para: string, idx: number) => {
          return (
            <Text
              key={idx}
              size="lg"
              style={{
                color: secondaryColor,
                lineHeight: 1.5,
                marginBottom: 10,
              }}>
              {para}
            </Text>
          );
        })}
      </Card>
    </div>
  );
};

const SideBar = () => {
  const [blogs, setBlogs] = useState<[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchRecentBlogs() {
    try {
      setLoading(true);
      const response = await fetch("/api/blogs/recent/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
        console.log(data);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Problem fetching the data:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecentBlogs();
  }, []);

  return (
    <div>
      <div className="pl-3 text-left xl:text-center text-lg font-bold text-sky-400">
        Recent Blogs
      </div>
      <div className="p-1 border-gray-300 max-w-[1150px] mx-auto flex flex-row flex-wrap gap-5">
        {loading ? (
          <Loading />
        ) : blogs ? (
          blogs?.map((blog, idx) => {
            return (
              <div key={idx} className="max-w-[300px]">
                <BlogCard blog={blog} />
              </div>
            );
          })
        ) : (
          <div className="w-[100%] relative h-12">
            <div className="text-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              No Blogs found
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BlogDetails = () => {
  return (
    <>
      <div className="max-w-[1150px] mx-auto px-4 xl:px-0 grid grid-cols-4 gap-4 pt-3">
        <div className="col-span-4 xl:col-span-3">
          <Blog />
          <Comment />
        </div>
        <div className="col-span-4 xl:col-span-1">
          <SideBar />
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
