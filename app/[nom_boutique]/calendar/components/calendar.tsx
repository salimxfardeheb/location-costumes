"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";

type Costume = {
  ref: string;
  model: string;
  blazer: string;
  pant: string;
  image?: string;
};

type Shirt = {
  ref: string;
  model: string;
  size: string;
  image?: string;
};

type Shoe = {
  ref: string;
  model: string;
  size: string;
  image?: string;
};

type Accessory = {
  ref: string;
  model: string;
  image?: string;
};

type LocationItem = {
  id: string;
  date_sortie: string;
  costumes: Costume[];
  shirt: Shirt | null;
  shoe: Shoe | null;
  accessories: Accessory[];
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="p-6 max-w-7xl mx-auto">
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

      <div className="grid grid-cols-7 text-center font-semibold">
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

          const eventsOfDay = locations.filter((loc) =>
            dayItem.isSame(dayjs(loc.date_sortie), "day")
          );

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
              <span className="font-semibold">{dayItem.date()}</span>

              {loading && <span className="text-xs text-gray-400">⏳</span>}

              <div className="flex flex-col gap-1 mt-1 w-full">
                {eventsOfDay.map((loc) => (
                  <div
                    key={loc.id}
                    className="text-xs rounded px-1 py-0.5 border border-[#06B9AE] cursor-pointer"
                  >
                    {loc.costumes.length > 0 && (
                      <div>
                        Mod:{" "}
                        <span className="text-[#06B9AE]">
                          {loc.costumes.map((c) => c.model).join(", ")}
                        </span>
                        <span>
                          {" "}
                          B :{" "}
                          <span className="text-[#06B9AE]">
                            {loc.costumes.map((c) => c.blazer).join(", ")}
                          </span>{" "}
                        </span>
                        <span>
                          {" "}
                          P :{" "}
                          <span className="text-[#06B9AE]">
                            {loc.costumes.map((c) => c.pant).join(", ")}
                          </span>
                        </span>
                      </div>
                    )}
                    {loc.shirt && (
                      <div>
                        Chem:{" "}
                        <span className="text-[#06B9AE]">
                          {loc.shirt.model}
                        </span>
                        <span>
                          {" "}
                          T :{" "}
                          <span className="text-[#06B9AE]">
                            {loc.shirt.size}
                          </span>
                        </span>
                      </div>
                    )}
                    {loc.shoe && (
                      <div>
                        Chaus:{" "}
                        <span className="text-[#06B9AE]">{loc.shoe.model}</span>
                        <span>
                          {" "}
                          T :{" "}
                          <span className="text-[#06B9AE]">
                            {loc.shoe.size}
                          </span>
                        </span>
                      </div>
                    )}
                    {loc.accessories.length > 0 && (
                      <div>
                        Acc:{" "}
                        <span className="text-[#06B9AE]">
                          {loc.accessories.map((a) => a.model).join(", ")}
                        </span>
                      </div>
                    )}
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
