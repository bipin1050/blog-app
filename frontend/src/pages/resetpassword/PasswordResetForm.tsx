import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface PasswordResetFormValues{
  email: string;
}


export default function PasswordResetForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string>("");

   const {
     register,
     handleSubmit,
     setError,
     formState: { errors },
   } = useForm<PasswordResetFormValues>();

  async function onSubmit(data: PasswordResetFormValues) {
    try {
      setSuccessMessage("");
      setLoading(true);
      const response = await fetch("/api/auth/password/reset/",{
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken") || "",
          },
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        setSuccessMessage(responseData.detail);
        setLoading(false);
      } else {
        if (responseData.email) 
          setError("email", { message: responseData.email[0] });
        else toast("Something went wrong");
      }
    } catch (error) {
      toast("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full md:w-[400px] mt-10 p-8 flex flex-col gap-5 rounded-lg  bg-gray-200 bg-opacity-80">
      <div className="space-y-1">
        <div className="text-2xl">Welcome Back</div>
        <div>Reset your password</div>
      </div>
      <div className="grid gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1 flex flex-col ">
            <label>Email</label>
            <input
              className="h-8 px-2 rounded-md bg-gray-100 outline-none focus:outline-sky-400"
              type="email"
              placeholder="user@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          {successMessage && (
            <div className="text-green-600 flex items-center gap-1">
              {successMessage}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-sky-400 py-2 rounded-md disabled:bg-sky-300"
            disabled={loading}>
            {loading ? "Loading..." : "Reset Password"}
          </button>
        </form>
      </div>
      <div>
        <p
          className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4 cursor-pointer text-center w-full"
          onClick={() => navigate("/login")}>
          Back to Login
        </p>
      </div>
    </div>
  );
}
