import { useI18n } from "@/lib/i18n";
import { useUser } from "@/hooks/use-user";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { Profile } from "db/schema";

interface ProfileWithType extends Profile {
  type: 'student' | 'company';
}

function ProfileCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/4 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Matching() {
  const { t } = useI18n();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "students" | "companies">("all");

  const { data: profiles, error, isLoading } = useSWR<ProfileWithType[]>("/api/profiles");

  const filteredProfiles = profiles?.filter((profile) => {
    const matchesSearch =
      !searchQuery ||
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(profile.skills) && profile.skills.some(skill =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ));

    const matchesFilter =
      filter === "all" ||
      (filter === "students" && profile.type === "student") ||
      (filter === "companies" && profile.type === "company");

    return matchesSearch && matchesFilter;
  });

  if (error) {
    return (
      <Card className="p-6 text-center">
        <p className="text-red-500 mb-2">Failed to load profiles</p>
        <p className="text-sm text-muted-foreground">Please try again later</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("matching.findMatches")}</h1>
        <div className="flex space-x-4">
          <Input 
            placeholder={t("common.search")}
            className="w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={filter} onValueChange={(value: "all" | "students" | "companies") => setFilter(value)}>
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

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProfileCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProfiles?.length === 0 ? (
        <Card className="p-6 text-center">
          <p>{t("matching.noMatches")}</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles?.map((profile) => (
            <Card key={profile.id}>
              <CardHeader>
                <CardTitle>{profile.name}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {profile.type === "student" ? "Student" : "Company"}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(profile.skills) && profile.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-primary/10 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  {profile.location && (
                    <div className="text-sm mt-2">
                      <span className="text-muted-foreground">Location: </span>
                      {profile.location}
                    </div>
                  )}
                  {user && user.id !== profile.userId && (
                    <Button className="w-full mt-4">Connect</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
