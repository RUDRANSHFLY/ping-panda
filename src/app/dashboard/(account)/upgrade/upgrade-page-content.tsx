"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import Card from "@/components/ui/card";
import { BarChart } from "lucide-react";
import { format } from "date-fns";

interface UpgradPageContentProps {
  plan: "free" | "pro";
}

const UpgradPageContent = ({ plan }: UpgradPageContentProps) => {
  const router = useRouter();

  const { mutate: createCheckoutSession } = useMutation({
    mutationFn: async () => {
      const res = await client.payment.createCheckoutSession.$post();
      return await res.json();
    },
    onSuccess: ({ url }) => {
      if (url) {
        router.push(url);
      }
    },
  });

  const { data: usageData } = useQuery({
    queryKey: ["usage"],
    queryFn: async () => {
      const res = await client.project.getUsage.$get();
      return await res.json();
    },
  });

  return (
    <div className="max-w-3xl flex flex-col gap-8">
      <div>
        <h1 className="mt-2 text-xl/8 font-medium tracking-tight">
          {plan === "pro" ? "Plan: Pro" : "Plain: Free"}
        </h1>
        <p className="text-sm/6 text-gray-600 max-w-prose">
          {plan === "pro"
            ? "Thank you for supporting PingPanda. Find your increased usage limits below."
            : "Get Access to more events, categories and premium suport."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-fuchsia-700">
          <div className="flex flow-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Total Events</p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {usageData?.eventsUsed || 0} of{" "}
              {usageData?.eventsLimits.toLocaleString() || 100}
            </p>
            <p className="text-xs/5 text-muted-foreground">
              Events this period
            </p>
          </div>
        </Card>

        {/* Events Categories  */}
        <Card className="border-2 border-fuchsia-700">
          <div className="flex flow-row items-center justify-between space-y-0 pb-2">
            <p className="text-sm/6 font-medium">Total Event Categories</p>
            <BarChart className="size-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">
              {usageData?.categoriesUsed || 0} of{" "}
              {usageData?.categoriesLimit.toLocaleString() || 100}
            </p>
            <p className="text-xs/5 text-muted-foreground">
              Active Categories
            </p>
          </div>
        </Card>
       
      </div>
      <p className="text-sm text-gray-500">
          Usage will reset {usageData?.resetDate ? format(usageData.resetDate,"MMM d, yyyy") : (
            <span className="animate-pulse w-8 h-4 bg-gray-200">
              
            </span>
          )}
          {plan !== "pro" ? (
            <span onClick={() => createCheckoutSession()} className="inline cursor-pointer underline text-fuchsia-600">
            {" "}  or upgrade now to increase your limit &rarr; 
            </span>
          ) : null}
      </p>
    </div>
  );
};

export default UpgradPageContent;
