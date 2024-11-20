import { useI18n } from "@/lib/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Support() {
  const { t } = useI18n();

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-6">{t("support.startupResources")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("support.fundingTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("support.fundingDesc")}
              </p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t("support.incubationTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("support.incubationDesc")}
              </p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("support.officeTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("support.officeDesc")}
              </p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("support.mentorshipTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("support.mentorshipDesc")}
              </p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">FAQ</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="funding">
            <AccordionTrigger>{t("support.faqFundingQ")}</AccordionTrigger>
            <AccordionContent>
              {t("support.faqFundingA")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="incubation">
            <AccordionTrigger>{t("support.faqIncubationQ")}</AccordionTrigger>
            <AccordionContent>
              {t("support.faqIncubationA")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="office">
            <AccordionTrigger>{t("support.faqOfficeQ")}</AccordionTrigger>
            <AccordionContent>
              {t("support.faqOfficeA")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="mentorship">
            <AccordionTrigger>{t("support.faqMentorshipQ")}</AccordionTrigger>
            <AccordionContent>
              {t("support.faqMentorshipA")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">{t("support.contact")}</h2>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea rows={4} />
            </div>
            <Button className="w-full">{t("common.submit")}</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
