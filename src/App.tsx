import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";

type Resource = {
  id: number;
  section_id?: number;
  label: string;
  url: string;
  blurb?: string;
  position?: number;
};

type Section = {
  id: number;
  slug: string;
  title: string;
  description?: string;
  resources?: Resource[];
};

const sections: Section[] = [
  {
    id: "why",
    title: "Saab Parts & Service Still Exist",
    description: (
      <>
        <p>
          Saab Automobile AB isn&apos;t building cars right now, but the worldwide installed base is large (almost 1 million cars!)
          and the enthusiast community is extremely active.
        </p>
        <p>
          More importantly, the former Saab Parts AB (formerly Orio AB), now Hedin Parts &amp; Logistics AB (
          <a href="http://saabparts.com" target="_blank" rel="noopener">
            saabparts.com
          </a>
          ) is alive and well — and working to ensure availability of genuine Saab spare parts for the long term. You can also
          find one of over a hundred
          <a href="https://saabparts.com/us/book-a-service/" target="_blank" rel="noopener">
            Official Service Centers
          </a>{" "}
          closest to you.
        </p>
        <p>As a result, most of your searches for parts will end at step 1 or 2.</p>
        <p>
          This page is hosted by the <a href="http://www.saabclub.com" target="_blank" rel="noopener">Saab Club of North America</a>.
          Please consider becoming a <a href="https://saabclub.com/join/" target="_blank" rel="noopener">member</a> if this
          resource was helpful. Thanks to Jim Hickstein for starting this site.
        </p>
        <div className="callout">
          <b>Mythbusting:</b> Saab parts are not unobtainable or unaffordable. Saabs cost less to run than most comparable
          European cars, often being simpler, with fewer cylinders, and with GM-shared parts which bring the price of ownership
          down. Plus, most
          <a href="https://saabparts.com/us/book-a-service/" target="_blank" rel="noopener">
            Official Service Centers
          </a>{" "}
          labor rates are well below new-car dealership rates.
        </div>
      </>
    ),
  },
  {
    id: "part-numbers",
    title: "Step 1 — Identify the correct part number",
    description: (
      <>
        <p>
          Most suppliers can translate your description into a 7- or 8-digit Saab part number (p/n), but it pays to find it
          yourself — if only to compare. If you&apos;ve ever wondered what the cryptic 7- or 8-digit codes on Saab parts are, now
          you know! Go down the rabbit hole too deep, and you&apos;ll find yourself memorizing them.
        </p>
        <h3>Helpful resources for the advanced Saab owner</h3>
        <div className="two">
          <div>
            <h3>Factory tools</h3>
            <ul>
              <li>
                <a href="https://saabwisonline.com" target="_blank" rel="noopener">
                  WIS (Workshop Information System)
                </a>{" "}
                — factory repair/service documentation.
              </li>
              <li>
                <a href="https://esaabparts.com" target="_blank" rel="noopener">
                  Saab EPC (Electronic Parts Catalog)
                </a>{" "}
                — factory diagrams &amp; part numbers (link redirects to eSaabParts, which roughly uses the EPC for navigation).
              </li>
            </ul>
          </div>
          <div>
            <h3>Older manuals (selected)</h3>
            <ul>
              <li>
                <a href="/9000/">Saab 9000 manual project</a> (site-local link)
              </li>
              <li>
                <a href="http://www.saabnet.com/tsn/faq/manuals/" target="_blank" rel="noopener">
                  Classic 900 &amp; older manuals
                </a>
              </li>
            </ul>
          </div>
        </div>
      </>
    ),
    details: [
      {
        id: "ordering-rules",
        summary: "Ordering rules that prevent mistakes (read this)",
        content: (
          <ul>
            <li>
              When you can, don&apos;t only provide the part number — also provide full vehicle details (engine, transmission,
              trim, options). Saab Parts
              <a href="https://saabparts.com/us/mysaabcar-online/saab-original-vin-decoder/" target="_blank" rel="noopener">
                (VIN decoder)
              </a>{" "}
              and
              <a href="http://esaabparts.com" target="_blank" rel="noopener">
                eSaabParts
              </a>
              also have VIN decoders, where you can find out all of the relevant details of your vehicle, such as suspension
              type, brake disc size, options, colors, and more.
            </li>
            <li>
              Some parts vary by options you wouldn’t expect (heated/folding/auto-dimming mirrors, etc.).
            </li>
            <li>
              Some parts have special codes (springs/shocks). You can often find these codes listed on the sticker in the
              driver&apos;s front door jamb. Brake components often require physical measurement.
            </li>
            <li>
              Part numbers can be superseded — search using both the old and new numbers. eSaabParts often lists all of the
              part numbers associated with a part.
            </li>
            <li>Make the seller tell you the part number, and ask whether it differs from what you expected.</li>
          </ul>
        ),
      },
      {
        id: "search-trick",
        summary: "Fast discovery trick: “Saab + part number” search",
        content: (
          <>
            <p>Try searching Google for:</p>
            <p className="mono">
              <code>saab 12786412</code> (example) — try with and without spaces/hyphens.
            </p>
            <p>
              This can uncover compatible cross-references (e.g., Bosch equivalents). Use judgment; sometimes “cheap” versions
              omit seals/rings or have quality issues.
            </p>
          </>
        ),
      },
    ],
  },
  {
    id: "new",
    title: "Step 2 — Where to buy new and/or OEM parts (entire model range)",
    description: (
      <>
        <p>
          Consider buying new, genuine Saab parts when possible. They&apos;re guaranteed to work. The warranty is 3 months/36,000
          miles for parts and labor if installed by an Official Service Center.
        </p>
        <p>
          <a href="http://saabparts.com" target="_blank" rel="noopener">
            Hedin
          </a>{" "}
          maintains a list of
          <a href="https://saabparts.com/us/book-a-service/" target="_blank" rel="noopener">
            Official Service Centers
          </a>{" "}
          (OSCs) and affiliated parts retailers. You can also find one of over a hundred
          <a href="https://saabparts.com/us/book-a-service/" target="_blank" rel="noopener">
            Official Service Centers
          </a>{" "}
          closest to you
          <a href="https://saabparts.com/us/book-a-service/" target="_blank" rel="noopener">
            here
          </a>
          . <b>Shop around</b>: prices vary, and some dealers have local stock when upstream is dry.
        </p>
      </>
    ),
    details: [
      {
        id: "oem-retailers",
        summary: "Top OEM-friendly retailers",
        content: (
          <ul>
            <li>
              <b>eSaabParts</b> — <a href="http://esaabparts.com" target="_blank" rel="noopener">eSaabParts.com</a> — often
              strong pricing; supports the
              <a href="https://www.saabmuseumusa.com/" target="_blank" rel="noopener">Saab Heritage Car Museum USA</a>.
            </li>
            <li>
              <b>eEuroParts</b> — <a href="http://eeuroparts.com" target="_blank" rel="noopener">eEuroParts.com</a> — OEM +
              aftermarket.
            </li>
            <li>
              <b>Saab Parts Counter</b> —
              <a href="http://www.saabpartscounter.com" target="_blank" rel="noopener">SaabPartsCounter.com</a> — Mitchell
              Saab, Simsbury, CT, USA. A long-standing, family-owned dealer committed to selling parts into the future.
            </li>
            <li>
              <b>Order Euro Parts</b> — <a href="http://www.ordereuroparts.com" target="_blank" rel="noopener">OrderEuroParts.com</a>
              — Schmelz Countryside, St Paul, MN, USA. Another long-standing dealer whose family is committed to Saab for the long
              haul.
            </li>
            <li>
              <b>Saab Parts Outlet</b> — <a href="https://outlet.saabparts.com" target="_blank" rel="noopener">outlet.saabparts.com</a>
              — Hedin Parts&apos;s own outlet store. There are great deals to be had here.
            </li>
            <li>
              <b>Vintage Parts</b> — <a href="https://www.vpartsinc.com/automobile/saab" target="_blank" rel="noopener">vpartsinc.com</a>
              — A few years back, Orio sold off a lot of inventory to Vintage Parts. You can often find parts out of stock on other
              sites here. This is not commonly known!
            </li>
          </ul>
        ),
      },
      {
        id: "independents",
        summary: "Independents (Saab specialty)",
        content: (
          <>
            <div className="callout">
              <b>MapTun Dealers:</b>
              <ul>
                <li>
                  <a href="http://www.maptun.com" target="_blank" rel="noopener">
                    MapTun
                  </a>{" "}
                  — performance parts.
                </li>
                <li>
                  <a href="https://www.europeanmotorsvc.com/maptun-parts-kits" target="_blank" rel="noopener">
                    European Motor Services
                  </a>{" "}
                  — PA. Authorized MapTun performance parts distributor.
                </li>
                <li>
                  <a href="https://swedespeede.com/collections/saab-tuning" target="_blank" rel="noopener">
                    SwedeSpeede
                  </a>{" "}
                  — MapTun tuning and performance parts.
                </li>
              </ul>
            </div>
            <ul>
              <li>
                <a href="http://www.rbmperformance.com" target="_blank" rel="noopener">
                  RBM Performance
                </a>{" "}
                — also <a href="https://www.rbmperformance.com/index.phtml?lng=EN" target="_blank" rel="noopener">(English)</a>.
              </li>
              <li>
                <a href="http://www.rmeuropean.com" target="_blank" rel="noopener">
                  RM European
                </a>{" "}
                — OEM &amp; aftermarket parts (multiple marques).
              </li>
              <li>
                <a href="http://www.schwedenteile.de" target="_blank" rel="noopener">
                  Schwedenteile
                </a>{" "}
                — Germany (Saab &amp; Volvo).
              </li>
              <li>
                <a href="http://stateofnine.com" target="_blank" rel="noopener">
                  State Of Nine
                </a>{" "}
                — emblems, covers, accessories.
              </li>
              <li>
                <a href="http://www.genuinesaab.com" target="_blank" rel="noopener">
                  Taliaferro Imports (GenuineSaab)
                </a>{" "}
                — bespoke suspension &amp; performance upgrades (note: "genuine Saab parts" vs "GenuineSaab" brand).
              </li>
              <li>
                <a href="http://fcpeuro.com" target="_blank" rel="noopener">
                  FCP Euro
                </a>{" "}
                — Saab plus many other marques.
              </li>
              <li>
                <a href="https://nordicspeed.com/" target="_blank" rel="noopener">
                  NordicSpeed
                </a>{" "}
                — performance items &amp; accessories. Canada-based.
              </li>
              <li>
                <a href="https://skandix.de/en/" target="_blank" rel="noopener">
                  Skandix
                </a>{" "}
                — some hard-to-find Saab parts.
              </li>
            </ul>
          </>
        ),
      },
      {
        id: "general-retail",
        summary: "Not Saab-specialty (but commonly used)",
        content: (
          <ul>
            <li>
              <a href="http://www.rockauto.com" target="_blank" rel="noopener">
                RockAuto
              </a>{" "}
              — good pricing; verify compatibility carefully.
            </li>
            <li>
              <a href="http://www.partsgeek.com" target="_blank" rel="noopener">
                PartsGeek
              </a>
            </li>
            <li>
              <a href="https://www.autohausaz.com/" target="_blank" rel="noopener">
                AutohausAZ
              </a>
            </li>
          </ul>
        ),
      },
    ],
  },
  {
    id: "used",
    title: "Step 3 — Where to buy used",
    description: (
      <p>
        Used parts are plentiful — especially through specialty Saab yards. Many offer warranties; ask before ordering.
      </p>
    ),
    details: [
      {
        id: "us-yards",
        summary: "United States (selected specialty yards)",
        content: (
          <ul>
            <li>
              MN (Elk River) — <a href="http://www.hansautopartsmn.com" target="_blank" rel="noopener">Hans</a>
            </li>
            <li>
              MN (Hanover) — <a href="https://www.ebay.com/str/mstraub592" target="_blank" rel="noopener">Hanover</a>
            </li>
            <li>
              WI (Centuria) — <a href="http://www.strandbergauto.com" target="_blank" rel="noopener">Strandberg</a>
            </li>
            <li>
              WI (Hustisford) —
              <a href="https://www.facebook.com/Country-Imports-161096427261660/" target="_blank" rel="noopener">
                Country Imports
              </a>
            </li>
            <li>
              IA (McIntire) — <a href="http://www.meyersaab.com" target="_blank" rel="noopener">Meyer Garage</a>
            </li>
            <li>
              MO (Kansas City) — <a href="https://www.avenueautoparts.com/" target="_blank" rel="noopener">Avenue Auto Wrecking</a>
            </li>
            <li>
              MI (New Haven) — <a href="https://www.9-3auto.com" target="_blank" rel="noopener">9-3 Auto</a>
            </li>
            <li>
              NY (Hastings) — <a href="http://www.goldwingsaabparts.com/" target="_blank" rel="noopener">Goldwing</a>
            </li>
            <li>
              CO (Boulder) — <a href="http://www.eosmotorsports.com" target="_blank" rel="noopener">EOS Motorsports</a>
            </li>
            <li>
              GA (Atlanta) —
              <a href="https://www.saabpartsconnection.com/" target="_blank" rel="noopener">
                Saab Parts Connection
              </a>
            </li>
            <li>
              PA —
              <a href="http://www.epartsland.com/collections/saab" target="_blank" rel="noopener">
                ePartsLand - European
              </a>
            </li>
            <li>
              MA (Athol) — <a href="http://www.redaero.net" target="_blank" rel="noopener">RedAero</a>
            </li>
            <li>
              MA (Sutton) — <a href="https://scautoshack.com" target="_blank" rel="noopener">Scott Carr&apos;s Auto Shack/The Saab Stripper</a>
            </li>
            <li>ME (Union) — <a href="mailto:msaabparts@outlook.com">Mark&apos;s Saab Pick-A-Part</a></li>
          </ul>
        ),
      },
      {
        id: "aggregators",
        summary: "Aggregators (thousands of yards)",
        content: (
          <ul>
            <li>
              <a href="http://car-part.com" target="_blank" rel="noopener">
                car-part.com
              </a>
            </li>
            <li>
              <a href="http://row52.com" target="_blank" rel="noopener">
                row52.com
              </a>
            </li>
            <li>
              <a href="http://www.ebay.com/motors/Parts-Accessories" target="_blank" rel="noopener">
                eBay Motors
              </a>{" "}
              (use normal buying precautions; watch for quality issues on notorious parts)
            </li>
          </ul>
        ),
      },
    ],
  },
  {
    id: "international",
    title: "Step 4 — International sources & model-specific parts",
    description: (
      <>
        <p>
          Many excellent international sources specialize in Saab parts, from reproduction parts to vintage-specific items.
        </p>
        <p>
          Some parts are genuinely hard to find with the usual suspects, we&apos;ll admit that. That is not unique to the industry,
          though, and frankly, new cars have the same issues with today&apos;s supply chain. That said, it helps to shop around or
          check with model-/powertrain-specific sites: there are plenty of small businesses modernizing, maintaining, and creating
          Saab parts for each individual model. We&apos;ll go through that below.
        </p>
      </>
    ),
    details: [
      {
        id: "all-models",
        summary: "All models",
        content: (
          <ul>
            <li>
              Germany — <a href="https://scanparts.team/en/index" target="_blank" rel="noopener">ScanParts</a>
            </li>
            <li>
              Germany — <a href="http://skanmobileclassics.com" target="_blank" rel="noopener">Skan Mobile Classics</a>
            </li>
            <li>
              Germany — <a href="https://www.heuschmid.de/restaurierung/?lang=en" target="_blank" rel="noopener">Heuschmid</a>{" "}
              — Highly-respected, very large dealership known for full restorations and reproduction Hirsch parts(!).
            </li>
            <li>
              Ireland — <a href="https://www.facebook.com/Saabsparesireland/" target="_blank" rel="noopener">Saab Spares Ireland</a>
            </li>
            <li>
              Netherlands — <a href="https://saabcarparts.nl/en/" target="_blank" rel="noopener">Saab Car Parts</a>
            </li>
            <li>
              Sweden — <a href="https://saabklubben-reservdelar.se" target="_blank" rel="noopener">Saabklubben Reservdelar</a>{" "}
              — Swedish Saab Club. Makes TONS of reproduction parts, and partners with Hedin for items like new seat covers.
            </li>
            <li>
              Sweden — <a href="http://en.bildelsbasen.se" target="_blank" rel="noopener">Bildelsbasen.se</a>
            </li>
            <li>
              Sweden — <a href="http://redox.se" target="_blank" rel="noopener">Redox Bilfarm</a>
            </li>
            <li>
              United States — <a href="https://www.modernclassicsaab.com" target="_blank" rel="noopener">Modern Classic Saab</a>{" "}
              — Jordan Pagano is a mainstay of the community as a tuner and fabricator. Has plenty of off-catalog parts for many,
              many cars. Primarily specializing in C900s.
            </li>
          </ul>
        ),
      },
      {
        id: "vintage",
        summary: "Vintage",
        content: (
          <ul>
            <li>
              Netherlands — <a href="https://www.saabworld.nl" target="_blank" rel="noopener">Saab World</a> — Also Classic 99
              &amp; 900.
            </li>
            <li>
              Netherlands — <a href="https://onnokempink.nl" target="_blank" rel="noopener">Onno Kempink</a>
            </li>
            <li>
              Netherlands — <a href="http://www.saabparts.shop/index.php?route=common/home" target="_blank" rel="noopener">Saab Parts Shop</a>
            </li>
            <li>
              Netherlands — <a href="https://sweedspeed.com" target="_blank" rel="noopener">Sweedspeed</a> — Rally prepping for V4
              cars and powertrain components for 99 &amp; 900.
            </li>
            <li>
              Sweden — <a href="https://www.classicofsweden.se" target="_blank" rel="noopener">Classic of Sweden</a> — New
              interior and exterior and external details.
            </li>
            <li>
              United States — <a href="http://www.tomdonneymotors.com" target="_blank" rel="noopener">Tom Donney Motors</a> —
              Engine and transmission parts for two-stroke engined cars.
            </li>
            <li>
              United States — <a href="http://www.subrew.com/jackashcraft/" target="_blank" rel="noopener">Jack Ashcraft</a> —
              V4 expert with beautifully-illustrated manuals and time-tested parts.
            </li>
            <li>
              <a href="https://www.saabstickers.com" target="_blank" rel="noopener">Saab Stickers</a> — Just for fun,
              beautifully-reproduced stickers for your Saabs.
            </li>
            <li>United States (Santa Fe, NM) — Jim Smart — Specialist/collector for two-stroke &amp; Sonett.</li>
            <li>
              United States (McIntire, IA) — <a href="https://www.meyersaab.com" target="_blank" rel="noopener">
                Meyer Garage (Marty Adams)
              </a>{" "}
              — Specialist/collector for two-stroke &amp; Sonett.
            </li>
          </ul>
        ),
      },
      {
        id: "classic-99-900",
        summary: "Classic 99 & 900",
        content: (
          <ul>
            <li>
              United States — <a href="https://www.modernclassicsaab.com" target="_blank" rel="noopener">Modern Classic Saab</a>
              {" "}
              — Jordan Pagano is a mainstay of the community as a tuner and fabricator. Has plenty of reproduction parts that are
              off of his already-extensive catalog. Primarily specializing in C900s.
            </li>
            <li>
              Netherlands — <a href="https://www.saabworld.nl" target="_blank" rel="noopener">Saab World</a>
            </li>
            <li>
              Netherlands — <a href="https://shop.kcperformance.eu/collections/saab-parts" target="_blank" rel="noopener">KC Performance</a>{" "}
              — Also 9-5 NG &amp; 9-4X. Performance parts.
            </li>
            <li>
              Netherlands — <a href="https://sweedspeed.com" target="_blank" rel="noopener">Sweedspeed</a> — Rally prepping for
              V4 cars and powertrain components for 99 &amp; 900.
            </li>
            <li>
              Taiwan — <a href="https://www.saab900go.com" target="_blank" rel="noopener">Saab 900 Go</a> — Reproductions of hard-to-find 900 parts.
            </li>
            <li>
              United Kingdom — <a href="https://www.abbottsaab.com" target="_blank" rel="noopener">Abbott Saab</a> — Tuners from
              the UK, respected, but niche.
            </li>
            <li>
              <a href="https://www.facebook.com/p/JK-Saabwerx-61560660335370/" target="_blank" rel="noopener">JK Saabwerx</a> —
              Makes fuel system products for C900s.
            </li>
            <li>
              <a href="https://www.saabstickers.com" target="_blank" rel="noopener">Saab Stickers</a> — Just for fun,
              beautifully-reproduced stickers for your Saabs.
            </li>
          </ul>
        ),
      },
      {
        id: "ng-95-94x",
        summary: "9-5 NG & 9-4X",
        content: (
          <ul>
            <li>
              Netherlands — <a href="https://shop.kcperformance.eu/collections/saab-parts" target="_blank" rel="noopener">KC Performance</a>{" "}
              — Also Classic 99 &amp; 900. Performance parts.
            </li>
            <li>
              Poland — <a href="https://tunstyle.eu" target="_blank" rel="noopener">TunStyle</a> — Custom bodykits and interior
              details, including Hirsch replica parts.
            </li>
            <li>
              Sweden — <a href="https://hblom.se" target="_blank" rel="noopener">hblom.se</a> — Upgrades &amp; future-proofing
              (including lightbar kits and blind spot monitoring retrofits).
            </li>
            <li>
              Netherlands — <a href="https://www.kmtronics.nl/our-products" target="_blank" rel="noopener">KM-tronics</a> —
              Electronics repair and parts for NG9-3 &amp; NG9-5 models.
            </li>
            <li>
              <a href="https://saabled.com/" target="_blank" rel="noopener">saabled.com</a> — lightbar repair
            </li>
            <li>
              <a href="https://www.esaabparts.com/95ng-led-fix/" target="_blank" rel="noopener">DIY repair kit</a>
            </li>
            <li>
              <b>Note:</b> These cars are not impossible to supply — though some specific parts are harder. Specialty groups help a
              lot. HUD windshields becoming available again via Hedin channels.
            </li>
            <li>
              <b>Cross-reference:</b> Some 9-4X parts may cross to Cadillac SRX components, and some NG9-5 parts may cross over to
              Buick Regal/Opel Insignia parts.
            </li>
          </ul>
        ),
      },
      {
        id: "gm-era",
        summary: "GM-era (roughly 1994-2009)",
        content: (
          <ul>
            <li>
              <b>GM connection tip:</b> The GM connection can pay off. Some 8-digit Saab part numbers are really GM part numbers.
              Example: touch-up paint sourced via a GMC dealer using the same code. GM dealers often don&apos;t know the Saab
              relationship — asking about the part by number/code (without leading with "Saab") can help.
            </li>
            <li>
              Germany — <a href="https://stephan-individual.de/en_GB" target="_blank" rel="noopener">Stephan Individual</a> —
              Lots
              of custom, rare late-model parts.
            </li>
            <li>
              Switzerland — <a href="https://www.autocenter-salis.ch/hirsch-style.php" target="_blank" rel="noopener">Autocenter Salis</a>{" "}
              — Sells used &amp; replica Hirsch Performance parts.
            </li>
            <li>
              United Kingdom — <a href="https://www.abbottsaab.com" target="_blank" rel="noopener">Abbott Saab</a> — Tuners from
              the UK, respected, but niche.
            </li>
            <li>
              Poland — <a href="https://tunstyle.eu" target="_blank" rel="noopener">TunStyle</a> — Custom bodykits and interior
              details, including Hirsch replica parts.
            </li>
            <li>
              Netherlands — <a href="https://www.jendvandenbosch.nl" target="_blank" rel="noopener">J&amp;D van den Bosch</a>
            </li>
            <li>
              Netherlands — <a href="https://www.kmtronics.nl/our-products" target="_blank" rel="noopener">KM-tronics</a> —
              Electronics repair and parts for NG9-3 &amp; NG9-5 models.
            </li>
            <li>
              United States — <a href="https://deanhillsaabservice.com/Services/" target="_blank" rel="noopener">Dean Hill Saab Service</a>{" "}
              — Incredible resource for XWD driveshafts and NG9-3 subframes of all types (convertible, &apos;04, XWD, etc.).
            </li>
            <li>
              United States — <a href="https://www.jxbperformance.com" target="_blank" rel="noopener">JXB Performance</a> —
              Driveshaft carriers for NG9-3 XWD cars.
            </li>
          </ul>
        ),
      },
    ],
  },
  {
    id: "community",
    title: "Ask around (community resources)",
    description: (
      <p>
        Community knowledge is often the fastest route to the correct part number, the right interchange, or the one obscure
        source that actually has stock. Be mindful of selection bias: people post problems more than trouble-free ownership.
      </p>
    ),
    details: [
      {
        id: "facebook",
        summary: "Facebook groups (links)",
        content: (
          <ul>
            <li>
              <a href="https://www.facebook.com/groups/142640942566232/" target="_blank" rel="noopener">
                Saab Parts Finder North America
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/saabownersusa/" target="_blank" rel="noopener">
                Saab Owners USA
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/Saab95ngconnection/" target="_blank" rel="noopener">
                The Saab 9-5NG Connection
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/546599098711101/" target="_blank" rel="noopener">
                Saab 9-4X Club
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/41578262020/" target="_blank" rel="noopener">
                Saab Viggen Enthusiasts
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/MNSaabClub/" target="_blank" rel="noopener">
                Minnesota Saab Club
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/TwinCitiesSaab/" target="_blank" rel="noopener">
                Twin Cities Saab Club
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/milwaukeesaabclub/" target="_blank" rel="noopener">
                Milwaukee Saab Club
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/share/g/1A2EM9sTXd/" target="_blank" rel="noopener">
                Saabs of New England
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/SAABsoftheMidatlantic/" target="_blank" rel="noopener">
                Saabs of the Mid-Atlantic
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/centralpennsaabclub/" target="_blank" rel="noopener">
                Central Penn Saab Club
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/520736137998806/" target="_blank" rel="noopener">
                SAABS FOR SALE ALL OVER THE INTERNET
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/steadysaabin/" target="_blank" rel="noopener">
                Saab Cars &amp; Parts: Buy, Sell, &amp; Trade Club
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/groups/400985543342491/" target="_blank" rel="noopener">
                Saab Hoarders and Addicts Anonymous Club (SHAAC)
              </a>
            </li>
          </ul>
        ),
      },
      {
        id: "forums",
        summary: "Not Facebook (forums)",
        content: (
          <ul>
            <li>
              <a href="http://www.saabcentral.com" target="_blank" rel="noopener">
                Saab Central
              </a>{" "}
              — check the “workshop” forums.
            </li>
            <li>
              <a href="http://www.saabnet.com" target="_blank" rel="noopener">
                The Saab Network (SaabNet)
              </a>{" "}
              — check the bulletin board forums.
            </li>
          </ul>
        ),
      },
    ],
  },
  {
    id: "save",
    title: "Save Your Saab!",
    description: (
      <p>
        Saab isn’t making cars anymore, and parts are around. Given that, if you want to pass your Saab on to a new home, please
        consider selling it whole to an enthusiast. People in the Facebook groups and forums above are often happy to take on
        projects of any depth, and would be more than happy to give friendly, reasonable advice. Have a heart — save a Saab.
      </p>
    ),
  },
];

