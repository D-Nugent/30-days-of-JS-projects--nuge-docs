let lookupState = {
  definitionOpen:false,
  synonymsOpen:false,
  examplesOfOpen:false,
  rhymesOpen:false
}

const lookupContainer = document.querySelector('.lookup');
const definitionLookup = document.querySelector('.lookup__section.--definition')
const definitionValue = document.querySelector('.lookup__value.--definition')
const synonymsLookup = document.querySelector('.lookup__section.--synonyms')
const synonymsValue = document.querySelector('.lookup__value.--synonyms')
const examplesOfLookup = document.querySelector('.lookup__section.--examples')
const examplesOfValue = document.querySelector('.lookup__value.--examples')
const rhymesLookup = document.querySelector('.lookup__section.--rhymes')
const rhymesValue = document.querySelector('.lookup__value.--rhymes')

function lookupHandler(){
  let stateValues = Object.values(lookupState);
  stateValues.every(value => value == false) ? lookupContainer.classList.remove('--active'): lookupContainer.classList.add('--active')
}

async function definitionHandler(value) {
  const sameWord = definitionValue.querySelector('.def__title')?.innerText.toLowerCase() == value;
  if ((value.length < 1 || (sameWord && lookupState.definitionOpen === true))) {
    lookupState.definitionOpen = false;
    definitionLookup.classList.remove('--active')
    lookupHandler();
    return;
  };
  lookupState.definitionOpen = true;
  lookupHandler();
  definitionLookup.classList.add('--active');
  let definitions = await wordLookup(value,'definitions');
  let valueTitle = `<h4 class="def__title">${value}</h4>`
  let definitionHTML = Object.values(definitions).length > 0 ? definitions.map(word => {
    let part = word.partOfSpeech;
    let def = word.definition;
    return `
      <li class="def">
        <span class="def__part">${part}</span>
        <span class="def__text">${def}</span>
      </li>
    `
  }).join(''):'';
  let noVal = '';
  if(Object.values(definitions).length < 1) {
    noVal = `      
      <li class="def">
        <span class="def__text">There does not appear to be any matches</span>
      </li>
      `
  }
  definitionValue.innerHTML = valueTitle+definitionHTML;
}

async function synonymsHandler(value) {
  const sameWord = synonymsValue.querySelector('.def__title')?.innerText.toLowerCase() == value;
  if ((value.length < 1 || (sameWord && lookupState.synonymsOpen === true))) {
    lookupState.synonymsOpen = false;
    synonymsLookup.classList.remove('--active')
    lookupHandler();
    return;
  };
  lookupState.synonymsOpen = true;
  lookupHandler();
  synonymsLookup.classList.add('--active');
  let synonyms = await wordLookup(value,'synonyms');
  console.log(synonyms);
  let valueTitle = `<h4 class="def__title">${value}</h4>`;
  let synonymsHTML = Object.values(synonyms).length > 0 ? synonyms.map(word => {
    return `
      <li class="def">
        <span class="def__text">${word}</span>
      </li>
    `
  }).join(''):'';
  let noVal = '';
  if(Object.values(synonyms).length < 1) {
    noVal = `      
      <li class="def">
        <span class="def__text">There does not appear to be any matches</span>
      </li>
      `
  }
  synonymsValue.innerHTML = valueTitle+synonymsHTML+noVal;
}

async function examplesOfHandler(value) {
  const sameWord = examplesOfValue.querySelector('.def__title')?.innerText.toLowerCase() == value;
  if ((value.length < 1 || (sameWord && lookupState.examplesOfOpen === true))) {
    lookupState.examplesOfOpen = false;
    examplesOfLookup.classList.remove('--active')
    lookupHandler();
    return;
  };
  lookupState.examplesOfOpen = true;
  lookupHandler();
  examplesOfLookup.classList.add('--active');
  let examplesOf = await wordLookup(value,'hasTypes');
  let valueTitle = `<h4 class="def__title">${value}</h4>`;
  let examplesOfHTML = Object.values(examplesOf).length > 0 ? examplesOf.map(word => {
    return `
      <li class="def">
        <span class="def__text">${word}</span>
      </li>
    `
  }).join(''):'';
  let noVal = '';
  if(Object.values(examplesOf).length < 1) {
    noVal = `      
      <li class="def">
        <span class="def__text">There does not appear to be any matches</span>
      </li>
      `
  }
  examplesOfValue.innerHTML = valueTitle+examplesOfHTML+noVal;
}

async function rhymesHandler(value) {
  const sameWord = rhymesValue.querySelector('.def__title')?.innerText.toLowerCase() == value;
  if ((value.length < 1 || (sameWord && lookupState.rhymesOpen === true))) {
    lookupState.rhymesOpen = false;
    rhymesLookup.classList.remove('--active')
    lookupHandler();
    return;
  };
  lookupState.rhymesOpen = true;
  lookupHandler();
  rhymesLookup.classList.add('--active');
  let rhymes = await wordLookup(value,'rhymes');
  let valueTitle = `<h4 class="def__title">${value}</h4>`;
  let rhymesHTML = Object.values(rhymes).length > 0 ? rhymes.all.map(word => {
    return `
      <li class="def">
        <span class="def__text">${word}</span>
      </li>
    `
  }).join(''):''
  let noVal = ''; 
  if(Object.values(rhymes).length < 1) {
    noVal = `      
      <li class="def">
        <span class="def__text">There does not appear to be any matches</span>
      </li>
      `
  }
  rhymesValue.innerHTML = valueTitle+rhymesHTML+noVal;
}