import React, { useState, useEffect } from "react";

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


import VBasicDetails from "./VBasicDetails";
import VAcquiringBank from "./VAcquiringBank";
import VPaymentType from "./VPaymentType";
import VMSFFee from "./VMSFFee";
import VChecklist from "./VChecklist";
import VUploadDocuments from "./VUploadDocuments";
import VIPGConfig from "./VIPGConfig";
import VDirectorDetails from "./VDirectorDetails";

export default function MerchantsViewEditForm({
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
      component: VBasicDetails,
      icon: User,
    },
     {
      title: "Director Details",
      component: VDirectorDetails,
      icon: User,
    },
    {
      title: "Acquiring Bank",
      component: VAcquiringBank,
      icon: Landmark,
    },
    {
      title: "Payment Type",
      component: VPaymentType,
      icon: CreditCard,
    },
    {
      title: "MSF Fee",
      component: VMSFFee,
      icon: IndianRupee,
    },
    {
      title: "Checklist",
      component: VChecklist,
      icon: ClipboardCheck,
    },
    {
      title: "Upload Documents",
      component: VUploadDocuments,
      icon: Upload,
    },
    {
      title: "IPG Config",
      component: VIPGConfig,
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
    } else {
      onBack?.(); // Step 0 pe list page pe wapas
    }
  };

  return (
    <div className="h-full overflow-y-auto hide-scrollbar mx-10 mt-5">
      {/*  STEP PROGRESS BAR */}
      <div
        className="sticky top-0 z-20 mb-8 sm:mb-10 bg-white/80 backdrop-blur rounded-2xl border border-gray-100 overflow-x-auto hide-scrollbar">
        <div className="overflow-x-auto hide-scrollbar py-5 px-8">
        <div className="relative flex items-start justify-between min-w-[900px]">
          {/* CONNECTING LINE (behind circles) */}
          <div className="absolute top-[14px] left-0 right-0 flex items-center px-[60px]">
            <div className="w-full h-[1px] bg-gray-200" />
          </div>

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
                          {/* number circle */}
                          <div
                            className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    text-xs font-semibold border transition-all duration-300
                    ${isFilled ? "text-white" : "bg-white border-gray-300 text-gray-400"}
                  `}
                            style={
                              isFilled
                                ? { backgroundColor: "#fbbf24", borderColor: "#fbbf24" }
                                : undefined
                            }
                          >
                            {isCompleted ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Icon size={16} strokeWidth={1.75} />
                            )}
                          </div>
          
                          {/* label */}
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
      </div>

      {/* CURRENT STEP COMPONENT */}
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