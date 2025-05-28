"use client";

import React, { useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import { eventCategories } from "@/server/db/schema";
import { useQuery } from "@tanstack/react-query";
import EmptyCategoryState from "./empty-category-state";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/client";

interface CategoryPageContentProps {
  hasEvents: boolean;
  category: InferSelectModel<typeof eventCategories>;
}

const CategoryPageContent = ({
  category,
  hasEvents: initialHasEvents,
}: CategoryPageContentProps) => {
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "30", 10);

    const [activeTab, setActiveTab] = useState<"today" | "week" | "month">("today")

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const { data: pollingData } = useQuery({
    queryKey: ["category", category.name, "hasEvents"],
    initialData: { hasEvents: initialHasEvents },
  });

  if (!pollingData.hasEvents) {
    return <EmptyCategoryState categoryName={category.name} />;
  }

  //const {} = useQuery({
    // queryKey: [
    //   "events",
    //   category.name,
    //   pagination.pageIndex,
    //   pagination.pageSize,
    //   activeTab
    // ],
    // queryFn : async () => {
    //     const res = await client.category.
    // }
  //});
  return <div></div>;
};

export default CategoryPageContent;
