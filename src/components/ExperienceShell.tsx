"use client";

import CustomCursor from "@/components/ui/CustomCursor";

export default function ExperienceShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
