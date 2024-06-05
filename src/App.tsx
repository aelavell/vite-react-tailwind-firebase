import React, { useEffect, useState } from "react";
import SignIn from "./SignIn";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
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
          userId: user.uid,
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

  const deleteMessage = async (message) => {
    try {
      const messageId = message.id;
      const messageRef = doc(db, "messages", messageId);
      await deleteDoc(messageRef);
      console.log("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    const q = query(collection(db, "messages"), where("userId", "==", user?.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() 
      }));
      setMessages(messagesList);
    });
  
    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [user]); 


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
          <SignIn user={user} />
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
              <li key={index}>{message.text} <button onClick={() => deleteMessage(message)}>X</button></li>
            ))}
          </ul>
        </div>
      ) : (
        <SignIn user={user} />
      )}
    </div>
  );
};

export default App;
