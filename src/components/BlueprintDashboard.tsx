import { FormData } from './OnboardingForm';

interface BlueprintDashboardProps {
  formData: FormData;
  onReset: () => void;
}

export default function BlueprintDashboard({ formData, onReset }: BlueprintDashboardProps) {
  const getTechStack = () => {
    const stack: string[] = [];

    if (formData.platform === 'web' || formData.platform === 'both') {
      stack.push('React', 'TypeScript', 'Tailwind');
    }

    if (formData.platform === 'mobile' || formData.platform === 'both') {
      stack.push('React Native');
    }

    if (formData.features.includes('Authentication')) {
      stack.push('Auth0', 'JWT');
    }

    if (formData.features.includes('Payment Integration')) {
      stack.push('Stripe', 'Node.js');
    }

    if (formData.features.includes('Database Storage')) {
      stack.push('PostgreSQL', 'Redis');
    }

    if (formData.features.includes('Real-time Dashboard')) {
      stack.push('WebSocket', 'Chart.js');
    }

    if (formData.integrations) {
      stack.push('REST API', 'Webhooks');
    }

    return [...new Set(stack)];
  };

  const getArchitectureDescription = () => {
    const layers: string[] = [];

    layers.push('Frontend Layer - ' + (formData.platform === 'both' ? 'Web & Mobile' : formData.platform === 'web' ? 'Web Application' : 'Mobile Application'));

    if (formData.features.includes('Real-time Dashboard') || formData.integrations) {
      layers.push('API Gateway - Request routing & authentication');
    }

    layers.push('Business Logic Layer - Core application services');

    if (formData.features.includes('Database Storage')) {
      layers.push('Data Persistence - Relational & caching layers');
    }

    if (formData.integrations) {
      layers.push('Integration Layer - Third-party system connectors');
    }

    return layers;
  };

  const techStack = getTechStack();
  const architectureLayers = getArchitectureDescription();

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Your Project Blueprint</h1>
          <p className="text-neutral-400">
            {formData.companyName} • {formData.industry}
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
                <p className="text-neutral-200 line-clamp-3">{formData.audience}</p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Brand Direction</p>
                <p className="text-neutral-200">{formData.aesthetic}</p>
              </div>
              <div>
                <p className="text-neutral-400 mb-1">Selected Features</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.features.map(feature => (
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
            <RoadmapPhase
              phase="Phase 1"
              title="MVP Setup"
              description="Foundation architecture, core authentication, and basic database schema implementation."
              duration="Weeks 1-3"
            />
            <RoadmapPhase
              phase="Phase 2"
              title="Feature Integration"
              description={`Integrate ${formData.features.slice(0, 2).join(' & ')} functionality, UI refinement, and testing infrastructure.`}
              duration="Weeks 4-8"
            />
            <RoadmapPhase
              phase="Phase 3"
              title="Launch Strategy"
              description="Performance optimization, security audit, deployment pipeline setup, and go-live preparation."
              duration="Weeks 9-10"
            />
          </div>
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
