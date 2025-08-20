"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Erreur globale capturée :", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tr from-red-800 via-red-600 to-red-400 text-white">
      <motion.h1
        className="text-6xl font-extrabold drop-shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        ⚠️ Oups !
      </motion.h1>
      <motion.p
        className="mt-4 text-lg text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        Une erreur est survenue. <br /> Veuillez réessayer ou contacter le support.
      </motion.p>
      
    </div>
  );
}
