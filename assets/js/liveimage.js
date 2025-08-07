function updateLiveImage() {
  fetch("https://wheresmyscope.mcswain.dev")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }).then((data) => {
      const image = document.querySelector("#liveimage");
      image.src = data.image_url;
      image.onload = function () {
        const container = document.querySelector("#liveimage_container");
        const placeholder = document.querySelector("#liveimage_placeholder");
        const errorMessage = document.querySelector("#liveimage_error");
        const liveTag = document.querySelector("#liveimage_live");
        const title = document.querySelector("#liveimage_title");

        if (data.live) {
          liveTag.classList.remove("hidden");
        } else {
          liveTag.classList.add("hidden");
        }

        image.alt = data.target;
        title.innerText = data.target;
        placeholder.classList.add("hidden");
        errorMessage.classList.add("hidden");
        container.classList.remove("hidden");
      }
    }).catch((error) => {
      const container = document.querySelector("#liveimage_container");
      container.classList.add("hidden");
      const placeholder = document.querySelector("#liveimage_placeholder");
      placeholder.classList.add("hidden");
      const errorMessage = document.querySelector("#liveimage_error");
      errorMessage.classList.remove("hidden");
      console.error("There was a problem with the fetch operation:", error);
    })
}

window.addEventListener("load", function () {
  // Check if the page has a live image element before updating
  if (document.querySelector("#liveimage")) {
    updateLiveImage();
    // Update the live image every 30 seconds
    window.setInterval(updateLiveImage, 30000);
  }
});
