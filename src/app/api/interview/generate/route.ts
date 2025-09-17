// app/api/interview/generate/route.ts
import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

async function callOpenAI(prompt: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "{}";
}

export async function POST(req: Request) {
  try {
    const { role, seniority, jobDescription, company } = await req.json();

    const prompt = `
You are an expert interview coach. Produce **concise but specific** prep for a ${seniority || "Entry-Level"} ${role || "Candidate"}.
Use THIS job description and company context:
---
${jobDescription || "N/A"}
---
Company: ${company || "Unknown"}

Return ONLY valid JSON with EXACTLY these keys:
{
  "role_specific_questions": [ exactly 4 ],
  "behavioral_questions": [ exactly 3 ],
  "technical_topics": [ exactly 2 ],
  "star_guides": [
    { "question": "", "how_to_answer": "", "example_bullets": [] }
    // exactly 2 objects
  ],
  "follow_up_questions": [ exactly 3 ]
}

QUALITY RULES:
- Avoid generic phrasing. Embed **domain/stack/product** terms from the JD (e.g., avionics, embedded C++, React/Next, Kafka, SOC2).
- Prefer **scenario questions**: scale limits, failure modes, latency/throughput, compliance, trade-offs.
- If JD contradicts role/seniority, prefer the JD.
- Name concrete tools/constraints from the JD (Jenkins, Docker, Ansible, yum/dnf, embedded, CMMC).
- Questions must be interview-natural and answerable verbally in 1–3 minutes.
- Keep each bullet ≤ 16 words, but concrete.
- STAR items: 1) process/impact story; 2) production/severity incident.
- STRICT JSON only. No prose.

STYLE: diagnostic whiteboard questions, not HR screeners.
`.trim();

    const raw = await callOpenAI(prompt);

    let parsed: any = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}$/m);
      parsed = match ? JSON.parse(match[0]) : {};
    }

    return NextResponse.json({ ok: true, prep: parsed });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
