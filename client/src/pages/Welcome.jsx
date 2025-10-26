import { useNavigate } from "react-router-dom";

const Welcome = () => {
  
  let navigate = useNavigate(); 
  const handleClick = () =>{
     navigate("/chat");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div
        className="max-w-3xl w-full rounded-3xl p-8 md:p-12 shadow-2xl"
        style={{ backgroundColor: "#2a2a2a", border: "1px solid #4a4a4a" }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
          Welcome to RiyaBOT!!
        </h1>

        <div className="space-y-6 text-gray-300">
          <p className="text-base md:text-lg">Hi, I am Riya.</p>

          <p className="text-sm md:text-base leading-relaxed">
            Thank you for visiting. I'm excited to give you an overview of my
            skills and experience, and answer any questions you may have. Here's
            what you can explore:
          </p>

          <ul className="space-y-2 text-sm md:text-base ml-6">
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>A brief overview of my background</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>My key skills and achievements</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>Relevant projects and experiences</span>
            </li>
          </ul>

          <p className="text-sm md:text-base pt-4">
            Feel free to ask any questions. I look forward to connecting with
            you!
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
