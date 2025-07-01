import DashboardPage from "@/components/dashboard-page";
import { db } from "@/server/db/db";
import { eventCategories, events, users } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, count, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import React from "react";
import CategoryPageContent from "../category-page-content";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface PageProps {
  params: Promise<{
    name: string | string[] | undefined;
  }>;
}

const Page = async (props: PageProps) => {
  const params = await props.params;

  if (typeof params.name !== "string") notFound();

  const auth = await currentUser();

  if (!auth) {
    notFound();
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.externalId, auth.id))
    .limit(1);

  if (user.length === 0) notFound();

  const category = await db
    .select()
    .from(eventCategories)
    .where(
      and(
        eq(eventCategories.name, params.name),
        eq(eventCategories.userId, user[0]?.id || "")
      )
    )
    .limit(1);

  if (category.length === 0 || !category[0]) notFound();

  const eventsCountResult = await db
    .select({ count: count() })
    .from(events)
    .where(eq(events.eventCategory, category[0].id));
  const eventsCount = eventsCountResult[0]?.count || 0;

  const hashEvents = eventsCount > 0;

  console.log("HAS EVENTS : ",hashEvents)
  const eventCategoryName = category[0].name;
  const eventCategoryEmoji = category[0].emoji;

  return (
    <DashboardPage title={`${eventCategoryEmoji} ${eventCategoryName}`}>
      <CategoryPageContent hasEvents={hashEvents} category={category[0]} />
    </DashboardPage>
  );
};

export default Page;
