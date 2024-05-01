import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface PasswordConfirmFormValues {
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordConfirmForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PasswordConfirmFormValues>();

  async function onSubmit(formData: PasswordConfirmFormValues) {
    try {
      setLoading(true);
      setSuccessMessage("");
      const response = await fetch("/api/auth/password/reset/confirm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Cookies.get("csrftoken") || "",
        },
        body: JSON.stringify({
          uid: uid || "",
          token: token || "",
          new_password1: formData.newPassword,
          new_password2: formData.confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.detail);
        setLoading(false);
      } else {
        toast("Something went wronnnng");
        if (data.new_password2) {
          setError("confirmPassword", { message: data.new_password2[0] });
        }
      }
    } catch (error) {
      console.log(error);
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1 flex flex-col">
          <label>New Password</label>
          <input
            className="h-8 px-2 rounded-md bg-gray-100 outline-none focus:outline-sky-400"
            type="password"
            {...register("newPassword", { required: "Password is required" })}
          />
          {errors.newPassword && (
            <span className="text-red-500 text-sm">
              {errors.newPassword.message}
            </span>
          )}
        </div>
        <div className="space-y-1 flex flex-col">
          <label>Confirm New Password</label>
          <input
            className="h-8 px-2 rounded-md bg-gray-100 outline-none focus:outline-sky-400"
            type="password"
            {...register("confirmPassword", { required: "Confirm Password is required" })}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        {successMessage && (
          <>
            <div className="text-green-600 flex text-sm items-center gap-1">
              {successMessage}
            </div>
            <p
              className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4 cursor-pointer text-center w-full"
              onClick={() => navigate("/login")}>
              Back to Login
            </p>
          </>
        )}
        <button
          type="submit"
          className="w-full bg-sky-400 py-2 rounded-md disabled:bg-sky-300"
          disabled={loading}>
          {loading ? "Loading..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