const tocLinks = [
  { id: "why", label: "Saab Parts & Service Still Exist", caption: "Hedin, OEM network, community" },
  { id: "part-numbers", label: "Step 1 — Part numbers", caption: "WIS/EPC, variants, supersessions" },
  { id: "new", label: "Step 2 — Buy new", caption: "OEM first, best retailers" },
  { id: "used", label: "Step 3 — Buy used", caption: "Specialty yards + aggregators" },
  { id: "international", label: "Step 4 — International & model-specific", caption: "Global suppliers + model-specific" },
  { id: "community", label: "Ask around", caption: "Facebook + non-Facebook forums" },
  { id: "save", label: "Save Your Saab!", caption: "Keep Saabs whole" },
];

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sections", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load sections");
      const data = (await res.json()) as Section[];
      setSections(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { sections, loading, error, reload: load };
}

function Home() {
  const { sections, loading, error, reload } = useSections();
  const [navOpen, setNavOpen] = useState(false);

  const navItems = useMemo(
    () => sections.map((s) => ({ id: s.slug, title: s.title })),
    [sections]
  );

  return (
    <div className="wrap">
      <header>
        <div className="kicker">
          <div className="pill">Saab parts survival guide</div>
          <div className="pill">Database-backed links</div>
        </div>
        <h1>Stop scrapping Saabs</h1>
        <p className="sub">
          "Saab? You can&apos;t get parts for those anymore." <b>You want to bet?</b>
          <br />
          Saab parts are often easier to source than people assume.
          <br />
          Plus, there are over a hundred
          <a href="https://saabparts.com/us/book-a-service/" target="_blank" rel="noopener">
            Official Service Centers
          </a>{" "}
          and many, many more independents out there willing and able to work on your Saab.
          <br />
          <b>Yes, it is possible to daily-drive your Saab over a decade after the last one was made.</b>
        </p>
        <div className="btnrow">
          <button type="button" onClick={() => setAllDetails(true)}>
            Expand all
          </button>
          <button type="button" onClick={() => setAllDetails(false)}>
            Collapse all
          </button>
        </div>
      </header>

      <div className="grid">
        <nav className={navOpen ? "" : "collapsed"}>
          <button className="nav-toggle" onClick={() => setNavOpen((v) => !v)}>
            Navigation
          </button>
          <h3>Sections</h3>
          <ol>
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setNavOpen(false)}>
                  {item.title}
                </a>
              </li>
            ))}
          </ol>
          <div className="muted">Need to edit? Head to the admin console.</div>
        </nav>

        <main>
          {loading && <Loader />}
          {error && (
            <div className="callout error">
              <b>Could not load sections:</b> {error}
              <div>
                <button onClick={reload}>Try again</button>
              </div>
            </div>
          )}
          {!loading && sections.length === 0 && <div className="muted">No sections have been added yet.</div>}
          {sections.map((section) => (
            <section key={section.id} id={section.slug} className="card">
              <div className="card-header">
                <h2>{section.title}</h2>
                {section.description && <p className="muted">{section.description}</p>}
              </div>
              <div className="resource-list">
                {section.resources?.map((resource) => (
                  <article key={resource.id} className="resource">
                    <div className="resource-heading">
                      <a href={resource.url} target="_blank" rel="noopener">
                        {resource.label}
                      </a>
                    </div>
                    {resource.blurb && <p className="muted">{resource.blurb}</p>}
                  </article>
                ))}
                {!section.resources?.length && <p className="muted">No links are available for this section.</p>}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}

function Admin() {
  const { sections, loading, error, reload } = useSections();
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [sectionForm, setSectionForm] = useState({ slug: "", title: "", description: "", position: 0 });
  const [resourceForm, setResourceForm] = useState({ sectionId: "", label: "", url: "", blurb: "", position: 0 });

  const loadUser = async () => {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    const data = await res.json();
    setUser(data.user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      if (!res.ok) throw new Error("Invalid username or password");
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setAuthError((err as Error).message);
    }
  };

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  const submitSection = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...sectionForm, position: Number(sectionForm.position) };
    await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    setSectionForm({ slug: "", title: "", description: "", position: 0 });
    reload();
  };

  const submitResource = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...resourceForm,
      sectionId: Number(resourceForm.sectionId),
      position: Number(resourceForm.position),
    };
    await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    setResourceForm({ sectionId: "", label: "", url: "", blurb: "", position: 0 });
    reload();
  };

  return (
    <div className="wrap">
      <header>
        <div className="kicker">
          <div className="pill">Admin console</div>
          <div className="pill">MySQL-backed</div>
        </div>
        <h1>Manage Saab link data</h1>
        <p className="sub">Create sections, add links, and keep the main page updated without redeploying the site.</p>
      </header>

      {!user && (
        <form className="card" onSubmit={onLogin}>
          <h2>Sign in</h2>
          {authError && <div className="callout error">{authError}</div>}
          <label>
            Username
            <input
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </label>
          <button type="submit">Login</button>
        </form>
      )}

      {user && (
        <div className="card">
          <div className="kicker">
            Signed in as <b>{user.username}</b> ({user.role})
          </div>
          <button onClick={onLogout}>Log out</button>
        </div>
      )}

      {user && user.role === "admin" && (
        <>
          <form className="card" onSubmit={submitSection}>
            <h3>Add section</h3>
            <label>
              Slug
              <input value={sectionForm.slug} onChange={(e) => setSectionForm({ ...sectionForm, slug: e.target.value })} />
            </label>
            <label>
              Title
              <input value={sectionForm.title} onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })} />
            </label>
            <label>
              Description
              <textarea
                value={sectionForm.description}
                onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
              />
            </label>
            <label>
              Position
              <input
                type="number"
                value={sectionForm.position}
                onChange={(e) => setSectionForm({ ...sectionForm, position: Number(e.target.value) })}
              />
            </label>
            <button type="submit">Save section</button>
          </form>

          <form className="card" onSubmit={submitResource}>
            <h3>Add resource</h3>
            <label>
              Section
              <select
                value={resourceForm.sectionId}
                onChange={(e) => setResourceForm({ ...resourceForm, sectionId: e.target.value })}
              >
                <option value="">Choose a section</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Label
              <input value={resourceForm.label} onChange={(e) => setResourceForm({ ...resourceForm, label: e.target.value })} />
            </label>
            <label>
              URL
              <input value={resourceForm.url} onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })} />
            </label>
            <label>
              Blurb
              <textarea
                value={resourceForm.blurb}
                onChange={(e) => setResourceForm({ ...resourceForm, blurb: e.target.value })}
              />
            </label>
            <label>
              Position
              <input
                type="number"
                value={resourceForm.position}
                onChange={(e) => setResourceForm({ ...resourceForm, position: Number(e.target.value) })}
              />
            </label>
            <button type="submit">Save resource</button>
          </form>
        </>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Preview</h3>
          <p className="muted">Current section and link data.</p>
        </div>
        {loading && <Loader />}
        {error && <div className="callout error">{error}</div>}
        {!loading && (
          <ul>
            {sections.map((section) => (
              <li key={section.id}>
                <b>{section.title}</b> ({section.slug}) — {section.resources?.length ?? 0} links
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <>
              <Home />
              <div className="wrap">
                <div className="card">
                  <h3>Want to edit?</h3>
                  <p className="muted">Visit the <Link to="/admin">admin console</Link> to manage MySQL-backed content.</p>
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
