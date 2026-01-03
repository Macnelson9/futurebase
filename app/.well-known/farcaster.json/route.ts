function withValidProperties(
  properties: Record<string, undefined | string | string[]>
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) =>
      Array.isArray(value) ? value.length > 0 : !!value
    )
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;

  const manifest = {
    accountAssociation: {
      header:
        "eyJmaWQiOjEzMTAzMDcsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgzNjFFNkY3Y2FGN0ZkRGViYTdmOTVBMWQ2OGYxODM3M2ExRTJkY2QxIn0",
      payload: "eyJkb21haW4iOiJmdXR1cmViYXNlLWxpdmUudmVyY2VsLmFwcCJ9",
      signature:
        "7RZv47dKyOaII5C2TofLzko1XDTu+yAIkQTvfY44e9MME74j8hLA8op7a2XKwE88glDWXywzSAROD8dVV1Z2Phw=",
    },
    miniapp: withValidProperties({
      version: "1",
      name: "FutureBase",
      homeUrl: URL,
      iconUrl: `${URL}/futurebase-logo.png`,
      splashImageUrl: `${URL}/futurebase-logo.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: "",
      subtitle: "Send memories to your future self",
      description:
        "Send encrypted time-locked messages to your future self on the blockchain. Control when your memories are revealed.",
      screenshotUrls: [
        `${URL}/screenshots/1.png`,
        `${URL}/screenshots/2.png`,
        `${URL}/screenshots/3.png`,
        `${URL}/screenshots/4.png`,
      ],
      primaryCategory: "social",
      tags: ["messaging", "future", "blockchain", "encrypted"],
      heroImageUrl: `${URL}/screenshots/1.png`,
      tagline: "Remember your future",
      ogTitle: "FutureBase",
      ogDescription:
        "Send encrypted time-locked messages to your future self on the blockchain.",
      ogImageUrl: `${URL}/futurebase-logo.png`,
      noindex: "false",
    }),
  };

  return Response.json(manifest);
}
