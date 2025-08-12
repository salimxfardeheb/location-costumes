import { signOut } from "next-auth/react";
import React from "react";

const Logout = () => {
  return (
    <div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default Logout;
