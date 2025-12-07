import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewEventPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Create a new event</h1>
                <p className="text-muted-foreground mt-1">Get started by creating an event.</p>
            </div>

            <div className="border rounded-lg p-6 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Quick Start</h3>
                <p className="text-muted-foreground mb-6">Create a placeholder event you can edit later.</p>
                <Link href="/app/events/new">
                    <Button>Create Event (Go to App)</Button>
                </Link>
            </div>
        </div>
    );
}
