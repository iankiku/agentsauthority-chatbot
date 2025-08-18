import { validateSession } from "@/lib/auth-utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const sessionResponse = await validateSession(request.headers);

		if (!sessionResponse?.user) {
			return Response.json({ user: null, session: null }, { status: 200 });
		}

		return Response.json(sessionResponse, { status: 200 });
	} catch (error) {
		console.error("Error fetching session:", error);
		return Response.json({ user: null, session: null }, { status: 200 });
	}
}
