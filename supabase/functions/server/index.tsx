import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();
const PREFIX = "/make-server-1f2265c5";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get(
  "SUPABASE_SERVICE_ROLE_KEY",
)!;

const supabase = createClient(supabaseUrl, serviceRoleKey);

app.use("*", logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

const VALID_REPORT_TYPES = ["lost", "found", "sighting"];
const VALID_REPORT_STATUSES = [
  "active",
  "under_review",
  "possible_match",
  "reunited",
  "removed",
];
const VALID_ANIMAL_TYPES = ["dog", "cat", "other"];

function normalizeReportType(value: unknown) {
  const v = String(value || "").toLowerCase();
  if (VALID_REPORT_TYPES.includes(v)) return v;
  return "lost";
}

function normalizeReportStatus(value: unknown) {
  const v = String(value || "").toLowerCase();
  if (VALID_REPORT_STATUSES.includes(v)) return v;
  return "active";
}

function normalizeAnimalType(value: unknown) {
  const v = String(value || "").toLowerCase();

  if (VALID_ANIMAL_TYPES.includes(v)) return v;
  if (v.includes("dog")) return "dog";
  if (v.includes("cat")) return "cat";

  return "other";
}

function safeNumber(value: unknown) {
  if (value === undefined || value === null || value === "")
    return null;

  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function getDisplayStatus(report: any) {
  if (report.status === "reunited") return "reunited";
  return report.report_type;
}

function mapProfile(profile: any) {
  if (!profile) return null;

  return {
    ...profile,
    is_admin: profile.role === "admin",
  };
}

function mapComment(comment: any) {
  return {
    ...comment,
    content: comment.comment_text,
    profiles: mapProfile(comment.profiles),
  };
}

function mapReportForFrontend(
  report: any,
  userReactionIds = new Set<string>(),
  userSavedIds = new Set<string>(),
) {
  const visibleStatus = getDisplayStatus(report);

  const reactionCount = Array.isArray(report.reactions)
    ? report.reactions.length
    : (report.reaction_count ?? 0);

  const commentCount = Array.isArray(report.comments)
    ? report.comments.length
    : (report.comment_count ?? 0);

  return {
    ...report,

    profiles: mapProfile(report.profiles),

    db_status: report.status,
    case_status: report.status,

    // Frontend compatibility
    status: visibleStatus,
    display_status: visibleStatus,

    report_type: report.report_type,
    animal_type: report.animal_type,
    location_name: report.location_name,
    latitude: report.latitude,
    longitude: report.longitude,
    image_url: report.image_url,

    reaction_count: reactionCount,
    comment_count: commentCount,
    user_reacted: userReactionIds.has(report.id),
    user_saved: userSavedIds.has(report.id),

    // Old Figma-generated field names
    pet_type: report.animal_type,
    location: report.location_name,
    lat: report.latitude,
    lng: report.longitude,
    photo_url: report.image_url,
    incident_date: report.date_reported,
    incident_time: null,
    reunited_at:
      report.status === "reunited" ? report.created_at : null,
    reunited_story:
      report.status === "reunited"
        ? report.description ||
          "This pet has been marked as reunited."
        : null,
  };
}

function getToken(c: any): string | null {
  const auth = c.req.header("Authorization") ?? "";
  return auth.startsWith("Bearer ")
    ? auth.slice(7).trim()
    : null;
}

async function getUser(token: string | null) {
  if (!token) return null;

  // Only mock tokens are accepted. No Google. No Supabase Auth.
  if (!token.startsWith("mock:")) return null;

  const profileId = token.replace("mock:", "");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (error || !profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    user_metadata: {
      full_name:
        profile.full_name || profile.username || "Pawnect User",
      avatar_url: profile.avatar_url,
    },
    app_metadata: {},
  };
}

async function getUserFromRequest(c: any) {
  return getUser(getToken(c));
}

async function ensureProfile(user: any) {
  if (!user?.id) return null;

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile) return mapProfile(existingProfile);

  return null;
}

async function isAdmin(token: string | null): Promise<boolean> {
  const user = await getUser(token);
  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return data?.role === "admin";
}

async function logActivity({
  user_id,
  action,
  target_type,
  target_id,
}: {
  user_id?: string | null;
  action: string;
  target_type?: string | null;
  target_id?: string | null;
}) {
  try {
    await supabase.from("activity_logs").insert({
      user_id: user_id ?? null,
      action,
      target_type: target_type ?? null,
      target_id: target_id ?? null,
    });
  } catch (err) {
    console.log("activity_logs insert failed:", err);
  }
}

async function ensureStorageBucket() {
  try {
    const bucketName = "pet-photos";

    const { data: buckets } =
      await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(
      (b: any) => b.name === bucketName,
    );

    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: true,
      });

      console.log(`Created bucket: ${bucketName}`);
    }
  } catch (err) {
    console.log("Storage bucket check failed:", err);
  }
}

