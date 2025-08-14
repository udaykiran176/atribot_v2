//seed the database with the courses

import { db } from "@/db/drizzle";
import { courses } from "@/db/schema";

const seed = async () => {

  try {
    console.log("Seeding courses...");
    await Promise.all([
        db.delete(courses),
    ])
    await db.insert(courses).values([
      { title: "Build your own circuit", imageSrc: "/course/level-1.png" },
      { title: "introduction to sensors", imageSrc: "/course/level-2.png" },
      { title: "wire & wireless bot", imageSrc: "/course/level-3.png" },
      { title: "step into coding", imageSrc: "/course/level-4.png" },
    ]);
    console.log("Courses seeded successfully");
  } catch (error) {
    console.error(error);
  }
};

seed();