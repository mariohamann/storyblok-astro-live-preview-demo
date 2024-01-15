# Storyblok Astro Live Preview

## General

This repository shows how to use Storyblok's Live Editing capabilities in combination with Astro.

It follows the main principle: The server (= Astro) is right about what to render and therefore we don't try to fight with DOM morphing etc.

This makes the author experience less snappy in comparison to SPA environments with e. g. Nuxt or SvelteKit (as the server always creates complete new pages which then have to be completely rendered by the browser ON EVERY CHANGE), but on the other hand provides high robustness and makes stuff a lot more predictable.

## Setup

1. Storyblok: Setup a Storyblok space as outlined here https://www.storyblok.com/docs/guide/getting-started
2. Code: Setup an `.env` file with `STORYBLOK_TOKEN = <your token>`
3. Storyblok: Setup `Settings -> Visual Editor`:
    - `https://localhost:4321/` as "Location"
4. Code: Install dependencies via `pnpm i` (`pnpm` is currently needed as I overrode some stuff in `@storyblok/astro` but didn't want rewrite everything there.)
5. Code: `pnpm dev` to start the dev server
6. Storyblok: Switch to the `Home` Story and switch to the `https://localhost:4321/storyblok-preview` preview URL
7. Start editing!

> Note: I used `@storyblok/astro` as a base, but did override the `injectScript` function, as it didn't play well with this setup. I manually initialized the `StorybookBridge` in `src/home.astro`.

## Overview

### 1. Role of `src/pages/storyblok-preview/[...path].astro`

-   **Purpose**: Acts as an intermediary layer that manages the creation and handling of iframes. It catches all preview requests and forwards them to the Astro application.
-   **Functionality**: This route is responsible for creating iframes which load the preview content. It listens to messages from the Storyblok editor and updates the iframe content accordingly.

### 2. Interaction of `src/pages/storyblok-preview/[...path].astro`, `fetchAstroPage.js`, `middleware.js`, and `home.astro`

-   **`[...path].astro`**: Serves as the entry point for preview requests. It creates an environment where iframes can be managed based on the content updates from Storyblok.
-   **`fetchAstroPage.js`**: Used by `[...path].astro` to fetch the updated Astro page content. It makes a POST request to the server with the updated content, which is then rendered inside the iframe.
-   **`middleware.js`**: Intercepts incoming requests to check if they are part of the Storyblok preview. If so, it processes the request and passes the necessary data to the Astro environment or redirects to the preview route.
-   **`home.astro`**: The main entry point of the Astro application, it checks if Storyblok data is present in `Astro.locals` and renders the content accordingly. It plays a vital role in displaying the live preview content.

### 3. Role of the `eventsManager` in Preview and Source

-   **Preview `eventsManager`**: Manages the communication between the Storyblok editor and the preview iframe. It listens for messages from Storyblok and forwards them to the iframe, and vice versa.
-   **Source `eventsManager`**: Overrides the default message routing to ensure that messages from the Storyblok editor are correctly received and handled within the source environment.

### 4. Role of the `iFrameManager` in Preview

-   **Preview `iFrameManager`**: Responsible for initializing and updating iframes in the preview environment. It uses [iframe-swapper](https://www.npmjs.com/package/iframe-swapper), which handles the transition between old and new iframes and maintains the user's scroll position.
