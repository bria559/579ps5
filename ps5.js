const wordInput = document.querySelector('#word_input');
const showRhymesButton = document.querySelector('#show_rhymes');
const getSimilarButton = document.querySelector('#show_synonyms');
const savedOutput = document.querySelector('#saved_words');
const wordOutput = document.querySelector('#word_output');
const header_description = document.querySelector('#output_description');
const saved_array = []



function getRhymes(rel_rhy, callback) {
    fetch(`https://api.datamuse.com/words?${(new URLSearchParams({rel_rhy})).toString()}`)
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        }, (err) => {
            console.error(err);
        });
}

function getSimilar(ml, callback) {
    fetch(`https://api.datamuse.com/words?${(new URLSearchParams({ml})).toString()}`)
        .then((response) => response.json())
        .then((data) => {
            callback(data);
        }, (err) => {
            console.error(err);
        });
}

function groupBy(objects, property) {
    // If property is not a function, convert it to a function that accepts one argument (an object) and returns that object's
    // value for property (obj[property])
    if(typeof property !== 'function') {
        const propName = property;
        property = (obj) => obj[propName];
    }

    const groupedObjects = new Map(); // Keys: group names, value: list of items in that group
    for(const object of objects) {
        const groupName = property(object);
        //Make sure that the group exists
        if(!groupedObjects.has(groupName)) {
            groupedObjects.set(groupName, []);
        }
        groupedObjects.get(groupName).push(object);
    }

    // Create an object with the results. Sort the keys so that they are in a sensible "order"
    const result = {};
    for(const key of Array.from(groupedObjects.keys()).sort()) {
        result[key] = groupedObjects.get(key);
    }
    return result;
}


function addRhymes(){
    wordOutput.innerHTML = '';
    // savedOutput.innerHTML = '';
    
    let data_retrieved = getRhymes(wordInput.value, (result)=>{
        header_description.textContent = 'Words that rhyme with ' + wordInput.value;
        if (result.length === 0){
            wordOutput.innerHTML = 'No results'
        }
        const groups = groupBy(result, 'numSyllables');
        // console.log(groups)
        for(let key in groups){
            const syllHead = document.createElement('h3');
            if (parseInt(key) > 1){
                syllHead.textContent = key + ' Syllables'
            }
            else{
                syllHead.textContent = key + ' Syllable'

            }
            wordOutput.append(syllHead);

            for (const data in groups[key]){
                let savebtn = document.createElement("button");
                savebtn.innerHTML = '(save)'
                const rhymed_word =  result[data];
                let node  = document.createElement('LI');
                let textnode = document.createTextNode(rhymed_word['word']);
                node.appendChild(textnode);
                node.append(savebtn);
                savebtn.addEventListener('click', ()=>{
                    saved_array.push(rhymed_word['word']);
                    console.log(rhymed_word['word'])
    
                    savedOutput.innerHTML = saved_array.join(' , ');
                });
                wordOutput.append(node);
                }
        }  

        
    } )}



showRhymesButton.addEventListener('click', addRhymes);



function onKeydown(event){
if (event.key ==='Enter'){
    addRhymes();
}
}

wordInput.addEventListener('keydown', onKeydown);

getSimilarButton.addEventListener('click', () =>{
    wordOutput.innerHTML = ''
    let data_retrieved = getSimilar(wordInput.value, (result)=>{
        header_description.textContent = 'Words with a meaning similar to ' + wordInput.value;
       
        if (result.length === 0){
            wordOutput.innerHTML = 'No results'
        }

        for (const data in result){ 
         const similar_word =  result[data];
         let savebtn = document.createElement("button");
         savebtn.innerHTML = '(save)';
         let node  = document.createElement('LI');
         let textnode = document.createTextNode(similar_word['word']);
         node.appendChild(textnode);
         node.append(savebtn);
         savebtn.addEventListener('click', ()=>{
             saved_array.push(similar_word['word']);
             console.log(similar_word['word'])

             savedOutput.innerHTML = saved_array.join(' , ');
         });
         wordOutput.append(node);
     }
    });
 });
