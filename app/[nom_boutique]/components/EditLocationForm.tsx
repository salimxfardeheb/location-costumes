"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiSave,
  FiUser,
  FiPhone,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiPlus,
  FiTrash2,
  FiX,
  FiEdit,
  FiCheckCircle,
} from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { TbHanger } from "react-icons/tb";
import { RiShirtLine } from "react-icons/ri";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { IoIosBowtie } from "react-icons/io";

import {
  LocationItem,
  Costume,
  Chemise,
  Chaussure,
  Accessoire,
  Client,
  categories,
} from "@/app/functions";
import { get_all_category_cloth } from "@/app/firebase/getCategoryCloth";

interface AvailableModels {
  costumes: { model: string }[];
  chemises: { model: string }[];
  chaussures: { model: string }[];
  accessoires: { model: string }[];
}

interface LocationProps {
  initialData: LocationItem;
  locationId: string;
  nomBoutique: string;
}

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const SectionCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({
  icon,
  iconBg,
  title,
  action,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-3">
      <div className={`${iconBg} p-2.5 rounded-xl`}>{icon}</div>
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
    {action}
  </div>
);

const EditLocationForm: React.FC<LocationProps> = ({ initialData, locationId, nomBoutique }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editDate, setEditDate] = useState(false);

  const [availableModels, setAvailableModels] = useState<AvailableModels>({
    costumes: [],
    chemises: [],
    chaussures: [],
    accessoires: [],
  });

  const [clientData, setClientData] = useState<Client>({
    name: initialData.client?.name || "",
    phone: initialData.client?.phone || "",
    vers: initialData.client?.vers || 0,
    rest: initialData.client?.rest || 0,
    comment: initialData.client?.comment || "",
  });

  const [prixTotal, setPrixTotal] = useState<number>(initialData.total || 0);

  const [location_date, setDateSortie] = useState<string>(
    initialData.location_date instanceof Date
      ? initialData.location_date.toISOString().split("T")[0]
      : initialData.location_date || "",
  );

  const [costumes, setCostumes] = useState<Costume[]>(
    initialData.costumes?.length
      ? initialData.costumes
      : [{ ref: "", model: "", blazer: "", pant: "" }],
  );

  const [chemise, setChemise] = useState<Chemise | null>(initialData.chemise || null);
  const [chaussure, setChaussure] = useState<Chaussure | null>(initialData.chaussure || null);
  const [accessories, setAccessories] = useState<Accessoire[]>(initialData.accessories || []);

  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const [costumesData, chemisesData, chaussuresData, accessoiresData] = await Promise.all([
          get_all_category_cloth(categories[0]),
          get_all_category_cloth(categories[1]),
          get_all_category_cloth(categories[2]),
          get_all_category_cloth(categories[3]),
        ]);
        const sortByModel = (a: { model: string }, b: { model: string }) =>
          a.model.toLowerCase().localeCompare(b.model.toLowerCase());
        setAvailableModels({
          costumes: costumesData.sort(sortByModel),
          chemises: chemisesData.sort(sortByModel),
          chaussures: chaussuresData.sort(sortByModel),
          accessoires: [...new Map(accessoiresData.map((a) => [a.model, a])).values()].sort(sortByModel),
        });
      } catch (err) {
        console.error("Erreur lors du chargement des modèles:", err);
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModels();
  }, []);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientData((prev) => ({
      ...prev,
      [name]: name === "vers" || name === "rest" ? Number(value) : value,
    }));
  };

  const handleCostumeChange = (index: number, field: keyof Costume, value: string) => {
    const updated = [...costumes];
    updated[index] = { ...updated[index], [field]: value };
    setCostumes(updated);
  };

  const addCostume = () => setCostumes([...costumes, { ref: "", model: "", blazer: "", pant: "" }]);
  const removeCostume = (index: number) => setCostumes((prev) => prev.filter((_, i) => i !== index));

  const addChemise = () => setChemise({ ref: null, model: "", size: "" });
  const removeChemise = () => setChemise(null);
  const handleChemiseChange = (field: keyof Chemise, value: string) =>
    setChemise((prev) => (prev ? { ...prev, [field]: value } : null));

  const addChaussure = () => setChaussure({ ref: null, model: "", size: "" });
  const removeChaussure = () => setChaussure(null);
  const handleChaussureChange = (field: keyof Chaussure, value: string) =>
    setChaussure((prev) => (prev ? { ...prev, [field]: value } : null));

  const toggleAccessory = (model: string, checked: boolean) => {
    setAccessories((prev) =>
      checked
        ? [...prev, { ref: null, model, description: "" }]
        : prev.filter((a) => a.model !== model),
    );
  };

  const removeAccessory = (model: string) =>
    setAccessories((prev) => prev.filter((a) => a.model !== model));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const updatedRest = clientData.vers < prixTotal ? prixTotal - clientData.vers : 0;
      const payload = {
        locationId,
        location_date: new Date(location_date),
        costume: costumes,
        chemise,
        chaussure,
        accessoire: accessories,
        client: { ...clientData, rest: updatedRest },
        total: prixTotal,
      };
      const res = await fetch(`/api/editLocation`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur API");
      setShowSuccessMessage(true);
      setTimeout(() => router.push(`/${nomBoutique}/dashboard/${locationId}`), 1500);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#000c79]/30 focus:border-[#000c79] transition-all outline-none text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed";

  const selectClass =
    "w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#000c79]/30 focus:border-[#000c79] transition-all outline-none text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed";

  const reste = clientData.vers < prixTotal ? prixTotal - clientData.vers : 0;

  const formatDate = (d: any) => {
    if (!d) return "—";
    if (typeof d === "object" && "seconds" in d)
      return new Date((d as any).seconds * 1000).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    if (d instanceof Date)
      return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
    return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Link
            href={`/${nomBoutique}/dashboard/${locationId}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm text-sm font-semibold active:scale-95"
          >
            <FiArrowLeft />
            Retour
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Modifier la location</h1>
        </div>

        {/* Alerts */}
        {showSuccessMessage && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
            <FiCheckCircle className="shrink-0 text-lg" />
            Modifications enregistrées avec succès !
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            <FiX className="shrink-0 text-lg" />
            {error}
          </div>
        )}
        {loadingModels && (
          <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-600 rounded-xl text-sm">
            <Spinner />
            Chargement des modèles disponibles...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Client ── */}
          <SectionCard>
            <SectionHeader
              icon={<FiUser className="text-[#000c79] text-lg" />}
              iconBg="bg-[#000c79]/10"
              title="Informations Client"
            />

            {/* Date de sortie */}
            <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {!editDate ? (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#000c79]/10 p-2 rounded-lg">
                      <FiCalendar className="text-[#000c79]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Date de sortie</p>
                      <p className="text-base font-bold text-gray-800 mt-0.5">{formatDate(initialData?.location_date)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditDate(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[#000c79] text-[#000c79] rounded-xl text-sm font-semibold hover:bg-[#000c79] hover:text-white transition-all active:scale-95"
                  >
                    <FiEdit className="text-sm" />
                    Modifier
                  </button>
                </div>
              ) : (
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      Nouvelle date
                    </label>
                    <input
                      type="date"
                      value={location_date}
                      onChange={(e) => setDateSortie(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditDate(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all active:scale-95"
                  >
                    <FiX />
                    Annuler
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FieldGroup label="Nom du client" icon={<FiUser />}>
                <input type="text" name="name" value={clientData.name} onChange={handleClientChange} className={inputClass} placeholder="Entrez le nom" required />
              </FieldGroup>

              <FieldGroup label="Téléphone" icon={<FiPhone />}>
                <input type="tel" name="phone" value={clientData.phone} onChange={handleClientChange} className={inputClass} placeholder="0555 00 00 00" required />
              </FieldGroup>

              <FieldGroup label="Prix total (DA)" icon={<FiDollarSign />}>
                <input type="number" value={prixTotal} onChange={(e) => setPrixTotal(parseFloat(e.target.value) || 0)} className={inputClass} placeholder="0" min="0" required />
              </FieldGroup>

              <FieldGroup label="Versement (DA)" icon={<FiDollarSign />}>
                <input type="number" name="vers" value={clientData.vers} onChange={handleClientChange} className={inputClass} placeholder="0" min="0" required />
              </FieldGroup>

              <FieldGroup label="Reste à payer (DA)" icon={<FiDollarSign />}>
                <input
                  type="number"
                  readOnly
                  value={reste}
                  className={`${inputClass} ${reste > 0 ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-green-50 border-green-200 text-green-700"} font-semibold cursor-not-allowed`}
                />
              </FieldGroup>

              <div className="md:col-span-2">
                <FieldGroup label="Commentaire" icon={<FiFileText />}>
                  <textarea name="comment" value={clientData.comment} onChange={handleClientChange} className={inputClass} placeholder="Notes ou commentaires..." rows={3} />
                </FieldGroup>
              </div>
            </div>
          </SectionCard>

          {/* ── Costumes ── */}
          <SectionCard>
            <SectionHeader
              icon={<TbHanger className="text-[#000c79] text-lg" />}
              iconBg="bg-[#000c79]/10"
              title="Costumes"
              action={
                <button type="button" onClick={addCostume} className="inline-flex items-center gap-2 px-4 py-2 bg-[#000c79] text-white rounded-xl text-sm font-semibold hover:bg-[#000a60] transition-all active:scale-95">
                  <FiPlus />
                  Ajouter
                </button>
              }
            />
            {costumes.length === 0 ? (
              <EmptyState label="Aucun costume ajouté" />
            ) : (
              <div className="space-y-3">
                {costumes.map((costume, index) => (
                  <div key={index} className="flex items-end gap-3 p-4 bg-blue-50/60 rounded-xl border border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Modèle</label>
                        <select value={costume.model} onChange={(e) => handleCostumeChange(index, "model", e.target.value)} className={selectClass} disabled={loadingModels}>
                          <option value="">Sélectionner</option>
                          {availableModels.costumes.map((m) => <option key={m.model} value={m.model}>{m.model}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Taille Blazer</label>
                        <input type="text" value={costume.blazer} onChange={(e) => handleCostumeChange(index, "blazer", e.target.value)} className={inputClass} placeholder="Ex: 48" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Taille Pantalon</label>
                        <input type="text" value={costume.pant} onChange={(e) => handleCostumeChange(index, "pant", e.target.value)} className={inputClass} placeholder="Ex: 44" />
                      </div>
                    </div>
                    <button type="button" onClick={() => removeCostume(index)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                      <MdOutlineCancel className="text-xl" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* ── Chemise ── */}
          <SectionCard>
            <SectionHeader
              icon={<RiShirtLine className="text-purple-600 text-lg" />}
              iconBg="bg-purple-100"
              title="Chemise"
              action={
                !chemise ? (
                  <button type="button" onClick={addChemise} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-all active:scale-95">
                    <FiPlus />
                    Ajouter
                  </button>
                ) : (
                  <button type="button" onClick={removeChemise} className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all active:scale-95">
                    <FiTrash2 />
                    Supprimer
                  </button>
                )
              }
            />
            {chemise ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Modèle</label>
                  <select value={chemise.model} onChange={(e) => handleChemiseChange("model", e.target.value)} className={selectClass} disabled={loadingModels}>
                    <option value="">Sélectionner</option>
                    {availableModels.chemises.map((m) => <option key={m.model} value={m.model}>{m.model}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Taille</label>
                  <input type="text" value={chemise.size} onChange={(e) => handleChemiseChange("size", e.target.value)} className={inputClass} placeholder="Ex: S, M, L, XL" />
                </div>
              </div>
            ) : (
              <EmptyState label="Aucune chemise ajoutée" />
            )}
          </SectionCard>

          {/* ── Chaussures ── */}
          <SectionCard>
            <SectionHeader
              icon={<LiaShoePrintsSolid className="text-amber-600 text-lg" />}
              iconBg="bg-amber-100"
              title="Chaussures"
              action={
                !chaussure ? (
                  <button type="button" onClick={addChaussure} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-all active:scale-95">
                    <FiPlus />
                    Ajouter
                  </button>
                ) : (
                  <button type="button" onClick={removeChaussure} className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all active:scale-95">
                    <FiTrash2 />
                    Supprimer
                  </button>
                )
              }
            />
            {chaussure ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Modèle</label>
                  <select value={chaussure.model} onChange={(e) => handleChaussureChange("model", e.target.value)} className={selectClass} disabled={loadingModels}>
                    <option value="">Sélectionner</option>
                    {availableModels.chaussures.map((m) => <option key={m.model} value={m.model}>{m.model}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Pointure</label>
                  <input type="text" value={chaussure.size} onChange={(e) => handleChaussureChange("size", e.target.value)} className={inputClass} placeholder="Ex: 40, 41, 42" />
                </div>
              </div>
            ) : (
              <EmptyState label="Aucune chaussure ajoutée" />
            )}
          </SectionCard>

          {/* ── Accessoires ── */}
          <SectionCard>
            <SectionHeader
              icon={<IoIosBowtie className="text-pink-600 text-lg" />}
              iconBg="bg-pink-100"
              title="Accessoires"
            />

            {loadingModels ? (
              <div className="flex items-center gap-2 text-blue-600 text-sm py-4">
                <Spinner />
                Chargement des accessoires...
              </div>
            ) : availableModels.accessoires.length === 0 ? (
              <EmptyState label="Aucun accessoire disponible" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {availableModels.accessoires.map((acc) => {
                  const isChecked = accessories.some((a) => a.model === acc.model);
                  return (
                    <label
                      key={acc.model}
                      className={`flex items-center gap-2.5 p-3 border-2 rounded-xl cursor-pointer transition-all text-sm ${
                        isChecked
                          ? "border-[#000c79] bg-[#000c79]/5 text-[#000c79] font-semibold"
                          : "border-gray-200 hover:border-gray-300 text-gray-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => toggleAccessory(acc.model, e.target.checked)}
                        className="w-4 h-4 rounded accent-[#000c79]"
                      />
                      {acc.model}
                    </label>
                  );
                })}
              </div>
            )}

            {accessories.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sélectionnés</p>
                <div className="flex flex-wrap gap-2">
                  {accessories.map((acc) => (
                    <span key={acc.model} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#000c79]/10 text-[#000c79] rounded-full text-xs font-semibold">
                      {acc.model}
                      <button type="button" onClick={() => removeAccessory(acc.model)} className="hover:text-red-500 transition-colors">
                        <FiX className="text-xs" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          {/* ── Actions ── */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pb-6">
            <Link
              href={`/${nomBoutique}/dashboard/${locationId}`}
              className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm text-center active:scale-95"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-[#000c79] text-white rounded-xl hover:bg-[#000a60] transition-all shadow-md active:scale-95 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner />
                  Enregistrement...
                </>
              ) : (
                <>
                  <FiSave />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function FieldGroup({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <p className="text-gray-400 text-sm text-center py-8 italic">{label}</p>
  );
}

export default EditLocationForm;