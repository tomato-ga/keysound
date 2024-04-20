import { useSession } from "next-auth/react";

export const UserIdCheck = () => {
	const { data: session, status } = useSession();

	return session?.user?.email;
};
