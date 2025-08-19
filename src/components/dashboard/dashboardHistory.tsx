import { Clock, Star, TrendingUp } from "lucide-react";

export default function DashboardHistory(): JSX.Element {
  return (
    <div className="w-full pt-10">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 m-auto justify-center place-content-center gap-6">
        <div className="rounded-xl border w-full p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-lg">Projects</h4>
            <TrendingUp size={16} />
          </div>
          <div className="text-2xl font-bold mt-5">12</div>
          <p className="text-sm text-muted-foreground">+2 from last month</p>
        </div>

        <div className="rounded-xl border w-full p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-lg">AI Sessions</h4>
            <Clock size={16} />
          </div>
          <div className="text-2xl font-bold mt-5">47</div>
          <p className="text-sm text-muted-foreground">This week</p>
        </div>

        <div className="rounded-xl border w-full p-5">
          <div className="flex items-center justify-between">
            <h4 className="text-lg">Success Rate</h4>
            <Star size={16} />
          </div>
          <div className="text-2xl font-bold mt-5">94%</div>
          <p className="text-sm text-muted-foreground">Code quality score</p>
        </div>
      </div>
    </div>
  );
}
