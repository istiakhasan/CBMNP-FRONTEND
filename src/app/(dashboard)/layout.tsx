"use client";
import GbSidebar from "@/components/ui/dashboard/GbSidebar";
const App: React.FC = ({ children }: any) => {
  return (
    <div style={{ height: "100vh" }}>
      <GbSidebar />
      <div style={{ width: "calc(100% - 75px)", marginLeft: "auto" }}>
        {children}
      </div>
    </div>
  );
};

export default App;
