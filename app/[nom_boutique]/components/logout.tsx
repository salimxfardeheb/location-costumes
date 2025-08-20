import { signOut } from "next-auth/react";
import { LuLogOut } from "react-icons/lu";
import React from "react";

interface LogoutProps {
  text?: boolean;
  icon?: React.ReactNode;
}

const Logout: React.FC<LogoutProps> = ({ text = true, icon= true }) => {
  return (
    <div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-4 px-4 py-2 bg-red-500 text-white hover:bg-red-600 hover:opacity-95 flex items-center gap-2 opacity-70 cursor-pointer min-w-full"
      >
        {icon && <span><LuLogOut/></span>}
        {text && <span>Se déconnecter</span>}
      </button>
    </div>
  );
};

export default Logout;
