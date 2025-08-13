import { db } from "@/db/drizzle";
import * as schema from "@/db/schema";

const seedCourses = async () => {
  try {
    console.log("Seeding courses...");
    
    const courseData = [
      {
        title: "Build your own circuit",
        imageSrc: "/images/courses/circuit.jpg",
        thumbnailSrc: "/images/thumbnails/circuit-thumb.jpg",
        description: "Learn the fundamentals of electronic circuits and build your own projects from scratch. Perfect for beginners!",
        price: "1999"
      },
      {
        title: "Introduction to sensors",
        imageSrc: "/images/courses/sensors.jpg",
        thumbnailSrc: "/images/thumbnails/sensors-thumb.jpg",
        description: "Discover how different sensors work and how to integrate them into your electronic projects.",
        price: "1799"
      },
      {
        title: "Wire & wireless bot",
        imageSrc: "/images/courses/bot.jpg",
        thumbnailSrc: "/images/thumbnails/bot-thumb.jpg",
        description: "Build and program your own robot that can be controlled both with wires and wirelessly.",
        price: "2499"
      },
      {
        title: "Step into coding",
        imageSrc: "/images/courses/coding.jpg",
        thumbnailSrc: "/images/thumbnails/coding-thumb.jpg",
        description: "Start your programming journey with this beginner-friendly introduction to coding concepts.",
        price: "1499"
      },
      {
        title: "Build a Robot",
        imageSrc: "/images/courses/robot.jpg",
        thumbnailSrc: "/images/thumbnails/robot-thumb.jpg",
        description: "Comprehensive course on building and programming your first robot from scratch.",
        price: "2999"
      }
    ];

    // Insert courses into the database
    for (const course of courseData) {
      await db.insert(schema.courses).values(course);
      console.log(`Added course: ${course.title}`);
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
    process.exit(1);
  } finally {
    await db.$cache
    process.exit(0);
  }
};

seedCourses();
