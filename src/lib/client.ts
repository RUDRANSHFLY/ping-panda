import type { AppRouter } from "@/server"
import { createClient } from "jstack"


const apiUrl = process.env.NEXT_PUBLIC_APP_URL!;
export const client = createClient<AppRouter>({
  baseUrl: `${apiUrl}/api`,
})
