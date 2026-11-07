import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import OpportunitiesSection from "@/shared/components/OpportunitiesSection";
import StoryLeftImageSection from "@/shared/components/StoryLeftImageSection";
import CommunityStorySection from "@/shared/components/CommunityStorySection";
import StatsStrip from "@/shared/components/StatsStrip";
import InitiativeSupport from "@/shared/components/InitiativeSupport";
import WomenOpportunities from "@/shared/components/WomenOpportunities";
import SkillsTogether from "@/shared/components/SkillsTogether";
import ImpactStats from "@/shared/components/ImpactStats";
import AwarenessGallery from "@/shared/components/AwarenessGallery";
import Videosection from "@/shared/components/Videosection";
import GallerySection from "@/shared/components/Gallerysection";
import GallerySection1Row from "@/shared/components/Gallerysection1row";
import Typography from "@/lib/Typography";

export type ImpactLayout =
  | "education"
  | "women_empowerment"
  | "skills_employment"
  | "model_village"
  | "health";

export interface ImpactPageData {
  layoutType: ImpactLayout;
  slug: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;
  heroImageMobile: string;
  content: Record<string, unknown>;
}

type Json = Record<string, unknown>;

/** Shown wherever an image hasn't been uploaded yet, so unfinished pages still render. */
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#EDE7F1"/><text x="50%" y="50%" fill="#9A8FA3" font-family="sans-serif" font-size="28" text-anchor="middle" dominant-baseline="middle">Image</text></svg>',
  );

const obj = (v: unknown): Json | null =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Json) : null;
const str = (v: unknown, fallback = "") => (typeof v === "string" && v.trim() ? v.trim() : fallback);
const img = (v: unknown) => str(v, PLACEHOLDER_IMAGE);
const list = (v: unknown): Json[] => (Array.isArray(v) ? v.map(obj).filter((x): x is Json => x !== null) : []);
const paras = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((p): p is string => typeof p === "string" && p.trim() !== "") : [];
const photos = (v: unknown, alt: string) =>
  (Array.isArray(v) ? v : []).map((url, i) => ({ src: img(url), alt: `${alt} ${i + 1}` }));
