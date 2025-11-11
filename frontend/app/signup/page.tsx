"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Navigation from "../components/Navigation";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";
import Background from "../components/Background";

export default function SignupPage() {
  const router = useRouter();
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    userName:"",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignup() {
    // Map frontend state to backend DTO format
    const userRequestDto = {
      username: state.userName,
      password: state.password,
      phone: state.phoneNumber,
      email: state.email || undefined,
      firstName: state.firstName,
      lastName: state.lastName,
    };

    try {
      const res = await fetch("http://localhost:3001/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRequestDto),
      });
      console.log("response", JSON.stringify(res));
      if (res.status === 201) {
        router.push("/home");
      } else {
        const error = await res.json();
        console.error("Signup failed:", error);
        setErrorMessage(error.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, [e.target.id]: e.target.value });
    setErrorMessage("");
  };


  return (
    <Background>
      <Navigation />

      {/* Signup Form */}
      <main className="flex-1 flex items-center justify-center">
        <form className="flex flex-col w-full max-w-xs">
          <InputField
            placeholder="First Name"
            id="firstName"
            value={state.firstName}
            onChange={handleChange}
            required
          />
          <InputField
            placeholder="Last Name"
            id="lastName"
            value={state.lastName}
            onChange={handleChange}
            required
          />
          <InputField
            placeholder="Username"
            id="userName"
            value={state.userName}
            onChange={handleChange}
            required
          />
          <InputField
            placeholder="Phone Number"
            id="phoneNumber"
            type="tel"
            value={state.phoneNumber}
            onChange={handleChange}
            required
          />
          <InputField
            placeholder="Email Address (optional)"
            id="email"
            type="email"
            value={state.email}
            onChange={handleChange}
          />
          <InputField
            placeholder="Password"
            id="password"
            type="password"
            value={state.password}
            onChange={handleChange}
            required
            marginBottom={errorMessage ? "mb-2" : "mb-10"}
          />
          {errorMessage && (
            <p className="text-red-600 text-sm mb-10 pl-3">{errorMessage}</p>
          )}
          <SubmitButton
            onClick={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          />
        </form>
      </main>
    </Background>
  );
}