ensureStorageBucket();

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH
// ─────────────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/health`, (c) => {
  return c.json({ status: "ok" });
});

// ─────────────────────────────────────────────────────────────────────────────
// MOCK LOGIN
// Uses SQL function: mock_login_or_create(input_username, raw_password)
// Existing username = let them in.
// New username = create profile + hashed credential.
// ─────────────────────────────────────────────────────────────────────────────

app.post(`${PREFIX}/mock-login`, async (c: any) => {
  try {
    const body = await c.req.json();

    const username = String(body.username || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "").trim();

    if (!username || !password) {
      return c.json(
        { error: "Username and password are required" },
        400,
      );
    }

    const { data, error } = await supabase.rpc(
      "mock_login_or_create",
      {
        input_username: username,
        raw_password: password,
      },
    );

    if (error) {
      console.log("mock_login_or_create error:", error);
      return c.json({ error: error.message }, 500);
    }

    const profile = Array.isArray(data) ? data[0] : data;

    if (!profile?.id) {
      return c.json(
        { error: "Profile could not be created" },
        500,
      );
    }

    await logActivity({
      user_id: profile.id,
      action: "mock_login",
      target_type: "profile",
      target_id: profile.id,
    });

    return c.json({
      data: {
        profile: mapProfile(profile),
        token: `mock:${profile.id}`,
      },
    });
  } catch (err: any) {
    console.log("POST /mock-login error:", err);

    return c.json(
      { error: err.message || "Mock login failed" },
      500,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/reports`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    const search = c.req.query("search") || "";
    const reportType = c.req.query("report_type") || "";
    const animalType =
      c.req.query("animal_type") ||
      c.req.query("pet_type") ||
      "";
    const status = c.req.query("status") || "";
    const limit = Math.min(
      parseInt(c.req.query("limit") || "20", 10),
      100,
    );
    const offset = parseInt(c.req.query("offset") || "0", 10);
    const sort = c.req.query("sort") || "latest";

    let query = supabase
      .from("pet_reports")
      .select(
        `
        id,
        user_id,
        report_type,
        pet_name,
        animal_type,
        breed,
        color,
        size,
        gender,
        status,
        description,
        location_name,
        latitude,
        longitude,
        image_url,
        contact_preference,
        date_reported,
        created_at,
        profiles (
          id,
          username,
          full_name,
          email,
          avatar_url,
          role,
          location,
          created_at
        ),
        comments (
          id
        ),
        reactions (
          id
        )
      `,
      )
      .neq("status", "removed");

    if (reportType && reportType !== "all") {
      query = query.eq(
        "report_type",
        normalizeReportType(reportType),
      );
    }

    if (animalType && animalType !== "all") {
      query = query.eq(
        "animal_type",
        normalizeAnimalType(animalType),
      );
    }

    if (status && status !== "all") {
      if (VALID_REPORT_TYPES.includes(status)) {
        query = query.eq("report_type", status);
      } else if (VALID_REPORT_STATUSES.includes(status)) {
        query = query.eq("status", status);
      }
    }

    if (search.trim()) {
      const cleanSearch = search.trim().replace(/[%_]/g, "");

      query = query.or(
        [
          `pet_name.ilike.%${cleanSearch}%`,
          `breed.ilike.%${cleanSearch}%`,
          `color.ilike.%${cleanSearch}%`,
          `location_name.ilike.%${cleanSearch}%`,
          `description.ilike.%${cleanSearch}%`,
        ].join(","),
      );
    }

    query = query.order("created_at", {
      ascending: sort === "oldest",
    });
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.log("GET /reports error:", error);
      return c.json({ error: error.message }, 500);
    }

    let userReactionIds = new Set<string>();
    let userSavedIds = new Set<string>();

    if (user && data?.length) {
      const reportIds = data.map((report: any) => report.id);

      const [
        { data: userReactions },
        { data: userSavedPosts },
      ] = await Promise.all([
        supabase
          .from("reactions")
          .select("report_id")
          .eq("user_id", user.id)
          .in("report_id", reportIds),
        supabase
          .from("saved_posts")
          .select("report_id")
          .eq("user_id", user.id)
          .in("report_id", reportIds),
      ]);

      userReactionIds = new Set(
        (userReactions || []).map(
          (item: any) => item.report_id,
        ),
      );

      userSavedIds = new Set(
        (userSavedPosts || []).map(
          (item: any) => item.report_id,
        ),
      );
    }

    return c.json({
      data: (data || []).map((report: any) =>
        mapReportForFrontend(
          report,
          userReactionIds,
          userSavedIds,
        ),
      ),
    });
  } catch (err: any) {
    console.log("GET /reports server error:", err);

    return c.json(
      { error: err.message || "Failed to load reports" },
      500,
    );
  }
});

app.post(`${PREFIX}/reports`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const body = await c.req.json();

    const reportPayload = {
      user_id: user.id,
      report_type: normalizeReportType(
        body.report_type || body.status,
      ),
      status: normalizeReportStatus(
        body.status === "lost" || body.status === "found"
          ? "active"
          : body.status,
      ),
      pet_name: body.pet_name || null,
      animal_type: normalizeAnimalType(
        body.animal_type || body.pet_type,
      ),
      breed: body.breed || null,
      color: body.color || null,
      size: body.size || null,
      gender: body.gender || null,
      description: body.description || null,
      location_name:
        body.location_name || body.location || null,
      latitude: safeNumber(body.latitude ?? body.lat),
      longitude: safeNumber(body.longitude ?? body.lng),
      image_url: body.image_url || body.photo_url || null,
      contact_preference: body.contact_preference || null,
      date_reported:
        body.date_reported || new Date().toISOString(),
    };

    if (!reportPayload.location_name) {
      return c.json({ error: "Location is required" }, 400);
    }

    const { data, error } = await supabase
      .from("pet_reports")
      .insert(reportPayload)
      .select(
        `
        id,
        user_id,
        report_type,
        pet_name,
        animal_type,
        breed,
        color,
        size,
        gender,
        status,
        description,
        location_name,
        latitude,
        longitude,
        image_url,
        contact_preference,
        date_reported,
        created_at,
        profiles (
          id,
          username,
          full_name,
          email,
          avatar_url,
          role,
          location,
          created_at
        ),
        comments (
          id
        ),
        reactions (
          id
        )
      `,
      )
      .single();

    if (error) {
      console.log("POST /reports error:", error);
      return c.json({ error: error.message }, 500);
    }

    await logActivity({
      user_id: user.id,
      action: "created_report",
      target_type: "pet_report",
      target_id: data.id,
    });

    return c.json({ data: mapReportForFrontend(data) }, 201);
  } catch (err: any) {
    console.log("POST /reports server error:", err);

    return c.json(
      { error: err.message || "Failed to create report" },
      500,
    );
  }
});

app.get(`${PREFIX}/reports/:id`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);
    const id = c.req.param("id");

    const { data, error } = await supabase
      .from("pet_reports")
      .select(
        `
        id,
        user_id,
        report_type,
        pet_name,
        animal_type,
        breed,
        color,
        size,
        gender,
        status,
        description,
        location_name,
        latitude,
        longitude,
        image_url,
        contact_preference,
        date_reported,
        created_at,
        profiles (
          id,
          username,
          full_name,
          email,
          avatar_url,
          role,
          location,
          created_at
        ),
        comments (
          id
        ),
        reactions (
          id
        )
      `,
      )
      .eq("id", id)
      .neq("status", "removed")
      .single();

    if (error) {
      console.log("GET /reports/:id error:", error);
      return c.json({ error: "Report not found" }, 404);
    }

    let userReactionIds = new Set<string>();
    let userSavedIds = new Set<string>();

    if (user) {
      const [{ data: reaction }, { data: saved }] =
        await Promise.all([
          supabase
            .from("reactions")
            .select("report_id")
            .eq("report_id", id)
            .eq("user_id", user.id)
            .maybeSingle(),
          supabase
            .from("saved_posts")
            .select("report_id")
            .eq("report_id", id)
            .eq("user_id", user.id)
            .maybeSingle(),
        ]);

      if (reaction) userReactionIds.add(id);
      if (saved) userSavedIds.add(id);
    }

    return c.json({
      data: mapReportForFrontend(
        data,
        userReactionIds,
        userSavedIds,
      ),
    });
  } catch (err: any) {
    console.log("GET /reports/:id server error:", err);

    return c.json(
      { error: err.message || "Failed to load report" },
      500,
    );
  }
});

app.patch(`${PREFIX}/reports/:id`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const id = c.req.param("id");
    const body = await c.req.json();

    const { data: existingReport, error: existingError } =
      await supabase
        .from("pet_reports")
        .select("id, user_id, status")
        .eq("id", id)
        .single();

    if (existingError || !existingReport) {
      return c.json({ error: "Report not found" }, 404);
    }

    const admin = await isAdmin(getToken(c));
    const isOwner = existingReport.user_id === user.id;

    if (!isOwner && !admin) {
      return c.json(
        {
          error:
            "You do not have permission to update this report",
        },
        403,
      );
    }

    const updatePayload: Record<string, any> = {};

    if (body.status !== undefined) {
      updatePayload.status = normalizeReportStatus(body.status);
    }

    if (body.report_type !== undefined) {
      updatePayload.report_type = normalizeReportType(
        body.report_type,
      );
    }

    if (body.pet_name !== undefined)
      updatePayload.pet_name = body.pet_name || null;

    if (
      body.animal_type !== undefined ||
      body.pet_type !== undefined
    ) {
      updatePayload.animal_type = normalizeAnimalType(
        body.animal_type || body.pet_type,
      );
    }

    if (body.breed !== undefined)
      updatePayload.breed = body.breed || null;
    if (body.color !== undefined)
      updatePayload.color = body.color || null;
    if (body.size !== undefined)
      updatePayload.size = body.size || null;
    if (body.gender !== undefined)
      updatePayload.gender = body.gender || null;
    if (body.description !== undefined) {
      updatePayload.description = body.description || null;
    }

    if (
      body.location_name !== undefined ||
      body.location !== undefined
    ) {
      updatePayload.location_name =
        body.location_name || body.location || null;
    }

    if (body.latitude !== undefined || body.lat !== undefined) {
      updatePayload.latitude = safeNumber(
        body.latitude ?? body.lat,
      );
    }

    if (
      body.longitude !== undefined ||
      body.lng !== undefined
    ) {
      updatePayload.longitude = safeNumber(
        body.longitude ?? body.lng,
      );
    }

    if (
      body.image_url !== undefined ||
      body.photo_url !== undefined
    ) {
      updatePayload.image_url =
        body.image_url || body.photo_url || null;
    }

    if (body.contact_preference !== undefined) {
      updatePayload.contact_preference =
        body.contact_preference || null;
    }

    const { data, error } = await supabase
      .from("pet_reports")
      .update(updatePayload)
      .eq("id", id)
      .select(
        `
        id,
        user_id,
        report_type,
        pet_name,
        animal_type,
        breed,
        color,
        size,
        gender,
        status,
        description,
        location_name,
        latitude,
        longitude,
        image_url,
        contact_preference,
        date_reported,
        created_at,
        profiles (
          id,
          username,
          full_name,
          email,
          avatar_url,
          role,
          location,
          created_at
        ),
        comments (
          id
        ),
        reactions (
          id
        )
      `,
      )
      .single();

    if (error) {
      console.log("PATCH /reports/:id error:", error);
      return c.json({ error: error.message }, 500);
    }

    await logActivity({
      user_id: user.id,
      action:
        updatePayload.status === "reunited"
          ? "marked_reunited"
          : "updated_report",
      target_type: "pet_report",
      target_id: id,
    });

    return c.json({ data: mapReportForFrontend(data) });
  } catch (err: any) {
    console.log("PATCH /reports/:id server error:", err);

    return c.json(
      { error: err.message || "Failed to update report" },
      500,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// COMMENTS
// ─────────────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/reports/:id/comments`, async (c: any) => {
  try {
    const reportId = c.req.param("id");

    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        id,
        report_id,
        user_id,
        comment_text,
        created_at,
        profiles (
          id,
          username,
          full_name,
          email,
          avatar_url,
          role,
          location,
          created_at
        )
      `,
      )
      .eq("report_id", reportId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("GET comments error:", error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ data: (data || []).map(mapComment) });
  } catch (err: any) {
    console.log("GET comments server error:", err);

    return c.json(
      { error: err.message || "Failed to load comments" },
      500,
    );
  }
});

app.post(`${PREFIX}/reports/:id/comments`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const reportId = c.req.param("id");
    const body = await c.req.json();
    const commentText = body.comment_text || body.content || "";

    if (!commentText.trim()) {
      return c.json({ error: "Comment cannot be empty" }, 400);
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        report_id: reportId,
        user_id: user.id,
        comment_text: commentText.trim(),
      })
      .select(
        `
        id,
        report_id,
        user_id,
        comment_text,
        created_at,
        profiles (
          id,
          username,
          full_name,
          email,
          avatar_url,
          role,
          location,
          created_at
        )
      `,
      )
      .single();

    if (error) {
      console.log("POST comments error:", error);
      return c.json({ error: error.message }, 500);
    }

    await logActivity({
      user_id: user.id,
      action: "commented_on_report",
      target_type: "pet_report",
      target_id: reportId,
    });

    const { data: report } = await supabase
      .from("pet_reports")
      .select("user_id, pet_name")
      .eq("id", reportId)
      .maybeSingle();

    if (report?.user_id && report.user_id !== user.id) {
      const profile = await ensureProfile(user);

      await supabase.from("notifications").insert({
        user_id: report.user_id,
        report_id: reportId,
        notification_type: "comment",
        message: `${profile?.full_name || "Someone"} commented on your report "${
          report.pet_name || "Unknown pet"
        }"`,
        is_read: false,
      });
    }

    return c.json({ data: mapComment(data) }, 201);
  } catch (err: any) {
    console.log("POST comments server error:", err);

    return c.json(
      { error: err.message || "Failed to post comment" },
      500,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// REACTIONS
// ─────────────────────────────────────────────────────────────────────────────

app.post(`${PREFIX}/reactions/toggle`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const body = await c.req.json();
    const reportId = body.report_id;
    const reactionType =
      body.reaction_type || body.type || "helpful";

    if (!reportId) {
      return c.json({ error: "report_id is required" }, 400);
    }

    const { data: existing } = await supabase
      .from("reactions")
      .select("id")
      .eq("report_id", reportId)
      .eq("user_id", user.id)
      .eq("reaction_type", reactionType)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("reactions")
        .delete()
        .eq("id", existing.id);
    } else {
      await supabase.from("reactions").insert({
        report_id: reportId,
        user_id: user.id,
        reaction_type: reactionType,
      });
    }

    const { count } = await supabase
      .from("reactions")
      .select("*", { count: "exact", head: true })
      .eq("report_id", reportId);

    return c.json({
      reacted: !existing,
      count: count ?? 0,
    });
  } catch (err: any) {
    console.log("POST reactions/toggle error:", err);

    return c.json(
      { error: err.message || "Failed to toggle reaction" },
      500,
    );
  }
});

