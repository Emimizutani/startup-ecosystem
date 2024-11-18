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
    }
  ]
};

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
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
        const skills = Array.isArray(student.skills)
          ? student.skills
          : student.skills.flatMap(skill => 
              Object.values(skill).flat()
            );

        await db.insert(profiles).values({
          userId: newUser.id,
          name: student.name,
          bio: student.project_experience?.[0]?.description || student.idea_overview?.[0]?.description,
          skills: skills,
          experience: student.project_experience
            ?.map(exp => `${exp.project_name}: ${exp.description}`)
            .join('\n'),
          location: student.location,
          contactEmail: `${student.id.toLowerCase()}@example.com`
        });

        console.log(`Created student: ${student.name}`);
      } else {
        console.log(`Student ${student.name} already exists, skipping...`);
      }
    }

    // Seed Companies
    for (const company of sampleData.companies) {
      // Check if company already exists
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
      } else {
        console.log(`Company ${company.name} already exists, skipping...`);
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
