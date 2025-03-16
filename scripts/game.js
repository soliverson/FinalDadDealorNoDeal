function briefcaseClicked(box) {
    if (!chosenBox) {
      chosenBox = box;
      document.getElementById("gameMessage").textContent =
        `You have chosen box #${box} as your personal box. Now open other boxes by clicking on them.`;
      renderBriefcases();
    } else {
      if (box === chosenBox) return;
      if (openedStatus[box]) return;
      openBriefcase(box);
    }
    updateSidePanels();
    updateRoundIndicator();
  }
  
  function openBriefcase(box) {
    openedStatus[box] = true;
    const briefcase = document.getElementById("briefcase-" + box);
    let clone = briefcase.cloneNode(true);
    clone.innerHTML = `<img class="center-img" src="${boxImages[box]}" alt="Image ${box}">
                       <div class="center-amount">$${boxValues[box].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>`;
    clone.classList.add("center-open");
    document.body.appendChild(clone);
    
    const idx = valuesRemaining.indexOf(boxValues[box]);
    if (idx > -1) valuesRemaining.splice(idx, 1);
    renderBriefcases();
    
    openedCount++;
  
    // Check if only one unopened briefcase (besides the chosen box) remains.
    const unopened = boxes.filter(b => !openedStatus[b] && b !== chosenBox);
    if (unopened.length === 1 && !finalSwapActive) {
      setTimeout(() => finalSwap(), 500);
      return; // Exit early to avoid triggering banker offer.
    }
    
    // Trigger banker offer if enough boxes have been opened and not in final swap mode.
    if (openedCount >= rounds[currentRound]) {
      offerActive = true;
      playSound('offerSound');
      setTimeout(() => {
        offerDeal();
        currentRound++;
        openedCount = 0;
        updateRoundIndicator();
      }, 1000);
    }
    
    setTimeout(() => clone.remove(), 19000);
  }
  
  function finalSwap() {
    finalSwapActive = true;
    offerActive = true;
    document.getElementById("offerContainer").innerHTML = `
      <p class="message">Final decision: Do you want to keep your personal box or swap it with the last remaining briefcase?</p>
      <button class="deal" onclick="keepBox()">Keep My Box</button>
      <button class="decline" onclick="swapBox()">Swap Box</button>
    `;
  }
  
  function keepBox() {
    stopSound('suspenseMusic'); // Stop suspenseful music
    updateGameArea(`
      <p class="message">You kept your personal box (#${chosenBox}). It contains: $${boxValues[chosenBox].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <button onclick="playAgain()">Play Again</button>
    `);
    playSound('applause');
    launchFireworks();
  }
  
  function swapBox() {
    stopSound('suspenseMusic'); // Stop suspenseful music
    const unopened = boxes.filter(b => !openedStatus[b] && b !== chosenBox);
    const swapBox = unopened[0];
    chosenBox = swapBox;
    updateGameArea(`
      <p class="message">You swapped your box. Your new box (#${chosenBox}) contains: $${boxValues[chosenBox].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <button onclick="playAgain()">Play Again</button>
    `);
    playSound('applause');
    launchFireworks();
  }
  
  function getBankersOffer(values) {
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    return sum / values.length;
  }
  
  function offerDeal() {
    const offer = getBankersOffer(valuesRemaining);
    offersHistory.push(offer);
    const offerContainer = document.getElementById("offerContainer");
    offerContainer.innerHTML = `<p class="message">Incoming call from the banker...</p>`;
    setTimeout(() => {
      offerContainer.innerHTML = `
        <p class="message">The banker offers you: $${offer.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p class="message">Deal or No Deal?</p>
        <button class="deal" onclick="acceptDeal(${offer})">Deal</button>
        <button class="decline" onclick="declineDeal()">No Deal</button>
      `;
      // Start suspenseful music when the offer is presented.
      playSound('suspenseMusic');
    }, 5000);
  }
  
  function acceptDeal(offer) {
    stopSound('suspenseMusic'); // Stop suspenseful music when decision is made
    updateGameArea(`
      <p class="message">You accepted the deal of $${offer.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}!</p>
      <p class="message">Your personal box (#${chosenBox}) contained: $${boxValues[chosenBox].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <button onclick="playAgain()">Play Again</button>
    `);
    playSound('applause');
    launchFireworks();
  }
  
  function declineDeal() {
    stopSound('suspenseMusic'); // Stop suspenseful music when decision is made
    playSound('declineSound');
    offerActive = true;
    let countdown = 2;
    const offerElem = document.getElementById("offerContainer");
    const interval = setInterval(() => {
      offerElem.innerText = `Continuing in ${countdown}...`;
      countdown--;
      if (countdown < 0) {
        clearInterval(interval);
        offerElem.innerHTML = "";
        offerActive = false;
        document.getElementById("gameMessage").textContent = "Continue opening boxes by clicking on them.";
        renderBriefcases();
        updateSidePanels();
      }
    }, 1000);
  }
  
  function playAgain() {
    window.location.reload();
  }
  