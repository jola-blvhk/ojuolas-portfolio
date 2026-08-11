'use client';

import Image from 'next/image';
import fs from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { useHeaderContext } from '@/components/header-context';
import { useEffect, use, useState, useRef } from 'react';

type Params = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

// ImageGallery component for handling multiple images with navigation
function ImageGallery({
  images,
  title,
  peek = false,
}: {
  images: (string | { src: string; alt?: string })[];
  title?: string;
  peek?: boolean;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const hasMultipleImages = images.length > 1;
  
  useEffect(() => {
    const checkOverflow = () => {
      if (scrollContainerRef.current) {
        setHasOverflow(scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth);
      }
    };
    
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [images]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const firstItem = scrollContainerRef.current.firstElementChild as HTMLElement | null;
      const scrollAmount = firstItem
        ? firstItem.offsetWidth + 16
        : scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  if (!hasMultipleImages && images.length === 1) {
    const image = images[0];
    const imageSrc = typeof image === 'string' ? image : image.src;
    const imageAlt = typeof image === 'string' ? `${title || 'Image'}` : image.alt || `${title || 'Image'}`;
    
    return (
      <div className="pt-8 md:pt-[42px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={1200}
          height={800}
          className="w-full h-auto rounded-lg"
        />
      </div>
    );
  }
  
  return (
    <div className="pt-8 md:pt-[42px] relative">
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((image, index) => {
            const imageSrc = typeof image === 'string' ? image : image.src;
            const imageAlt = typeof image === 'string' 
              ? `${title || 'Image'} ${index + 1}` 
              : image.alt || `${title || 'Image'} ${index + 1}`;
            
            return (
              <div
                key={index}
                className={
                  peek
                    ? 'w-[78%] flex-shrink-0 sm:w-[70%] md:w-[68%]'
                    : 'flex-shrink-0'
                }
              >
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className={
                    peek
                      ? 'h-auto w-full rounded-lg'
                      : 'h-auto max-h-[800px] w-auto rounded-lg'
                  }
                  style={peek ? undefined : { maxWidth: 'none' }}
                />
              </div>
            );
          })}
        </div>
        {hasMultipleImages && hasOverflow && (
          <>
            <button
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
              aria-label="Previous images"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
              aria-label="Next images"
              type="button"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Project data - you can move this to a separate file later
const projectData = {
  'ark-software': {
    title: 'Ark Software',
    headerImage: '/images/projects/ark-software/ark-software-header.webp', // Building facade image
    avatarImage: '/images/projects/ark-software/ark-software-avatar.webp', // Sky crop image
      sections: {
        en: [
          { id: 'overview', title: 'Overview' },
          { id: 'process', title: 'The Process' },
          { id: 'problem', title: 'The Problem' },
          { id: 'discovery', title: 'Discovery and Analysis' },
          { id: 'kickoff', title: 'Design Kickoff and General Planning' },
          { id: 'guidelines', title: 'Design Guideline' },
          { id: 'takeaway', title: 'Take Away' }
        ],
        pt: [
          { id: 'overview', title: 'Visão Geral' },
          { id: 'process', title: 'O Processo' },
          { id: 'problem', title: 'O Problema' },
          { id: 'discovery', title: 'Descoberta e Análise' },
          { id: 'kickoff', title: 'Kick-off do Design e Planejamento Geral' },
          { id: 'guidelines', title: 'Diretrizes de Design' },
          { id: 'takeaway', title: 'Conclusões' }
        ]
      },
    content: {
      en: {
        overview: {
          title: 'Overview',
          content: `This project explores the creation of a next-generation architecture and design software—reimagining what tools like Revit, SketchUp, Spline, and Figma could achieve if combined into a single, modern platform. The goal is to merge technical precision with creative flexibility, offering architects, interior designers, and creators an environment where collaboration, AI-powered workflows, and intuitive modeling coexist seamlessly.

The research phase identified limitations in current industry tools, such as fragmented user experiences, steep learning curves, and lack of modern collaboration capabilities. In response, this project proposes a unified platform that not only retains the technical rigor of established software but also integrates AI features, real-time collaboration, and freeform 3D moulding tools for custom furniture and spatial design.`,
          image: '/images/projects/ark-software/ark.webp',
          projectInfo: {
            team: 'Lead UX/UI designer and Researcher.',
            tools: ['Figma/Figjam', 'Spline 3D', 'Google meet', 'Google workspace'],
            duration: 'Ongoing',
            funds: '10 Million Dollars'
          }
        },
        process: {
          title: 'The Process',
          content: 'Our design process follows a structured approach to ensure comprehensive research and user-centered solutions.',
          timeline: [
            { step: 1, title: 'Kick-off/ Heuristic evaluation' },
            { step: 2, title: 'Discovery and Research' },
            { step: 3, title: 'Ideation' },
            { step: 4, title: 'Design' },
            { step: 5, title: 'Ongoing' },
            { step: 6, title: 'Ongoing' }
          ]
        },
        problem: {
          title: 'The Problem',
          content: `Current architecture and design tools offer powerful capabilities, but their fragmentation creates challenges: steep learning curves, limited interoperability, outdated interfaces, and siloed workflows. Teams often struggle with collaboration, while individual creators face restrictions in freely exploring ideas or blending technical precision with creative experimentation. They offer yearly very expensive packages as well and very few of them have limited open source.`
        },
        discovery: {
          title: 'Discovery and Analysis',
          analysisTables: [
            {
              title: 'Feature Analysis',
              icon: '📊',
              columns: ['Revit', 'Sketchup', 'Spline', 'Figma'],
              rows: [
                { feature: 'AI Integration', values: ['Low', 'Moderate', 'High', 'Very High'] },
                { feature: 'Core Workflow', values: ['High', 'High', 'Moderate', 'High'] },
                { feature: 'Collaboration', values: ['Moderate', 'Low', 'High', 'Very High'] },
                { feature: 'Monetization', values: ['High', 'Moderate', 'Low', 'High'] },
                { feature: 'User Engagement', values: ['Moderate', 'High', 'High', 'Very High'] },
                { feature: 'Market Presence', values: ['High', 'High', 'Low', 'Very High'] },
                { feature: 'Accessibility', values: ['Low', 'Moderate', 'High', 'High'] }
              ]
            },
            {
              title: 'Ux and Functionality Analysis',
              icon: '👥',
              columns: ['Revit', 'Sketchup', 'Spline', 'Figma'],
              rows: [
                { feature: 'Visual Design', values: [3, 4, 5, 5] },
                { feature: 'Navigation', values: [2, 3, 4, 5] },
                { feature: 'Onboarding', values: [2, 3, 4, 4] },
                { feature: 'Interactivity', values: [2, 3, 5, 5] },
                { feature: 'Accessibility', values: [2, 3, 4, 4] },
                { feature: 'User Engagement', values: [3, 4, 5, 5] }
              ]
            },
            {
              title: 'SWOT Analysis',
              icon: '📄',
              columns: ['Revit', 'Sketchup', 'Spline', 'Figma'],
              rows: [
                { 
                  feature: 'Strength', 
                  values: [
                    'Strong brand awareness, Innovative gameplay, Community engagement, Regular updates',
                    'High-quality AR imaging, Rich content, Familiar IP, Interactive elements',
                    'Innovative concept, Community engagement, Detailed UI',
                    'Engaging visuals, Intuitive gameplay, Regular updates'
                  ]
                },
                { 
                  feature: 'Weakness', 
                  values: [
                    'AI feature availability, Technical issues, Drain battery life',
                    'Complex interface, Performance issues, Learning curve',
                    'Complexity, Performance issues, Accessibility',
                    'Monetization tactics, Performance issues, Complexity of mechanics'
                  ]
                },
                { 
                  feature: 'Opportunities', 
                  values: [
                    'Tech advancements, Expanding market, Partnerships, E-sports',
                    'Enhanced onboarding, Technological advances, Cross-Promotions',
                    'UI simplification, AI integration, Cross-Platform Integration',
                    'Expansion of features, Community engagement, Cross-platform integration'
                  ]
                },
                { 
                  feature: 'Risks', 
                  values: [
                    'Market competition, Player retention, Privacy concerns, Technical limitations',
                    'Competition, Player retention, Privacy concerns, Technical limitations',
                    'Competitive market, Technical limitations, User retention',
                    'Market competition, Player retention, Technical challenges'
                  ]
                }
              ]
            }
          ]
        },
        kickoff: {
          title: 'Design Kickoff and General Planning',
          content: 'By merging technical rigor with creative flexibility, this platform redefines how architects, designers, and makers engage with digital spaces. It lowers barriers to entry, accelerates workflows, and fosters innovation through collaboration and AI-driven assistance. Ultimately, the project sets the foundation for a future-ready ecosystem where design is more intuitive, accessible, and connected than ever before.',
          generalPlanning: {
            title: 'General Planning',
            content: 'By merging technical rigor with creative flexibility, this platform redefines how architects, designers, and makers engage with digital spaces. It lowers barriers to entry, accelerates workflows, and fosters innovation through collaboration and AI-driven assistance. Ultimately, the project sets the foundation for a future-ready ecosystem where design is more intuitive, accessible, and connected than ever before.',
            images: [
              { src: '/images/projects/ark-software/ark-general-planning-overview.webp', alt: 'General Planning Overview', fullWidth: true },
              { src: '/images/projects/ark-software/ark-general-planning-1.webp', alt: 'Planning Detail 1' },
              { src: '/images/projects/ark-software/ark-general-planning-2.webp', alt: 'Planning Detail 2' }
            ]
          }
        },
        guidelines: {
          title: 'Design Guideline',
          images: [
            { src: '/images/projects/ark-software/ark-guidelines-1.webp', alt: 'Design Guidelines 1' },
            { src: '/images/projects/ark-software/ark-guidelines-2.webp', alt: 'Design Guidelines 2' },
            { src: '/images/projects/ark-software/ark-guidelines-3.webp', alt: 'Design Guidelines 3' }
          ]
        },
        takeaway: {
          title: 'Take Away',
          content: 'By merging technical rigor with creative flexibility, this platform redefines how architects, designers, and makers engage with digital spaces. It lowers barriers to entry, accelerates workflows, and fosters innovation through collaboration and AI-driven assistance. Ultimately, the project sets the foundation for a future-ready ecosystem where design is more intuitive, accessible, and connected than ever before.'
        }
      },
      pt: {
        overview: {
          title: 'Visão Geral',
          content: `Este projeto explora a criação de um software de arquitetura e design de próxima geração—reimaginando o que ferramentas como Revit, SketchUp, Spline e Figma poderiam alcançar se combinadas numa única plataforma moderna. O objetivo é unir precisão técnica com flexibilidade criativa, oferecendo a arquitetos, designers de interiores e criadores um ambiente onde colaboração, fluxos de trabalho alimentados por IA e modelagem intuitiva coexistem perfeitamente.

A fase de pesquisa identificou limitações nas ferramentas atuais da indústria, como experiências de utilizador fragmentadas, curvas de aprendizagem íngremes e falta de capacidades modernas de colaboração. Em resposta, este projeto propõe uma plataforma unificada que não só mantém o rigor técnico do software estabelecido, mas também integra funcionalidades de IA, colaboração em tempo real e ferramentas de moldagem 3D livre para mobiliário personalizado e design espacial.`,
          image: '/images/projects/ark-software/ark.webp'
        },
        process: {
          title: 'O Processo',
          content: 'O nosso processo de design segue uma abordagem estruturada para garantir investigação abrangente e soluções centradas no utilizador.',
          timeline: [
            { step: 1, title: 'Kick-off/ Avaliação Heurística' },
            { step: 2, title: 'Descoberta e Investigação' },
            { step: 3, title: 'Ideação' },
            { step: 4, title: 'Design' },
            { step: 5, title: 'Em Curso' },
            { step: 6, title: 'Em Curso' }
          ]
        },
        problem: {
          title: 'O Problema',
          content: `As ferramentas atuais de arquitetura e design oferecem capacidades poderosas, mas a sua fragmentação cria desafios: curvas de aprendizagem íngremes, interoperabilidade limitada, interfaces desatualizadas e fluxos de trabalho isolados. As equipas frequentemente lutam com a colaboração, enquanto os criadores individuais enfrentam restrições na exploração livre de ideias ou na combinação de precisão técnica com experimentação criativa. Oferecem também pacotes anuais muito caros e muito poucos deles têm código aberto limitado.`
        },
        discovery: {
          title: 'Descoberta e Análise',
          content: 'A nossa fase de descoberta envolveu uma análise abrangente das ferramentas existentes de arquitetura e design para identificar lacunas e oportunidades de inovação.',
          analysisSteps: [
            {
              title: 'Análise de Funcionalidades',
              description: 'Avaliámos funcionalidades principais através do Revit, SketchUp, Spline e Figma incluindo Integração de IA, Fluxo de Trabalho Principal, Colaboração, Monetização, Envolvimento do Utilizador, Presença no Mercado e Acessibilidade.'
            },
            {
              title: 'Análise de UX e Funcionalidade',
              description: 'Avaliámos aspetos da experiência do utilizador incluindo Design Visual, Navegação, Integração, Interatividade, Acessibilidade e Envolvimento do Utilizador usando classificações por estrelas e análise qualitativa.'
            },
            {
              title: 'Análise SWOT',
              description: 'Realizámos uma análise SWOT abrangente identificando pontos fortes, fraquezas, oportunidades e riscos para cada plataforma para informar a nossa estratégia de solução unificada.'
            }
          ]
        },
        kickoff: {
          title: 'Kick-off do Design e Planejamento Geral',
          content: 'Ao unir rigor técnico com flexibilidade criativa, esta plataforma redefine a forma como arquitetos, designers e criadores se envolvem com espaços digitais. Reduz barreiras de entrada, acelera fluxos de trabalho e promove inovação através da colaboração e assistência impulsionada por IA. Em última análise, o projeto estabelece as bases para um ecossistema preparado para o futuro, onde o design é mais intuitivo, acessível e conectado do que nunca.',
          generalPlanning: {
            title: 'Planejamento Geral',
            content: 'Ao unir rigor técnico com flexibilidade criativa, esta plataforma redefine a forma como arquitetos, designers e criadores se envolvem com espaços digitais. Reduz barreiras de entrada, acelera fluxos de trabalho e promove inovação através da colaboração e assistência impulsionada por IA. Em última análise, o projeto estabelece as bases para um ecossistema preparado para o futuro, onde o design é mais intuitivo, acessível e conectado do que nunca.',
            images: [
              { src: '/images/projects/ark-software/ark-general-planning-overview.webp', alt: 'Visão Geral do Planejamento Geral', fullWidth: true },
              { src: '/images/projects/ark-software/ark-general-planning-1.webp', alt: 'Detalhe de Planejamento 1' },
              { src: '/images/projects/ark-software/ark-general-planning-2.webp', alt: 'Detalhe de Planejamento 2' }
            ]
          }
        },
        guidelines: {
          title: 'Diretrizes de Design',
          images: [
            { src: '/images/projects/ark-software/ark-guidelines-1.webp', alt: 'Diretrizes de Design 1' },
            { src: '/images/projects/ark-software/ark-guidelines-2.webp', alt: 'Diretrizes de Design 2' },
            { src: '/images/projects/ark-software/ark-guidelines-3.webp', alt: 'Diretrizes de Design 3' }
          ]
        },
        takeaway: {
          title: 'Conclusões',
          content: 'Ao unir rigor técnico com flexibilidade criativa, esta plataforma redefine a forma como arquitetos, designers e criadores se envolvem com espaços digitais. Reduz barreiras de entrada, acelera fluxos de trabalho e promove inovação através da colaboração e assistência impulsionada por IA. Em última análise, o projeto estabelece as bases para um ecossistema preparado para o futuro, onde o design é mais intuitivo, acessível e conectado do que nunca.'
        }
      }
    }
  },
  'pikd': {
    title: 'PIKD',
    headerImage: '/images/projects/pikd/pikd-header.webp',
    avatarImage: '/images/projects/pikd/pikd-avatar.webp',
    sections: {
      en: [
        { id: 'overview', title: 'Overview' },
        { id: 'process', title: 'The Process' },
        { id: 'problem', title: 'The Problem' },
        { id: 'kickoff', title: 'Project Kick-off and Heuristic evaluation' },
        { id: 'discovery', title: 'Discovery and analysis' },
        { id: 'user-story', title: 'User story' },
        { id: 'design-system', title: 'Design System' },
        { id: 'takeaway', title: 'Take Away' },
        { id: 'testimony', title: 'Testimony' }
      ],
      pt: [
        { id: 'overview', title: 'Visão Geral' },
        { id: 'process', title: 'O Processo' },
        { id: 'problem', title: 'O Problema' },
        { id: 'kickoff', title: 'Kick-off do Projeto e Avaliação Heurística' },
        { id: 'discovery', title: 'Descoberta e Análise' },
        { id: 'user-story', title: 'História do Utilizador' },
        { id: 'design-system', title: 'Sistema de Design' },
        { id: 'takeaway', title: 'Conclusões' },
        { id: 'testimony', title: 'Depoimento' }
      ]
    },
    content: {
      en: {
        overview: {
          title: 'Overview',
          content: `More than a buzzword -PIKD unlocks the power of digital collectibles with our AR-powered platform. Connect with brands, businesses, and communities through real-world use cases and engage Gen Z like never before by exploring a new dimension of acquiring Token collectibles and rewards. Player explores the map around and Find Tokens that are created and shared by their original creator i.e Brands. Player can collect these Tokens for free. AR Camera sees these NFTs nearby 5 meters around in an augmented reality scene.`,
          images: [
            { src: '/images/projects/pikd/pikd-overview-1.webp', alt: 'PIKD Welcome Screen' },
            { src: '/images/projects/pikd/pikd-overview-2.webp', alt: 'PIKD Profile and Prizes' },
            { src: '/images/projects/pikd/pikd-overview-3.webp', alt: 'PIKD Feed and Discover' },
            { src: '/images/projects/pikd/pikd-overview-4.webp', alt: 'PIKD Product Detail' },
            { src: '/images/projects/pikd/pikd-overview-5.webp', alt: 'PIKD Screen 5' }
          ]
        },
        process: {
          title: 'The Process',
          content: 'Our design process follows a structured approach to ensure comprehensive research and user-centered solutions.',
          timeline: [
            { step: 1, title: 'Kick-off/ Heuristic evaluation' },
            { step: 2, title: 'Discovery and Research' },
            { step: 3, title: 'Ideation' },
            { step: 4, title: 'Design' },
            { step: 5, title: 'Hand off' },
            { step: 6, title: 'Take away' }
          ]
        },
        problem: {
          title: 'The Problem',
          content: `Gen Z users are increasingly drawn to interactive digital experiences that offer novelty, social value, and real-world utility. However, existing AR collectible platforms often suffer from cluttered interfaces, lack of meaningful brand integration, and overwhelming feature sets that hinder user engagement. PIKD seeks to redesign its platform to offer a more playful, intuitive, and functional user experience—one that enables users to easily explore, discover, and collect Token NFTs through an AR-powered map, while seamlessly connecting with brands in a way that enhances rather than distracts from the core gameplay. The challenge lies in balancing engagement with simplicity, ensuring that the UI supports both organic exploration and branded interactions without alienating users or compromising usability.`
        },
        kickoff: {
          title: 'Project Kick-off',
          content: `I gathered stakeholders and address any questions or clarifications before diving into the design process. It provided a platform for open discussions, allowing team members to seek clarity, share insights, and align their understanding of the project. This agile approach ensured a smooth transition into the project and set the stage for a focused and collaborative design journey. We also did a heuristic evaluation of the old design.`,
          heuristicEvaluation: {
            title: 'Heuristic evaluation',
            introduction: `In order to gain a comprehensive understanding of the user experience and identify any additional pain points not uncovered in the initial usability testing process, we conducted a heuristic evaluation of the current app. By evaluating the app against established usability principles, we aimed to assess its adherence to best practices and identify areas of improvement. This evaluation allowed us to view the app from the users' perspective, uncovering potential usability issues and enhancing our understanding of their needs and expectations.`,
            images: [
              { src: '/images/projects/pikd/pikd-heuristic-1.webp', alt: 'Heuristic Evaluation Example 1' },
              { src: '/images/projects/pikd/pikd-heuristic-2.webp', alt: 'Heuristic Evaluation Example 2' },
              { src: '/images/projects/pikd/pikd-heuristic-3.webp', alt: 'Heuristic Evaluation Example 3' }
            ],
            findings: [
              {
                category: 'Text Issues',
                problem: 'Inconsistent typography across the app is causing inefficiencies in the design workflow and development process.',
                details: 'Lack of reusable text components. Frequent manual styling (font weight, size, line-height). Leads to longer development time and inconsistent visual hierarchy.'
              },
              {
                category: 'Color Issues',
                problem: 'Inconsistent use of color components, leading to a disjointed and unprofessional appearance.',
                details: 'Some components use predefined colors, while others do not. Incorrect or inconsistent application of brand colors complicates visual consistency and accessibility.'
              },
              {
                category: 'Spacing Issues',
                problem: 'Inconsistent spacing and padding across the UI affects visual harmony and usability.',
                details: 'Elements appear too cramped or too loose. Impacts readability, touch targets, and perceived professionalism of the app.'
              }
            ],
            conclusion: `The key issues—typography inconsistency, poor color discipline, and uneven spacing—are undermining the app's visual consistency and scalability. Addressing these through a design system with standardized components will significantly improve both the user experience and development efficiency.`
          }
        },
        discovery: {
          title: 'Discovery and analysis',
          analysisTables: [
            {
              title: 'Feature Analysis',
              icon: '📊',
              columns: ['Pokemon Go', 'Wizards Unite', 'Ingress', 'Jurassic World'],
              rows: [
                { feature: 'AR Integration', values: ['High', 'Very high', 'Very high', 'Moderate'] },
                { feature: 'Core Gameplay', values: ['Catching Pokémon', 'Casting Spells', 'Capturing Portals', 'Collecting Dinosaurs'] },
                { feature: 'Social Features', values: ['Trading, Raids', 'Friend Gifts, Raids', 'Faction Operations', 'Alliances'] },
                { feature: 'Monetization', values: ['In-app Purchases', 'In-app Purchases', 'In-app Purchases', 'In-app Purchases'] },
                { feature: 'User Engagement', values: ['Very high', 'High', 'Moderate', 'High'] },
                { feature: 'Market Presence', values: ['Very high', 'High', 'Moderate', 'High'] },
                { feature: 'Accessibility', values: ['High', 'High', 'Moderate', 'High'] }
              ]
            },
            {
              title: 'Ux and Functionality Analysis',
              icon: '👥',
              columns: ['Pokemon Go', 'Wizards Unite', 'Ingress', 'Jurassic World'],
              rows: [
                { feature: 'Visual Design', values: [4, 5, 4, 5] },
                { feature: 'Navigation', values: [4, 4, 4, 3] },
                { feature: 'Onboarding', values: [4, 4, 3, 3] },
                { feature: 'Interactivity', values: [4, 5, 4, 3] },
                { feature: 'Accessibility', values: [4, 4, 3, 3] },
                { feature: 'User Engagement', values: [5, 4, 3, 3] }
              ]
            },
            {
              title: 'SWOT Analysis',
              icon: '📄',
              columns: ['Pokemon Go', 'Wizards Unite', 'Ingress', 'Jurassic World'],
              rows: [
                { 
                  feature: 'Strength', 
                  values: [
                    'Strong brand association, Innovative gameplay, Community engagement, Regular updates',
                    'High-quality AR imaging, Rich content, Familiar IP, Interactive elements',
                    'Innovative concept, Community engagement, Detailed UI',
                    'Engaging visuals, Intuitive gameplay, Regular updates'
                  ]
                },
                { 
                  feature: 'Weakness', 
                  values: [
                    'AR feature usability, Technical issues, Drains battery life',
                    'Complex interface, Performance issues, Learning curve',
                    'Complexity, Performance issues, Accessibility',
                    'Monetization tactics, Performance issues, Complexity of mechanics'
                  ]
                },
                { 
                  feature: 'Opportunities', 
                  values: [
                    'Tech advancements, Expanding market, Partnerships, E-sports',
                    'Enhanced onboarding, Technological Advances, Cross-Promotions',
                    'UI simplification, Enhanced tutorials, Cross-Platform Integration',
                    'Expansion of features, Community engagement, Cross-platform integration'
                  ]
                },
                { 
                  feature: 'Risks', 
                  values: [
                    'Market competition, Player retention, Privacy concerns, Technical limitations',
                    'Competition, Player retention, Privacy concerns, Technical limitations',
                    'Competitive market, Technical limitations, User retention',
                    'Market competition, Player retention, Technical challenges'
                  ]
                }
              ]
            }
          ]
        },
        'user-story': {
          title: 'User Story',
          persona: {
            title: 'Player Persona',
            content: `Julia has been picking tokens across the map all day and has hit her daily limit for collecting tokens. A notification appears on her screen, informing her that there's a Power House nearby where she can recharge and continue collecting tokens. Julia heads to the Power House, which is a virtual representation of a popular coffee shop. Upon entering, her token collection limit is refreshed, and she also receives a 1.5x point multiplier for the next 48 hours. Energized, Julia explores the map again, this time with the added boost, increasing her rewards. She plans to visit more Power Houses in the future to maximize her gameplay.`
          },
          useCase: {
            title: 'Player Use case',
            steps: [
              { step: 1, title: 'Daily Token Collection Limit Reached', description: 'Julia reaches her daily token limit after an extended gameplay session.' },
              { step: 2, title: 'Power House Notification', description: 'A notification prompts her to visit a nearby Power House to recharge and continue collecting tokens.' },
              { step: 3, title: 'Travel to Power House', description: 'Julia navigates to the Power House location, which could be a virtual or real-world brand-sponsored spot (e.g., a coffee shop, retail store).' },
              { step: 4, title: 'Recharge and Buffs', description: "Upon arrival, Julia's token collection limit is reset, allowing her to continue collecting tokens. She also receives a temporary buff (e.g., 1.5x point multiplier for 2 hours)." },
              { step: 5, title: 'Extended Gameplay', description: 'With her refreshed token limit and bonus multiplier, Julia resumes collecting tokens with increased efficiency, extending her gameplay session.' },
              { step: 6, title: 'Return to Power House', description: 'Julia plans her gameplay around revisiting Power Houses to strategically recharge and maximize her buffs.' }
            ]
          },
          brandPersona: {
            title: 'Brand Persona',
            content: `Partnership: Adidas partners with Pikd to launch a branded "Power House." The Adidas Power House allows users to recharge their token limits and gain exclusive in-app rewards by visiting the store, either physically or virtually. During special promotional events, players who visit Adidas Power House not only reset their token limits but also receive an in-app voucher for 10% off Adidas products. This initiative leads to an influx of app users visiting Adidas locations, an increase in sales as users redeem vouchers, and growth in Adidas's brand visibility. The partners plan to extend the partnership for future promotions.`
          },
          commercialUseCase: {
            title: 'Commercial Use case',
            steps: [
              { step: 1, title: 'Brand Partnership Setup', description: 'Adidas collaborates with the app to establish a branded Power House. This Power House is described as a virtual or real-world location where users can recharge and receive "buffs" (likely in-app bonuses or advantages).' },
              { step: 2, title: 'Promotion & Marketing', description: 'The campaign is promoted within the app through notifications, banners, and on-feed content. The promotions inform users that they can visit Adidas\'s Power House to reset their token limit and receive exclusive bonuses.' },
              { step: 3, title: 'Power House Visit & Engagement', description: 'Users visit the Adidas Power House to reset their daily token limit. In addition to this, they receive a digital voucher for 10% off Adidas products, which can be redeemed online or in-store.' },
              { step: 4, title: 'Foot Traffic and Sales Impact', description: 'Users are motivated to visit Adidas locations (both virtual and physical) to take advantage of recharging bonuses and special promotions. As users redeem their vouchers, Adidas experiences an increase in sales and brand interaction.' },
              { step: 5, title: 'Post-Campaign Data & Analysis', description: 'Adidas collects data on user visits, voucher redemptions, and increases in store traffic. These insights are used to inform future marketing strategies and partnerships, optimizing future Power House events.' }
            ]
          }
        },
        'design-system': {
          title: 'Design System',
          content: `As the lead designer, I took on the responsibility of establishing a cohesive and visually appealing design system for PIKD. This involved creating a comprehensive style guide that outlined color palettes, typography, iconography, and other visual elements. By defining consistent design patterns and guidelines, I ensured that every aspect of the platform maintained a unified and polished look. This design system served as a valuable resource for the entire team, fostering collaboration and maintaining visual coherence throughout the development process.`,
          image: '/images/projects/pikd/pikd-design-system.webp',
          colorPalette: {
            primary: [
              { name: 'Primary 1', hex: '#9FFF00' },
              { name: 'Primary 2', hex: '#C2F987' },
              { name: 'Primary 3', hex: '#DFFCDA' }
            ],
            linear: [
              { name: 'Linear 1', hex: '#97FF48', hex2: '#C2F987' },
              { name: 'Linear 2', hex: '#97FF48', hex2: '#C2F987' }
            ],
            tetradic: [
              { name: 'Tetradic 1', hex: '#97FF48' },
              { name: 'Tetradic 2', hex: '#97FF48' },
              { name: 'Tetradic 3', hex: '#97FF48' }
            ],
            status: [
              { name: 'Success', hex: '#A0C958' },
              { name: 'Error', hex: '#FB6382' },
              { name: 'Orange', hex: '#AFFBE2' }
            ],
            black: [
              { name: 'black-500', hex: '#18181A' },
              { name: 'black-400', hex: '#45454A' },
              { name: 'black-200', hex: '#A0A0A7' },
              { name: 'black-50', hex: '#E7E7E9' }
            ],
            white: [
              { name: 'White 1', hex: '#E6E6E6' },
              { name: 'White 2', hex: '#E2E2E2' },
              { name: 'White 3', hex: '#F4F4F4' }
            ],
            background: [
              { name: 'Background 1', hex: '#1E3A5F' },
              { name: 'Background 2', hex: '#6B7A8F' },
              { name: 'Background 3', hex: '#E8EBF0' }
            ]
          },
          image2: '/images/projects/pikd/pikd-design-system-2.webp'
        },
        takeaway: {
          title: 'Take Away',
          content: `The current version of PIKD lacks a cohesive design system, which affects usability, visual clarity, and development efficiency. A playful, unified, and component-driven design system is crucial to enhance both user experience and brand appeal — especially for a Gen Z audience who values clean visuals, intuitive interactions, and meaningful rewards. To solve this i`,
          items: [
            'Establish a design system foundation.',
            'Defined a Playful & Gen Z-Friendly Visual Language. Use vibrant but balanced colors and bold typography that reflects Gen Z energy.',
            'Add micro-interactions (e.g., hover effects, tap animations, "collect" animations) to create a delightful user experience.',
            'Incorporate fun, gamified elements like token progress bars, level badges, confetti, or visual collectibles.',
            'I enjoyed working with my incredible team because their feedback and suggestions were very insightful and constructive.',
            'and i think this contributed to the success of the overall final product.'
          ]
        },
        testimony: {
          title: 'Testimony',
          quote: `I had the pleasure of collaborating with Ojuola. She is incredibly fast at evaluating feedback from engineers and quickly solving problems. She has a keen eye for aesthetics, and her ability to create beautiful, colorful UI designs is simply outstanding. Her designs effectively capture the gaming feel and are a testament to her skill and creativity.`,
          author: 'Purevsuren Adiyasuren',
          role: 'Snr Eng at PIKD',
          avatar: '/images/projects/pikd/Ellipse 5.webp'
        }
      },
      pt: {
        overview: {
          title: 'Visão Geral',
          content: `Mais do que uma palavra da moda - o PIKD desbloqueia o poder dos colecionáveis digitais com a nossa plataforma alimentada por AR. Conecte-se com marcas, empresas e comunidades através de casos de uso do mundo real e envolva a Geração Z como nunca antes, explorando uma nova dimensão de aquisição de colecionáveis Token e recompensas. O jogador explora o mapa ao redor e encontra Tokens que são criados e partilhados pelo seu criador original, ou seja, Marcas. O jogador pode colecionar estes Tokens gratuitamente. A câmara AR vê estes NFTs nas proximidades de 5 metros ao redor numa cena de realidade aumentada.`,
          images: [
            { src: '/images/projects/pikd/pikd-overview-1.webp', alt: 'Tela de Boas-vindas PIKD' },
            { src: '/images/projects/pikd/pikd-overview-2.webp', alt: 'Perfil e Prémios PIKD' },
            { src: '/images/projects/pikd/pikd-overview-3.webp', alt: 'Feed e Descobrir PIKD' },
            { src: '/images/projects/pikd/pikd-overview-4.webp', alt: 'Detalhe do Produto PIKD' },
            { src: '/images/projects/pikd/pikd-overview-5.webp', alt: 'Tela PIKD 5' }
          ]
        },
        process: {
          title: 'O Processo',
          content: 'O nosso processo de design segue uma abordagem estruturada para garantir investigação abrangente e soluções centradas no utilizador.',
          timeline: [
            { step: 1, title: 'Kick-off/ Avaliação Heurística' },
            { step: 2, title: 'Descoberta e Investigação' },
            { step: 3, title: 'Ideação' },
            { step: 4, title: 'Design' },
            { step: 5, title: 'Entrega' },
            { step: 6, title: 'Conclusões' }
          ]
        },
        problem: {
          title: 'O Problema',
          content: `Os utilizadores da Geração Z são cada vez mais atraídos por experiências digitais interativas que oferecem novidade, valor social e utilidade no mundo real. No entanto, as plataformas de colecionáveis AR existentes frequentemente sofrem de interfaces desordenadas, falta de integração significativa de marcas e conjuntos de funcionalidades avassaladores que impedem o envolvimento do utilizador. O PIKD procura redesenhir a sua plataforma para oferecer uma experiência de utilizador mais lúdica, intuitiva e funcional—uma que permita aos utilizadores explorar, descobrir e colecionar NFTs Token facilmente através de um mapa alimentado por AR, enquanto se conectam perfeitamente com marcas de uma forma que melhora em vez de distrair do gameplay principal. O desafio está em equilibrar o envolvimento com a simplicidade, garantindo que a interface suporta tanto a exploração orgânica como as interações de marca sem alienar os utilizadores ou comprometer a usabilidade.`
        },
        kickoff: {
          title: 'Kick-off do Projeto',
          content: `Reuni as partes interessadas e abordei quaisquer questões ou esclarecimentos antes de mergulhar no processo de design. Forneceu uma plataforma para discussões abertas, permitindo que os membros da equipa procurassem clareza, partilhassem insights e alinhassem a sua compreensão do projeto. Esta abordagem ágil garantiu uma transição suave para o projeto e preparou o cenário para uma jornada de design focada e colaborativa. Também fizemos uma avaliação heurística do design antigo.`,
          heuristicEvaluation: {
            title: 'Avaliação Heurística',
            introduction: `Para obter uma compreensão abrangente da experiência do utilizador e identificar pontos de dor adicionais não descobertos no processo inicial de testes de usabilidade, realizámos uma avaliação heurística da aplicação atual. Ao avaliar a aplicação contra princípios de usabilidade estabelecidos, pretendíamos avaliar a sua adesão às melhores práticas e identificar áreas de melhoria. Esta avaliação permitiu-nos ver a aplicação da perspetiva dos utilizadores, descobrindo potenciais problemas de usabilidade e melhorando a nossa compreensão das suas necessidades e expectativas.`,
            images: [
              { src: '/images/projects/pikd/pikd-heuristic-1.webp', alt: 'Exemplo de Avaliação Heurística 1' },
              { src: '/images/projects/pikd/pikd-heuristic-2.webp', alt: 'Exemplo de Avaliação Heurística 2' },
              { src: '/images/projects/pikd/pikd-heuristic-3.webp', alt: 'Exemplo de Avaliação Heurística 3' }
            ],
            findings: [
              {
                category: 'Problemas de Texto',
                problem: 'A tipografia inconsistente em toda a aplicação está a causar ineficiências no fluxo de trabalho de design e no processo de desenvolvimento.',
                details: 'Falta de componentes de texto reutilizáveis. Estilização manual frequente (peso da fonte, tamanho, altura da linha). Leva a um tempo de desenvolvimento mais longo e hierarquia visual inconsistente.'
              },
              {
                category: 'Problemas de Cor',
                problem: 'Uso inconsistente de componentes de cor, levando a uma aparência desconexa e pouco profissional.',
                details: 'Alguns componentes usam cores predefinidas, enquanto outros não. A aplicação incorreta ou inconsistente das cores da marca complica a consistência visual e a acessibilidade.'
              },
              {
                category: 'Problemas de Espaçamento',
                problem: 'Espaçamento e preenchimento inconsistentes na interface afetam a harmonia visual e a usabilidade.',
                details: 'Os elementos aparecem muito apertados ou muito soltos. Impacta a legibilidade, os alvos de toque e a profissionalidade percebida da aplicação.'
              }
            ],
            conclusion: `As principais questões—inconsistência de tipografia, disciplina de cor deficiente e espaçamento irregular—estão a minar a consistência visual e a escalabilidade da aplicação. Abordar estas através de um sistema de design com componentes padronizados melhorará significativamente tanto a experiência do utilizador como a eficiência do desenvolvimento.`
          }
        },
        discovery: {
          title: 'Descoberta e Análise',
          analysisTables: [
            {
              title: 'Análise de Funcionalidades',
              icon: '📊',
              columns: ['Pokemon Go', 'Wizards Unite', 'Ingress', 'Jurassic World'],
              rows: [
                { feature: 'Integração AR', values: ['Alto', 'Muito Alto', 'Muito Alto', 'Moderado'] },
                { feature: 'Gameplay Principal', values: ['Capturar Pokémon', 'Lançar Feitiços', 'Capturar Portais', 'Colecionar Dinossauros'] },
                { feature: 'Funcionalidades Sociais', values: ['Troca, Raids', 'Presentes para Amigos, Raids', 'Operações de Facção', 'Alianças'] },
                { feature: 'Monetização', values: ['Compras na App', 'Compras na App', 'Compras na App', 'Compras na App'] },
                { feature: 'Envolvimento do Utilizador', values: ['Muito Alto', 'Alto', 'Moderado', 'Alto'] },
                { feature: 'Presença no Mercado', values: ['Muito Alto', 'Alto', 'Moderado', 'Alto'] },
                { feature: 'Acessibilidade', values: ['Alto', 'Alto', 'Moderado', 'Alto'] }
              ]
            },
            {
              title: 'Análise de UX e Funcionalidade',
              icon: '👥',
              columns: ['Pokemon Go', 'Wizards Unite', 'Ingress', 'Jurassic World'],
              rows: [
                { feature: 'Design Visual', values: [4, 5, 4, 5] },
                { feature: 'Navegação', values: [4, 4, 4, 3] },
                { feature: 'Integração', values: [4, 4, 3, 3] },
                { feature: 'Interatividade', values: [4, 5, 4, 3] },
                { feature: 'Acessibilidade', values: [4, 4, 3, 3] },
                { feature: 'Envolvimento do Utilizador', values: [5, 4, 3, 3] }
              ]
            },
            {
              title: 'Análise SWOT',
              icon: '📄',
              columns: ['Pokemon Go', 'Wizards Unite', 'Ingress', 'Jurassic World'],
              rows: [
                { 
                  feature: 'Pontos Fortes', 
                  values: [
                    'Forte associação de marca, Gameplay inovador, Envolvimento da comunidade, Atualizações regulares',
                    'Imagens AR de alta qualidade, Conteúdo rico, IP familiar, Elementos interativos',
                    'Conceito inovador, Envolvimento da comunidade, UI detalhada',
                    'Visuais envolventes, Gameplay intuitivo, Atualizações regulares'
                  ]
                },
                { 
                  feature: 'Fraquezas', 
                  values: [
                    'Usabilidade da funcionalidade AR, Problemas técnicos, Drena a bateria',
                    'Interface complexa, Problemas de desempenho, Curva de aprendizagem',
                    'Complexidade, Problemas de desempenho, Acessibilidade',
                    'Táticas de monetização, Problemas de desempenho, Complexidade das mecânicas'
                  ]
                },
                { 
                  feature: 'Oportunidades', 
                  values: [
                    'Avanços tecnológicos, Mercado em expansão, Parcerias, E-sports',
                    'Integração melhorada, Avanços tecnológicos, Promoções cruzadas',
                    'Simplificação da UI, Tutoriais melhorados, Integração multiplataforma',
                    'Expansão de funcionalidades, Envolvimento da comunidade, Integração multiplataforma'
                  ]
                },
                { 
                  feature: 'Riscos', 
                  values: [
                    'Concorrência de mercado, Retenção de jogadores, Preocupações com privacidade, Limitações técnicas',
                    'Concorrência, Retenção de jogadores, Preocupações com privacidade, Limitações técnicas',
                    'Mercado competitivo, Limitações técnicas, Retenção de utilizadores',
                    'Concorrência de mercado, Retenção de jogadores, Desafios técnicos'
                  ]
                }
              ]
            }
          ]
        },
        'user-story': {
          title: 'História do Utilizador',
          persona: {
            title: 'Persona do Jogador',
            content: `A Julia esteve a recolher tokens pelo mapa durante todo o dia e atingiu o seu limite diário de coleta de tokens. Uma notificação aparece no seu ecrã, informando-a de que há uma Power House nas proximidades onde pode recarregar e continuar a recolher tokens. A Julia dirige-se à Power House, que é uma representação virtual de uma popular loja de café. Ao entrar, o seu limite de coleta de tokens é atualizado e também recebe um multiplicador de pontos de 1,5x para as próximas 48 horas. Energizada, a Julia explora o mapa novamente, desta vez com o impulso adicional, aumentando as suas recompensas. Ela planeia visitar mais Power Houses no futuro para maximizar o seu gameplay.`
          },
          useCase: {
            title: 'Caso de Uso do Jogador',
            steps: [
              { step: 1, title: 'Limite Diário de Coleta de Tokens Atingido', description: 'A Julia atinge o seu limite diário de tokens após uma sessão de gameplay prolongada.' },
              { step: 2, title: 'Notificação da Power House', description: 'Uma notificação a leva a visitar uma Power House nas proximidades para recarregar e continuar a recolher tokens.' },
              { step: 3, title: 'Viajar para a Power House', description: 'A Julia navega para a localização da Power House, que pode ser um local virtual ou real patrocinado por marca (por exemplo, uma loja de café, loja de retalho).' },
              { step: 4, title: 'Recarga e Buffs', description: 'Chegando ao local, o limite de coleta de tokens da Julia é reposto, permitindo-lhe continuar a recolher tokens. Ela também recebe um buff temporário (por exemplo, multiplicador de pontos de 1,5x por 2 horas).' },
              { step: 5, title: 'Gameplay Estendido', description: 'Com o seu limite de tokens atualizado e multiplicador de bónus, a Julia retoma a recolha de tokens com maior eficiência, estendendo a sua sessão de gameplay.' },
              { step: 6, title: 'Regressar à Power House', description: 'A Julia planifica o seu gameplay em torno de revisitar Power Houses para recarregar estrategicamente e maximizar os seus buffs.' }
            ]
          },
          brandPersona: {
            title: 'Persona da Marca',
            content: `Parceria: A Adidas faz parceria com o Pikd para lançar uma "Power House" com marca. A Power House da Adidas permite aos utilizadores recarregar os seus limites de tokens e obter recompensas exclusivas na app visitando a loja, fisicamente ou virtualmente. Durante eventos promocionais especiais, os jogadores que visitam a Power House da Adidas não só repõem os seus limites de tokens, mas também recebem um voucher na app com 10% de desconto em produtos Adidas. Esta iniciativa leva a uma afluência de utilizadores da app a visitar locais da Adidas, um aumento nas vendas à medida que os utilizadores resgatam vouchers, e um crescimento na visibilidade da marca Adidas. Os parceiros planeiam estender a parceria para promoções futuras.`
          },
          commercialUseCase: {
            title: 'Caso de Uso Comercial',
            steps: [
              { step: 1, title: 'Configuração de Parceria de Marca', description: 'A Adidas colabora com a app para estabelecer uma Power House com marca. Esta Power House é descrita como um local virtual ou do mundo real onde os utilizadores podem recarregar e receber "buffs" (provavelmente bónus ou vantagens na app).' },
              { step: 2, title: 'Promoção e Marketing', description: 'A campanha é promovida dentro da app através de notificações, banners e conteúdo no feed. As promoções informam os utilizadores de que podem visitar a Power House da Adidas para repor o seu limite de tokens e receber bónus exclusivos.' },
              { step: 3, title: 'Visita e Envolvimento na Power House', description: 'Os utilizadores visitam a Power House da Adidas para repor o seu limite diário de tokens. Além disso, recebem um voucher digital de 10% de desconto em produtos Adidas, que pode ser resgatado online ou na loja.' },
              { step: 4, title: 'Impacto no Tráfego e Vendas', description: 'Os utilizadores são motivados a visitar locais da Adidas (tanto virtuais como físicos) para aproveitar os bónus de recarga e promoções especiais. À medida que os utilizadores resgatam os seus vouchers, a Adidas experimenta um aumento nas vendas e na interação com a marca.' },
              { step: 5, title: 'Dados e Análise Pós-Campanha', description: 'A Adidas recolhe dados sobre visitas de utilizadores, resgates de vouchers e aumentos no tráfego da loja. Estas informações são usadas para informar futuras estratégias de marketing e parcerias, otimizando futuros eventos da Power House.' }
            ]
          }
        },
        'design-system': {
          title: 'Sistema de Design',
          content: `Como designer principal, assumi a responsabilidade de estabelecer um sistema de design coeso e visualmente atraente para o PIKD. Isto envolveu a criação de um guia de estilo abrangente que delineava paletas de cores, tipografia, iconografia e outros elementos visuais. Ao definir padrões de design consistentes e diretrizes, garanti que todos os aspetos da plataforma mantivessem um visual unificado e polido. Este sistema de design serviu como um recurso valioso para toda a equipa, promovendo a colaboração e mantendo a coerência visual ao longo do processo de desenvolvimento.`,
          image: '/images/projects/pikd/pikd-design-system.webp',
          colorPalette: {
            primary: [
              { name: 'Primary 1', hex: '#9FFF00' },
              { name: 'Primary 2', hex: '#C2F987' },
              { name: 'Primary 3', hex: '#DFFCDA' }
            ],
            linear: [
              { name: 'Linear 1', hex: '#97FF48', hex2: '#C2F987' },
              { name: 'Linear 2', hex: '#97FF48', hex2: '#C2F987' }
            ],
            tetradic: [
              { name: 'Tetradic 1', hex: '#97FF48' },
              { name: 'Tetradic 2', hex: '#97FF48' },
              { name: 'Tetradic 3', hex: '#97FF48' }
            ],
            status: [
              { name: 'Success', hex: '#A0C958' },
              { name: 'Error', hex: '#FB6382' },
              { name: 'Orange', hex: '#AFFBE2' }
            ],
            black: [
              { name: 'black-500', hex: '#18181A' },
              { name: 'black-400', hex: '#45454A' },
              { name: 'black-200', hex: '#A0A0A7' },
              { name: 'black-50', hex: '#E7E7E9' }
            ],
            white: [
              { name: 'White 1', hex: '#E6E6E6' },
              { name: 'White 2', hex: '#E2E2E2' },
              { name: 'White 3', hex: '#F4F4F4' }
            ],
            background: [
              { name: 'Background 1', hex: '#1E3A5F' },
              { name: 'Background 2', hex: '#6B7A8F' },
              { name: 'Background 3', hex: '#E8EBF0' }
            ]
          },
          image2: '/images/projects/pikd/pikd-design-system-2.webp'
        },
        takeaway: {
          title: 'Conclusões',
          content: `A versão atual do PIKD carece de um sistema de design coeso, o que afeta a usabilidade, a clareza visual e a eficiência do desenvolvimento. Um sistema de design lúdico, unificado e orientado por componentes é crucial para melhorar tanto a experiência do utilizador como o apelo da marca — especialmente para um público da Geração Z que valoriza visuais limpos, interações intuitivas e recompensas significativas. Para resolver isto`,
          items: [
            'Estabelecer uma base de sistema de design.',
            'Definir uma Linguagem Visual Lúdica e Adequada à Geração Z. Usar cores vibrantes mas equilibradas e tipografia ousada que reflita a energia da Geração Z.',
            'Adicionar micro-interações (por exemplo, efeitos de hover, animações de toque, animações de "coleção") para criar uma experiência do utilizador deliciosa.',
            'Incorporar elementos lúdicos e gamificados como barras de progresso de tokens, badges de nível, confetes ou colecionáveis visuais.',
            'Gostei de trabalhar com a minha equipa incrível porque o seu feedback e sugestões foram muito perspicazes e construtivos.',
            'e acho que isto contribuiu para o sucesso do produto final geral.'
          ]
        },
        testimony: {
          title: 'Depoimento',
          quote: `Tive o prazer de colaborar com a Ojuola. Ela é incrivelmente rápida a avaliar feedback de engenheiros e a resolver problemas rapidamente. Tem um olho aguçado para estética, e a sua capacidade de criar designs de UI bonitos e coloridos é simplesmente excecional. Os seus designs capturam eficazmente a sensação de jogo e são um testemunho da sua habilidade e criatividade.`,
          author: 'Purevsuren Adiyasuren',
          role: 'Eng Sênior no PIKD',
          avatar: '/images/projects/pikd/Ellipse 5.webp'
        }
      }
    }
  },
  'hardsands-crm': {
    title: 'Hardsands CRM',
    headerImage: '/images/projects/hardsands-crm/hardsands-header.webp',
    avatarImage: '/images/projects/hardsands-crm/hardsands-avatar.webp',
    sections: {
      en: [
        { id: 'overview', title: 'Overview' },
        { id: 'process', title: 'The Process' },
        { id: 'discovery', title: 'Discovery and research' },
        { id: 'takeaway', title: 'Take Away' },
        { id: 'testimony', title: 'Testimony' }
      ],
      pt: [
        { id: 'overview', title: 'Visão Geral' },
        { id: 'process', title: 'O Processo' },
        { id: 'discovery', title: 'Descoberta e pesquisa' },
        { id: 'takeaway', title: 'Conclusões' },
        { id: 'testimony', title: 'Depoimento' }
      ]
    },
    content: {
      en: {
        overview: {
          content: 'Empowering Business Relationships: This versatile CRM platform caters to the needs of both small and large-scale businesses. Seamlessly manage interactions, track leads, and nurture customer relationships through a user-friendly interface. From startups to enterprises, This CRM provides tailored solutions to enhance communication, streamline processes, and drive growth. Experience efficient collaboration, data-driven insights, and customer-centricity like never before. I was tasked with executing on the above opportunity. To deliver a unique experience that would provide the average business effective access to this kind of service in the most convenient way possible. The final deliverable was a suite of 3 products. Hardsands Pro Web app, iOS App and Android app',
          projectInfo: {
            team: 'UX/UI designer and Researcher.\n3 developers\n1 Product manager\n1 Designer',
            tools: ['Figma/Figjam', 'Google forms', 'Slack', 'Google sheet', 'Google meet'],
            duration: '13 weeks sprint'
          },
          images: [
            '/images/projects/hardsands-crm/Contact Profile.webp',
            '/images/projects/hardsands-crm/Create Invoice.webp',
            '/images/projects/hardsands-crm/Task Analytics.webp',
            '/images/projects/hardsands-crm/Leads Analytics.webp',
            '/images/projects/hardsands-crm/Analytics.webp',
            '/images/projects/hardsands-crm/Messages.webp',
            '/images/projects/hardsands-crm/Teammate profile.webp',
            '/images/projects/hardsands-crm/Task.webp',
            '/images/projects/hardsands-crm/Mail.webp'
          ]
        },
        process: {
          title: 'The Process',
          timeline: [
            { step: 1, title: 'Kick-off/Heuristic evaluation' },
            { step: 2, title: 'Discovery and Research' },
            { step: 3, title: 'Ideation' },
            { step: 4, title: 'Design' },
            { step: 5, title: 'Hand off' },
            { step: 6, title: 'Take away' }
          ]
        },
        discovery: {
          title: 'Discovery and research',
          content: 'I spearheaded a comprehensive mixed research (Quantitative and qualitative research) to gain insights into the users painpoints, identifying where the app succeeds and areas of opportunity.',
          images: [
            { src: '/images/projects/hardsands-crm/hardsands-discovery.webp', alt: 'Hardsands Discovery and Research' }
          ]
        },
        takeaway: {
          title: 'Take Away',
          content: `The current version of PIKD lacks a cohesive design system, which affects usability, visual clarity, and development efficiency. A playful, unified, and component-driven design system is crucial to enhance both user experience and brand appeal — especially for a Gen Z audience who values clean visuals, intuitive interactions, and meaningful rewards. To solve this i`,
          items: [
            'Establish a design system foundation.',
            'Defined a Playful & Gen Z-Friendly Visual Language. Use vibrant but balanced colors and bold typography that reflects Gen Z energy.',
            'Add micro-interactions (e.g., hover effects, tap animations, "collect" animations) to create a delightful user experience.',
            'Incorporate fun, gamified elements like token progress bars, level badges, confetti, or visual collectibles.',
            'I enjoyed working with my incredible team because their feedback and suggestions were very insightful and constructive.',
            'and i think this contributed to the success of the overall final product.'
          ]
        },
        testimony: {
          title: 'Testimony',
          quote: `Ojuola was able to translate our product requirements into well crafted UI designs. Her attention to detail, ability to capture edge cases and their disciplined attitude towards work made working with her a blissful experience. I highly recommend her!`,
          author: 'Okeke Felix',
          role: 'Co founder',
          avatar: '/images/projects/hardsands-crm/felix-okeke.webp'
        }
      },
      pt: {
        overview: {
          content: 'Potenciar Relações Empresariais: Esta plataforma CRM versátil atende às necessidades de empresas de pequena e grande escala. Gerencie interações, rastreie leads e nutra relacionamentos com clientes através de uma interface intuitiva. De startups a empresas, este CRM oferece soluções personalizadas para melhorar a comunicação, simplificar processos e impulsionar o crescimento. Experimente colaboração eficiente, insights baseados em dados e foco no cliente como nunca antes. Fui encarregado de executar a oportunidade acima. Entregar uma experiência única que proporcionaria às empresas acesso efetivo a este tipo de serviço da forma mais conveniente possível. O resultado final foi um conjunto de 3 produtos. Hardsands Pro Web app, App iOS e App Android',
          projectInfo: {
            team: 'UX/UI designer e Investigador.\n3 programadores\n1 Gestor de produto\n1 Designer',
            tools: ['Figma/Figjam', 'Google forms', 'Slack', 'Google sheet', 'Google meet'],
            duration: 'Sprint de 13 semanas'
          },
          images: [
            '/images/projects/hardsands-crm/Contact Profile.webp',
            '/images/projects/hardsands-crm/Create Invoice.webp',
            '/images/projects/hardsands-crm/Task Analytics.webp',
            '/images/projects/hardsands-crm/Leads Analytics.webp',
            '/images/projects/hardsands-crm/Analytics.webp',
            '/images/projects/hardsands-crm/Messages.webp',
            '/images/projects/hardsands-crm/Teammate profile.webp',
            '/images/projects/hardsands-crm/Task.webp',
            '/images/projects/hardsands-crm/Mail.webp'
          ]
        },
        process: {
          title: 'O Processo',
          timeline: [
            { step: 1, title: 'Kick-off/Avaliação Heurística' },
            { step: 2, title: 'Descoberta e Pesquisa' },
            { step: 3, title: 'Ideação' },
            { step: 4, title: 'Design' },
            { step: 5, title: 'Entrega' },
            { step: 6, title: 'Conclusões' }
          ]
        },
        discovery: {
          title: 'Descoberta e pesquisa',
          content: 'Liderei uma pesquisa mista abrangente (pesquisa quantitativa e qualitativa) para obter insights sobre os pontos problemáticos dos utilizadores, identificando onde a aplicação tem sucesso e áreas de oportunidade.',
          images: [
            { src: '/images/projects/hardsands-crm/hardsands-discovery.webp', alt: 'Descoberta e Pesquisa Hardsands' }
          ]
        },
        takeaway: {
          title: 'Conclusões',
          content: `A versão atual do PIKD carece de um sistema de design coeso, o que afeta a usabilidade, a clareza visual e a eficiência de desenvolvimento. Um sistema de design lúdico, unificado e orientado por componentes é crucial para melhorar tanto a experiência do utilizador quanto o apelo da marca — especialmente para um público da Geração Z que valoriza visuais limpos, interações intuitivas e recompensas significativas. Para resolver isto`,
          items: [
            'Estabelecer uma base de sistema de design.',
            'Definir uma Linguagem Visual Lúdica e Amigável à Geração Z. Usar cores vibrantes mas equilibradas e tipografia ousada que reflita a energia da Geração Z.',
            'Adicionar micro-interações (por exemplo, efeitos de hover, animações de toque, animações de "colecionar") para criar uma experiência de utilizador deliciosa.',
            'Incorporar elementos divertidos e gamificados como barras de progresso de tokens, badges de nível, confetes ou colecionáveis visuais.',
            'Gostei de trabalhar com a minha equipa incrível porque o seu feedback e sugestões foram muito perspicazes e construtivos.',
            'e acho que isto contribuiu para o sucesso do produto final geral.'
          ]
        },
        testimony: {
          title: 'Depoimento',
          quote: `A Ojuola conseguiu traduzir os nossos requisitos de produto em designs de UI bem elaborados. A sua atenção ao detalhe, capacidade de capturar casos extremos e a sua atitude disciplinada em relação ao trabalho tornaram trabalhar com ela uma experiência abençoada. Recomendo-a vivamente!`,
          author: 'Okeke Felix',
          role: 'Co-fundador',
          avatar: '/images/projects/hardsands-crm/felix-okeke.webp'
        }
      }
    }
  },
  'x-optimization': {
    title: 'X App Optimization',
    headerImage: '/images/projects/x-optimization/x-header.webp',
    avatarImage: '/images/projects/x-optimization/x-avatar.webp',
    sections: {
      en: [
        { id: 'overview', title: 'Overview' },
        { id: 'objective', title: 'Objective' },
        { id: 'process', title: 'The Process' },
        { id: 'discovery-research', title: 'Discovery and Research' }
      ],
      pt: [
        { id: 'overview', title: 'Visão Geral' },
        { id: 'objective', title: 'Objetivo' },
        { id: 'process', title: 'O Processo' },
        { id: 'discovery-research', title: 'Descoberta e Pesquisa' }
      ]
    },
    content: {
      en: {
        overview: {
          title: 'Overview',
          content: `Twitter app is a social media platform that allows users to share and discover short messages called tweets. These tweets may include links, pictures, videos, text, and other types of material. Individuals have the ability to follow one another, and the tweets of individuals they follow show up in their timeline, generating a continuous feed of updates.`
        },
        objective: {
          title: 'Objective',
          content: `Using Twitter as a case study, the goal of improving user experience through app optimization is to find and fix current flaws and inefficiencies inside the Twitter network. Enhancing user happiness, engagement, and general usability is the main goal. The goal is to provide focused solutions that enhance Twitter's user interface, navigation, and feature functionality via a thorough examination of performance concerns, usability difficulties, and functional faults. This approach entails not just fixing current issues but also introducing cutting-edge features and AI-powered improvements to improve the Twitter app's overall user experience. The goal is to make Twitter's broad user base's experience more consistent, effective, and pleasurable by incorporating new features and addressing user issues.`,
          image: '/images/projects/x-optimization/x-objective.webp',
          projectInfo: {
            tools: ['Figma/Figjam', 'Spline 3D', 'Google meet', 'Google workspace'],
            duration: 'Ongoing'
          }
        },
        process: {
          title: 'The Process',
          timeline: [
            { step: 1, title: 'Research' },
            { step: 2, title: 'Discover' },
            { step: 3, title: 'Ideate' },
            { step: 4, title: 'Design' }
          ]
        },
        'discovery-research': {
          title: 'Discovery and Research',
          content: `I spearheaded a comprehensive mixed research (Quantitative and qualitative research) to gain insights into the users painpoints, identifying where the app succeeds and areas of opportunity.

These methodologies provide insights into user behaviors, preferences, and pain points. Here are some UX research methodologies used:`,
          items: [
            'User Interviews: I conducted one-on-one interviews with users to gather qualitative insights into their experiences, preferences, and expectations.',
            'Social Media Listening: Monitored social media platforms for user feedback, sentiments, and discussions related to the app.',
            'Surveys and Questionnaires: I collected quantitative data on a large scale. This method is helpful in identifying patterns, and prioritizing optimization efforts.',
            'Competitor Analysis: Analyzed the user experiences of competitors\' apps for best practices, industry standards, and areas where the app can stand out or improve.'
          ],
          researchQuestions: {
            title: 'Research questions',
            categories: [
              {
                category: 'General Experience',
                questions: [
                  'How often do you use the Twitter app?',
                  'What are the main reasons for using Twitter?',
                  'How satisfied are you with the overall user experience of the Twitter app?'
                ]
              },
              {
                category: 'Usability and Navigation',
                questions: [
                  'How easy is it for you to navigate through different sections of the Twitter app?',
                  'Are you able to find the features you need easily within the app?',
                  'Do you encounter any difficulties when performing common tasks, such as composing tweets, retweeting, or searching for content?'
                ]
              },
              {
                category: 'Performance and Speed',
                questions: [
                  'How would you rate the performance and speed of the Twitter app (e.g., loading times, responsiveness)?',
                  'Have you experienced any issues with app crashes, freezes, or slow loading times?'
                ]
              },
              {
                category: 'Feature Satisfaction',
                questions: [
                  'Which features of the Twitter app do you find most useful and engaging?',
                  'Are there any features you wish were available or improved within the app?',
                  'How satisfied are you with the quality and functionality of media attachments (images, videos, GIFs) in tweets?'
                ]
              },
              {
                category: 'Notifications and Alerts',
                questions: [
                  'How do you feel about the frequency and relevance of notifications you receive from the Twitter app?',
                  'Do you find notifications helpful in keeping you updated with relevant content and activities on Twitter?'
                ]
              },
              {
                category: 'Privacy and Security',
                questions: [
                  'How confident are you in the privacy and security measures implemented by Twitter to protect your personal information and data?',
                  'Are there any privacy concerns or features you would like to see enhanced for better security?'
                ]
              },
              {
                category: 'Demographic Information',
                questions: [
                  'What is your age range?',
                  'What is your level of education?',
                  'What is your occupation?'
                ]
              }
            ]
          },
          researchFindings: {
            ageRange: {
              title: 'Age Range',
              segments: [
                { label: '18-25', value: 45, color: '#EF4444' },
                { label: '26-35', value: 35, color: '#F97316' },
                { label: '36 and above', value: 20, color: '#3B82F6' }
              ]
            },
            literacy: {
              title: 'Literacy',
              segments: [
                { label: 'Above average', value: 50, color: '#EF4444' },
                { label: 'Mid', value: 35, color: '#F97316' },
                { label: 'Below average', value: 15, color: '#3B82F6' }
              ]
            },
            metrics: [
              { label: 'General Experience', value: 70 },
              { label: 'Usability and Navigation', value: 65 }
            ],
            priorityFeatures: {
              title: 'List of features based on priority',
              features: [
                { name: 'Bookmark Collection', priority: 100 },
                { name: 'Integrated Polls', priority: 85 },
                { name: 'Media Collection', priority: 75 },
                { name: 'Edit Private Message', priority: 65 },
                { name: 'Real-time Language Translation', priority: 50 },
                { name: 'Predictive Hashtags', priority: 40 },
                { name: 'Image and Video Descriptions', priority: 30 },
                { name: 'Automated Sentiment Analysis', priority: 20 }
              ]
            },
            keyFeatures: {
              title: 'Key feature focus',
              features: [
                {
                  name: 'Bookmark Collection',
                  description: 'Allow users to create collections of bookmarked tweets for better organization and reference.'
                },
                {
                  name: 'Integrated Polls',
                  description: 'Expand the polling feature to allow users to create and participate in polls directly within tweets and spaces.'
                },
                {
                  name: 'Media Collection',
                  description: 'Allow users to create collections of bookmarked tweets for better organization and reference.'
                },
                {
                  name: 'Edit Private Message',
                  description: 'Introduce the ability to edit messages within a short timeframe after sending to correct errors or update information.'
                },
                {
                  name: 'Translate tweets',
                  description: 'Translate posts in real time'
                }
              ]
            },
            featureDetails: {
              title: 'Features Detail',
              features: [
                {
                  name: 'Bookmark Collection',
                  description: 'Allow users to create collections of bookmarked tweets for better organization and reference.',
                  image: '/images/projects/x-optimization/x-bookmark.webp'
                },
                {
                  name: 'Integrated polls',
                  description: 'Expand the polling feature to allow users to create and participate in polls directly within tweets and spaces.',
                  image: '/images/projects/x-optimization/x-polls.webp'
                },
                {
                  name: 'Media Collection',
                  description: 'Allow users to create collections of bookmarked tweets for better organization and reference.',
                  image: '/images/projects/x-optimization/x-media.webp'
                },
                {
                  name: 'Edit Private Message',
                  description: 'Introduce the ability to edit messages within a short timeframe after sending to correct errors or update information.',
                  image: '/images/projects/x-optimization/x-private-message.webp'
                },
                {
                  name: 'Translate tweets',
                  description: 'Translate posts in real time',
                  image: '/images/projects/x-optimization/x-translate.webp'
                }
              ]
            }
          }
        }
      },
      pt: {
        overview: {
          title: 'Visão Geral',
          content: `O aplicativo Twitter é uma plataforma de redes sociais que permite aos utilizadores partilhar e descobrir mensagens curtas chamadas tweets. Estes tweets podem incluir links, imagens, vídeos, texto e outros tipos de material. Os indivíduos têm a capacidade de seguir uns aos outros, e os tweets dos indivíduos que seguem aparecem na sua linha do tempo, gerando um feed contínuo de atualizações.`
        },
        objective: {
          title: 'Objetivo',
          content: `Usando o Twitter como estudo de caso, o objetivo de melhorar a experiência do utilizador através da otimização da aplicação é encontrar e corrigir falhas e ineficiências atuais dentro da rede Twitter. Melhorar a felicidade, o envolvimento e a usabilidade geral do utilizador é o objetivo principal. O objetivo é fornecer soluções focadas que melhorem a interface do utilizador, a navegação e a funcionalidade das funcionalidades do Twitter através de um exame minucioso das preocupações de desempenho, dificuldades de usabilidade e falhas funcionais. Esta abordagem implica não apenas corrigir problemas atuais, mas também introduzir funcionalidades inovadoras e melhorias alimentadas por IA para melhorar a experiência geral do utilizador da aplicação Twitter. O objetivo é tornar a experiência da ampla base de utilizadores do Twitter mais consistente, eficaz e agradável, incorporando novas funcionalidades e abordando questões dos utilizadores.`,
          image: '/images/projects/x-optimization/x-objective.webp',
          projectInfo: {
            tools: ['Figma/Figjam', 'Spline 3D', 'Google meet', 'Google workspace'],
            duration: 'Em curso'
          }
        },
        process: {
          title: 'O Processo',
          timeline: [
            { step: 1, title: 'Pesquisa' },
            { step: 2, title: 'Descoberta' },
            { step: 3, title: 'Ideação' },
            { step: 4, title: 'Design' }
          ]
        },
        'discovery-research': {
          title: 'Descoberta e Pesquisa',
          content: `Liderei uma investigação mista abrangente (investigação quantitativa e qualitativa) para obter insights sobre os pontos problemáticos dos utilizadores, identificando onde a aplicação tem sucesso e áreas de oportunidade.

Estas metodologias fornecem insights sobre comportamentos, preferências e pontos problemáticos dos utilizadores. Aqui estão algumas metodologias de investigação UX utilizadas:`,
          items: [
            'Entrevistas com Utilizadores: Realizei entrevistas individuais com utilizadores para recolher insights qualitativos sobre as suas experiências, preferências e expectativas.',
            'Escuta de Redes Sociais: Monitorizei plataformas de redes sociais para feedback dos utilizadores, sentimentos e discussões relacionadas com a aplicação.',
            'Inquéritos e Questionários: Recolhi dados quantitativos em grande escala. Este método é útil para identificar padrões e priorizar esforços de otimização.',
            'Análise de Concorrentes: Analisei as experiências dos utilizadores das aplicações dos concorrentes para melhores práticas, padrões da indústria e áreas onde a aplicação pode destacar-se ou melhorar.'
          ],
          researchQuestions: {
            title: 'Questões de investigação',
            categories: [
              {
                category: 'Experiência Geral',
                questions: [
                  'Com que frequência utiliza a aplicação Twitter?',
                  'Quais são as principais razões para utilizar o Twitter?',
                  'Quão satisfeito está com a experiência geral do utilizador da aplicação Twitter?'
                ]
              },
              {
                category: 'Usabilidade e Navegação',
                questions: [
                  'Quão fácil é navegar pelas diferentes secções da aplicação Twitter?',
                  'Consegue encontrar facilmente as funcionalidades de que precisa na aplicação?',
                  'Encontra alguma dificuldade ao realizar tarefas comuns, como compor tweets, retweetar ou procurar conteúdo?'
                ]
              },
              {
                category: 'Desempenho e Velocidade',
                questions: [
                  'Como classificaria o desempenho e a velocidade da aplicação Twitter (por exemplo, tempos de carregamento, responsividade)?',
                  'Já teve problemas com falhas da aplicação, bloqueios ou tempos de carregamento lentos?'
                ]
              },
              {
                category: 'Satisfação com Funcionalidades',
                questions: [
                  'Quais funcionalidades da aplicação Twitter considera mais úteis e envolventes?',
                  'Há alguma funcionalidade que gostaria que estivesse disponível ou melhorada na aplicação?',
                  'Quão satisfeito está com a qualidade e funcionalidade dos anexos de media (imagens, vídeos, GIFs) nos tweets?'
                ]
              },
              {
                category: 'Notificações e Alertas',
                questions: [
                  'Como se sente em relação à frequência e relevância das notificações que recebe da aplicação Twitter?',
                  'Considera as notificações úteis para se manter atualizado com conteúdo e atividades relevantes no Twitter?'
                ]
              },
              {
                category: 'Privacidade e Segurança',
                questions: [
                  'Quão confiante está nas medidas de privacidade e segurança implementadas pelo Twitter para proteger as suas informações pessoais e dados?',
                  'Há alguma preocupação de privacidade ou funcionalidade que gostaria de ver melhorada para maior segurança?'
                ]
              },
              {
                category: 'Informação Demográfica',
                questions: [
                  'Qual é a sua faixa etária?',
                  'Qual é o seu nível de educação?',
                  'Qual é a sua ocupação?'
                ]
              }
            ]
          },
          researchFindings: {
            ageRange: {
              title: 'Faixa Etária',
              segments: [
                { label: '18-25', value: 45, color: '#EF4444' },
                { label: '26-35', value: 35, color: '#F97316' },
                { label: '36 e acima', value: 20, color: '#3B82F6' }
              ]
            },
            literacy: {
              title: 'Literacia',
              segments: [
                { label: 'Acima da média', value: 50, color: '#EF4444' },
                { label: 'Média', value: 35, color: '#F97316' },
                { label: 'Abaixo da média', value: 15, color: '#3B82F6' }
              ]
            },
            metrics: [
              { label: 'Experiência Geral', value: 70 },
              { label: 'Usabilidade e Navegação', value: 65 }
            ],
            priorityFeatures: {
              title: 'Lista de funcionalidades baseada em prioridade',
              features: [
                { name: 'Coleção de Marcadores', priority: 100 },
                { name: 'Votações Integradas', priority: 85 },
                { name: 'Coleção de Media', priority: 75 },
                { name: 'Editar Mensagem Privada', priority: 65 },
                { name: 'Tradução de Idioma em Tempo Real', priority: 50 },
                { name: 'Hashtags Preditivas', priority: 40 },
                { name: 'Descrições de Imagem e Vídeo', priority: 30 },
                { name: 'Análise de Sentimento Automatizada', priority: 20 }
              ]
            },
            keyFeatures: {
              title: 'Foco em funcionalidades principais',
              features: [
                {
                  name: 'Coleção de Marcadores',
                  description: 'Permitir que os utilizadores criem coleções de tweets marcados para melhor organização e referência.'
                },
                {
                  name: 'Votações Integradas',
                  description: 'Expandir a funcionalidade de votações para permitir que os utilizadores criem e participem em votações diretamente dentro de tweets e espaços.'
                },
                {
                  name: 'Coleção de Media',
                  description: 'Permitir que os utilizadores criem coleções de tweets marcados para melhor organização e referência.'
                },
                {
                  name: 'Editar Mensagem Privada',
                  description: 'Introduzir a capacidade de editar mensagens dentro de um curto período de tempo após o envio para corrigir erros ou atualizar informações.'
                },
                {
                  name: 'Traduzir tweets',
                  description: 'Traduzir publicações em tempo real'
                }
              ]
            },
            featureDetails: {
              title: 'Detalhes das Funcionalidades',
              features: [
                {
                  name: 'Coleção de Marcadores',
                  description: 'Permitir que os utilizadores criem coleções de tweets marcados para melhor organização e referência.',
                  image: '/images/projects/x-optimization/x-bookmark.webp'
                },
                {
                  name: 'Votações Integradas',
                  description: 'Expandir a funcionalidade de votações para permitir que os utilizadores criem e participem em votações diretamente dentro de tweets e espaços.',
                  image: '/images/projects/x-optimization/x-polls.webp'
                },
                {
                  name: 'Coleção de Media',
                  description: 'Permitir que os utilizadores criem coleções de tweets marcados para melhor organização e referência.',
                  image: '/images/projects/x-optimization/x-media.webp'
                },
                {
                  name: 'Editar Mensagem Privada',
                  description: 'Introduzir a capacidade de editar mensagens dentro de um curto período de tempo após o envio para corrigir erros ou atualizar informações.',
                  image: '/images/projects/x-optimization/x-private-message.webp'
                },
                {
                  name: 'Traduzir tweets',
                  description: 'Traduzir publicações em tempo real',
                  image: '/images/projects/x-optimization/x-translate.webp'
                }
              ]
            }
          }
        }
      }
    }
  },
  'interior-design': {
    title: 'Interior Design Portfolio',
    headerImage: '/images/laptop.webp',
    avatarImage: '/images/projects/interior-design/interior-design.webp',
    sections: {
      en: [
        { id: 'overview', title: 'Overview' },
        { id: 'process', title: 'The Process' },
        { id: 'research', title: 'User Research' },
        { id: 'design', title: 'Design System' },
        { id: 'prototype', title: 'Prototype' },
        { id: 'testing', title: 'User Testing' },
        { id: 'results', title: 'Results' }
      ],
      pt: [
        { id: 'overview', title: 'Visão Geral' },
        { id: 'process', title: 'O Processo' },
        { id: 'research', title: 'Pesquisa de Utilizadores' },
        { id: 'design', title: 'Sistema de Design' },
        { id: 'prototype', title: 'Protótipo' },
        { id: 'testing', title: 'Testes de Utilizadores' },
        { id: 'results', title: 'Resultados' }
      ]
    }
  },
  'portfolio-website': {
    title: 'Portfolio Website',
    headerImage: '/images/laptop.webp',
    avatarImage: '/images/projects/portfolio-website/portfolio-website.webp',
    sections: {
      en: [
        { id: 'overview', title: 'Overview' },
        { id: 'process', title: 'The Process' },
        { id: 'research', title: 'User Research' },
        { id: 'design', title: 'Design System' },
        { id: 'prototype', title: 'Prototype' },
        { id: 'testing', title: 'User Testing' },
        { id: 'results', title: 'Results' }
      ],
      pt: [
        { id: 'overview', title: 'Visão Geral' },
        { id: 'process', title: 'O Processo' },
        { id: 'research', title: 'Pesquisa de Utilizadores' },
        { id: 'design', title: 'Sistema de Design' },
        { id: 'prototype', title: 'Protótipo' },
        { id: 'testing', title: 'Testes de Utilizadores' },
        { id: 'results', title: 'Resultados' }
      ]
    }
  },
  'becomy': {
    title: 'Becomy',
    headerImage: '/images/laptop.webp',
    avatarImage: '/images/projects/becomy/becomy.webp',
    sections: {
      en: [
        { id: 'overview', title: 'Overview' },
        { id: 'process', title: 'The Process' },
        { id: 'research', title: 'User Research' },
        { id: 'design', title: 'Design System' },
        { id: 'prototype', title: 'Prototype' },
        { id: 'testing', title: 'User Testing' },
        { id: 'results', title: 'Results' }
      ],
      pt: [
        { id: 'overview', title: 'Visão Geral' },
        { id: 'process', title: 'O Processo' },
        { id: 'research', title: 'Pesquisa de Utilizadores' },
        { id: 'design', title: 'Sistema de Design' },
        { id: 'prototype', title: 'Protótipo' },
        { id: 'testing', title: 'Testes de Utilizadores' },
        { id: 'results', title: 'Resultados' }
      ]
    }
  },
  acai: {
    title: 'Acai : Data + Design',
    headerImage: '/images/projects/acai/cover.webp',
    avatarImage: '/images/projects/acai/logo.webp',
    sections: {
      en: [
        { id: 'overview', title: 'Overview' },
        { id: 'challenge', title: 'The Challenge' },
        { id: 'problem', title: 'The Problem' },
        { id: 'discovery', title: 'Discovery and Analysis' },
        { id: 'takeaway', title: 'Key Takeaways' },
        { id: 'user-path', title: "Understanding User's path" },
        { id: 'mvp', title: 'MVP Definition' },
        { id: 'built-for-tom', title: 'What we built for Tom' },
      ],
      pt: [
        { id: 'overview', title: 'Overview' },
        { id: 'challenge', title: 'The Challenge' },
        { id: 'problem', title: 'The Problem' },
        { id: 'discovery', title: 'Discovery and Analysis' },
        { id: 'takeaway', title: 'Key Takeaways' },
        { id: 'user-path', title: "Understanding User's path" },
        { id: 'mvp', title: 'MVP Definition' },
        { id: 'built-for-tom', title: 'What we built for Tom' },
      ],
    },
    content: {
      en: {
        overview: {
          title: 'Overview',
          content: `Most analytics tools weren’t built for designers. Acai changes that surfacing insights that are visual, contextual, and ready to act on. Acai is a data analytics tool built specifically for designers. It pulls in data from tools like Mixpanel, Hotjar, and Google Analytics , and instead of presenting raw numbers, it takes a screenshot of your actual product and gives you insights based on what it sees in that visual.

The goal: give designers the clarity they need to act, without requiring them to become analytics experts.`,
          images: [
            '/images/projects/acai/overview-1.webp',
            '/images/projects/acai/overview-2.webp',
            '/images/projects/acai/overview-3.webp',
          ],
          projectInfo: {
            tools: [
              'Figma/Figjam',
              'Storey Teller',
              'Google meet',
              'Google workspace',
            ],
            duration: 'Ongoing',
          },
        },
        challenge: {
          title: 'The Challenge',
          content: `Every product team has at least one designer. But for a designer’s work to land, it needs to be backed by both qualitative and quantitative data — not just one or the other.

The problem is that most designers don’t have direct access to the numbers. They rely on project managers or data analysts to pull insights, which either slows down the process or means decisions get made without the full picture.

And as the role of the designer expands, expected to contribute to strategy, not just craft, that gap becomes harder to ignore.

With Acai, designers can:`,
          items: [
            'Make data-driven decisions independently',
            'Contribute to product strategy with confidence',
            'Move faster without waiting on analysts',
            'Take full ownership of the product experience',
          ],
        },
        discovery: {
          title: 'Discovery and Analysis',
          content: `Most designers are designing blind.

Before building anything, we needed to hear directly from the people who would use it. We interviewed designers across levels from junior to staff to understand their current pain points around data, how they work today, and what we might have missed in our initial internal brainstorm.`,
          flowFindings: {
            title: 'What mapping the flow uncovered',
            items: [
              {
                title: 'Multiple streams in a project',
                description:
                  'If a user has more than one stream, how do they select which one to analyze? A decision that would have been missed without mapping the flow end to end.',
              },
              {
                title: 'Disconnected integrations',
                description:
                  'If the connection between a site and a partner breaks, how does the user know? How do they reconnect without losing their work?',
              },
              {
                title: 'AI vs. manual input',
                description:
                  'Where Acai generates the insight automatically versus where the designer needs to stay in control of the decision',
              },
              {
                title: 'Empty state',
                description:
                  "What a designer sees when there's not enough data yet — a moment that needed its own solution, not just a blank screen",
              },
            ],
          },
        },
        takeaway: {
          title: 'Key Takeaways',
          keyTakeaways: [
            {
              image: '/images/projects/acai/takeaway-1.webp',
              title: 'Trends & iterations',
              description:
                'Designers need to see how changes perform over time, and quickly decide whether to revert or move forward',
            },
            {
              image: '/images/projects/acai/takeaway-2.webp',
              title: 'Data curated for designers',
              description:
                'Not every data point matters to a designer. They need a focused set of metrics relevant to design decisions, not a full analyst dashboard',
            },
            {
              image: '/images/projects/acai/takeaway-3.webp',
              title: 'Actionable insights',
              description:
                "Raw data isn't enough. Designers need interpretation — clear next steps attached to what the numbers are saying",
            },
          ],
        },
        'user-path': {
          userPath: {
            content: `We took one of our designers, Tom, and mapped every step from the moment a user dropped off a flow to the moment Tom could act on that insight. That end-to-end flow became the pressure-test for our MVP — and the clearest picture of what Acai needed to support on day one.`,
            image: '/images/projects/acai/user-path-flow.webp',
            pivotalMoment: {
              icon: '/images/projects/acai/pivotal-icon.webp',
              title: 'A pivotal moment',
              content: `Acai was originally designed as a Figma plugin. It wasn't until we mapped the flows in full that we realized a plugin is an extension of an existing product — it lives in someone else's house. For the depth of data, the AI engine, and the insight experience we wanted to give designers, a plugin would have been too constrained. That's when we made the call to build Acai as a standalone product.`,
            },
          },
        },
        mvp: {
          mvpDefinition: {
            subtitle: 'Meet Tom',
            content: `Tom is a product designer working on a client's online shopping website. Users keep falling off before checkout — they never make it to adding an item to cart — and Tom needs to understand why, fast.

Mapping Tom's end-to-end journey with Acai became the MVP definition: the exact set of actions he needs to go from a drop-off problem to a design decision he can act on.`,
            image: '/images/projects/acai/mvp-flow.webp',
            featuresIntro:
              "Based on Tom's needs, Five things had to exist on day one",
            features: [
              {
                image: '/images/projects/acai/mvp-feature-1.webp',
                title: 'Pages',
                description:
                  'View insights tied to each page of your product',
              },
              {
                image: '/images/projects/acai/mvp-feature-2.webp',
                title: 'Flows',
                description:
                  'Track how users move through your product end to end',
              },
              {
                image: '/images/projects/acai/mvp-feature-3.webp',
                title: 'Data source',
                description:
                  'Set up and manage your workspace independently',
              },
              {
                image: '/images/projects/acai/mvp-feature-4.webp',
                title: 'AI chatbot',
                description:
                  'Ask questions and get contextual design suggestions',
              },
              {
                image: '/images/projects/acai/mvp-feature-5.webp',
                title: 'Project management',
                description:
                  'Organize insights across multiple projects and clients',
              },
            ],
          },
        },
        'built-for-tom': {
          content: `Before jumping into wireframes, we mapped the full vision of Acai — then cut ruthlessly. Blue is what had to exist for Tom to complete his task end to end. Grey is everything else: valuable, but not day one.`,
          image: '/images/projects/acai/built-for-tom-map.webp',
          navigationDecisions: {
            title: 'navigation decisions',
            content: `We also simplified how Tom moves through the product. Early concepts mixed a main navigation with contextual sub-navigation, which quickly felt cluttered and confusing. We moved to a single main navigation — each page self-contained — so Tom always knows where he is and what he can do next.`,
          },
          designIterations: [
            {
              image: '/images/projects/acai/built-sidebar-compare.webp',
              title: 'Sidebar evolution',
              description:
                'The old sidebar was flat and easy to outgrow. The new structure adds a clear home, renames Integrations to Data source, supports nested sections like Billing, and surfaces upgrade context next to the account — so Tom can orient, manage plans, and act without digging.',
            },
            {
              image: '/images/projects/acai/built-billing-compare.webp',
              title: 'Billing & plans',
              description:
                'Plans moved from a buried tab into a clearer billing hierarchy. Stronger hierarchy, simpler monthly/annual switching, and an upgrade path that sits next to Tom’s account state make pricing decisions easier to scan and act on.',
            },
            {
              image: '/images/projects/acai/built-old.webp',
              title: 'Old',
              description:
                'The old billing experience stacked main navigation, sub-navigation, and a permanent AI chat panel. Three layers competing for space made the interface feel cluttered, and the chat took screen real estate whether Tom needed it or not.',
            },
            {
              image: '/images/projects/acai/built-new.webp',
              title: 'New',
              description:
                'AI chat collapsed into a floating action button — one click to expand without disrupting the view, with a full-screen option for deeper conversations. Navigation dropped from three layers to two, so Billing stays focused and easier to scan.',
            },
            {
              image: '/images/projects/acai/built-final.webp',
              title: 'Final',
              description:
                'The cleaned plans view: clearer monthly/annual switching, stronger plan cards, and an upgrade path that’s easier to act on without competing navigation layers.',
            },
          ],
          videoWalkthrough: {
            title: 'Walkthrough',
            items: [
              {
                label: 'Old',
                src: '/images/projects/acai/videos/old.mp4',
              },
              {
                label: 'New',
                src: '/images/projects/acai/videos/new.mp4',
              },
              {
                label: 'Final',
                src: '/images/projects/acai/videos/final.mp4',
              },
            ],
          },
        },
      },
      pt: {
        overview: {
          title: 'Overview',
          content: `A maioria das ferramentas de analytics não foi feita para designers. O Acai muda isso, revelando insights visuais, contextuais e prontos para ação. O Acai é uma ferramenta de analytics pensada especificamente para designers. Liga dados de ferramentas como Mixpanel, Hotjar e Google Analytics e, em vez de mostrar números crus, captura um screenshot do teu produto e dá insights com base no que vê nesse visual.

O objetivo: dar aos designers a clareza necessária para agir, sem os obrigar a tornar-se especialistas em analytics.`,
          images: [
            '/images/projects/acai/overview-1.webp',
            '/images/projects/acai/overview-2.webp',
            '/images/projects/acai/overview-3.webp',
          ],
          projectInfo: {
            tools: [
              'Figma/Figjam',
              'Storey Teller',
              'Google meet',
              'Google workspace',
            ],
            duration: 'Ongoing',
          },
        },
        challenge: {
          title: 'The Challenge',
          content: `Todas as equipas de produto têm pelo menos um designer. Mas para o trabalho do designer ter impacto, precisa de ser apoiado por dados qualitativos e quantitativos — não só por um ou pelo outro.

O problema é que a maioria dos designers não tem acesso direto aos números. Dependem de project managers ou analistas de dados para extrair insights, o que atrasa o processo ou leva a decisões sem a visão completa.

E à medida que o papel do designer se expande — esperado contribuir para a estratégia, e não só para o craft — essa lacuna torna-se mais difícil de ignorar.

Com o Acai, os designers podem:`,
          items: [
            'Tomar decisões baseadas em dados de forma independente',
            'Contribuir para a estratégia de produto com confiança',
            'Avançar mais depressa sem esperar por analistas',
            'Assumir a totalidade da experiência do produto',
          ],
        },
        discovery: {
          title: 'Discovery and Analysis',
          content: `A maioria dos designers está a desenhar às cegas.

Antes de construir qualquer coisa, precisávamos ouvir diretamente as pessoas que o usariam. Entrevistámos designers de vários níveis — de junior a staff — para perceber as suas dores atuais em torno dos dados, como trabalham hoje, e o que poderíamos ter falhado no brainstorming interno inicial.`,
          flowFindings: {
            title: 'What mapping the flow uncovered',
            items: [
              {
                title: 'Multiple streams in a project',
                description:
                  'Se um utilizador tem mais do que um stream, como escolhe qual analisar? Uma decisão que teria passado despercebida sem mapear o fluxo de ponta a ponta.',
              },
              {
                title: 'Disconnected integrations',
                description:
                  'Se a ligação entre um site e um parceiro falha, como é que o utilizador sabe? Como volta a ligar sem perder o trabalho?',
              },
              {
                title: 'AI vs. manual input',
                description:
                  'Onde o Acai gera o insight automaticamente versus onde o designer precisa de manter o controlo da decisão',
              },
              {
                title: 'Empty state',
                description:
                  'O que um designer vê quando ainda não há dados suficientes — um momento que precisava da sua própria solução, e não só de um ecrã em branco',
              },
            ],
          },
        },
        takeaway: {
          title: 'Key Takeaways',
          keyTakeaways: [
            {
              image: '/images/projects/acai/takeaway-1.webp',
              title: 'Trends & iterations',
              description:
                'Os designers precisam de ver como as mudanças performam ao longo do tempo, e decidir rapidamente se revertem ou avançam',
            },
            {
              image: '/images/projects/acai/takeaway-2.webp',
              title: 'Data curated for designers',
              description:
                'Nem todos os dados importam para um designer. Precisam de um conjunto focado de métricas relevantes para decisões de design, não de um dashboard completo de analista',
            },
            {
              image: '/images/projects/acai/takeaway-3.webp',
              title: 'Actionable insights',
              description:
                'Dados crus não chegam. Os designers precisam de interpretação — próximos passos claros ligados ao que os números estão a dizer',
            },
          ],
        },
        'user-path': {
          userPath: {
            content: `Pegámos num dos nossos designers, o Tom, e mapeámos cada passo — desde o momento em que um utilizador abandona um fluxo até ao momento em que o Tom consegue agir sobre esse insight. Esse fluxo de ponta a ponta tornou-se o teste de stress do nosso MVP — e a visão mais clara do que o Acai precisava de suportar no dia um.`,
            image: '/images/projects/acai/user-path-flow.webp',
            pivotalMoment: {
              icon: '/images/projects/acai/pivotal-icon.webp',
              title: 'A pivotal moment',
              content: `O Acai foi originalmente desenhado como um plugin do Figma. Só quando mapeámos os fluxos por completo é que percebemos que um plugin é uma extensão de um produto existente — vive na casa de outra pessoa. Para a profundidade de dados, o motor de IA e a experiência de insights que queríamos dar aos designers, um plugin teria sido demasiado limitado. Foi aí que decidimos construir o Acai como um produto autónomo.`,
            },
          },
        },
        mvp: {
          mvpDefinition: {
            subtitle: 'Meet Tom',
            content: `O Tom é um product designer a trabalhar no site de compras online de um cliente. Os utilizadores abandonam antes do checkout — nunca chegam a adicionar um item ao carrinho — e o Tom precisa de perceber porquê, depressa.

Mapear a jornada de ponta a ponta do Tom com o Acai tornou-se a definição do MVP: o conjunto exacto de ações de que ele precisa para ir de um problema de drop-off a uma decisão de design sobre a qual possa agir.`,
            image: '/images/projects/acai/mvp-flow.webp',
            featuresIntro:
              'Com base nas necessidades do Tom, cinco coisas tinham de existir no dia um',
            features: [
              {
                image: '/images/projects/acai/mvp-feature-1.webp',
                title: 'Pages',
                description:
                  'Ver insights ligados a cada página do teu produto',
              },
              {
                image: '/images/projects/acai/mvp-feature-2.webp',
                title: 'Flows',
                description:
                  'Acompanhar como os utilizadores se movem pelo teu produto de ponta a ponta',
              },
              {
                image: '/images/projects/acai/mvp-feature-3.webp',
                title: 'Data source',
                description:
                  'Configurar e gerir o teu workspace de forma independente',
              },
              {
                image: '/images/projects/acai/mvp-feature-4.webp',
                title: 'AI chatbot',
                description:
                  'Fazer perguntas e obter sugestões de design contextuais',
              },
              {
                image: '/images/projects/acai/mvp-feature-5.webp',
                title: 'Project management',
                description:
                  'Organizar insights em vários projetos e clientes',
              },
            ],
          },
        },
        'built-for-tom': {
          content: `Antes de saltar para os wireframes, mapeámos a visão completa do Acai — e depois cortámos sem piedade. Azul é o que tinha de existir para o Tom completar a tarefa de ponta a ponta. Cinza é tudo o resto: valioso, mas não para o dia um.`,
          image: '/images/projects/acai/built-for-tom-map.webp',
          navigationDecisions: {
            title: 'navigation decisions',
            content: `Também simplificámos a forma como o Tom se move no produto. Os conceitos iniciais misturavam uma navegação principal com sub-navegação contextual, o que depressa pareceu sobrecarregado e confuso. Passámos para uma única navegação principal — cada página autónomo — para que o Tom saiba sempre onde está e o que pode fazer a seguir.`,
          },
          designIterations: [
            {
              image: '/images/projects/acai/built-sidebar-compare.webp',
              title: 'Sidebar evolution',
              description:
                'A sidebar antiga era plana e fácil de ficar pequena demais. A nova estrutura acrescenta um home claro, renomeia Integrations para Data source, permite secções aninhadas como Billing, e mostra o contexto de upgrade junto da conta — para o Tom se orientar, gerir planos e agir sem procurar.',
            },
            {
              image: '/images/projects/acai/built-billing-compare.webp',
              title: 'Billing & plans',
              description:
                'Os planos passaram de um separador escondido para uma hierarquia de billing mais clara. Melhor hierarquia, troca mensal/anual mais simples, e um caminho de upgrade junto do estado da conta tornam as decisões de preço mais fáceis de ler e agir.',
            },
            {
              image: '/images/projects/acai/built-old.webp',
              title: 'Old',
              description:
                'A experiência antiga de billing empilhava navegação principal, sub-navegação e um painel permanente de AI chat. Três camadas a competir por espaço tornavam a interface confusa, e o chat ocupava ecrã mesmo quando o Tom não precisava dele.',
            },
            {
              image: '/images/projects/acai/built-new.webp',
              title: 'New',
              description:
                'O AI chat passou para um floating action button — um clique para expandir sem atrapalhar a vista, com opção de ecrã inteiro para conversas mais profundas. A navegação desceu de três camadas para duas, para o Billing ficar focado e mais fácil de ler.',
            },
            {
              image: '/images/projects/acai/built-final.webp',
              title: 'Final',
              description:
                'A vista de planos limpa: troca mensal/anual mais clara, cards de plano mais fortes, e um caminho de upgrade mais fácil de agir sem camadas de navegação a competir.',
            },
          ],
          videoWalkthrough: {
            title: 'Walkthrough',
            items: [
              {
                label: 'Old',
                src: '/images/projects/acai/videos/old.mp4',
              },
              {
                label: 'New',
                src: '/images/projects/acai/videos/new.mp4',
              },
              {
                label: 'Final',
                src: '/images/projects/acai/videos/final.mp4',
              },
            ],
          },
        },
      },
    },
  },
};

// Image Carousel Component
function ImageCarousel({ images, title }: { images: string[] | Array<{ src: string; alt?: string }>, title: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = images.length > 1;
  
  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  
  const currentImage = images[currentImageIndex];
  const imageSrc = typeof currentImage === 'string' ? currentImage : currentImage.src;
  const imageAlt = typeof currentImage === 'string' ? `${title} image` : currentImage.alt || `${title} image ${currentImageIndex + 1}`;
  
  return (
    <div className="pt-8 md:pt-[42px] relative">
      <div className="relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={800}
          height={600}
          className="w-full h-auto rounded-lg"
        />
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors z-10"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
      {hasMultipleImages && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-foreground' : 'bg-brand-shadow'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectPage({ params }: Params) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale === 'pt' ? 'pt' : 'en';
  const project = projectData[resolvedParams.slug as keyof typeof projectData];
  const { setHeaderImages, resetHeaderImages } = useHeaderContext();
  const [activeSection, setActiveSection] = useState('overview');
  
  if (!project) {
    notFound();
  }

  // Update header images when component mounts
  useEffect(() => {
    setHeaderImages(project.headerImage, project.avatarImage);
    
    // Reset header images when component unmounts
    return () => {
      resetHeaderImages();
    };
  }, [project.headerImage, project.avatarImage, setHeaderImages, resetHeaderImages]);

  // Scroll detection for active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = project.sections[locale].map(section => section.id);
      const scrollPosition = window.scrollY + 200; // Increased offset for better detection

      // Check if we're at the very top of the page
      if (window.scrollY < 50) {
        setActiveSection(sections[0]);
        return;
      }

      // Find the current section
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [project.sections, locale]);

  return (
    <div className="min-h-screen bg-background">
      {/* Main content with sidebar */}
      <div className="flex mt-3.5 md:mt-5 gap-22">
        {/* Sidebar - Hidden on mobile, visible on md+ */}
        <div className="hidden md:block w-40 flex-shrink-0">
          <nav className="sticky top-6">
            <ul className="space-y-6">
              {project.sections[locale].map((section) => (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => {
                      const element = document.getElementById(section.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`w-full text-left transition-colors ${
                      activeSection === section.id 
                        ? 'text-snow font-medium' 
                        : 'text-brand-shadow hover:text-foreground'
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <h1 className="mb-3 text-2xl md:text-[32px] font-medium md:font-semibold text-foreground">
            {project.title}
          </h1>
          
           {/* Content sections - dynamically rendered based on project */}
           <div className="space-y-8 md:space-y-16">
             {project.sections[locale].map((section) => {
               const sectionContent = (project as any).content?.[locale]?.[section.id];
               return (
                 <section key={section.id} id={section.id} className="scroll-mt-8 md:scroll-mt-[42px]">
                   <h2 className="mb-4 text-base md:text-2xl font-medium text-foreground">
                     {sectionContent?.title || section.title}
                   </h2>
                   <div className=" text-brand-shadow">
                     {sectionContent?.content ? (
                       <div className="text-xs md:text-base leading-[200%] whitespace-pre-line">
                         {sectionContent.content}
                       </div>
                     ) : null}
                     {sectionContent?.items && (
                       <div className="pt-4 md:pt-6">
                         <ul className="space-y-3 md:space-y-4">
                           {sectionContent.items.map((item: string, idx: number) => (
                             <li key={idx} className="text-xs md:text-base leading-[200%] flex items-start gap-2">
                               <span className="text-foreground mt-1">•</span>
                               <span>{item}</span>
                             </li>
                           ))}
                         </ul>
                       </div>
                     )}
                     {sectionContent?.keyTakeaways && (
                       <div className="pt-6 md:pt-8 space-y-8 md:space-y-10">
                         {sectionContent.keyTakeaways.map(
                           (
                             item: {
                               image: string;
                               title: string;
                               description: string;
                             },
                             idx: number,
                           ) => (
                             <div
                               key={idx}
                               className="flex items-start gap-4 md:gap-6"
                             >
                               <div className="relative h-12 w-16 shrink-0 md:h-14 md:w-20">
                                 <Image
                                   src={item.image}
                                   alt={item.title}
                                   fill
                                   sizes="80px"
                                   className="object-contain object-left"
                                 />
                               </div>
                               <div className="min-w-0 pt-1">
                                 <h3 className="text-sm font-medium text-foreground md:text-base">
                                   {item.title}
                                 </h3>
                                 <p className="mt-1 text-xs leading-[180%] text-brand-shadow md:text-base md:leading-[200%]">
                                   {item.description}
                                 </p>
                               </div>
                             </div>
                           ),
                         )}
                       </div>
                     )}
                     {sectionContent?.userPath && (
                       <div className={sectionContent.content ? 'pt-10 md:pt-14' : undefined}>
                         {sectionContent.userPath.title && (
                           <h3 className="mb-4 text-base font-medium text-foreground md:text-2xl">
                             {sectionContent.userPath.title}
                           </h3>
                         )}
                         <p className="text-xs leading-[200%] text-brand-shadow md:text-base whitespace-pre-line">
                           {sectionContent.userPath.content}
                         </p>
                         {sectionContent.userPath.image && (
                           <div className="mt-6 overflow-hidden rounded-xl border border-brand-grey md:mt-8">
                             <Image
                               src={sectionContent.userPath.image}
                               alt={
                                 sectionContent.userPath.title ||
                                 section.title
                               }
                               width={1200}
                               height={500}
                               className="h-auto w-full"
                             />
                           </div>
                         )}
                         {sectionContent.userPath.pivotalMoment && (
                           <div className="mt-6 rounded-xl bg-[#EAF7EC] px-4 py-5 md:mt-8 md:px-6 md:py-6">
                             <div className="flex items-start gap-3">
                               {sectionContent.userPath.pivotalMoment.icon && (
                                 <Image
                                   src={sectionContent.userPath.pivotalMoment.icon}
                                   alt=""
                                   width={36}
                                   height={36}
                                   className="mt-0.5 h-8 w-8 shrink-0 md:h-9 md:w-9"
                                 />
                               )}
                               <div className="min-w-0">
                                 <h4 className="text-sm font-semibold text-[#111111] md:text-base">
                                   {sectionContent.userPath.pivotalMoment.title}
                                 </h4>
                                 <p className="mt-2 text-xs leading-[180%] text-[#333333] md:text-sm md:leading-[200%]">
                                   {sectionContent.userPath.pivotalMoment.content}
                                 </p>
                               </div>
                             </div>
                           </div>
                         )}
                       </div>
                     )}
                     {sectionContent?.flowFindings && (
                       <div className="pt-10 md:pt-14">
                         <h3 className="mb-6 text-base font-medium text-foreground md:mb-8 md:text-2xl">
                           {sectionContent.flowFindings.title}
                         </h3>
                         <div className="space-y-6 md:space-y-8">
                           {sectionContent.flowFindings.items.map(
                             (
                               item: { title: string; description: string },
                               idx: number,
                             ) => (
                               <div key={idx} className="flex items-start gap-3 md:gap-4">
                                 <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground md:mt-1 md:h-6 md:w-6">
                                   <svg
                                     className="h-3 w-3 text-background md:h-3.5 md:w-3.5"
                                     viewBox="0 0 20 20"
                                     fill="currentColor"
                                     aria-hidden
                                   >
                                     <path
                                       fillRule="evenodd"
                                       d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3.25-3.25a1 1 0 011.414-1.414L8.75 11.836l6.543-6.543a1 1 0 011.414 0z"
                                       clipRule="evenodd"
                                     />
                                   </svg>
                                 </span>
                                 <div className="min-w-0">
                                   <h4 className="text-sm font-semibold text-foreground md:text-base">
                                     {item.title}
                                   </h4>
                                   <p className="mt-1 text-xs leading-[180%] text-brand-shadow md:text-base md:leading-[200%]">
                                     {item.description}
                                   </p>
                                 </div>
                               </div>
                             ),
                           )}
                         </div>
                       </div>
                     )}
                     {sectionContent?.mvpDefinition && (
                       <div className={sectionContent.content ? 'pt-10 md:pt-14' : undefined}>
                         {sectionContent.mvpDefinition.title && (
                           <h3 className="mb-3 text-base font-medium text-foreground md:text-2xl">
                             {sectionContent.mvpDefinition.title}
                           </h3>
                         )}
                         {sectionContent.mvpDefinition.subtitle && (
                           <h4 className="mb-3 text-sm font-semibold text-foreground md:text-lg">
                             {sectionContent.mvpDefinition.subtitle}
                           </h4>
                         )}
                         <p className="text-xs leading-[200%] text-brand-shadow whitespace-pre-line md:text-base">
                           {sectionContent.mvpDefinition.content}
                         </p>
                         {sectionContent.mvpDefinition.image && (
                           <div className="mt-6 overflow-x-auto rounded-xl border border-brand-grey md:mt-8">
                             <Image
                               src={sectionContent.mvpDefinition.image}
                               alt={
                                 sectionContent.mvpDefinition.title ||
                                 section.title
                               }
                               width={1400}
                               height={360}
                               className="h-auto min-w-[720px] w-full max-w-none"
                             />
                           </div>
                         )}
                         {sectionContent.mvpDefinition.featuresIntro && (
                           <h4 className="mt-10 mb-6 text-sm font-semibold text-foreground md:mt-12 md:mb-8 md:text-lg">
                             {sectionContent.mvpDefinition.featuresIntro}
                           </h4>
                         )}
                         {sectionContent.mvpDefinition.features && (
                           <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 md:gap-4">
                             {sectionContent.mvpDefinition.features.map(
                               (
                                 feature: {
                                   image: string;
                                   title: string;
                                   description: string;
                                 },
                                 idx: number,
                               ) => (
                                 <div
                                   key={idx}
                                   className="flex flex-col items-center text-center"
                                 >
                                   <div className="relative mb-3 h-10 w-10 md:h-12 md:w-12">
                                     <Image
                                       src={feature.image}
                                       alt={feature.title}
                                       fill
                                       sizes="48px"
                                       className="rounded-lg object-contain"
                                     />
                                   </div>
                                   <h5 className="text-xs font-semibold text-foreground md:text-sm">
                                     {feature.title}
                                   </h5>
                                   <p className="mt-1 text-[10px] leading-[160%] text-brand-shadow md:text-xs md:leading-[180%]">
                                     {feature.description}
                                   </p>
                                 </div>
                               ),
                             )}
                           </div>
                         )}
                       </div>
                     )}
                     {(sectionContent?.image || sectionContent?.images) && (
                       <ImageGallery 
                         images={sectionContent.images || [sectionContent.image]} 
                         title={sectionContent.title}
                         peek={
                           resolvedParams.slug === 'acai' &&
                           section.id === 'overview'
                         }
                       />
                     )}
                     {sectionContent?.navigationDecisions && (
                       <div className="pt-8 md:pt-10">
                         <h3 className="mb-3 text-sm font-semibold text-foreground md:text-lg">
                           {sectionContent.navigationDecisions.title}
                         </h3>
                         <p className="text-xs leading-[200%] text-brand-shadow md:text-base whitespace-pre-line">
                           {sectionContent.navigationDecisions.content}
                         </p>
                       </div>
                     )}
                     {sectionContent?.designIterations && (
                       <div className="space-y-10 pt-8 md:space-y-12 md:pt-10">
                         {sectionContent.designIterations.map(
                           (
                             item: {
                               image: string;
                               title: string;
                               description: string;
                             },
                             idx: number,
                           ) => (
                             <div key={idx}>
                               <h3 className="mb-2 text-sm font-semibold text-foreground md:text-lg">
                                 {item.title}
                               </h3>
                               <p className="mb-4 text-xs leading-[200%] text-brand-shadow md:mb-6 md:text-base">
                                 {item.description}
                               </p>
                               <div className="overflow-hidden rounded-xl border border-brand-grey">
                                 <Image
                                   src={item.image}
                                   alt={item.title}
                                   width={1200}
                                   height={800}
                                   className="h-auto w-full"
                                 />
                               </div>
                             </div>
                           ),
                         )}
                       </div>
                     )}
                     {sectionContent?.videoWalkthrough && (
                       <div className="pt-10 md:pt-14">
                         <h3 className="mb-6 text-base font-medium text-foreground md:mb-8 md:text-2xl">
                           {sectionContent.videoWalkthrough.title}
                         </h3>
                         <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-4">
                           {sectionContent.videoWalkthrough.items.map(
                             (
                               item: { label: string; src: string },
                               idx: number,
                             ) => {
                               const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(
                                 item.src,
                               );
                               return (
                               <div key={idx} className="min-w-0">
                                 <p className="mb-2 text-sm font-semibold text-foreground">
                                   {item.label}
                                 </p>
                                 <div className="overflow-hidden rounded-xl border border-brand-grey bg-black/5">
                                   {isVideo ? (
                                     <video
                                       src={item.src}
                                       controls
                                       playsInline
                                       preload="metadata"
                                       className="h-auto w-full"
                                       aria-label={`${item.label} walkthrough`}
                                     >
                                       Your browser does not support the video tag.
                                     </video>
                                   ) : (
                                     <Image
                                       src={item.src}
                                       alt={`${item.label} walkthrough`}
                                       width={1024}
                                       height={740}
                                       className="h-auto w-full"
                                     />
                                   )}
                                 </div>
                               </div>
                               );
                             },
                           )}
                         </div>
                       </div>
                     )}
                     {sectionContent?.colorPalette && (
                       <div className="pt-8 md:pt-[42px]">
                         <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                           {sectionContent.colorPalette.primary && (
                             <div className="space-y-2 md:space-y-3">
                               <h4 className="text-sm md:text-base font-medium text-foreground mb-2 md:mb-3">Primary</h4>
                               {sectionContent.colorPalette.primary.map((color: any, idx: number) => (
                                 <div key={idx} className="flex items-center gap-2 md:gap-3">
                                   <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg border border-brand-grey flex-shrink-0" style={{ backgroundColor: color.hex }} />
                                   <div>
                                     <p className="text-xs md:text-sm font-medium text-foreground">{color.name}</p>
                                     <p className="text-xs text-brand-shadow">{color.hex}</p>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           )}
                           {sectionContent.colorPalette.linear && (
                             <div className="space-y-2 md:space-y-3">
                               <h4 className="text-sm md:text-base font-medium text-foreground mb-2 md:mb-3">Linear</h4>
                               {sectionContent.colorPalette.linear.map((color: any, idx: number) => (
                                 <div key={idx} className="flex items-center gap-2 md:gap-3">
                                   <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg border border-brand-grey flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${color.hex}, ${color.hex2 || color.hex})` }} />
                                   <div>
                                     <p className="text-xs md:text-sm font-medium text-foreground">{color.name}</p>
                                     <p className="text-xs text-brand-shadow">{color.hex} → {color.hex2 || color.hex}</p>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           )}
                           {sectionContent.colorPalette.status && (
                             <div className="space-y-2 md:space-y-3">
                               <h4 className="text-sm md:text-base font-medium text-foreground mb-2 md:mb-3">Status</h4>
                               {sectionContent.colorPalette.status.map((color: any, idx: number) => (
                                 <div key={idx} className="flex items-center gap-2 md:gap-3">
                                   <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg border border-brand-grey flex-shrink-0" style={{ backgroundColor: color.hex }} />
                                   <div>
                                     <p className="text-xs md:text-sm font-medium text-foreground">{color.name}</p>
                                     <p className="text-xs text-brand-shadow">{color.hex}</p>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           )}
                           {sectionContent.colorPalette.black && (
                             <div className="space-y-2 md:space-y-3">
                               <h4 className="text-sm md:text-base font-medium text-foreground mb-2 md:mb-3">Black</h4>
                               {sectionContent.colorPalette.black.map((color: any, idx: number) => (
                                 <div key={idx} className="flex items-center gap-2 md:gap-3">
                                   <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg border border-brand-grey flex-shrink-0" style={{ backgroundColor: color.hex }} />
                                   <div>
                                     <p className="text-xs md:text-sm font-medium text-foreground">{color.name}</p>
                                     <p className="text-xs text-brand-shadow">{color.hex}</p>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           )}
                           {sectionContent.colorPalette.white && (
                             <div className="space-y-2 md:space-y-3">
                               <h4 className="text-sm md:text-base font-medium text-foreground mb-2 md:mb-3">White</h4>
                               {sectionContent.colorPalette.white.map((color: any, idx: number) => (
                                 <div key={idx} className="flex items-center gap-2 md:gap-3">
                                   <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg border border-brand-grey flex-shrink-0" style={{ backgroundColor: color.hex }} />
                                   <div>
                                     <p className="text-xs md:text-sm font-medium text-foreground">{color.name}</p>
                                     <p className="text-xs text-brand-shadow">{color.hex}</p>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           )}
                           {sectionContent.colorPalette.background && (
                             <div className="col-span-2 md:col-span-2 lg:col-span-3 space-y-2 md:space-y-3">
                               <h4 className="text-sm md:text-base font-medium text-foreground mb-2 md:mb-3">Background</h4>
                               <div className="flex items-center gap-2 md:gap-4">
                                 {sectionContent.colorPalette.background.map((color: any, idx: number) => (
                                   <div key={idx} className="flex flex-col items-center gap-1 md:gap-2">
                                     <div className="w-10 h-10 md:w-16 md:h-16 rounded-full border-2 border-brand-grey flex-shrink-0" style={{ backgroundColor: color.hex }} />
                                     <div className="text-center">
                                       <p className="text-xs md:text-sm font-medium text-foreground">{color.name}</p>
                                       <p className="text-xs text-brand-shadow">{color.hex}</p>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                           {sectionContent.colorPalette.tetradic && (
                             <div className="space-y-2 md:space-y-3">
                               <h4 className="text-sm md:text-base font-medium text-foreground mb-2 md:mb-3">Tetradic</h4>
                               {sectionContent.colorPalette.tetradic.map((color: any, idx: number) => (
                                 <div key={idx} className="flex items-center gap-2 md:gap-3">
                                   <div className="w-10 h-10 md:w-16 md:h-16 rounded-lg border border-brand-grey flex-shrink-0" style={{ backgroundColor: color.hex }} />
                                   <div>
                                     <p className="text-xs md:text-sm font-medium text-foreground">{color.name}</p>
                                     <p className="text-xs text-brand-shadow">{color.hex}</p>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           )}
                         </div>
                       </div>
                     )}
                     {sectionContent?.image2 && (
                       <div className="pt-8 md:pt-[42px]">
                         <Image
                           src={sectionContent.image2}
                           alt={sectionContent.title || 'Design System'}
                           width={1200}
                           height={800}
                           className="w-full h-auto rounded-lg"
                         />
                       </div>
                     )}
                     {sectionContent?.projectInfo && (
                       <div className="pt-8">
                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 ">
                           <div>
                            <h3 className="font-medium text-base md:text-2xl text-foreground mb-3">Team</h3>
                            <p className="text-brand-shadow text-xs md:text-base whitespace-pre-line">{sectionContent.projectInfo.team}</p>
                           </div>
                           <div>
                             <h3 className="font-medium  text-base md:text-2xl text-foreground mb-3">Tools</h3>
                             <ul className="text-brand-shadow text-xs md:text-base space-y-1">
                               {sectionContent.projectInfo.tools.map((tool: string, index: number) => (
                                 <li key={index}>{tool}</li>
                               ))}
                             </ul>
                           </div>
                          <div>
                            <h3 className="font-medium text-base md:text-2xl text-foreground mb-3">Duration</h3>
                            <p className="text-brand-shadow text-xs md:text-base">{sectionContent.projectInfo.duration}</p>
                          </div>
                          {sectionContent.projectInfo.funds && (
                            <div>
                              <h3 className="font-medium  text-base md:text-2xl text-foreground mb-3">Funds</h3>
                              <p className="text-brand-shadow text-xs md:text-base">{sectionContent.projectInfo.funds}</p>
                            </div>
                          )}
                         </div>
                       </div>
                     )}
                     {sectionContent?.timeline && (
                       <div className="pt-8">
                         <div className="relative flex items-start justify-between">
                           {/* Background connecting line */}
                           <div className="absolute top-4 lg:top-[33.34px] left-0 right-0 h-0.5 bg-brand-grey z-0" style={{ left: '1rem', right: '1rem' }} />
                           
                           {sectionContent.timeline.map((item: any, index: number) => (
                             <div key={index} className="flex flex-col bg-background items-center relative flex-1 z-10">
                               <div className="w-8 h-8 lg:w-[66.68px] lg:h-[66.68px] bg-transparent border-2 border-brand-grey rounded-full flex items-center justify-center mb-2">
                                 <span className="text-sm font-bold text-brand-shadow lg:text-2xl">{item.step}</span>
                               </div>
                               <p className="text-xs text-brand-shadow text-center max-w-[60px] lg:max-w-[120px] leading-tight">{item.title}</p>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                     {sectionContent?.analysisTables && (
                       <div className="pt-8">
                         <div className="space-y-8">
                           {sectionContent.analysisTables.map((table: any, tableIndex: number) => (
                             <div key={tableIndex} className="rounded-lg shadow-sm border border-brand-grey overflow-hidden w-full bg-background">
                               <div className="p-4 border-b border-brand-grey bg-background">
                                 <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                                   <span>{table.icon}</span>
                                   {table.title}
                                 </h3>
                               </div>
                               <div className="overflow-x-auto w-full scrollbar-none">
                                 <table className="w-full min-w-[600px] table-fixed">
                                   <thead>
                                     <tr className="bg-brand-grey">
                                       <th className="px-4 py-3 text-left text-xs md:text-base font-medium text-foreground sticky left-0 bg-brand-grey z-10 w-32">Feature</th>
                                       {table.columns.map((column: string, colIndex: number) => (
                                         <th key={colIndex} className="px-4 py-3 text-center text-xs md:text-base font-medium text-foreground">
                                           {column}
                                         </th>
                                       ))}
                                     </tr>
                                   </thead>
                                   <tbody>
                                     {table.rows.map((row: any, rowIndex: number) => (
                                       <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-brand-grey'}>
                                         <td className="px-4 py-3 text-xs md:text-base font-medium text-foreground sticky left-0 bg-inherit z-10 w-32">{row.feature}</td>
                                         {row.values.map((value: any, valueIndex: number) => (
                                           <td key={valueIndex} className="px-4 py-3 text-xs md:text-base text-center text-brand-shadow">
                                             {typeof value === 'number' ? (
                                               <div className="flex justify-center gap-1">
                                                 {[1, 2, 3, 4, 5].map((star) => (
                                                   <span
                                                     key={star}
                                                     className={star <= value ? 'text-yellow-500' : 'text-gray-300'}
                                                   >
                                                     ★
                                                   </span>
                                                 ))}
                                               </div>
                                             ) : (
                                               value
                                             )}
                                           </td>
                                         ))}
                                       </tr>
                                     ))}
                                   </tbody>
                                 </table>
                               </div>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                     {sectionContent?.researchQuestions && (
                       <div className="pt-8 md:pt-[42px]">
                         <h3 className="mb-6 text-base md:text-2xl font-medium text-foreground">
                           {sectionContent.researchQuestions.title}
                         </h3>
                         <div className="space-y-6">
                           {sectionContent.researchQuestions.categories.map((category: any, catIndex: number) => (
                             <div key={catIndex} className="space-y-3">
                               <h4 className="text-sm md:text-lg font-medium text-foreground">
                                 {category.category}
                               </h4>
                               <ul className="space-y-2 ml-4">
                                 {category.questions.map((question: string, qIndex: number) => (
                                   <li key={qIndex} className="text-xs md:text-base text-brand-shadow leading-[200%] flex items-start gap-2">
                                     <span className="text-foreground mt-1">•</span>
                                     <span>{question}</span>
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                     {sectionContent?.researchFindings && (
                       <div className="pt-8 md:pt-[42px]">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                           {/* Age Range Donut Chart */}
                           {sectionContent.researchFindings.ageRange && (
                             <div className="space-y-4">
                               <h4 className="text-sm md:text-base font-medium text-foreground">
                                 {sectionContent.researchFindings.ageRange.title}
                               </h4>
                               <div className="flex items-center justify-center">
                                 <div className="relative w-32 h-32 md:w-40 md:h-40">
                                   <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                     <circle
                                       cx="50"
                                       cy="50"
                                       r="40"
                                       fill="none"
                                       stroke="#1F2937"
                                       strokeWidth="8"
                                     />
                                     {sectionContent.researchFindings.ageRange.segments.map((segment: any, index: number, array: any[]) => {
                                       const total = array.reduce((sum, s) => sum + s.value, 0);
                                       const percentage = segment.value / total;
                                       const offset = array.slice(0, index).reduce((sum, s) => sum + (s.value / total), 0);
                                       const circumference = 2 * Math.PI * 40;
                                       const strokeDasharray = `${circumference * percentage} ${circumference}`;
                                       const strokeDashoffset = -circumference * offset;
                                       
                                       return (
                                         <circle
                                           key={index}
                                           cx="50"
                                           cy="50"
                                           r="40"
                                           fill="none"
                                           stroke={segment.color}
                                           strokeWidth="8"
                                           strokeDasharray={strokeDasharray}
                                           strokeDashoffset={strokeDashoffset}
                                         />
                                       );
                                     })}
                                   </svg>
                                   <div className="absolute inset-0 flex items-center justify-center">
                                     <div className="text-center">
                                       <div className="text-xs md:text-sm text-brand-shadow">Total</div>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                               <div className="space-y-2">
                                 {sectionContent.researchFindings.ageRange.segments.map((segment: any, index: number) => (
                                   <div key={index} className="flex items-center gap-2">
                                     <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }} />
                                     <span className="text-xs md:text-sm text-brand-shadow">{segment.label}: {segment.value}%</span>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                           
                           {/* Literacy Donut Chart */}
                           {sectionContent.researchFindings.literacy && (
                             <div className="space-y-4">
                               <h4 className="text-sm md:text-base font-medium text-foreground">
                                 {sectionContent.researchFindings.literacy.title}
                               </h4>
                               <div className="flex items-center justify-center">
                                 <div className="relative w-32 h-32 md:w-40 md:h-40">
                                   <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                     <circle
                                       cx="50"
                                       cy="50"
                                       r="40"
                                       fill="none"
                                       stroke="#1F2937"
                                       strokeWidth="8"
                                     />
                                     {sectionContent.researchFindings.literacy.segments.map((segment: any, index: number, array: any[]) => {
                                       const total = array.reduce((sum, s) => sum + s.value, 0);
                                       const percentage = segment.value / total;
                                       const offset = array.slice(0, index).reduce((sum, s) => sum + (s.value / total), 0);
                                       const circumference = 2 * Math.PI * 40;
                                       const strokeDasharray = `${circumference * percentage} ${circumference}`;
                                       const strokeDashoffset = -circumference * offset;
                                       
                                       return (
                                         <circle
                                           key={index}
                                           cx="50"
                                           cy="50"
                                           r="40"
                                           fill="none"
                                           stroke={segment.color}
                                           strokeWidth="8"
                                           strokeDasharray={strokeDasharray}
                                           strokeDashoffset={strokeDashoffset}
                                         />
                                       );
                                     })}
                                   </svg>
                                   <div className="absolute inset-0 flex items-center justify-center">
                                     <div className="text-center">
                                       <div className="text-xs md:text-sm text-brand-shadow">Total</div>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                               <div className="space-y-2">
                                 {sectionContent.researchFindings.literacy.segments.map((segment: any, index: number) => (
                                   <div key={index} className="flex items-center gap-2">
                                     <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }} />
                                     <span className="text-xs md:text-sm text-brand-shadow">{segment.label}: {segment.value}%</span>
                                   </div>
                                 ))}
                               </div>
                             </div>
                           )}
                           
                           {/* Metrics */}
                           {sectionContent.researchFindings.metrics && (
                             <>
                               {sectionContent.researchFindings.metrics.map((metric: any, index: number) => (
                                 <div key={index} className="space-y-2">
                                   <h4 className="text-sm md:text-base font-medium text-foreground">
                                     {metric.label}
                                   </h4>
                                   <div className="text-3xl md:text-5xl font-bold text-foreground">
                                     {metric.value}%
                                   </div>
                                 </div>
                               ))}
                             </>
                           )}
                         </div>
                         
                         {/* Priority Features */}
                         {sectionContent.researchFindings.priorityFeatures && (
                           <div className="mt-8 space-y-4">
                             <h4 className="text-sm md:text-base font-medium text-foreground">
                               {sectionContent.researchFindings.priorityFeatures.title}
                             </h4>
                             <div className="space-y-3">
                               {sectionContent.researchFindings.priorityFeatures.features.map((feature: any, index: number) => (
                                 <div key={index} className="space-y-1">
                                   <div className="flex justify-between items-center">
                                     <span className="text-xs md:text-sm text-brand-shadow">{feature.name}</span>
                                   </div>
                                   <div className="w-full bg-brand-grey rounded-full h-2 md:h-3">
                                     <div
                                       className="h-full rounded-full bg-foreground transition-all"
                                       style={{ width: `${feature.priority}%` }}
                                     />
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                         
                         {/* Key Features */}
                         {sectionContent.researchFindings.keyFeatures && (
                           <div className="mt-8 space-y-4">
                             <h4 className="text-sm md:text-base font-medium text-foreground">
                               {sectionContent.researchFindings.keyFeatures.title}
                             </h4>
                             <div className="space-y-4">
                               {sectionContent.researchFindings.keyFeatures.features.map((feature: any, index: number) => (
                                 <div key={index} className="flex items-start gap-3">
                                   <svg className="w-5 h-5 text-foreground mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                   </svg>
                                   <div className="flex-1">
                                     <h5 className="text-xs md:text-sm font-medium text-foreground mb-1">
                                       {feature.name}
                                     </h5>
                                     <p className="text-xs md:text-sm text-brand-shadow leading-[200%]">
                                       {feature.description}
                                     </p>
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                         
                         {/* Feature Details */}
                         {sectionContent.researchFindings.featureDetails && (
                           <div className="mt-8 space-y-8">
                             <h4 className="text-sm md:text-base font-medium text-foreground">
                               {sectionContent.researchFindings.featureDetails.title}
                             </h4>
                             <div className="space-y-12">
                               {sectionContent.researchFindings.featureDetails.features.map((feature: any, index: number) => (
                                 <div key={index} className="space-y-4">
                                   <div>
                                     <h5 className="text-xs md:text-base font-medium text-foreground mb-2">
                                       {feature.name}
                                     </h5>
                                     <p className="text-xs md:text-sm text-brand-shadow leading-[200%]">
                                       {feature.description}
                                     </p>
                                   </div>
                                   {feature.image && (
                                     <div className="pt-4">
                                       <Image
                                         src={feature.image}
                                         alt={feature.name}
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
                       </div>
                     )}
                     {sectionContent?.generalPlanning && (
                       <div className="pt-8 md:pt-[42px]">
                         <h3 className="mb-4 text-base md:text-2xl font-medium text-foreground">
                           {sectionContent.generalPlanning.title}
                         </h3>
                         {sectionContent.generalPlanning.content && (
                           <div className="text-xs md:text-base leading-[200%] whitespace-pre-line mb-8 text-brand-shadow">
                             {sectionContent.generalPlanning.content}
                           </div>
                         )}
                         {sectionContent.generalPlanning.images && (
                           <div className="space-y-8">
                             {sectionContent.generalPlanning.images.map((img: any, imgIndex: number) => {
                               if (img.fullWidth) {
                                 return (
                                   <div key={imgIndex} className="w-full">
                                     <Image
                                       src={img.src}
                                       alt={img.alt}
                                       width={1200}
                                       height={600}
                                       className="w-full h-auto rounded-lg"
                                     />
                                   </div>
                                 );
                               }
                               return null;
                             })}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               {sectionContent.generalPlanning.images
                                 .filter((img: any) => !img.fullWidth)
                                 .map((img: any, imgIndex: number) => (
                                   <div key={imgIndex} className="w-full">
                                     <Image
                                       src={img.src}
                                       alt={img.alt}
                                       width={600}
                                       height={400}
                                       className="w-full h-auto rounded-lg"
                                     />
                                   </div>
                                 ))}
                             </div>
                           </div>
                         )}
                       </div>
                     )}
                     {sectionContent?.heuristicEvaluation && (
                       <div className="pt-8 md:pt-[42px]">
                         <h3 className="mb-4 text-base md:text-2xl font-medium text-foreground">
                           {sectionContent.heuristicEvaluation.title}
                         </h3>
                         {sectionContent.heuristicEvaluation.introduction && (
                           <div className="text-xs md:text-base leading-[200%] whitespace-pre-line mb-8 text-brand-shadow">
                             {sectionContent.heuristicEvaluation.introduction}
                           </div>
                         )}
                         {sectionContent.heuristicEvaluation.images && (
                           <div className="mb-8 space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               {sectionContent.heuristicEvaluation.images.slice(0, 2).map((img: any, imgIndex: number) => (
                                 <div key={imgIndex} className="w-full">
                                   <Image
                                     src={img.src}
                                     alt={img.alt}
                                     width={600}
                                     height={400}
                                     className="w-full h-auto rounded-lg"
                                   />
                                 </div>
                               ))}
                             </div>
                             {sectionContent.heuristicEvaluation.images[2] && (
                               <div className="w-full">
                                 <Image
                                   src={sectionContent.heuristicEvaluation.images[2].src}
                                   alt={sectionContent.heuristicEvaluation.images[2].alt}
                                   width={1200}
                                   height={600}
                                   className="w-full h-auto rounded-lg"
                                 />
                               </div>
                             )}
                           </div>
                         )}
                         {sectionContent.heuristicEvaluation.findings && (
                           <div className="mb-8">
                             <h4 className="mb-4 text-base md:text-xl font-medium text-foreground">Findings after Heuristic evaluation</h4>
                             <div className="space-y-6">
                               {sectionContent.heuristicEvaluation.findings.map((finding: any, index: number) => (
                                 <div key={index} className="border-l-4 border-brand-grey pl-4">
                                   <h5 className="text-sm md:text-lg font-medium text-foreground mb-2">{index + 1}. {finding.category}</h5>
                                   <p className="text-xs md:text-base text-brand-shadow mb-2"><strong>Problem:</strong> {finding.problem}</p>
                                   <p className="text-xs md:text-base text-brand-shadow"><strong>Details:</strong> {finding.details}</p>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                         {sectionContent.heuristicEvaluation.conclusion && (
                           <div className="text-xs md:text-base leading-[200%] whitespace-pre-line text-brand-shadow">
                             <strong className="text-foreground">Conclusion:</strong> {sectionContent.heuristicEvaluation.conclusion}
                           </div>
                         )}
                       </div>
                     )}
                     {sectionContent?.images && !sectionContent.generalPlanning && section.id !== 'overview' && (
                       <div className="pt-8 md:pt-[42px]">
                         <div className="space-y-8">
                           {sectionContent.images.map((img: any, imgIndex: number) => (
                             <div key={imgIndex} className="w-full">
                               <Image
                                 src={img.src}
                                 alt={img.alt}
                                 width={1200}
                                 height={600}
                                 className="w-full h-auto rounded-lg"
                               />
                             </div>
                           ))}
                         </div>
                       </div>
                     )}
                     {(sectionContent?.persona || sectionContent?.useCase || sectionContent?.brandPersona || sectionContent?.commercialUseCase) && (
                       <div className="pt-8 md:pt-[42px] space-y-8">
                         {sectionContent.persona && (
                           <div>
                             <h3 className="mb-4 text-base md:text-xl font-medium text-foreground">
                               {sectionContent.persona.title}
                             </h3>
                             <div className="text-xs md:text-base leading-[200%] whitespace-pre-line text-brand-shadow">
                               {sectionContent.persona.content}
                             </div>
                           </div>
                         )}
                         {sectionContent.useCase && (
                           <div>
                             <h3 className="mb-4 text-base md:text-xl font-medium text-foreground">
                               {sectionContent.useCase.title}
                             </h3>
                             <div className="space-y-4">
                               {sectionContent.useCase.steps.map((step: any, index: number) => (
                                 <div key={index} className="border-l-4 border-brand-grey pl-4">
                                   <h4 className="text-sm md:text-lg font-medium text-foreground mb-2">
                                     {step.step}. {step.title}
                                   </h4>
                                   <p className="text-xs md:text-base text-brand-shadow">
                                     {step.description}
                                   </p>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                         {sectionContent.brandPersona && (
                           <div>
                             <h3 className="mb-4 text-base md:text-xl font-medium text-foreground">
                               {sectionContent.brandPersona.title}
                             </h3>
                             <div className="text-xs md:text-base leading-[200%] whitespace-pre-line text-brand-shadow">
                               {sectionContent.brandPersona.content}
                             </div>
                           </div>
                         )}
                         {sectionContent.commercialUseCase && (
                           <div>
                             <h3 className="mb-4 text-base md:text-xl font-medium text-foreground">
                               {sectionContent.commercialUseCase.title}
                             </h3>
                             <div className="space-y-4">
                               {sectionContent.commercialUseCase.steps.map((step: any, index: number) => (
                                 <div key={index} className="border-l-4 border-brand-grey pl-4">
                                   <h4 className="text-sm md:text-lg font-medium text-foreground mb-2">
                                     {step.step}. {step.title}
                                   </h4>
                                   <p className="text-xs md:text-base text-brand-shadow">
                                     {step.description}
                                   </p>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                       </div>
                     )}
                     {sectionContent?.quote && sectionContent?.author && (
                       <div>
                         <div className="text-xs md:text-base leading-[200%] text-brand-shadow mb-6">
                           {sectionContent.quote}
                         </div>
                         <div className="flex items-center gap-4">
                           {sectionContent.avatar && (
                             <Image
                               src={sectionContent.avatar}
                               alt={sectionContent.author}
                               width={64}
                               height={64}
                               className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                             />
                           )}
                           <div>
                             <p className="text-sm md:text-base font-medium text-foreground">
                               {sectionContent.author}
                             </p>
                             {sectionContent.role && (
                               <p className="text-xs md:text-sm text-brand-shadow">
                                 {sectionContent.role}
                               </p>
                             )}
                           </div>
                         </div>
                       </div>
                     )}
                   </div>
                 </section>
               );
             })}
           </div>
        </div>
      </div>
    </div>
  );
}
