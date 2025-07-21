document.addEventListener('DOMContentLoaded', () => {
  const navigationDiv = document.getElementById('navigation');
  const mainDiv = document.getElementById('main');

  function displayDictionary(data) {
    if (data.length === 0) return;

    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-expand-lg navbar-light bg-light';

    const container = document.createElement('div');
    container.className = 'container-fluid';

    const brand = document.createElement('a');
    brand.className = 'navbar-brand';
    brand.href = '#';
    brand.textContent = 'Dictionaries';
    container.appendChild(brand);

    const toggleButton = document.createElement('button');
    toggleButton.className = 'navbar-toggler';
    toggleButton.type = 'button';
    toggleButton.setAttribute('data-bs-toggle', 'collapse');
    toggleButton.setAttribute('data-bs-target', '#navbarNav');
    toggleButton.innerHTML = '<span class="navbar-toggler-icon"></span>';
    container.appendChild(toggleButton);

    const collapseDiv = document.createElement('div');
    collapseDiv.className = 'collapse navbar-collapse';
    collapseDiv.id = 'navbarNav';

    const navList = document.createElement('ul');
    navList.className = 'navbar-nav';

    data.forEach((item, index) => navList.appendChild(displayDictionaryItem(item,  index)));

    collapseDiv.appendChild(navList);
    container.appendChild(collapseDiv);
    nav.appendChild(container);
    navigationDiv.appendChild(nav);
  }
  
  function displayDictionaryItem(item, index) {
    const navItem = document.createElement('li');
    navItem.className = 'nav-item';

    const navLink = document.createElement('a');
    navLink.className = 'nav-link';
    navLink.href = '#';
    navLink.textContent = item.label;

    navLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadDictionary(item.name);

      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-nav');
      });

      navLink.classList.add('active-nav');
    });

    navItem.appendChild(navLink);

    if (index === 0) {
      loadDictionary(item.name);
      navLink.classList.add('active-nav'); // Set the first item as active initially
    }
    
    return navItem

  }
  
  fetch('/api/dict/index')
    .then(response => response.json())
    .then(displayDictionary)
    .catch(error => console.error('Error fetching navigation data:', error));
  
  function createCard(entry) {
    const card = document.createElement('div');
    card.className = 'card text-center';
    card.style.width = '200px';
    card.style.height = '300px';
    card.style.margin = '10px';
    card.style.display = 'inline-block';
    card.style.position = 'relative';

    // Radical element
    const radicalElement = document.createElement('div');
    radicalElement.textContent = entry.radical;
    radicalElement.style.position = 'absolute';
    radicalElement.style.top = '10px';
    radicalElement.style.left = '10px';
    radicalElement.style.color = 'gray';
    radicalElement.style.fontSize = '1rem';

    const charElement = document.createElement('div');
    charElement.textContent = entry.char;
    charElement.style.fontSize = '3rem';
    charElement.style.lineHeight = '300px';
    charElement.style.height = '100%';

    const pinyinElement = document.createElement('div');
    pinyinElement.className = 'pinyin';
    pinyinElement.textContent = entry.pinyin;

    const meaningElement = document.createElement('div');
    meaningElement.className = 'meaning';
    meaningElement.textContent = entry.meaning;

    const pronounceButton = document.createElement('button');
    pronounceButton.textContent = '🔊';
    pronounceButton.style.position = 'absolute';
    pronounceButton.style.top = '10px';
    pronounceButton.style.right = '10px';
    pronounceButton.style.border = 'none';
    pronounceButton.style.background = 'transparent';
    pronounceButton.style.cursor = 'pointer';
    pronounceButton.style.fontSize = '1.5rem';

    pronounceButton.addEventListener('click', () => {
      responsiveVoice.speak(entry.char, "Chinese Female");
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = '✖';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '40px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'transparent';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '1.5rem';

    closeButton.addEventListener('click', () => {
      setTimeout(() => card.classList.add('hidden'), 1000);
    });

    card.appendChild(closeButton);
    card.appendChild(radicalElement);
    card.appendChild(pronounceButton);
    card.appendChild(charElement);
    card.appendChild(pinyinElement);
    card.appendChild(meaningElement);
    return card;
  }

  function loadDictionary(name) {
    fetch(`/api/dict/${name}`)
      .then(response => response.json())
      .then(dictionary => {
        dictionary.sort((a, b) => a.radical.localeCompare(b.radical));
        mainDiv.innerHTML = '';
        dictionary.forEach(entry => {
          mainDiv.appendChild(createCard(entry));
        });
      })
      .catch(error => console.error('Error fetching dictionary:', error));
  }
});
