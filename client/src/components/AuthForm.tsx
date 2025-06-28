import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Link } from "react-router-dom";
import OTPModal from "./OTPModal";
import useUserAccount from "@/hooks/useUserAccount";
import { signInAndSignUp } from "@/services/auth.service";
import { toast } from "react-toastify";

type FormType = "sign-in" | "sign-up";

interface FormData {
  fullName: string;
  email: string;
}

interface ErrorMessages {
  fullName?: string;
  email?: string;
}

const AuthForm = ({ type }: { type: FormType }) => {
  const { setAccount, account } = useUserAccount();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>({});

  const validate = (): boolean => {
    const { fullName, email } = formData;
    const errors: ErrorMessages = {};
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (type === "sign-up" && fullName.trim().length < 2)
      errors.fullName = "Name must contains atleast 2 character(s)";

    if (!regex.test(email)) {
      errors.email = "Invalid email address";
    }

    setErrorMessage(errors);
    return Object.keys(errors).length == 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      return { ...prevData, [name]: value };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validate()) {
      setIsLoading(true);

      const data = await signInAndSignUp(formData, type);

      if (data?.success) {
        setAccount(data.user);
        toast.success("OTP sent to your email successfully");
      } else {
        toast.error(data.message || data.error);
      }

      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="auth-form">
        <h1 className="form-title">
          {type === "sign-in" ? "Sign In" : "Sign Up"}
        </h1>

        {type === "sign-up" && (
          <section className="shad-form-item">
            <Label className="shad-form-label">Full Name</Label>
            <Input
              onChange={(e) => handleChange(e)}
              placeholder="Enter your full name"
              name="fullName"
              className="shad-input"
            />
            {errorMessage.fullName && (
              <p className="shad-form-message">{errorMessage.fullName}</p>
            )}
          </section>
        )}

        <section className="shad-form-item">
          <Label className="shad-form-label">Email</Label>
          <Input
            onChange={(e) => handleChange(e)}
            placeholder="Enter your email"
            name="email"
            className="shad-input"
          />
          {errorMessage.email && (
            <p className="shad-form-message">{errorMessage.email}</p>
          )}
        </section>

        <Button className="form-submit-button " disabled={isLoading}>
          {type === "sign-in" ? "Sign In" : "Sign Up"}

          {isLoading && (
            <img
              src="/assets/icons/loader.svg"
              width={24}
              height={24}
              alt="loader"
              className="ml-2 animate-spin"
            />
          )}
        </Button>

        <div className="body-2 flex justify-center">
          <p>
            {type === "sign-in"
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>

          <Link
            to={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="ml-1 font-medium text-brand"
          >
            {type === "sign-in" ? "Sign Up" : "Sign In"}
          </Link>
        </div>
      </form>

      {/* check whether user account created */}
      {account && <OTPModal email={account.email} />}
    </>
  );
};

export default AuthForm;
