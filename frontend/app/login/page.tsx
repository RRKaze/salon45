"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Navigation from "../components/Navigation";
import InputField from "../components/InputField";
import SubmitButton from "../components/SubmitButton";
import Background from "../components/Background";


export default function LoginPage({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const router = useRouter();
    const [state, setState] = useState({username:"", password:""});
    const [errorMessage, setErrorMessage] = useState("");
    
    async function authentication(){
        const res = await fetch(`http://localhost:3001/api/auth/login?username=${state.username}&password=${state.password}`,{method:"POST"});
        
        console.log("submit clicked", JSON.stringify(state));
        console.log("response", JSON.stringify(res));
        if (res.status === 200) {
            router.push("/home");
        } else {
            setErrorMessage("Authentication failed. Please check your username and password.");
        }
    }

    function handleUsernameChange(i:ChangeEvent<HTMLInputElement>){
        setState({ ...state, username:i.target.value});
        setErrorMessage("");
    }

    function handlePasswordChange(i:ChangeEvent<HTMLInputElement>){
        setState({ ...state, password:i.target.value});
        setErrorMessage("");
    }

    return (
      <Background>
        <Navigation />

        {/* Login Form */}
        <main className="flex-1 flex items-center justify-center">
          <form className="flex flex-col w-full max-w-xs">
            <InputField
              placeholder="Username"
              id="username"
              value={state.username}
              onChange={handleUsernameChange}
            />
            <InputField
              placeholder="Password"
              id="password"
              type="password"
              value={state.password}
              onChange={handlePasswordChange}
            />
            {errorMessage && (
              <p className="text-red-600 text-sm mb-10 pl-3">{errorMessage}</p>
            )}
            <SubmitButton onClick={(x) => {x.preventDefault(); authentication();}} />
          </form>
        </main>
      </Background>
    );
  }

