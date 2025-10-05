import fs from "node:fs/promises";
import path from "node:path";

type Params = {
  params: {
    locale: string;
  };
};

export default async function LocalizedHome({ params }: Params) {
  const locale = params.locale === "pt" ? "pt" : "en";
  const filePath = path.join(process.cwd(), "public", "locales", locale, "common.json");
  const content = await fs.readFile(filePath, "utf8");
  const t = JSON.parse(content) as Record<string, string>;
  return (
    <main className="">
      <h1 className="text-2xl font-medium">{t.welcome}</h1>
      <p className="text-base text-neutral-600 dark:text-neutral-300">{t.about}</p>
    </main>
  );
}