app.get(`${PREFIX}/reactions/:reportId`, async (c: any) => {
  try {
    const reportId = c.req.param("reportId");
    const user = await getUserFromRequest(c);

    const { count } = await supabase
      .from("reactions")
      .select("*", { count: "exact", head: true })
      .eq("report_id", reportId);

    let userReacted = false;

    if (user) {
      const { data } = await supabase
        .from("reactions")
        .select("id")
        .eq("report_id", reportId)
        .eq("user_id", user.id)
        .maybeSingle();

      userReacted = !!data;
    }

    return c.json({
      count: count ?? 0,
      userReacted,
    });
  } catch (err: any) {
    console.log("GET reactions error:", err);

    return c.json(
      { error: err.message || "Failed to load reactions" },
      500,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SAVED POSTS
// ─────────────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/saved-posts`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const { data, error } = await supabase
      .from("saved_posts")
      .select(
        `
        id,
        report_id,
        user_id,
        created_at,
        pet_reports (
          id,
          user_id,
          report_type,
          pet_name,
          animal_type,
          breed,
          color,
          size,
          gender,
          status,
          description,
          location_name,
          latitude,
          longitude,
          image_url,
          contact_preference,
          date_reported,
          created_at,
          profiles (
            id,
            username,
            full_name,
            email,
            avatar_url,
            role,
            location,
            created_at
          )
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("GET saved-posts error:", error);
      return c.json({ error: error.message }, 500);
    }

    const mapped = (data || []).map((item: any) => ({
      ...item,
      pet_reports: item.pet_reports
        ? mapReportForFrontend(item.pet_reports)
        : null,
    }));

    return c.json({ data: mapped });
  } catch (err: any) {
    console.log("GET saved-posts server error:", err);

    return c.json(
      { error: err.message || "Failed to load saved posts" },
      500,
    );
  }
});

async function toggleSavedPost(
  userId: string,
  reportId: string,
) {
  const { data: existing } = await supabase
    .from("saved_posts")
    .select("id")
    .eq("user_id", userId)
    .eq("report_id", reportId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("saved_posts")
      .delete()
      .eq("id", existing.id);
    return false;
  }

  await supabase.from("saved_posts").insert({
    user_id: userId,
    report_id: reportId,
  });

  return true;
}

app.post(`${PREFIX}/saved-posts/toggle`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const { report_id } = await c.req.json();

    if (!report_id) {
      return c.json({ error: "report_id is required" }, 400);
    }

    const saved = await toggleSavedPost(user.id, report_id);

    return c.json({ saved });
  } catch (err: any) {
    console.log("POST saved-posts/toggle error:", err);

    return c.json(
      { error: err.message || "Failed to toggle saved post" },
      500,
    );
  }
});

app.post(`${PREFIX}/saved-posts`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const { report_id } = await c.req.json();

    if (!report_id) {
      return c.json({ error: "report_id is required" }, 400);
    }

    const saved = await toggleSavedPost(user.id, report_id);

    return c.json({ saved });
  } catch (err: any) {
    console.log("POST saved-posts error:", err);

    return c.json(
      { error: err.message || "Failed to save post" },
      500,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/profile`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const profile = await ensureProfile(user);

    if (!profile) {
      return c.json({ error: "Failed to load profile" }, 500);
    }

    return c.json({ data: profile });
  } catch (err: any) {
    console.log("GET profile error:", err);

    return c.json(
      { error: err.message || "Failed to load profile" },
      500,
    );
  }
});

app.patch(`${PREFIX}/profile`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const body = await c.req.json();

    const allowedPayload: Record<string, any> = {
      id: user.id,
    };

    if (body.full_name !== undefined)
      allowedPayload.full_name = body.full_name;
    if (body.avatar_url !== undefined)
      allowedPayload.avatar_url = body.avatar_url;
    if (body.location !== undefined)
      allowedPayload.location = body.location;
    if (body.email !== undefined)
      allowedPayload.email = body.email;

    const { data, error } = await supabase
      .from("profiles")
      .update(allowedPayload)
      .eq("id", user.id)
      .select("*")
      .single();

    if (error) {
      console.log("PATCH profile error:", error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ data: mapProfile(data) });
  } catch (err: any) {
    console.log("PATCH profile server error:", err);

    return c.json(
      { error: err.message || "Failed to update profile" },
      500,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// USER DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/my-reports`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const { data: reports, error } = await supabase
      .from("pet_reports")
      .select(
        `
        id,
        user_id,
        report_type,
        pet_name,
        animal_type,
        breed,
        color,
        size,
        gender,
        status,
        description,
        location_name,
        latitude,
        longitude,
        image_url,
        contact_preference,
        date_reported,
        created_at,
        profiles (
          id,
          username,
          full_name,
          email,
          avatar_url,
          role,
          location,
          created_at
        ),
        comments (
          id
        ),
        reactions (
          id
        )
      `,
      )
      .eq("user_id", user.id)
      .neq("status", "removed")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("GET my-reports error:", error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({
      data: (reports || []).map((report: any) =>
        mapReportForFrontend(report),
      ),
    });
  } catch (err: any) {
    console.log("GET my-reports server error:", err);

    return c.json(
      { error: err.message || "Failed to load my reports" },
      500,
    );
  }
});

app.get(`${PREFIX}/my-stats`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const [reportsRes, savedRes, commentsRes, reunitedRes] =
      await Promise.all([
        supabase
          .from("pet_reports")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .in("status", [
            "active",
            "under_review",
            "possible_match",
          ]),
        supabase
          .from("saved_posts")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id),
        supabase
          .from("pet_reports")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("status", "reunited"),
      ]);

    return c.json({
      data: {
        activeReports: reportsRes.count ?? 0,
        savedPosts: savedRes.count ?? 0,
        comments: commentsRes.count ?? 0,
        reunited: reunitedRes.count ?? 0,
      },
    });
  } catch (err: any) {
    console.log("GET my-stats server error:", err);

    return c.json(
      { error: err.message || "Failed to load stats" },
      500,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/notifications`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ data: [] });
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.log("GET notifications error:", error);
      return c.json({ data: [] });
    }

    const mapped = (data || []).map((notification: any) => ({
      ...notification,
      type: notification.notification_type,
      read: notification.is_read,
    }));

    return c.json({ data: mapped });
  } catch (err: any) {
    console.log("GET notifications server error:", err);

    return c.json({ data: [] });
  }
});

app.patch(`${PREFIX}/notifications/read`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    return c.json({ success: true });
  } catch (err: any) {
    console.log("PATCH notifications/read error:", err);

    return c.json(
      {
        error: err.message || "Failed to update notifications",
      },
      500,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/admin/stats`, async (c: any) => {
  try {
    const token = getToken(c);

    if (!(await isAdmin(token))) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const [total, lost, found, reunited, flagged, users] =
      await Promise.all([
        supabase
          .from("pet_reports")
          .select("*", { count: "exact", head: true })
          .neq("status", "removed"),
        supabase
          .from("pet_reports")
          .select("*", { count: "exact", head: true })
          .eq("report_type", "lost")
          .neq("status", "removed"),
        supabase
          .from("pet_reports")
          .select("*", { count: "exact", head: true })
          .eq("report_type", "found")
          .neq("status", "removed"),
        supabase
          .from("pet_reports")
          .select("*", { count: "exact", head: true })
          .eq("status", "reunited"),
        supabase
          .from("flags")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true }),
      ]);

    return c.json({
      data: {
        totalReports: total.count ?? 0,
        lostCases: lost.count ?? 0,
        foundCases: found.count ?? 0,
        reunited: reunited.count ?? 0,
        flaggedPosts: flagged.count ?? 0,
        activeUsers: users.count ?? 0,
      },
    });
  } catch (err: any) {
    console.log("GET admin/stats error:", err);

    return c.json(
      { error: err.message || "Failed to load admin stats" },
      500,
    );
  }
});

