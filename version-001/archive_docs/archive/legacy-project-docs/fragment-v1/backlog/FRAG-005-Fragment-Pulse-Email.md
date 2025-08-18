# FRAG-005 – Fragment Pulse Email

_Created: 2025-01-19_ _Status: **PHASE 1.5** - Fix & Automate Priority_

---

## 🎯 CLEAR PROMPT

**Build a daily email digest that sends customers their Share-of-Answer
percentage, competitor changes, and top recommended fixes automatically.**

Create a `/api/pulse` endpoint that runs daily via Vercel Scheduler, analyzes
recent GEO scans, computes deltas from previous periods, and sends formatted
emails via Resend with actionable insights.

The pulse email should feel like having a GEO analyst on your team - concise,
actionable, and focused on what changed since yesterday.

---

## 🛠️ TECHNICAL IMPLEMENTATION

### Daily Pulse Logic

```typescript
// apps/fragment/app/api/pulse/route.ts
import { Resend } from "resend";

export async function POST(request: Request) {
	// Get all active subscribers
	const subscribers = await getActiveSubscribers();

	for (const subscriber of subscribers) {
		// Reuse existing GEO scan logic
		const currentGeo = await runGeoScan(subscriber.businessData);
		const previousGeo = await getLastGeoScan(subscriber.id);

		// Compute meaningful deltas
		const pulse = {
			scoreDelta: currentGeo.overall - (previousGeo?.overall || 0),
			newMentions: findNewMentions(currentGeo, previousGeo),
			competitorChanges: findCompetitorChanges(currentGeo, previousGeo),
			topFixes: getTopRecommendations(currentGeo),
		};

		// Send via Resend
		await sendPulseEmail(subscriber.email, pulse);

		// Store for next comparison
		await storePulseSnapshot(subscriber.id, currentGeo);
	}

	return Response.json({ sent: subscribers.length });
}
```

### Email Template

```typescript
// lib/email-templates/pulse-digest.tsx
export function PulseDigestEmail({ business, pulse }: PulseDigestProps) {
  return (
    <Email>
      <Head>📊 Your AI Visibility Pulse - {new Date().toLocaleDateString()}</Head>

      <Section>
        <Heading>Good morning, {business.name}!</Heading>

        {pulse.scoreDelta !== 0 && (
          <Card>
            <Text>
              Your GEO Score: {pulse.currentScore}/10
              {pulse.scoreDelta > 0 ? '📈' : '📉'}
              ({pulse.scoreDelta > 0 ? '+' : ''}{pulse.scoreDelta.toFixed(1)})
            </Text>
          </Card>
        )}

        {pulse.newMentions.length > 0 && (
          <Card>
            <Text>🆕 New Mentions: {pulse.newMentions.length}</Text>
            {pulse.newMentions.slice(0, 3).map(mention => (
              <Text key={mention.id}>• {mention.platform}: {mention.context}</Text>
            ))}
          </Card>
        )}

        <Card>
          <Text>🎯 Today's Focus:</Text>
          {pulse.topFixes.slice(0, 2).map(fix => (
            <Text key={fix.id}>• {fix.title} (+{fix.impact} pts)</Text>
          ))}
        </Card>

        <Button href={`${process.env.NEXT_PUBLIC_URL}/dashboard`}>
          View Full Analysis →
        </Button>
      </Section>
    </Email>
  );
}
```

---

## 🧪 ACCEPTANCE CRITERIA

### Sprint Tasks (3 days)

**Day 1: Pulse Logic & Storage**

- [ ] Create `/api/pulse` endpoint with delta computation
- [ ] Implement pulse snapshot storage (KV or Supabase)
- [ ] Test pulse generation for 5 test businesses

**Day 2: Email Template & Sending**

- [ ] Build PulseDigestEmail React component
- [ ] Integrate Resend for email delivery
- [ ] Test email rendering and delivery

**Day 3: Scheduler & Automation**

- [ ] Set up Vercel Scheduler for daily execution
- [ ] Add subscriber management (opt-in/opt-out)
- [ ] Error handling and retry logic

### Success Criteria

- [ ] Pulse email sent daily at 8:00 AM UTC automatically
- [ ] Email includes GEO score delta, new mentions, and top 2 recommendations
- [ ] Subscribers can opt-in during onboarding and opt-out easily
- [ ] Email open rate >25%, click-through rate >10%
- [ ] Pulse generation completes in <60s for all subscribers

---

## 🔄 STATUS UPDATES

**Current Status**: PHASE 1.5 - Waiting for FRAG-003/004 completion
**Dependencies**: Need working GEO scan pipeline first **Next Action**: Begin
pulse logic design once agent pipeline is stable **Target Completion**: Week 3
(after revenue validation) **Success Metric**: First automated pulse email
delivered to beta customers
