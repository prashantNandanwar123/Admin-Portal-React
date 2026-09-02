import React, { useState } from "react";

import {
  User,
  Landmark,
  CreditCard,
  IndianRupee,
  ClipboardCheck,
  Upload,
  Settings,
  Check
} from "lucide-react";


import EBasicDetails from "./EBasicDetails";
import EAcquiringBank from "./EAcquiringBank";
import EPaymentType from "./EPaymentType";
import EMSFFee from "./EMSFFee";
import EChecklist from "./EChecklist";
import EUploadDocuments from "./EUploadDocuments";
import EIPGConfig from "./EIPGConfig";


export default function MerchantsEditForm({
  merchantData,
  onBack
}) {

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  //  STEP CONFIG
  const steps = [
    {
      title: "Basic Details",
      component: EBasicDetails,
      icon: User,
    },
    {
      title: "Acquiring Bank",
      component: EAcquiringBank,
      icon: Landmark,
    },
    {
      title: "Payment Type",
      component: EPaymentType,
      icon: CreditCard,
    },
    {
      title: "MSF Fee",
      component: EMSFFee,
      icon: IndianRupee,
    },
    {
      title: "Checklist",
      component: EChecklist,
      icon: ClipboardCheck,
    },
    {
      title: "Upload Documents",
      component: EUploadDocuments,
      icon: Upload,
    },
    {
      title: "IPG Config",
      component: EIPGConfig,
      icon: Settings,
    },
  ];

  const CurrentComponent = steps[currentStep].component;

  //  NEXT STEP
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  //  PREVIOUS STEP
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="max-h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar p-5">
      {/*  STEP PROGRESS BAR */}
      <div className="sticky top-0 z-20 bg-white rounded-2xl shadow-sm mb-10 px-8 pt-6 pb-5">

        <div
          className="relative grid items-start"
          style={{
            gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
          }}
        >

          {/* CONNECTING LINES ONLY */}
          <div
            className="absolute top-4 left-[7%] right-[7%] h-[2px] bg-gray-300 z-0"
          />

          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const Icon = step.icon;
            const isFilled = isCompleted || isActive;

            return (
              <div
                key={step.title}
                className="relative z-10 flex flex-col items-center flex-1 min-w-0 px-1"
              >
                {/* Circle */}
                <div
                  className={`
              w-8 h-8 rounded-full flex items-center justify-center
              text-xs font-semibold border transition-all duration-300
              ${isFilled
                      ? "text-white"
                      : "bg-white border-gray-300 text-gray-400"
                    }
            `}
                  style={
                    isFilled
                      ? {
                        backgroundColor: "#fbbf24",
                        borderColor: "#fbbf24",
                      }
                      : undefined
                  }
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon size={16} strokeWidth={1.75} />
                  )}
                </div>

                {/* Label */}
                <p
                  className={`
              mt-1.5 text-[11px] sm:text-xs text-center leading-tight
              ${isActive
                      ? "text-gray-900 font-semibold"
                      : isCompleted
                        ? "text-black font-medium"
                        : "text-gray-400"
                    }
            `}
                >
                  {step.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CURRENT STEP COMPONENT */}
      <CurrentComponent   // Dynamic Component Rendering With Props
        data={formData}
        setData={setFormData}
        errors={errors}
        handleNext={handleNext}
        handleBack={handleBack}
        refId={merchantData}
      />
    </div>
  );
}