import { createAuthClient } from "better-auth/react";
import useSWR from "swr";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    //baseURL: "http://localhost:3000",
    plugins: [adminClient()],
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSession() {
    const { data, error, isLoading } = useSWR("/api/auth/session", fetcher);
    return {
        session: data?.session ?? null,
        isLoading,
        isError: !!error,
    };
}
