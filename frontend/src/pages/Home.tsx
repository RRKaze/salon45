import { useState } from "react";
import Navbar from "../components/Navbar";

export default function HomePage() {
    return (
      <div>
        <Navbar />
        <div>
          <h1>Welcome to Home Page</h1>
          <p>
            Scroll down — the navbar will stay pinned to the top.
          </p>
          <div>
            {Array.from({ length: 40 }, (_, i) => (
              <p key={i}>
                Sample content line {i + 1}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }