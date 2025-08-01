import React, { useState } from "react";
import { X, MapPin, Code, Wifi, Globe, ArrowRight, Check } from "lucide-react";

interface OnboardingModalProps {
   onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
   const [step, setStep] = useState(1);
   const [formData, setFormData] = useState({
      country: "",
      experience: "",
      primaryLanguage: "",
      internetSpeed: "",
      goals: [] as string[],
   });

   const countries = [
      "Nigeria",
      "Kenya",
      "South Africa",
      "Ghana",
      "Egypt",
      "Morocco",
      "Uganda",
      "Tanzania",
      "Ethiopia",
      "Rwanda",
      "Senegal",
      "Other",
   ];

   const experienceLevels = [
      {
         id: "beginner",
         label: "Beginner (0-1 years)",
         desc: "Just starting my coding journey",
      },
      {
         id: "intermediate",
         label: "Intermediate (2-4 years)",
         desc: "Building projects regularly",
      },
      {
         id: "experienced",
         label: "Experienced (5+ years)",
         desc: "Senior developer or team lead",
      },
      {
         id: "student",
         label: "Student",
         desc: "Learning at university or bootcamp",
      },
   ];

   const programmingLanguages = [
      "JavaScript/TypeScript",
      "Python",
      "Java",
      "PHP",
      "Go",
      "Ruby",
      "C#",
      "Swift",
      "Kotlin",
      "Dart/Flutter",
      "Other",
   ];

   const internetSpeeds = [
      {
         id: "slow",
         label: "Slow (< 2 Mbps)",
         desc: "Need offline-first features",
      },
      {
         id: "moderate",
         label: "Moderate (2-10 Mbps)",
         desc: "Standard connection",
      },
      { id: "fast", label: "Fast (10+ Mbps)", desc: "Good for collaboration" },
   ];

   const goals = [
      "Build my first web application",
      "Land a remote job with international companies",
      "Start a tech startup in Africa",
      "Contribute to open source projects",
      "Learn AI and machine learning",
      "Build mobile apps for African markets",
      "Prepare for coding interviews",
      "Scale my existing business with tech",
   ];

   const handleNext = () => {
      if (step < 4) setStep(step + 1);
   };

   const handleBack = () => {
      if (step > 1) setStep(step - 1);
   };

   const handleGoalToggle = (goal: string) => {
      setFormData((prev) => ({
         ...prev,
         goals: prev.goals.includes(goal)
            ? prev.goals.filter((g) => g !== goal)
            : [...prev.goals, goal],
      }));
   };

