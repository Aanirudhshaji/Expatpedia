import React from "react";

const Events = () => {
  return (
    <section
      className="relative w-full h-[80vh] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1950&q=80')", // replace with your own image URL
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-2xl">
        <h1 className="text-4xl md:text-7xl font-bold tracking-[0.2em] mb-6">
          EVENTS
        </h1>
        <p className="text-base md:text-lg leading-relaxed text-gray-200">
          Risen seeks to actively engage our community with fellowship and love.
          <br className="hidden md:block" />
          Below you will find a list of upcoming events that you can attend,
          volunteer, and share with others.
        </p>
      </div>
    </section>
  );
};

export default Events;
