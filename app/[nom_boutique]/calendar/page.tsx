"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiCalendar } from "react-icons/fi";

type Costume = {
  ref: string;
  model: string;
  blazer: string;
  pant: string;
  image?: string;
};

type Chemise = {
  ref: string;
  model: string;
  size: string;
  image?: string;
};

type Chaussure = {
  ref: string;
  model: string;
  size: string;
  image?: string;
};

type Accessoire = {
  ref: string;
  model: string;
  image?: string;
};

type LocationItem = {
  id: string;
  date_sortie: string;
  costumes: Costume[];
  chemise: Chemise | null;
  chaussure: Chaussure | null;
  accessories: Accessoire[];
};

const Page = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { nom_boutique } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/calendar");
        const data = await res.json();
        if (data.success) {
          setLocations(data.data);
        }
      } catch (err) {
        console.error("Erreur fetch locations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const days: dayjs.Dayjs[] = [];
  let day = startDate.clone();
  while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));
  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-[#000c79] via-[#000a35] to-[#000c79]">
            <div className="flex justify-between items-center">
              <button
                onClick={prevMonth}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl transition-all active:scale-95"
              >
                <MdOutlineNavigateBefore className="text-white text-2xl" />
              </button>

              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                  <FiCalendar className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-white capitalize">
                  {currentMonth.format("MMMM YYYY")}
                </h2>
              </div>

              <button
                onClick={nextMonth}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl transition-all active:scale-95"
              >
                <MdOutlineNavigateNext className="text-white text-2xl" />
              </button>
            </div>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((d) => (
              <div
                key={d}
                className="p-4 text-center font-semibold text-sm text-gray-600 uppercase tracking-wide"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 p-px">
            {days.map((dayItem) => {
              const isCurrentMonth = dayItem.month() === currentMonth.month();
              const isToday = dayItem.isSame(dayjs(), "day");

              const eventsOfDay = locations.filter((loc) =>
                dayItem.isSame(dayjs(loc.date_sortie), "day")
              );

              return (
                <div
                  key={dayItem.toString()}
                  className={`bg-white min-h-[140px] p-3 flex flex-col transition-all duration-200
                    ${!isCurrentMonth ? "opacity-40" : "hover:shadow-lg"}
                    ${isToday ? "ring-2 ring-orange-400 ring-inset" : ""}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-sm font-semibold
                        ${isToday ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-2 py-1 rounded-full" : "text-gray-700"}
                      `}
                    >
                      {dayItem.date()}
                    </span>
                    {eventsOfDay.length > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                        {eventsOfDay.length}
                      </span>
                    )}
                  </div>

                  {loading && (
                    <span className="text-xs text-gray-400">Chargement...</span>
                  )}

                  <div className="flex flex-col gap-1 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {eventsOfDay.map((loc) => (
                      <Link
                        href={`/${nom_boutique}/dashboard/${loc.id}`}
                        key={loc.id}
                        className="group bg-gradient-to-r from-blue-50 to-transparent border border-blue-700/30 rounded-lg px-2 py-1.5 hover:border-blue-700 hover:shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <div className="text-xs space-y-0.5">
                          {loc.costumes.length > 0 && (
                            <div className="flex flex-wrap gap-1 items-center">
                              <span className="font-semibold text-gray-600">Costume:</span>
                              <span className="text-blue-700 font-medium">
                                {loc.costumes.map((c) => c.model).join(", ")}
                              </span>
                              <span className="text-gray-500 text-[10px]">
                                B: {loc.costumes.map((c) => c.blazer).join(", ")} |
                                P: {loc.costumes.map((c) => c.pant).join(", ")}
                              </span>
                            </div>
                          )}
                          {loc.chemise && (
                            <div className="flex gap-1 items-center">
                              <span className="font-semibold text-gray-600">Chemise:</span>
                              <span className="text-blue-700 font-medium">
                                {loc.chemise.model}
                              </span>
                              <span className="text-gray-500 text-[10px]">
                                (T: {loc.chemise.size})
                              </span>
                            </div>
                          )}
                          {loc.chaussure && (
                            <div className="flex gap-1 items-center">
                              <span className="font-semibold text-gray-600">Chaussure:</span>
                              <span className="text-blue-700 font-medium">
                                {loc.chaussure.model}
                              </span>
                              <span className="text-gray-500 text-[10px]">
                                (T: {loc.chaussure.size})
                              </span>
                            </div>
                          )}
                          {loc.accessories.length > 0 && (
                            <div className="flex gap-1 items-center">
                              <span className="font-semibold text-gray-600">Acc:</span>
                              <span className="text-blue-700 font-medium">
                                {loc.accessories.map((a) => a.model).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;