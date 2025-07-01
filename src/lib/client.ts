import type { AppRouter } from "@/server"
import { createClient } from "jstack"

/**
 * Your type-safe API client
 * @see https://jstack.app/docs/backend/api-client
 * 
 */
const apiUrl = process.env.NEXT_PUBLIC_APP_URL!;
export const client = createClient<AppRouter>({
  baseUrl: `${apiUrl}/api`,
})
