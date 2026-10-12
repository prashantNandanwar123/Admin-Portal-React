import { useState } from "react";
import {
  User,
  QrCode,
  Landmark,
  IndianRupee,
  Upload,
  Settings,
  Check,
} from "lucide-react";

import PBasicDetails from "./PBasicDetails";
import PDirectorDetails from "./PDirectorDetails";
import PAcquiringBank from "./PAcquiringBank";
import PPaymentType from "./PPaymentType";
import PMSFFee from "./PMSFFee";
import PCompanyDocuments from "./PCompanyDocuments";
import PIPGConfig from "./PIPGConfig";

export default function MerchantRegistrationPendingForm({ merchantData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const steps = [
    { title: "Basic Details", component: PBasicDetails, icon: User },
    { title: "Director Details", component: PDirectorDetails, icon: User },
    { title: "Acquiring Bank", component: PAcquiringBank, icon: Landmark },
    { title: "Payment Type", component: PPaymentType, icon: QrCode },
    { title: "MSF Fee", component: PMSFFee, icon: IndianRupee },
    { title: "Company Documents", component: PCompanyDocuments, icon: Upload },
    { title: "IPG Config", component: PIPGConfig, icon: Settings },
  ];

  //  STEP CONFIG
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
    <div className="p-5">
      {/*  STEP PROGRESS BAR */}
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