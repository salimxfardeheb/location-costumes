import React from "react";

const page = () => {
  return (
    <div>
      <div className="bg-[#06B9AE] p-8 md:p-x-14 flex flex-col items-center gap-y-8 rounded-lg shadow-2xl md:w-1/2">
        <p className="text-4xl font-black text-white">Connexion</p>
        <form className="space-y-6 flex flex-col items-center w-full">
          <div className="flex flex-col gap-10 w-full">
            <input
              type="text"
              placeholder="Nom de la boutique"
              className="login"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              className="login"
            />
          </div>
          <div>
            <button className="bg-[#F39C12] md:px-14 px-7 py-1 rounded-md text-white font-bold hover:opacity-90 cursor-pointer">
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
