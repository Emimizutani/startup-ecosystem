import { useI18n } from "@/lib/i18n";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Event } from "db/schema";
import { format } from "date-fns";
import { startOfDay } from "date-fns";
import { CalendarIcon, MapPinIcon, Users2Icon } from "lucide-react";

export default function Events() {
  const { t } = useI18n();
  const { data: events } = useSWR<Event[]>("/api/events");

  const upcomingEvents = events
    ?.filter((event) => new Date(event.date) >= startOfDay(new Date()))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    ?.filter((event) => new Date(event.date) < startOfDay(new Date()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">{t("events.upcoming")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents?.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(event.date), "PPP")}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarIcon className="h-4 w-4" />
                    <span>締切: {format(new Date(event.registration_deadline), "PPP")}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{event.isOnline ? "オンライン" : event.location}</span>
                  </div>
                  {event.speakers && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Users2Icon className="h-4 w-4" />
                      <span>{event.speakers.map(s => s.name).join(", ")}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    {event.registration_fee > 0 && (
                      <Badge variant="default">
                        ¥{event.registration_fee.toLocaleString()}
                      </Badge>
                    )}
                    <Button>{t("events.register")}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">{t("events.past")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents?.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(event.date), "PPP")}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
