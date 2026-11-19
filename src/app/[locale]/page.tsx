import { ArrowRight, BadgeCheck, Languages, MapPinned, MessageSquareText, Wallet } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroParallax, Reveal } from "@/components/common/motion";
import { SectionHeading } from "@/components/common/section";
import { SmartImage } from "@/components/common/smart-image";
import { ReviewList } from "@/components/common/reviews";
import { SearchForm } from "@/components/home/search-form";
import { LazyMap } from "@/components/maps/lazy-map";
import { ArchFrame, GirihPattern, IkatDivider, SuzaniMedallion } from "@/components/ornament";
import { TourCard } from "@/components/tours/tour-card";
import { buttonVariants } from "@/components/ui/button";
import { listPublishedDestinations } from "@/db/queries/destinations";
import { listPublishedReviews } from "@/db/queries/reviews";
import { listPublishedTours, publishedGuideLanguages } from "@/db/queries/tours";
import type { Locale } from "@/db/types";
import { Link } from "@/i18n/navigation";
import { localize } from "@/lib/localize";
import { contactSettings, db, exchangeRates, pageMetadata, requestCurrency } from "@/lib/server/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, href: "/", title: t("defaultTitle"), absoluteTitle: true });
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const currency = await requestCurrency(locale);
  const rates = await exchangeRates();
  const [destinations, featured, reviews, languages, contact] = await Promise.all([
    listPublishedDestinations(db()),
    listPublishedTours(db(), { featured: "1", sort: "featured", currency, page: 1, pageSize: 6 }, rates),
    listPublishedReviews(db(), { limit: 6 }),
    publishedGuideLanguages(db()),
    contactSettings(),
  ]);
  const tl = await getTranslations({ locale, namespace: "services.guideLanguages" });
  const languageNames = languages
    .map((l) => (tl.has(l as never) ? tl(l as never) : l.toUpperCase()))
    .join(", ");
  const heroDestination = destinations.find((d) => d.slug === "samarkand") ?? destinations[0];

  const why = [
    { icon: MapPinned, title: t("home.whyLocalTitle"), text: t("home.whyLocalText") },
    ...(languageNames ? [{ icon: Languages, title: t("home.whyLanguagesTitle"), text: t("home.whyLanguagesText", { languages: languageNames }) }] : []),
    { icon: Wallet, title: t("home.whyPricesTitle"), text: t("home.whyPricesText") },
    { icon: MessageSquareText, title: t("home.whyTelegramTitle"), text: t("home.whyTelegramText") },
    ...(contact.licenseNumber ? [{ icon: BadgeCheck, title: t("home.whyLicenceTitle"), text: t("home.whyLicenceText", { number: contact.licenseNumber }) }] : []),
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="on-dark relative isolate overflow-hidden bg-lapis-deep text-ivory" aria-labelledby="hero-title">
        <HeroParallax>
          <GirihPattern className="absolute inset-0 h-[115%]" tone="saffron" opacity={0.32} tile={104} />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(42,157,143,0.28),transparent_60%)]" />
        </HeroParallax>
        <div className="container-page relative grid items-center gap-10 py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-saffron">{t("home.eyebrow")}</p>
            <h1 id="hero-title" className="mt-4 text-5xl text-ivory">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-sand">{t("home.heroText")}</p>
          </div>
          <div className="relative mx-auto hidden w-full max-w-[22rem] lg:col-span-5 lg:block">
            <div className="relative aspect-[5/7]">
              <div className="arch-mask absolute inset-0">
                <SmartImage
                  src={heroDestination?.heroImage}
                  alt={heroDestination ? localize(heroDestination.name, locale) : ""}
                  label={heroDestination ? localize(heroDestination.name, locale) : t("meta.siteName")}
                  priority
                  sizes="(min-width: 1024px) 28rem, 0px"
                />
              </div>
              <ArchFrame className="-inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)]" />
            </div>
            <SuzaniMedallion size={120} palette="night" className="absolute -bottom-8 -left-10" />
          </div>
          <div className="relative z-10 lg:col-span-12 lg:-mt-4">
            <SearchForm
              locale={locale}
              destinations={destinations.map((d) => ({ slug: d.slug, name: localize(d.name, locale) }))}
            />
          </div>
        </div>
        <IkatDivider height={14} />
      </section>

      {/* ── Dual audience gateway ────────────────────────────── */}
      <section className="container-page py-20" aria-labelledby="gateway-title">
        <SectionHeading id="gateway-title" title={t("home.gatewayTitle")} align="center" />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <Link href="/inbound" className="group on-dark relative flex h-full min-h-[24rem] flex-col justify-end overflow-hidden rounded-t-[10rem] px-8 pb-8 pt-32 rounded-b-[var(--radius-card)] bg-lapis text-ivory shadow-card transition-shadow hover:shadow-lift">
              <GirihPattern className="absolute inset-0" tone="saffron" opacity={0.3} />
              <div className="relative">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-saffron">{t("audience.inbound")}</p>
                <h3 className="mt-2 text-4xl text-ivory" lang="en">{t("home.gatewayInboundTitle")}</h3>
                <p className="mt-3 max-w-md text-sand">{t("home.gatewayInboundText")}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-saffron group-hover:underline">
                  {t("home.gatewayInboundCta")} <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/domestic" className="group relative flex h-full min-h-[24rem] flex-col justify-end overflow-hidden rounded-t-[10rem] px-8 pb-8 pt-32 rounded-b-[var(--radius-card)] bg-sand text-ink shadow-card transition-shadow hover:shadow-lift">
              <GirihPattern className="absolute inset-0" tone="pomegranate" opacity={0.14} />
              <div className="relative">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-pomegranate">{t("audience.domestic")}</p>
                <h3 className="mt-2 text-4xl text-lapis-deep" lang="uz">{t("home.gatewayDomesticTitle")}</h3>
                <p className="mt-3 max-w-md text-ink">{t("home.gatewayDomesticText")}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-terracotta-deep group-hover:underline">
                  {t("home.gatewayDomesticCta")} <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Featured tours ───────────────────────────────────── */}
      {featured.items.length > 0 && (
        <section className="bg-girih-light bg-sand-soft py-20" aria-labelledby="featured-title">
          <div className="container-page">
            <SectionHeading
              id="featured-title"
              eyebrow={t("nav.tours")}
              title={t("home.featuredTitle")}
              text={t("home.featuredText")}
              action={
                <Link href="/tours" className={buttonVariants({ variant: "outline" })}>
                  {t("common.viewAll")}
                </Link>
              }
            />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.items.map((tour) => (
                <li key={tour.id}>
                  <TourCard tour={tour} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Map of regions ───────────────────────────────────── */}
      <section className="container-page py-20" aria-labelledby="map-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="map-title" eyebrow={t("nav.destinations")} title={t("home.mapTitle")} text={t("home.mapText")} />
            <ul className="mt-8 grid grid-cols-2 gap-x-4 lg:grid-cols-1">
              {destinations.map((d) => (
                <li key={d.slug} className="border-b border-line">
                  <Link href={`/destinations/${d.slug}`} className="flex min-h-12 items-center justify-between gap-2 font-semibold text-ink hover:text-lapis">
                    {localize(d.name, locale)}
                    <span className="text-sm font-normal text-ink-muted">{t("destinations.toursCount", { count: d.tourCount })}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-8">
            <LazyMap
              className="h-[26rem] lg:h-full lg:min-h-[34rem]"
              label={t("home.mapTitle")}
              loadingLabel={t("common.mapLoading")}
              attribution={t("common.mapAttribution")}
              points={destinations.map((d) => ({
                lat: d.lat,
                lng: d.lng,
                label: localize(d.name, locale),
                caption: localize(d.tagline, locale),
                href: `/${locale}/destinations/${d.slug}`,
              }))}
            />
          </div>
        </div>
      </section>

      {/* ── Why travel with us (true statements only) ────────── */}
      <section className="on-dark relative overflow-hidden bg-lapis-deep py-20 text-ivory" aria-labelledby="why-title">
        <GirihPattern className="absolute inset-0" tone="saffron" opacity={0.22} />
        <div className="container-page relative">
          <SectionHeading id="why-title" tone="dark" title={t("home.whyTitle")} align="center" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {why.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 0.06} className="rounded-[var(--radius-card)] border border-saffron/30 bg-lapis-night/60 p-6">
                <Icon aria-hidden="true" className="size-8 text-saffron" />
                <h3 className="mt-4 text-2xl text-ivory">{title}</h3>
                <p className="mt-2 text-sand">{text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Real reviews (hidden when there are none) ───────── */}
      {reviews.total > 0 && (
        <section className="container-page py-20" aria-labelledby="reviews-title">
          <SectionHeading id="reviews-title" title={t("home.reviewsTitle")} />
          <ReviewList locale={locale} reviews={reviews} className="mt-10" />
        </section>
      )}

      {/* ── Travel guide teaser ──────────────────────────────── */}
      <section className="container-page py-20" aria-labelledby="guide-title">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-sand p-8 sm:p-12">
          <GirihPattern className="absolute inset-0" tone="lapis" opacity={0.12} />
          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h2 id="guide-title" className="text-3xl text-lapis-deep">{t("home.guideTitle")}</h2>
              <p className="mt-3 max-w-2xl text-lg text-ink">{t("home.guideText")}</p>
              <Link href="/travel-guide" className={buttonVariants({ variant: "secondary", className: "mt-6" })}>
                {t("home.guideCta")}
              </Link>
            </div>
            <SuzaniMedallion size={160} className="hidden md:block" />
          </div>
        </div>
      </section>
    </>
  );
}
