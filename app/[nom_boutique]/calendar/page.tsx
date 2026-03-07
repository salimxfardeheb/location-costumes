"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TbHanger } from "react-icons/tb";
import { RiShirtLine } from "react-icons/ri";
import { LiaShoePrintsSolid } from "react-icons/lia";
import { IoIosBowtie } from "react-icons/io";

import { LocationItem } from "@/app/functions";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

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
        if (data.success) setLocations(data.data);
      } catch (err) {
        console.error("Erreur fetch locations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Monday-first week
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDate = startOfMonth.startOf("week").add(1, "day"); // Mon
  const endDate = endOfMonth.endOf("week").add(1, "day");

  const days: dayjs.Dayjs[] = [];
  let day = startDate.clone();
  while (day.isBefore(endDate) || day.isSame(endDate, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  const nextMonth = () => setCurrentMonth((m) => m.add(1, "month"));
  const prevMonth = () => setCurrentMonth((m) => m.subtract(1, "month"));

  const totalLocationsThisMonth = locations.filter((loc) =>
    dayjs(loc.location_date).month() === currentMonth.month() &&
    dayjs(loc.location_date).year() === currentMonth.year()
  ).length;

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight capitalize">
              {currentMonth.format("MMMM YYYY")}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {totalLocationsThisMonth} location{totalLocationsThisMonth > 1 ? "s" : ""} ce mois
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
            >
              <MdOutlineNavigateBefore className="text-xl" />
            </button>
            <button
              onClick={() => setCurrentMonth(dayjs())}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
            >
              Aujourd'hui
            </button>
            <button
              onClick={nextMonth}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 shadow-sm"
            >
              <MdOutlineNavigateNext className="text-xl" />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-gray-100">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-widest">
                <span className="hidden sm:inline">{d}</span>
                <span className="sm:hidden">{d[0]}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100">
            {days.map((dayItem) => {
              const isCurrentMonth = dayItem.month() === currentMonth.month();
              const isToday = dayItem.isSame(dayjs(), "day");
              const eventsOfDay = locations.filter((loc) =>
                dayItem.isSame(dayjs(loc.location_date), "day")
              );
              const hasEvents = eventsOfDay.length > 0;

              return (
                <div
                  key={dayItem.toString()}
                  className={`min-h-[120px] md:min-h-[150px] p-2 md:p-3 flex flex-col transition-colors
                    ${!isCurrentMonth ? "bg-gray-50/60" : "bg-white hover:bg-blue-50/20"}
                  `}
                >
                  {/* Day number */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold transition-colors
                        ${isToday
                          ? "bg-[#000c79] text-white"
                          : isCurrentMonth
                            ? "text-gray-800 hover:bg-gray-100"
                            : "text-gray-300"
                        }
                      `}
                    >
                      {dayItem.date()}
                    </span>
                    {hasEvents && isCurrentMonth && (
                      <span className="bg-[#000c79]/10 text-[#000c79] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {eventsOfDay.length}
                      </span>
                    )}
                  </div>

                  {/* Events */}
                  {loading && isCurrentMonth && (
                    <div className="flex gap-1 mt-1">
                      <div className="h-5 bg-gray-100 rounded animate-pulse flex-1" />
                    </div>
                  )}

                  <div className="flex flex-col gap-1 overflow-y-auto flex-1">
                    {eventsOfDay.map((loc) => (
                      <Link
                        href={`/${nom_boutique}/dashboard/${loc.id}`}
                        key={loc.id}
                        className="group block"
                      >
                        {/* Mobile: compact dot */}
                        <div className="md:hidden flex items-center gap-1.5 px-2 py-1 bg-[#000c79]/8 border border-[#000c79]/20 rounded-lg hover:bg-[#000c79]/15 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#000c79] shrink-0" />
                          <span className="text-[10px] font-semibold text-[#000c79] truncate">
                            {loc.client?.name || loc.costumes?.[0]?.model || "Location"}
                          </span>
                        </div>

                        {/* Desktop: detailed card */}
                        <div className="hidden md:block px-2 py-1.5 bg-[#000c79]/5 border border-[#000c79]/15 rounded-lg hover:bg-[#000c79]/10 hover:border-[#000c79]/30 transition-all">
                          {/* Client name if exists */}
                          {loc.client?.name && (
                            <p className="text-[11px] font-bold text-gray-700 mb-1 truncate">
                              {loc.client.name}
                            </p>
                          )}
                          <div className="space-y-0.5">
                            {loc.costumes?.length > 0 && (
                              <EventRow
                                icon={<TbHanger className="text-[#000c79]" />}
                                label={loc.costumes.map((c) => c.model).join(", ")}
                                detail={`B:${loc.costumes.map((c) => c.blazer).join(",")} P:${loc.costumes.map((c) => c.pant).join(",")}`}
                              />
                            )}
                            {loc.chemise && (
                              <EventRow
                                icon={<RiShirtLine className="text-purple-500" />}
                                label={loc.chemise.model}
                                detail={`T:${loc.chemise.size}`}
                              />
                            )}
                            {loc.chaussure && (
                              <EventRow
                                icon={<LiaShoePrintsSolid className="text-amber-500" />}
                                label={loc.chaussure.model}
                                detail={`P:${loc.chaussure.size}`}
                              />
                            )}
                            {loc.accessories?.length > 0 && (
                              <EventRow
                                icon={<IoIosBowtie className="text-pink-500" />}
                                label={loc.accessories.map((a) => a.model).join(", ")}
                              />
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pb-2">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#000c79] flex items-center justify-center text-white text-[10px] font-bold">7</div>
            <span>Aujourd'hui</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TbHanger className="text-[#000c79]" />
            <span>Costume</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RiShirtLine className="text-purple-500" />
            <span>Chemise</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LiaShoePrintsSolid className="text-amber-500" />
            <span>Chaussure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IoIosBowtie className="text-pink-500" />
            <span>Accessoire</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function EventRow({
  icon,
  label,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  detail?: string;
}) {
  return (
    <div className="flex items-center gap-1 min-w-0">
      <span className="shrink-0 text-[11px]">{icon}</span>
      <span className="text-[10px] font-semibold text-gray-700 truncate">{label}</span>
      {detail && (
        <span className="text-[9px] text-gray-400 shrink-0 ml-auto">{detail}</span>
      )}
    </div>
  );
}

export default Page;