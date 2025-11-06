import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Welcome = () => {
  let navigate = useNavigate();
  const handleClick = () => {
    navigate("/chat");
  };

  const exampleQuestions = [
   "What projects has Riya worked on?",
   "What are her technical skills?",
   "Tell me about her education.",
   "Walk me through her work experience.",
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#1f1f1f" }}
    >
      <div
        className="max-w-3xl w-full rounded-3xl p-8 md:p-12 shadow-2xl"
        style={{ backgroundColor: "#2b2b2b", border: "1px solid #3f3f3f" }}
      >
       {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 text-center mb-6 tracking-wide">
          Welcome to RiyaBOT
        </h1>

        <p className="text-gray-300 text-center mb-8 text-base md:text-lg max-w-2xl mx-auto">
          Hi, I’m <span className="text-blue-400 font-semibold">Riya</span> —
          Thank you for visiting.  RiyaBot is here to share details of my
          skills and experience, and answer any questions you may have. 
        </p>
        <div className="space-y-6 text-gray-300">
          {/* Example Questions Section */}
          <div className="bg-neutral-800/50 rounded-2xl p-5 mb-8 border border-neutral-700">
            <div className="flex items-center justify-center mb-3">
              <Sparkles size={18} className="text-blue-400 mr-2" />
              <h2 className="text-gray-200 font-semibold text-center">
                Try asking me:
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exampleQuestions.map((q, i) => (
                <div
                  key={i}
                  className="bg-neutral-700/40 text-gray-300 hover:text-white hover:bg-neutral-600/60 transition-all duration-300 rounded-lg px-4 py-2 text-sm cursor-pointer text-center border border-neutral-600/40 hover:shadow-md"
                  onClick={() => navigate("/chat")}
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="text-gray-400 space-y-3 text-sm md:text-base leading-relaxed">
          <p>
            You can explore details about my{" "}
            <span className="text-gray-200">skills</span>,{" "}
            <span className="text-gray-200">achievements</span>, and{" "}
            <span className="text-gray-200">experience</span>.
          </p>
          <p>
            I’m always learning and improving — so feel free to chat and
            discover more!
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={handleClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
          >
            Let's get started! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
