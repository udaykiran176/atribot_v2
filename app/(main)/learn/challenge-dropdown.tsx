import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type ChallengeDropdownProps = {
  challenge: {
    id: number;
    title: string | null;
    description: string | null;
    type: string;
  };
  isCompleted: boolean;
  onClose: () => void;
  variant?: string;
  position?: { top: number; left: number } | null;
};

export function ChallengeDropdown({ 
  challenge, 
  isCompleted, 
  onClose,
  variant = 'swipe',
  position
}: ChallengeDropdownProps) {
  const variantClasses = {
    video: 'bg-pink-100 border-pink-200',
    swipe: 'bg-blue-100 border-blue-200',
    game: 'bg-purple-100 border-purple-200',
    build: 'bg-yellow-100 border-yellow-200',
    quiz: 'bg-green-100 border-green-200',
 
  };

  const buttonVariantClasses = {
    video: 'bg-pink-500 hover:bg-pink-600 text-white',
    swipe: 'bg-blue-500 hover:bg-blue-600 text-white',
    game: 'bg-purple-500 hover:bg-purple-600 text-white',
    build: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    quiz: 'bg-green-500 hover:bg-green-600 text-white',
    
  };

  const router = useRouter();
  const currentVariant = variant in variantClasses ? variant : 'swipe';

  const getChallengeRoute = (type: string) => {
    const routes: { [key: string]: string } = {
      video_lesson: '/videolesson',
      swipe_cards: '/swiplearn',
      interactive_game: '/interactivgame',
      build_it_thought: '/buildThought',
      quiz: '/quiz'
    };
    return routes[type] || '/';
  };

  const handleStartChallenge = () => {
    const route = getChallengeRoute(challenge.type);
    router.push(`${route}?challengeId=${challenge.id}`);
    onClose();
  };

  if (!position) return null;

  return (
    <div 
      className="fixed z-[9999] w-64 transform -translate-x-1/2"
      style={{ top: position.top, left: position.left }}
    >
      <div className={cn(
        "relative rounded-2xl border-2 p-4 shadow-lg transition-all duration-200",
        variantClasses[currentVariant as keyof typeof variantClasses]
      )}>
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 h-8 w-8 rounded-full flex items-center justify-center bg-white/50 hover:bg-white/70 transition-colors duration-200 z-10 cursor-pointer"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="w-full">
            <h1 className="text-xl font-bold text-gray-800 mb-1">
              {challenge.title || 'Challenge'}
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              {challenge.description || 'No description available'}
            </p>
            <button 
              onClick={handleStartChallenge}
              className={cn(
                "w-full py-2 px-4 rounded-xl font-medium text-sm transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer",
                buttonVariantClasses[currentVariant as keyof typeof buttonVariantClasses]
              )}
            >
              {isCompleted ? 'Review +5 XP' : 'Start +20 XP'}
              {isCompleted && <Check className="h-4 w-4 text-white" />}
            </button>
          </div>
        </div>
        {/* Arrow pointing to the button */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 
          border-l-8 border-l-transparent
          border-b-8 border-b-gray-200
          border-r-8 border-r-transparent">
        </div>
      </div>
    </div>
  );
}
