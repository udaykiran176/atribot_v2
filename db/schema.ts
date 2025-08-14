import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  image: text('image'),

   //onboarding details
   onboardingCompleted: boolean('onboarding_completed').$defaultFn(() => false).notNull(),
   //child details
   childName: text('child_name'),
   childDob: timestamp('child_dob'),
   childGender: text('child_gender'),
   childClass: integer('child_class'),
   schoolname:text('schoolname'),
   //parent details
   phoneNumber: text('phone_number'),

  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()).notNull()
});

export const session = pgTable("session", {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  activeOrganizationId: text('active_organization_id')
});

export const account = pgTable("account", {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
  updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date())
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  courseId: integer("course_id").notNull().references(() => courses.id, {
    onDelete: "cascade",
  }),
  order: integer("order").notNull().default(0),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topics.id, {
    onDelete: "cascade",
  }),
  type: text("type").notNull(), // 'video_lesson', 'swipe_cards', 'interactive_game', 'build_it_thought', 'quiz'
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"), // JSON content specific to challenge type
  order: integer("order").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  topics: many(topics),
}));

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: integer("active_course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  points: integer("points").notNull().default(0),
  streak: integer("streak").notNull().default(0),
});

export const topicsRelations = relations(topics, ({ one, many }) => ({
  course: one(courses, {
    fields: [topics.courseId],
    references: [courses.id],
  }),
  challenges: many(challenges),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  topic: one(topics, {
    fields: [challenges.topicId],
    references: [topics.id],
  }),
  userChallengeProgress: many(userChallengeProgress),
}));

export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, {
    onDelete: "cascade",
  }),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id, {
    onDelete: "cascade",
  }),
  isCompleted: boolean("is_completed").notNull().default(false),
  score: integer("score").default(0),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});

export const userChallengeProgressRelations = relations(userChallengeProgress, ({ one }) => ({
  user: one(user, {
    fields: [userChallengeProgress.userId],
    references: [user.id],
  }),
  challenge: one(challenges, {
    fields: [userChallengeProgress.challengeId],
    references: [challenges.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));



export const schema = {
  user,
  session,
  account,
  verification,
  courses,
  topics,
  challenges,
  userProgress,
  userChallengeProgress,
};