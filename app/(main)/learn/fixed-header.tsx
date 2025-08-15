import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

type Props = {
  courseTitle: string;
  topicTitle?: string;
  backHref?: string;
  topicIndex?: number;
};

export default function FixedHeader({
  courseTitle,
  topicTitle,
  backHref = "/courses",
  topicIndex = 0,
}: Props) {
  // Color cycle: blue, red, pink, orange, yellow, purple, green
  const colors = [
    "bg-blue-500",    // 0 - Blue
    "bg-red-500",     // 1 - Red
    "bg-pink-500",    // 2 - Pink
    "bg-orange-500",  // 3 - Orange
    "bg-yellow-500",  // 4 - Yellow
    "bg-purple-500",  // 5 - Purple
    "bg-green-400",   // 6 - Green
  ];
  
  const currentColor = colors[topicIndex % colors.length];
  return (
    <header className="sticky top-12.5 left-0 right-0 z-50 sm:top-0">
      <div className="bg-white text-white pt-2 sm:pt-5 ">
       <div className={`w-full items-center justify-between rounded-xl ${currentColor} p-2 text-white`}>
        <div className="flex items-center gap-3 px-4 py-2">
          <Link
            href={backHref}
            aria-label="Back to courses"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <FaArrowLeft />
          </Link>

          <div className="min-w-0">
            <div className="text-sm/5 opacity-90 truncate">{courseTitle}</div>
            {topicTitle ? (
              <div className="flex items-baseline gap-2">
                <h1 className="text-base font-semibold truncate">{topicTitle}</h1>
              </div>
            ) : (
              <h1 className="text-base font-semibold truncate">{courseTitle}</h1>
            )}
          </div>
        </div>
       </div>
      </div>
    </header>
  );
}