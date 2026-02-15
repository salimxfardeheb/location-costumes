"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";
import Link from "next/link";

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void 
}) {
  useEffect(() => {
    console.error("Erreur globale capturée :", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-4">
          <motion.div
            className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 sm:p-12 max-w-md w-full text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Icon */}
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            >
              <FiAlertTriangle className="text-red-600 text-4xl" />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl font-bold text-gray-800 mb-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Oups ! Une erreur est survenue
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Quelque chose s'est mal passé. Veuillez réessayer ou retourner à l'accueil.
            </motion.p>

            {/* Error details (optional) */}
            {error.message && (
              <motion.div
                className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <p className="text-xs font-mono text-red-700 break-words">
                  {error.message}
                </p>
              </motion.div>
            )}

            {/* Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <button
                onClick={reset}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#000c79] to-[#000a35] text-white rounded-xl hover:from-[#000a35] hover:to-[#000c79] transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                <FiRefreshCw className="text-lg" />
                Réessayer
              </button>
            </motion.div>
          </motion.div>
        </div>
      </body>
    </html>
  );
}