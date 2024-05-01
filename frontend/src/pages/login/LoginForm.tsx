import { useState } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../../contexts/UserContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSignUpURLClick: () => void;
}

interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginForm({ onSignUpURLClick }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>();

  async function onSubmit(data: LoginFormValues) {
    try {
      setLoading(true);
      const response = await fetch("/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if (response.ok && responseData.id && responseData.email) {
        setUser(
          responseData.id,
          responseData.email,
          responseData.username,
          responseData.first_name || undefined,
          responseData.last_name || undefined
        );
        setLoading(false);
        navigate("/");
      } else {
        if (responseData.username)
          setError("username", { message: responseData.username[0] });
        if (responseData.password)
          setError("password", { message: responseData.password[0] });
        if (!responseData.username && !responseData.password) {
          setError("password", { message: "Invalid credentials" });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("root", { message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full md:w-[400px] mt-10 p-8 flex flex-col gap-5 rounded-lg  bg-gray-200 bg-opacity-80">
      <div className="space-y-1">
        <div className="text-2xl">Welcome Back</div>
        <div>Login to your account</div>
      </div>
      <div className="grid gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1 flex flex-col ">
            <label>Username</label>
            <input
              className="h-8 px-2 rounded-md bg-gray-100 outline-none focus:outline-sky-400"
              type="username"
              placeholder="user@example"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <span className="text-red-500 text-sm">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="space-y-1 flex flex-col">
            <label>Password</label>
            <input
              className="h-8 px-2 rounded-md bg-gray-100 outline-none focus:outline-sky-400"
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-sky-400 py-2 rounded-md disabled:bg-sky-300"
            disabled={loading}>
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>
      <div
        className="text-center w-full underline underline-offset-2 cursor-pointer"
        onClick={() => onSignUpURLClick()}>
        Don't have an account? Sign Up
      </div>
    </div>
  );
}
