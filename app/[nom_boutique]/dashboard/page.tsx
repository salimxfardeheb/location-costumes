"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

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
