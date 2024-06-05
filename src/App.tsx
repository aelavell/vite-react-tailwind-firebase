import React, { useEffect, useState } from "react";
import SignIn from "./SignIn";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import './App.css';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const addMessage = async () => {
    if (user && newMessage.trim()) {
      try {
        const msg = newMessage;
        setNewMessage("");
        const docRef = await addDoc(collection(db, "messages"), {
          text: msg,
          uid: user.uid,
          createdAt: new Date()
        });
        console.log("Message added successfully, docRef:", docRef);
      } catch (error) {
        console.error("Error adding document: ", error);
      } 
    } else {
      console.log("User is not authenticated or message is empty");
    }
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesList = querySnapshot.docs.map(doc => doc.data());
      setMessages(messagesList);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addMessage();
    }
  };

  return (
    <div>
      <h1>Firebase Demo</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <SignIn />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message"
          />
          <button onClick={addMessage}>Add Message</button>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message.text}</li>
            ))}
          </ul>
        </div>
      ) : (
        <SignIn />
      )}
    </div>
  );
};

export default App;
