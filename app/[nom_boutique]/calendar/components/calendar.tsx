"use client";

import { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";


dayjs.extend(customParseFormat);

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

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

  // Exemple de locations
  const locationToday = [
    {
      location: "19/09/2025",
      model: ["1"],
      chemise: "simple",
      chaussure: "Mu",
      accessoires: ["Cravate"],
    },
    {
      location: "17/09/2025",
      model: ["2", "3"],
      chemise: "noir",
      chaussure: "Mu",
      accessoires: ["ceinture"],
    },
    {
      location: "18/09/2025",
      model: ["2", "3"],
      chemise: "noir",
      chaussure: "Mu",
      accessoires: ["ceinture", "Cravate"],
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-around items-center mb-6">
        <button onClick={prevMonth} className="switch">
          <MdOutlineNavigateBefore />
        </button>
        <h2 className="text-xl font-bold">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button onClick={nextMonth} className="switch">
          <MdOutlineNavigateNext />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 text-center font-semibold">
        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((d) => (
          <div key={d} className="p-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 text-center">
        {days.map((dayItem) => {
          const isCurrentMonth = dayItem.month() === currentMonth.month();
          const isToday = dayItem.isSame(dayjs(), "day");

          // Filtrer les locations du jour
          const eventsOfDay = locationToday.filter((loc) =>
            dayItem.isSame(dayjs(loc.location, "DD/MM/YYYY"), "day")
          );
          console.log(eventsOfDay)

          return (
            <div
              key={dayItem.toString()}
              className={`border p-2 m-2 text-sm flex flex-col items-start rounded-md h-28 overflow-y-auto
                ${
                  isCurrentMonth
                    ? "border-[#06B9AE]"
                    : "border-gray-400 text-gray-400"
                }
                ${
                  isToday
                    ? "border-red-500 bg-red-50 font-bold hover:bg-red-100"
                    : ""
                }`}
            >
              {/* Numéro du jour */}
              <span className="font-semibold">{dayItem.date()}</span>

              {/* Affichage des locations */}
              <div className="flex flex-col gap-1 mt-1 w-full">
                {eventsOfDay.map((loc, i) => (
                  <div
                    key={i}
                    className="text-xs rounded px-1 py-0.5 border border-[#06B9AE] cursor-pointer"
                  >
                    Mod: <span className="text-[#06B9AE]"> {loc.model.join(", ")}</span>  
                    <br />
                    Chem: <span className="text-[#06B9AE]">{loc.chemise}  </span>
                    <br />
                    Chaus: <span className="text-[#06B9AE]"> {loc.chaussure}</span>
                    <br />
                    Acc: <span className="text-[#06B9AE]" >{loc.accessoires.join(", ")}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
