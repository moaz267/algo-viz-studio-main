import HeroSection from "@/components/landing/HeroSection";
import ConceptsSection from "@/components/landing/ConceptsSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import VisualizationPreview from "@/components/landing/VisualizationPreview";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FooterSection from "@/components/landing/FooterSection";

const Index = () => {
  return (
    <main className="relative bg-background overflow-x-hidden">
      <HeroSection />
      <ConceptsSection />
      <ComparisonSection />
      <HowItWorksSection />
      <VisualizationPreview />
      <FooterSection />
    </main>
  );
};

export default Index;
