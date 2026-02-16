"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import TabsList from '@/components/tabs-list';

type TabItem = {
  key?: string;
  title: string;
  href?: string;
};

type Project = {
  title: string;
  description: string;
  image: string;
  slug: string;
  externalUrl?: string;
};

type AboutMe = {
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  paragraph4?: string;
};

type Skill = {
  name: string;
  icon: string | null;
};

type Skills = {
  title: string;
  items: Skill[];
};

type Certification = {
  name: string;
  description: string;
  date: string;
  image: string;
};

type Certifications = {
  title: string;
  items: Certification[];
};

type RandomItem = {
  type: string;
  src: string;
  alt: string;
};

type Random = {
  title: string;
  items: RandomItem[];
};

type TabbedContentProps = {
  links: TabItem[];
  projects: Project[];
  locale: string;
  aboutMe?: AboutMe;
  skills?: Skills;
  certifications?: Certifications;
  random?: Random;
};

const renderWithLineBreaks = (text: string) => {
  return text.split('\n').map((line, idx) => {
    if (line.trim() === '') {
      return null;
    }
    if (line.match(/^Why|^[\d•]/)) {
      return (
        <div key={idx} className={line.match(/^[\d•]/) ? 'ml-4' : ''}>
          {line}
        </div>
      );
    }
    return <span key={idx}>{line}</span>;
  });
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

export default function afTabbedContent({ links, projects, locale, aboutMe, skills, certifications, random }: TabbedContentProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
  };

  const activeKey = links[activeTabIndex]?.key;

  return (
    <section className="mt-8 md:mt-10">
      <TabsList items={links} activeIndex={activeTabIndex} onChange={handleTabChange} />
      
      {/* Projects Tab Content */}
      {activeKey === 'projects' && (
        <div className="mt-2 grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const slug = project.slug || project.title.toLowerCase().replace(/\s+/g, '-');
            const projectContent = (
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
            );

            if (project.externalUrl) {
              return (
                <a
                  key={project.title}
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {projectContent}
                </a>
              );
            }

            return (
              <Link key={project.title} href={`/${locale}/projects/${slug}`}>
                {projectContent}
              </Link>
            );
          })}
        </div>
      )}

      {/* 3D World Tab Content */}
      {activeKey === '3d' && (
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

      {/* About Me Tab Content */}
      {activeKey === 'about' && aboutMe && (
        <div className="mt-2 space-y-6 md:space-y-8">
          <div className="space-y-4 md:space-y-6 text-brand-shadow text-xs leading-[200%] md:text-base">
            <div>{renderWithLineBreaks(aboutMe.paragraph1)}</div>
            <div>{renderWithLineBreaks(aboutMe.paragraph2)}</div>
            <div>{renderWithLineBreaks(aboutMe.paragraph3)}</div>
            {aboutMe.paragraph4 && <div>{renderWithLineBreaks(aboutMe.paragraph4)}</div>}
          </div>
          
          {skills && (
            <div className="space-y-4 md:space-y-6 md:w-[70%]">
              <h3 className="text-base md:text-xl font-medium text-foreground">
                {skills.title}
              </h3>
              <div className="flex flex-wrap gap-y-3 gap-x-2">
                {skills.items.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center w-fit py-1 text-[13px] md:text-sm rounded-2xl border border-brand-grey  px-3"
                  >
                    {skill.icon && (
                      <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={14}
                        height={14}
                        className="w-5 h-5 mr-2"
                      />
                    )}
                    <span>{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications && (
            <div className="space-y-4 md:space-y-6 md:w-[70%]">
              <h3 className="text-base md:text-xl font-medium text-foreground">
                {certifications.title}
              </h3>
              <div className="space-y-6">
                {certifications.items.map((cert, index) => (
                  <div key={index} className="space-y-3">
                    <div>
                      <h4 className="text-sm md:text-base font-medium text-foreground mb-1">
                        {cert.name}
                      </h4>
                      <p className="text-xs md:text-sm text-brand-shadow mb-1">
                        {cert.description}
                      </p>
                      <p className="text-xs md:text-sm text-brand-shadow">
                        {cert.date}
                      </p>
                    </div>
                    {cert.image && (
                      <div className="pt-2">
                        <Image
                          src={cert.image}
                          alt={cert.name}
                          width={1200}
                          height={800}
                          className="w-full h-auto rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {random && (
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-base md:text-xl font-medium text-foreground">
                {random.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {random.items.map((item, index) => (
                  <div key={index} className="relative w-full">
                    {item.type === 'image' ? (
                      <Image
                        src={item.src}
                        alt={item.alt}
                        width={800}
                        height={800}
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="w-full h-auto rounded-lg"
                      />
                    ) : (
                      <video
                        src={item.src}
                        controls
                        className="w-full h-auto rounded-lg"
                        aria-label={item.alt}
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

