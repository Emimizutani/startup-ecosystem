import { db } from "db";
import { users, profiles, events } from "db/schema";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const crypto = {
  hash: async (password: string) => {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }
};

interface StudentData {
  id: string;
  name: string;
  role: string;
  skills: string[] | { [key: string]: string[] }[];
  project_experience?: { project_name: string; description: string }[];
  idea_overview?: { title: string; description: string }[];
  interests?: string[];
  location: string;
  availability: string;
}

interface CompanyData {
  id: string;
  name: string;
  role: string;
  expertise?: string[];
  focus_areas?: string[];
  projects: { project_name: string; description: string }[];
  location: string;
}

function processSkills(skills: string[] | { [key: string]: string[] }[]): any {
  if (Array.isArray(skills)) {
    if (skills.length > 0 && typeof skills[0] === 'string') {
      return { skills: skills };
    }
    const processedSkills: { [key: string]: string[] } = {};
    (skills as { [key: string]: string[] }[]).forEach(skillObj => {
      Object.entries(skillObj).forEach(([key, value]) => {
        processedSkills[key] = value;
      });
    });
    return processedSkills;
  }
  return { skills: [] };
}

const sampleData = {
  students: [
    {
      id: "S001",
      name: "Yuki Tanaka",
      role: "技術提供者",
      skills: [
        { programming_languages: ["Python", "C++", "JavaScript"] },
        { frameworks: ["TensorFlow", "React"] },
        { other: ["Machine Learning", "Web Development"] }
      ],
      project_experience: [
        {
          project_name: "画像分類AIモデルの構築",
          description: "TensorFlowを用いて画像分類AIを開発"
        }
      ],
      interests: ["AI", "Webサービス", "教育テクノロジー"],
      location: "Tokyo",
      availability: "週10時間"
    },
    {
      id: "S002",
      name: "Aya Suzuki",
      role: "アイデア提供者",
      skills: ["UI/UXデザイン", "企画"],
      idea_overview: [
        {
          title: "環境保護ソーシャルプラットフォーム",
          description: "ゴミ拾いイベントを簡単に企画・参加できるアプリ"
        }
      ],
      location: "Osaka",
      availability: "週20時間"
    },
    {
      id: "S003",
      name: "Kenji Yamamoto",
      role: "技術提供者",
      skills: ["Java", "Spring", "PostgreSQL"],
      project_experience: [
        {
          project_name: "業務管理システムの開発",
          description: "企業向けのバックエンドシステムを構築"
        }
      ],
      interests: ["業務効率化", "クラウドコンピューティング"],
      location: "Nagoya",
      availability: "週15時間"
    },
    {
      id: "S004",
      name: "Haruka Nakamura",
      role: "アイデア提供者",
      skills: ["教育テクノロジー", "マーケティング"],
      idea_overview: [
        {
          title: "AIを活用した学習プラットフォーム",
          description: "個別カスタマイズされた学習計画を提供"
        }
      ],
      location: "Tokyo",
      availability: "週10時間"
    },
    {
      id: "S005",
      name: "Taro Matsumoto",
      role: "技術提供者",
      skills: ["Ruby", "Rails", "AWS"],
      project_experience: [
        {
          project_name: "Eコマースプラットフォームの構築",
          description: "サーバーサイドのAPIを設計"
        }
      ],
      interests: ["Eコマース", "FinTech"],
      location: "Osaka",
      availability: "週25時間"
    },
    {
      id: "S006",
      name: "Mika Shimizu",
      role: "アイデア提供者",
      skills: ["企画", "デザイン"],
      idea_overview: [
        {
          title: "健康管理アプリの新機能",
          description: "睡眠データを活用したアドバイザー"
        }
      ],
      location: "Kyoto",
      availability: "週20時間"
    },
    {
      id: "S007",
      name: "Kenta Aoki",
      role: "技術提供者",
      skills: ["PHP", "Laravel", "MySQL"],
      project_experience: [
        {
          project_name: "ブログサイトの開発",
          description: "ユーザー認証とコメント機能を実装"
        }
      ],
      interests: ["コンテンツ管理", "メディア"],
      location: "Fukuoka",
      availability: "週10時間"
    },
    {
      id: "S008",
      name: "Saki Takahashi",
      role: "アイデア提供者",
      skills: ["社会福祉", "リサーチ"],
      idea_overview: [
        {
          title: "障がい者支援ツール",
          description: "手話翻訳を行うAIシステム"
        }
      ],
      location: "Hokkaido",
      availability: "週15時間"
    },
    {
      id: "S009",
      name: "Shota Fujimoto",
      role: "技術提供者",
      skills: ["HTML", "CSS", "JavaScript"],
      project_experience: [
        {
          project_name: "ポートフォリオサイトの開発",
          description: "インタラクティブなUIを設計"
        }
      ],
      interests: ["フロントエンド開発", "デザイン"],
      location: "Kobe",
      availability: "週5時間"
    },
    {
      id: "S010",
      name: "Kaori Yamashita",
      role: "アイデア提供者",
      skills: ["農業", "ビジネス企画"],
      idea_overview: [
        {
          title: "農業IoTシステム",
          description: "センサーデータを活用した農業支援アプリ"
        }
      ],
      location: "Niigata",
      availability: "週10時間"
    }
  ],
  companies: [
    {
      id: "C001",
      name: "EcoFuture Inc.",
      role: "技術提供者",
      expertise: ["環境テクノロジー", "データ分析"],
      projects: [
        {
          project_name: "AIを活用したリサイクルプロセスの最適化",
          description: "廃棄物分類を効率化"
        }
      ],
      location: "Tokyo"
    },
    {
      id: "C002",
      name: "HealthNext Co.",
      role: "アイデア提供者",
      focus_areas: ["ヘルスケア", "AI"],
      projects: [
        {
          project_name: "予防医療サービスの構築",
          description: "健康プラン提供"
        }
      ],
      location: "Osaka"
    },
    {
      id: "C003",
      name: "TechVision Ltd.",
      role: "技術提供者",
      expertise: ["クラウドコンピューティング", "IoT"],
      projects: [
        {
          project_name: "工場管理システムのIoT化",
          description: "センサー連携で効率化"
        }
      ],
      location: "Nagoya"
    },
    {
      id: "C004",
      name: "EduPlus Inc.",
      role: "アイデア提供者",
      focus_areas: ["教育テクノロジー", "学習支援"],
      projects: [
        {
          project_name: "オンライン学習プラットフォーム",
          description: "AIベースの教育アプリ"
        }
      ],
      location: "Tokyo"
    },
    {
      id: "C005",
      name: "AgriTech Solutions",
      role: "技術提供者",
      expertise: ["農業", "IoT"],
      projects: [
        {
          project_name: "農場データ可視化ツール",
          description: "収穫量を予測"
        }
      ],
      location: "Niigata"
    },
    {
      id: "C006",
      name: "GreenLife Corp.",
      role: "アイデア提供者",
      focus_areas: ["エコ商品", "サステナビリティ"],
      projects: [
        {
          project_name: "再利用素材のEコマース",
          description: "サステナブル商品を販売"
        }
      ],
      location: "Kyoto"
    },
    {
      id: "C007",
      name: "SafeTech Inc.",
      role: "技術提供者",
      expertise: ["セキュリティ", "AI"],
      projects: [
        {
          project_name: "企業向けセキュリティツール",
          description: "脅威分析システム"
        }
      ],
      location: "Osaka"
    },
    {
      id: "C008",
      name: "SocialAid Co.",
      role: "アイデア提供者",
      focus_areas: ["福祉", "社会貢献"],
      projects: [
        {
          project_name: "障がい者支援アプリ",
          description: "音声と手話の翻訳"
        }
      ],
      location: "Hokkaido"
    },
    {
      id: "C009",
      name: "DigitalCraft Inc.",
      role: "技術提供者",
      expertise: ["フロントエンド開発", "UI/UX"],
      projects: [
        {
          project_name: "インタラクティブWebデザイン",
          description: "動的なWebサイト構築"
        }
      ],
      location: "Kobe"
    },
    {
      id: "C010",
      name: "HealthAid LLC",
      role: "アイデア提供者",
      focus_areas: ["ヘルスケア", "栄養管理"],
      projects: [
        {
          project_name: "食事トラッキングアプリ",
          description: "栄養データ分析"
        }
      ],
      location: "Fukuoka"
    }
  ]
};

