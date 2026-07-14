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

import BasicDetails from "./MerchantRegistration/BasicDetails";
import AcquiringBank from "./MerchantRegistration/AcquiringBank";
import RPaymentType from "./MerchantRegistration/PaymentType";
import RMSFFee from "./MerchantRegistration/MSFFee";
import Checklist from "./MerchantRegistration/Checklist";
import UploadDocuments from "./MerchantRegistration/UploadDocuments";
import IPGConfig from "./MerchantRegistration/IPGConfig";

export default function MerchantRegistrationForm({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  onBack
}) {

  const [errors, setErrors] = useState({});
  const [view, setView] = useState("list");
  const [formErrors, setFormErrors] = useState({});
  // "list" | "form"

  //  STEP CONFIG
  const steps = [
    {
      title: "Basic Details",
      component: BasicDetails,
      icon: User,
    },
    {
      title: "Acquiring Bank",
      component: AcquiringBank,
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
      component: Checklist,
      icon: ClipboardCheck,
    },
    {
      title: "Upload Documents",
      component: UploadDocuments,
      icon: Upload,
    },
    {
      title: "IPG Config",
      component: IPGConfig,
      icon: Settings,
    },
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

  //  NEXT STEP
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };


  return (
    <div className="max-h-[calc(100vh-100px)] overflow-y-auto hide-scrollbar p-5">
      {/* STEP PROGRESS BAR */}
      <div
        className="sticky top-0 z-20 flex items-center bg-[#dde3ab] rounded-full justify-between mb-10 overflow-x-auto py-4"
      >
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
                   w-12 h-12  bg-white rounded-full flex items-center justify-center
                    font-bold border-2 transition-all duration-300
                    ${isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isActive
                        ? "text-black"
                        : "bg-white border-gray-700 text-gray-500"
                    }
                  `}
                >
                  {isCompleted ? (
                    "✓"
                  ) : (
                    <Icon
                      size={20}
                      className={
                        isCompleted
                          ? "text-green-600"
                          : isActive
                            ? ""
                            : "text-black"
                      }
                    />
                  )}
                </div>

                <p
                  className={`
                    text-sm mt-2 text-center font-medium
                    ${isCompleted
                      ? "text-green-600"
                      : isActive
                        ? ""
                        : "text-gray-800"
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
                      ? "bg-green-800"
                      : "bg-gray-500"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
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