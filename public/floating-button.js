document.addEventListener('DOMContentLoaded', () => {
  // Create the floating button
  const floatingButton = document.createElement('button');
  floatingButton.className = 'floating-button';
  floatingButton.textContent = '➰'; // Shuffle icon

  // Append the button to the body
  document.body.appendChild(floatingButton);

  // Add click event listener to shuffle cards
  floatingButton.addEventListener('click', () => {
    const mainDiv = document.getElementById('main');
    const cards = Array.from(mainDiv.children);

    // Shuffle the cards array
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    // Re-append the shuffled cards to the main container
    mainDiv.innerHTML = '';
    cards.forEach(card => mainDiv.appendChild(card));
  });
});
