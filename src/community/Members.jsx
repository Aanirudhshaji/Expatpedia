import React, { useState, useEffect } from "react";

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        console.log("Fetching team members from API...");
        const response = await fetch("http://127.0.0.1:8000/api/customUser/");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        if (Array.isArray(data)) {
          setTeamMembers(data);
        } else if (data && typeof data === "object") {
          const possibleKeys = ["results", "data", "users", "members"];
          const foundKey = possibleKeys.find((key) => Array.isArray(data[key]));
          if (foundKey) {
            setTeamMembers(data[foundKey]);
          } else {
            setTeamMembers([data]);
          }
        } else {
          throw new Error("Unexpected response format from API");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching team members:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const getMemberName = (member) => member?.name || "Unknown Name";
  const getMemberOccupation = (member) => member?.occupation || "Not specified";

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 mb-6"></div>
        <p className="text-gray-600 text-lg font-medium tracking-wide">
          Loading team members...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white border border-red-100 rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-14 h-14 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-red-700 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg transition-transform transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
    return (
      <div className="py-24 bg-gradient-to-b from-gray-50 to-white text-center">
        <div className="bg-white shadow-md rounded-2xl p-10 inline-block">
          <svg
            className="w-20 h-20 text-gray-300 mx-auto mb-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Team Members Yet
          </h3>
          <p className="text-gray-500 text-sm">
            We’re building something amazing — check back soon!
          </p>
        </div>
      </div>
    );
  }

  // 🌟 Modernized UI Section
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Meet Our Exceptional Team
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Driven by creativity and collaboration, our experts deliver tailored
            solutions to bring your ideas to life.
          </p>
          <div className="mt-6 w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Members Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative">
                <img
                  src={member.image || "https://via.placeholder.com/400x400"}
                  alt={getMemberName(member)}
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-semibold mb-1">
                    {getMemberName(member)}
                  </h3>
                  <p className="text-gray-200 text-sm mb-4">
                    {getMemberOccupation(member)}
                  </p>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a
                      href="#"
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a
                      href="#"
                      className="text-white hover:text-blue-300 transition-colors"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center py-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {getMemberName(member)}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {getMemberOccupation(member)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Count Section */}
        <div className="mt-20 text-center">
          <div className="bg-blue-50 inline-block rounded-full px-10 py-4 shadow-sm">
            <p className="text-blue-700 text-lg font-medium">
              Currently{" "}
              <span className="font-bold text-blue-800 text-2xl">
                {teamMembers.length}
              </span>{" "}
              {teamMembers.length === 1 ? "Member" : "Members"} in our team
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
