import { signOut } from "next-auth/react";
import { LuLogOut } from "react-icons/lu";
import React from "react";

interface LogoutProps {
  text?: boolean;
  icon?: boolean;
}

const Logout: React.FC<LogoutProps> = ({ text = true, icon = true }) => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 active:scale-95 transition-all duration-200 flex items-center justify-center gap-3 group relative overflow-hidden"
      aria-label="Se déconnecter"
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      
      {/* Content */}
      <div className="relative flex items-center gap-3">
        {icon && (
          <LuLogOut className="text-xl transition-transform duration-200 group-hover:translate-x-[-2px]" />
        )}
        {text && (
          <span className="text-sm whitespace-nowrap">Se déconnecter</span>
        )}
      </div>
    </button>
  );
};

export default Logout;