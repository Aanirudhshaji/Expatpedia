import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Play, Image as ImageIcon } from "lucide-react";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Helper function to get placeholder image
  const getPlaceholderImage = () => 
    "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=1200&q=80";

  // Helper function to check if media is video
  const isVideo = (mediaUrl) => {
    if (!mediaUrl) return false;
    return [".mp4", ".webm", ".mov", ".avi", ".m4v"].some((ext) => 
      mediaUrl.toLowerCase().includes(ext)
    );
  };

  // Helper function to check if media URL is likely to work
  const isMediaLikelyWorking = (mediaUrl) => {
    if (!mediaUrl) return false;
    // Check if it's a full URL with domain
    return mediaUrl.startsWith('http') && mediaUrl.includes('://');
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setMediaError(false);
        const response = await fetch(`https://exaptpedia.onrender.com/api/Blog/${id}/`);
        if (!response.ok) throw new Error('Failed to fetch blog');
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        console.error('Error fetching blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleMediaError = () => {
    setMediaError(true);
  };

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsPlaying(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or may have been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center text-[#0a66c2] font-medium hover:underline"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  // Determine media type
  const hasMedia = blog.media && blog.media !== "null";
  const isVideoMedia = hasMedia && isVideo(blog.media);
  const mediaLikelyWorking = hasMedia && isMediaLikelyWorking(blog.media);

  return (
    <div className="bg-[#f9fbfd] min-h-screen pb-20">
      {/* Hero Banner - Changed background color to #0a66c2 */}
      <div 
        className="relative h-[250px] md:h-[500px] w-full flex items-center justify-center"
        style={{ backgroundColor: '#0a66c2' }}
      >
        <div className="text-center px-6 pt-8 md:pt-20">
          {/* Title with smaller size on mobile and moved down */}
          <h1 className="text-white text-2xl md:text-5xl font-bold leading-tight md:leading-snug max-w-3xl mb-3 md:mb-4 mt-8 md:mt-0">
            {blog.title}
          </h1>
          <p className="text-gray-100 text-sm md:text-lg max-w-2xl mx-auto opacity-90">
            {blog.subtitle || "An inspiring read from The Expatpedia community."}
          </p>
        </div>
      </div>

      {/* Video Player Modal */}
      {isPlaying && isVideoMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={handleCloseVideo}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <video
              controls
              autoPlay
              className="w-full h-auto max-h-[80vh] rounded-lg"
              onEnded={handleCloseVideo}
            >
              <source src={blog.media} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6 md:p-10 -mt-12 relative z-10">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-[#0a66c2] font-medium hover:underline mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Blogs
        </Link>

        {/* Title and Meta */}
        {/* <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {blog.title}
        </h2> */}

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          {blog.author && (
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>{blog.author}</span>
            </div>
          )}
          {hasMedia && isVideoMedia && (
            <div className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              Video Content
            </div>
          )}
          {hasMedia && !isVideoMedia && (
            <div className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              Image Content
            </div>
          )}
        </div>

        {/* Media Display in Content Section */}
        {hasMedia && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-50">
            {mediaError || !mediaLikelyWorking ? (
              // Show placeholder when media fails to load or URL is invalid
              <div className="w-full h-64 flex flex-col items-center justify-center text-gray-500">
                {isVideoMedia ? (
                  <>
                    <Play className="w-16 h-16 mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Video Not Available</p>
                    <p className="text-sm text-center max-w-md">
                      The video file is currently unavailable. This might be a temporary issue.
                    </p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-16 h-16 mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Image Not Available</p>
                    <p className="text-sm text-center max-w-md">
                      The image file is currently unavailable. This might be a temporary issue.
                    </p>
                  </>
                )}
              </div>
            ) : isVideoMedia ? (
              // Video with play button that opens modal
              <div className="relative group cursor-pointer" onClick={handlePlayVideo}>
                <div className="w-full h-64 bg-gray-800 flex flex-col items-center justify-center text-white">
                  <div className="bg-white bg-opacity-20 rounded-full p-4 group-hover:bg-opacity-30 transition-all duration-300">
                    <Play className="w-16 h-16 text-white fill-white ml-1" />
                  </div>
                  <p className="text-lg font-medium mb-2 mt-4">Click to Play Video</p>
                  <p className="text-sm text-gray-300">
                    {blog.media.split('/').pop()}
                  </p>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-8 h-8 text-blue-600 fill-blue-600 ml-0.5" />
                  </div>
                </div>
              </div>
            ) : (
              // Try to load image with error handling
              <img
                src={blog.media}
                alt={blog.title}
                className="w-full h-auto max-h-[500px] object-contain"
                onError={handleMediaError}
                onLoad={() => setMediaError(false)}
              />
            )}
          </div>
        )}

        {/* Blog Content */}
        <article className="prose max-w-none prose-blue prose-lg text-gray-800 leading-relaxed">
          {blog.content ? (
            <div 
              className="whitespace-pre-line"
              dangerouslySetInnerHTML={{ 
                __html: blog.content 
              }} 
            />
          ) : (
            <p className="text-gray-600 italic">No content available for this blog post.</p>
          )}
        </article>

        {/* Footer */}
        <div className="border-t border-gray-200 mt-10 pt-6 text-sm text-gray-600">
          <p>
            Thank you for reading this story on{" "}
            <span className="text-[#0a66c2] font-semibold">The Expatpedia</span>.  
            Stay tuned for more inspiring expatriate journeys.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;