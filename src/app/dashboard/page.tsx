import { db } from '@/server/db/db';
import { users } from '@/server/db/schema';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import { eq } from "drizzle-orm";
import DashboardPage from '@/components/dashboard-page';
import DashboardPageContent from './dashboard-page-content';

const Page = async () => {
    const auth = await currentUser();

    if(!auth){
        redirect("/sign-in")
    }

    const user = await db
            .select()
            .from(users)
            .where(eq(users.externalId,auth.id))
            .limit(1)

    if(user.length === 0){
        redirect("/sign-in")
    }

    return (
        <DashboardPage title='Dashboard'>
            <DashboardPageContent />
        </DashboardPage>
  )
}

export default Page