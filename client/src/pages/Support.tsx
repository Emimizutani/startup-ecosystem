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
              <CardTitle>資金提供</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                スタートアップの成長をサポートする資金調達機会の提供
              </p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>インキュベーションプログラム</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                事業成長に必要なリソースとノウハウを提供するプログラム
              </p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>オフィススペースの提供</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                スタートアップに最適な作業環境とネットワーキングスペース
              </p>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>メンターシップ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                経験豊富な起業家やビジネス専門家によるメンタリング
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
            <AccordionTrigger>資金調達の申請方法を教えてください。</AccordionTrigger>
            <AccordionContent>
              資金調達の申請は、まずプロフィールを完成させ、ビジネスプランを提出することから始まります。審査後、適切な資金調達方法についてアドバイスを提供します。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="incubation">
            <AccordionTrigger>インキュベーションプログラムの期間はどのくらいですか？</AccordionTrigger>
            <AccordionContent>
              通常のプログラムは3〜6ヶ月間です。プログラム期間中は、メンタリング、ワークショップ、ネットワーキングイベントなどが提供されます。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="office">
            <AccordionTrigger>オフィススペースの利用条件はありますか？</AccordionTrigger>
            <AccordionContent>
              登録済みのスタートアップであれば、フレキシブルなプランから選択して利用できます。24時間利用可能で、会議室やイベントスペースも予約可能です。
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="mentorship">
            <AccordionTrigger>メンターとのマッチング方法について教えてください。</AccordionTrigger>
            <AccordionContent>
              ご登録後、事業領域や課題に基づいて最適なメンターをご紹介します。メンターとの初回面談で相性を確認し、継続的なサポートを受けることができます。
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
