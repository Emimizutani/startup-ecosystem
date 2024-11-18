import { useI18n } from "@/lib/i18n";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Event } from "db/schema";
import { format } from "date-fns";

export default function Events() {
  const { t } = useI18n();
  const { data: events } = useSWR<Event[]>("/api/events");

  const upcomingEvents = events?.filter(
    (event) => new Date(event.date) > new Date()
  );
  const pastEvents = events?.filter(
    (event) => new Date(event.date) <= new Date()
  );

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
                <p className="text-sm mb-4">{event.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {event.isOnline ? "Online" : event.location}
                  </span>
                  <Button>{t("events.register")}</Button>
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
