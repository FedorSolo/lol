// Server Actions that `throw` have their error message replaced by Next.js
// in production builds with a generic "An error occurred in the Server
// Components render..." message, for security (it doesn't want to leak
// server internals to the client by default). That's the right default,
// but it means our own validation/DB errors (duplicate slug, etc.) become
// invisible to the person filling out the form.
//
// The fix: never throw from an action the UI needs to react to. Return a
// result object instead — this is just data, so Next has no reason to
// sanitize it, and the real message reaches the form. `ok` is a proper
// discriminant (not an optional/undefined trick) so `if (!result.ok)`
// narrows reliably in TypeScript.
export type ActionResult = { ok: true } | { ok: false; error: string };
export type ActionResultWithData<T> = { ok: true; data: T } | { ok: false; error: string };
