"use client";
import Image from "next/image";
import { ChangeEvent, useState } from "react";


export default function HomePage() {
    return (
      <section className="text-center mt-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
        <p className="text-gray-600 mb-8">
          Manage appointments, view locations, and access your user profile — all in one place.
        </p>
        <div className="mt-10">
          <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
            return to login
          </a>
        </div>
      </section>
    );
  }
  
