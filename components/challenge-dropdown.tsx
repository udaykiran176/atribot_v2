import { X } from "lucide-react";
import { Check } from "lucide-react";

type ChallengeDropdownProps = {
  challenge: {
    id: number;
    title: string | null;
    description: string | null;
    type: string;
  };
  isCompleted: boolean;
  onClose: () => void;
};

export function ChallengeDropdown({ challenge, isCompleted, onClose }: ChallengeDropdownProps) {
  return (
    <div className="eT0FC eqlqC" style={{ "--margin": '12px' } as React.CSSProperties}>
      <div 
        className="_3zpnU _3OfAS _1o3g5 _2dBq4 _27rki" 
        style={{ zIndex: 1, transform: 'translateX(0%) translateX(-147.5px)' }}
      >
        <div className="_36bu_ _3RP1Q _1Fbw-">
          <div className="u_Jo7 _2yBgn">
            <div className="_2TJrM">
              <h1 className="QPQgr">{challenge.title || 'Challenge'}</h1>
            </div>
            <p className="_21efi">
              {challenge.description || 'No description available'}
            </p>
            <button 
              className="_1rcV8 _1VYyp _1ursp _7jW2t PbV1v _2sYfM _19ped"
              onClick={onClose}
            >
              Start +10 XP
            </button>
          </div>
        </div>
        <div 
          className="_3T97b" 
          style={{ 
            left: 'calc(0% + 147.5px - var(--web-ui_popover-border-radius, 15px))' 
          }}
        >
          <div className="_1TMn5 _1Fbw-"></div>
        </div>
      </div>
    </div>
  );
}