// Seed Events
const eventData = [
  {
    title: "2024年スタートアップビジネスコンテスト",
    description: "新しいアイデアを持つスタートアップ企業が競い合うビジネスコンテスト。優勝者には資金援助とメンターシップが提供されます。",
    date: new Date("2024-05-15"),
    location: "オンライン (Zoom)",
    registration_deadline: new Date("2024-05-10"),
    registration_fee: 5000,
    revenue: 150000,
    speakers: [
      {
        name: "田中 太郎",
        role: "投資家",
        bio: "国内外のスタートアップに投資している経験豊富な投資家。"
      },
      {
        name: "佐藤 花子",
        role: "起業家",
        bio: "スタートアップ企業の創業者。数々のビジネスコンテストで優勝経験がある。"
      }
    ],
    content: ["ビジネスプラン発表", "投資家によるフィードバック", "審査員による評価・表彰式"],
    sponsor: ["株式会社A", "株式会社B"],
    isOnline: true
  },
  {
    title: "スタートアップ企業向けマーケティング戦略セミナー",
    description: "スタートアップ企業が市場に適応し、効果的なマーケティング戦略を立てるためのセミナー。",
    date: new Date("2024-08-10"),
    location: "大阪・会議室B",
    registration_deadline: new Date("2024-08-05"),
    registration_fee: 6000,
    revenue: 18000,
    speakers: [
      {
        name: "川村 圭一",
        role: "マーケティングコンサルタント",
        bio: "スタートアップのマーケティング戦略に特化したコンサルタント。"
      },
      {
        name: "田島 光",
        role: "デジタルマーケティング専門家",
        bio: "デジタルマーケティング分野での豊富な経験を持つ。"
      }
    ],
    content: ["ターゲット市場の分析", "デジタル広告戦略", "ソーシャルメディア活用法"],
    sponsor: ["株式会社E"],
    isOnline: false
  }
];

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Clear existing data first
    await db.delete(events);
    await db.delete(profiles);
    await db.delete(users);
    
    // Seed Students
    for (const student of sampleData.students) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, student.id))
        .limit(1);

      if (!existingUser) {
        const hashedPassword = await crypto.hash(student.id);
        const [newUser] = await db
          .insert(users)
          .values({
            username: student.id,
            password: hashedPassword,
            email: `${student.id.toLowerCase()}@example.com`,
            type: "student",
            language: "ja"
          })
          .returning();

        await db.insert(profiles).values({
          userId: newUser.id,
          name: student.name,
          bio: student.project_experience?.[0]?.description || student.idea_overview?.[0]?.description,
          skills: processSkills(student.skills),
          experience: student.project_experience
            ?.map(exp => `${exp.project_name}: ${exp.description}`)
            .join('\n'),
          location: student.location,
          contactEmail: `${student.id.toLowerCase()}@example.com`
        });

        console.log(`Created student: ${student.name}`);
      }
    }

    // Seed Companies
    for (const company of sampleData.companies) {
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, company.id))
        .limit(1);

      if (!existingUser) {
        const hashedPassword = await crypto.hash(company.id);
        const [newUser] = await db
          .insert(users)
          .values({
            username: company.id,
            password: hashedPassword,
            email: `${company.id.toLowerCase()}@example.com`,
            type: "company",
            language: "ja"
          })
          .returning();

        const skills = [...(company.expertise || []), ...(company.focus_areas || [])];
        
        await db.insert(profiles).values({
          userId: newUser.id,
          name: company.name,
          bio: company.projects[0].description,
          skills: { skills: skills },
          experience: company.projects
            .map(proj => `${proj.project_name}: ${proj.description}`)
            .join('\n'),
          location: company.location,
          contactEmail: `${company.id.toLowerCase()}@example.com`
        });

        console.log(`Created company: ${company.name}`);
      }
    }

    // Get a company user to be the event creator
    const [adminUser] = await db
      .select()
      .from(users)
      .where(eq(users.type, "company"))
      .limit(1);

    if (!adminUser) {
      throw new Error("No company user found to create events");
    }

    // Seed Events
    for (const event of eventData) {
      await db.insert(events).values({
        ...event,
        creatorId: adminUser.id // Use existing company user ID
      });
      console.log(`Created event: ${event.title}`);
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
    throw error;
  }
}

// Run the seeding function
seedDatabase().catch(console.error);