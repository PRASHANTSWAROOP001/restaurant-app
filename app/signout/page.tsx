// components/LogoutButton.tsx
"use client";

import { signOut, useSession } from "next-auth/react";

export default function LogoutButton() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <p>Logged in as: {session.user?.email}</p>
          <p>Role: {session.user?.role}</p>
          <p>User ID: {session.user?.id}</p>
          <button
            onClick={() => {
              console.log("Logging out user:", session);
              signOut({ callbackUrl: "/" , redirect:true}); // or any custom URL
            }}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
}