app.get(`${PREFIX}/admin/flags`, async (c: any) => {
  try {
    const token = getToken(c);

    if (!(await isAdmin(token))) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const { data, error } = await supabase
      .from("flags")
      .select(
        `
        id,
        report_id,
        user_id,
        reason,
        status,
        created_at,
        pet_reports (
          id,
          pet_name,
          location_name,
          status,
          report_type
        ),
        profiles (
          id,
          username,
          full_name,
          avatar_url,
          role
        )
      `,
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("GET admin/flags error:", error);
      return c.json({ error: error.message }, 500);
    }

    const mapped = (data || []).map((flag: any) => ({
      ...flag,
      pet_reports: flag.pet_reports
        ? {
            ...flag.pet_reports,
            location: flag.pet_reports.location_name,
          }
        : null,
      profiles: mapProfile(flag.profiles),
    }));

    return c.json({ data: mapped });
  } catch (err: any) {
    console.log("GET admin/flags server error:", err);

    return c.json(
      { error: err.message || "Failed to load flags" },
      500,
    );
  }
});

app.patch(`${PREFIX}/admin/flags/:id`, async (c: any) => {
  try {
    const token = getToken(c);
    const user = await getUser(token);

    if (!(await isAdmin(token))) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const flagId = c.req.param("id");
    const body = await c.req.json();
    const action = String(body.action || "").toLowerCase();

    const { data: flag } = await supabase
      .from("flags")
      .select("id, report_id")
      .eq("id", flagId)
      .single();

    if (!flag) {
      return c.json({ error: "Flag not found" }, 404);
    }

    let flagStatus = "pending";
    let reportStatus: string | null = null;

    if (["approve", "approved"].includes(action)) {
      flagStatus = "approved";
      reportStatus = "active";
    } else if (
      ["remove", "removed", "duplicate"].includes(action)
    ) {
      flagStatus = "removed";
      reportStatus = "removed";
    } else {
      return c.json({ error: "Invalid action" }, 400);
    }

    const { data, error } = await supabase
      .from("flags")
      .update({ status: flagStatus })
      .eq("id", flagId)
      .select()
      .single();

    if (error) {
      console.log("PATCH admin/flags error:", error);
      return c.json({ error: error.message }, 500);
    }

    if (flag.report_id && reportStatus) {
      await supabase
        .from("pet_reports")
        .update({ status: reportStatus })
        .eq("id", flag.report_id);
    }

    await logActivity({
      user_id: user?.id,
      action: `flag_${flagStatus}`,
      target_type: "flag",
      target_id: flagId,
    });

    return c.json({ data });
  } catch (err: any) {
    console.log("PATCH admin/flags server error:", err);

    return c.json(
      { error: err.message || "Failed to update flag" },
      500,
    );
  }
});

