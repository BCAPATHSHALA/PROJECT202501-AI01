"use client";
import { useAuthContext } from "@/app/provider";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface UserData {
  credits: number | 0;
}

const page = () => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    user && getUserCredits();
  }, [user]);

  const getUserCredits = async () => {
    const response = await axios.get(`/api/user?email=${user?.email}`);
    console.log("response: ", response.data);

    setUserData(response.data);
  };
  return (
    <div>
      <div className="p-5 mt-6 bg-slate-50 rounded-lg border flex justify-between items-center">
        {/* My Credits */}
        <div>
          <h2 className="text-2xl font-bold">My Credits:</h2>
          <p className="text-lg text-gray-500">
            {userData?.credits ? userData?.credits : 0} Credits Left
          </p>
        </div>
        {/* Redirect to buy more credits */}
        <Link href={"/upgrade"}>
          <Button>Buy More Credits</Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
