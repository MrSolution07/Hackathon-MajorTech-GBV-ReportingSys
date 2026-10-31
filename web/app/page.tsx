import { ContactSection } from "@/components/ContactSection";
import { DemoSection } from "@/components/DemoSection";

const facts = [
  { place: "World", figure: "1 in 3", text: "Women, in their lifetime, have faced physical or sexual violence.", href: "https://www.who.int/news-room/fact-sheets/detail/violence-against-women", label: "WHO" },
  { place: "World", figure: "38%", text: "Of women online had experienced online violence. 85% had witnessed it.", href: "https://www.unwomen.org/en/articles/faqs/digital-abuse-trolling-stalking-and-other-forms-of-technology-facilitated-violence-against-women", label: "UN Women" },
  { place: "World", figure: "16–58%", text: "The range across studies. They do not measure the same thing.", href: "https://www.unwomen.org/en/articles/faqs/digital-abuse-trolling-stalking-and-other-forms-of-technology-facilitated-violence-against-women", label: "UN Women" },
  { place: "Africa", figure: "28%", text: "Of women in a five-country sub-Saharan study reported online violence.", href: "https://www.unwomen.org/en/articles/faqs/digital-abuse-trolling-stalking-and-other-forms-of-technology-facilitated-violence-against-women", label: "UN Women" },
  { place: "South Africa", figure: "43%", text: "Of secondary-school girls in one Gqeberha study, past year. 11% in primary. One city.", href: "https://doi.org/10.3389/fgwh.2025.1546901", label: "Hartmann et al." },
  { place: "South Africa", figure: "3 a day", text: "Women killed by an intimate partner, 2020/21.", href: "https://www.samrc.ac.za/sites/default/files/attachments/2024-10/FemicideBrief2024_0.pdf", label: "SAMRC" },
  { place: "South Africa", figure: "43,292", text: "Domestic-violence cases withdrawn, of 169,462 opened from Jan 2024 to Mar 2025.", href: "https://pmg.org.za/committee-question/32649/", label: "Parliament" },
];

export default function Page() {
  return (
    <main className="page">
      <nav className="nav" aria-label="Main">
        <a className="brand" href="#top">
          <span className="mark">S</span>
          SafeStep
        </a>
        <a href="#numbers">Numbers</a>
        <a href="#how">How</a>
        <a href="#lines">Safety</a>
        <a href="#demo">Demo</a>
        <a href="#contact">Contact</a>
        <a className="pill" href="tel:0800428428">0800 428 428</a>
      </nav>

      <header className="hero" id="top">
        <span className="loc">South Africa</span>
        <h1>The file still exists on Monday.</h1>
        <p className="lede">
          Hold what happened. See the pattern in a message. Choose the next step. Nothing is sent unless she sends it.
        </p>
        <div className="actions">
          <a className="pill" href="#numbers">See the numbers</a>
          <a className="ghost" href="tel:0800428428">Call the Command Centre</a>
        </div>
      </header>

      <section className="section" id="numbers">
        <h2>What the numbers say</h2>
        <p>World first, then South Africa. Each figure keeps its own study.</p>
        <div className="facts">
          {facts.map((fact) => (
            <article key={fact.figure + fact.label}>
              <strong>{fact.figure}</strong>
              <p>{fact.text}</p>
              <a href={fact.href}>{fact.place} · {fact.label}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="how">
        <h2>What she does</h2>
        <div className="steps">
          <article>
            <b>1</b>
            <p>She writes what happened and pastes the message.</p>
          </article>
          <article>
            <b>2</b>
            <p>A check names the pattern. It says when it is unsure.</p>
          </article>
          <article>
            <b>3</b>
            <p>She calls, reports, or shares. The app does not choose.</p>
          </article>
        </div>
        <aside className="device" aria-label="Sample incident">
          <div className="device-bar" />
          <div className="screen">
            <p className="kicker">Sample. Not a real person.</p>
            <h3>Harassment</h3>
            <p>A classmate threatened to send pictures to her mother.</p>
            <div className="line"><span>Her words</span>I know your class. Post it or I send the pictures to your mother.</div>
            <div className="line"><span>Signal</span>Threat, coercion. Not a legal finding.</div>
          </div>
        </aside>
      </section>

      <section className="section" id="lines">
        <h2>Who pays</h2>
        <p>
          She does not. A campus, an employer, or a shelter pays for a desk and for counts she opts into. No ads. No sale of records. No fee on the call.
        </p>
        <div className="lines">
          <a href="tel:0800428428">GBV Command Centre 0800 428 428</a>
          <a href="tel:10111">SAPS 10111</a>
          <a href="tel:10177">Ambulance 10177</a>
          <a href="tel:116">Childline 116</a>
        </div>
      </section>

      <DemoSection />
      <ContactSection />

      <footer>
        April to December 2024: 2,884 women murdered, 31,303 rapes, 75,944 domestic-violence crimes against women.{" "}
        <a href="https://www.parliament.gov.za/storage/app/media/Pages/2025/12-08-2025_Womens_Parliament/Research_Papers/Fact_sheet_on_GBVF.pdf">Parliament fact sheet</a>
        . These counts are not added together.
      </footer>
    </main>
  );
}
