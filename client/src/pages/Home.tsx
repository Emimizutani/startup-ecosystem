import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{t("home.title")}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("home.subtitle")}
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/matching">{t("home.getStarted")}</Link>
        </Button>
      </section>

      <section className="grid md:grid-cols-3 gap-8 py-12">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">For Students</h3>
          <ul className="space-y-2">
            <li>✓ Connect with innovative companies</li>
            <li>✓ Join startup events</li>
            <li>✓ Build your professional network</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">For Companies</h3>
          <ul className="space-y-2">
            <li>✓ Find talented students</li>
            <li>✓ Host company events</li>
            <li>✓ Build your talent pipeline</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Community Features</h3>
          <ul className="space-y-2">
            <li>✓ AI-powered matching</li>
            <li>✓ Secure messaging</li>
            <li>✓ Event management</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
