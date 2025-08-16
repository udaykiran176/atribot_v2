import Image from "next/image";

type TopicImageProps = {
  imageSrc: string;
  title: string;
  className?: string;
  size?: number;
};

export default function TopicImage({ 
  imageSrc, 
  title, 
  className = "",
  size = 50
}: TopicImageProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src={imageSrc || "/default-topic.svg"}
        alt={`${title || 'Topic'} image`}
        width={size}
        height={size}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "/default-topic.svg";
        }}
      />
    </div>
  );
}
