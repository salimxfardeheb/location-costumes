import { size } from "@/app/functions";
import { useState } from "react";
import { FiCheck } from "react-icons/fi";

type RangeState = { min: string | null; max: string | null };

interface SizePickerProps {
  label: string;
  selected: size[];
  onChange: (sizes: size[]) => void;
  availableSizes: size[];
}

const SizePicker = ({
  label,
  selected,
  onChange,
  availableSizes,
}: SizePickerProps) => {
  const [mode, setMode] = useState<"range" | "custom">("range");
  const [range, setRange] = useState<RangeState>({ min: null, max: null });

  const applyRange = () => {
    if (!range.min || !range.max) return;
    const minIdx = availableSizes.findIndex((s) => s.size === range.min);
    const maxIdx = availableSizes.findIndex((s) => s.size === range.max);
    if (minIdx === -1 || maxIdx === -1) return;
    const [start, end] = minIdx <= maxIdx ? [minIdx, maxIdx] : [maxIdx, minIdx];
    onChange(availableSizes.slice(start, end + 1));
  };

  const toggleSize = (s: size) => {
    const exists = selected.some((x) => x.size === s.size);
    onChange(
      exists ? selected.filter((x) => x.size !== s.size) : [...selected, s],
    );
  };

  const selectAll = () => onChange(availableSizes);
  const clearAll = () => onChange([]);

  const summaryText =
    selected.length === 0
      ? "Aucune taille sélectionnée"
      : selected.length === availableSizes.length
        ? "Toutes les tailles sélectionnées"
        : selected.map((s) => s.size).join(", ");

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{summaryText}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border-2 border-[#000c79] text-[#000c79] hover:opacity-80 transition-all"
          >
            Tout
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border-2 border-gray-300 text-gray-500 hover:border-gray-400 transition-all"
          >
            Effacer
          </button>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex rounded-xl bg-gray-100 p-1 mb-5 w-fit gap-1">
        <button
          type="button"
          onClick={() => setMode("range")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            mode === "range"
              ? `bg-[#000c79] text-white hover:bg-[#000a35] shadow-sm`
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Plage
        </button>
        <button
          type="button"
          onClick={() => setMode("custom")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            mode === "custom"
              ? `bg-[#000c79] text-white hover:bg-[#000a35] shadow-sm`
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Personnalisé
        </button>
      </div>

      {mode === "range" ? (
        <div className="space-y-4">
          {/* Range selectors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                De
              </label>
              <select
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-xl focus:border-[#000c79] outline-none text-base font-medium"
                value={range.min ?? ""}
                onChange={(e) =>
                  setRange((r) => ({ ...r, min: e.target.value || null }))
                }
              >
                <option value="">Choisir</option>
                {availableSizes.map((s) => (
                  <option key={s.size} value={s.size}>
                    {s.size}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                À
              </label>
              <select
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-xl focus:border-[#000c79] outline-none text-base font-medium"
                value={range.max ?? ""}
                onChange={(e) =>
                  setRange((r) => ({ ...r, max: e.target.value || null }))
                }
              >
                <option value="">Choisir</option>
                {availableSizes.map((s) => (
                  <option key={s.size} value={s.size}>
                    {s.size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={applyRange}
            disabled={!range.min || !range.max}
            className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all bg-[#000c79] hover:bg-[#000a35] text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            Appliquer la plage
          </button>

          {/* Preview */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {availableSizes.map((s) => (
                <span
                  key={s.size}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                    selected.some((x) => x.size === s.size)
                      ? "bg-blue-100 border-[#000c79] text-[#000c79]"
                      : "bg-gray-50 border-gray-200 text-gray-400"
                  }`}
                >
                  {s.size}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Custom mode */
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2.5">
          {availableSizes.map((s) => {
            const isSelected = selected.some((x) => x.size === s.size);
            return (
              <button
                key={s.size}
                type="button"
                onClick={() => toggleSize(s)}
                className={`relative flex items-center justify-center px-3 py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:scale-105 active:scale-95 ${
                  isSelected
                    ? `bg-blue-100 border-[#000c79] text-[#000c79] shadow-md`
                    : "bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700"
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <FiCheck
                      className="text-white text-[9px]"
                      strokeWidth={3}
                    />
                  </span>
                )}
                {s.size}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SizePicker;
