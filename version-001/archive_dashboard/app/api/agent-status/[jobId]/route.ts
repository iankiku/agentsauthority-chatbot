import { NextRequest } from "next/server";

// In-memory job store (replace with database in production)
const jobStore = new Map<
	string,
	{
		status: "pending" | "processing" | "completed" | "failed";
		progress: number;
		result?: any;
		error?: string;
		createdAt: Date;
	}
>();

export async function GET(
	request: NextRequest,
	{ params }: { params: { jobId: string } }
) {
	const { jobId } = params;

	// Set up SSE headers
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		start(controller) {
			const sendEvent = (data: any) => {
				const event = `data: ${JSON.stringify(data)}\n\n`;
				controller.enqueue(encoder.encode(event));
			};

			// Send initial status
			const job = jobStore.get(jobId);
			if (job) {
				sendEvent({
					type: "status",
					status: job.status,
					progress: job.progress,
					stage: (job as any).stage || "Initializing",
					result: job.result,
					error: job.error,
				});
			} else {
				sendEvent({
					type: "error",
					error: "Job not found",
				});
				controller.close();
				return;
			}

			// If job is already completed, close the stream
			if (job?.status === "completed" || job?.status === "failed") {
				controller.close();
				return;
			}

			// Poll for updates every 2 seconds
			const interval = setInterval(() => {
				const updatedJob = jobStore.get(jobId);
				if (updatedJob) {
					sendEvent({
						type: "status",
						status: updatedJob.status,
						progress: updatedJob.progress,
						stage: (updatedJob as any).stage || "Processing",
						result: updatedJob.result,
						error: updatedJob.error,
					});

					if (
						updatedJob.status === "completed" ||
						updatedJob.status === "failed"
					) {
						clearInterval(interval);
						controller.close();
					}
				} else {
					clearInterval(interval);
					controller.close();
				}
			}, 2000);

			// Clean up on client disconnect
			request.signal.addEventListener("abort", () => {
				clearInterval(interval);
				controller.close();
			});
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Cache-Control",
		},
	});
}

// Export for use in other files
export { jobStore };
