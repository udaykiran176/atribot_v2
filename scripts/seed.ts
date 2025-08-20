//seed the database with the courses

import { db } from "@/db/drizzle";
import { courses, topics, challenges, videoLessons, swipeCards, buildItThought} from "@/db/schema";

const seed = async () => {

  try {
    console.log("Seeding database...");
    
    // Clear existing data
    await Promise.all([
      db.delete(videoLessons),
      db.delete(swipeCards),
      db.delete(buildItThought),
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

    // Define challenge types for reuse across courses
    const challengeTypes = [
      { type: "video_lesson", title: "Video Lesson", order: 1 },
      { type: "swipe_cards", title: "Swipe Cards", order: 2 },
      { type: "interactive_game", title: "Interactive Game", order: 3 },
      { type: "build_it_thought", title: "Build It Thought", order: 4 },
      { type: "quiz", title: "Quiz (MCQ)", order: 5 },
    ];

    // Get the "Build your own circuit" course ID
    const buildCircuitCourse = insertedCourses.find(course => course.title === "Build your own circuit");
    
    if (buildCircuitCourse) {
      console.log("Seeding topics for 'Build your own circuit' course...");
      
      // Insert topics for "Build your own circuit" course
      const topicsData = [
        { 
          title: "Basic LED Circuit", 
          description: "Learn the fundamentals of LED circuits", 
          courseId: buildCircuitCourse.id, 
          imageSrc: "/topic_images/led.png",
          order: 1 
        },
        { 
          title: "Push On/Off Switch", 
          description: "Understanding push button switches", 
          courseId: buildCircuitCourse.id, 
          imageSrc: "/topic_images/push_on.png",
          order: 2 
        },
        { 
          title: "Tactile Switch", 
          description: "Working with tactile switches", 
          courseId: buildCircuitCourse.id, 
          imageSrc: "/topic_images/tactile.png",
          order: 3 
        },
        { 
          title: "Two-Way Switch", 
          description: "Implementing two-way switching", 
          courseId: buildCircuitCourse.id, 
          imageSrc: "/topic_images/two_way.png",
          order: 4 
        },
        { 
          title: "Limit Switch", 
          description: "Using limit switches in circuits", 
          courseId: buildCircuitCourse.id, 
          imageSrc: "/topic_images/limit.png",
          order: 5 
        },
      ];

      const insertedTopics = await db.insert(topics).values(topicsData).returning();
      console.log("Topics seeded successfully");

      // Insert challenges for each topic
      console.log("Seeding challenges for each topic...");

      const challengesData = [] as Array<{
        topicId: number;
        type: string;
        title: string;
        description: string | null;
        content: string | null;
        order: number;
      }>;
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

      const insertedChallenges = await db.insert(challenges).values(challengesData).returning();
      console.log("Challenges seeded successfully");

      // Seed swipe cards for "Basic LED Circuit" topic (5 cards)
      const basicLedTopic = insertedTopics.find(t => t.title === "Basic LED Circuit");
      if (basicLedTopic) {
        const swipeCardsChallenge = insertedChallenges.find(c => c.topicId === basicLedTopic.id && c.type === "swipe_cards");
        if (swipeCardsChallenge) {
          await db.insert(swipeCards).values([
            {
              challengeId: swipeCardsChallenge.id,
              image: "/topic_images/LED.png",
              title: "What is an LED?",
              description: "LED stands for Light Emitting Diode. It lights up when current flows forward.",
              order: 1,
            },
            {
              challengeId: swipeCardsChallenge.id,
              image: "/topic_images/LED.png",
              title: "Polarity Matters",
              description: "The longer leg is positive (anode) and the shorter leg is negative (cathode).",
              order: 2,
            },
            {
              challengeId: swipeCardsChallenge.id,
              image: "/topic_images/LED.png",
              title: "Use a Resistor",
              description: "Add a resistor in series to limit current and protect the LED from burning out.",
              order: 3,
            },
            {
              challengeId: swipeCardsChallenge.id,
              image: "/topic_images/LED.png",
              title: "Basic Circuit",
              description: "Connect battery (+) → resistor → LED (anode). LED (cathode) → battery (-).",
              order: 4,
            },
            {
              challengeId: swipeCardsChallenge.id,
              image: "/topic_images/LED.png",
              title: "Safety Tip",
              description: "Never connect an LED directly to a battery without a resistor.",
              order: 5,
            },
          ]);
          console.log("Swipe cards seeded for 'Basic LED Circuit'");
        }
        
        // Seed build_it_thought for "Basic LED Circuit" topic (5 videos)
        const buildItThoughtChallenge = insertedChallenges.find(c => c.topicId === basicLedTopic.id && c.type === "build_it_thought");
        if (buildItThoughtChallenge) {
          await db.insert(buildItThought).values([
            {
              challengeId: buildItThoughtChallenge.id,
              videoUrl: "/step by step gide/Level-1/Lighting An LED/led slide 1.mp4",
              order: 1,
            },
            {
              challengeId: buildItThoughtChallenge.id,
              videoUrl: "/step by step gide/Level-1/Lighting An LED/led slide 2.mp4",
              order: 2,
            },
            {
              challengeId: buildItThoughtChallenge.id,
              videoUrl: "/step by step gide/Level-1/Lighting An LED/led slide 3.mp4",
              order: 3,
            },
            {
              challengeId: buildItThoughtChallenge.id,
              videoUrl: "/step by step gide/Level-1/Lighting An LED/led slide 4.mp4",
              order: 4,
            },
            {
              challengeId: buildItThoughtChallenge.id,
              videoUrl: "/step by step gide/Level-1/Lighting An LED/led slide 5.mp4",
              order: 5,
            },
          ]);
          console.log("Build It Thought videos seeded for 'Basic LED Circuit'");
        }
      }
    }

    // Seed Introduction to Robotics course with video lessons
    const introCourse = insertedCourses.find(course => course.title === "Build your own circuit");
    
    if (introCourse) {
      console.log("Seeding 'Introduction to Robotics' video lessons...");
      
      // Create a topic for Introduction to Robotics
      const introTopic = await db.insert(topics).values({
        title: "Introduction to Robotics",
        description: "Learn the fundamentals of robotics and what makes robots special",
        courseId: introCourse.id,
        imageSrc: "/topic_images/robot.png",
        order: 1
      }).returning();

      if (introTopic[0]) {
        const videoLessonsData = [
          {
            title: "Introduction to Robotics",
            description: "Get started with the basics of robotics and its applications",
            videoUrl: "/VideoLessons/01_Introduction to robotics/01_introduction to robotic.mp4",
            order: 1,
            challengeId: 0 // Will be updated after challenge creation
          },
          {
            title: "The Secret Formula Behind Robotics",
            description: "Discover the key principles that make robotics work",
            videoUrl: "/VideoLessons/01_Introduction to robotics/02_The Secret formul behind robotics.mp4",
            order: 2,
            challengeId: 0
          },
          {
            title: "What is a Robot?",
            description: "Understanding what defines a robot and its components",
            videoUrl: "/VideoLessons/01_Introduction to robotics/03_what is robot.mp4",
            order: 3,
            challengeId: 0
          },
          {
            title: "Why Do We Use Robots?",
            description: "Exploring the various applications and benefits of robots",
            videoUrl: "/VideoLessons/01_Introduction to robotics/04_Why Do We Use Robots.mp4",
            order: 4,
            challengeId: 0
          },
          {
            title: "Are All Machines Robots?",
            description: "Understanding the difference between machines and robots",
            videoUrl: "/VideoLessons/01_Introduction to robotics/05_Are All Machines Robots.mp4",
            order: 5,
            challengeId: 0
          },
          {
            title: "What Makes Robots Special?",
            description: "Key characteristics that set robots apart from other machines",
            videoUrl: "/VideoLessons/01_Introduction to robotics/06_What Makes Robots Special.mp4",
            order: 6,
            challengeId: 0
          },
          {
            title: "Final Recap",
            description: "Summary of key concepts learned in Introduction to Robotics",
            videoUrl: "/VideoLessons/01_Introduction to robotics/07_Final Recap.mp4",
            order: 7,
            challengeId: 0
          }
        ];

        // Create a challenge for the video lessons
        const challenge = await db.insert(challenges).values({
          topicId: introTopic[0].id,
          type: "video_lesson",
          title: "Introduction to Robotics Video Series",
          description: "A comprehensive video series introducing the fundamentals of robotics",
          order: 1,
        }).returning();

        if (challenge[0]) {
          // Update challengeId for all video lessons
          const videoLessonsWithChallengeId = videoLessonsData.map(lesson => ({
            ...lesson,
            challengeId: challenge[0].id
          }));

          // Insert video lessons
          await db.insert(videoLessons).values(videoLessonsWithChallengeId);
          console.log("Video lessons seeded successfully");
        }
      }
    }

    // Get the "introduction to sensors" course ID
    const sensorsCourse = insertedCourses.find(course => course.title === "introduction to sensors");
    
    if (sensorsCourse) {
      console.log("Seeding topics for 'introduction to sensors' course...");
      
      // Insert topics for "introduction to sensors" course
      const sensorsTopicsData = [
        { 
          title: "IR Sensor", 
          description: "Learn about Infrared sensors and their applications", 
          courseId: sensorsCourse.id, 
          imageSrc: "/topic_images/ir_sensor.png",
          order: 1 
        },
        { 
          title: "LDR Sensor", 
          description: "Understanding Light Dependent Resistor sensors", 
          courseId: sensorsCourse.id, 
          imageSrc: "/topic_images/ldr_sensor.png",
          order: 2 
        },
        { 
          title: "Fire Sensor", 
          description: "Working with fire detection sensors", 
          courseId: sensorsCourse.id, 
          imageSrc: "/topic_images/fire_sensor.png",
          order: 3 
        },
        { 
          title: "Soil Sensor", 
          description: "Implementing soil moisture sensors", 
          courseId: sensorsCourse.id, 
          imageSrc: "/topic_images/soil_sensor.png",
          order: 4 
        },
        { 
          title: "Water Level Sensor", 
          description: "Using water level detection sensors", 
          courseId: sensorsCourse.id, 
          imageSrc: "/topic_images/water_level_sensor.png",
          order: 5 
        },
      ];

      const insertedSensorsTopics = await db.insert(topics).values(sensorsTopicsData).returning();
      console.log("Sensors topics seeded successfully");

      // Insert challenges for each sensor topic
      console.log("Seeding challenges for each sensor topic...");
      const sensorChallengesData = [];
      for (const topic of insertedSensorsTopics) {
        for (const challengeType of challengeTypes) {
          sensorChallengesData.push({
            topicId: topic.id,
            type: challengeType.type,
            title: `${topic.title} - ${challengeType.title}`,
            description: `${challengeType.title} for ${topic.title}`,
            content: JSON.stringify({ type: challengeType.type, topicTitle: topic.title }),
            order: challengeType.order,
          });
        }
      }

      await db.insert(challenges).values(sensorChallengesData);
      console.log("Sensor challenges seeded successfully");
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seed();