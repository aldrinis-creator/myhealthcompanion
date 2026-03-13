import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const authHeader = req.headers.get("authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    // Verify user
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { image_base64 } = await req.json();
    if (!image_base64) throw new Error("Missing image_base64");

    // Rate limit: max 10 scans per hour
    const { count } = await supabase
      .from("ai_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("feature", "face_wellness")
      .gte("used_at", new Date(Date.now() - 3600000).toISOString());

    if ((count ?? 0) >= 10) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Try again in an hour." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Record rate limit
    await supabase.from("ai_rate_limits").insert({ user_id: user.id, feature: "face_wellness" });

    // Call Gemini via Lovable AI Gateway
    const prompt = `You are a wellness assessment AI. Analyze this selfie photo for visible wellness indicators.

IMPORTANT: First check if there is a clear human face in the image. If no face is detected, respond with:
{"face_detected": false, "error": "No face detected. Please take a clear selfie with good lighting."}

If a face IS detected, assess these wellness indicators on a scale of 1-10:

1. **Hydration** (1-10): Look for skin elasticity, lip moisture, under-eye hollows, skin plumpness
2. **Rest/Sleep Quality** (1-10): Look for dark circles, eye puffiness, droopy eyelids, overall alertness in expression
3. **Vitality** (1-10): Look for skin color/tone, complexion brightness, facial muscle tone, overall healthy appearance

Also provide a short, warm, encouraging message (1-2 sentences) based on your assessment.

Respond ONLY with valid JSON:
{"face_detected": true, "hydration_score": <1-10>, "rest_score": <1-10>, "vitality_score": <1-10>, "encouragement": "<message>"}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${image_base64}` },
              },
            ],
          },
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI Gateway error [${aiResponse.status}]: ${errText}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch {
      throw new Error("Failed to parse AI response");
    }

    if (!parsed.face_detected) {
      return new Response(JSON.stringify({ face_detected: false, error: parsed.error || "No face detected" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save to health_scans using service role for insert
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: scan, error: insertError } = await adminClient
      .from("health_scans")
      .insert({
        user_id: user.id,
        hydration_score: parsed.hydration_score,
        rest_score: parsed.rest_score,
        vitality_score: parsed.vitality_score,
        encouragement: parsed.encouragement,
        raw_response: parsed,
      })
      .select()
      .single();

    if (insertError) throw new Error(`DB insert error: ${insertError.message}`);

    return new Response(
      JSON.stringify({
        face_detected: true,
        scan_id: scan.id,
        hydration_score: parsed.hydration_score,
        rest_score: parsed.rest_score,
        vitality_score: parsed.vitality_score,
        encouragement: parsed.encouragement,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("analyze-face-wellness error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
