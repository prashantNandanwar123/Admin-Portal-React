import React, { useState, useEffect } from "react";

import {
  User,
  Landmark,
  CreditCard,
  IndianRupee,
  ClipboardCheck,
  Upload,
  Settings,
  Check,
} from "lucide-react";

import BasicDetails from "./MerchantRegistration/BasicDetails";
import DirectorDetails from "./MerchantRegistration/DirectorDetails";
import AcquiringBank from "./MerchantRegistration/AcquiringBank";
import RPaymentType from "./MerchantRegistration/PaymentType";
import RMSFFee from "./MerchantRegistration/MSFFee";
// import Checklist from "./MerchantRegistration/Checklist";
// import UploadDocuments from "./MerchantRegistration/UploadDocuments";
import CompanyDocuments from "./MerchantRegistration/CompanyDocuments";

import IPGConfig from "./MerchantRegistration/IPGConfig";

export default function MerchantRegistrationForm({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  onBack,
}) {
  const [errors, setErrors] = useState({});
  const [view, setView] = useState("list");
  const [formErrors, setFormErrors] = useState({});
  // "list" | "form"

  // STEP CONFIG
  const steps = [
    { title: "Basic Details", component: BasicDetails, icon: User },
    { title: "Director Details", component: DirectorDetails, icon: User },
    { title: "Acquiring Bank", component: AcquiringBank, icon: Landmark },
    { title: "Payment Type", component: RPaymentType, icon: CreditCard },
    { title: "MSF Fee", component: RMSFFee, icon: IndianRupee },
    // { title: "Checklist", component: Checklist, icon: ClipboardCheck },
    // { title: "Upload Documents", component: UploadDocuments, icon: Upload },
    { title: "Company Documents", component: CompanyDocuments, icon: Upload },

    { title: "IPG Config", component: IPGConfig, icon: Settings },
  ];

  const CurrentComponent = steps[currentStep].component;

  useEffect(() => {
    return () => {
      // Component unmount hone pe step reset
      setCurrentStep(0);
    };
  }, []);

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack?.(); // Step 0 pe "Back" = list page pe wapas
    }
  };

  // NEXT STEP
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="relative lg:p-5 p-4 sm:p-10">
      {/* STEP PROGRESS BAR */}
      <div className="sticky top-0 z-20 mb-8 sm:mb-10 bg-white/80 backdrop-blur rounded-2xl px-3 sm:px-6 py-5 shadow-sm border border-gray-100 overflow-x-auto hide-scrollbar">
        <div className="relative flex items-start min-w-[720px] lg:min-w-0">
          {/* base track line */}
          <div
            className="absolute top-4 h-[2px] bg-gray-200"
            style={{
              left: `calc(50% / ${steps.length})`,
              right: `calc(50% / ${steps.length})`,
            }}
          />

          {/* progress line */}
          <div
            className="absolute top-4 h-[2px] bg-amber-400 transition-all duration-300"
            style={{
              left: `calc(50% / ${steps.length})`,
              width: `calc((100% - (100% / ${steps.length})) * ${currentStep / (steps.length - 1)
                })`,
            }}
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

      {/* CURRENT STEP COMPONENT */}
      <CurrentComponent
        data={formData}
        setData={setFormData}
        errors={errors}
        handleNext={handleNext}
        handleBack={handleBack}
      />
    </div>
  );
}