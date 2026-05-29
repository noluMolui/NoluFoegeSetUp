import React from 'react';

interface ProjectData {
  companyName: string;
  industry: string;
  platform: string;
  audience: string;
  aesthetic: string;
  features: string[];
  aiGeneratedBlueprint: string; // The raw markdown from Gemini
}

interface BlueprintDashboardProps {
  projectData: ProjectData | null;
  onReset: () => void;
}

export default function BlueprintDashboard({ projectData, onReset }: BlueprintDashboardProps) {
  if (!projectData) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-neutral-400">No project data found.</p>
      </div>
    );
  }

  // 🧠 TEXT EXTRACTOR: Grabs paragraph content under specific markdown headers
  const extractSection = (headingName: string, fallbackText: string): string => {
    const markdown = projectData.aiGeneratedBlueprint || '';
    const regex = new RegExp(`##\\s*${headingName}[\\r\\n]+([\\s\\S]*?)(##|$)`, 'i');
    const match = markdown.match(regex);
    if (match && match[1]) {
      return match[1].trim();
    }
    return fallbackText;
  };

  // 🛠️ TECH STACK EXTRACTOR: Parses markdown to find bolded text, backticks, or lists under the Tech section
  const extractTechStack = (): string[] => {
    const markdown = projectData.aiGeneratedBlueprint || '';
    
    // Look for common engineering header variants
    const sectionRegex = /##\s*(?:Technical\s+Stack|Tech\s+Stack|Technology\s+Ecosystem|Recommended\s+Tech)[\r\n]+([\s\S]*?)(##|$)/i;
    const match = markdown.match(sectionRegex);
    
    if (match && match[1]) {
      const sectionContent = match[1];
      // Regex captures phrases inside **bolds**, `codes`, or after bullet points (- item)
      const techRegex = /(?:\*\*|`|-\s+)([a-zA-Z0-9._+\s-]{2,15})(?:\*\*|`|[\r\n])/g;
      const foundTech: string[] = [];
      let techMatch;
      
      while ((techMatch = techRegex.exec(sectionContent)) !== null) {
        const cleanTech = techMatch[1].trim();
        // Skip structural headers that might get accidentally swept up
        const blacklistedWords = ['Frontend', 'Backend', 'Database', 'Hosting', 'Mobile', 'Web', 'Infrastructure', 'Stack'];
        if (cleanTech && !blacklistedWords.includes(cleanTech)) {
          if (!foundTech.includes(cleanTech)) {
            foundTech.push(cleanTech);
          }
        }
      }
      
      if (foundTech.length > 0) return foundTech;
    }

    // Default emergency backup stack if regex has a matching slip
    return ['React', 'TypeScript', 'Tailwind', 'Node.js', 'Express', 'MongoDB'];
  };

  // Run our dynamic extraction setups
  const dynamicFrontendLayer = extractSection("Frontend Layer", "Custom framework layout built for user interaction rules.");
  const dynamicBusinessLayer = extractSection("Business Logic Layer", "Custom application services engineered for business rule compliance.");
  const dynamicDataLayer = extractSection("Data Persistence", "Relational or non-relational structures optimized for system load.");

  const dynamicMvpText = extractSection("MVP Setup", "Foundation architecture setup engineered to match your specified target timeline rules.");
  const dynamicIntegrationText = extractSection("Feature Integration", "Developing primary functional blocks and connecting external api configurations.");
  const dynamicLaunchText = extractSection("Launch Strategy", "Final performance optimization loops, security audits, and live environment deployment.");

  const dynamicTechStack = extractTechStack();

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 sm:p-12 font-sans selection:bg-purple-500/30">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Your Project Blueprint
          </h1>
          <p className="text-purple-400 font-medium tracking-wide uppercase text-sm">
            {projectData.companyName} • {projectData.industry}
          </p>
        </div>

        {/* 1. Architecture Blueprint Sections */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <h2 className="text-xl font-bold tracking-tight">Architecture Blueprint</h2>
          </div>
          
          <div className="border-l-2 border-purple-600/40 pl-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Frontend Layer</h3>
              <p className="text-neutral-300 mt-1 text-sm leading-relaxed">{dynamicFrontendLayer}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Business Logic Layer</h3>
              <p className="text-neutral-300 mt-1 text-sm leading-relaxed">{dynamicBusinessLayer}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">Data Persistence</h3>
              <p className="text-neutral-300 mt-1 text-sm leading-relaxed">{dynamicDataLayer}</p>
            </div>
          </div>
        </div>

        {/* 2. Dynamic Tech Stack Badges */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🛠️</span>
            <h2 className="text-xl font-bold tracking-tight">Recommended Tech Stack</h2>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {dynamicTechStack.map((tech, index) => (
              <span 
                key={index} 
                className="px-4 py-2 bg-neutral-950 border border-neutral-800 hover:border-purple-500/40 rounded-xl text-sm font-medium transition-all text-neutral-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 3. Project Parameters Summary Meta */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎯</span>
            <h2 className="text-xl font-bold tracking-tight">Project Parameters</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-neutral-500 block text-xs uppercase tracking-wider">Audience Focus</span>
              <span className="text-neutral-200 font-medium">{projectData.audience || 'General public'}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-xs uppercase tracking-wider">Design Aesthetic</span>
              <span className="text-neutral-200 font-medium">{projectData.aesthetic || 'Standard Clean'}</span>
            </div>
          </div>
          <div className="pt-2">
            <span className="text-neutral-500 block text-xs uppercase tracking-wider mb-2">Targeted Feature Blocks</span>
            <div className="flex flex-wrap gap-2">
              {projectData.features.length > 0 ? (
                projectData.features.map((f, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-medium rounded-full bg-purple-950/40 border border-purple-500/20 text-purple-300">
                    {f}
                  </span>
                ))
              ) : (
                <span className="text-xs text-neutral-400 italic">AI Auto-Selected Best Stack Match</span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Development Roadmap Timeline */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 backdrop-blur-md space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-xl">📋</span>
            <h2 className="text-xl font-bold tracking-tight">Tailored Development Roadmap</h2>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-neutral-800">
            {/* Step 1 */}
            <div className="flex gap-6 relative">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-500 bg-neutral-950 text-xs font-bold text-purple-400 shadow-xl">
                1
              </div>
              <div className="space-y-1 pt-1">
                <h3 className="text-base font-bold text-white">MVP Foundation Phase</h3>
                <p className="text-xs text-neutral-500">Initial Milestones</p>
                <p className="text-neutral-400 text-sm leading-relaxed pt-1">{dynamicMvpText}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 relative">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-500 bg-neutral-950 text-xs font-bold text-purple-400 shadow-xl">
                2
              </div>
              <div className="space-y-1 pt-1">
                <h3 className="text-base font-bold text-white">Feature Integration & Connections</h3>
                <p className="text-xs text-neutral-500">Core Architecture Construction</p>
                <p className="text-neutral-400 text-sm leading-relaxed pt-1">{dynamicIntegrationText}</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 relative">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-500 bg-neutral-950 text-xs font-bold text-purple-400 shadow-xl">
                3
              </div>
              <div className="space-y-1 pt-1">
                <h3 className="text-base font-bold text-white">System Launch Strategy</h3>
                <p className="text-xs text-neutral-500">Production Go-Live Prep</p>
                <p className="text-neutral-400 text-sm leading-relaxed pt-1">{dynamicLaunchText}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Comprehensive Full AI Output Document Panel */}
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/30 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📄</span>
            <h2 className="text-xl font-bold tracking-tight">Full System Blueprint Document</h2>
          </div>
          <div className="p-5 sm:p-6 rounded-2xl bg-neutral-950 border border-neutral-800 overflow-x-auto text-neutral-300 text-sm font-mono whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto custom-scrollbar">
            {projectData.aiGeneratedBlueprint}
          </div>
        </div>

        {/* Re-scope Action Trigger */}
        <div className="text-center pt-4">
          <button
            onClick={onReset}
            className="px-6 py-2.5 rounded-xl border border-neutral-800 hover:border-purple-500/50 bg-neutral-900 text-sm font-medium transition-all text-neutral-300 hover:text-white"
          >
            ← Scope Another Product
          </button>
        </div>

      </div>
    </div>
  );
}