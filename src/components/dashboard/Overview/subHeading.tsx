import { Button } from "@/components/ui/button";
import { Plus, Store } from "lucide-react";

export default function SubHeading(): JSX.Element {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="">
        <h3 className="text-2xl font-medium normal-case">Welcome back, {"user"}!</h3>
        <div className="flex items-center gap-3">
          <Store size={16} />
          <span className="text-lg font-normal text-muted-foreground">Business Owner</span>
        </div>
      </div>

      <div className="">
        <Button variant="default">
          <Plus size={16} />
          Create New Project
        </Button>
      </div>
    </div>
  );
}
