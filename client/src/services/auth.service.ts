const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface FormData {
  fullName: string;
  email: string;
}

type FormType = "sign-in" | "sign-up";

export const signInAndSignUp = async (formData: FormData, type: FormType) => {
  try {
    const response = await fetch(
      backendUrl + `/api/auth/${type === "sign-up" ? "sign-up" : "sign-in"}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          type === "sign-up" ? formData : { email: formData.email }
        ),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("FAILED TO SUBMIT FORM", error);
    return null;
  }
};

export const verifyOtp = async (email: string, password: string) => {
  try {
    const response = await fetch(backendUrl + "/api/auth/verify-otp", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp: password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Failed to verify OTP", error);
    return null;
  }
};

export const resendOtp = async (email: string) => {
  try {
    const response = await fetch(backendUrl + "/api/auth/resend-otp", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Failed to Resend OTP", error);
    return null;
  }
};

export const signOut = async () => {
  try {
    const response = await fetch(backendUrl + "/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("FAILED TO SIGN OUT", error);
    return null;
  }
};

export const authState = async () => {
  try {
    const response = await fetch(backendUrl + "/api/auth/is-auth", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("FAILED TO SIGN OUT", error);
    return null;
  }
};
