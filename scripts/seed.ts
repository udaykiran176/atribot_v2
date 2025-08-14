//seed the database with the courses

import { db } from "@/db/drizzle";
import { courses, topics, challenges } from "@/db/schema";

const seed = async () => {

  try {
    console.log("Seeding database...");
    
    // Clear existing data
    await Promise.all([
      db.delete(challenges),
      db.delete(topics),
      db.delete(courses),
    ]);

    // Insert courses
    console.log("Seeding courses...");
    const insertedCourses = await db.insert(courses).values([
      { title: "Build your own circuit", imageSrc: "/course/level-1.png" },
      { title: "introduction to sensors", imageSrc: "/course/level-2.png" },
      { title: "wire & wireless bot", imageSrc: "/course/level-3.png" },
      { title: "step into coding", imageSrc: "/course/level-4.png" },
    ]).returning();
    console.log("Courses seeded successfully");

    // Get the "Build your own circuit" course ID
    const buildCircuitCourse = insertedCourses.find(course => course.title === "Build your own circuit");
    
    if (buildCircuitCourse) {
      console.log("Seeding topics for 'Build your own circuit' course...");
      
      // Insert topics for "Build your own circuit" course
      const topicsData = [
        { title: "Basic LED Circuit", description: "Learn the fundamentals of LED circuits", courseId: buildCircuitCourse.id, order: 1 },
        { title: "Push On/Off Switch", description: "Understanding push button switches", courseId: buildCircuitCourse.id, order: 2 },
        { title: "Tactile Switch", description: "Working with tactile switches", courseId: buildCircuitCourse.id, order: 3 },
        { title: "Two-Way Switch", description: "Implementing two-way switching", courseId: buildCircuitCourse.id, order: 4 },
        { title: "Limit Switch", description: "Using limit switches in circuits", courseId: buildCircuitCourse.id, order: 5 },
      ];

      const insertedTopics = await db.insert(topics).values(topicsData).returning();
      console.log("Topics seeded successfully");

      // Insert challenges for each topic
      console.log("Seeding challenges for each topic...");
      const challengeTypes = [
        { type: "video_lesson", title: "Video Lesson", order: 1 },
        { type: "swipe_cards", title: "Swipe Cards", order: 2 },
        { type: "interactive_game", title: "Interactive Game", order: 3 },
        { type: "build_it_thought", title: "Build It Thought", order: 4 },
        { type: "quiz", title: "Quiz (MCQ)", order: 5 },
      ];

      const challengesData = [];
      for (const topic of insertedTopics) {
        for (const challengeType of challengeTypes) {
          challengesData.push({
            topicId: topic.id,
            type: challengeType.type,
            title: `${topic.title} - ${challengeType.title}`,
            description: `${challengeType.title} for ${topic.title}`,
            content: JSON.stringify({ type: challengeType.type, topicTitle: topic.title }),
            order: challengeType.order,
          });
        }
      }

      await db.insert(challenges).values(challengesData);
      console.log("Challenges seeded successfully");
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seed();