"use client";
import { useState } from "react";
import Button from "@/components/Button";

export default function Home() {
  const [name, setName] = useState("");
  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <h1> hello : {name} !</h1>
      <Button onClick={() => setName("")} label="Clear" />
    </div>
  );
}
