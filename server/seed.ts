import { db } from "db";
import { users, profiles } from "db/schema";
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

function flattenSkills(skills: string[] | { [key: string]: string[] }[]): string[] {
  if (Array.isArray(skills)) {
    if (skills.length > 0 && typeof skills[0] === 'string') {
      return skills as string[];
    }
    return (skills as { [key: string]: string[] }[]).reduce((acc: string[], skill) => {
      const values = Object.values(skill).flat();
      return [...acc, ...values];
    }, []);
  }
  return [];
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

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Clear existing data first
    await db.delete(profiles);
    await db.delete(users);
    
    // Seed Students
    for (const student of sampleData.students) {
      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(users)
        .where(eq(users.username, student.id))
        .limit(1);

      if (!existingUser) {
        // Create user
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

        // Create profile
        const flattenedSkills = flattenSkills(student.skills);

        await db.insert(profiles).values({
          userId: newUser.id,
          name: student.name,
          bio: student.project_experience?.[0]?.description || student.idea_overview?.[0]?.description,
          skills: flattenedSkills,
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
        // Create user
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

        // Create profile
        const skills = [...(company.expertise || []), ...(company.focus_areas || [])];
        
        await db.insert(profiles).values({
          userId: newUser.id,
          name: company.name,
          bio: company.projects[0].description,
          skills: skills,
          experience: company.projects
            .map(proj => `${proj.project_name}: ${proj.description}`)
            .join('\n'),
          location: company.location,
          contactEmail: `${company.id.toLowerCase()}@example.com`
        });

        console.log(`Created company: ${company.name}`);
      }
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
    throw error;
  }
}

// Run the seeding function
seedDatabase().catch(console.error);