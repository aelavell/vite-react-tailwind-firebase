import React from "react";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

interface SignInProps {
  user: any;
}

const SignIn: React.FC<SignInProps> = ({user}) => {
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
      {!user ? 
        <button onClick={handleSignIn}>Sign in with Google</button> :
        <button onClick={handleSignOut}>Sign out</button>
      }
    </div>
  );
};

export default SignIn;
