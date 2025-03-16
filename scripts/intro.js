document.addEventListener('DOMContentLoaded', () => {
    const introVideo = document.getElementById('introVideo');
    const introContainer = document.getElementById('introVideoContainer');
  
    // When the video ends, fade it out and remove it.
    introVideo.addEventListener('ended', () => {
      // Optionally add a fade-out effect via CSS transition.
      introContainer.style.transition = 'opacity 1s';
      introContainer.style.opacity = '0';
      setTimeout(() => {
        introContainer.style.display = 'none';
      }, 1000);
    });
  });
  