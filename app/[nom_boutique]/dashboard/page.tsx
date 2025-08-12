"use client";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Logout from "../components/logout";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Chargement...</p>;
  if (!session) {
    redirect("/");
  }

  return (
    <div>
    </div>
  );
}
