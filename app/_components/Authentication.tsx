"use client";
import { auth } from "@/configs/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import React from "react";

function Authentication({ children }: any) {
  const provider = new GoogleAuthProvider();

  const onButtonPress = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential: any = GoogleAuthProvider.credentialFromResult(result);
        // console.log("FIREBASE1: ", credential);
        const token = credential.accessToken;
        // console.log("FIREBASE2: ", token);

        // The signed-in user info
        const user = result.user;
        // console.log("FIREBASE3: ", user);

        if (user) {
          saveUserInfoToDB({
            userEmail: user.email as string,
            userName: user.displayName as string,
            userAvatar: user.photoURL as string,
          });
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  // Use API to Save user info to database from firebase data
  const saveUserInfoToDB = async ({
    userEmail,
    userName,
    userAvatar,
  }: {
    userEmail: string;
    userName: string;
    userAvatar: string;
  }) => {
    const result = await axios.post("/api/user", {
      userEmail,
      userName,
      userAvatar,
    });
    // console.log("Result: ", result.data);
  };

  return (
    <div>
      <div onClick={onButtonPress}>{children}</div>
    </div>
  );
}

export default Authentication;
