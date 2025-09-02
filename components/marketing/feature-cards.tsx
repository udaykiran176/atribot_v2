import Image from 'next/image';
import Link from 'next/link';

type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
  image: string;
  href?: string;
};


export function FeatureCards() {

  return (
    <section className="py-10 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Learn Robotics the Fun Way
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Interactive learning experiences for all skill levels
          </p>
        </div>
      </div>
    </section>
  );
}