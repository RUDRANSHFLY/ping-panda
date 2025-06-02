"use client";

import React, { useMemo, useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import { eventCategories } from "@/server/db/schema";
import { useQuery } from "@tanstack/react-query";
import EmptyCategoryState from "./empty-category-state";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Card from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { isAfter, isThisMonth, isThisWeek, isToday, startOfMonth, startOfWeek } from "date-fns";

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

  const [activeTab, setActiveTab] = useState<"today" | "week" | "month">(
    "today"
  );

  const [pagination, setPagination] = useState({
    pageIndex: page - 1,
    pageSize: limit,
  });

  const { data:  pollingData } = useQuery({
    queryKey: ["category", category.name, "hasEvents"],
    initialData: { hasEvents: initialHasEvents },
  });

  if (!pollingData.hasEvents) {
    return <EmptyCategoryState categoryName={category.name} />;
  }

  const {data} = useQuery({
    queryKey: [
      "events",
      category.name,
      pagination.pageIndex,
      pagination.pageSize,
      activeTab,
    ],
    queryFn: async () => {
      const res = await client.category.getEventsByCategoryName.$get({
        name: category.name,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        timeRange: activeTab,
      });

      return res.json();
    },
    refetchOnWindowFocus: false,
    enabled: pollingData.hasEvents,
  });


  const numricFieldsSums = useMemo(() => {
    if(!data?.events || data.events.length === 0){
      return {}
    };

    const sums: Record<string,{
      total : number,
      thisWeek : number,
      thisMonth : number,
      today : number,
    }> = {

    } ;
    

    const now = new Date()
    const weekStart = startOfWeek(now,{weekStartsOn : 0})
    const monthStart = startOfMonth(now)

    data?.events.forEach((event) => {
      const eventDate = event.createdAt;

      Object.entries(event.fields as object).forEach(([field,value]) => {
        if(typeof value === "number"){
          if(!sums[field]){
            sums[field] = {total : 0 , thisWeek : 0 , thisMonth : 0 , today : 0}
          }

          sums[field].total += value

          if (
            isAfter(eventDate,weekStart) || 
            eventDate.getTime() === weekStart.getTime()
          ){
            sums[field].thisWeek += value
          }

          if (
            isAfter(eventDate,monthStart) || 
            eventDate.getTime() === monthStart.getTime()
          ) {
            sums[field].thisMonth += value
          }

          if(isToday(eventDate)){
            sums[field].today += value
          }

        }


      })
    })
    
  },[data?.events])


  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value as "today" | "week" | "month")
      }}>
        <TabsList className="mb-2">
          <TabsTrigger value="today">
            Today
          </TabsTrigger>
            <TabsTrigger value="week">
            This Week
          </TabsTrigger>
            <TabsTrigger value="month">
            This Month
          </TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            <Card className="border-2 border-fuchsia-700">
                <div className="flex flow-row items-center justify-between space-y-0 pb-2">
                  <p className="text-sm/6 font-medium">
                      Total Events
                  </p>
                  <BarChart className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {data?.eventsCount || 0}
                  </p>
                  <p className="text-xs/5 text-muted-foreground">
                    Events {activeTab === "today" ? "today" : activeTab === "week" ? "this week" : "this month" } 
                  </p>
                </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryPageContent;
