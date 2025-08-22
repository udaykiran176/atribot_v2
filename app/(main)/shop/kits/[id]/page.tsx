
import { eq } from "drizzle-orm";
import { courses } from "@/db/schema";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/db/drizzle";

import { Metadata, ResolvingMetadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const kitId = parseInt(id);
  const kit = await db.query.courses.findFirst({
    where: eq(courses.id, kitId),
  });

  if (!kit || !kit.kitTitle) {
    return {
      title: 'Kit not found',
    };
  }

  return {
    title: kit.kitTitle,
    description: kit.kitDescription || `Details about ${kit.kitTitle}`,
  };
}

export default async function KitDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kitId = parseInt(id);
  
  // Fetch the kit details from the database
  const kit = await db.query.courses.findFirst({
    where: eq(courses.id, kitId),
  });

  if (!kit || !kit.kitTitle) {
    notFound();
  }

  const features = kit.kitFeatures ? JSON.parse(kit.kitFeatures) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/shop" className="flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kit Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="relative aspect-square w-full">
            <Image
              src={kit.kitImage || kit.imageSrc}
              alt={kit.kitTitle}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Kit Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{kit.kitTitle}</h1>
            <p className="mt-2 text-2xl font-semibold text-blue-600">
              {kit.kitPrice || "Price on request"}
            </p>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700">{kit.kitDescription}</p>
          </div>

          {features.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h2>
              <ul className="space-y-2">
                {features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <Button className="w-full py-6 text-lg" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart - {kit.kitPrice}
            </Button>
          </div>
        </div>
      </div>

      {/* Course Information */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Course</h2>
        <div className="flex items-start space-x-4">
          <div className="relative h-16 w-16 rounded-md overflow-hidden">
            <Image
              src={kit.imageSrc}
              alt={kit.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{kit.title}</h3>
            <p className="text-sm text-gray-500">
              This kit is designed to accompany our {kit.title} course, providing all the physical components you'll need for hands-on learning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
