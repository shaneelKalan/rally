import { redirect } from "next/navigation";

export default async function EventRedirectPage({
    params,
}: {
    params: Promise<{ eventId: string }>;
}) {
    const { eventId } = await params;
    redirect(`/app/events/${eventId}`);
}
