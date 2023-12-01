# Storyblok x Astro Integration

## The `preview` route

1. In Storyblok setup `https://localhost:4321/storyblok-preview` as Preview URL and select it. From now on every requests should go through this wildcard route.
2. The page doesn't contain any content, but instead fetches the requested page from Astro. In the fetch request, `https://localhost:4321/storyblok-preview/whatever...` is automatically altered to `https://localhost:4321/whatever...`.
