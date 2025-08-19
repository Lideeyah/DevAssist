import DashboardHistory from "@/components/dashboard/dashboardHistory";
import DashboardOverview from "@/components/dashboard/dashboardOverview";
import SubHeading from "@/components/dashboard/SubHeading";

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
