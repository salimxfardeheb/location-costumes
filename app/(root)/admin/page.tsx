"use client";

import {  useState } from "react";
import { create_boutique } from "@/app/actions/firebase/createBoutique"

export default function page() {
  const [SHOP_NAME, SET_SHOP_NAME] = useState("");
  const [ADMIN, SET_ADMIN] = useState("");
  const [PASSWORD, SET_PASSWORD] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [contentMessage, setContentMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(SHOP_NAME && ADMIN && PASSWORD) {
        await create_boutique(SHOP_NAME,ADMIN,PASSWORD)
        setContentMessage("Boutique crée avec succées !")
        SET_SHOP_NAME("")
        SET_ADMIN("")
        SET_PASSWORD("")
    }
  };
  return (
    <>
      <div className="bg-[#06B9AE] p-8 md:p-x-14 flex flex-col items-center gap-y-8 rounded-lg shadow-2xl md:w-1/2">
        <p className="text-4xl font-black text-white">Créer une Boutique</p>
        <form className="space-y-6 flex flex-col items-center w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-10 w-full">
            <input
              type="text"
              placeholder="Nom de la boutique"
              id="SHOP_NAME"
              name="SHOP_NAME"
              value={SHOP_NAME}
              onChange={(e) => SET_SHOP_NAME(e.target.value)}
              className="login"
            />
            <input
              type="text"
              placeholder="Admin"
              id="ADMIN"
              name="ADMIN"
              value={ADMIN}
              onChange={(e) => SET_ADMIN(e.target.value)}
              className="login"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              id="PASSWORD"
              name="PASSWORD"
              value={PASSWORD}
              onChange={(e) => SET_PASSWORD(e.target.value)}
              className="login"
            />
          </div>
          <div>
            <button className="bg-[#F39C12] md:px-14 px-7 py-1 rounded-md text-white font-bold hover:opacity-90 cursor-pointer">
              Inscription
            </button>
          </div>
        </form>
        <span>{contentMessage}</span>
      </div>
    </>
  );
}
