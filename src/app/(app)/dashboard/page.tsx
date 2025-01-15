"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";



function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* <Navbar /> */}
      <main className="flex-1 flex justify-center items-center p-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome to the Dashboard
          </h1>
          <p className="text-center text-gray-600">
            Use the navigation bar to explore the app.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
