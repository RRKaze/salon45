"use client";
import { redirect } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Navigation from "../components/Navigation";


export default function LoginPage({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const [state, setState] = useState({username:"", password:""});
    async function authentication(){
        const res = await fetch(`http://localhost:3001/api/auth/login?username=${state.username}&password=${state.password}`,{method:"POST"});
        
        console.log("submit clicked", JSON.stringify(state));
        console.log("response", JSON.stringify(res));
        if (res.status === 200) {
            redirect("/home");
        }
    }

    function handleUsernameChange(i:ChangeEvent<HTMLInputElement>){
        setState({ ...state, username:i.target.value});
    }

    function handlePasswordChange(i:ChangeEvent<HTMLInputElement>){
        setState({ ...state, password:i.target.value});
    }

    return (
      <div className="min-h-screen flex flex-col bg-brand-bg">
        <Navigation />

        {/* Login Form */}
        <main className="flex-1 flex items-center justify-center">
          <form className="flex flex-col w-full max-w-xs">
            <input placeholder="Username" id="username" value={state.username} onChange={handleUsernameChange} className="border border-slate-500 py-2 rounded-full color-white active:outline-white-0 mb-10 placeholder:pl-3 text-sm text-gray-700 hover:text-brand" />
            <input placeholder="Password" id="password" value={state.password} onChange={handlePasswordChange} className="border border-slate-500 py-2 rounded-full color-white active:outline-white-0 mb-10 placeholder:pl-3 text-sm text-gray-700 hover:text-brand" />
            <button onClick={(x) => {x.preventDefault(); authentication();}} className="text-sm px-4 py-2 rounded-full bg-brand text-white hover:bg-brand-dark transition">
              Submit
            </button>
          </form>
        </main>
      </div>
    );
  }

