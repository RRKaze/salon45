"use client";
import { redirect } from "next/navigation";
import { ChangeEvent, useState } from "react";


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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
          <form className="flex flex-col">
              <input placeholder="Username" id="username" value={state.username} onChange={handleUsernameChange} className="border border-slate-500 color-white rounded-4xl active:outline-white-0 mb-10 placeholder:pl-3" />
              <input placeholder="Password" id="password" value={state.password} onChange={handlePasswordChange} className="border border-slate-500 color-white rounded-4xl active:outline-white-0 mb-10 placeholder:pl-3" />
            <button onClick={(x) => {x.preventDefault(); authentication();}}>
            Submit
            </button>
          </form>
          
      </div>
    );
  }

