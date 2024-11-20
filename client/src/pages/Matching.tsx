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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type { Profile } from "db/schema";
import { useToast } from "@/hooks/use-toast";

interface ProfileWithType extends Profile {
  type: 'student' | 'company';
}

interface SkillsData {
  programming_languages?: string[];
  frameworks?: string[];
  other?: string[];
  skills?: string[];
  role?: "技術提供者" | "アイデア提供者";
}

type ProfileSkills = SkillsData | string[] | null | undefined;

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
  const [roleFilter, setRoleFilter] = useState<"all" | "技術提供者" | "アイデア提供者">("all");
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithType | null>(null);
  const { toast } = useToast();

  const { data: profiles, error, isLoading } = useSWR<ProfileWithType[]>("/api/profiles");

  const handleContact = async (profile: ProfileWithType) => {
    if (!user) {
      toast({
        title: "ログインが必要です",
        description: "プロフィールに連絡するにはログインしてください。",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would create a match or start a conversation
    toast({
      title: "連絡リクエスト送信",
      description: `${profile.name}さんに連絡リクエストを送信しました。`,
    });
  };

  const formatSkills = (skillsData: ProfileSkills): string[] => {
    if (!skillsData) return [];
    
    if (Array.isArray(skillsData)) {
      return skillsData.map(skill => String(skill));
    }
    
    if (typeof skillsData === 'object') {
      const skills: string[] = [];
      
      if (Array.isArray(skillsData.programming_languages)) {
        skills.push(...skillsData.programming_languages);
      }
      if (Array.isArray(skillsData.frameworks)) {
        skills.push(...skillsData.frameworks);
      }
      if (Array.isArray(skillsData.other)) {
        skills.push(...skillsData.other);
      }
      if (Array.isArray(skillsData.skills)) {
        skills.push(...skillsData.skills);
      }
      
      return skills;
    }
    
    return [];
  };

  const getProfileRole = (skills: ProfileSkills): string | undefined => {
    if (!skills) return undefined;
    
    if (typeof skills === 'object' && !Array.isArray(skills)) {
      if ('role' in skills) return skills.role;
      // Handle nested skills object
      if (skills.skills && Array.isArray(skills.skills)) {
        const roleSkill = skills.skills.find(skill => 
          skill === "技術提供者" || skill === "アイデア提供者"
        );
        return roleSkill;
      }
    }
    return undefined;
  };

  const filteredProfiles = profiles?.filter((profile) => {
    const matchesSearch =
      !searchQuery ||
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatSkills(profile.skills).some(skill =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesFilter =
      filter === "all" ||
      (filter === "students" && profile.type === "student") ||
      (filter === "companies" && profile.type === "company");

    const matchesRoleFilter =
      roleFilter === "all" ||
      getProfileRole(profile.skills) === roleFilter;

    return matchesSearch && matchesFilter && matchesRoleFilter;
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
          <div className="flex space-x-4">
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
            <Select 
              value={roleFilter} 
              onValueChange={(value: "all" | "技術提供者" | "アイデア提供者") => setRoleFilter(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全て</SelectItem>
                <SelectItem value="技術提供者">技術提供者</SelectItem>
                <SelectItem value="アイデア提供者">アイデア提供者</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedProfile && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProfile.name}</DialogTitle>
                <DialogDescription>
                  {selectedProfile.type === "student" ? "Student" : "Company"}
                  {getProfileRole(selectedProfile.skills) && (
                    <Badge variant="secondary" className="ml-2">
                      {getProfileRole(selectedProfile.skills)}
                    </Badge>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground">{selectedProfile.bio}</p>
                </div>
                {selectedProfile.skills && (
                  <div>
                    <h4 className="font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {formatSkills(selectedProfile.skills).map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedProfile.experience && (
                  <div>
                    <h4 className="font-medium mb-2">Experience</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {selectedProfile.experience}
                    </p>
                  </div>
                )}
                {selectedProfile.location && (
                  <div>
                    <h4 className="font-medium mb-2">Location</h4>
                    <p className="text-sm text-muted-foreground">{selectedProfile.location}</p>
                  </div>
                )}
                {user && selectedProfile.contactEmail && (
                  <div>
                    <h4 className="font-medium mb-2">Contact</h4>
                    <p className="text-sm text-muted-foreground">{selectedProfile.contactEmail}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
            <Card 
              key={profile.id} 
              className="cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => setSelectedProfile(profile)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {profile.name}
                  {getProfileRole(profile.skills) && (
                    <Badge variant="secondary">
                      {getProfileRole(profile.skills)}
                    </Badge>
                  )}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {profile.type === "student" ? "Student" : "Company"}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {formatSkills(profile.skills).slice(0, 3).map((skill, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {formatSkills(profile.skills).length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{formatSkills(profile.skills).length - 3}
                      </Badge>
                    )}
                  </div>
                  {profile.location && (
                    <div className="text-sm mt-2">
                      <span className="text-muted-foreground">Location: </span>
                      {profile.location}
                    </div>
                  )}
                  {user && user.id !== profile.userId && (
                    <Button 
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContact(profile);
                      }}
                    >
                      Contact
                    </Button>
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
