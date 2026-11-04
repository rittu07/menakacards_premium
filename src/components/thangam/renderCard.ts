import { wedding, type Lang } from "@/data/wedding";
import { coupleNames, formatDate, formatTimeRange } from "@/lib/format";
import { jpegToPdf } from "@/lib/pdf";
import { artFiles, mehrabPath } from "./art";

const A5_WIDTH_PT = 420;
const colors = { ivory: "#fff6ec", blush: "#fdeee3", burgundy: "#8d1231", gold: "#d7a13e", ink: "#4a1a22" };

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });
}

/** Draws the card on a canvas, where the browser shapes Tamil letters correctly. */
async function drawCard(lang: Lang, width: number, height: number) {
  const root = document.querySelector<HTMLElement>(".thangam");
  if (!root) throw new Error("Thangam root is missing");
  const style = getComputedStyle(root);
  const font = (name: string) => style.getPropertyValue(name).trim();
  const tamil = font("--font-thangam-tamil");
  const body = lang === "ta" ? tamil : font("--font-thangam-body");
  const heading = lang === "ta" ? tamil : font("--font-thangam-heading");
  const script = font("--font-thangam-script");

  const sample = coupleNames(lang);
  await Promise.all(
    (lang === "ta"
      ? [`400 40px ${tamil}`, `700 90px ${tamil}`]
      : [`400 150px ${script}`, `italic 500 60px ${heading}`, `500 40px ${body}`, `600 40px ${body}`]
    ).map((spec) => document.fonts.load(spec, sample)),
  );

  const [topLeft, topRight, bottomLeft, bottomRight, linen, palace, photo] = await Promise.all(
    [
      artFiles.topLeft,
      artFiles.topRight,
      artFiles.bottomLeft,
      artFiles.bottomRight,
      artFiles.linen,
      artFiles.palace,
      wedding.thangam.couplePhoto,
    ].map(loadImage),
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");

  ctx.fillStyle = colors.blush;
  ctx.fillRect(0, 0, width, height);
  const weave = ctx.createPattern(linen, "repeat");
  if (weave) {
    ctx.fillStyle = weave;
    ctx.fillRect(0, 0, width, height);
  }

  const unit = width / 1000;
  const heightOf = (image: HTMLImageElement, w: number) => (w * image.naturalHeight) / image.naturalWidth;
  const center = width / 2;
  const line = (text: string, y: number, spec: string, color: string) => {
    ctx.font = spec;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, center, y);
  };

  // Everything is laid out from the middle, so the tall Status format just gains air.
  const blockHeight = 1090 * unit;
  let y = Math.max(250 * unit, (height - blockHeight) / 2);

  const palaceWidth = 900 * unit;
  ctx.globalAlpha = 0.7;
  ctx.drawImage(palace, center - palaceWidth / 2, height - 340 * unit - heightOf(palace, palaceWidth), palaceWidth, heightOf(palace, palaceWidth));
  ctx.globalAlpha = 1;

  const { thangam, muhurtham, venue } = wedding;
  const italic = lang === "ta" ? "" : "italic ";
  y += 40 * unit;
  line(thangam.home.eyebrow[lang], y, `${italic}500 ${44 * unit}px ${heading}`, colors.ink);
  y += 125 * unit;
  line(
    coupleNames(lang),
    y,
    lang === "ta" ? `700 ${62 * unit}px ${tamil}` : `400 ${108 * unit}px ${script}`,
    colors.burgundy,
  );

  // The couple's photo inside the gold arch.
  y += 55 * unit;
  const frameWidth = 600 * unit;
  const frameHeight = frameWidth / 1.2;
  const frameX = center - frameWidth / 2;
  const arch = new Path2D();
  arch.addPath(new Path2D(mehrabPath), new DOMMatrix().translate(frameX, y).scale(frameWidth, frameHeight));
  ctx.save();
  ctx.clip(arch);
  const scale = Math.max(frameWidth / photo.naturalWidth, frameHeight / photo.naturalHeight);
  const [drawWidth, drawHeight] = [photo.naturalWidth * scale, photo.naturalHeight * scale];
  ctx.drawImage(photo, center - drawWidth / 2, y + frameHeight - drawHeight, drawWidth, drawHeight);
  ctx.restore();
  ctx.strokeStyle = colors.gold;
  ctx.lineWidth = 6 * unit;
  ctx.stroke(arch);

  const bouquet = 290 * unit;
  ctx.drawImage(bottomLeft, frameX - 70 * unit, y + frameHeight + 40 * unit - heightOf(bottomLeft, bouquet), bouquet, heightOf(bottomLeft, bouquet));
  ctx.drawImage(bottomRight, frameX + frameWidth + 70 * unit - bouquet, y + frameHeight + 40 * unit - heightOf(bottomRight, bouquet), bouquet, heightOf(bottomRight, bouquet));

  y += frameHeight + 110 * unit;
  const size = (lang === "ta" ? 34 : 38) * unit;
  line(formatDate(muhurtham.start, lang), y, `600 ${size}px ${body}`, colors.ink);
  y += 55 * unit;
  line(formatTimeRange(muhurtham.start, muhurtham.end, lang), y, `500 ${size}px ${body}`, colors.ink);
  y += 70 * unit;
  line(venue.name[lang], y, `600 ${size}px ${body}`, colors.burgundy);
  y += 55 * unit;
  line(venue.address[lang], y, `500 ${size}px ${body}`, colors.ink);

  const corner = 290 * unit;
  ctx.drawImage(topLeft, 0, 0, corner, heightOf(topLeft, corner));
  ctx.drawImage(topRight, width - corner, 0, corner, heightOf(topRight, corner));
  const foot = 255 * unit;
  ctx.drawImage(bottomLeft, 0, height - heightOf(bottomLeft, foot), foot, heightOf(bottomLeft, foot));
  ctx.drawImage(bottomRight, width - foot, height - heightOf(bottomRight, foot), foot, heightOf(bottomRight, foot));

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  if (!blob) throw new Error("Canvas export failed");
  return blob;
}

export async function renderPdf(lang: Lang) {
  const [width, height] = [1240, 1748];
  const blob = await drawCard(lang, width, height);
  return jpegToPdf(new Uint8Array(await blob.arrayBuffer()), width, height, A5_WIDTH_PT);
}

/** The 9:16 picture for a WhatsApp Status. */
export function renderStatus(lang: Lang) {
  return drawCard(lang, 1080, 1920);
}
