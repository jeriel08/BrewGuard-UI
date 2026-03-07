import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionsCell } from "./ActionsCell";

export const UserDataCard = ({ user, onArchive }) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="font-semibold">ID: {user.id}</div>
        <ActionsCell user={user} onArchive={onArchive} />
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Name:</span>
          <span className="font-medium">
            {user.firstName} {user.lastName}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Email:</span>
          <span className="font-medium text-sm">{user.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Role:</span>
          <Badge variant="outline">{user.role}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Status:</span>
          <Badge variant="outline" className="gap-1.5">
            <span
              className={`size-1.5 rounded-full ${
                user.isActive ? "bg-green-500" : "bg-red-500"
              }`}
              aria-hidden="true"
            />
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
