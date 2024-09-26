import React, { useState } from "react";

const App: React.FC = () => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [ttl, setTtl] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [retrievedValue, setRetrievedValue] = useState<string | null>(null);
  const [stackItem, setStackItem] = useState("");
  const [stackMessage, setStackMessage] = useState<string | null>(null);
  const [retrievedStackItem, setRetrievedStackItem] = useState<string | null>(
    null
  );

  const apiUrl = "http://localhost:5001";

  const resetMessages = () => {
    setMessage(null);
    setStackMessage(null);
    setRetrievedStackItem(null);
    setRetrievedValue(null);
  };

  const handleAddKey = async () => {
    resetMessages();
    try {
      if (!key) {
        setMessage("Error: Key is required");
        return;
      }
      const response = await fetch(`${apiUrl}/storeManager`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          value,
          ttl: ttl ? parseInt(ttl) : undefined,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.message}`);
      } else {
        setMessage(`Error: ${data.error || "An error occurred"}`);
      }
    } catch (err) {
      setMessage("Error: Something went wrong. Please try again.");
    }
  };

  const handleGetKey = async () => {
    resetMessages();
    try {
      if (!key) {
        setMessage("Error: Key is required");
        return;
      }
      const response = await fetch(`${apiUrl}/storeManager/${key}`);
      const data = await response.json();
      if (response.ok) {
        setRetrievedValue(data.value);
        setMessage(null);
      } else {
        setMessage("Error: Key not found");
        setRetrievedValue(null);
      }
    } catch (err) {
      setMessage("Error: Something went wrong. Please try again.");
    }
  };

  const handleDeleteKey = async () => {
    resetMessages();
    try {
      if (!key) {
        setMessage("Error: Key is required");
        return;
      }
      const response = await fetch(`${apiUrl}/storeManager/${key}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(`Success: ${data.message}`);
        setRetrievedValue(null);
      } else {
        setMessage("Error: Key not found");
      }
    } catch (err) {
      setMessage("Error: Something went wrong. Please try again.");
    }
  };

  const handleAddStackItem = async () => {
    resetMessages();
    try {
      if (!stackItem) {
        setStackMessage("Error: Stack item is required");
        return;
      }

      const response = await fetch(`${apiUrl}/stackManager`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: stackItem }),
      });
      const data = await response.json();
      if (response.ok) {
        setStackMessage(`Success: ${data.message}`);
      } else {
        setStackMessage(`Error: ${data.error || "An error occurred"}`);
      }
    } catch (err) {
      setStackMessage("Error: Something went wrong. Please try again.");
    }
  };

  const handleGetStackItem = async () => {
    resetMessages();
    try {
      const response = await fetch(`${apiUrl}/stackManager`);
      const data = await response.json();
      if (response.ok) {
        setRetrievedStackItem(data.item);
        setStackMessage(null);
      } else {
        setStackMessage("Error: Stack is empty");
        setRetrievedStackItem(null);
      }
    } catch (err) {
      setStackMessage("Error: Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Management Dashboard</h1>

      <div>
        <h2>Store Manager</h2>
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          type="number"
          placeholder="TTL (seconds)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />
        <button onClick={handleAddKey}>Add Key</button>
        <br />
        <button onClick={handleGetKey}>Get Value</button>
        <button onClick={handleDeleteKey}>Delete Key</button>

        {retrievedValue !== null && (
          <div>
            <h3>Retrieved Value: {retrievedValue}</h3>
          </div>
        )}
        {message && (
          <div style={{ color: message.startsWith("Error") ? "red" : "green" }}>
            <h3>{message}</h3>
          </div>
        )}
      </div>

      <hr />

      <div>
        <h2>Stack Manager</h2>
        <input
          type="text"
          placeholder="Stack Item"
          value={stackItem}
          onChange={(e) => setStackItem(e.target.value)}
        />
        <button onClick={handleAddStackItem}>Add to Stack</button>
        <br />
        <button onClick={handleGetStackItem}>Get Top Item</button>

        {retrievedStackItem !== null && (
          <div>
            <h3>Top Stack Item: {retrievedStackItem}</h3>
          </div>
        )}
        {stackMessage && (
          <div
            style={{
              color: stackMessage.startsWith("Error") ? "red" : "green",
            }}
          >
            <h3>{stackMessage}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
