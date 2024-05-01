import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useUser } from "../../contexts/UserContext";
import Cookies from "js-cookie";
import Creatable from "react-select/creatable";

const AddBlogs: React.FC = () => {
  const { firstname, lastname } = useUser();
  const [blog, setBlog] = useState({
    author: firstname ? firstname + " " + lastname : "",
    title: "",
    category: "",
    tags: [""],
    content: [""],
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const { name, value } = event.target;
    setBlog((prevBlog) => ({ ...prevBlog, [name]: value }));
  };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { value } = event.target;
    setBlog((prevBlog) => {
      const updatedContent = [...prevBlog.content];
      updatedContent[index] = value;
      return { ...prevBlog, content: updatedContent };
    });
  };

  const handleAddParagraph = () => {
    setBlog((prevBlog) => ({
      ...prevBlog,
      content: [...prevBlog.content, ""],
    }));
  };

  const handleAddBlog = async () => {
    try {
      const response = await fetch("api/blog/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        body: JSON.stringify({
          author: blog.author,
          title: blog.title,
          category: blog.category,
          tags: blog.tags,
          content: blog.content,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setBlog({
          author: "",
          title: "",
          category: "",
          tags: [""],
          content: [""],
        });
        toast("Blog added successfully");
      }
    } catch (error) {
      toast.error("Error adding blog: " + error);
      console.error("There was a problem adding the blog:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category/list/");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tag/list/");
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.toLowerCase(),
    label: category,
  }));

  const tagOptions = tags.map((tag) => ({
    value: tag.toLowerCase(),
    label: tag,
  }));

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center my-6">
      <div className="w-[80%] sm:w-96 bg-white p-6 rounded-lg shadow-2xl">
        <div className="mb-4">
          <label htmlFor="author" className="text-gray-700 font-bold">
            Author:
          </label>
          <input
            name="author"
            className="w-full px-2 py-1 mt-1 border border-gray-300 rounded"
            placeholder="Name Surname"
            required
            value={blog.author}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="text-gray-700 font-bold">
            Title:
          </label>
          <input
            name="title"
            className="w-full px-2 py-1 mt-1 border border-gray-300 rounded"
            placeholder="This is a new Blog"
            value={blog.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4 relative">
          <label htmlFor="title" className="text-gray-700 font-bold">
            Category:
          </label>
          <Creatable
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="category"
            options={categoryOptions}
            onChange={(choice) =>
              setBlog((prevBlog) => ({
                ...prevBlog,
                category: choice?.label || "",
              }))
            }
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="text-gray-700 font-bold">
            Tags:
          </label>
          <Creatable
            className="basic-single"
            classNamePrefix="select"
            isClearable={true}
            isSearchable={true}
            name="category"
            options={tagOptions}
            isMulti
            onChange={(choices) => {
              if (choices) {
                const selectedLabels = choices.map((choice) => choice.label);
                setBlog((prevBlog) => ({
                  ...prevBlog,
                  tags: selectedLabels,
                }));
              } else {
                setBlog((prevBlog) => ({
                  ...prevBlog,
                  tags: [],
                }));
              }
            }}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="text-gray-700 font-bold">
            Blog Content:
          </label>
          {blog.content.map((paragraph, index) => (
            <textarea
              key={index}
              required
              name="content"
              className="w-full px-2 py-1 mt-1 border border-gray-300 rounded"
              placeholder="Content of blog goes like this"
              value={paragraph}
              onChange={(event) => handleTextAreaChange(event, index)}
            />
          ))}
          <button
            onClick={handleAddParagraph}
            className="text-sky-400 hover:text-sky-500 focus:outline-none">
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Paragraph
          </button>
        </div>

        <div className="text-center">
          <button
            className="px-4 py-2 text-white bg-sky-400 rounded hover:bg-sky-500 focus:outline-none"
            onClick={handleAddBlog}>
            Add Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBlogs;
