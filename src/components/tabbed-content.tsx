"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import TabsList from '@/components/tabs-list';

type TabItem = {
  title: string;
  href?: string;
};

type Project = {
  title: string;
  description: string;
  image: string;
  slug: string;
};

type TabbedContentProps = {
  links: TabItem[];
  projects: Project[];
  locale: string;
};

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

// 3D World images - ordered list
const threeDImages = [
  '/images/3d-world/one.webp',
  '/images/3d-world/two.webp',
  '/images/3d-world/three.webp',
  '/images/3d-world/four.webp',
  '/images/3d-world/five.webp',
  '/images/3d-world/six.webp',
  '/images/3d-world/seven.webp',
  '/images/3d-world/eight.webp',
  '/images/3d-world/nine.webp',
  '/images/3d-world/ten.webp',
  '/images/3d-world/eleven.webp',
  '/images/3d-world/twelve.webp',
  '/images/3d-world/thirteen.webp',
  '/images/3d-world/fourteen.webp',
  '/images/3d-world/fifteen.webp',
  '/images/3d-world/sixteen.webp',
  '/images/3d-world/seventeen.webp',
];

export default function TabbedContent({ links, projects, locale }: TabbedContentProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
  };

  return (
    <section className="mt-8 md:mt-10">
      <TabsList items={links} activeIndex={activeTabIndex} onChange={handleTabChange} />
      
      {/* Projects Tab Content */}
      {activeTabIndex === 0 && (
        <div className="mt-2 grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
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
                      className="object-contain max-h-[80%] max-w-[97%] m-auto transition-transform duration-300"
                    />
                  </div>
                  <h3 className="mt-2 leading-[200%] font-medium md:font-semibold font-montserrat text-foreground text-base">
                    {project.title}
                  </h3>
                  <p className="text-brand-shadow mt-2 md:mt-3 text-xs leading-[200%] md:text-sm">
                    {renderWithHighlights(project.description)}
                  </p>
                </article>
              </Link>
            );
          })}
        </div>
      )}

      {/* 3D World Tab Content */}
      {activeTabIndex === 1 && (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {threeDImages.map((imagePath, index) => (
            <div key={index} className="relative w-full">
              <Image
                src={imagePath}
                alt={`3D artwork ${index + 1}`}
                width={800}
                height={800}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="w-full h-auto rounded-lg"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

