"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [shop_name, set_shop_name] = useState("");
  const [password, set_password] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await signIn("credentials", {
      nom_boutique: shop_name,
      password: password,
      redirect: false,
    });
    if (result?.error) {
      setError("Nom de boutique ou mot de passe incorrect.");
      set_shop_name("");
      set_password("");
    } else if (result?.ok) {
      router.push(`/${shop_name}/dashboard`);
    }
  }

  return (
    <>
      <div className="bg-[#06B9AE] p-8 md:p-x-14 flex flex-col items-center gap-y-8 rounded-lg shadow-2xl md:w-1/2">
        <p className="text-4xl font-black text-white">Connexion</p>
        <form
          className="space-y-6 flex flex-col items-center w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-10 w-full">
            <input
              type="text"
              placeholder="Nom de la boutique"
              className="login"
              value={shop_name}
              onChange={(e) => set_shop_name(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              className="login"
              value={password}
              onChange={(e) => set_password(e.target.value)}
            />
          </div>
          {error && <span className="text-red-500 font-semibold">{error}</span>}
          <div>
            <button
              type="submit"
              className="bg-[#F39C12] md:px-14 px-7 py-1 rounded-md text-white font-bold hover:opacity-90 cursor-pointer"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
