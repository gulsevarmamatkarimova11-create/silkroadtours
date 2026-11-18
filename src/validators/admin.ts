import { z } from "zod";
import {
  ACCOMMODATION_TYPES,
  AUDIENCES,
  BOOKING_STATUSES,
  BOOKING_TYPES,
  CURRENCIES,
  DEPARTURE_STATUSES,
  DIFFICULTIES,
  FAQ_CATEGORIES,
  MEALS,
  TOUR_BADGES,
  TOUR_CATEGORIES,
  TRANSPORT_MODES,
} from "../db/types";
import { isoDate, slug } from "./common";

/** Short fields (titles, names) must exist in all three languages. */
export const localizedRequired = z.object({
  en: z.string().trim().min(1),
  uz: z.string().trim().min(1),
  ru: z.string().trim().min(1),
});
/** Long fields require English; uz/ru may be empty and fall back to English on the site. */
export const localizedLong = z.object({
  en: z.string().trim().min(1),
  uz: z.string().trim(),
  ru: z.string().trim(),
});

const mediaItem = z.object({
  url: z.url(),
  type: z.enum(["image", "video"]),
  alt: localizedLong,
  poster: z.url().optional(),
});

const month = z.number().int().min(1).max(12);
const minorAmount = z.number().int().min(0).max(10_000_000_000);

// ── Auth ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.email().transform((v) => v.toLowerCase()),
  password: z.string().min(1).max(200),
});

export const bootstrapAdminSchema = z.object({
  email: z.email().transform((v) => v.toLowerCase()),
  name: z.string().trim().min(2).max(80),
  password: z.string().min(12, { error: "password_min_12" }).max(200),
});

// ── Bookings ───────────────────────────────────────────────────────────────

export const bookingListQuerySchema = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
  audience: z.enum(AUDIENCES).optional(),
  q: z.string().trim().max(100).optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(10).max(100).default(25),
});

export const bookingStatusUpdateSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
  note: z.string().trim().max(2000).optional(),
});

export const bookingNoteSchema = z.object({
  body: z.string().trim().min(1).max(4000),
});

// ── Tours ──────────────────────────────────────────────────────────────────

export const tourUpsertSchema = z
  .object({
    slug,
    audience: z.enum(AUDIENCES),
    category: z.enum(TOUR_CATEGORIES),
    primaryDestinationId: z.number().int().positive(),
    destinationIds: z.array(z.number().int().positive()).max(9),
    title: localizedRequired,
    summary: localizedRequired,
    description: localizedLong,
    durationDays: z.number().int().min(1).max(60),
    durationNights: z.number().int().min(0).max(60),
    difficulty: z.enum(DIFFICULTIES),
    minGroup: z.number().int().min(1).max(100),
    maxGroup: z.number().int().min(1).max(200),
    baseCurrency: z.enum(CURRENCIES),
    childPricePercent: z.number().int().min(0).max(100),
    compareAtPriceMinor: minorAmount.nullable(),
    badges: z.array(z.enum(TOUR_BADGES)).max(TOUR_BADGES.length),
    included: z.array(localizedLong).max(40),
    excluded: z.array(localizedLong).max(40),
    accommodation: z
      .array(
        z.object({
          type: z.enum(ACCOMMODATION_TYPES),
          name: localizedLong,
          tier: localizedLong.optional(),
          nights: z.number().int().min(0).max(60),
        }),
      )
      .max(30),
    transport: z
      .array(z.object({ mode: z.enum(TRANSPORT_MODES), description: localizedLong }))
      .max(20),
    route: z
      .array(
        z.object({
          lat: z.number().min(37).max(46),
          lng: z.number().min(55).max(74),
          label: localizedLong,
          day: z.number().int().min(1).optional(),
        }),
      )
      .max(60),
    guideLanguages: z.array(z.string().length(2)).max(15),
    seasonMonths: z.array(month).max(12),
    heroImage: z.url(),
    gallery: z.array(mediaItem).max(60),
    seoTitle: localizedLong.nullable(),
    seoDescription: localizedLong.nullable(),
    isFeatured: z.boolean(),
    isPublished: z.boolean(),
    sortOrder: z.number().int(),
  })
  .refine((t) => t.maxGroup >= t.minGroup, { error: "max_lt_min", path: ["maxGroup"] })
  .refine((t) => t.durationNights <= t.durationDays, { error: "nights_gt_days", path: ["durationNights"] });

