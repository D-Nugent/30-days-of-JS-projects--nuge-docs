const apiKey = '09610ee03bmshd81fdb02596dbb8p1b558bjsnaf5aae0226a4';
const apiHost = 'wordsapiv1.p.rapidapi.com';


 const wordLookup = (word, searchType) => {
  return fetch(`${apiUrl}/${word}/${searchType}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost
    }
  })
  .then(response => response.json())
  .then(response => response[searchType])
  .catch(err => {
    console.error(err)
    return '';
  });

}
