document.addEventListener('DOMContentLoaded', () => {
  const navigationDiv = document.getElementById('navigation');
  const mainDiv = document.getElementById('main');
  
  function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }
  
  function excludeHanzi(hanzi) {
    const list = getExcludedHanzi();
    setCookie('excluded', JSON.stringify([...list, hanzi]), 30);
  }
  
  function getExcludedHanzi() {
    return JSON.parse(getCookie('excluded') ?? '[]')
  }
  
  function isExcluded(hanzi) {
    return getExcludedHanzi().includes(hanzi)
  }

  function displayDictionary(dictionaries) {
    if (dictionaries.length === 0) return;

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

    dictionaries.forEach((dict, index) => navList.appendChild(displayDictNav(dict,  index)));

    collapseDiv.appendChild(navList);
    container.appendChild(collapseDiv);
    nav.appendChild(container);
    navigationDiv.appendChild(nav);
  }
  
  function displayDictNav(item, index) {
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
      setCookie('dictionary', item.name, 30)
    });

    navItem.appendChild(navLink);

    const activeDict = getCookie('dictionary');
    
    if ((activeDict && item.name === activeDict) 
      || (!activeDict && index === 0)) {
      setCookie('dictionary', item.name)
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
      card.classList.add('hidden');
      excludeHanzi(entry.char);
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
    const excluded = getExcludedHanzi()
    fetch(`/api/dict/${name}`)
      .then(response => response.json())
      .then(dictionary => {
        dictionary.sort((a, b) => a.radical.localeCompare(b.radical));
        mainDiv.innerHTML = '';
        dictionary.forEach(entry => {
          const card = createCard(entry)
          if (excluded.includes(entry.char)) {
            card.classList.add('hidden')
          } 
          mainDiv.appendChild(card);
        });
      })
      .catch(error => console.error('Error fetching dictionary:', error));
  }
});
