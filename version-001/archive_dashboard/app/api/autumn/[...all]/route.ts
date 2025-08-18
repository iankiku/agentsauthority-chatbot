// Autumn temporarily disabled; respond with 503
export async function GET() {
	return new Response(JSON.stringify({ error: "Autumn disabled" }), {
		status: 503,
	});
}

export async function POST() {
	return new Response(JSON.stringify({ error: "Autumn disabled" }), {
		status: 503,
	});
}
