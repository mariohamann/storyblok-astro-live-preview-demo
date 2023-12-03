// eventHandler.js
import { updatePage } from './iframe-manager.js';

export function setupEventListener() {
  window.addEventListener("message", handleMessageEvent, false);
}

async function handleMessageEvent(event) {
  if (event.origin !== "https://app.storyblok.com") {
    console.log("⏫ forwarding message: nested iFrame → Storyblok", event);
    window.parent.postMessage(event.data, "*"); // This could be more secure
  } else {
    console.log("⏬ forwarding message: Storyblok → nested iFrame", event);

    if (event.data.action === "input") {
      await updatePage(event.data.story);
    } else if (["published", "unpublished"].includes(event.data.action)) {
      location.reload();
    }

    const allIframes = document.body.querySelectorAll("iframe");
    const iframe = allIframes[allIframes.length - 1];
    iframe.contentWindow.postMessage(event.data, "*");
  }
}
