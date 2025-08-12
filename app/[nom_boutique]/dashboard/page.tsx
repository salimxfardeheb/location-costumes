"use client";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Chargement...</p>;
  if (!session) {
    redirect("/");
  }

  return (
    <div>
      <p>Connecté en tant que : {session.user?.name}</p>
      <p>ID : {session.user?.id}</p>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Se déconnecter
      </button>
    </div>
  );
}
