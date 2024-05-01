import { useState } from "react";
import RedirectOnAuthSuccess from "../../components/RedirectOnAuthSuccess";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Login() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  return (
    <RedirectOnAuthSuccess>
      <div className="px-4 flex flex-col gap-16 justify-center items-center my-auto md:px-0">
        {isLogin ? (
          <LoginForm onSignUpURLClick={() => setIsLogin(false)} />
        ) : (
          <RegisterForm
            onLoginURLClick={() => setIsLogin(true)}
            onRegister={() => setIsLogin(true)}
          />
        )}
      </div>
    </RedirectOnAuthSuccess>
  );
}
