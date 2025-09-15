"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  // on prend aussi les jours avant/après pour compléter les semaines
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
    <div className="p-6 max-w-11/12 mx-auto">
      {/* Header */}
      <div className="flex justify-around items-center mb-6">
        <button
          onClick={prevMonth}
          className="switch"
        >
          <MdOutlineNavigateBefore />
        </button>
        <h2 className="text-xl font-bold">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button
          onClick={nextMonth}
          className="switch"
        >
          <MdOutlineNavigateNext/>
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 text-center font-semibold space-x-6">
        {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((d) => (
          <div key={d} className="p-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center">
        {days.map((dayItem) => {
          const isCurrentMonth = dayItem.month() === currentMonth.month();
          const isToday = dayItem.isSame(dayjs(), "day");

          return (
            <div
              key={dayItem.toString()}
              className={`border p-3 m-4 text-sm flex flex-col items-center justify-center rounded-sm 
                ${isCurrentMonth ? "border-[#06B9AE]" : "border-gray-400 text-gray-400"}
                ${isToday ? "border-red-500 bg-red-50 font-bold hover:bg-red-100" : ""}`}
            >
              <span>{dayItem.date()}</span>
              <span>Model : 1.2.3</span>
              <span>Chem : simple</span>
              <span>Chauss : Mu 43</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
