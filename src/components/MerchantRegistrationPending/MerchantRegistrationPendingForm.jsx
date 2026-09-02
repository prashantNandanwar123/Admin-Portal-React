import React, { useState } from "react";

import PBasicDetails from "./PBasicDetails";
import PAcquiringBank from "./PAcquiringBank";
import PPaymentType from "./PPaymentType";
import PMSFFee from "./PMSFFee";
import PChecklist from "./PChecklist";
import PUploadDocuments from "./PUploadDocuments";
import PIPGConfig from "./PIPGConfig";


export default function MerchantRegistrationPendingForm({
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
      component: PBasicDetails,
    },
    {
      title: "Acquiring Bank",
      component: PAcquiringBank,
    },
    {
      title: "Payment Type",
      component: PPaymentType,
    },
    {
      title: "MSF Fee",
      component: PMSFFee,
    },
    {
      title: "Checklist",
      component: PChecklist,
    },
    {
      title: "Upload Documents",
      component: PUploadDocuments,
    },
    {
      title: "IPG Config",
      component: PIPGConfig,
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

  <MerchantRegistrationPendingForm
    merchantData={merchantData}
    onBack={() => setShowForm(false)}
  />

  return (
    <div className="p-5">
      {/*  STEP PROGRESS BAR */}
      <div className="flex items-center justify-between mb-10 overflow-x-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

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
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-white border-gray-300 text-gray-500"
                    }
                  `}
                >
                  {isCompleted ? "✓" : index + 1}
                </div>

                <p
                  className={`
                    text-sm mt-2 text-center font-medium
                    ${isCompleted
                      ? "text-green-600"
                      : isActive
                        ? "text-orange-500"
                        : "text-gray-500"
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
                      : "bg-gray-300"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/*  CURRENT STEP COMPONENT */}
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