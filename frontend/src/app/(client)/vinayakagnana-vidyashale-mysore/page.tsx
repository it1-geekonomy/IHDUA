import HeroBanner from "@/shared/components/Herobanner";
import FeatureHighlightSection from "@/shared/components/Featurehighlightsection ";
import OpportunitiesSection from "@/shared/components/OpportunitiesSection";
import StoryLeftImageSection from "@/shared/components/StoryLeftImageSection";
import CommunityStorySection from "@/shared/components/CommunityStorySection";
import StatsStrip from "@/shared/components/StatsStrip";
import NewsletterSection from "@/shared/components/Newsletter";
import {
  VINAYAKA_HERO,
  VINAYAKA_HEADER,
  VINAYAKA_STORIES,
  VINAYAKA_COMMUNITY_STORY,
  VINAYAKA_STATS,
} from "@/domains/impact/education/constants/vinayakaSchool";

export default function VinayakAgnanaVidyashalePage() {
  const [story1, story2] = VINAYAKA_STORIES;

  return (
    <main className="w-full">
      <HeroBanner
        heading={VINAYAKA_HERO.heading}
        description={VINAYAKA_HERO.description}
        image={VINAYAKA_HERO.image}
        imageMobile={VINAYAKA_HERO.imageMobile}
        imageAlt={VINAYAKA_HERO.imageAlt}
      />

      <FeatureHighlightSection
        label={VINAYAKA_HEADER.eyebrow}
        heading={VINAYAKA_HEADER.title}
        description={VINAYAKA_HEADER.description}
        button={{ label: VINAYAKA_HEADER.buttonText, href: VINAYAKA_HEADER.websiteUrl, external: false }}
        items={[...VINAYAKA_HEADER.highlights]}
      />

      {/* Story 1: Text left, image right */}
      <OpportunitiesSection
        heading={story1.title}
        descriptions={[...story1.paragraphs]}
        image={story1.image}
        imageAlt={story1.imageAlt}
      />

      {/* Story 2: Image left, text right with View All Photos button */}
      <StoryLeftImageSection
        heading={story2.title}
        descriptions={[...story2.paragraphs]}
        image={story2.image}
        imageAlt={story2.imageAlt}
        button={{
          label: story2.ctaText,
          href: "/vinayakagnana-vidyashale-mysore/gallery",
        }}
      />

      {/* Story 3: Building Foundations for the Future */}
      <CommunityStorySection
        title={VINAYAKA_COMMUNITY_STORY.title}
        paragraphs={[...VINAYAKA_COMMUNITY_STORY.paragraphs]}
        image={VINAYAKA_COMMUNITY_STORY.image}
        imageAlt={VINAYAKA_COMMUNITY_STORY.imageAlt}
        featureCard={VINAYAKA_COMMUNITY_STORY.featureCard}
      />
      <StatsStrip items={[...VINAYAKA_STATS]} />
      <NewsletterSection />
    </main>
  );
}