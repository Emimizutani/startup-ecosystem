import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">StartupEcosystem</h3>
            <p className="text-sm text-gray-600">
              Connecting students and companies for innovation
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">{t("common.matching")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/matching" className="text-sm text-gray-600 hover:text-primary">
                  {t("matching.findMatches")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">{t("common.events")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/events" className="text-sm text-gray-600 hover:text-primary">
                  {t("events.upcoming")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">{t("common.support")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/support" className="text-sm text-gray-600 hover:text-primary">
                  {t("support.contact")}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} StartupEcosystem. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
