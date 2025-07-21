document.addEventListener('DOMContentLoaded', () => {
  
  function addFloatingButton(icon, index, onClick) {
    const floatingButton = document.createElement('button');
    floatingButton.className = 'floating-button';
    floatingButton.textContent = icon;
    floatingButton.style.left = `${20 + index * 70}px`

    document.body.appendChild(floatingButton);
    
    floatingButton.addEventListener('click', onClick)
  }
  
  addFloatingButton('➰', 0, () => {
    const mainDiv = document.getElementById('main');
    const cards = Array.from(mainDiv.children);

    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    mainDiv.innerHTML = '';
    cards.forEach(card => mainDiv.appendChild(card));
  });
  
  addFloatingButton('〰️', 1, () => {
    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(element => {
      element.classList.remove('hidden');
    });
  })
  
});
