/// <reference types="npm:@types/react@18.3.1" />
import { createElement } from "npm:react@18.3.1";
import { Html, Head, Body, Container, Section, Text, Button, Hr } from "npm:@react-email/components@0.0.22";

interface InviteEmailProps {
  confirmationUrl: string;
  siteName?: string;
  siteUrl?: string;
  recipient?: string;
}

export default function InviteEmail({ confirmationUrl, siteName = "Predict Politics" }: InviteEmailProps) {
  const h = createElement;
  return h(Html, null,
    h(Head, null),
    h(Body, { style: main },
      h(Container, { style: container },
        h(Section, { style: logoSection },
          h(Text, { style: logoText }, "⚡ PREDICT POLITICS")
        ),
        h(Hr, { style: divider }),
        h(Text, { style: heading }, "You've been invited"),
        h(Text, { style: paragraph },
          "You've been invited to join ", siteName, ". Predict 2026 race winners and compete on the leaderboard."
        ),
        h(Section, { style: buttonSection },
          h(Button, { style: button, href: confirmationUrl }, "ACCEPT INVITE")
        ),
        h(Text, { style: smallText },
          "If you weren't expecting this invitation, you can ignore this email."
        ),
        h(Hr, { style: divider }),
        h(Text, { style: footer }, siteName, " · predictpolitics.org")
      )
    )
  );
}

const main = { backgroundColor: "#ffffff", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const container = { margin: "0 auto", padding: "40px 24px", maxWidth: "480px" };
const logoSection = { textAlign: "center" as const, marginBottom: "8px" };
const logoText = { fontSize: "20px", fontWeight: "700", color: "#22c55e", fontFamily: "'JetBrains Mono', monospace", margin: "0", letterSpacing: "-0.5px" };
const divider = { borderColor: "#e4e4e7", margin: "24px 0" };
const heading = { fontSize: "22px", fontWeight: "700", color: "#18181b", margin: "0 0 12px" };
const paragraph = { fontSize: "15px", lineHeight: "24px", color: "#52525b", margin: "0 0 24px" };
const buttonSection = { textAlign: "center" as const, margin: "0 0 24px" };
const button = { backgroundColor: "#22c55e", color: "#ffffff", fontSize: "12px", fontWeight: "600", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "1.5px", padding: "12px 32px", borderRadius: "4px", textDecoration: "none", display: "inline-block" };
const smallText = { fontSize: "13px", color: "#a1a1aa", lineHeight: "20px" };
const footer = { fontSize: "11px", color: "#a1a1aa", textAlign: "center" as const, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.5px" };