import { relations } from "drizzle-orm"
import { pgTable, uuid, text, timestamp, index, uniqueIndex, integer, json, pgEnum } from "drizzle-orm/pg-core"

export const planEnum = pgEnum("planEnum", ["free", "pro"])
export const eventStatusEnum = pgEnum("eventStatusEnum", ["pending", "delivered", "failed"])

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    externalId: text("externalId").unique(),
    quotaLimit: integer("quotaLimit"),
    name: text("name").notNull(),
    plan: planEnum("plan").default("free").notNull(),
    email: text("email").notNull().unique(),
    apiKey: uuid("apiKey").defaultRandom().notNull().unique(),
    discordId: text("discordId"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  },
  (table) => [
    index("User_name_idx").on(table.name),
    index("User_email_idx").on(table.email),
    index("User_apiKey_idx").on(table.apiKey)
  ]
)

export const usersRelations = relations(users, ({ many }) => ({
  eventCategories: many(eventCategories),
  events: many(events),
  quotas: many(quotas)
}));


export const eventCategories = pgTable(
  "eventCategory", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  color: integer("color").notNull(),
  emoji: text("emoji").notNull(),
  userId: uuid("userId").notNull().references(() => users.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => [
  index("EventCategory_name_idx").on(table.name),
  index("EventCategory_userId_idx").on(table.userId),
  uniqueIndex("EventCategory_name_userId_unique").on(table.name, table.userId)
]
)

export const eventCategoriesRelations = relations(eventCategories, ({ one, many }) => ({
  user: one(users, {
    fields: [eventCategories.userId],
    references: [users.id]
  }),
  events: many(events)
}));


export const events = pgTable(
  "event", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  formattedMessage: text("formattedMessage").notNull(),
  fields: json("fields").notNull(),
  deliveryStatus: eventStatusEnum("deliveryStatus").default("pending").notNull(),
  userId: uuid("user").notNull().references(() => users.id),
  eventCategory: uuid("eventCategory").references(() => eventCategories.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}
  , (table) => [
    index("Event_userId_idx").on(table.userId),
    index("Event_eventCategory_idx").on(table.eventCategory),
    index("Event_createdAt_idx").on(table.createdAt)
  ]
);


export const eventsRelations = relations(events, ({ one }) => ({
  usser: one(users, {
    fields: [events.userId],
    references: [users.id]
  }),
  eventCategory: one(eventCategories, {
    fields: [events.eventCategory],
    references: [eventCategories.id]
  })
}))

export const quotas = pgTable(
  "quota", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user").notNull().references(() => users.id),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  count: integer("count").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
},
  (table) => [
    index("Quota_userId_idx").on(table.userId),
     uniqueIndex("quotas_user_unique").on(table.userId, table.year,table.month)
  ]
)

export const quotaRelations = relations(quotas, ({ one }) => ({
  user: one(users, {
    fields: [quotas.userId],
    references: [users.id]
  })
}));