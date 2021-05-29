let numOfCompletedItems = 0;
let numOfIncompleteItems = 0;

//counter updation 
function counterUpdate(compCount, incompCount){
    if(incompCount < 0)
        incompCount=0;
    if(compCount < 0)
        compCount=0;
    document.querySelector('.completed-items-count').innerHTML = `Number of completed items: ${compCount}`;
    document.querySelector('.incomplete-items-count').innerHTML = `Number of incomplete items: ${incompCount}`;
}

//todo list item creation
document.querySelector('.add-item-button').addEventListener(
    'click',
    event=>{
        event.preventDefault();
        let itemValue = document.querySelector('.item-textbox').value;

        if(itemValue===''){
            alert('Please enter a valid todo item');
            return;
        }

        let listElement = document.createElement('li');
        listElement.classList.add('todo-item');

        let textValue = document.createElement('div');
        textValue.classList.add('text-value');
        textValue.appendChild(document.createTextNode(`${itemValue}`));

        let crossIcon = document.createElement('i');
        crossIcon.classList.add('cross-icon','far','fa-times-circle');

        let tickIcon = document.createElement('i');
        tickIcon.classList.add('tick-icon','far','fa-check-circle');

        let editIcon = document.createElement('i');
        editIcon.classList.add('edit-icon','far', 'fa-edit');

        let allIcons = document.createElement('div');
        allIcons.classList.add('all-icons')
        allIcons.appendChild(crossIcon);
        allIcons.appendChild(tickIcon);
        allIcons.appendChild(editIcon);

        listElement.appendChild(textValue);
        listElement.appendChild(allIcons);

        document.querySelector('.todo-items-list').appendChild(listElement);
        document.querySelector('.item-textbox').value = '';

        numOfIncompleteItems++;
        counterUpdate(numOfCompletedItems, numOfIncompleteItems);
    }
);

//todo list item manipulation
document.querySelector('.todo-items-list').addEventListener(
    'click',
    event=>{
        let value;

        if (event.target.className==='edit-icon far fa-edit'){
            value = event.target.parentElement.parentElement.innerText;
            document.querySelector('.item-textbox').value = value;
            event.target.parentElement.parentElement.remove();

            //updating counter after edit
            numOfIncompleteItems--;
            counterUpdate(numOfCompletedItems, numOfIncompleteItems);
        }

        else if (event.target.className==='cross-icon far fa-times-circle'){
            event.target.parentElement.parentElement.remove();

            //updating counter after delete
            if(numOfCompletedItems===0)
                numOfIncompleteItems--;
            numOfCompletedItems--;
            counterUpdate(numOfCompletedItems, numOfIncompleteItems);
        }

        else {
            event.target.classList.toggle('tick-icon-color-changer');
            event.target.parentElement.previousElementSibling.classList.toggle('ontick-text-linethrough');

            //updating counter after completion
            if(event.target.classList.contains('tick-icon-color-changer')){
                numOfCompletedItems++;
                numOfIncompleteItems--;
                counterUpdate(numOfCompletedItems, numOfIncompleteItems);
            } else {
                numOfCompletedItems--;
                numOfIncompleteItems++;
                counterUpdate(numOfCompletedItems, numOfIncompleteItems);
            }
        }
    }
);

//clearing all todo list items
document.querySelector('.clear-all-button').addEventListener(
    'click',
    ()=>{
        document.querySelector('.todo-items-list').innerHTML='';
        counterUpdate(0,0);
    }
);
