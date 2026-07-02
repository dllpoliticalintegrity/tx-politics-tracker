/// <reference types="npm:@types/react@18.3.1" />
import { createElement } from "npm:react@18.3.1";
import { Html, Head, Body, Container, Section, Text, Hr } from "npm:@react-email/components@0.0.22";

interface ReauthenticationEmailProps {
  token: string;
  siteName?: string;
  siteUrl?: string;
  recipient?: string;
}

export default function ReauthenticationEmail({ token, siteName = "Predict Politics" }: ReauthenticationEmailProps) {
  const h = createElement;
  return h(Html, null,
    h(Head, null),
    h(Body, { style: main },
      h(Container, { style: container },
        h(Section, { style: logoSection },
          h(Text, { style: logoText }, "⚡ PREDICT POLITICS")
        ),
        h(Hr, { style: divider }),
        h(Text, { style: heading }, "Verification code"),
        h(Text, { style: paragraph },
          "Enter this code to verify your identity:"
        ),
        h(Section, { style: codeSection },
          h(Text, { style: codeText }, token)
        ),
        h(Text, { style: smallText },
          "This code expires in 10 minutes. If you didn't request this, you can ignore this email."
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
const codeSection = { textAlign: "center" as const, margin: "0 0 24px" };
const codeText = { fontSize: "32px", fontWeight: "700", fontFamily: "'JetBrains Mono', monospace", color: "#22c55e", letterSpacing: "8px", margin: "0", padding: "16px 0", backgroundColor: "#f4f4f5", borderRadius: "4px" };
const smallText = { fontSize: "13px", color: "#a1a1aa", lineHeight: "20px" };
const footer = { fontSize: "11px", color: "#a1a1aa", textAlign: "center" as const, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.5px" };