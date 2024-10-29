import { defineMiddleware, sequence } from "astro:middleware";
import { middleware } from "astro:i18n";

export const userMiddleware = defineMiddleware(async (ctx, next) => {
    const path = ctx.url.pathname;
    const response = await next();
    if (path.startsWith("/en") || path.startsWith("/zh")) {
        return response;
    }
    const locale = ctx.preferredLocale === "zh" ? "zh": "en";
    return ctx.redirect(`/${locale}${path}`);
});


export const onRequest = sequence(
  userMiddleware,
  middleware({
    redirectToDefaultLocale: false,
    prefixDefaultLocale: true,
    fallbackType: "redirect"
  })
)
