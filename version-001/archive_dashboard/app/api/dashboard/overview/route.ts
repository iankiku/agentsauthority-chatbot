// apps/dashboard/app/api/dashboard/overview/route.ts
import { NextRequest } from "next/server";
import { getAgent } from "@/lib/mastra-client";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    const agent = await getAgent("dashboard-overview");
    
    const systemContext = `You are a dashboard overview assistant. You specialize in:
    
    CAPABILITIES:
    - Creating overview dashboards with key metrics
    - Generating GEO score visualizations
    - Showing performance trends and changes
    - Highlighting important alerts and insights
    
    AVAILABLE ARTIFACTS:
    - geo_scorecard: Overall GEO score with breakdown
    - metrics_dashboard: Key performance indicators
    - trend_chart: Performance over time
    - alert_panel: Important notifications and changes
    - summary_report: Executive summary of current status
    
    CONTEXT: This is the main dashboard overview page. Users expect to see their most important metrics and recent changes at a glance.
    
    Always respond with relevant artifacts that visualize the requested data.`;

    const contextualMessages = [
      { role: "system", content: systemContext },
      ...messages
    ];

    const result = await agent.generate(contextualMessages);
    
    return new Response(result.content || result.text, {
      headers: { "Content-Type": "text/plain" },
    });
    
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return new Response("Unable to load dashboard overview. Please try again.", {
      status: 500,
    });
  }
}