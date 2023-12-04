import { fetchAstroPage } from "./fetchAstroPage.js";

/**
 * This module provides functions to manage a preview iFrame within the document.
 * It allows for the creation of an initial iFrame and updating its content based on external triggers.
 */

/**
 * Creates the initial iFrame and appends it to the document body.
 * This iFrame is used to load and display the initial content fetched from the Astro page.
 */
export async function setupPreviewIFrameManager() {
  const initialIframe = document.createElement("iframe");
  initialIframe.srcdoc = await fetchAstroPage();
  initialIframe.style.display = "block";
  document.body.appendChild(initialIframe);

  // Event listener for handling iFrame loading events.
  window.addEventListener("message", iFrameLoadedHandler, false);
}

/**
 * Handles the 'iFrameLoaded' event which is sent when the source page within the iFrame is fully loaded.
 * It ensures that the newly loaded iFrame is displayed and the previous one is removed.
 * Also, the scroll position from the previous iFrame is preserved in the new one.
 */
function iFrameLoadedHandler(event) {
  if (event.data && event.data.type === "iFrameLoaded") {
    const allIframes = document.body.querySelectorAll("iframe");
    const newIframe = allIframes[allIframes.length - 1];
    const prevIframe = allIframes.length > 1 ? allIframes[allIframes.length - 2] : null;

    if (prevIframe) {
      newIframe.contentWindow.scrollTo(0, prevIframe.contentWindow.scrollY);
    }

    newIframe.style.display = "block";

    // Hide and remove all iframes except the last one.
    allIframes.forEach((iframe, index) => {
      if (index < allIframes.length - 1) {
        iframe.style.display = "none";
        iframe.remove();
      }
    });
  }
}

/**
 * Updates the content of the preview iFrame.
 * A new iFrame is created with updated content based on the provided story.
 * The new iFrame, upon loading, will replace the existing one.
 * 
 * @param {Object} story - The story data used to update the iFrame content.
 */
export async function updatePage(story) {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = await fetchAstroPage(story);
  document.body.appendChild(iframe);
}
