import { Check } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type CardProps = {
  title: string;
  id: number;
  imageSrc: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  isActive?: boolean;
};

export const Card = ({
  title,
  id,
  imageSrc,
  onClick,
  disabled,
  isActive,
}: CardProps) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "group relative flex h-full min-h-[250px] w-full max-w-[220px] cursor-pointer flex-col items-center overflow-hidden rounded-xl border-2 border-b-4 p-3 transition-all hover:bg-black/5 active:border-b-2",
        disabled && "pointer-events-none opacity-50"
      )}
    >
      {isActive && (
        <div className="absolute right-2 top-2 z-10">
          <div className="flex items-center justify-center rounded-md bg-blue-500 p-1.5">
            <Check className="h-4 w-4 stroke-[4] text-white" />
          </div>
        </div>
      )}

      <div className="relative mt-6 h-[140px] w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>

      <p className="mt-4 text-center text-sm font-bold text-neutral-700 line-clamp-2">{title}</p>
    </div>
  );
};
