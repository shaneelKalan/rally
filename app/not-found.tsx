import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Page Not Found</CardTitle>
                    <CardDescription>
                        The page you're looking for doesn't exist or you don't have access to it.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/">
                        <Button className="w-full">Go Home</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
