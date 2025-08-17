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
  className = "mt-10",
}: TopicImageProps) {
  return (
    <div className={`relative w-[100px] h-[100px] md:w-[200px] md:h-[200px] ${className}`} >
      <Image
        src={imageSrc || "/default-topic.svg"}
        alt={`${title || 'Topic'} image`}
        fill
        className="object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "/default-topic.svg";
        }}
      />
    </div>
  );
}
