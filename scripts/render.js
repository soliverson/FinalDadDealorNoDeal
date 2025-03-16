function renderBriefcases() {
    const container = document.getElementById('briefcasesContainer');
    container.innerHTML = "";
    boxes.forEach(box => {
      const briefcase = document.createElement("div");
      briefcase.className = "briefcase";
      briefcase.id = "briefcase-" + box;
      if (box === chosenBox) {
        briefcase.innerHTML = `<img class="briefcase-img" src="${boxImages[box]}" alt="Image ${box}">
                                <div class="briefcase-number">${box}</div>`;
        briefcase.classList.add("personal");
      } else if (openedStatus[box]) {
        briefcase.innerHTML = `<img class="briefcase-img" src="${boxImages[box]}" alt="Image ${box}">
                                <div class="briefcase-number">$${boxValues[box].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>`;
        briefcase.classList.add("opened");
      } else {
        briefcase.innerHTML = `<img class="briefcase-img" src="${boxImages[box]}" alt="Image ${box}">
                                <div class="briefcase-number">${box}</div>`;
        if (!finalSwapActive) {
          briefcase.onclick = function () {
            if (offerActive) return;
            if (openedStatus[box] || box === chosenBox) return;
            playSound('clickSound');
            briefcaseClicked(box);
          };
        }
      }
      container.appendChild(briefcase);
    });
    
    // Trigger final swap if only one unopened briefcase remains (besides the personal box)
    const unopened = boxes.filter(b => !openedStatus[b] && b !== chosenBox);
    if (unopened.length === 1 && !finalSwapActive) {
      setTimeout(() => finalSwap(), 500);
    }
  }
  
  function updatePrizeBoard() {
    const prizeBoard = document.getElementById('prizeBoard');
    const sortedPrizes = [...prizes].sort((a, b) => a - b);
    prizeBoard.innerHTML = "";
    sortedPrizes.forEach(prize => {
      const li = document.createElement("li");
      li.textContent = "$" + prize.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      if (!valuesRemaining.includes(prize)) li.className = "eliminated";
      prizeBoard.appendChild(li);
    });
  }
  
  function updateOffersHistory() {
    const historyList = document.getElementById('offersHistory');
    historyList.innerHTML = "";
    offersHistory.forEach((offer, index) => {
      const li = document.createElement("li");
      li.textContent = `Offer ${index + 1}: $${offer.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      historyList.appendChild(li);
    });
  }
  
  function updateSidePanels() {
    updatePrizeBoard();
    updateOffersHistory();
  }
  
  function updateRoundIndicator() {
    document.getElementById("roundIndicator").textContent = "Round: " + (currentRound + 1);
  }
  
  function updateGameArea(htmlContent) {
    const gameArea = document.getElementById("briefcasesInfo");
    gameArea.innerHTML = htmlContent;
    updateSidePanels();
  }
  