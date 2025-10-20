import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // ✅ Fetch data from backend (Django API)
    fetch("https://your-backend-domain.com/api/events/")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <section className="w-full bg-white py-16 px-6 md:px-16 lg:px-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Upcoming Events
          </h2>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1 font-medium cursor-pointer">
              <span className="text-green-600 font-semibold">LIST</span>
            </span>
            <span className="cursor-pointer">MONTH</span>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-12">
          {events.map((event) => (
            <div
              key={event.id}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 border-b pb-10"
            >
              {/* Date */}
              <div className="flex md:flex-col items-center md:items-start justify-start text-gray-700">
                <div className="text-sm font-semibold uppercase tracking-wider">
                  {new Date(event.date).toLocaleString("default", {
                    month: "short",
                  })}
                </div>
                <div className="text-4xl font-bold leading-none ml-2 md:ml-0 md:mt-1">
                  {new Date(event.date).getDate()}
                </div>
              </div>

              {/* Image */}
              <div className="md:col-span-1 lg:col-span-1">
                <img
                  src={event.banner}
                  alt={event.title}
                  className="w-full h-44 object-cover rounded-md"
                />
              </div>

              {/* Event Details */}
              <div className="md:col-span-2 lg:col-span-2 flex flex-col justify-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {event.location}
                </p>
                <p className="text-sm text-gray-600">
                  {event.time} —{" "}
                  {new Date(`1970-01-01T${event.time}`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                  {event.description.length > 160
                    ? event.description.substring(0, 160) + "..."
                    : event.description}
                </p>

                <a
                  href={event.registration_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center text-sm font-medium text-gray-800 hover:text-green-600 transition-all"
                >
                  View Event Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventList;
