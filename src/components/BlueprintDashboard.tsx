import { FormData } from './OnboardingForm';

interface BlueprintDashboardProps {
  projectData?: Partial<FormData> & { aiGeneratedBlueprint?: string };
  onReset: () => void;
}

export default function BlueprintDashboard({ projectData, onReset }: BlueprintDashboardProps) {
  const safeProject = {
    companyName: projectData?.companyName || '',
    industry: projectData?.industry || '',
    platform: projectData?.platform || '',
    audience: projectData?.audience || '',
    aesthetic: projectData?.aesthetic || '',
    features: projectData?.features || [],
    aiGeneratedBlueprint: projectData?.aiGeneratedBlueprint || '',
  };

  // Extract markdown sections from AI blueprint if available
  const extractMarkdownSection = (markdown: string, sectionTitle: string): string[] => {
    if (!markdown) return [];
    const regex = new RegExp(
      `## ${sectionTitle}\\s*\\n([\\s\\S]*?)(?=##|$)`,
      'i'
    );
    const match = markdown.match(regex);
    if (!match) return [];
    return match[1]
      .trim()
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.trim().replace(/^[-*]\s*/, ''));
  };

  const getTechStack = () => {
    const stack: string[] = [];

    if (safeProject.platform === 'web' || safeProject.platform === 'both') {
      stack.push('React', 'TypeScript', 'Tailwind');
    }

    if (safeProject.platform === 'mobile' || safeProject.platform === 'both') {
      stack.push('React Native');
    }

    if (safeProject.features.includes('Authentication')) {
      stack.push('Auth0', 'JWT');
    }

    if (safeProject.features.includes('Payment Integration')) {
      stack.push('Stripe', 'Node.js');
    }

    if (safeProject.features.includes('Database Storage')) {
      stack.push('PostgreSQL', 'Redis');
    }

    if (safeProject.features.includes('Real-time Dashboard')) {
      stack.push('WebSocket', 'Chart.js');
    }

    return [...new Set(stack)];
  };

  const getArchitectureDescription = () => {
    // Try to extract from AI blueprint markdown first
    const extractedLayers = extractMarkdownSection(
      safeProject.aiGeneratedBlueprint,
      'Architecture|System Architecture'
    );
    if (extractedLayers.length > 0) {
      return extractedLayers;
    }

    // Fallback: generate dynamic descriptions based on projectData
    const layers: string[] = [];

    layers.push(
      'Frontend Layer - ' +
        (safeProject.platform === 'both'
          ? 'Web & Mobile'
          : safeProject.platform === 'web'
          ? 'Web Application'
          : 'Mobile Application')
    );

    if (safeProject.features.includes('Real-time Dashboard')) {
      layers.push('API Gateway - Request routing & authentication');
    }

    layers.push('Business Logic Layer - Core application services');

    if (safeProject.features.includes('Database Storage')) {
      layers.push('Data Persistence - Relational & caching layers');
    }

    if (safeProject.features.length > 0) {
      layers.push(
        `Feature Integration - ${safeProject.features.slice(0, 2).join(', ')} services`
      );
    }

    return layers;
  };

  const getRoadmapPhases = () => {
    // Try to extract from AI blueprint markdown first
    const extractedPhases = extractMarkdownSection(
      safeProject.aiGeneratedBlueprint,
      'Roadmap|Development Roadmap|Timeline'
    );

    if (extractedPhases.length >= 3) {
      return [
        { title: 'Phase 1', description: extractedPhases[0], duration: 'Weeks 1-3' },
        { title: 'Phase 2', description: extractedPhases[1], duration: 'Weeks 4-8' },
        { title: 'Phase 3', description: extractedPhases[2], duration: 'Weeks 9-10' },
      ];
    }

    // Fallback: generate dynamic roadmap based on projectData
    return [
      {
        title: 'MVP Setup',
        description: `Foundation architecture, ${safeProject.features.length > 0 ? 'core authentication' : 'secure backend'}, and ${
          safeProject.platform === 'both'
            ? 'multi-platform'
            : safeProject.platform === 'web'
            ? 'web'
            : 'mobile'
        } setup.`,
        duration: 'Weeks 1-3',
      },
      {
        title: 'Feature Integration',
        description: `Integrate ${
          safeProject.features.length > 0
            ? safeProject.features.slice(0, 2).join(' & ')
            : 'selected features'
        } functionality, UI refinement, and testing infrastructure for ${safeProject.industry} use case.`,
        duration: 'Weeks 4-8',
      },
      {
        title: 'Launch Strategy',
        description:
          'Performance optimization, security audit, deployment pipeline setup, and production-ready go-live preparation with monitoring.',
        duration: 'Weeks 9-10',
      },
    ];
  };

  const techStack = getTechStack();
  const architectureLayers = getArchitectureDescription();
  const roadmapPhases = getRoadmapPhases();

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Your Project Blueprint</h1>
          <p className="text-neutral-400">
            {safeProject.companyName} • {safeProject.industry}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          <div className="rounded-3xl border border-purple-600/20 bg-neutral-900 p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-purple-400">⚙️</span> Architecture Blueprint
            </h2>
            <div className="space-y-3">
              {architectureLayers.map((layer, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-1 bg-purple-500/50 rounded-full flex-shrink-0" />
                  <p className="text-sm leading-relaxed text-neutral-300">{layer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-purple-600/20 bg-neutral-900 p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-purple-400">🎯</span> Project Scope
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-neutral-400 mb-1">Target Audience</p>
                <p className="text-neutral-200 line-clamp-3">{safeProject.audience}</p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Brand Direction</p>
                <p className="text-neutral-200">{safeProject.aesthetic}</p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Selected Features</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {safeProject.features.map(feature => (
                    <span
                      key={feature}
                      className="inline-block px-3 py-1 rounded-full text-xs bg-purple-600/20 text-purple-200 border border-purple-600/30"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-purple-600/20 bg-neutral-900 p-8 mb-12">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-purple-400">🛠️</span> Recommended Tech Stack
            </h2>
          <div className="flex flex-wrap gap-3">
            {techStack.map(tech => (
              <div
                key={tech}
                className="px-4 py-2 rounded-2xl border border-neutral-700 bg-neutral-800/50 text-sm font-medium text-neutral-200 hover:border-purple-500/50 transition-colors"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-purple-600/20 bg-neutral-900 p-8 mb-12">
          <h2 className="text-xl font-semibold mb-8 flex items-center gap-2">
            <span className="text-purple-400">📋</span> Development Roadmap
          </h2>
          <div className="space-y-6">
            {roadmapPhases.map((phase, idx) => (
              <RoadmapPhase
                key={idx}
                phase={`Phase ${idx + 1}`}
                title={phase.title}
                description={phase.description}
                duration={phase.duration}
              />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-purple-600/20 bg-neutral-900 p-8 mb-12">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-purple-400">📄</span> AI Generated Blueprint
          </h2>
          <pre className="whitespace-pre-wrap text-left text-sm bg-gray-900 p-6 rounded-xl border border-purple-500 text-gray-200 font-mono">
            {safeProject.aiGeneratedBlueprint || 'No generated blueprint is available yet.'}
          </pre>
        </div>

        <div className="flex justify-center mb-8">
          <button
            onClick={onReset}
            className="px-8 py-3 rounded-2xl border border-purple-600/40 bg-purple-600/10 text-purple-200 font-medium hover:bg-purple-600/20 hover:border-purple-500/60 transition-all"
          >
            Forge New Scope
          </button>
        </div>
      </div>
    </div>
  );
}

interface RoadmapPhaseProps {
  phase: string;
  title: string;
  description: string;
  duration: string;
}

function RoadmapPhase({ phase, title, description, duration }: RoadmapPhaseProps) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full border-2 border-purple-500 bg-purple-600/20 flex items-center justify-center text-sm font-semibold text-purple-200">
          {phase.split(' ')[1]}
        </div>
        <div className="w-0.5 h-12 bg-purple-500/30 mt-4" />
      </div>
      <div className="pb-8">
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-xs text-neutral-400 mb-2">{duration}</p>
        <p className="text-sm text-neutral-300 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
