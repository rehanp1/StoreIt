import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import useUserAccount from "@/hooks/useUserAccount";
import { verifyOtp, resendOtp } from "@/services/auth.service";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

const OTPModal = ({ email }: { email: string }) => {
  const { setIsLoggedIn } = useUserAccount();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const data = await verifyOtp(email, password);

    if (data.success) {
      setIsLoggedIn(true);
      navigate("/", { replace: true });
    } else {
      console.log(data.message || data.error);
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    const data = await resendOtp(email);

    if (data.success) {
      toast({
        description: "OTP resent to your email Id successfully",
        variant: "success",
      });
    } else {
      toast({
        description: data.message || data.error,
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">
            Enter Your OTP
            <img
              src="/assets/icons/close-dark.svg"
              alt="close"
              width={20}
              height={20}
              className="otp-close-button"
              onClick={() => setIsOpen(false)}
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            We've sent code to
            <span className="pl-1 text-brand">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP
          maxLength={6}
          value={password}
          onChange={setPassword}
          pattern={REGEXP_ONLY_DIGITS}
        >
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot" />
            <InputOTPSlot index={1} className="shad-otp-slot" />
            <InputOTPSlot index={2} className="shad-otp-slot" />
            <InputOTPSlot index={3} className="shad-otp-slot" />
            <InputOTPSlot index={4} className="shad-otp-slot" />
            <InputOTPSlot index={5} className="shad-otp-slot" />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>
          <div className="flex w-full flex-col gap-4">
            <AlertDialogAction
              disabled={isLoading}
              onClick={handleSubmit}
              className="shad-submit-btn h-12"
              type="button"
            >
              Submit
              {isLoading && (
                <img
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>
            <div className="subtitle-2 text-center mt-2 text-light-100">
              Didn't get code?
              <Button
                variant="link"
                className="pl-1 text-brand"
                onClick={handleResendOtp}
              >
                Click to resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPModal;
