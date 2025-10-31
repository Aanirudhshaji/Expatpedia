import React, { useState } from "react";
import axios from "axios";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    occupation_category: "",
    position: "",
    profile_image: null,
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  // Simple input change handler
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === "file") {
      const file = files[0] || null;
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create preview URL
      if (file) {
        const url = URL.createObjectURL(file);
        setImagePreviewUrl(url);
      } else {
        setImagePreviewUrl(null);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUploadClick = () => {
    const fileInput = document.getElementById("profileImageUpload");
    fileInput?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      let submitData;
      let headers = {};

      if (formData.profile_image) {
        const formDataObj = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== "") {
            formDataObj.append(key, value);
          }
        });
        submitData = formDataObj;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        const { profile_image, ...dataWithoutImage } = formData;
        submitData = dataWithoutImage;
        headers["Content-Type"] = "application/json";
      }

      const response = await axios.post(
        "https://exaptpedia.onrender.com/api/contact/",
        submitData,
        { headers }
      );

      setSuccessMsg("Registration submitted successfully!");
      setFormData({
        name: "",
        phone: "",
        email: "",
        occupation_category: "",
        position: "",
        profile_image: null,
      });
      setImagePreviewUrl(null);

      // Clear file input
      const fileInput = document.getElementById("profileImageUpload");
      if (fileInput) fileInput.value = "";

    } catch (error) {
      let errorMessage = "Request failed. Please try again.";
      
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400 && typeof data === 'object') {
          const errors = Object.values(data).flat();
          errorMessage = errors.join(', ');
        } else if (status === 413) {
          errorMessage = "File too large. Please upload a smaller image.";
        } else if (status === 415) {
          errorMessage = "Unsupported file type. Please use JPEG, PNG, or GIF.";
        } else {
          errorMessage = `Server error: ${status}. Please try again.`;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your internet connection.";
      }
      
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const contactSections = {
    media: {
      title: "Media Enquiries",
      items: [
        { icon: Mail, href: "mailto:media@expatpedia.com", text: "media@expatpedia.com" }
      ]
    },
    general: {
      title: "General Enquiries",
      items: [
        { icon: Mail, href: "mailto:info@expatpedia.com", text: "info@expatpedia.com" },
        { icon: Phone, href: "tel:0477044273", text: "0477 044 273" },
        { icon: MapPin, text: "PO Box 12045, Manama, Kingdom of Bahrain" }
      ]
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
          <div className="mb-10">
            <h2 className="text-xl text-[#0a66c2] font-medium mb-4 font-serif">
              {contactSections.media.title}
            </h2>
            {contactSections.media.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-[#0a66c2] mb-3">
                <item.icon className="w-6 h-6 text-black" />
                {item.href ? (
                  <a href={item.href} className="text-lg hover:underline">
                    {item.text}
                  </a>
                ) : (
                  <p className="text-lg">{item.text}</p>
                )}
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-xl text-[#0a66c2] font-medium mb-4 font-serif">
              {contactSections.general.title}
            </h2>
            {contactSections.general.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-[#0a66c2] mb-3">
                <item.icon className="w-6 h-6 text-black" />
                {item.href ? (
                  <a href={item.href} className="text-lg hover:underline">
                    {item.text}
                  </a>
                ) : (
                  <p className="text-lg">{item.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="md:w-1/2 w-full align-bottom">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 w-ful"
        >
          {/* Name */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-2"
            required
          />

          {/* Email & Phone */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
            className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-2 md:col-span-1"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-2 md:col-span-1"
            required
          />

          {/* Occupation Category & Position */}
          <input
            type="text"
            name="occupation_category"
            value={formData.occupation_category}
            onChange={handleInputChange}
            placeholder="Occupation Category"
            className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-2 md:col-span-1"
            required
          />
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            placeholder="Position"
            className="border-b border-gray-400 bg-transparent py-2 focus:outline-none col-span-2 md:col-span-1"
            required
          />

          {/* Profile Image Upload */}
          <div className="col-span-2">
            <label className="block text-gray-700 mb-2 font-medium">
              Upload Profile Image (Optional)
            </label>

            <div
              role="button"
              tabIndex={0}
              aria-label="Upload profile image"
              className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#0a66c2] transition-all"
              onClick={handleFileUploadClick}
              onKeyPress={(e) => e.key === 'Enter' && handleFileUploadClick()}
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
                <span className="font-medium text-[#0a66c2]">Click to upload</span>{" "}
                or drag and drop
              </p>
              <p className="text-gray-500 text-sm mt-1">Optional - Max 30 MB</p>

              {imagePreviewUrl && (
                <div className="mt-4">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="max-h-40 rounded-md object-cover"
                  />
                  <p className="text-sm text-green-600 mt-2">Image selected</p>
                </div>
              )}
            </div>

            <input
              id="profileImageUpload"
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>

          {/* Submit Button */}
          <div className="flex col-span-2 mt-8 justify-center md:justify-start">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#0a66c2] text-white rounded-md hover:bg-[#002142] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Register Now"}
            </button>
          </div>

          {/* Status Messages */}
          {successMsg && (
            <p className="text-green-600 text-sm mt-3 col-span-2 text-center md:text-left">
              {successMsg}
            </p>
          )}
          {errorMsg && (
            <p className="text-red-600 text-sm mt-3 col-span-2 text-center md:text-left">
              {errorMsg}
            </p>
          )}
        </form>

        {/* MOBILE CONTACT INFO */}
        <div className="block md:hidden mt-14">
          <div className="mb-10">
            <h2 className="text-xl text-[#0a66c2] font-medium mb-4 font-serif">
              {contactSections.media.title}
            </h2>
            {contactSections.media.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-[#0a66c2] mb-3">
                <item.icon className="w-6 h-6 text-black" />
                {item.href ? (
                  <a href={item.href} className="text-lg hover:underline">
                    {item.text}
                  </a>
                ) : (
                  <p className="text-lg">{item.text}</p>
                )}
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-xl text-[#0a66c2] font-medium mb-4 font-serif">
              {contactSections.general.title}
            </h2>
            {contactSections.general.items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-[#0a66c2] mb-3">
                <item.icon className="w-6 h-6 text-black" />
                {item.href ? (
                  <a href={item.href} className="text-lg hover:underline">
                    {item.text}
                  </a>
                ) : (
                  <p className="text-lg">{item.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;