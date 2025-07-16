"use client";

import { useClerk } from "@clerk/nextjs";

export function SignOutButton() {
  const { signOut } = useClerk();

  return (
    <button
      onClick={() => signOut()}
      className="bg-white text-black px-0 py-0"
    >
      Sign Out
    </button>
  );
}
export function ManageAccountButton() {
  const { openUserProfile } = useClerk();

  return (
    <button
      onClick={() => openUserProfile()}
      className="bg-white text-black px-0 py-0"
    >
      Profile
    </button>
  );
}
