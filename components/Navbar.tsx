import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <Link href="/">Home</Link>

        <Show when="signed-in">
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profile">Profile</Link>
          </>
        </Show>
      </div>
      <div>
        <Show when="signed-out">
          <SignInButton />
        </Show>

        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </nav>
  );
}
