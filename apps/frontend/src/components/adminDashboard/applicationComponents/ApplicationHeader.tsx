import React from "react";
export const ApplicationHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
      {/* Left Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
            Applications Command Center
          </h1>
        </div>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          Review applicant profiles, process approvals, and manage application
          workflows efficiently.
        </p>
      </div>
    </div>
  );
};