const button = (v: unknown) => {
  const b = obj(v);
  const label = str(b?.label);
  if (!label) return undefined;
  const href = str(b?.href, "#");
  return { label, href, external: /^https?:\/\//.test(href) };
};

function Intro({ section }: { section: Json }) {
  return (
    <FeatureHighlightSection
      label={str(section.eyebrow) || undefined}
      heading={str(section.heading)}
      description={str(section.description) || undefined}
      button={button(section.button)}
      items={list(section.highlights).map((h) => ({
        icon: img(h.iconUrl),
        heading: str(h.heading),
        description: str(h.description) || undefined,
      }))}
    />
  );
}

function Story({ section, imageLeft, extraButton }: { section: Json; imageLeft?: boolean; extraButton?: { label: string; href: string } }) {
  const heading = str(section.heading);
  const props = {
    heading,
    descriptions: paras(section.paragraphs),
    image: img(section.image),
    imageAlt: heading,
  };
  if (imageLeft) {
    const b = button(section.button) ?? extraButton;
    return <StoryLeftImageSection {...props} button={b ? { ...b, href: b.href } : undefined} />;
  }
  return <OpportunitiesSection {...props} button={button(section.button)} />;
}

function Stats({ section, strip }: { section: Json; strip?: boolean }) {
  const stats = list(section.stats).map((s) => ({
    icon: img(s.iconUrl),
    iconBg: str(s.iconBg, "#F1E7F4"),
    value: str(s.value),
    label: str(s.label),
  }));
  if (strip) return <StatsStrip items={stats} />;
  return (
    <ImpactStats
      heading={str(section.heading, "The Impact We Make")}
      description={paras(section.paragraphs)}
      bannerHeading={str(section.bannerHeading, "Creating Lasting Change")}
      stats={stats}
    />
  );
}

function TwoImageStory({ section }: { section: Json }) {
  const heading = str(section.heading);
  return (
    <WomenOpportunities
      heading={heading}
      topDescription={str(section.topDescription)}
      images={photos(section.images, heading)}
      bottomDescription={str(section.bottomDescription)}
    />
  );
}

function FeatureGrid({ section }: { section: Json }) {
  return (
    <SkillsTogether
      label={str(section.eyebrow)}
      heading={str(section.heading)}
      descriptions={paras(section.paragraphs)}
      items={list(section.features).map((f) => ({
        icon: img(f.iconUrl),
        title: str(f.title),
        description: str(f.description),
      }))}
    />
  );
}

function TextBlock({ section }: { section: Json }) {
  return (
    <section className="w-full">
      <div className="w-full px-6 pt-6 lg:px-10 lg:pt-8 xl:pt-8 2xl:px-40">
        <div className="flex w-full flex-col gap-4 lg:gap-6">
          <div className="flex w-full flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            {str(section.eyebrow) && (
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
                <Typography variant="caption" className="font-bold font-figtree uppercase text-[#9739A8]">
                  {str(section.eyebrow)}
                </Typography>
                <span className="h-px w-6 bg-[#9739A8]" aria-hidden="true" />
              </div>
            )}
            <Typography variant="h3" className="w-full font-lora text-[#00191B]">
              {str(section.heading)}
            </Typography>
          </div>
          {paras(section.paragraphs).map((p, i) => (
            <Typography key={i} variant="body-lg" className="w-full font-figtree font-normal text-[#5F6C6D]">
              {p}
            </Typography>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationSections({ content, slug }: { content: Json; slug: string }) {
  const intro = obj(content.intro);
  const right = obj(content.storyImageRight);
  const left = obj(content.storyImageLeft);
  const community = obj(content.communityStory);
  const statsStrip = obj(content.statsStrip);
  const gallery = obj(content.gallery);
  const card = obj(community?.featureCard);
  const communityHeading = str(community?.heading);

  return (
    <>
      {intro && <Intro section={intro} />}
      {right && <Story section={right} />}
      {left && (
        <Story
          section={left}
          imageLeft
          extraButton={gallery ? { label: str(gallery.ctaLabel, "View All Photos"), href: `/${slug}/gallery` } : undefined}
        />
      )}
      {community && (
        <CommunityStorySection
          title={communityHeading}
          paragraphs={paras(community.paragraphs)}
          image={img(community.image)}
          imageAlt={communityHeading}
          featureCard={{
            icon: str(card?.iconUrl) || undefined,
            title: str(card?.title),
            description: str(card?.description),
          }}
        />
      )}
      {statsStrip && (
        <StatsStrip
          items={list(statsStrip.items).map((s) => ({ icon: img(s.iconUrl), value: str(s.value), label: str(s.label) }))}
        />
      )}
    </>
  );
}

function WomenSections({ content }: { content: Json }) {
  const intro = obj(content.intro);
  const overview = obj(content.overview);
  const how = obj(content.howItWorks);
  const featureGrid = obj(content.featureGrid);
  const stats = obj(content.impactStats);

  return (
    <>
      {intro && <Intro section={intro} />}
      {overview && <Story section={overview} />}
      {how && (
        <InitiativeSupport
          label={str(how.eyebrow)}
          heading={str(how.heading)}
          description={str(how.description)}
          steps={list(how.steps).map((s) => ({
            icon: str(s.iconUrl) || undefined,
            title: str(s.title),
            description: str(s.description),
          }))}
        />
      )}
      {list(content.twoImageStories).map((block, i) => (
        <TwoImageStory key={i} section={block} />
      ))}
      {featureGrid && <FeatureGrid section={featureGrid} />}
      {stats && <Stats section={stats} />}
    </>
  );
}

function SkillsSections({ content }: { content: Json }) {
  const intro = obj(content.intro);
  const overview = obj(content.overview);
  const video = obj(content.video);
  const twoImage = obj(content.twoImageStory);
  const featureGrid = obj(content.featureGrid);
  const stats = obj(content.impactStats);
  const gallery = obj(content.gallery);
  const videos = list(video?.videos).filter((v) => str(v.url));

  return (
    <>
      {intro && <Intro section={intro} />}
      {overview && <Story section={overview} />}
      {video && videos.length > 0 && (
        <Videosection
          heading={str(video.heading)}
          topDescription={paras(video.paragraphs)}
          videos={videos.map((v) => ({
            src: str(v.url),
            title: str(v.title),
            poster: str(v.poster) || undefined,
            type: str(v.url).toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4",
          }))}
          bottomDescription={paras(video.bottomParagraphs)}
        />
      )}
      {twoImage && <TwoImageStory section={twoImage} />}
      {featureGrid && <FeatureGrid section={featureGrid} />}
      {stats && <Stats section={stats} strip={str(stats.style) === "strip"} />}
      {gallery && str(gallery.displayMode, "inline") === "inline" && (
        <GallerySection1Row heading={str(gallery.heading, "Gallery")} images={photos(gallery.images, "Gallery photo")} />
      )}
    </>
  );
}

function VillageHealthSections({ content }: { content: Json }) {
  const intro = obj(content.intro);
  const textBlock = obj(content.textBlock);
  const grid = obj(content.imageGrid);
  const stats = obj(content.impactStats);
  const gridHeading = str(grid?.heading);

  return (
    <>
      {intro && <Intro section={intro} />}
      {textBlock && <TextBlock section={textBlock} />}
      {grid && (
        <AwarenessGallery heading={gridHeading} descriptions={paras(grid.paragraphs)} images={photos(grid.images, gridHeading)} />
      )}
      {stats && <Stats section={stats} />}
    </>
  );
}

/** Renders an impact page from its CMS data with the website's own section components. */
export function ImpactPageView({ data }: { data: ImpactPageData }) {
  const { content } = data;
  const heroImage = img(data.heroImage);

  return (
    <>
      <HeroBanner
        heading={data.heroTitle}
        description={data.heroDescription}
        image={heroImage}
        imageMobile={str(data.heroImageMobile, heroImage)}
        imageAlt={data.heroTitle}
      />
      {data.layoutType === "education" && <EducationSections content={content} slug={data.slug} />}
      {data.layoutType === "women_empowerment" && <WomenSections content={content} />}
      {data.layoutType === "skills_employment" && <SkillsSections content={content} />}
      {(data.layoutType === "model_village" || data.layoutType === "health") && (
        <VillageHealthSections content={content} />
      )}
    </>
  );
}

/** Education galleries, and Skills galleries set to "Separate gallery page", live at /{slug}/gallery. */
export function hasGalleryPage(data: ImpactPageData): boolean {
  const gallery = obj(data.content.gallery);
  if (!gallery) return false;
  if (data.layoutType === "education") return true;
  return data.layoutType === "skills_employment" && str(gallery.displayMode) === "page";
}

export function ImpactGalleryView({ data }: { data: ImpactPageData }) {
  const gallery = obj(data.content.gallery);
  if (!gallery || !hasGalleryPage(data)) return null;
  return <GallerySection heading={str(gallery.heading, "Gallery")} images={photos(gallery.images, "Gallery photo")} />;
}