   const handleFinish = () => {
      // Save onboarding data and close modal
      console.log("Onboarding completed:", formData);
      onClose();
   };

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
         <div className="bg-white dark:bg-[#161B22] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#30363D]">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                     Welcome to DevAssist
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                     Let's customize your experience for African development
                  </p>
               </div>
               <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-[#262C36] rounded-lg transition-colors"
               >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
               </button>
            </div>

            {/* Progress Bar */}
            <div className="px-6 pt-6">
               <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="flex items-center">
                        <div
                           className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              i <= step
                                 ? "bg-blue-600 text-white"
                                 : "bg-gray-200 dark:bg-[#262C36] text-gray-600 dark:text-gray-400"
                           }`}
                        >
                           {i < step ? <Check className="w-4 h-4" /> : i}
                        </div>
                        {i < 4 && (
                           <div
                              className={`w-16 h-1 mx-2 ${
                                 i < step
                                    ? "bg-blue-600"
                                    : "bg-gray-200 dark:bg-[#262C36]"
                              }`}
                           />
                        )}
                     </div>
                  ))}
               </div>
            </div>

            {/* Step Content */}
            <div className="px-6 pb-6">
               {step === 1 && (
                  <div>
                     <div className="flex items-center space-x-2 mb-4">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                           Where are you coding from?
                        </h3>
                     </div>
                     <p className="text-gray-600 dark:text-gray-400 mb-6">
                        This helps us optimize your experience and provide
                        relevant local resources.
                     </p>
                     <div className="grid grid-cols-2 gap-3">
                        {countries.map((country) => (
                           <button
                              key={country}
                              onClick={() =>
                                 setFormData((prev) => ({ ...prev, country }))
                              }
                              className={`p-3 rounded-lg border text-left transition-colors ${
                                 formData.country === country
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                    : "border-gray-200 dark:border-[#30363D] text-gray-700 dark:text-gray-300 hover:border-blue-500/50"
                              }`}
                           >
                              {country}
                           </button>
                        ))}
                     </div>
                  </div>
               )}

               {step === 2 && (
                  <div>
                     <div className="flex items-center space-x-2 mb-4">
                        <Code className="w-5 h-5 text-green-500" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                           What's your coding experience?
                        </h3>
                     </div>
                     <p className="text-gray-600 dark:text-gray-400 mb-6">
                        We'll tailor our AI assistance to match your skill
                        level.
                     </p>
                     <div className="space-y-3">
                        {experienceLevels.map((level) => (
                           <button
                              key={level.id}
                              onClick={() =>
                                 setFormData((prev) => ({
                                    ...prev,
                                    experience: level.id,
                                 }))
                              }
                              className={`w-full p-4 rounded-lg border text-left transition-colors ${
                                 formData.experience === level.id
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-gray-200 dark:border-[#30363D] hover:border-blue-500/50"
                              }`}
                           >
                              <div className="font-medium text-gray-900 dark:text-white">
                                 {level.label}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                 {level.desc}
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               )}

               {step === 3 && (
                  <div>
                     <div className="flex items-center space-x-2 mb-4">
                        <Wifi className="w-5 h-5 text-purple-500" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                           Tell us about your setup
                        </h3>
                     </div>
                     <p className="text-gray-600 dark:text-gray-400 mb-6">
                        This helps us optimize performance for your connection.
                     </p>

                     <div className="space-y-6">
                        <div>
                           <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                              Primary Programming Language
                           </label>
                           <div className="grid grid-cols-2 gap-2">
                              {programmingLanguages.map((lang) => (
                                 <button
                                    key={lang}
                                    onClick={() =>
                                       setFormData((prev) => ({
                                          ...prev,
                                          primaryLanguage: lang,
                                       }))
                                    }
                                    className={`p-2 rounded text-sm transition-colors ${
                                       formData.primaryLanguage === lang
                                          ? "bg-blue-600 text-white"
                                          : "bg-gray-100 dark:bg-[#262C36] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#30363D]"
                                    }`}
                                 >
                                    {lang}
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
                              Internet Connection
                           </label>
                           <div className="space-y-2">
                              {internetSpeeds.map((speed) => (
                                 <button
                                    key={speed.id}
                                    onClick={() =>
                                       setFormData((prev) => ({
                                          ...prev,
                                          internetSpeed: speed.id,
                                       }))
                                    }
                                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                                       formData.internetSpeed === speed.id
                                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                          : "border-gray-200 dark:border-[#30363D] hover:border-blue-500/50"
                                    }`}
                                 >
                                    <div className="font-medium text-gray-900 dark:text-white">
                                       {speed.label}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                       {speed.desc}
                                    </div>
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {step === 4 && (
                  <div>
                     <div className="flex items-center space-x-2 mb-4">
                        <Globe className="w-5 h-5 text-orange-500" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                           What are your goals?
                        </h3>
                     </div>
                     <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Select all that apply. We'll help you achieve them with
                        personalized guidance.
                     </p>
                     <div className="grid grid-cols-1 gap-3">
                        {goals.map((goal) => (
                           <button
                              key={goal}
                              onClick={() => handleGoalToggle(goal)}
                              className={`p-3 rounded-lg border text-left transition-colors ${
                                 formData.goals.includes(goal)
                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                    : "border-gray-200 dark:border-[#30363D] hover:border-blue-500/50"
                              }`}
                           >
                              <div className="flex items-center space-x-3">
                                 <div
                                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                       formData.goals.includes(goal)
                                          ? "border-blue-500 bg-blue-500"
                                          : "border-gray-300 dark:border-gray-600"
                                    }`}
                                 >
                                    {formData.goals.includes(goal) && (
                                       <Check className="w-3 h-3 text-white" />
                                    )}
                                 </div>
                                 <span className="text-gray-900 dark:text-white">
                                    {goal}
                                 </span>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-[#30363D]">
               <button
                  onClick={handleBack}
                  disabled={step === 1}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
               >
                  Back
               </button>

               <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                     Step {step} of 4
                  </span>
                  {step < 4 ? (
                     <button
                        onClick={handleNext}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                     >
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                     </button>
                  ) : (
                     <button
                        onClick={handleFinish}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                     >
                        Get Started
                     </button>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default OnboardingModal;
