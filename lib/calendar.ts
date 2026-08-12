// Builds a Google Calendar "quick add" link. No API key or OAuth needed —
// this is Google's public template URL, the same mechanism "Add to
// Calendar" buttons use everywhere. Clicking it opens Google Calendar
// with the event pre-filled; the person still has to press Save
// themselves (Google doesn't allow silently writing to someone's
// calendar without them being signed in and consenting on their side).

function formatGoogleDate(dateStr: string): string {
  // dateStr is "YYYY-MM-DD" (a training_sessions.session_date). Treated
  // as an all-day event since sessions don't have a specific start time.
  return dateStr.replace(/-/g, "");
}

export function googleCalendarLink({
  title,
  dateStr,
  description,
}: {
  title: string;
  dateStr: string;
  description?: string;
}): string {
  const start = formatGoogleDate(dateStr);
  // All-day event: Google's format wants the exclusive end date (next day).
  const end = formatGoogleDate(
    new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
  });
  if (description) params.set("details", description);

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
