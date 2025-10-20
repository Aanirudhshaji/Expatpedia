import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    designation: "",
    organization: "",
    is_doctor: false,
    hospital_name: "",
    speciality: "",
    email: "",
    contact_number: "",
    image: null,
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox" || type === "radio") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitData.append(key, value);
      });

      await axios.post("http://127.0.0.1:8000/api/contact/", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMsg("Registration submitted successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        designation: "",
        organization: "",
        is_doctor: false,
        hospital_name: "",
        speciality: "",
        email: "",
        contact_number: "",
        image: null,
        consent: false,
      });
    } catch (error) {
      console.error("Error sending registration:", error);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row px-6 md:px-20 py-25 md:py-28 lg:py-48">
      {/* LEFT SIDE */}
      <div className="md:w-1/2 w-full mb-10 md:mb-0">
        <h1 className="text-[50px] leading-[0.9] text-[#0a66c2] font-serif md:text-[100px] text-left">
          Get in{" "}
          <span className="hidden md:inline">
            <br />
          </span>
          <span className="inline md:hidden"></span>Touch
        </h1>
        <p className="text-gray-700 text-lg mt-4 md:mt-6 leading-relaxed max-w-md">
          Be part of a vibrant community that celebrates collaboration and growth. 
          Join us today by filling out the form below.
        </p>
        {/* Desktop Contact Info */}
        <div className="hidden md:block mt-12">
          {/* Media Enquiries */}
          <div className="mb-10">
            <h2 className="text-xl text-[#0a66c2] font-medium mb-4 font-serif">
              Media Enquiries
            </h2>
            <div className="flex items-center gap-3 text-[#0a66c2]">
              <Mail className="w-6 h-6 text-black" />
              <a
                href="mailto:media@expatpedia.com"
                className="text-lg hover:underline"
              >
                media@expatpedia.com
              </a>
            </div>
          </div>

          {/* General Enquiries */}
          <div>
            <h2 className="text-xl text-[#0a66c2] font-medium mb-4 font-serif">
              General Enquiries
            </h2>

            <div className="flex items-center gap-3 text-[#0a66c2] mb-3">
              <Mail className="w-6 h-6 text-black" />
              <a
                href="mailto:info@expatpedia.com"
                className="text-lg hover:underline"
              >
                info@expatpedia.com
              </a>
            </div>

            <div className="flex items-center gap-3 text-[#0a66c2] mb-3">
              <Phone className="w-6 h-6 text-black" />
              <a href="tel:0477044273" className="text-lg hover:underline">
                0477 044 273
              </a>
            </div>

            <div className="flex items-center gap-3 text-[#0a66c2]">
              <MapPin className="w-6 h-6 text-black" />
              <p className="text-lg">
                PO Box 12045, Manama, Kingdom of Bahrain
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="md:w-1/2 w-full align-bottom">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* First & Last Name */}
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-1"
            required
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-1"
            required
          />

          {/* Designation & Organization */}
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Current Designation"
            className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-1"
            required
          />
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Company / Organization Name"
            className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-1"
            required
          />

          {/* Doctor Checkbox */}
          <div className="col-span-2 flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              name="is_doctor"
              checked={formData.is_doctor}
              onChange={handleChange}
              className="w-5 h-5 accent-[#0c3633]"
            />
            <label className="text-gray-700 text-base">I am a Doctor</label>
          </div>

          {/* Conditional fields */}
          {formData.is_doctor && (
            <>
              <input
                type="text"
                name="hospital_name"
                value={formData.hospital_name}
                onChange={handleChange}
                placeholder="Hospital Name"
                className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-2"
              />
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-2"
              >
                <option value="">Select Speciality</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </>
          )}

          {/* Email & Contact */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-1"
            required
          />
          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            placeholder="Contact Number"
            className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-1"
            required
          />

          {/* Image Upload */}
          <div className="col-span-2">
            <label className="block text-gray-700 mb-2 font-medium">
              Upload Image
            </label>

            <div
              className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0a66c2] transition-all"
              onClick={() => document.getElementById("imageUpload").click()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-[#0a66c2] mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
                />
              </svg>
              <p className="text-gray-700">
                <span className="font-medium text-[#0a66c2]">Drag your file(s)</span>{" "}
                or{" "}
                <span className="text-[#0a66c2] font-semibold cursor-pointer">
                  browse
                </span>
              </p>
              <p className="text-gray-500 text-sm mt-1">Max 30 MB files are allowed</p>

              {formData.image && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="max-h-40 rounded-md object-cover"
                  />
                </div>
              )}
            </div>

            <input
              id="imageUpload"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </div>

          {/* Consent */}
          <div className="col-span-2 flex items-start gap-3 mt-2">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              className="w-5 h-5 accent-[#0c3633] mt-1"
              required
            />
            <label className="text-gray-700 text-base">
              I confirm that the information provided is accurate to the best of my knowledge.
            </label>
          </div>

          {/* Submit */}
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#0a66c2] text-white rounded-md hover:bg-[#002142] transition-all"
            >
              {loading ? "Submitting..." : "Register Now"}
            </button>
          </div>

          {successMsg && (
            <p className="text-green-600 text-sm mt-3 col-span-2">{successMsg}</p>
          )}
          {errorMsg && (
            <p className="text-red-600 text-sm mt-3 col-span-2">{errorMsg}</p>
          )}
        </form>

        {/* MOBILE CONTACT INFO (below form) */}
        <div className="block md:hidden mt-14">
          <div className="mb-10">
            <h2 className="text-xl text-[#0a66c2] font-medium mb-4 font-serif">
              Media Enquiries
            </h2>
            <div className="flex items-center gap-3 text-[#0a66c2]">
              <Mail className="w-6 h-6 text-black" />
              <a
                href="mailto:media@expatpedia.com"
                className="text-lg hover:underline"
              >
                media@expatpedia.com
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-xl text-[#0a66c2] font-medium mb-4 font-serif">
              General Enquiries
            </h2>

            <div className="flex items-center gap-3 text-[#0a66c2] mb-3">
              <Mail className="w-6 h-6 text-black" />
              <a
                href="mailto:info@expatpedia.com"
                className="text-lg hover:underline"
              >
                info@expatpedia.com
              </a>
            </div>

            <div className="flex items-center gap-3 text-[#0a66c2] mb-3">
              <Phone className="w-6 h-6 text-black" />
              <a href="tel:0477044273" className="text-lg hover:underline">
                0477 044 273
              </a>
            </div>

            <div className="flex items-center gap-3 text-[#0a66c2]">
              <MapPin className="w-6 h-6 text-black" />
              <p className="text-lg">
                PO Box 12045, Manama, Kingdom of Bahrain
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
