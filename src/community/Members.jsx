import React, { useEffect, useState } from "react";
import axios from "axios";

const Members = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    axios
      .get("https://your-backend-domain.com/api/members/")
      .then((res) => setMembers(res.data))
      .catch((err) => console.error("Error fetching members:", err));
  }, []);

  return (
    <section className="py-16 px-6 md:px-10 bg-white">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-semibold text-gray-900">
          Explore our comprehensive <br /> service offerings
        </h2>
        <p className="text-gray-600 text-base md:text-lg mt-4 max-w-2xl mx-auto">
          Focused on your unique needs, our team delivers solutions that blend deep
          industry knowledge and cutting-edge strategies to ensure lasting growth.
        </p>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-500 text-sm">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Members;
