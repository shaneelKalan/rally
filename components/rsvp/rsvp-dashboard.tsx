"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, HelpCircle, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RSVPDashboardProps {
    guests: any[];
    sessions: any[];
}

export default function RSVPDashboard({ guests = [], sessions = [] }: RSVPDashboardProps) {
    // Calculate stats
    const totalInvited = guests.length;
    const attending = guests.filter(g =>
        g.rsvps?.some((r: any) => r.status === 'attending')
    ).length;
    const declined = guests.filter(g =>
        g.rsvps?.every((r: any) => r.status === 'not_attending') && g.rsvps.length > 0
    ).length;
    const noResponse = totalInvited - attending - declined;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'attending':
                return <Badge className="bg-green-500 hover:bg-green-600">Attending</Badge>;
            case 'not_attending':
                return <Badge variant="destructive">Declined</Badge>;
            default:
                return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
        }
    };

    const downloadCSV = () => {
        // Simple CSV export
        const headers = ['First Name', 'Last Name', 'Email', ...sessions.map(s => s.name), 'Notes'];
        const rows = guests.map(g => [
            g.first_name,
            g.last_name,
            g.email || '',
            ...sessions.map(s => {
                const rsvp = g.rsvps?.find((r: any) => r.event_session_id === s.id);
                return rsvp?.status || 'no_response';
            }),
            g.notes || ''
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "rsvps.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attending</CardTitle>
                        <Check className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{attending}</div>
                        <p className="text-xs text-muted-foreground">
                            {((attending / totalInvited) * 100).toFixed(1)}% of guests
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Declined</CardTitle>
                        <X className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{declined}</div>
                        <p className="text-xs text-muted-foreground">
                            {((declined / totalInvited) * 100).toFixed(1)}% of guests
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{noResponse}</div>
                        <p className="text-xs text-muted-foreground">Awaiting response</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Guest List</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={downloadCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                {sessions.map(session => (
                                    <TableHead key={session.id}>{session.name}</TableHead>
                                ))}
                                {/* Add Question Columns dynamically if needed, keeping simple for now */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {guests.map((guest) => (
                                <TableRow key={guest.id}>
                                    <TableCell className="font-medium">
                                        {guest.first_name} {guest.last_name}
                                        {guest.role === 'plus_one' && <Badge variant="secondary" className="ml-2 text-xs">Plus One</Badge>}
                                    </TableCell>
                                    <TableCell>{guest.email || '-'}</TableCell>
                                    {sessions.map(session => {
                                        const rsvp = guest.rsvps?.find((r: any) => r.event_session_id === session.id);
                                        return (
                                            <TableCell key={session.id}>
                                                {getStatusBadge(rsvp?.status || 'no_response')}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                            {guests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2 + sessions.length} className="text-center py-8 text-muted-foreground">
                                        No guests found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
