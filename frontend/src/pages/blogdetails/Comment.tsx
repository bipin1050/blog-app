import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { useUser } from "../../contexts/UserContext";

interface Comments {
  content: string;
  author: string;
  blog_post: number;
  id: number;
}
export function Comment() {
  const [comment, setComment] = useState<string>("");
  const [allComments, setAllComments] = useState<Comments[] | null>(null);
  const [refetch, setRefetch] = useState<boolean>(false);
  const { state } = useLocation();
  const [isPost, setIsPost] = useState<boolean>(false);
  const [isFetch, setIsFetch] = useState<boolean>(false);
  const {email} = useUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsPost(true);
      const response = await fetch(`/api/blog/${state.blog.id}/comment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        body: JSON.stringify({ content: comment }),
      });
      if (response.ok) {
        toast("Comment added successfully");
        setComment("");
        setIsPost(false);
        setRefetch(!refetch);
      }
      setIsPost(false);
    } catch (error) {
      toast.error("Error adding comment");
      console.error("There was a problem adding the comment:", error);
    }
  };

  async function fetchComments() {
    try {
      setIsFetch(true);
      const response = await fetch(`/api/blog/${state.blog.id}/comment/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setAllComments(data);
        setIsFetch(false);
      } else {
        setIsFetch(false);
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      setIsFetch(false);
      console.error("Failed to fetch comments:", error);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [refetch, state.blog.id]);

  return (
    <div className="mt-5">
      {email && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col text-left item-left">
          <div className="mb-4">
            <label htmlFor="comment" className="block text-lg font-bold mb-2">
              Leave a comment:
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write a comment"
            />
          </div>
          <button
            type="submit"
            disabled={isPost}
            className="bg-sky-400 cursor-pointer text-white py-2 px-4 w-[150px] rounded hover:bg-sky-500 disabled:bg-sky-300">
            Comment
          </button>
        </form>
      )}
      <div className="mt-5 w-full bg-gray-100 shadow-md p-8">
        <label htmlFor="comment" className="block text-lg font-bold mb-2">
          Comments
        </label>
        {isFetch ? (
          <Loading />
        ) : allComments?.length ? (
          allComments?.map((comment) => (
            <div className="flex item-center gap-4 bg-white p-4 my-3 rounded-xl shadow-lg">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex justify-center items-center text-center">
                <span className="text-2xl font-extrabold ">
                  {comment.author.slice(0, 1)}
                </span>
              </div>
              <div>
                <h3>{comment.author}</h3>
                <h6>{comment.content}</h6>
              </div>
            </div>
          ))
        ) : (
          <div className="w-[100%] relative h-[200px]">
            <div className="text-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              No Comments found
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
