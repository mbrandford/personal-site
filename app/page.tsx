"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const projectRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const lastActiveProjectRef = useRef<{
    id: string;
    title: string;
    description: string;
    mediaSrc: string;
  } | null>(null);

  const projectsData = [
    {
      year: "2025",
      items: [
        {
          id: "2025-figma-make",
          title: "Figma Make",
          description:
            "How can Figma Make stand out in a quickly-shifting landscape of prompt-to-prototype AI tools? I ran a global study shortly after launch to map awareness, adoption, and perceptions across the competitive set, then built the positioning framework for Product and Marketing to resonate with new users and inflect growth.",
          mediaSrc: "/projects/figma-make.mov",
        },
        {
          id: "2025-figma-sites",
          title: "Figma Sites",
          description:
            "How should we think about Figma Sites' growth beyond experienced designers? I led market analysis and concept testing with new audiences to surface gaps and differentiators versus key competitors, then mapped a long-term framework for competing and standing apart in the category.",
          mediaSrc: "/projects/figma-sites.mov",
        },
      ],
    },
    {
      year: "2024",
      items: [
        {
          id: "2024-brand-tracker",
          title: "Figma brand tracker",
          description:
            "What does Figma's target audience think about our brand? I lead Figma's ongoing brand tracker to measure perceptions across priority roles. The narratives serve as a company-wide signal of Figma's place in the hearts and minds of product builders and guide where we invest next.",
          mediaSrc: "/projects/figma-brand.mp4",
        },
        {
          id: "2024-figma-slides",
          title: "Figma Slides",
          description:
            "Where does Figma's Slides tool fit in a market with juggernaut incumbents and innovative upstarts? I led product strategy and positioning for the launch of Figma Slides, building on research into audience needs and the competitive landscape across the full development arc, from early concept to enterprise-grade product.",
          mediaSrc: "/projects/figma-slides.mov",
        },
        {
          id: "2024-figjam",
          title: "FigJam",
          description:
            "How should FigJam serve users after the COVID-era expansion of whiteboard tools? I steered strategy and investment decisions by leading research with enterprise teams and buyers on the whiteboard landscape and purchasing patterns. This work identified differentiation opportunities, strengthened Sales enablement, and informed product focus areas that resonate with target customers.",
          mediaSrc: "/projects/figjam.mp4",
        },
      ],
    },
    {
      year: "2023",
      items: [
        {
          id: "2023-dev-mode",
          title: "Dev Mode",
          description:
            "How should we pitch and position our first developer-oriented product? I spearheaded Dev Mode positioning and Sales strategy ahead of launch by running concept tests with designer and developer audiences and iterating on messaging to increase clarity, credibility, and relevance for new users.",
          mediaSrc: "/projects/dev-mode.mov",
        },
      ],
    },
    {
      year: "2022",
      items: [
        {
          id: "2022-figma-com",
          title: "Figma.com",
          description:
            "How can we evolve our marketing site to better resonate with leads and convert prospects into users? I supported the Figma.com rebuild by running research sessions with target audiences to shape information hierarchy, language, and page flows, improving how the site communicates core value and drives conversion.",
          mediaSrc: "/projects/figmadotcom.mov",
        },
      ],
    },
    {
      year: "2021",
      items: [
        {
          id: "2021-nike",
          title: "Nike.com search",
          description:
            "What additional value can we deliver to shoppers through search? I led a cross-functional team across Engineering, Design, and Data Science to roadmap and ship improved results for the most common search intents.",
          mediaSrc: "/projects/nike-search.mov",
        },
      ],
    },
    {
      year: "2020",
      items: [
        {
          id: "2020-waze",
          title: "Waze",
          description:
            "What should Waze consider as it prepares to launch its carpool service internationally? I drove foundational audience and market understanding by developing global segmentation and a GTM strategy. I conducted interviews across three countries and ran a 12k-person survey to quantify needs and opportunity.",
          mediaSrc: "/projects/waze.mov",
        },
      ],
    },
    {
      year: "2019",
      items: [
        {
          id: "2019-google-assistant",
          title: "Google Assistant",
          description:
            "How can Google grow and differentiate its AI assistant against first-movers Alexa and Siri? I identified the value propositions and use cases that resonated most for Google Assistant relative to competitors, ran 30+ creative focus groups across the US, and synthesized the work into a positioning report delivered to the VP of Global Marketing.",
          mediaSrc: "/projects/google-assistant.mov",
        },
      ],
    },
    {
      year: "2018",
      items: [
        {
          id: "2018-google-cloud",
          title: "Google Cloud",
          description:
            "How can Google Cloud compete against Microsoft Azure and AWS? I created international sales enablement strategy and competitive positioning for Google Cloud. I conducted ~80 customer interviews, then translated findings into a field narrative adopted by Sales teams across North America and EMEA.",
          mediaSrc: "/projects/google-cloud.mov",
        },
      ],
    },
  ];

  useEffect(() => {
    const findActiveProject = () => {
      const scrollY = window.scrollY;
      
      // Check if we should hide based on scroll position
      if (scrollY < 100) {
        setHasScrolled(false);
        setActiveProjectId(null);
        return;
      }
      
      // Enable highlighting once scrolled past 150px
      if (scrollY > 150 && !hasScrolled) {
        setHasScrolled(true);
      }
      
      // Don't find active project until we've scrolled enough
      if (!hasScrolled && scrollY <= 150) {
        return;
      }

      // Define the "active zone" in the center of the viewport
      const viewportHeight = window.innerHeight;
      const zoneTop = viewportHeight * 0.3; // Zone starts 30% down from top
      const zoneBottom = viewportHeight * 0.7; // Zone ends 70% down from top
      const zoneCenter = (zoneTop + zoneBottom) / 2;

      let closestProjectId: string | null = null;
      let closestDistance = Infinity;
      let anyProjectInView = false;

      // Check each project to see which one is closest to the zone center
      projectRefs.current.forEach((element, id) => {
        const rect = element.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        
        // Calculate distance from element center to zone center
        const distance = Math.abs(elementCenter - zoneCenter);
        
        // Check if the element is at least partially in the zone
        const isInZone = rect.bottom > zoneTop && rect.top < zoneBottom;
        
        // Check if any project is still visible above the fold
        if (rect.bottom > 0) {
          anyProjectInView = true;
        }
        
        if (isInZone && distance < closestDistance) {
          closestDistance = distance;
          closestProjectId = id;
        }
      });

      // Check if the last project has scrolled above the viewport center
      const lastProjectElement = Array.from(projectRefs.current.values()).pop();
      if (lastProjectElement) {
        const lastRect = lastProjectElement.getBoundingClientRect();
        const viewportCenter = viewportHeight / 2;
        
        // Hide video when the last project's bottom edge goes above viewport center
        if (lastRect.bottom < viewportCenter) {
          setActiveProjectId(null);
          return;
        }
      }

      if (closestProjectId && closestProjectId !== activeProjectId) {
        setActiveProjectId(closestProjectId);
      } else if (!closestProjectId && activeProjectId !== null) {
        // Hide video if no project is in the active zone
        setActiveProjectId(null);
      }
    };

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        findActiveProject();
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Run once on mount in case user refreshes mid-scroll
    findActiveProject();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [activeProjectId, hasScrolled]);

  // Mobile footer observer to hide sticky headers when footer is visible
  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsFooterVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
      }
    );

    observer.observe(footerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const setProjectRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) {
      projectRefs.current.set(id, el);
    } else {
      projectRefs.current.delete(id);
    }
  };

  const activeProject = projectsData
    .flatMap((group) => group.items)
    .find((item) => item.id === activeProjectId);

  // Update lastActiveProjectRef whenever we have an active project
  if (activeProject) {
    lastActiveProjectRef.current = activeProject;
  }

  // Use the last active project for display to allow fade-out animation
  const displayProject = activeProject || lastActiveProjectRef.current;

  return (
    <main className="min-h-screen w-full bg-white lg:bg-[linear-gradient(to_bottom,white_0%,white_75%,#fef7f7_85%,#fce7f3_92%,#f9a8d4_100%)] text-neutral-900 flex flex-col">
      {/* Desktop Layout */}
      <div className="hidden lg:block relative max-w-[1600px] mx-auto w-full">
        <div className="max-w-xl px-6 pt-16 pb-12 space-y-12 flex-grow" style={{ marginLeft: 'clamp(10px, 12vw, 200px)' }}>
          {/* Name */}
          <header className="space-y-2">
            <h1 className="text-sm font-medium tracking-tight">Marcus Brandford</h1>
          </header>

          {/* About */}
          <section className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              About
            </h2>
            <p className="text-lg md:text-xl leading-relaxed text-neutral-800">
              I'm an interdisciplinary researcher helping chart the path forward for disruptive tech
              products. I lead end-to-end studies around product, marketing, and business
              questions to uncover opportunities and drive company strategy.
            </p>
          </section>

          {/* Social Links */}
          <div className="flex gap-4 text-sm text-neutral-500 -mt-6">
            <a
              href="mailto:brandford.m@gmail.com"
              className="underline underline-offset-2 hover:text-neutral-700"
            >
              email
            </a>
            <a
              href="https://x.com/marcusxcb"
              className="underline underline-offset-2 hover:text-neutral-700"
              target="_blank"
              rel="noreferrer"
            >
              twitter
            </a>
            <a
              href="https://www.linkedin.com/in/marcusbrandford/"
              className="underline underline-offset-2 hover:text-neutral-700"
              target="_blank"
              rel="noreferrer"
            >
              linkedin
            </a>
          </div>

          {/* Divider */}
          <div className="py-8 text-neutral-500 text-sm">
            ////////////////
          </div>

          {/* Projects */}
          <section className="space-y-3 mt-8">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              Projects
            </h2>

            <div className="space-y-10">
              {projectsData.map((group) => (
                <div
                  key={group.year}
                  className="grid grid-cols-[76px_1fr] gap-6"
                >
                  {/* Sticky year */}
                  <div className="sticky top-6 self-start">
                    <div className="text-sm font-medium text-neutral-500">
                      {group.year}
                    </div>
                  </div>

                  {/* Entries */}
                  <div className="space-y-8">
                    {group.items.map((p) => {
                      const isActive = activeProjectId === p.id;
                      return (
                        <div
                          key={p.id}
                          ref={setProjectRef(p.id)}
                          data-project-id={p.id}
                          className="space-y-1"
                        >
                          <div
                            className={`text-sm font-medium transition-colors duration-300 ease-out ${
                              isActive ? "text-black" : "text-neutral-500"
                            }`}
                          >
                            {p.title}
                          </div>
                          <p
                            className={`text-sm transition-colors duration-300 ease-out ${
                              isActive ? "text-black" : "text-neutral-400"
                            }`}
                          >
                            {p.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom spacer for scrolling */}
          <div className="h-[40rem]"></div>
        </div>

        {/* Sticky video panel for desktop */}
        <div className={`fixed top-[35vh] w-[280px] lg:w-[320px] xl:w-[400px] transition-opacity duration-500 ease-in-out pointer-events-none ${activeProject ? 'opacity-100' : 'opacity-0'}`} style={{ left: 'clamp(650px, 50% + 150px, calc(50% + 250px))' }}>
          {displayProject && (
            <div className="rounded-lg overflow-hidden shadow-sm">
              <video
                key={displayProject.id}
                src={displayProject.mediaSrc}
                className="w-full h-auto"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout with Single Scroll */}
      <div className="lg:hidden snap-y snap-mandatory overflow-y-scroll bg-[#f9a8d4]" style={{ height: '100dvh', overscrollBehaviorY: 'none' }}>
        {/* Sticky Name Header */}
        <div className={`sticky top-0 z-20 bg-white px-6 py-2 transition-opacity duration-300 ${isFooterVisible ? 'opacity-0' : 'opacity-100'}`}>
          <h1 className="text-sm font-medium tracking-tight">Marcus Brandford</h1>
        </div>

        {/* Header Section */}
        <div className="snap-start min-h-[100dvh] px-6 pt-16 pb-12 space-y-12 flex flex-col justify-center bg-white">
          {/* About */}
          <section className="space-y-2">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
              About
            </h2>
            <p className="text-lg leading-relaxed text-neutral-800">
              I'm an interdisciplinary researcher helping chart the path forward for disruptive tech
              products. I lead end-to-end studies around product, marketing, and business
              questions to uncover opportunities and drive company strategy.
            </p>
          </section>

          {/* Social Links */}
          <div className="flex gap-4 text-sm text-neutral-500">
            <a
              href="mailto:brandford.m@gmail.com"
              className="underline underline-offset-2 hover:text-neutral-700"
            >
              email
            </a>
            <a
              href="https://x.com/marcusxcb"
              className="underline underline-offset-2 hover:text-neutral-700"
              target="_blank"
              rel="noreferrer"
            >
              twitter
            </a>
            <a
              href="https://www.linkedin.com/in/marcusbrandford/"
              className="underline underline-offset-2 hover:text-neutral-700"
              target="_blank"
              rel="noreferrer"
            >
              linkedin
            </a>
          </div>

          {/* Divider */}
          <div className="py-8 text-neutral-500 text-sm">
            ////////////////
          </div>
        </div>

        {/* Sticky Projects Header */}
        <div className={`sticky top-[34px] z-10 bg-white px-6 py-2 transition-opacity duration-300 ${isFooterVisible ? 'opacity-0' : 'opacity-100'}`}>
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
            Projects
          </div>
        </div>

        {/* Projects by Year */}
        {projectsData.map((group) => (
          <div key={group.year}>
            {/* Sticky Year Header */}
            <div className={`sticky top-[68px] z-[5] bg-white px-6 py-2 transition-opacity duration-300 ${isFooterVisible ? 'opacity-0' : 'opacity-100'}`}>
              <div className="text-sm font-medium text-neutral-500">
                {group.year}
              </div>
            </div>
            
            {/* Year's Projects */}
            {group.items.map((project) => (
              <div
                key={project.id}
                className="snap-start min-h-[100dvh] flex flex-col justify-center py-4 bg-white"
              >
                {/* Video Section */}
                <div className="flex items-center justify-center px-6 mb-4">
                  <div className="w-full max-w-md">
                    <video
                      src={project.mediaSrc}
                      className="w-full h-auto rounded-lg shadow-lg"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                </div>

                {/* Text Section */}
                <div className="px-6 space-y-3">
                  <h3 className="text-xl font-medium text-black">
                    {project.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
        
        {/* Gradient footer spacer */}
        <div ref={footerRef} className="snap-start min-h-[100dvh] bg-[linear-gradient(to_bottom,white_0%,#fef7f7_25%,#fce7f3_50%,#f9a8d4_100%)]"></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </main>
  );
}
