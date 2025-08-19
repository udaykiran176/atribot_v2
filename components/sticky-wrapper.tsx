import type { PropsWithChildren } from "react";

export const StickyWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="sticky bottom-6 hidden w-[350px] self-end lg:block">
      <div className="sticky top-6 flex min-h-[calc(100vh-50px)] flex-col gap-y-4">
        {children}
      </div>
    </div>
  );
};
