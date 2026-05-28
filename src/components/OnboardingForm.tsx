import { useState } from 'react';
import BlueprintDashboard from './BlueprintDashboard';

export interface FormData {
  // Step 1: Profile
  companyName: string;
  contactEmail: string;
  industry: string;
  // Step 2: Tech Scope
  features: string[];
  platform: 'web' | 'mobile' | 'both' | '';
  integrations: string;
  // Step 3: Brand
  aesthetic: string;
  audience: string;
}

type Step = 1 | 2 | 3;

export default function OnboardingForm() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState({
    companyName: '',
    email: '',
    industry: '',
  });
  const [form, setForm] = useState<FormData>({
    companyName: '',
    contactEmail: '',
    industry: '',
    features: [],
    platform: '',
    integrations: '',
    aesthetic: '',
    audience: '',
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (field: keyof Omit<FormData, 'features' | 'platform'>, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({
      ...prev,
      [field === 'contactEmail' ? 'email' : field]: '',
    }));
  };

  const toggleFeature = (feature: string) => {
    setForm(prev => {
      const hasFeature = prev.features.includes(feature);
      return {
        ...prev,
        features: hasFeature
          ? prev.features.filter(item => item !== feature)
          : [...prev.features, feature],
      };
    });
  };

  const setPlatform = (platform: FormData['platform']) => {
    setForm(prev => ({ ...prev, platform }));
  };

  const isStepValid = (): boolean => {
    if (step === 1) {
      return form.companyName.trim().length > 0 &&
             form.contactEmail.trim().length > 0 &&
             form.industry.trim().length > 0;
    }
    if (step === 2) {
      return form.features.length > 0 &&
             form.platform.trim().length > 0 &&
             form.integrations.trim().length > 0;
    }
    if (step === 3) {
      return form.aesthetic.trim().length > 0 &&
             form.audience.trim().length > 0;
    }
    return false;
  };

  const validateStepOne = () => {
    const nextErrors = {
      companyName: '',
      email: '',
      industry: '',
    };

    if (form.companyName.trim().length === 0) {
      nextErrors.companyName = 'Company name is required.';
    }
    if (!emailRegex.test(form.contactEmail.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (form.industry.trim().length === 0) {
      nextErrors.industry = 'Please select an industry.';
    }

    setErrors(nextErrors);
    return !nextErrors.companyName && !nextErrors.email && !nextErrors.industry;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStepOne()) return;
    } else if (!isStepValid()) {
      return;
    }
    if (step < 3) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleSubmit = () => {
    if (!isStepValid() || isSubmitting) return;
    const payload = { ...form };
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
      console.log('Final scope data:', payload);
    }, 3000);
  };

  const handleReset = () => {
    setIsComplete(false);
    setStep(1);
    setForm({
      companyName: '',
      contactEmail: '',
      industry: '',
      features: [],
      platform: '',
      integrations: '',
      aesthetic: '',
      audience: '',
    });
  };

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-8">
        <div className="max-w-lg w-full rounded-3xl border border-purple-600/20 bg-neutral-900/95 p-10 text-center shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-300 mb-6">
            Forging your custom system architecture...
          </p>
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-purple-500/40 bg-purple-600/10 text-purple-200">
            <span className="animate-spin block h-8 w-8 rounded-full border-4 border-t-transparent border-purple-300" />
          </div>
          <p className="mt-6 text-neutral-300">
            Simulating a backend AI scope call, hang tight for a few seconds.
          </p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return <BlueprintDashboard formData={form} onReset={handleReset} />;
  }

  return (
      <div className="min-h-screen bg-neutral-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <ProgressBar currentStep={step} totalSteps={3} />

        <div className="mt-12">
          {step === 1 && <StepOne form={form} onChange={handleChange} errors={errors} />}
          {step === 2 && (
            <StepTwo
              form={form}
              onChange={handleChange}
              toggleFeature={toggleFeature}
              setPlatform={setPlatform}
            />
          )}
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
  onChange: (field: keyof Omit<FormData, 'features' | 'platform'>, value: string) => void;
}

interface StepOneProps extends StepProps {
  errors: {
    companyName: string;
    email: string;
    industry: string;
  };
}

interface StepTwoProps extends StepProps {
  toggleFeature: (feature: string) => void;
  setPlatform: (platform: FormData['platform']) => void;
}

function StepOne({ form, onChange, errors }: StepOneProps) {
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
        {errors.companyName && (
          <p className="mt-2 text-sm text-red-500">{errors.companyName}</p>
        )}
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
        {errors.email && (
          <p className="mt-2 text-sm text-red-500">{errors.email}</p>
        )}
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
        {errors.industry && (
          <p className="mt-2 text-sm text-red-500">{errors.industry}</p>
        )}
      </div>
    </div>
  );
}

function StepTwo({ form, onChange, toggleFeature, setPlatform }: StepTwoProps) {
  const featureOptions = [
    'Authentication',
    'Payment Integration',
    'Database Storage',
    'Real-time Dashboard',
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-neutral-300 mb-3">
          Select the features that matter most.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {featureOptions.map(option => {
            const active = form.features.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleFeature(option)}
                className={`w-full rounded-3xl border p-5 text-left transition-all ${
                  active
                    ? 'border-purple-500 bg-purple-600/15 shadow-sm'
                    : 'border-neutral-800 bg-neutral-900 hover:border-purple-500/60'
                }`}
              >
                <div className="text-sm font-semibold text-white">{option}</div>
                <div className="mt-2 text-xs text-neutral-400">
                  {active ? 'Included in scope' : 'Tap to add to scope'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-3">
          Target Platform
        </label>
        <div className="flex gap-3 rounded-3xl border border-neutral-800 bg-neutral-900 p-2">
          {['web', 'mobile', 'both'].map(option => {
            const label = option === 'both' ? 'Both' : option.charAt(0).toUpperCase() + option.slice(1);
            const selected = form.platform === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setPlatform(option as FormData['platform'])}
                className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  selected
                    ? 'border-purple-500 bg-purple-600/15 text-white'
                    : 'border-transparent text-neutral-300 hover:border-purple-500/40'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Required Integrations
        </label>
        <textarea
          value={form.integrations}
          onChange={e => onChange('integrations', e.target.value)}
          placeholder="What systems need to integrate? (e.g., Stripe, Slack, Salesforce)"
          rows={3}
          className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-3xl focus:outline-none focus:border-purple-600 transition-colors resize-none"
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
          Target Audience Description
        </label>
        <textarea
          value={form.audience}
          onChange={e => onChange('audience', e.target.value)}
          placeholder="e.g., Young professionals looking for quick fitness tracking..."
          rows={5}
          className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-3xl focus:outline-none focus:border-purple-600 transition-colors resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Preferred Brand Aesthetic
        </label>
        <select
          value={form.aesthetic}
          onChange={e => onChange('aesthetic', e.target.value)}
          className="w-full px-4 py-3 bg-neutral-900 border border-neutral-700 rounded-3xl focus:outline-none focus:border-purple-600 transition-colors cursor-pointer"
        >
          <option value="">Select an aesthetic</option>
          <option value="Minimalist Dark">Minimalist Dark</option>
          <option value="Bright & Playful">Bright & Playful</option>
          <option value="Corporate Clean">Corporate Clean</option>
        </select>
      </div>
    </div>
  );
}
