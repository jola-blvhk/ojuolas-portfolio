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
function ImageGallery({ images, title }: { images: (string | { src: string; alt?: string })[], title?: string }) {
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
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
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
              <div key={index} className="flex-shrink-0">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="h-auto rounded-lg max-h-[800px] w-auto"
                  style={{ maxWidth: 'none' }}
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
    avatarImage: '/images/projects/x-optimization/x.webp',
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
  }
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
                     {(sectionContent?.image || sectionContent?.images) && (
                       <ImageGallery 
                         images={sectionContent.images || [sectionContent.image]} 
                         title={sectionContent.title}
                       />
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
