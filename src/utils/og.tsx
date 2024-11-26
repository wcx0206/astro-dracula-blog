// https://github.com/satnaing/astro-paper/blob/2f82febff4d1af582106be0cc3d618da2d08f600/src/utils/og-templates/post.tsx
// https://github.com/satnaing/astro-paper/blob/2f82febff4d1af582106be0cc3d618da2d08f600/src/utils/generateOgImages.tsx

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { Post } from "@/schemas/post";
import { SITE, AUTHOR } from "@/config";
import type { Lang } from "@/utils/i18n";
import loadGoogleFonts, { type FontOptions } from "./load-google-font";

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(lang: Lang, post: Post) {
  const svg = await satori(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#282A36",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "90%",
          height: "90%",
          background: "#44475A",
          opacity: "0.2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "90%",
            height: "90%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              color: "#FF79C6",
              fontSize: 72,
              fontWeight: "bold",
              maxHeight: "84%",
              overflow: "hidden",
            }}
          >
            {post.data.title}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "8px",
              fontSize: 28,
            }}
          >
            <span>
              <span
                style={{
                  color: "#8BE9FD",
                }}
              >
                by
              </span>{" "}
              <span
                style={{
                  color: "#F8F8F2",
                  overflow: "hidden",
                  fontWeight: "bold",
                }}
              >
                {AUTHOR.name}
              </span>
            </span>
            <span
              style={{
                color: "#F8F8F2",
                overflow: "hidden",
                fontWeight: "bold",
              }}
            >
              {SITE.title[lang]}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: (await loadGoogleFonts(
        post.data.title + SITE.title + "by" + AUTHOR.name
      )) as FontOptions[],
    }
  );
  return svgBufferToPngBuffer(svg);
}
