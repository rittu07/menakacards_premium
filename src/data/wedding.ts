/**
 * The one file to edit for a new couple.
 * Every word a guest reads, in both languages, and every date, link and photo
 * comes from here. No component holds wording of its own.
 */

export type Lang = "en" | "ta";
export type Text = Record<Lang, string>;

export type FunctionKey =
  | "mehendi"
  | "haldi"
  | "nalangu"
  | "muhurtham"
  | "reception";

export type WeddingFunction = {
  key: FunctionKey;
  name: Text;
  /** ISO timestamps with the +05:30 offset. */
  start: string;
  end: string;
  venue: Text;
  /** Google Maps search text for this function's venue. */
  mapQuery: string;
};

const venueName: Text = { en: "Sunshine Lawn", ta: "சன்ஷைன் லான்" };
const venueQuery = "Sunshine Lawn, Z-46 Street Name, City Name";

export const wedding = {
  slug: "sonia-akashy",
  timeZone: "Asia/Kolkata",

  couple: {
    bride: { en: "Sonia", ta: "சோனியா" } as Text,
    groom: { en: "Akashy", ta: "ஆகாஷி" } as Text,
    initials: { en: "S & A", ta: "சோ & ஆ" } as Text,
  },

  families: {
    bride: {
      title: { en: "Bride's Family", ta: "மணமகள் குடும்பம்" } as Text,
      parents: [
        { en: "Mr. R. Kumar", ta: "திரு. ஆர். குமார்" },
        { en: "Mrs. S. Meena", ta: "திருமதி. எஸ். மீனா" },
      ] as Text[],
      elders: [
        { en: "Late Mr. K. Raman", ta: "அமரர் திரு. கே. ராமன்" },
        { en: "Mrs. R. Lakshmi", ta: "திருமதி. ஆர். லட்சுமி" },
      ] as Text[],
      contact: {
        name: { en: "Mr. R. Arun, bride's brother", ta: "திரு. ஆர். அருண், மணமகள் சகோதரர்" } as Text,
        phone: "910000000000",
      },
    },
    groom: {
      title: { en: "Groom's Family", ta: "மணமகன் குடும்பம்" } as Text,
      parents: [
        { en: "Mr. V. Rajan", ta: "திரு. வி. ராஜன்" },
        { en: "Mrs. L. Revathi", ta: "திருமதி. எல். ரேவதி" },
      ] as Text[],
      elders: [
        { en: "Mr. S. Velu", ta: "திரு. எஸ். வேலு" },
        { en: "Mrs. V. Kamala", ta: "திருமதி. வி. கமலா" },
      ] as Text[],
      contact: {
        name: { en: "Mr. V. Karthik, groom's brother", ta: "திரு. வி. கார்த்திக், மணமகன் சகோதரர்" } as Text,
        phone: "910000000000",
      },
    },
  },

  /** The muhurtham: the countdown and "Add to calendar" point here. */
  muhurtham: {
    start: "2027-02-04T09:00:00+05:30",
    end: "2027-02-04T10:30:00+05:30",
  },

  venue: {
    name: venueName,
    address: { en: "Z-46 Street Name, City Name", ta: "Z-46 தெரு பெயர், நகரம்" } as Text,
    mapQuery: venueQuery,
    /** Used for the event-day weather. These are sample coordinates (Chennai). */
    coords: { latitude: 13.08, longitude: 80.27 },
    photo: "/shared/photos/mandap-wide.webp",
    /** Shown until the live forecast opens, 16 days before the wedding. */
    climate: {
      en: "Early February is usually warm and dry here, around 21 to 31°C.",
      ta: "பிப்ரவரி தொடக்கத்தில் இங்கு பொதுவாக 21 முதல் 31°C வரை இதமான வெப்பமும் வறண்ட வானிலையும் இருக்கும்.",
    } as Text,
  },

  functions: [
    {
      key: "mehendi",
      name: { en: "Mehendi", ta: "மெஹந்தி" },
      start: "2027-02-03T10:00:00+05:30",
      end: "2027-02-03T12:00:00+05:30",
      venue: venueName,
      mapQuery: venueQuery,
    },
    {
      key: "haldi",
      name: { en: "Haldi", ta: "ஹல்தி" },
      start: "2027-02-03T16:00:00+05:30",
      end: "2027-02-03T18:00:00+05:30",
      venue: venueName,
      mapQuery: venueQuery,
    },
    {
      key: "nalangu",
      name: { en: "Nalangu", ta: "நலங்கு" },
      start: "2027-02-03T19:00:00+05:30",
      end: "2027-02-03T20:30:00+05:30",
      venue: venueName,
      mapQuery: venueQuery,
    },
    {
      key: "muhurtham",
      name: { en: "Muhurtham", ta: "முகூர்த்தம்" },
      start: "2027-02-04T09:00:00+05:30",
      end: "2027-02-04T10:30:00+05:30",
      venue: venueName,
      mapQuery: venueQuery,
    },
    {
      key: "reception",
      name: { en: "Reception", ta: "வரவேற்பு" },
      start: "2027-02-04T19:00:00+05:30",
      end: "2027-02-04T22:00:00+05:30",
      venue: venueName,
      mapQuery: venueQuery,
    },
  ] as WeddingFunction[],

  /**
   * Family contact for the call and WhatsApp buttons, digits only with the
   * country code. These zeros are a stand-in: replace them for a real couple.
   */
  contact: {
    phone: "910000000000",
    whatsappMessage: {
      en: "Namaste! We received the wedding invitation of Sonia & Akashy.",
      ta: "வணக்கம்! சோனியா & ஆகாஷி திருமண அழைப்பிதழ் கிடைத்தது.",
    } as Text,
  },

  /** Paths under /public, or full addresses for the couple's own photos. */
  gallery: [
    { src: "/shared/photos/couple.webp", alt: { en: "Sonia and Akashy", ta: "சோனியா மற்றும் ஆகாஷி" } },
    { src: "/shared/photos/hands.webp", alt: { en: "Mehendi on joined hands", ta: "இணைந்த கைகளில் மெஹந்தி" } },
    { src: "/shared/photos/garden.webp", alt: { en: "The couple walking in a garden", ta: "தோட்டத்தில் நடக்கும் மணமக்கள்" } },
    { src: "/shared/photos/lanterns.webp", alt: { en: "Lanterns among roses", ta: "ரோஜாக்களுக்கு நடுவே விளக்குகள்" } },
    { src: "/shared/photos/hall.webp", alt: { en: "The couple in the palace hall", ta: "அரண்மனை மண்டபத்தில் மணமக்கள்" } },
    { src: "/shared/photos/mandap.webp", alt: { en: "The wedding mandap at dusk", ta: "மாலையில் திருமண மண்டபம்" } },
  ] as { src: string; alt: Text }[],

  /** Sample milestones, shown by the tiers that include Our Story. */
  story: [
    {
      date: { en: "March 2022", ta: "மார்ச் 2022" },
      title: { en: "A Chance Meeting", ta: "எதிர்பாராத சந்திப்பு" },
      caption: {
        en: "We met at a friend's wedding and talked until the last guest had left.",
        ta: "நண்பரின் திருமணத்தில் சந்தித்து, கடைசி விருந்தினர் செல்லும் வரை பேசிக்கொண்டிருந்தோம்.",
      },
      photo: "/shared/photos/garden.webp",
    },
    {
      date: { en: "August 2023", ta: "ஆகஸ்ட் 2023" },
      title: { en: "Our Best Friend", ta: "உயிர் நண்பர்கள்" },
      caption: {
        en: "Long walks and longer phone calls turned friendship into something more.",
        ta: "நீண்ட நடைகளும் நீண்ட தொலைபேசி உரையாடல்களும் நட்பை அன்பாக மாற்றின.",
      },
      photo: "/shared/photos/couple.webp",
    },
    {
      date: { en: "December 2025", ta: "டிசம்பர் 2025" },
      title: { en: "The Question", ta: "அந்த கேள்வி" },
      caption: {
        en: "Under strings of lanterns, Akashy asked and Sonia said yes.",
        ta: "விளக்குகளின் ஒளியில் ஆகாஷி கேட்க, சோனியா சம்மதம் சொன்னார்.",
      },
      photo: "/shared/photos/lanterns.webp",
    },
    {
      date: { en: "June 2026", ta: "ஜூன் 2026" },
      title: { en: "Two Families, One", ta: "இரு குடும்பம், ஒரே உறவு" },
      caption: {
        en: "Our families met, blessed us and set the date.",
        ta: "இரு குடும்பங்களும் சந்தித்து, ஆசீர்வதித்து, திருமண நாளை நிச்சயித்தனர்.",
      },
      photo: "/shared/photos/hall.webp",
    },
  ] as { date: Text; title: Text; caption: Text; photo: string }[],

  /** Shoot photos, kept apart from the main gallery by the tiers that show them. */
  preWeddingGallery: [
    { src: "/shared/photos/palace-walk.webp", alt: { en: "The couple before the palace", ta: "அரண்மனை முன் மணமக்கள்" } },
    { src: "/shared/photos/garden.webp", alt: { en: "A walk in the garden", ta: "தோட்டத்தில் ஒரு நடை" } },
    { src: "/shared/photos/couple.webp", alt: { en: "Sonia and Akashy", ta: "சோனியா மற்றும் ஆகாஷி" } },
  ] as { src: string; alt: Text }[],

  /** A single instrumental track. Set to null to remove the music button. */
  music: { src: "/shared/audio/premium-1.mp3" as string | null },

  brand: {
    name: { en: "Menaka Invitations", ta: "மேனகா இன்விடேஷன்ஸ்" } as Text,
    logo: "/shared/menaka-logo.webp",
    logoAlt: { en: "Menaka Card logo", ta: "மேனகா கார்டு சின்னம்" } as Text,
    /** Where "Order your invitation" goes. A stand-in, like contact.phone. */
    orderUrl: "https://wa.me/910000000000?text=I%20would%20like%20to%20order%20a%20digital%20invitation",
  },

  /** Wording shared by every tier's controls. */
  ui: {
    switchLanguage: { en: "தமிழ்", ta: "English" } as Text,
    switchLanguageLabel: { en: "Switch to Tamil", ta: "ஆங்கிலத்திற்கு மாற்றவும்" } as Text,
    elderOn: { en: "Make the text larger", ta: "எழுத்தைப் பெரிதாக்கவும்" } as Text,
    elderOff: { en: "Return text to normal size", ta: "எழுத்தை இயல்பு அளவுக்கு மாற்றவும்" } as Text,
    readAloud: { en: "Read the invitation aloud", ta: "அழைப்பிதழை வாசிக்கவும்" } as Text,
    stopReading: { en: "Stop reading", ta: "வாசிப்பதை நிறுத்தவும்" } as Text,
    noVoice: {
      en: "This phone has no voice for reading aloud.",
      ta: "இந்த கைபேசியில் தமிழ் வாசிப்புக் குரல் இல்லை.",
    } as Text,
    musicOn: { en: "Play music", ta: "இசையை இயக்கவும்" } as Text,
    musicOff: { en: "Mute music", ta: "இசையை நிறுத்தவும்" } as Text,
    close: { en: "Close", ta: "மூடவும்" } as Text,
    previous: { en: "Previous photo", ta: "முந்தைய படம்" } as Text,
    next: { en: "Next photo", ta: "அடுத்த படம்" } as Text,
    days: { en: "Days", ta: "நாட்கள்" } as Text,
    hours: { en: "Hours", ta: "மணி" } as Text,
    minutes: { en: "Minutes", ta: "நிமிடம்" } as Text,
    seconds: { en: "Seconds", ta: "வினாடி" } as Text,
    openMap: { en: "Open in Google Maps", ta: "கூகுள் மேப்பில் பார்க்கவும்" } as Text,
    map: { en: "Map", ta: "வரைபடம்" } as Text,
    call: { en: "Call", ta: "அழைக்க" } as Text,
    whatsapp: { en: "WhatsApp", ta: "வாட்ஸ்அப்" } as Text,
    downloadPdf: { en: "Download invitation (PDF)", ta: "அழைப்பிதழ் PDF பதிவிறக்கம்" } as Text,
    preparingPdf: { en: "Preparing your PDF…", ta: "PDF தயாராகிறது…" } as Text,
    pdfFailed: { en: "The PDF could not be made. Please try again.", ta: "PDF உருவாக்க முடியவில்லை. மீண்டும் முயலவும்." } as Text,
    addToCalendar: { en: "Add to Calendar", ta: "நாட்காட்டியில் சேர்க்கவும்" } as Text,
    googleCalendar: { en: "Google Calendar", ta: "கூகுள் நாட்காட்டி" } as Text,
    phoneCalendar: { en: "iPhone or other calendar", ta: "ஐபோன் அல்லது பிற நாட்காட்டி" } as Text,
    calendarEvent: { en: "Wedding of Sonia & Akashy", ta: "சோனியா & ஆகாஷி திருமணம்" } as Text,
    orderInvitation: { en: "Order your invitation", ta: "உங்கள் அழைப்பிதழை ஆர்டர் செய்யவும்" } as Text,
  },

  thangam: {
    collection: {
      en: "Thangam Collection by Menaka Invitations",
      ta: "மேனகா இன்விடேஷன்ஸ் வழங்கும் தங்கம் தொகுப்பு",
    } as Text,
    badge: { en: "Thangam Collection", ta: "தங்கம் தொகுப்பு" } as Text,
    meta: {
      title: "Sonia & Akashy | A Special Invitation For You",
      description:
        "Open your invitation to the wedding of Sonia & Akashy on 4 February 2027 at Sunshine Lawn.",
    },
    couplePhoto: "/shared/photos/couple-framed.webp",
    /** The site changes to its thank-you cover from this moment. */
    thanksFrom: "2027-02-05T00:00:00+05:30",
    /** The family's choice from the curated list. It plays first; guests can change it. */
    music: {
      defaultTrack: "/shared/audio/premium-1.mp3",
      title: { en: "Choose the music", ta: "இசையைத் தேர்வு செய்யவும்" } as Text,
      tracks: [
        { src: "/shared/audio/premium-1.mp3", name: { en: "Song 1", ta: "பாடல் 1" } },
        { src: "/shared/audio/premium-2.mp3", name: { en: "Song 2", ta: "பாடல் 2" } },
        { src: "/shared/audio/premium-3.mp3", name: { en: "Song 3", ta: "பாடல் 3" } },
      ] as { src: string; name: Text }[],
    },
    loader: {
      opening: { en: "Your invitation is opening", ta: "உங்கள் அழைப்பிதழ் திறக்கிறது" } as Text,
    },
    cover: {
      special: { en: "A Special Invitation For You", ta: "உங்களுக்கான சிறப்பு அழைப்பிதழ்" } as Text,
      tap: { en: "Tap to Open", ta: "திறக்க தொடவும்" } as Text,
      openLabel: { en: "Open the envelope", ta: "உறையைத் திறக்கவும்" } as Text,
      cardEyebrow: { en: "The Wedding Of", ta: "திருமண விழா" } as Text,
    },
    thanks: {
      title: { en: "Thank you for blessing us", ta: "எங்களை ஆசீர்வதித்தமைக்கு நன்றி" } as Text,
      message: {
        en: "Your love and presence made our day complete.",
        ta: "உங்கள் அன்பும் வருகையும் எங்கள் நாளை முழுமையாக்கின.",
      } as Text,
      view: { en: "View the invitation", ta: "அழைப்பிதழைப் பார்க்கவும்" } as Text,
      photoAlt: { en: "Sonia and Akashy", ta: "சோனியா மற்றும் ஆகாஷி" } as Text,
    },
    nav: {
      home: { en: "Home", ta: "முகப்பு" } as Text,
      events: { en: "Events", ta: "நிகழ்வுகள்" } as Text,
      story: { en: "Our Story", ta: "எங்கள் கதை" } as Text,
      family: { en: "Family", ta: "குடும்பம்" } as Text,
      gallery: { en: "Gallery", ta: "படங்கள்" } as Text,
      venue: { en: "Venue", ta: "இடம்" } as Text,
      rsvp: { en: "RSVP", ta: "பதில்" } as Text,
    },
    home: {
      eyebrow: { en: "The Wedding Of", ta: "திருமண விழா" } as Text,
      message: {
        en: "With the blessings of our families, we would love you beside us as we begin our life together.",
        ta: "குடும்பத்தினரின் ஆசியுடன் எங்கள் புதிய வாழ்வைத் தொடங்கும் வேளையில், நீங்களும் எங்களுடன் இருக்க விரும்புகிறோம்.",
      } as Text,
      /** Always shown in Tamil, in both languages. */
      tamilLine: "அன்புடன் அழைக்கிறோம், வந்து வாழ்த்துங்கள்",
      photoAlt: { en: "Sonia and Akashy", ta: "சோனியா மற்றும் ஆகாஷி" } as Text,
    },
    countdown: {
      title: { en: "The Big Day", ta: "திருமண நாள்" } as Text,
      untilMuhurtham: { en: "Counting down to the muhurtham", ta: "முகூர்த்த நேரத்திற்கான கவுண்ட்டவுன்" } as Text,
      finalDay: {
        en: "Today is the day! We are so happy you are here with us.",
        ta: "இன்றுதான் அந்த நாள்! நீங்கள் எங்களுடன் இருப்பது பெரும் மகிழ்ச்சி.",
      } as Text,
      married: {
        en: "We are married! Thank you for your blessings.",
        ta: "எங்கள் திருமணம் இனிதே நடந்தது! உங்கள் ஆசிகளுக்கு நன்றி.",
      } as Text,
    },
    events: {
      title: { en: "Wedding Events", ta: "திருமண நிகழ்வுகள்" } as Text,
      hint: { en: "Tap an event for its details", ta: "விவரங்களுக்கு நிகழ்வைத் தொடவும்" } as Text,
    },
    story: {
      title: { en: "Our Story", ta: "எங்கள் கதை" } as Text,
    },
    family: {
      title: { en: "Our Families", ta: "எங்கள் குடும்பங்கள்" } as Text,
      brideSide: { en: "Bride's Side", ta: "மணமகள் வீடு" } as Text,
      groomSide: { en: "Groom's Side", ta: "மணமகன் வீடு" } as Text,
      parents: { en: "Parents", ta: "பெற்றோர்" } as Text,
      blessings: { en: "With the blessings of", ta: "ஆசீர்வாதத்துடன்" } as Text,
      contact: { en: "Contact person", ta: "தொடர்புக்கு" } as Text,
    },
    gallery: {
      title: { en: "Photo Gallery", ta: "புகைப்படங்கள்" } as Text,
      preWedding: { en: "Pre-Wedding Shoot", ta: "திருமணத்திற்கு முந்தைய படங்கள்" } as Text,
      enlarge: { en: "Enlarge photo", ta: "படத்தைப் பெரிதாக்கவும்" } as Text,
      swipe: { en: "Swipe to see more", ta: "மேலும் பார்க்க நகர்த்தவும்" } as Text,
    },
    venue: {
      title: { en: "Venue", ta: "திருமண இடம்" } as Text,
      photoAlt: { en: "The wedding mandap at Sunshine Lawn", ta: "சன்ஷைன் லானில் திருமண மண்டபம்" } as Text,
      mapTitle: { en: "Map of the venue", ta: "திருமண இடத்தின் வரைபடம்" } as Text,
      callDirections: { en: "Call for directions", ta: "வழி கேட்க அழைக்கவும்" } as Text,
      weatherTitle: { en: "Event-day weather", ta: "திருமண நாள் வானிலை" } as Text,
      forecastFrom: { en: "Live forecast opens on", ta: "நேரடி வானிலை அறிக்கை தொடங்கும் நாள்" } as Text,
      rainChance: { en: "chance of rain", ta: "மழை வாய்ப்பு" } as Text,
      weather: {
        clear: { en: "Clear skies", ta: "தெளிவான வானம்" } as Text,
        cloudy: { en: "Partly cloudy", ta: "ஓரளவு மேகமூட்டம்" } as Text,
        rain: { en: "Showers likely", ta: "மழை பெய்யலாம்" } as Text,
        storm: { en: "Thunderstorms likely", ta: "இடியுடன் மழை பெய்யலாம்" } as Text,
      },
    },
    rsvp: {
      title: { en: "Will You Be Joining Us?", ta: "நீங்கள் வருவீர்களா?" } as Text,
      intro: { en: "Please let us know your availability.", ta: "உங்கள் வருகையைத் தெரிவிக்கவும்." } as Text,
      name: { en: "Your name", ta: "உங்கள் பெயர்" } as Text,
      attendingLegend: { en: "Will you attend?", ta: "வருவீர்களா?" } as Text,
      yes: { en: "Yes, with joy", ta: "ஆம், மகிழ்ச்சியுடன்" } as Text,
      no: { en: "Sorry, I can't", ta: "வர இயலவில்லை" } as Text,
      guests: { en: "Number of guests", ta: "விருந்தினர் எண்ணிக்கை" } as Text,
      fewer: { en: "One guest fewer", ta: "ஒருவரைக் குறைக்கவும்" } as Text,
      more: { en: "One guest more", ta: "ஒருவரைச் சேர்க்கவும்" } as Text,
      send: { en: "Send RSVP", ta: "பதில் அனுப்பவும்" } as Text,
      sending: { en: "Sending…", ta: "அனுப்புகிறது…" } as Text,
      thanksYes: { en: "Thank you! We can't wait to see you.", ta: "நன்றி! உங்களைக் காண ஆவலுடன் இருக்கிறோம்." } as Text,
      thanksNo: { en: "Thank you for letting us know. You will be missed.", ta: "தெரிவித்தமைக்கு நன்றி. உங்களை நினைத்துக்கொள்வோம்." } as Text,
      again: { en: "Change my reply", ta: "பதிலை மாற்றவும்" } as Text,
      needName: { en: "Please enter your name.", ta: "உங்கள் பெயரை உள்ளிடவும்." } as Text,
      needChoice: { en: "Please choose yes or no.", ta: "ஆம் அல்லது இல்லை என்பதைத் தேர்வு செய்யவும்." } as Text,
      failed: {
        en: "We couldn't save this just now. You can send it to the family on WhatsApp instead.",
        ta: "இப்போது பதிவு செய்ய இயலவில்லை. வாட்ஸ்அப்பில் குடும்பத்தினருக்கு அனுப்பலாம்.",
      } as Text,
      sendWhatsapp: { en: "Send on WhatsApp", ta: "வாட்ஸ்அப்பில் அனுப்பவும்" } as Text,
      closed: { en: "RSVP has closed. Thank you to everyone who replied.", ta: "பதில் பதிவு நிறைவடைந்தது. பதிலளித்த அனைவருக்கும் நன்றி." } as Text,
      whatsappYes: { en: "will attend the wedding. Guests:", ta: "திருமணத்திற்கு வருகிறார். விருந்தினர்கள்:" } as Text,
      whatsappNo: { en: "cannot attend the wedding, with best wishes.", ta: "திருமணத்திற்கு வர இயலவில்லை, வாழ்த்துகள்." } as Text,
    },
    responses: {
      title: { en: "RSVP List", ta: "பதில் பட்டியல்" } as Text,
      intro: { en: "For the family only. Enter your passcode to see the replies.", ta: "குடும்பத்தினருக்கு மட்டும். பதில்களைப் பார்க்க கடவுக்குறியை உள்ளிடவும்." } as Text,
      passcode: { en: "Passcode", ta: "கடவுக்குறி" } as Text,
      open: { en: "Show the list", ta: "பட்டியலைக் காட்டவும்" } as Text,
      wrong: { en: "That passcode didn't match.", ta: "கடவுக்குறி பொருந்தவில்லை." } as Text,
      unavailable: { en: "The list isn't available yet. Supabase settings are missing.", ta: "பட்டியல் இன்னும் தயாராகவில்லை. Supabase அமைப்புகள் இல்லை." } as Text,
      attending: { en: "Attending", ta: "வருபவர்கள்" } as Text,
      declined: { en: "Can't attend", ta: "வர இயலாதவர்கள்" } as Text,
      totalGuests: { en: "Total guests", ta: "மொத்த விருந்தினர்கள்" } as Text,
      name: { en: "Name", ta: "பெயர்" } as Text,
      reply: { en: "Reply", ta: "பதில்" } as Text,
      guests: { en: "Guests", ta: "விருந்தினர்" } as Text,
      when: { en: "Received", ta: "பெற்ற நேரம்" } as Text,
      yes: { en: "Yes", ta: "ஆம்" } as Text,
      no: { en: "No", ta: "இல்லை" } as Text,
      empty: { en: "No replies yet.", ta: "இன்னும் பதில்கள் இல்லை." } as Text,
      download: { en: "Download list (CSV)", ta: "பட்டியலைப் பதிவிறக்கவும் (CSV)" } as Text,
    },
    gift: {
      /** Optional section. Set to false if the family prefers no gifts here. */
      enabled: true,
      /** Marks the QR as a sample on screen. Set to false with a real UPI ID. */
      sample: true,
      sampleNote: { en: "Sample QR, not for payment", ta: "மாதிரி QR, பணம் அனுப்ப வேண்டாம்" } as Text,
      upiId: "sample.invalid@upi",
      payeeName: "Kumar Family",
      title: { en: "Moi", ta: "மொய்" } as Text,
      line: {
        en: "Your blessings are our greatest gift. If you would still like to send moi, this QR is here for your convenience.",
        ta: "உங்கள் ஆசிகளே எங்களுக்கு மிகப்பெரிய பரிசு. மொய் அனுப்ப விரும்பினால், உங்கள் வசதிக்காக இந்த QR உள்ளது.",
      } as Text,
      qrAlt: { en: "UPI QR code", ta: "UPI QR குறியீடு" } as Text,
      pay: { en: "Open in UPI app", ta: "UPI செயலியில் திறக்கவும்" } as Text,
      copy: { en: "Copy UPI ID", ta: "UPI ஐடியை நகலெடுக்கவும்" } as Text,
      copied: { en: "Copied", ta: "நகலெடுக்கப்பட்டது" } as Text,
    },
    footer: {
      thanks: {
        en: "Thank you for being a part of our special journey!",
        ta: "எங்கள் சிறப்பான பயணத்தில் பங்கேற்றதற்கு நன்றி!",
      } as Text,
      share: { en: "Share on WhatsApp", ta: "வாட்ஸ்அப்பில் பகிரவும்" } as Text,
      shareMessage: {
        en: "You are invited to the wedding of Sonia & Akashy on 4 February 2027.",
        ta: "சோனியா & ஆகாஷி திருமணத்திற்கு 4 பிப்ரவரி 2027 அன்று உங்களை அழைக்கிறோம்.",
      } as Text,
      status: { en: "Download Status image", ta: "ஸ்டேட்டஸ் படத்தைப் பதிவிறக்கவும்" } as Text,
      preparingStatus: { en: "Preparing your image…", ta: "படம் தயாராகிறது…" } as Text,
      statusFailed: { en: "The image could not be made. Please try again.", ta: "படத்தை உருவாக்க முடியவில்லை. மீண்டும் முயலவும்." } as Text,
    },
    files: {
      pdf: "sonia-akashy-thangam-invitation.pdf",
      status: "sonia-akashy-status.jpg",
    },
  },


};

export type Wedding = typeof wedding;
