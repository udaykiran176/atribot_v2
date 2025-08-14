import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  serial,
  pgEnum,
} from "drizzle-orm/pg-core";


export const user = pgTable("user", {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').$defaultFn(() => false).notNull(),
  image: text('image'),

  // onboarding details
  onboardingCompleted: boolean('onboarding_completed').$defaultFn(() => false).notNull(),
  // child details
  childName: text('child_name'),
  childDob: timestamp('child_dob'),
  childGender: text('child_gender'),
  childClass: integer('child_class'),
  schoolname: text('schoolname'),
  // parent details
  phoneNumber: text('phone_number'),

  // robotics platform specific
  xp: integer('xp').default(0).notNull(),
  kitUnlocked: boolean('kit_unlocked').default(false).notNull(),
  activeCourseId: integer('active_course_id').references(() => courses.id, { onDelete: 'set null' }),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  imageSrc: text("image_src").notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  topics: many(topics),
}));

export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  freeTrial: boolean("free_trial").default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const topicsRelations = relations(topics, ({ one, many }) => ({
  course: one(courses, { fields: [topics.courseId], references: [courses.id] }),
  challenges: many(challenges),
}));

export const challengeTypeEnum = pgEnum('challenge_type', ['video', 'slide', 'game', 'build', 'mcq']);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topics.id, { onDelete: 'cascade' }),
  type: challengeTypeEnum('type').notNull(),
  title: text("title").notNull(),
  description: text("description"),
  contentUrl: text("content_url"),
  // For build-type challenges to indicate looped mp4 animations
  isLoopAnimation: boolean("is_loop_animation").default(false).notNull(),
  xp: integer("xp").notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  topic: one(topics, { fields: [challenges.topicId], references: [topics.id] }),
  userChallenges: many(userChallenges),
  mcqOptions: many(mcqOptions),
}));

export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completed_at"),
});

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
  user: one(user, { fields: [userChallenges.userId], references: [user.id] }),
  challenge: one(challenges, { fields: [userChallenges.challengeId], references: [challenges.id] }),
}));

// MCQ Options for multiple choice questions
export const mcqOptions = pgTable("mcq_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),
  sortOrder: integer("sort_order"),
});

export const mcqOptionsRelations = relations(mcqOptions, ({ one }) => ({
  challenge: one(challenges, { fields: [mcqOptions.challengeId], references: [challenges.id] }),
}));


export const schema = {
  user,
  session,
  account,
  verification,
  courses,
  coursesRelations,
  topics,
  topicsRelations,
  challengeTypeEnum,
  challenges,
  challengesRelations,
  userChallenges,
  userChallengesRelations,
  mcqOptions,
  mcqOptionsRelations,
};