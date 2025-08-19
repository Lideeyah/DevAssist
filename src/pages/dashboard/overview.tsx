import DashboardHistory from "@/components/dashboard/Overview/dashboardHistory";
import DashboardOverview from "@/components/dashboard/Overview/dashboardOverview";
import SubHeading from "@/components/dashboard/Overview/SubHeading";

export default function Overview() {
  return (
    <div className="w-full">
      <div className="">
        <SubHeading />
        <DashboardHistory />
        <DashboardOverview />
      </div>
    </div>
  );
}
