import { defineMiddleware, sequence } from "astro:middleware";
import { middleware } from "astro:i18n";
import { defaultLang } from "@/utils/i18n";

export const userMiddleware = defineMiddleware(async (ctx, next) => {
  const path = ctx.url.pathname;
  const response = await next();
  if (path.startsWith("/en")
    || path.startsWith("/zh")
    || path.startsWith("/posts")
    || path.startsWith("/rss.xml")
    || path.startsWith("/robots.txt")
  ) {
    return response;
  }
  return ctx.rewrite(`/${defaultLang}${path}`);
});


export const onRequest = sequence(
  userMiddleware,
  middleware({
    redirectToDefaultLocale: false,
    prefixDefaultLocale: true,
    fallbackType: "rewrite"
  })
)
