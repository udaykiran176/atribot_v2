import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding robotics learning platform database...");

    // Clean up in FK-safe order
    await db.delete(schema.userChallenges);
    await db.delete(schema.mcqOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.topics);
    await db.delete(schema.courses);

    // Insert courses
    const courses = await db
      .insert(schema.courses)
      .values([
        {
          title: "Robotics Fundamentals",
          description: "Start your robotics journey with core concepts.",
          imageSrc: "/hero.svg",
        },
        {
          title: "Advanced Robotics",
          description: "Dive deeper into advanced robotics and AI.",
          imageSrc: "/robot.svg",
        },
      ])
      .returning();

    for (const course of courses) {
      // Insert topics
      const topics = await db
        .insert(schema.topics)
        .values([
          {
            courseId: course.id,
            title: "Electronics Basics",
            description: "Voltage, current, sensors and actuators.",
            freeTrial: true,
          },
          {
            courseId: course.id,
            title: "Mechanics Basics",
            description: "Gears, torque, and motion.",
            freeTrial: false,
          },
          {
            courseId: course.id,
            title: "Programming Basics",
            description: "Logic, flow, and control for robots.",
            freeTrial: false,
          },
        ])
        .returning();

      // For each topic, insert challenges across all types
      for (const topic of topics) {
        // video
        const [videoChallenge] = await db
          .insert(schema.challenges)
          .values([
            {
              topicId: topic.id,
              type: "video",
              title: `Intro Video: ${topic.title}`,
              description: `Watch an overview about ${topic.title}.`,
              contentUrl: "https://cdn.example.com/intro.mp4",
              xp: 10,
            },
          ])
          .returning();

        // slide
        await db.insert(schema.challenges).values([
          {
            topicId: topic.id,
            type: "slide",
            title: `${topic.title} - Key Diagram`,
            description: "Study this diagram/image to understand the concept.",
            contentUrl: "/public/diagrams/key-diagram.png",
            xp: 5,
          },
        ]);

        // game (tsx route/url)
        await db.insert(schema.challenges).values([
          {
            topicId: topic.id,
            type: "game",
            title: `${topic.title} Game: Practice` ,
            description: "Interactive practice game.",
            contentUrl: "/games/line-follower", // route to render TSX game
            xp: 20,
          },
        ]);

        // build (mp4 loop animation)
        await db.insert(schema.challenges).values([
          {
            topicId: topic.id,
            type: "build",
            title: `${topic.title} Build Demo`,
            description: "Looped animation showcasing the build.",
            contentUrl: "https://cdn.example.com/build-loop.mp4",
            isLoopAnimation: true,
            xp: 15,
          },
        ]);

        // mcq
        const [mcqChallenge] = await db
          .insert(schema.challenges)
          .values([
            {
              topicId: topic.id,
              type: "mcq",
              title: `${topic.title} Check: What measures current?`,
              description: "Pick the correct answer.",
              xp: 25,
            },
          ])
          .returning();

        await db.insert(schema.mcqOptions).values([
          { challengeId: mcqChallenge.id, text: "Voltmeter", isCorrect: false, sortOrder: 1 },
          { challengeId: mcqChallenge.id, text: "Ammeter", isCorrect: true, sortOrder: 2 },
          { challengeId: mcqChallenge.id, text: "Ohmmeter", isCorrect: false, sortOrder: 3 },
          { challengeId: mcqChallenge.id, text: "Barometer", isCorrect: false, sortOrder: 4 },
        ]);

        // Optionally mark video challenge completed for demo user
        await db.insert(schema.userChallenges).values({
          userId: "seed-user-1",
          challengeId: videoChallenge.id,
          completed: true,
          completedAt: new Date(),
        });
      }
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();
