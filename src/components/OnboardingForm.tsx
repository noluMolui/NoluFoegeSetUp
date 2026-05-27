import { useState } from 'react';

interface FormData {
  // Step 1: Profile
  companyName: string;
  contactEmail: string;
  industry: string;
  // Step 2: Tech Scope
  features: string;
  platforms: string;
  integrations: string;
  // Step 3: Brand
  aesthetic: string;
  audience: string;
}

type Step = 1 | 2 | 3;

export default function OnboardingForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>({
    companyName: '',
    contactEmail: '',
    industry: '',
    features: '',
    platforms: '',
    integrations: '',
    aesthetic: '',
    audience: '',
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = (): boolean => {
    if (step === 1) {
      return form.companyName.trim().length > 0 &&
             form.contactEmail.trim().length > 0 &&
             form.industry.trim().length > 0;
    }
    if (step === 2) {
      return form.features.trim().length > 0 &&
             form.platforms.trim().length > 0 &&
             form.integrations.trim().length > 0;
    }
    if (step === 3) {
      return form.aesthetic.trim().length > 0 &&
             form.audience.trim().length > 0;
    }
    return false;
  };

  const handleNext = () => {
    if (!isStepValid()) return;
    if (step < 3) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = () => {
    if (!isStepValid()) return;
    console.log('Form submitted:', form);
    // TODO: send form data to backend
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <ProgressBar currentStep={step} totalSteps={3} />

        <div className="mt-12">
          {step === 1 && <StepOne form={form} onChange={handleChange} />}
          {step === 2 && <StepTwo form={form} onChange={handleChange} />}
          {step === 3 && <StepThree form={form} onChange={handleChange} />}
        </div>

        <div className="mt-12 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-800 text-neutral-300"
          >
            Back
          </button>

          <div className="text-sm text-neutral-500">
            Step {step} of 3
          </div>

          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium transition-all"
            >
              Forge System Scope
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-3">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 mx-1 rounded-full transition-all ${
              i + 1 <= currentStep ? 'bg-purple-600' : 'bg-neutral-800'
            }`}
          />
        ))}
      </div>
      <div className="text-xs text-neutral-500">
        {currentStep === 1 && 'Profile Information'}
        {currentStep === 2 && 'Technical Scope'}
        {currentStep === 3 && 'Brand & Audience'}
      </div>
    </div>
  );
}

interface StepProps {
  form: FormData;
  onChange: (field: keyof FormData, value: string) => void;
}

function StepOne({ form, onChange }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Company Name
        </label>
        <input
          type="text"
          value={form.companyName}
          onChange={e => onChange('companyName', e.target.value)}
          placeholder="Enter your company name"
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Contact Email
        </label>
        <input
          type="email"
          value={form.contactEmail}
          onChange={e => onChange('contactEmail', e.target.value)}
          placeholder="your.email@company.com"
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Industry
        </label>
        <select
          value={form.industry}
          onChange={e => onChange('industry', e.target.value)}
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors cursor-pointer"
        >
          <option value="">Select an industry</option>
          <option value="tech">Technology</option>
          <option value="finance">Finance</option>
          <option value="healthcare">Healthcare</option>
          <option value="retail">Retail</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
}

function StepTwo({ form, onChange }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Desired Features
        </label>
        <textarea
          value={form.features}
          onChange={e => onChange('features', e.target.value)}
          placeholder="Describe the features you need (e.g., user authentication, analytics, dashboards)"
          rows={3}
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Target Platforms
        </label>
        <textarea
          value={form.platforms}
          onChange={e => onChange('platforms', e.target.value)}
          placeholder="Which platforms? (e.g., Web, iOS, Android, Desktop)"
          rows={2}
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Required Integrations
        </label>
        <textarea
          value={form.integrations}
          onChange={e => onChange('integrations', e.target.value)}
          placeholder="What systems need to integrate? (e.g., Stripe, Slack, Salesforce)"
          rows={2}
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors resize-none"
        />
      </div>
    </div>
  );
}

function StepThree({ form, onChange }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Brand Aesthetic
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['Minimal', 'Bold', 'Professional', 'Creative'].map(option => (
            <button
              key={option}
              onClick={() => onChange('aesthetic', option)}
              className={`py-3 px-4 rounded-lg font-medium transition-all ${
                form.aesthetic === option
                  ? 'bg-purple-600 text-white'
                  : 'bg-neutral-900 border border-neutral-700 text-neutral-300 hover:border-neutral-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Target Audience
        </label>
        <textarea
          value={form.audience}
          onChange={e => onChange('audience', e.target.value)}
          placeholder="Describe your target users and their needs"
          rows={3}
          className="w-full px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg focus:outline-none focus:border-purple-600 transition-colors resize-none"
        />
      </div>
    </div>
  );
}
