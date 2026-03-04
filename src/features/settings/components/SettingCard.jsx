import { useState } from "react";
import { useUpdateSetting } from "../api/useUpdateSetting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Check, X, Pencil } from "lucide-react";

export const SettingCard = ({ setting }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(setting.value);
  const updateSettingMutation = useUpdateSetting();

  const handleSave = () => {
    updateSettingMutation.mutate(
      { key: setting.key, value: String(value) },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  const handleCancel = () => {
    setValue(setting.value);
    setIsEditing(false);
  };

  const renderInput = () => {
    switch (setting.dataType?.toLowerCase()) {
      case "bool":
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              checked={value === "true" || value === true}
              onCheckedChange={(checked) =>
                setValue(checked ? "true" : "false")
              }
              disabled={!isEditing}
            />
            <span className="text-sm text-gray-500">
              {value === "true" || value === true ? "Enabled" : "Disabled"}
            </span>
          </div>
        );
      case "int":
      case "integer":
      case "decimal":
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isEditing}
            step={setting.dataType?.toLowerCase() === "int" ? "1" : "0.01"}
          />
        );
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!isEditing}
          />
        );
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{setting.key}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <p className="text-sm text-muted-foreground min-h-[40px]">
          {setting.description || "No description available."}
        </p>

        <div className="space-y-2">
          <Label>Value</Label>
          {renderInput()}
        </div>

        <div className="mt-auto flex justify-end gap-2 pt-4">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={updateSettingMutation.isPending}
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={updateSettingMutation.isPending}
              >
                {updateSettingMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                Save
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-4 h-4 mr-1" /> Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
