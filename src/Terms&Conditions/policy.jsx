import React from "react";

const Policy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 sm:p-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0a66c2] mb-8">
          Privacy Policy
        </h1>

        <section className="mb-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            Welcome to <strong>The Expatpedia</strong>. Your privacy is important to us. By using our website, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            Information Collection
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We collect only the information you voluntarily provide, including personal details and contact information submitted for inclusion in the directory.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            Use of Information
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            The collected information is used solely for creating, publishing, and promoting <strong>The Expatpedia</strong> directory. Your data will not be shared with third parties without your explicit consent.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            Security
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We take appropriate measures to safeguard your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            Cookies
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our website may use cookies to enhance user experience. Cookies help us analyze traffic and improve the functionality of the site. You can disable cookies in your browser settings.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            Your Consent
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            By using our website, you consent to our privacy policy and agree to its terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            Changes to Policy
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We may update this policy periodically. Any changes will be posted on this page. Continued use of the site after changes implies your acceptance of the updated policy.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Policy;
