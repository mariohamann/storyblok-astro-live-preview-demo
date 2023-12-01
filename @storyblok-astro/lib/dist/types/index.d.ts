import type { AstroIntegration } from "astro";
import type { ISbConfig, ISbRichtext, SbRichTextOptions, StoryblokBridgeConfigV2, StoryblokClient } from "./types";
export { storyblokEditable, loadStoryblokBridge, RichTextResolver, RichTextSchema, } from "@storyblok/js";
export declare function useStoryblokApi(): StoryblokClient;
export declare function renderRichText(data?: ISbRichtext, options?: SbRichTextOptions): string;
export type IntegrationOptions = {
    /**
     * The access token from your space.
     */
    accessToken: string;
    /**
     *  If you want to use your own method to fetch data from Storyblok, you can disable this behavior by setting `useCustomApi` to `true`, resulting in an optimized final bundle.
     */
    useCustomApi?: boolean;
    /**
     * Set custom API options here (cache, region, and more). All options are documented [here](https://github.com/storyblok/storyblok-js-client#class-storyblok).
     */
    apiOptions?: ISbConfig;
    /**
     * A boolean to enable/disable the Storyblok JavaScript Bridge or provide a StoryblokBridgeConfigV2 configuration object. Enabled by default.
     */
    bridge?: boolean | StoryblokBridgeConfigV2;
    /**
     * An object containing your Astro components to their Storyblok equivalents.
     * Example:
     * ```js
     * components: {
     *   page: "storyblok/Page",
     *   feature: "storyblok/Feature",
     *   grid: "storyblok/Grid",
     *   teaser: "storyblok/Teaser",
     * },
     * ```
     */
    components?: object;
    /**
     * The directory containing your Astro components are. Defaults to "src".
     */
    componentsDir?: string;
    /**
     * Show a fallback component in your frontend if a component is not registered properly.
     */
    enableFallbackComponent?: boolean;
    /**
     * Provide a path to a custom fallback component, e.g. "storyblok/customFallback".
     * Please note: the path takes into account the `componentsDir` option.
     */
    customFallbackComponent?: string;
};
export default function storyblokIntegration(options: IntegrationOptions): AstroIntegration;
export * from "./types";
