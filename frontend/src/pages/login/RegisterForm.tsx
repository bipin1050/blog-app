import { useState } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface RegisterFormProps {
  onLoginURLClick: () => void;
  onRegister: () => void;
}

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
}

export default function LoginForm({
  onRegister,
  onLoginURLClick,
}: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  async function onSubmit(data: RegisterFormValues) {
    try {
      setLoading(true);
      const response = await fetch("/api/users/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (response.ok) {
        toast("User Created Successfully")
        onRegister();
        setLoading(false);
      } else {
        // Handle register error
        if (responseData.email)
          setError("email", { message: responseData.email[0] });
        if (responseData.password)
          setError("password", { message: responseData.password[0] });
      }
    } catch (error) {
      console.error("Register error:", error);
      // Handle generic error
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full md:w-[400px] mt-10 p-8 flex flex-col gap-5 rounded-lg  bg-gray-200 bg-opacity-80">
      <div className="space-y-1">
        <div className="text-2xl">Welcome Back</div>
        <div>Register your new account</div>
      </div>
      <div className="grid gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1 flex flex-col">
            <label>Username</label>
            <input
              className="h-8 px-2 rounded-md bg-gray-100 outline-none focus:outline-sky-400"
              type="text"
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
            <label>Email</label>
            <input
              className="h-8 px-2 rounded-md bg-gray-100 outline-none focus:outline-sky-400"
              type="enail"
              placeholder="user@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
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
            {loading ? "Loading..." : "Create Account"}
          </button>
        </form>
      </div>
      <div
        className="text-center w-full underline underline-offset-2 cursor-pointer"
        onClick={() => onLoginURLClick()}>
        Already have an account? Login
      </div>
    </div>
  );
}
