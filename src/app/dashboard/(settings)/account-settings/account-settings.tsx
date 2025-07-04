"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";

const AccountSettings = ({
  discordId: initialDiscordId,
}: {
  discordId: string;
}) => {
  const [discordId, setDiscordId] = useState(initialDiscordId);

  const { mutate, isPending } = useMutation({
    mutationFn: async (discordId: string) => {
      const res = await client.project.setDiscordId.$post({
        discordId: discordId,
      });
      return await res.json();
    },
  });

  return (
    <Card className="max-w-xl w-full space-y-4">
      <div>
        <Label>Discord Id</Label>
        <Input
          className="mt-1"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder="Enter your Discord Id"
        />
      </div>

      <p className="mt-2 text-sm/6 text-gray-600">
        Dont&apos;t know how to find Discord Id ?{" "}
        <Link href={"#"} className="text-fuchsia-600 hover:text-fuchsia-500">
          Learn how to obtain it here
        </Link>
        .
      </p>
      <div className="pt-4">
        <Button onClick={() => mutate(discordId)} disabled={isPending   }>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
};

export default AccountSettings;
