"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import Navigation from "../../components/Navigation";
import InputField from "../../components/InputField";
import SubmitButton from "../../components/SubmitButton";
import Background from "../../components/Background";
import {authService} from "@/utils/api";


export default function LoginPage() {
    const router = useRouter();
    const [state, setState] = useState({username:"", password:""});
    const [errorMessage, setErrorMessage] = useState("");
    
    async function authentication(){
      try{
        await authService.login(state.username, state.password);
        router.push("/home");
      }
      catch(e){
        setErrorMessage("Authentication failed. Please check your username and password.");
        return;
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
          <form className="flex flex-col items-center w-full max-w-xs">
            <InputField
              placeholder="Username"
              id="username"
              value={state.username}
              className="w-full"
              onChange={handleUsernameChange}
            />
            <InputField
              placeholder="Password"
              id="password"
              type="password"
              value={state.password}
              className="w-full mb-8"
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

