"use client";

import { useAuthContext } from "@/app/provider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DesignCard from "./_components/DesignCard";
import { RECORD } from "@/app/view-code/[uid]/page";
import { Loader2 } from "lucide-react";

const page = () => {
  //   const { user } = useAuthContext(); // todo: get user after login
  const user = "manojkumargfg.1@gmail.com"; // for testing
  const [wireframesList, setWireframesList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    user && getAllUserWireframe();
  }, [user]);

  // Get all user wireframes using email
  const getAllUserWireframe = async () => {
    setLoading(true);
    try {
      const result = await axios.get(`/api/wireframe-to-code?email=${user}`);

      setWireframesList(result.data);
      console.log("result: ", result);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold">Wireframe & Codes</h2>

      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="animate-spin w-10 h-10" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {wireframesList?.map((wireframe: RECORD, index) => (
            <DesignCard key={index} wireframe={wireframe} />
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
