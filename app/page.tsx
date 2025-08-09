export default function Home() {
  return (
    <>
      <div className="bg-[#06B9AE] p-8 md:p-14 flex flex-col items-center gap-y-8 rounded-lg shadow-2xl">
        <p className="text-4xl font-black text-white">Connexion</p>
        <form className="flex flex-col gap-4">
          <div>
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
            <button>Se connecter</button>
          </div>
        </form>
      </div>
    </>
  );
}
