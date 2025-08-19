import { GitMerge, Link, Mic, MonitorSmartphone, Scaling, Undo2 } from "lucide-react";
import SplitPane from "react-split-pane";

export default function CodePrompt() {
  return (
    <div className="h-screen w-full">
      <SplitPane split="vertical" minSize={200} defaultSize="30%">
        {/* Left - Code Prompt */}
        <div className="flex flex-col justify-end h-full">
          <div className=""></div>
          <div className="flex justify-end px-4">
            <div className="w-full relative">
              <textarea
                className="w-full rounded-sm p-2 text-sm font-medium placeholder:text-muted-foreground h-[10rem] transition-all duration-200 focus:border-blue-500 border-neutral-500 border bg-neutral-900"
                placeholder="How DevAssist help you today?"
              />
              <div className="absolute bottom-5 left-2 flex items-center gap-2">
                <Link size={12} className="cursor-pointer" />
                <Mic size={12} className="cursor-pointer" />
              </div>
            </div>
          </div>
        </div>

        {/* Right - Preview */}
        <div className="w-full pr-5">
          <div className="space-y-3">
            <div className="flex items-center w-fit gap-3 rounded-full bg-neutral-900 p-1">
              <div className="text-sm font-medium bg-black cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center">Code</div>
              <div className="text-sm font-medium text-blue-500 bg-black cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center">
                Preview
              </div>
            </div>

            <div className="flex justify-between w-full items-center gap-4">
              <Undo2 size={17} className="cursor-pointer" />
              <div className="flex relative w-full">
                <div className="absolute top-2 left-3">
                  <GitMerge size={13} />
                </div>
                <input type="text" className="border rounded-full w-full h-[2rem] pl-10 text-sm" value={"5173 /"} />
              </div>
              <MonitorSmartphone size={17} className="cursor-pointer" />
              <Scaling size={17} className="cursor-pointer" />
            </div>
          </div>
          <div className="max-h-full h-[100vh] bg-neutral-900 overflow-auto rounded-sm p-4 mt-4"></div>
        </div>
      </SplitPane>
    </div>
  );
}
