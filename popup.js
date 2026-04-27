async function dataUrlToBlob(dataUrl) {
  const response = await fetch(dataUrl);
  return await response.blob();
}

async function run() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (!tab?.id) {
      console.error("No active tab found.");
      return;
    }

    const dataUrl = await chrome.tabs.captureVisibleTab(
      tab.windowId,
      { format: "png" }
    );

    const blob = await dataUrlToBlob(dataUrl);

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob
      })
    ]);

    console.log("Screenshot copied to Windows clipboard.");

    await chrome.tabs.remove(tab.id);
  } catch (error) {
    console.error("Failed to copy screenshot:", error);
  }
}

run();