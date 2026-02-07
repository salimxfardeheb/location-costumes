"use client";

import { useState } from "react";
import { create_boutique } from "@/app/firebase/createBoutique";

export default function Page() {
  const [SHOP_NAME, SET_SHOP_NAME] = useState("");
  const [ADMIN, SET_ADMIN] = useState("");
  const [PASSWORD, SET_PASSWORD] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contentMessage, setContentMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);

  const svgStrokeProps = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 2 };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (SHOP_NAME && ADMIN && PASSWORD) {
      setIsLoading(true);
      setContentMessage("");
      setMessageType(null);

      try {
        await create_boutique(SHOP_NAME, ADMIN, PASSWORD);
        setContentMessage("Boutique créée avec succès !");
        setMessageType("success");
        SET_SHOP_NAME("");
        SET_ADMIN("");
        SET_PASSWORD("");
      } catch (error) {
        setContentMessage("Une erreur est survenue lors de la création");
        setMessageType("error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#000c79] via-[#000a35] to-[#000c79] p-4">
      <div className="relative w-full max-w-md">
        {/* Decorative blur */}
        <div className="absolute -inset-2 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 rounded-3xl blur opacity-30" />
        
        <div className="relative bg-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl blur-sm opacity-75" />
              <div className="relative bg-gradient-to-r from-teal-500 to-cyan-600 p-4 rounded-2xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path {...svgStrokeProps} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal-200 via-white to-cyan-200 bg-clip-text text-transparent">
              Créer une Boutique
            </h1>
            <p className="text-gray-300 text-sm">
              Administration du système
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Success/Error Message */}
            {contentMessage && (
              <div className={`border rounded-xl p-3 flex items-center gap-2 ${
                messageType === "success" 
                  ? "bg-green-700/20 border-green-500/80" 
                  : "bg-red-700/20 border-red-500/80"
              }`}>
                <svg className={`w-5 h-5 ${messageType === "success" ? "text-green-300" : "text-red-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {messageType === "success" ? (
                    <path {...svgStrokeProps} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path {...svgStrokeProps} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <span className={`font-medium text-sm ${messageType === "success" ? "text-green-300" : "text-red-300"}`}>
                  {contentMessage}
                </span>
              </div>
            )}

            {/* Shop Name Input */}
            <div className="space-y-2">
              <label htmlFor="SHOP_NAME" className="label">Nom de la boutique</label>
              <div className="relative">
                <div className="IconContainer">
                  <svg className="Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path {...svgStrokeProps} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Entrez le nom de la boutique"
                  id="SHOP_NAME"
                  name="SHOP_NAME"
                  className="login"
                  value={SHOP_NAME}
                  onChange={(e) => SET_SHOP_NAME(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Admin Input */}
            <div className="space-y-2">
              <label htmlFor="ADMIN" className="label">Nom de l'administrateur</label>
              <div className="relative">
                <div className="IconContainer">
                  <svg className="Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path {...svgStrokeProps} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Entrez le nom de l'admin"
                  id="ADMIN"
                  name="ADMIN"
                  className="login"
                  value={ADMIN}
                  onChange={(e) => SET_ADMIN(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="PASSWORD" className="label">Mot de passe</label>
              <div className="relative">
                <div className="IconContainer">
                  <svg className="Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path {...svgStrokeProps} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez le mot de passe"
                  id="PASSWORD"
                  name="PASSWORD"
                  className="login"
                  value={PASSWORD}
                  onChange={(e) => SET_PASSWORD(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <svg className="Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path {...svgStrokeProps} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="Icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path {...svgStrokeProps} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path {...svgStrokeProps} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path {...svgStrokeProps} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Créer la boutique</span>
                  </>
                )}
              </span>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Panneau d'administration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}