export const itineraryReplaceSchema = z
  .array(
    z.object({
      dayNumber: z.number().int().min(1).max(60),
      title: localizedRequired,
      description: localizedLong,
      meals: z.array(z.enum(MEALS)).max(3),
      overnight: localizedLong.nullable(),
      distanceKm: z.number().int().min(0).max(5000).nullable(),
      walkingHours: z.number().min(0).max(24).nullable(),
    }),
  )
  .max(60)
  .refine((days) => new Set(days.map((d) => d.dayNumber)).size === days.length, {
    error: "duplicate_day",
  });

const priceTier = z
  .object({
    bookingType: z.enum(BOOKING_TYPES),
    minPax: z.number().int().min(1).max(200),
    maxPax: z.number().int().min(1).max(200),
    priceUsd: minorAmount.nullable(),
    priceUzs: minorAmount.nullable(),
    priceEur: minorAmount.nullable(),
  })
  .refine((t) => t.maxPax >= t.minPax, { error: "max_lt_min", path: ["maxPax"] });

/** PUT /api/admin/tours/[id]/pricing — replaces all tiers. Base-currency column required; ranges may not overlap. */
export function pricingReplaceSchema(baseCurrency: (typeof CURRENCIES)[number]) {
  const baseKey = ({ USD: "priceUsd", UZS: "priceUzs", EUR: "priceEur" } as const)[baseCurrency];
  return z
    .array(priceTier)
    .min(1)
    .max(40)
    .superRefine((tiers, ctx) => {
      tiers.forEach((t, i) => {
        if (t[baseKey] == null) {
          ctx.addIssue({ code: "custom", message: "base_price_required", path: [i, baseKey] });
        }
      });
      for (const type of BOOKING_TYPES) {
        const sorted = tiers
          .map((t, i) => ({ ...t, i }))
          .filter((t) => t.bookingType === type)
          .sort((a, b) => a.minPax - b.minPax);
        for (let k = 1; k < sorted.length; k++) {
          if (sorted[k]!.minPax <= sorted[k - 1]!.maxPax) {
            ctx.addIssue({ code: "custom", message: "tier_overlap", path: [sorted[k]!.i, "minPax"] });
          }
        }
      }
    });
}

export const departureUpsertSchema = z
  .object({
    startDate: isoDate,
    endDate: isoDate,
    seatsTotal: z.number().int().min(1).max(500),
    status: z.enum(DEPARTURE_STATUSES),
    priceModifierPercent: z.number().int().min(-90).max(300),
  })
  .refine((d) => d.endDate >= d.startDate, { error: "end_before_start", path: ["endDate"] });

// ── Destinations ───────────────────────────────────────────────────────────

export const destinationUpsertSchema = z.object({
  slug,
  name: localizedRequired,
  tagline: localizedRequired,
  overview: localizedLong,
  attractions: z
    .array(
      z.object({
        name: localizedRequired,
        description: localizedLong,
        image: z.url().optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
      }),
    )
    .max(30),
  bestTime: localizedLong,
  bestMonths: z.array(month).max(12),
  lat: z.number().min(37).max(46),
  lng: z.number().min(55).max(74),
  heroImage: z.url(),
  gallery: z.array(mediaItem).max(60),
  seoTitle: localizedLong.nullable(),
  seoDescription: localizedLong.nullable(),
  sortOrder: z.number().int(),
  isPublished: z.boolean(),
});

// ── Reviews, FAQ, settings ─────────────────────────────────────────────────

export const reviewModerationSchema = z.object({
  isPublished: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

export const faqUpsertSchema = z.object({
  category: z.enum(FAQ_CATEGORIES),
  question: localizedRequired,
  answer: localizedLong,
  sortOrder: z.number().int(),
  isPublished: z.boolean(),
});

export const exchangeRatesSchema = z.object({
  rates: z.object({
    USD: z.literal(1),
    UZS: z.number().positive().max(1_000_000),
    EUR: z.number().positive().max(100),
  }),
});
