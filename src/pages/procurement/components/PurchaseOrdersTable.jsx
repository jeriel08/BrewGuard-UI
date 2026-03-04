import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Archive,
  RotateCcw,
  Edit,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";

const PurchaseOrdersTable = ({
  data,
  isArchivedView,
  onArchive,
  onRestore,
  onUpdateSuccess,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionType, setActionType] = useState(null); // 'receive' | 'cancel'

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      await api.patch(`/inventory/shipments/${id}/status`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["shipments"]);
      toast.success(
        `Order ${variables.status === "Received" ? "marked as received" : "cancelled"} successfully.`,
      );
      setConfirmationOpen(false);
      setSelectedOrder(null);
      setActionType(null);
      if (onUpdateSuccess) onUpdateSuccess();
    },
    onError: (error) => {
      console.error("Failed to update status", error);
      toast.error(
        error.response?.data ||
          "Failed to update order status. Please try again.",
      );
    },
  });

  const handleActionClick = (order, type) => {
    setSelectedOrder(order);
    setActionType(type);
    setConfirmationOpen(true);
  };

  const confirmAction = () => {
    if (!selectedOrder || !actionType) return;
    const status = actionType === "receive" ? "Received" : "Cancelled";
    updateStatusMutation.mutate({ id: selectedOrder.id, status });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gray-500";
      case "Received":
        return "bg-green-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Received By</TableHead>
            <TableHead>Received At</TableHead>
            <TableHead>Expected Delivery</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            data.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">
                  {shipment.invoiceNumber}
                </TableCell>
                <TableCell>{shipment.supplierName}</TableCell>
                <TableCell>
                  {shipment.receivedBy === "Unknown" || !shipment.receivedBy
                    ? "-"
                    : shipment.receivedBy}
                </TableCell>
                <TableCell>
                  {shipment.receivedAt
                    ? format(new Date(shipment.receivedAt), "PPP")
                    : "-"}
                </TableCell>
                <TableCell>
                  {shipment.expectedDeliveryDate
                    ? format(new Date(shipment.expectedDeliveryDate), "PPP")
                    : "-"}
                </TableCell>
                <TableCell>
                  {shipment.createdAt
                    ? format(new Date(shipment.createdAt), "PPP")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${getStatusColor(
                        shipment.status,
                      )}`}
                    />
                    {shipment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/purchase-orders/${shipment.id}`)
                        }
                      >
                        <Eye className="h-4 w-4 hover:text-white" />
                        View Details
                      </DropdownMenuItem>

                      {isArchivedView ? (
                        onRestore && (
                          <DropdownMenuItem
                            onClick={() => onRestore(shipment.id)}
                          >
                            <RotateCcw className="h-4 w-4 hover:text-white" />
                            Restore
                          </DropdownMenuItem>
                        )
                      ) : (
                        <>
                          {shipment.status === "Pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/purchase-orders/${shipment.id}/edit`,
                                  )
                                }
                              >
                                <Edit className="h-4 w-4 hover:text-white" />
                                Edit Order
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleActionClick(shipment, "receive")
                                }
                              >
                                <CheckCircle className="h-4 w-4 hover:text-white" />
                                Mark as Received
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleActionClick(shipment, "cancel")
                                }
                              >
                                <XCircle className="h-4 w-4 hover:text-white" />
                                Cancel Order
                              </DropdownMenuItem>
                            </>
                          )}
                          {["Received", "Completed", "Delivered"].includes(
                            shipment.status,
                          ) &&
                            onArchive && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => onArchive(shipment.id)}
                                  className="flex items-center gap-2 text-destructive focus:bg-destructive focus:text-white"
                                >
                                  <Archive className="h-4 w-4 hover:text-white" />
                                  Archive Order
                                </DropdownMenuItem>
                              </>
                            )}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "receive"
                ? "Confirm Receipt"
                : "Confirm Cancellation"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "receive"
                ? `Are you sure you want to mark Invoice #${selectedOrder?.invoiceNumber} as received? This will update the inventory stock.`
                : `Are you sure you want to cancel Invoice #${selectedOrder?.invoiceNumber}? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmationOpen(false)}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === "receive" ? "default" : "destructive"}
              onClick={confirmAction}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrdersTable;
