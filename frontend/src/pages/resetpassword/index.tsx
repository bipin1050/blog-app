import RedirectOnAuthSuccess from "../../components/RedirectOnAuthSuccess";
import PasswordResetForm from "./PasswordResetForm";
import PasswordConfirmForm from "./PasswordConfirmForm";
import { useLocation } from "react-router-dom";

export default function ResetPassword() {
  const location = useLocation();
  const isConfirmPage = location.pathname.includes("confirm");
  return (
    <RedirectOnAuthSuccess>
      <div className="mt-4 px-4 flex flex-col gap-16 justify-center items-center  md:h-[80vh] md:mt-0 md:px-0">
        {isConfirmPage ? <PasswordConfirmForm /> : <PasswordResetForm />}
      </div>
    </RedirectOnAuthSuccess>
  );
}
