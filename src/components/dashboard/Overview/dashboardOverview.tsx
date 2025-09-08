import { BookOpen } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="w-full pt-6">
      <div className="flex items-center gap-8">
        <div className="text-lg font-medium hover:text-muted-foreground rounded-xl cursor-pointer transition-colors duration-200">Overview</div>
        <div className="text-lg font-medium hover:text-muted-foreground gap-3 flex items-center rounded-xl cursor-pointer transition-colors duration-200">
          <BookOpen size={16} /> <span>Documentation</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="grid lg:grid-cols-2  grid-cols-1 gap-6">
          <div className="border rounded-xl p-5 w-full">
            <div className="space-y-1">
              <h4 className="text-lg">Recent Projects</h4>
              <p className="text-sm text-muted-foreground">Your latest development work</p>
            </div>
            <div className="flex flex-col space-y-3 mt-6">
              <div className="w-full flex items-center justify-between bg-neutral-800 rounded-xl p-4">
                <div className="space-y-1">
                  <h3 className="text-xl  font-medium">E-commerce API</h3>
                  <p className="text-sm text-muted-foreground">Node.js • Express</p>
                </div>
                <div className="rounded-lg w-fit text-lg hover:scale-95 cursor-pointer border px-3 py-1">Open</div>
              </div>

              <div className="w-full flex items-center justify-between bg-neutral-800 rounded-xl p-4">
                <div className="space-y-1">
                  <h3 className="text-xl  font-medium">React Dashboard</h3>
                  <p className="text-sm text-muted-foreground">React • TypeScript</p>
                </div>
                <div className="rounded-lg w-fit text-lg hover:scale-95 cursor-pointer border px-3 py-1">Open</div>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-5 w-full">
            <div className="space-y-1">
              <h4 className="text-lg">Development Insights</h4>
              <p className="text-sm text-muted-foreground">Code quality and performance metrics</p>
            </div>
            <div className="flex flex-col space-y-3 mt-6 !text-[#E2C8FF]">
              <div className="w-full flex items-center justify-between bg-neutral-800 rounded-xl p-4">
                <div className="space-y-1">
                  <h3 className="text-xl  font-medium">Code Quality</h3>
                  <p className="text-sm">94% quality score across all projects</p>
                </div>
              </div>

              <div className="w-full flex items-center justify-between bg-neutral-800 rounded-xl p-4">
                <div className="space-y-1">
                  <h3 className="text-xl  font-medium">Performance</h3>
                  <p className="text-sm">15% improvement in build times this month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
