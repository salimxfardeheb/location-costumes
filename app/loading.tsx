"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
      <motion.div
        className="w-16 h-16 border-4 border-t-transparent border-[#000c79] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <motion.p
        className="mt-6 text-lg font-semibold text-[#000c79]"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Chargement en cours...
      </motion.p>
    </div>
  );
}