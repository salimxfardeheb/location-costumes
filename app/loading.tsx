"use client";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-white to-[#06B9AE] text-[#06B9AE]">
      <motion.div
        className="w-16 h-16 border-4 border-t-transparent border-[#06B9AE] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <motion.p
        className="mt-6 text-lg font-medium text-gray-300"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Chargement en cours...
      </motion.p>
    </div>
  );
}
