const apiUrl =  `https://wordsapiv1.p.rapidapi.com/words`;
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
