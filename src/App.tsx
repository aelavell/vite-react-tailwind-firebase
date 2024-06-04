import React, { useEffect, useState } from "react";
import SignIn from "./SignIn";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import './App.css';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Firebase Example</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <SignIn />
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
};

export default App;
