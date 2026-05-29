export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
     
      <nav className="flex justify-between items-center px-8 py-6 border-b border-neutral-800">
        <div className="text-2xl font-black">
          <span className="text-yellow-500">Forge</span>
          <span className="text-neutral-400">-Setup</span>
        </div>
        <button
          onClick={onGetStarted}
          className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition-all"
        >
          Get Started
        </button>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-20 max-w-6xl mx-auto w-full">
        <div className="space-y-8 text-center">
       
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-white">System Design</span>
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Describe your project, and let AI forge a complete technical blueprint—architecture layers, tech stack recommendations, and a development roadmap tailored to your vision.
            </p>
          </div>

         
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-yellow-500/40 transition-all transform hover:scale-105"
          >
            <span>Forge Your Blueprint</span>
            <span>→</span>
          </button>

        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950/50 hover:border-yellow-500/40 transition-all">
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className="text-lg font-bold mb-2 text-white">Architecture Design</h3>
              <p className="text-neutral-400 text-sm">AI generates a complete system architecture tailored to your tech stack and requirements.</p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950/50 hover:border-yellow-500/40 transition-all">
              <div className="text-3xl mb-3">🛠️</div>
              <h3 className="text-lg font-bold mb-2 text-white">Tech Recommendations</h3>
              <p className="text-neutral-400 text-sm">Get curated technology stack suggestions based on your project scope and industry.</p>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950/50 hover:border-yellow-500/40 transition-all">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-bold mb-2 text-white">Development Roadmap</h3>
              <p className="text-neutral-400 text-sm">Actionable phases and milestones to guide your development from MVP to launch.</p>
            </div>
          </div>

  
          <div className="mt-16 space-y-8 text-left max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
            
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 border border-yellow-500/40">
                  <span className="font-bold text-yellow-400">1</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Describe Your Project</h3>
                <p className="text-neutral-400">Share your company details, target audience, features needed, and design preferences through a simple multi-step form.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 border border-yellow-500/40">
                  <span className="font-bold text-yellow-400">2</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">AI Analyzes Your Needs</h3>
                <p className="text-neutral-400">Our AI engine processes your requirements and generates a comprehensive technical blueprint using advanced reasoning.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20 border border-yellow-500/40">
                  <span className="font-bold text-yellow-400">3</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Receive Your Blueprint</h3>
                <p className="text-neutral-400">Get a detailed system design including architecture layers, recommended tech stack, and a phased development roadmap.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-800 py-6 px-8 text-center text-neutral-500 text-sm">
        <p>Forge-Setup-Client • AI-Powered Technical Design. </p>
      </footer>
    </div>
  );
}
