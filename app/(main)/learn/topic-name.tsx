type TopicNameProps = {
  title: string;
};

export default function TopicName({ title }: TopicNameProps) {
  return (
    <div className="flex items-center gap-3 my-2 text-gray-400">
      <span className="h-px bg-gray-200 flex-1"></span>
      <h2 className="text-sm font-semibold tracking-wide uppercase whitespace-nowrap text-gray-400">
        {title}
      </h2>
      <span className="h-px bg-gray-200 flex-1"></span>
    </div>
  );
}
