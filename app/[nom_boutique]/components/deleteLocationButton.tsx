"use client";

import { deleteLocation } from "@/app/firebase/deleteLocation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FiTrash2, FiAlertTriangle } from "react-icons/fi";

interface deleteLocationProps {
  nom_boutique: string;
  idLocation: string;
}

const DeleteLocationButton: React.FC<deleteLocationProps> = ({
  idLocation,
  nom_boutique,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteLocation(idLocation);
      router.push(`/${nom_boutique}/dashboard`);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-md hover:shadow-lg active:scale-95"
      >
        <FiTrash2 className="text-lg" />
        <span className="font-semibold">Supprimer</span>
      </button>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4 duration-100">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <FiAlertTriangle className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Confirmer la suppression
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cette location ? Cette
              action est irréversible.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all font-semibold disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteLocationButton;