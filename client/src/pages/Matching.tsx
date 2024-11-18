import { useI18n } from "@/lib/i18n";
import { useUser } from "@/hooks/use-user";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Profile } from "db/schema";

export default function Matching() {
  const { t } = useI18n();
  const { user } = useUser();
  const { data: profiles } = useSWR<Profile[]>("/api/profiles");
  const { data: matches } = useSWR(user ? "/api/matches" : null);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("matching.findMatches")}</h1>
        <div className="flex space-x-4">
          <Input 
            placeholder={t("common.search")}
            className="w-64"
          />
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="students">Students</SelectItem>
              <SelectItem value="companies">Companies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles?.map((profile) => (
          <Card key={profile.id}>
            <CardHeader>
              <CardTitle>{profile.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{profile.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-primary/10 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <Button className="w-full mt-4">Connect</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
