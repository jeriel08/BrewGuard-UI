import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCapaLogById } from "@/features/capa/api/capaService";
import { useCloseCapa } from "@/features/capa/api/useCloseCapa";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ArrowLeft,
  FileDown,
  FlaskConical,
  ClipboardList,
  CheckCircle,
} from "lucide-react";
import AnalysisSection from "./components/AnalysisSection";
import ActionPlanSection from "./components/ActionPlanSection";

const sidebarNavItems = [
  {
    key: "analysis",
    title: "Analysis",
    icon: <FlaskConical className="mr-2 h-4 w-4" />,
  },
  {
    key: "action-plan",
    title: "Action Plan",
    icon: <ClipboardList className="mr-2 h-4 w-4" />,
  },
];

const CapaLogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [capaLog, setCapaLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("analysis");
  const [approveOpen, setApproveOpen] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState("");
  const closeCapaMutation = useCloseCapa();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getCapaLogById(id);
        setCapaLog(data);
      } catch (err) {
        console.error("Failed to load CAPA log details", err);
        setError("Failed to load CAPA log details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSavePdf = () => {
    window.print();
  };

  const handleApprove = async () => {
    if (!verificationNotes.trim()) {
      toast.error("Verification notes are required.");
      return;
    }

    try {
      await closeCapaMutation.mutateAsync({
        capaId: parseInt(id, 10),
        verificationNotes,
      });
      toast.success("CAPA Log approved and NCR closed successfully.");
      setApproveOpen(false);
      navigate("/quality-reports");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to approve CAPA log. Please ensure all action plans are completed.",
      );
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-48" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex flex-col lg:flex-row gap-8">
          <Skeleton className="h-10 w-full lg:w-1/5" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-4 md:px-8 md:pt-4 pt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate("/capa-logs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to CAPA Logs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-0 pb-16 md:px-8 md:pt-4 pt-6 md:block">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/capa-logs")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">
              CAPA #{capaLog.id || capaLog.Id}
            </h2>
            <p className="text-muted-foreground">
              Investigation details and action plans.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user?.role === "Quality Inspector" &&
            (capaLog.ncrStatus === "Investigation In Progress" ||
              capaLog.ncrStatus === "Investigation in Progress") && (
              <Button onClick={() => setApproveOpen(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            )}
          <Button variant="outline" onClick={handleSavePdf}>
            <FileDown className="mr-2 h-4 w-4" />
            Save to PDF
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Settings-style Layout */}
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0">
        <aside className="lg:w-1/5 lg:border-r-2 lg:border-border lg:pr-6">
          <nav
            className={cn(
              "flex overflow-x-auto space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
            )}
          >
            {sidebarNavItems.map((item) => (
              <Button
                key={item.key}
                variant="secondary"
                className={cn(
                  activeSection === item.key
                    ? "bg-secondary hover:underline"
                    : "bg-transparent hover:bg-secondary hover:underline",
                  "justify-start w-full cursor-pointer shrink-0 min-w-fit",
                )}
                onClick={() => setActiveSection(item.key)}
              >
                {item.icon}
                {item.title}
              </Button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl lg:pl-6">
          {activeSection === "analysis" && (
            <AnalysisSection capaLog={capaLog} />
          )}
          {activeSection === "action-plan" && (
            <ActionPlanSection
              actionPlans={capaLog.actionPlans || capaLog.ActionPlans || []}
            />
          )}
        </div>
      </div>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve CAPA & Close NCR</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Verification Notes</Label>
              <Textarea
                placeholder="Enter notes on how this CAPA was verified..."
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
              />
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Note</AlertTitle>
              <AlertDescription>
                Approving this CAPA logic will definitively close the associated
                NCR. Ensure all Action Plans are properly completed before
                proceeding.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={closeCapaMutation.isPending}
            >
              {closeCapaMutation.isPending
                ? "Approving..."
                : "Confirm Approval"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CapaLogDetails;
