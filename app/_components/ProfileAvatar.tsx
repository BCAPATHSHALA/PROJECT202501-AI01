"use client";
import { auth } from "@/configs/firebaseConfig";
import { signOut } from "firebase/auth";
import React from "react";
import { useAuthContext } from "../provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

function ProfileAvatar() {
  // Utilize the user state globally
  const { user } = useAuthContext();
  const router = useRouter();

  const onButtonPress = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast({
          title: "Signout Successful",
          description: "You have been signed out successfully.",
        });
        router.replace("/");
      })
      .catch((error) => {
        // An error happened
      });
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger>
          {user?.photoURL && (
            <Image
              src={user?.photoURL}
              width={40}
              height={40}
              alt="profile"
              className="w-[35px] h-[35px] rounded-full"
            />
          )}
        </PopoverTrigger>
        <PopoverContent className="mx-w-sm p-2 mr-2">
          <p className="text-slate-200 text-sm">{user?.email}</p>
          <Button onClick={onButtonPress} className="w-full  mt-2">
            Logout
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ProfileAvatar;
