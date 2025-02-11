import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from "../firebase";

export default function OAuth() {
  const handleGoogleClick = async () => {
    try{
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        const result = await signInWithPopup(auth,provider);
        console.log(result);

    }catch(error)
        {
            console.log('cound not sign with google !',error);
        }
    };
  return (
    <button
      onClick={handleGoogleClick}
      className="w-full py-3  text-lg sm:text-xl font-semibold text-white bg-red-600 rounded-full shadow-[1px_1px_3px_#991B1B,2px_2px_5px_#B91C1C] transition duration-300 hover:bg-red-700 hover:shadow-[1px_1px_3px_#B91C1C,-1px_-1px_3px_#991B1B] active:bg-red-800 active:shadow-[inset_1px_1px_4px_#F87171,inset_-2px_-2px_4px_#FECACA]"
    >
      Continue With Google
    </button>
  );
}


