"use client";

import { useAuth } from "@clerk/nextjs";

export default function DebugToken() {
  const { getToken } = useAuth();

  async function showToken() {
    const token = await getToken();
    console.log("TOKEN:", token);
  }

  return <button onClick={showToken}>Get Token</button>;
}
