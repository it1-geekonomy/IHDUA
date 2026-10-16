export const WAVE = { width: 1440, height: 240, lines: 44, step: 24 } as const;

export const NEWSLETTER_GLOW_ID = "newsletter-glow";

function buildWavePaths(): string[] {
  const { width, height, lines, step } = WAVE;
  const paths: string[] = [];

  for (let i = 0; i < lines; i++) {
    const base = (i / (lines - 1)) * height;
    let d = "";

    for (let x = 0; x <= width; x += step) {
      const t = x / width;
      const envelope = Math.exp(-Math.pow((t - 0.42) / 0.28, 2));
      const y =
        base +
        envelope *
          (38 * Math.sin(t * Math.PI * 2.2 + i * 0.16) +
            14 * Math.sin(t * Math.PI * 5 - i * 0.1));
      d += `${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)} `;
    }

    paths.push(d.trim());
  }

  return paths;
}

export const WAVE_PATHS = buildWavePaths();

export type NewsletterStatus = "idle" | "loading" | "success" | "error";

export const NEWSLETTER_DEFAULTS = {
  label: "Stay Connected",
  heading: ["Stories of change,", "straight to your inbox."],
  placeholder: "Your email address",
  buttonLabel: "Subscribe Newsletter",
  successMessage: "Thank you for subscribing!",
  errorMessage: "Something went wrong. Please try again.",
} as const;