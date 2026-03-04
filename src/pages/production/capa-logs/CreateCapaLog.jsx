import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getPendingCapaNcrs } from "@/features/ncr/api/ncrService";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserSelect } from "@/components/common/UserSelect";
import { DatePicker } from "@/pages/procurement/components/DatePicker";
import { useAuth } from "@/context/AuthContext";
import { useCreateCapaAnalysis } from "@/features/capa/api/useCreateCapaAnalysis";
import { useCreateActionPlan } from "@/features/capa/api/useCreateActionPlan";
import { RootCauseForm } from "./components/RootCauseForm";
import { ActionPlanForm } from "./components/ActionPlanForm";
import { CapaSummaryStep } from "./components/CapaSummaryStep";

import { defineStepper } from "@stepperize/react";

const { useStepper, steps } = defineStepper(
  {
    id: "root-cause",
    title: "Root Cause Analysis",
    description: "Identify the fundamental issue",
  },
  {
    id: "action-plan",
    title: "Action Plan",
    description: "Preventative & corrective actions",
  },
  {
    id: "summary",
    title: "Summary",
    description: "Review and submit",
  },
);

const CreateCapaLog = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ncrIdParam = searchParams.get("ncrId");
  const stepper = useStepper();
  const currentIndex = stepper.state.current.index;
  const { user } = useAuth();

  const createAnalysisMutation = useCreateCapaAnalysis();
  const createActionMutation = useCreateActionPlan();

  const [formData, setFormData] = useState({
    rootCauseCategory: "",
    why1: "",
    why2: "",
    why3: "",
    why4: "",
    why5: "",
    correctiveAction: "",
    preventiveAction: "",
    assignedTo: "",
    dueDate: "",
  });

  const [selectedNcr, setSelectedNcr] = useState(null);
  const [loadingNcr, setLoadingNcr] = useState(!!ncrIdParam);

  useEffect(() => {
    if (ncrIdParam) {
      const fetchNcr = async () => {
        try {
          const ncrs = await getPendingCapaNcrs();
          const ncr = ncrs.find((n) => n.id.toString() === ncrIdParam);
          setSelectedNcr(ncr || null);
        } catch (error) {
          toast.error("Failed to fetch NCR details.");
        } finally {
          setLoadingNcr(false);
        }
      };
      fetchNcr();
    }
  }, [ncrIdParam]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNextStep = () => {
    if (stepper.state.current.data.id === "root-cause") {
      const { rootCauseCategory, why1, why2, why3, why4, why5 } = formData;
      if (!rootCauseCategory || !why1 || !why2 || !why3 || !why4 || !why5) {
        toast.error("Please fill in all analysis fields before proceeding.");
        return;
      }
    } else if (stepper.state.current.data.id === "action-plan") {
      if (!formData.correctiveAction && !formData.preventiveAction) {
        toast.error("Please provide at least one action plan.");
        return;
      }
      if (!formData.assignedTo || !formData.dueDate) {
        toast.error("Please assign the task and set a due date.");
        return;
      }
    }
    stepper.navigation.next();
  };

  const handleSubmit = async () => {
    try {
      // 1. Create Capa Analysis
      const analysisPayload = {
        ncrId: parseInt(ncrIdParam, 10),
        rootCauseCategory: formData.rootCauseCategory,
        why1: formData.why1,
        why2: formData.why2,
        why3: formData.why3,
        why4: formData.why4,
        why5RootCause: formData.why5,
      };

      const analysisResult =
        await createAnalysisMutation.mutateAsync(analysisPayload);
      const capaId = analysisResult.capaId;

      if (!capaId) throw new Error("CAPA ID was not returned.");

      // 2. Create Action Plans
      const actionPlans = [];
      if (formData.correctiveAction) {
        actionPlans.push({
          capaId,
          description: `Corrective: ${formData.correctiveAction}`,
          deadline: new Date(formData.dueDate).toISOString(),
          assignedToUserId: parseInt(formData.assignedTo, 10),
        });
      }
      if (formData.preventiveAction) {
        actionPlans.push({
          capaId,
          description: `Preventative: ${formData.preventiveAction}`,
          deadline: new Date(formData.dueDate).toISOString(),
          assignedToUserId: parseInt(formData.assignedTo, 10),
        });
      }

      for (const ap of actionPlans) {
        await createActionMutation.mutateAsync(ap);
      }

      toast.success("CAPA Log saved successfully!");
      navigate("/production/capa-logs");
    } catch (error) {
      toast.error("Failed to save CAPA Log.");
      console.error(error);
    }
  };

  const isSubmitting =
    createAnalysisMutation.isPending || createActionMutation.isPending;

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto p-4 md:px-8 md:pt-4 pt-6 w-full h-full">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Write CAPA Log
            </h2>
            <p className="text-muted-foreground">
              Document root cause analysis and action plans.
            </p>
          </div>
        </div>

        {/* Stepper Navigation */}
        <nav aria-label="CAPA Steps" className="mt-6">
          <ol
            className="flex items-center gap-2 overflow-x-auto pb-2"
            aria-orientation="horizontal"
          >
            {stepper.state.all.map((step, index) => {
              const isCompleted = currentIndex > index;
              const isCurrent = stepper.state.current.data.id === step.id;

              return (
                <li key={step.id} className="flex items-center gap-2 shrink-0">
                  <Button
                    type="button"
                    variant={
                      isCurrent ? "default" : isCompleted ? "outline" : "ghost"
                    }
                    className={`rounded-full h-8 w-8 p-0 flex items-center justify-center shrink-0 ${isCompleted ? "border-primary text-primary" : ""}`}
                    onClick={() => stepper.navigation.goTo(step.id)}
                    disabled={index > currentIndex} // User must use 'Next Step' to validate forward movement
                  >
                    {index + 1}
                  </Button>
                  <div
                    className={`flex-col ${isCurrent ? "flex" : "hidden sm:flex"}`}
                  >
                    <span
                      className={`text-sm font-medium ${isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.title}
                    </span>
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {step.description}
                    </span>
                  </div>
                  {index < stepper.state.all.length - 1 && (
                    <div className="h-px w-8 sm:w-16 bg-border mx-2" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {stepper.flow.switch({
        "root-cause": () => (
          <RootCauseForm
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            ncrIdParam={ncrIdParam}
            selectedNcr={selectedNcr}
            loadingNcr={loadingNcr}
          />
        ),
        "action-plan": () => (
          <ActionPlanForm
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            user={user}
          />
        ),
        summary: () => (
          <CapaSummaryStep formData={formData} selectedNcr={selectedNcr} />
        ),
      })}

      <div className="flex justify-between items-center mt-8 pb-8 pt-4 border-t">
        <Button
          variant="outline"
          onClick={
            stepper.state.isFirst ? () => navigate(-1) : stepper.navigation.prev
          }
        >
          {stepper.state.isFirst ? "Cancel" : "Back"}
        </Button>
        <Button
          onClick={stepper.state.isLast ? handleSubmit : handleNextStep}
          disabled={stepper.state.isLast && isSubmitting}
        >
          {stepper.state.isLast ? (
            <>
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save CAPA Log
                </>
              )}
            </>
          ) : (
            "Next Step"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateCapaLog;
