import { Home2PersonalityExperience } from "./Home2PersonalityExperience";

/**
 * /home3 starts as an exact visual baseline of the currently approved Home2.
 *
 * Important: do not modify Home2 files to evolve Home3. New experiments must be
 * added behind this wrapper (or Home3-specific descendants/styles) so /home2
 * remains frozen while the WCRIA + Doğukan + Suprema + Prime2B synthesis evolves.
 */
export function Home3MixExperience() {
  return (
    <div className="home3-mix-shell" data-home3-baseline="home2-approved">
      <Home2PersonalityExperience />
    </div>
  );
}
