"use client";
import { redirect } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Navigation from "../components/Navigation";

export default function SignupPage() {
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  async function handleSignup() {
    // TODO: Implement signup API call
    console.log("signup clicked", JSON.stringify(state));
    // For now, just redirect to home after signup
    // redirect("/home");
  }

  function handleFirstNameChange(e: ChangeEvent<HTMLInputElement>) {
    setState({ ...state, firstName: e.target.value });
  }

  function handleLastNameChange(e: ChangeEvent<HTMLInputElement>) {
    setState({ ...state, lastName: e.target.value });
  }

  function handlePhoneNumberChange(e: ChangeEvent<HTMLInputElement>) {
    setState({ ...state, phoneNumber: e.target.value });
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setState({ ...state, email: e.target.value });
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setState({ ...state, password: e.target.value });
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      <Navigation />

      {/* Signup Form */}
      <main className="flex-1 flex items-center justify-center">
        <form className="flex flex-col w-full max-w-xs">
          <input
            placeholder="First Name"
            id="firstName"
            value={state.firstName}
            onChange={handleFirstNameChange}
            required
            className="border border-slate-500 py-2 rounded-full color-white active:outline-white-0 mb-4 placeholder:pl-3 text-sm text-gray-700 hover:text-brand"
          />
          <input
            placeholder="Last Name"
            id="lastName"
            value={state.lastName}
            onChange={handleLastNameChange}
            required
            className="border border-slate-500 py-2 rounded-full color-white active:outline-white-0 mb-4 placeholder:pl-3 text-sm text-gray-700 hover:text-brand"
          />
          <input
            placeholder="Phone Number"
            id="phoneNumber"
            type="tel"
            value={state.phoneNumber}
            onChange={handlePhoneNumberChange}
            required
            className="border border-slate-500 py-2 rounded-full color-white active:outline-white-0 mb-4 placeholder:pl-3 text-sm text-gray-700 hover:text-brand"
          />
          <input
            placeholder="Email Address (optional)"
            id="email"
            type="email"
            value={state.email}
            onChange={handleEmailChange}
            className="border border-slate-500 py-2 rounded-full color-white active:outline-white-0 mb-4 placeholder:pl-3 text-sm text-gray-700 hover:text-brand"
          />
          <input
            placeholder="Password"
            id="password"
            type="password"
            value={state.password}
            onChange={handlePasswordChange}
            required
            className="border border-slate-500 py-2 rounded-full color-white active:outline-white-0 mb-10 placeholder:pl-3 text-sm text-gray-700 hover:text-brand"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSignup();
            }}
            className="text-sm px-4 py-2 rounded-full bg-brand text-white hover:bg-brand-dark transition"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}

