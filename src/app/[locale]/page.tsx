import Image from 'next/image';
import Link from 'next/link';
import fs from 'node:fs/promises';
import path from 'node:path';
import TabsList from '@/components/tabs-list';

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
    { title: t['tabs.resume'] },
    { title: t['tabs.linkedin'] },
    { title: t['tabs.behance'] },
  ];
  const projects = (t.projects ?? []) as { title: string; description: string; image: string; slug: string }[];
  
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

      {/* project section */}
      <section className="mt-8 md:mt-10">
        <TabsList items={links} initialActiveIndex={0} />
        <div className="mt-2 grid grid-cols-1 gap-x-2 gap-y-10  sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const slug = project.slug || project.title.toLowerCase().replace(/\s+/g, '-');
            return (
            <Link key={project.title} href={`/${locale}/projects/${slug}`}>
              <article className="group cursor-pointer">
                <div className="relative w-full h-[291px] md:h-[366px] dash-border border border-brand-grey dark:border-[#6F6F6F4D] transform-gpu transition-transform duration-300 group-hover:-rotate-4">
                  <Image 
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain max-h-[80%]  max-w-[97%] m-auto transition-transform duration-300  "
                  />
                </div>
                <h3 className="mt-2 leading-[200%] font-medium md:font-semibold font-montserrat text-foreground text-base">{project.title}</h3>
                <p className="text-brand-shadow mt-2 md:mt-3 text-xs leading-[200%] md:text-sm">{renderWithHighlights(project.description)}</p>
              </article>
            </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
