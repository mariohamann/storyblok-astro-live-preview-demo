// iframeManager.js
import { fetchAstroPage } from "./fetch-astro-page.js";

export async function createInitialIFrame() {
  const initialIframe = document.createElement("iframe");
  initialIframe.srcdoc = await fetchAstroPage();
  initialIframe.style.display = "block";
  document.body.appendChild(initialIframe);
  return initialIframe;
}

export async function updatePage(story) {
  const iframe = document.createElement("iframe");
  iframe.srcdoc = await fetchAstroPage(story);
  document.body.appendChild(iframe);
}

export function iframeLoaded(event) {
  if (event.data && event.data.type === "iframeLoaded") {
    const allIframes = document.body.querySelectorAll("iframe");
    const newIframe = allIframes[allIframes.length - 1];
    const prevIframe = allIframes.length > 1 ? allIframes[allIframes.length - 2] : null;

    if (prevIframe) {
      newIframe.contentWindow.scrollTo(0, prevIframe.contentWindow.scrollY);
    }

    newIframe.style.display = "block";

    allIframes.forEach((iframe, index) => {
      if (index < allIframes.length - 1) {
        iframe.style.display = "none";
        iframe.remove();
      }
    });
  }
}

export function setupIFrameListeners() {
  window.addEventListener("message", iframeLoaded, false);
}
