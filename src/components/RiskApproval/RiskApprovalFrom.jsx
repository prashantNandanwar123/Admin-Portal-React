import React, { useState, useEffect } from "react";

import {
  User,
  Landmark,
  CreditCard,
  IndianRupee,
  ClipboardCheck,
  Upload,
  Settings,
} from "lucide-react";

import RBasicDetails from "./RBasicDetails";
import RAcquiringBank from "./RAcquiringBank";
import RPaymentType from "./RPaymentType";
import RMSFFee from "./RMSFFee";
import RChecklist from "./RChecklist";
import RUploadDocuments from "./RUploadDocuments";
import RIPGConfig from "./RIPGConfig";

export default function RiskApprovalFrom({
  merchantData,
  onBack
}) {

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // ✅ STEP CONFIG
  const steps = [
    {
      title: "Basic Details",
      component: RBasicDetails,
      icon: User,
    },
    {
      title: "Acquiring Bank",
      component: RAcquiringBank,
      icon: Landmark,
    },
    {
      title: "Payment Type",
      component: RPaymentType,
      icon: CreditCard,
    },
    {
      title: "MSF Fee",
      component: RMSFFee,
      icon: IndianRupee,
    },
    {
      title: "Checklist",
      component: RChecklist,
      icon: ClipboardCheck,
    },
    {
      title: "Upload Documents",
      component: RUploadDocuments,
      icon: Upload,
    },
    {
      title: "IPG Config",
      component: RIPGConfig,
      icon: Settings,
    },
  ];

  const CurrentComponent = steps[currentStep].component;

  // ✅ NEXT STEP
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // ✅ PREVIOUS STEP
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack?.(); // ✅ Step 0 pe list page pe wapas
    }
  };

  return (
    <div className="max-h-[calc(100vh-180px)] overflow-y-auto hide-scrollbar p-5">

      {/* ✅ STEP PROGRESS BAR */}
      <div className="sticky top-0 z-20 flex items-center bg-[#dde3ab] rounded-full justify-between mb-10 overflow-x-auto py-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const Icon = step.icon;

          return (
            <div
              key={index}
              className="flex items-center w-full"
            >
              {/* STEP CIRCLE */}
              <div className="flex flex-col items-center min-w-[120px]">

                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-bold border-2 transition-all duration-300
                    ${isCompleted
                      ? "bg-green-500 border-green-500 text-black"
                      : isActive
                        ? "bg-white text-black"
                        : "bg-white border-black text-black"
                    }
                  `}
                >
                  {isCompleted ? (
                    "✓"
                  ) : (
                    <Icon size={18} />
                  )}
                </div>

                <p
                  className={`
                    text-sm mt-2 text-center font-medium
                    ${isCompleted
                      ? "text-green-600"
                      : isActive
                        ? "text-black"
                        : "text-black"
                    }
                  `}
                >
                  {step.title}
                </p>
              </div>

              {/* LINE */}
              {index !== steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-2 rounded
                    ${index < currentStep
                      ? "bg-green-500"
                      : "bg-black"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ CURRENT STEP COMPONENT */}
      <CurrentComponent
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