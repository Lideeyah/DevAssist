import { useState, useRef } from "react";
import { GitMerge, Link, Mic, MonitorSmartphone, Scaling, SendHorizonal, Undo2 } from "lucide-react";
import SplitPane from "react-split-pane";
import { Button } from "@/components/ui/button";

export default function CodePrompt() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [deviceSize, setDeviceSize] = useState<"desktop" | "laptop" | "phone">("desktop");
  const [splitSize, setSplitSize] = useState(310);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    setSplitSize(isFullScreen ? 310 : 0);
  };

  const toggleDeviceSize = () => {
    const sizes: ("desktop" | "laptop" | "phone")[] = ["desktop", "laptop", "phone"];
    const currentIndex = sizes.indexOf(deviceSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setDeviceSize(sizes[nextIndex]);
  };

  const handleSplitChange = (newSize: number) => {
    setSplitSize(newSize);
    setIsFullScreen(newSize < 10);
  };

  const getDeviceWidth = () => {
    switch (deviceSize) {
      case "phone":
        return "375px";
      case "laptop":
        return "650px";
      default:
        return "100%";
    }
  };

  return (
    <div className="max-h-full h-[calc(100vh-75px)] w-full flex overflow-hidden">
      <SplitPane
        split="vertical"
        minSize={isFullScreen ? 0 : 200}
        maxSize={isFullScreen ? 0 : 70}
        size={splitSize}
        defaultSize={35}
        onChange={handleSplitChange}
        className="!overflow-visible"
      >
        {/* Left - Simple Code Prompt (as shown in image) */}
        {!isFullScreen ? (
          <div className="flex flex-col w-full justify-end max-h-full h-[calc(100vh-78px)] px-4 py-2">
            <div className="overflow-auto">
              <div className="flex-1 border rounded-xs mb-5 flex w-full">
                <div className="rounded-xs bg-neutral-900 w-full h-fit flex text-sm p-1 text-muted-foreground place-content-end">Code Prompt</div>
              </div>
              <div className="flex-1 border rounded-xs mb-10 flex w-full">
                <div className="rounded-xs bg-neutral-900 w-full h-fit flex text-sm p-1 text-muted-foreground place-content-start">
                  DevAssist response
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-full relative group">
                <textarea
                  className="w-full rounded-sm p-2 text-sm font-medium placeholder:text-muted-foreground h-[9rem] transition-all duration-200 focus:border-blue-500 border-neutral-500 border bg-neutral-900 group"
                  placeholder="How DevAssist help you today?"
                />
                <div className="absolute bottom-3 left-2 flex items-center gap-2">
                  <Link size={12} className="cursor-pointer hover:text-blue-500" />
                  <Mic size={12} className="cursor-pointer hover:text-blue-500" />
                </div>
                <div className="absolute bottom-3 right-2 hidden group-focus-within:flex items-center gap-2">
                  <Button>
                    <SendHorizonal size={17} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden"></div>
        )}

        {/* Right - Preview with all interactive features */}
        <div className={`w-full pr-5 max-h-full h-[calc(100vh-1000px)] ${isFullScreen ? "pl-5" : ""}`}>
          <div className="space-y-3">
            <div className="flex items-center w-fit gap-3 rounded-full bg-neutral-900 p-1">
              <div className="text-sm font-medium bg-black cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center">Code</div>
              <div className="text-sm font-medium text-blue-500 bg-black cursor-pointer hover:scale-95 rounded-full px-4 py-2 flex items-center">
                Preview
              </div>
            </div>

            <div className="flex justify-between w-full items-center gap-4">
              <Undo2 size={17} className="cursor-pointer hover:text-blue-500" />
              <div className="flex relative w-full">
                <div className="absolute top-2 left-3">
                  <GitMerge size={13} />
                </div>
                <input
                  type="text"
                  className="border rounded-full w-full h-[2rem] pl-10 text-sm bg-neutral-900 border-neutral-700 focus:border-blue-500 focus:outline-none"
                  value={"SITSI /"}
                  readOnly
                />
              </div>
              <MonitorSmartphone
                size={17}
                className={`cursor-pointer hover:text-blue-500 ${deviceSize !== "desktop" ? "text-blue-500" : ""}`}
                onClick={toggleDeviceSize}
              />
              <Scaling size={17} className={`cursor-pointer hover:text-blue-500 ${isFullScreen ? "text-blue-500" : ""}`} onClick={toggleFullScreen} />
            </div>
          </div>
          <div className="w-full border rounded-sm mt-4 ">
            <div
              className={`max-h-full h-[calc(100vh-198px)] bg-neutral-900 overflow-auto p-4 mx-auto transition-all duration-300 ${
                deviceSize !== "desktop" ? "border border-blue-500" : ""
              }`}
              style={{
                width: getDeviceWidth(),
                maxWidth: deviceSize === "desktop" ? "100%" : getDeviceWidth(),
              }}
            >
              <div className="text-neutral-400">preview</div>
            </div>
          </div>
        </div>
      </SplitPane>
    </div>
  );
}
