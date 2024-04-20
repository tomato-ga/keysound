// useAuthSession.ts
import { useSession } from "next-auth/react";

export function useAuthSession() {
	const { data: session, status } = useSession();
	return { session, status };
}
