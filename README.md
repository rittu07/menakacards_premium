# Menaka Invitations: Thangam Collection (Premium)

A mobile-first digital wedding invitation built with Next.js. It shows a sample wedding, in English and Tamil.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000/thangam. For production, use `npm run build` and then `npm start`.

## Add a new couple

Edit `src/data/wedding.ts`. It holds every word in both languages, plus the dates, venue, phone numbers, photos and music.

Before a real couple goes live:

- Replace the zeros in `contact.phone`, `families` contacts and `brand.orderUrl`.
- Replace `thangam.gift.upiId` and `payeeName`, then set `thangam.gift.sample` to `false`. Set `enabled` to `false` to remove the Moi section.
- Replace `families` elders, `story`, `preWeddingGallery`, `gallery`, `thangam.couplePhoto` and `venue.photo`.
- Set `venue.coords` and `venue.climate`, which drive the event-day weather.
- Replace the music in `public/shared/audio`.

Event-day weather comes from Open-Meteo, whose free plan is for non-commercial use. Check its terms or take a paid plan before selling this.

## Settings

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the deployed address. WhatsApp needs it to find the link preview image.

### Supabase

1. Create a Supabase project.
2. In its SQL editor, run `supabase/schema.sql`.
3. Add these to `.env.local` or your host's environment settings:

| Setting | Where it comes from |
|---|---|
| `SUPABASE_URL` | Supabase, Project Settings, API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase, Project Settings, API. Keep it secret and never add `NEXT_PUBLIC_` to its name |
| `RSVP_FAMILY_PASSCODE` | A passcode you choose and give to the family |

The family's private page is `/thangam/responses`. Until these settings exist, the RSVP form offers guests a WhatsApp message instead.

## Reviewing dated screens

Add `?at=` to a link to see the site at another time. It only changes that one view.

- Final day: `/thangam?at=2027-02-04T08:00:00%2B05:30`
- Thank-you cover: `/thangam?at=2027-02-06T10:00:00%2B05:30`
