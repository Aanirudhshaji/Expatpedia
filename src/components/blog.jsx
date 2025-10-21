import React from "react";
import { Clock } from "lucide-react";

const blogs = [
  {
    id: 1,
    title: "Welcome to The Expatpedia",
    date: "1 Oct",
    readTime: "6 Min",
    image:
      "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=1000&q=80",
    desc: "Celebrating Excellence, Recognizing Impact. ‘The Expatpedia’ is dedicated to honoring expatriates shaping Bahrain’s future through innovation, leadership, and cultural contribution.",
  },
  {
    id: 2,
    title: "About Us: Honouring Expatriate Excellence in Bahrain",
    date: "2 Oct",
    readTime: "8 Min",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80",
    desc: "‘The Expatpedia’ recognizes and celebrates the achievements of expatriate professionals across key sectors in Bahrain — from business to technology, arts, and more.",
  },
  {
    id: 3,
    title: "Terms & Conditions: Participation Guidelines",
    date: "3 Oct",
    readTime: "10 Min",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1000&q=80",
    desc: "Learn about eligibility, data usage, intellectual property, and other key terms governing your participation in ‘The Expatpedia’ project and publication.",
  },
  {
    id: 4,
    title: "Join The Expatpedia Directory",
    date: "4 Oct",
    readTime: "7 Min",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80",
    desc: "Be part of Bahrain’s most prestigious directory of expatriates. Submit your profile, share your achievements, and inspire others through your journey.",
  },
];

const Blog = () => {
  return (
    <section className="bg-white mb-8 py-10 md:py-16 px-6 md:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-14">
        <p className="text-[#0a66c2] text-sm font-semibold tracking-wide uppercase mb-2">
          News & Articles
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
          Insights and Updates from <br className="hidden md:block" />
          <span className="text-[#0a66c2]">The Expatpedia</span>
        </h2>
        <p className="text-gray-600 text-base mt-4 max-w-2xl mx-auto">
          Discover inspiring stories, essential information, and updates from
          Bahrain’s exclusive platform celebrating expatriate excellence.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="max-w-7xl mx-auto">
        <div
          className="
            flex md:grid md:grid-cols-2 lg:grid-cols-4 
            gap-6 
            overflow-x-auto md:overflow-visible
            pb-4 
            snap-x snap-mandatory 
            scroll-smooth
          "
        >
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="
                bg-[#e8f0f8] 
                rounded-2xl 
                shadow-sm hover:shadow-lg 
                transition-all duration-300 
                overflow-hidden flex flex-col
                min-w-[85%] sm:min-w-[60%] md:min-w-0
                snap-center
              "
            >
              {/* Image */}
              <img
                src={blog.image}
                alt={blog.title}
                className="h-52 w-full object-cover"
              />

              {/* Content */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#0080ff] transition-colors duration-200 cursor-pointer">
                    {blog.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {blog.desc}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500 mt-4">
                  <span>{blog.date}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
