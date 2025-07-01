import DashboardPage from '@/components/dashboard-page';
import { db } from '@/server/db/db';
import { users } from '@/server/db/schema';
import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react'
import ApiKeySettings from './api-key-settings';


const Page = async () => {
    const auth = await currentUser();

    if(!auth){
        redirect("/sign-in")
    }

    const user = await db.select().from(users).where(eq(users.externalId,auth.id)).limit(1);

    if(user.length < 0 || user[0] === undefined ){
        redirect("/sign-in")
    }

  return (
    <DashboardPage title='API Settings'>
        <ApiKeySettings apiKey={user[0]?.apiKey ?? ""} />
    </DashboardPage>
  )
}

export default Page