"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { 
  Loader2, 
  User, 
  Phone, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Check,
  Heart,
  BookOpen,
  Trophy
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface OnboardingFormProps {
  userId: string;
}

interface FormData {
  childName: string;
  childDob: string;
  childGender: string;
  childClass: string;
  schoolname: string;
  phoneNumber: string;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  field: keyof FormData;
  type: 'text' | 'date' | 'select' | 'tel';
  options?: { value: string; label: string; icon?: React.ReactNode }[];
  placeholder?: string;
  validation?: (value: string) => boolean;
}

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    childName: "",
    childDob: "",
    childGender: "",
    childClass: "",
    schoolname: "",
    phoneNumber: "",
  });

  const steps: Step[] = [
    {
      id: 1,
      title: "What's your child's name?",
      subtitle: "We'll use this to personalize their learning journey",
      icon: <User className="h-8 w-8 text-blue-500" />,
      field: "childName",
      type: "text",
      placeholder: "Enter your child's name",
      validation: (value) => value.trim().length >= 2
    },
    {
      id: 2,
      title: "When is their birthday?",
      subtitle: "This helps us create age-appropriate content",
      icon: <Calendar className="h-8 w-8 text-green-500" />,
      field: "childDob",
      type: "date",
      validation: (value) => value.length > 0
    },
    {
      id: 3,
      title: "What's their gender?",
      subtitle: "This helps us provide relevant content",
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      field: "childGender",
      type: "select",
      options: [
        { value: "male", label: "Male", icon: "👦" },
        { value: "female", label: "Female", icon: "👧" }
      ]
    },
    {
      id: 4,
      title: "What grade are they in?",
      subtitle: "We'll tailor the learning content to their level",
      icon: <BookOpen className="h-8 w-8 text-purple-500" />,
      field: "childClass",
      type: "select",
      options: [
        { value: "1", label: "Class 1" },
        { value: "2", label: "Class 2" },
        { value: "3", label: "Class 3" },
        { value: "4", label: "Class 4" },
        { value: "5", label: "Class 5" },
        { value: "6", label: "Class 6" },
        { value: "7", label: "Class 7" },
        { value: "8", label: "Class 8" },
        { value: "9", label: "Class 9" },
        { value: "10", label: "Class 10" },
        { value: "11", label: "Class 11" },
        { value: "12", label: "Class 12" },
        { value: "13", label: "B.Tech" },
        { value: "14", label: "M.Tech" },
        { value: "15", label: "PhD" },
        { value: "16", label: "Other" },
        { value: "17", label: "Prefer not to say" }
      ]
    },
    {
      id: 5,
      title: "What's their school name?",
      subtitle: "This helps us provide relevant content",
      icon: <BookOpen className="h-8 w-8 text-purple-500" />,
      field: "schoolname",
      type: "text",
      placeholder: "Enter your child's school name",
      validation: (value) => value.trim().length >= 2
    },
    {
      id: 6,
      title: "What's your phone number?",
      subtitle: "We'll send you updates about their progress",
      icon: <Phone className="h-8 w-8 text-orange-500" />,
      field: "phoneNumber",
      type: "tel",
      placeholder: "+1234567890",
      validation: (value) => value.length >= 10
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const canProceed = formData[currentStepData.field] && 
    (!currentStepData.validation || currentStepData.validation(formData[currentStepData.field]));

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentStepData.field]: value
    }));
  };

  const handleNext = () => {
    if (canProceed && !isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed) return;
    
    setIsSubmitting(true);

    try {
      console.log("Submitting onboarding data...");
      
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const data = await response.json() as { error?: string };
          throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
        } else {
          const text = await response.text();
          console.error("Non-JSON error response:", text);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      try {
        await response.json() as unknown;
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
      }

      console.log("Onboarding completed successfully");

      // Wait for the database update to propagate
      await new Promise<void>(resolve => setTimeout(resolve, 1500));
      
      console.log("Redirecting to dashboard...");
      
      await router.push("/dashboard");
      
      // Use void to explicitly ignore the promise
      void (async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        window.location.reload();
      })();
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to save onboarding data. Please try again.";
      console.error("Error submitting onboarding data:", error);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = () => {
    switch (currentStepData.type) {
      case 'text':
      case 'tel':
        return (
          <Input
            type={currentStepData.type}
            placeholder={currentStepData.placeholder}
            value={formData[currentStepData.field]}
            onChange={(e) => handleInputChange(e.target.value)}
            className="h-14 text-lg text-center border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            autoFocus
          />
        );
      
      case 'date':
        return (
          <Input
            type="date"
            value={formData[currentStepData.field]}
            onChange={(e) => handleInputChange(e.target.value)}
            className="h-14 text-lg text-center border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            autoFocus
          />
        );
      
      case 'select':
        return (
          <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
            {currentStepData.options?.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleInputChange(option.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  formData[currentStepData.field] === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {option.icon && <span className="text-2xl">{option.icon}</span>}
                  <span className="font-medium">{option.label}</span>
                  {formData[currentStepData.field] === option.value && (
                    <Check className="h-5 w-5 text-blue-500 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0">
          <CardContent >
            <div className="text-center space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="p-4 bg-blue-100 rounded-full">
                  {currentStepData.icon}
                </div>
              </div>

              {/* Title and Subtitle */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentStepData.title}
                </h2>
                <p className="text-gray-600">
                  {currentStepData.subtitle}
                </p>
              </div>

              {/* Input */}
              <div className="mt-8">
                {renderInput()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-6 py-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>

                {isLastStep ? (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canProceed || isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Trophy className="h-4 w-4" />
                        Submit
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed}
                    variant="primary"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 