// import React from "react";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// import { app } from "../firebase";

// export default function OAuth({ setError }) {
//   const handleGoogleClick = async () => {
//     try {
//       setError(null); // ✅ Reset sign-up or sign-in error when clicking Google

//       const provider = new GoogleAuthProvider();
//       const auth = getAuth(app);
//       const result = await signInWithPopup(auth, provider);
//       console.log(result);

//     } catch (error) {
//       console.log("Could not sign in with Google!", error);

//       // ✅ Handle Google sign-in error messages
//       if (error.code === "auth/popup-closed-by-user") {
//         setError("Google sign-in was canceled.");
//       } else {
//         setError("Failed to sign in with Google.");
//       }
//     }
//   };

//   return (
//     <button
//       onClick={handleGoogleClick}
//       className="w-full mt-4 py-3 text-lg sm:text-xl font-semibold text-white bg-red-600 rounded-full shadow-[1px_1px_3px_#991B1B,2px_2px_5px_#B91C1C] transition duration-300 hover:bg-red-700 hover:shadow-[1px_1px_3px_#B91C1C,-1px_-1px_3px_#991B1B] active:bg-red-800 active:shadow-[inset_1px_1px_4px_#F87171,inset_-2px_-2px_4px_#FECACA]"
//     >
//       Continue With Google
//     </button>
//   );
// }

import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";

export default function OAuth({ setError }) {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleGoogleClick = async () => {
    try {
      setError(null); // ✅ Reset sign-up or sign-in error when clicking Google

      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      console.log("Google Sign-In Successful:", result);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json()
      dispatch(signInSuccess(data));

      // ✅ Extract user info if needed
      const user = result.user;
      console.log("User Info:", user);

      // ✅ Redirect after successful login
      navigate("/"); // Change "/" to any route where you want to redirect the user
    } catch (error) {
      console.log("Could not sign in with Google!", error);

      // ✅ Handle Google sign-in error messages
      if (error.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was canceled.");
      } else {
        setError("Failed to sign in with Google.");
      }
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      className="w-full mt-4 py-3 text-lg sm:text-xl font-semibold text-white bg-red-600 rounded-full shadow-[1px_1px_3px_#991B1B,2px_2px_5px_#B91C1C] transition duration-300 hover:bg-red-700 hover:shadow-[1px_1px_3px_#B91C1C,-1px_-1px_3px_#991B1B] active:bg-red-800 active:shadow-[inset_1px_1px_4px_#F87171,inset_-2px_-2px_4px_#FECACA]"
    >
      Continue With Google
    </button>
  );
}
