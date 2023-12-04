/**
 * Sets up event handling in a source iFrame to notify the parent window when it's fully loaded.
 * 
 * This function adds a listener to the 'load' event of the window. Once the iFrame is fully loaded,
 * a message is sent to the parent window after a brief delay to ensure complete rendering. The message
 * indicates readiness to swap the iFrame if necessary.
 */
export function setupSourceIFrameManager() {
  window.addEventListener("load", () => {
    setTimeout(() => {
      // @TODO: Improve security
      window.parent.postMessage({ type: "iFrameLoaded" }, "*");
    }, 100);
  });
}