app.get(`${PREFIX}/admin/activity`, async (c: any) => {
  try {
    const token = getToken(c);

    if (!(await isAdmin(token))) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const { data, error } = await supabase
      .from("activity_logs")
      .select(
        `
        id,
        user_id,
        action,
        target_type,
        target_id,
        created_at,
        profiles (
          id,
          username,
          full_name,
          avatar_url,
          role
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.log("GET admin/activity error:", error);
      return c.json({ data: [] });
    }

    const mapped = (data || []).map((log: any) => ({
      ...log,
      target: log.target_id,
      profiles: mapProfile(log.profiles),
    }));

    return c.json({ data: mapped });
  } catch (err: any) {
    console.log("GET admin/activity server error:", err);

    return c.json(
      { error: err.message || "Failed to load activity" },
      500,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// FLAGS
// ─────────────────────────────────────────────────────────────────────────────

app.post(`${PREFIX}/flags`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const { report_id, reason } = await c.req.json();

    if (!report_id) {
      return c.json({ error: "report_id is required" }, 400);
    }

    const { data, error } = await supabase
      .from("flags")
      .insert({
        report_id,
        user_id: user.id,
        reason: reason || "User flagged for review",
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.log("POST flags error:", error);
      return c.json({ error: error.message }, 500);
    }

    await logActivity({
      user_id: user.id,
      action: "flagged_report",
      target_type: "pet_report",
      target_id: report_id,
    });

    return c.json({ data }, 201);
  } catch (err: any) {
    console.log("POST flags server error:", err);

    return c.json(
      { error: err.message || "Failed to flag report" },
      500,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD
// ─────────────────────────────────────────────────────────────────────────────

app.post(`${PREFIX}/upload`, async (c: any) => {
  try {
    const user = await getUserFromRequest(c);

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    const body = await c.req.parseBody();
    const file = body["file"] as File;

    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${user.id}/${Date.now()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage
      .from("pet-photos")
      .upload(filename, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.log("POST upload error:", uploadError);
      return c.json({ error: uploadError.message }, 500);
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("pet-photos")
      .getPublicUrl(filename);

    return c.json({ url: publicUrl }, 201);
  } catch (err: any) {
    console.log("POST upload server error:", err);

    return c.json(
      { error: err.message || "Failed to upload file" },
      500,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// MAP PINS
// ─────────────────────────────────────────────────────────────────────────────

app.get(`${PREFIX}/map-pins`, async (c: any) => {
  try {
    const search = c.req.query("search") || "";
    const status = c.req.query("status") || "";
    const reportType = c.req.query("report_type") || "";

    let query = supabase
      .from("pet_reports")
      .select(
        `
        id,
        pet_name,
        animal_type,
        report_type,
        status,
        breed,
        color,
        location_name,
        latitude,
        longitude,
        image_url,
        created_at
      `,
      )
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .neq("status", "removed");

    if (reportType && reportType !== "all") {
      query = query.eq(
        "report_type",
        normalizeReportType(reportType),
      );
    }

    if (status && status !== "all") {
      if (VALID_REPORT_TYPES.includes(status)) {
        query = query.eq("report_type", status);
      } else if (VALID_REPORT_STATUSES.includes(status)) {
        query = query.eq("status", status);
      }
    }

    if (search.trim()) {
      const cleanSearch = search.trim().replace(/[%_]/g, "");

      query = query.or(
        [
          `pet_name.ilike.%${cleanSearch}%`,
          `animal_type.ilike.%${cleanSearch}%`,
          `breed.ilike.%${cleanSearch}%`,
          `color.ilike.%${cleanSearch}%`,
          `location_name.ilike.%${cleanSearch}%`,
        ].join(","),
      );
    }

    query = query
      .order("created_at", { ascending: false })
      .limit(200);

    const { data, error } = await query;

    if (error) {
      console.log("GET map-pins error:", error);
      return c.json({ error: error.message }, 500);
    }

    const pins = (data || []).map((pin: any) => ({
      ...pin,
      display_status: getDisplayStatus(pin),
      pet_type: pin.animal_type,
      location: pin.location_name,
      lat: pin.latitude,
      lng: pin.longitude,
      photo_url: pin.image_url,
    }));

    return c.json({ data: pins });
  } catch (err: any) {
    console.log("GET map-pins server error:", err);

    return c.json(
      { error: err.message || "Failed to load map pins" },
      500,
    );
  }
});

Deno.serve(app.fetch);