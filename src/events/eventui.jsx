import React, { useEffect, useState } from "react";

const EventSection = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Replace this URL with your actual backend API endpoint
  const API_URL = "https://admin.texbay.in/api/events/Event/";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-20 flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading latest events...</p>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#f6f6f9] py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-gray-300 pb-2">
          <h2 className="text-2xl font-semibold text-gray-800">
            Latest Events
          </h2>
        </div>

        {events.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No events available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="relative rounded-2xl overflow-hidden group shadow-md transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {/* Event Image */}
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-[400px] object-cover"
                />

                {/* Category Badge */}
                {event.category && (
                  <div className="absolute top-4 left-4 bg-white text-gray-800 text-sm font-medium px-4 py-1 rounded-full shadow-sm">
                    {event.category}
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                {/* Event Title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-lg font-semibold leading-snug drop-shadow-md">
                    {event.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventSection;
