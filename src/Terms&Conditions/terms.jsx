import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 sm:p-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-[#0a66c2] mb-8">
          Terms & Conditions
        </h1>

        <section className="mb-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            Welcome to <strong>The Expatpedia</strong>. By accessing or
            registering on our website, you agree to abide by the following
            Terms and Conditions.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            Eligibility
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Participation is open exclusively to expatriates (non-Bahrainis)
            currently residing in the Kingdom of Bahrain.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            Submission Guidelines
          </h2>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-2">
            <li>All submissions must include accurate and up-to-date information.</li>
            <li>
              You confirm that you have the authority to share the information
              provided (including images and contact details).
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            Use of Information
          </h2>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-2">
            <li>
              Submitted data will be used solely for the creation, publication,
              and promotion of ‘The Expatpedia’ directory (both print and digital).
            </li>
            <li>
              Your contact information (e.g., email, phone) has been made public
              with your explicit consent.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            No Fees Involved
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Participation is completely free. We do not charge any fees for
            registration or inclusion in the directory.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            Intellectual Property
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            All content submitted becomes part of ‘The Expatpedia’ project and
            may be edited for clarity or format. The final published content
            (both digital and printed) is the intellectual property of Update
            Media W.L.L. – The Daily Tribune.
          </p>
        </section>

        <section>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0a66c2] mb-3">
            Right to Refuse or Remove
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            The organizers reserve the right to refuse or remove any content
            that does not comply with the above terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;

