export type Challenge = {
  id: number;
  type: string;
  title: string | null;
  description: string | null;
  imageSrc: string;
  order: number | null;
  content: string | null;
  isCompleted?: boolean | null;
};

export type Topic = {
  id: number;
  title: string;
  description: string | null;
  imageSrc: string;
  order: number;
  challenges: Challenge[];
};
