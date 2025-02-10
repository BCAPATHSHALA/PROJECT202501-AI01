"use client";
import { useAuthContext } from "@/app/provider";
import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useEffect, useState } from "react";

const page = () => {
  const getUserCredits = async () => {
    const { user } = useAuthContext();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      user && getUserCredits();
    }, [user]);

    const response = await axios.get(
      "/api/user?email=manojkumargfg.1@gmail.com"
    );
    console.log("response: ", response.data);

    setUserData(response.data);
  };
  return (
    <div>
      <h2 className="text-3xl font-bold">Credits</h2>
      <div className="p-5 mt-6 bg-slate-50 rounded-lg border flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Credits:</h2>
          <p className="text-lg text-gray-500">5 Credits Left</p>
        </div>
        <Button>Buy More Credits</Button>
      </div>
    </div>
  );
};

export default page;
