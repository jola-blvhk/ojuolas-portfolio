'use client';

import Image from 'next/image';
import fs from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import { useHeaderContext } from '@/components/header-context';
import { useEffect, use, useState } from 'react';

type Params = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

// Project data - you can move this to a separate file later
const projectData = {
  'ark-software': {
    title: 'Ark Software',
    headerImage: '/images/projects/ark-software-header.webp', // Building facade image
    avatarImage: '/images/projects/ark-software-avatar.webp', // Sky crop image
      sections: {
        en: [
          { id: 'overview', title: 'Overview' },
          { id: 'process', title: 'The Process' },
          { id: 'problem', title: 'The Problem' },
          { id: 'discovery', title: 'Discovery and Analysis' },
          { id: 'kickoff', title: 'Design Kickoff and General Planning' },
          { id: 'guidelines', title: 'Design Guideliness' },
          { id: 'screens', title: 'Screens' },
          { id: 'takeaway', title: 'Take Away' },
          { id: 'testimony', title: 'Testimony' }
        ],
        pt: [
          { id: 'overview', title: 'Visão Geral' },
          { id: 'process', title: 'O Processo' },
          { id: 'problem', title: 'O Problema' },
          { id: 'discovery', title: 'Descoberta e Análise' },
          { id: 'kickoff', title: 'Kick-off do Design e Planejamento Geral' },
          { id: 'guidelines', title: 'Diretrizes de Design' },
          { id: 'screens', title: 'Telas' },
          { id: 'takeaway', title: 'Conclusões' },
          { id: 'testimony', title: 'Depoimento' }
        ]
      },
    content: {
      en: {
        overview: {
          title: 'Overview',
          content: `This project explores the creation of a next-generation architecture and design software—reimagining what tools like Revit, SketchUp, Spline, and Figma could achieve if combined into a single, modern platform. The goal is to merge technical precision with creative flexibility, offering architects, interior designers, and creators an environment where collaboration, AI-powered workflows, and intuitive modeling coexist seamlessly.

The research phase identified limitations in current industry tools, such as fragmented user experiences, steep learning curves, and lack of modern collaboration capabilities. In response, this project proposes a unified platform that not only retains the technical rigor of established software but also integrates AI features, real-time collaboration, and freeform 3D moulding tools for custom furniture and spatial design.`,
          image: '/images/projects/ark.webp',
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
          content: 'Content for Design Kickoff and General Planning section will be added here.'
        },
        guidelines: {
          title: 'Design Guideliness',
          content: 'Content for Design Guideliness section will be added here.'
        },
        screens: {
          title: 'Screens',
          content: 'Content for Screens section will be added here.'
        },
        takeaway: {
          title: 'Take Away',
          content: 'Content for Take Away section will be added here.'
        },
        testimony: {
          title: 'Testimony',
          content: 'Content for Testimony section will be added here.'
        }
      },
      pt: {
        overview: {
          title: 'Visão Geral',
          content: `Este projeto explora a criação de um software de arquitetura e design de próxima geração—reimaginando o que ferramentas como Revit, SketchUp, Spline e Figma poderiam alcançar se combinadas numa única plataforma moderna. O objetivo é unir precisão técnica com flexibilidade criativa, oferecendo a arquitetos, designers de interiores e criadores um ambiente onde colaboração, fluxos de trabalho alimentados por IA e modelagem intuitiva coexistem perfeitamente.

A fase de pesquisa identificou limitações nas ferramentas atuais da indústria, como experiências de utilizador fragmentadas, curvas de aprendizagem íngremes e falta de capacidades modernas de colaboração. Em resposta, este projeto propõe uma plataforma unificada que não só mantém o rigor técnico do software estabelecido, mas também integra funcionalidades de IA, colaboração em tempo real e ferramentas de moldagem 3D livre para mobiliário personalizado e design espacial.`,
          image: '/images/projects/ark.webp'
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
          content: 'Conteúdo para a secção Kick-off do Design e Planejamento Geral será adicionado aqui.'
        },
        guidelines: {
          title: 'Diretrizes de Design',
          content: 'Conteúdo para a secção Diretrizes de Design será adicionado aqui.'
        },
        screens: {
          title: 'Telas',
          content: 'Conteúdo para a secção Telas será adicionado aqui.'
        },
        takeaway: {
          title: 'Conclusões',
          content: 'Conteúdo para a secção Conclusões será adicionado aqui.'
        },
        testimony: {
          title: 'Depoimento',
          content: 'Conteúdo para a secção Depoimento será adicionado aqui.'
        }
      }
    }
  },
  'pikd': {
    title: 'PIKD',
    headerImage: '/images/projects/pikd-header.webp',
    avatarImage: '/images/projects/pikd-avatar.webp',
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
  'hardsands-crm': {
    title: 'Hardsands CRM',
    headerImage: '/images/laptop.webp',
    avatarImage: '/images/projects/hardsands.webp',
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
  'x-optimization': {
    title: 'X App Optimization',
    headerImage: '/images/laptop.webp',
    avatarImage: '/images/projects/x.webp',
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
    avatarImage: '/images/projects/interior-design.webp',
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
    avatarImage: '/images/projects/portfolio-website.webp',
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
    avatarImage: '/images/projects/becomy.webp',
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
               const sectionContent = project.content?.[locale]?.[section.id];
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
                     {sectionContent?.image && (
                       <div className="pt-8 md:pt-[42px]">
                         <Image
                           src={sectionContent.image}
                           alt={`${sectionContent.title} image`}
                           width={800}
                           height={600}
                           className="w-full h-auto rounded-lg"
                         />
                       </div>
                     )}
                     {sectionContent?.projectInfo && (
                       <div className="pt-8">
                         <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 ">
                           <div>
                             <h3 className="font-medium text-base md:text-2xl text-foreground mb-3">Team</h3>
                             <p className="text-brand-shadow text-xs md:text-base">{sectionContent.projectInfo.team}</p>
                           </div>
                           <div>
                             <h3 className="font-medium  text-base md:text-2xl text-foreground mb-3">Tools</h3>
                             <ul className="text-brand-shadow text-xs md:text-base space-y-1">
                               {sectionContent.projectInfo.tools.map((tool, index) => (
                                 <li key={index}>{tool}</li>
                               ))}
                             </ul>
                           </div>
                           <div>
                             <h3 className="font-medium text-base md:text-2xl text-foreground mb-3">Duration</h3>
                             <p className="text-brand-shadow text-xs md:text-base">{sectionContent.projectInfo.duration}</p>
                           </div>
                           <div>
                             <h3 className="font-medium  text-base md:text-2xl text-foreground mb-3">Funds</h3>
                             <p className="text-brand-shadow text-xs md:text-base">{sectionContent.projectInfo.funds}</p>
                           </div>
                         </div>
                       </div>
                     )}
                     {sectionContent?.timeline && (
                       <div className="pt-8">
                         <div className="relative flex items-start justify-between">
                           {/* Background connecting line */}
                           <div className="absolute top-4 lg:top-[33.34px] left-0 right-0 h-0.5 bg-brand-grey z-0" style={{ left: '1rem', right: '1rem' }} />
                           
                           {sectionContent.timeline.map((item, index) => (
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
                           {sectionContent.analysisTables.map((table, tableIndex) => (
                             <div key={tableIndex} className="rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
                               <div className="p-4 border-b border-gray-200 bg-gray-50">
                                 <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
                                   <span>{table.icon}</span>
                                   {table.title}
                                 </h3>
                               </div>
                               <div className="overflow-x-auto w-full scrollbar-none">
                                 <table className="w-full min-w-[600px] table-fixed">
                                   <thead>
                                     <tr className="bg-gray-50">
                                       <th className="px-4 py-3 text-left text-xs md:text-base font-medium text-gray-700 sticky left-0 bg-gray-50 z-10 w-32">Feature</th>
                                       {table.columns.map((column, colIndex) => (
                                         <th key={colIndex} className="px-4 py-3 text-center text-xs md:text-base font-medium text-gray-700">
                                           {column}
                                         </th>
                                       ))}
                                     </tr>
                                   </thead>
                                   <tbody>
                                     {table.rows.map((row, rowIndex) => (
                                       <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                         <td className="px-4 py-3 text-xs md:text-base font-medium text-gray-900 sticky left-0 bg-inherit z-10 w-32">{row.feature}</td>
                                         {row.values.map((value, valueIndex) => (
                                           <td key={valueIndex} className="px-4 py-3 text-xs md:text-base text-center text-gray-700">
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
