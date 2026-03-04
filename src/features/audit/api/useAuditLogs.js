import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "./getAuditLogs";

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ["audit-logs"],
    queryFn: getAuditLogs,
  });
};
