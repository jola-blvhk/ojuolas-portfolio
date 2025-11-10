import Image from 'next/image';
import fs from 'node:fs/promises';
import path from 'node:path';
import TabbedContent from '@/components/tabbed-content';

type Params = {
  params: {
    locale: string;
  };
};

// Links will be localized from the translation file below

export default async function LocalizedHome({ params }: Params) {
  const locale = params.locale === 'pt' ? 'pt' : 'en';
  const filePath = path.join(
    process.cwd(),
    'public',
    'locales',
    locale,
    'common.json',
  );
  const content = await fs.readFile(filePath, 'utf8');
  const t = JSON.parse(content) as any;
  const links = [
    { title: t['tabs.projects'] },
    { title: t['tabs.3d'] },
    { title: t['tabs.about'] },
    { title: t['tabs.resume'], href: 'https://drive.google.com/file/d/134DJ7dBBGusnaeYbpkJDZtnXC0trlsrT/view' },
    { title: t['tabs.linkedin'], href: 'https://www.linkedin.com/in/bello-ojuolape?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app' },
    { title: t['tabs.behance'], href: 'https://www.behance.net/ojuolapebello' },
  ];
  const projects = (t.projects ?? []) as { title: string; description: string; image: string; slug: string; externalUrl?: string }[];
  const aboutMe = t.aboutMe as { paragraph1: string; paragraph2: string; paragraph3: string; paragraph4?: string } | undefined;
  const skills = t.skills as { title: string; items: Array<{ name: string; icon: string | null }> } | undefined;
  const certifications = t.certifications as { title: string; items: Array<{ name: string; description: string; date: string; image: string }> } | undefined;
  const random = t.random as { title: string; items: Array<{ type: string; src: string; alt: string }> } | undefined;
  
  // Debug: log projects to see if slugs are loaded
  console.log('Projects loaded:', projects);
  const renderWithHighlights = (text: string) => {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const contentPart = part.slice(2, -2);
        return (
          <span key={idx} className="text-foreground font-medium">
            {contentPart}
          </span>
        );
      }
      return part;
    });
  };
  return (
    <main className="">
      <h1 className="font-montserrat mb-3 text-2xl font-semibold">
        {t.welcome}
      </h1>
      <div className="flex items-center gap-4">
        <div className="flex h-[27px] w-fit items-center gap-1.5 rounded-[27.18px] border-[0.54px] border-[#B8B7B7] px-[7px] text-[10.87px] md:text-xs">
          <Image
            src="/icons/green-light.svg"
            alt="green-light"
            width={20}
            height={20}
            className="h-auto w-3 dark:hidden"
          />
          <Image
            src="/icons/green-dark.svg"
            alt="green-dark"
            width={20}
            height={20}
            className="hidden h-auto w-3 dark:block"
          />
          <p>Open to work</p>
        </div>
        <div className="flex h-[27px] w-fit items-center gap-1.5 rounded-[27.18px] border-[0.54px] border-[#B8B7B7] px-[7px] text-[10.87px] md:text-xs">
          <Image
            src="/icons/location.svg"
            alt="location"
            width={20}
            height={20}
            className="h-auto w-3"
          />
          <p>Lisbon, Portugal</p>
        </div>
      </div>
      <p className="text-brand-shadow mt-3 max-w-[892px] text-xs leading-[200%] md:text-base">
        {renderWithHighlights(t.about)}
      </p>

      {/* Tabbed content section */}
      <TabbedContent 
        links={links}
        projects={projects}
        locale={locale}
        aboutMe={aboutMe}
        skills={skills}
        certifications={certifications}
        random={random}
      />
    </main>
  );
}
