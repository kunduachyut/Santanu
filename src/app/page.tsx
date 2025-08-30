import HeroSection from "../components/HeroSection"
import HeroWithFooter from "../components/HeroWithFooter"
import TrustedBySection from "../components/TrustedBySection"
import IntegrateSection from "../components/IntegrateSection"
import CollaborationSection from "../components/CollaborationSection"
import Testimonials from "../components/Testimonials"
import ScaleSection from "../components/ScaleSection"
import PublishSection from "../components/PublishSection"
import PublishAnywhere from "../components/PublishAnywhere"

export default function Home() {
  return (
    <section className="space-y-3">
      <HeroSection/>
      <TrustedBySection/>
      <IntegrateSection/>
      <PublishSection/>
      <CollaborationSection/>
      <PublishAnywhere/>
      <ScaleSection/>
      <Testimonials/>
      <HeroWithFooter/>
    </section>
  );
}
