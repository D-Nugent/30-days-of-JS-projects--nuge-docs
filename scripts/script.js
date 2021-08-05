// Shortcuts:

// Dictionary:
// ctrl+d - definition
// ctrl+s - synonyms
// ctrl+e - examples
// ctrl+y - rhymes

// Styling:
// ctrl+l - justify left
// ctrl+c - justify center
// ctrl+r - justify right
// ctrl+b - bold selected text
// ctrl+i - italicize selected text
// ctrl+u - underline selected text
// ctrl+c - apply color to document
// ctrl+f - toggle font-style

// Other/Tooling:
// shift+p??? - print document
// shift+n?? - new document
// tab - doublespace
const editorPage = document.querySelector('.editor__page');

function getSelectionHTML(){
  var html = "";
  if (typeof window.getSelection != "undefined") {
      var sel = window.getSelection();
      if (sel.rangeCount) {
          var container = document.createElement("div");
          for (var i = 0, len = sel.rangeCount; i < len; ++i) {
              container.appendChild(sel.getRangeAt(i).cloneContents());
          }
          html = container.innerHTML;
      }
  } else if (typeof document.selection != "undefined") {
      if (document.selection.type == "Text") {
          html = document.selection.createRange().htmlText;
      }
  }
  return html;
}


const replaceAndConcat = (start,replaceVal) => {
  if(replaceVal == "") return;
  let docValue = editorPage.innerHTML.split('');
  let htmlStart = editorPage.innerHTML.indexOf(getSelectionHTML(),start);
  let htmlEnd = getSelectionHTML().length;
  let suffix = docValue.slice(htmlStart+htmlEnd).length<1?'&nbsp;':'';
  docValue.splice(htmlStart,htmlEnd,replaceVal+suffix);
  editorPage.innerHTML = docValue.join('');
  // Reset Cursor
  let setPos = document.createRange();
  let set = window.getSelection();
  setPos.setStart(editorPage.childNodes[0],htmlStart+htmlEnd);
  setPos.collapse(true);
  set.removeAllRanges();
  set.addRange(setPos);
  editorPage.focus();
}


const keyBindings = {
  9: () => `&nbsp;&nbsp;`,
  76: (val,active) => (active.anchorNode.parentNode.className == 'emph-center'||active.anchorNode.parentNode.className == 'emph-right') ? active.anchorNode.parentNode.className = "emph-left":`<span class="emph-left">${val}</span>`,
  67: (val,active) => (active.anchorNode.parentNode.className == 'emph-left'||active.anchorNode.parentNode.className == 'emph-right') ? active.anchorNode.parentNode.className = "emph-center":`<span class="emph-center">${val}</span>`,
  // 67: (val,active) => `<span class="emph-center">${val}</span>`,
  82: (val,active) => (active.anchorNode.parentNode.className == 'emph-left'||active.anchorNode.parentNode.className == 'emph-center') ? active.anchorNode.parentNode.className = "emph-right":`<span class="emph-right">${val}</span>`,
  // 82: (val,active) => `<span class="emph-right">${val}</span>`,
  66: (val,active) => active.anchorNode.parentNode.className == 'emph-bold' ? active.anchorNode.parentNode.className = "":`<span class='emph-bold'>${val}</span>`,
  // 66: (val,active) => val.includes('emph-bold')?`${val.replace('emph-bold','')}`:`<span class='emph-bold'>${val}</span>`,
  73: (val,active) => active.anchorNode.parentNode.className == 'emph-italicize' ? active.anchorNode.parentNode.className = "":`<span class='emph-italicize'>${val}</span>`,
  // 73: (val,active) => val.includes('emph-italicize')?`${val.replace('emph-italicize','')}`:`<span class='emph-italicize'>${val}</span>`,
  85: (val,active) => active.anchorNode.parentNode.className == 'emph-underline' ? active.anchorNode.parentNode.className = "":`<span class='emph-underline'>${val}</span>`,
  // 85: (val,active) => val.includes('emph-underline')?`${val.replace('emph-underline','')}`:`<span class='emph-underline'>${val}</span>`,
}

const functionBindings = {
  68: (active) =>  definitionHandler(active),
  69: (active) =>  examplesOfHandler(active),
  83: (active) => synonymsHandler(active),
  89: (active) => rhymesHandler(active),
  80: () => {
    const docName = document.querySelector('.tool__docname');
    const docNameValue = docName.value.length < 1 ? 'My Document' : docName.value;
    editorPage.style.margin = '0';
    html2pdf().set({filename:`${docNameValue}.pdf`}).from(editorPage).save();
  },
}

function shortcutChecker(e) {
  if (e.keyCode===17) return
  if (e.keyCode===9) e.preventDefault();
  if (e.ctrlKey == true) e.preventDefault();
  if (e.ctrlKey == false && e.keyCode!==9) return;
  let activeSelection = document.getSelection();
  console.log(`activeSelection.toString()`, activeSelection.toString())
  const {anchorOffset, focusOffset} = activeSelection;
  let startSel = anchorOffset < focusOffset ? anchorOffset : focusOffset;
  let endSel = anchorOffset > focusOffset ? anchorOffset : focusOffset;
  const functionCodes = [80,68,83,69,89];
  if (functionCodes.includes(e.keyCode)) {
    functionBindings[e.keyCode](activeSelection.toString().trimStart().trimEnd());
    return;
  }
  if (endSel - startSel === 0 && (e.keyCode!==9)) return;
  // let selectedVal = activeSelection.toString();
  console.log(e);
  !!keyBindings[e.keyCode] && replaceAndConcat(startSel,keyBindings[e.keyCode](getSelectionHTML(),activeSelection))
}

document.addEventListener('keydown',shortcutChecker);

function runTool() {
  let keyCode = Number(this.getAttribute('data-key'));
  let activeSelection = document.getSelection();
  const {anchorOffset, focusOffset} = activeSelection;
  let startSel = anchorOffset < focusOffset ? anchorOffset : focusOffset;
  let endSel = anchorOffset > focusOffset ? anchorOffset : focusOffset;
  const functionCodes = [80,68,83,69,89];
  if (functionCodes.includes(keyCode)) {
    functionBindings[keyCode](activeSelection.toString().trimStart().trimEnd());
    return;
  }
  if (endSel - startSel === 0) return;
  !!keyBindings[keyCode] && replaceAndConcat(startSel,keyBindings[keyCode](getSelectionHTML(),activeSelection))
}


function updateFont(){
  editorPage.className = `editor__page --${this.value}`
}

const fontSelector = document.querySelector('.styling__tool.--font');
fontSelector.addEventListener('change',updateFont)

function updateColor(){
  document.documentElement.style.setProperty('--docTextColor',this.value)
}

const colorSelector = document.querySelector('.styling__color');
colorSelector.addEventListener('change',updateColor)

const docTools = document.querySelectorAll('button');
docTools.forEach(tool => tool.addEventListener('click',runTool))