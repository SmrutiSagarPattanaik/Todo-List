//variables for updating todo items counter
let numOfCompletedItems = 0;
let numOfIncompleteItems = 0;

//UI variables to add event listeners
let addItemButton = document.querySelector('.add-item-button');
let todoList = document.querySelector('.todo-items-list');
let clearAllButton = document.querySelector('.clear-all-button');

//todo list item creation event listener
addItemButton.addEventListener('click', todoItemAdd);

//todo list item manipulation event listener
todoList.addEventListener('click', todoItemManipulate);

//clearing all todo list items event listener
clearAllButton.addEventListener('click', allItemsClear);

//loading items from local storage 
document.addEventListener('DOMContentLoaded',getFromLocalStorage);

//add item to local storage
function addToLocalStorage(iValue, isComplete){
    let items;
    let listSelect;

    (isComplete===false)? listSelect='incompItems' : listSelect='compItems';

    if(localStorage.getItem(listSelect)===null){
        items = [];
    } else {
        items = JSON.parse(localStorage.getItem(listSelect));
    }
    items.push(iValue);
    localStorage.setItem(listSelect,JSON.stringify(items));  
}

//remove item from local storage
function removeFromLocalStorage(iValue, isComplete){
    let items;
    let listSelect;

    (isComplete===false)? listSelect='incompItems' : listSelect='compItems';

    if(localStorage.getItem(listSelect)===null){
        return;
    } else {
        items = JSON.parse(localStorage.getItem(listSelect));
    }
    items.forEach((element,index)=>{
        if(element===iValue){
            items.splice(index,1);
        }
    });
    localStorage.setItem(listSelect,JSON.stringify(items));
}

//get item from local storage on page loading
function getFromLocalStorage(){
    let incompItems;
    let compItems;

    if(localStorage.getItem('incompItems')===null && localStorage.getItem('compItems')===null){
        return;
    } else if(localStorage.getItem('incompItems')!==null && localStorage.getItem('compItems')===null) {
        incompItems = JSON.parse(localStorage.getItem('incompItems'));
    } else if(localStorage.getItem('incompItems')===null && localStorage.getItem('compItems')!==null) {
        compItems = JSON.parse(localStorage.getItem('compItems'));
    } else {
        incompItems = JSON.parse(localStorage.getItem('incompItems'));
        compItems = JSON.parse(localStorage.getItem('compItems'));
    }

    if(incompItems!==undefined){
        incompItems.forEach((element)=>{
            let listNode = todoListNodeCreate(element,false);
            document.querySelector('.todo-items-list').appendChild(listNode);
    
            //updating counter
            numOfIncompleteItems++;
            counterUpdate(numOfCompletedItems, numOfIncompleteItems);
        });
    }

    if(compItems!==undefined){
        compItems.forEach((element)=>{
            let listNode = todoListNodeCreate(element,true);
            document.querySelector('.todo-items-list').appendChild(listNode);
    
            //updating counter
            numOfCompletedItems++;
            counterUpdate(numOfCompletedItems, numOfIncompleteItems);
        });
    }

}

//clear all items from local storage 
function clearLocalStorage(){
    localStorage.clear();
}

//counter updation function
function counterUpdate(compCount, incompCount){
    if(incompCount < 0){
        incompCount=0;
        numOfIncompleteItems=0;
    }
        
    if(compCount < 0){
        compCount=0;
        numOfCompletedItems=0;
    }
        
    document.querySelector('.completed-items-count').innerHTML = `Number of completed items: ${compCount}`;
    document.querySelector('.incomplete-items-count').innerHTML = `Number of incomplete items: ${incompCount}`;
}

//todo list node creation function
function todoListNodeCreate(iValue, isComplete){
    let listElement = document.createElement('li');
    listElement.classList.add('todo-item');

    let textValue = document.createElement('div');
    textValue.classList.add('text-value');
    textValue.appendChild(document.createTextNode(`${iValue}`));
    if(isComplete===true){
        textValue.classList.add('ontick-text-linethrough');
    }

    let crossIcon = document.createElement('i');
    crossIcon.classList.add('far','fa-times-circle');

    let tickIcon = document.createElement('i');
    tickIcon.classList.add('far','fa-check-circle');
    if(isComplete===true){
        tickIcon.classList.add('tick-icon-color-changer');
    }

    let editIcon = document.createElement('i');
    editIcon.classList.add('far', 'fa-edit');

    let allIcons = document.createElement('div');
    allIcons.classList.add('far')
    
    allIcons.appendChild(tickIcon);
    allIcons.appendChild(editIcon);
    allIcons.appendChild(crossIcon);

    listElement.appendChild(textValue);
    listElement.appendChild(allIcons);

    return listElement;
}

//add todo item function
function todoItemAdd(event){
    event.preventDefault();
    let itemValue = document.querySelector('.item-textbox').value;

    //Error handling when empty todo value is added
    if(itemValue===''){
        document.querySelector('.error-message-content').style.display = 'flex';
        setTimeout(()=>{
            document.querySelector('.error-message-content').style.display = 'none';
        },3000);
        return;
    }

    //adding to local storage
    addToLocalStorage(itemValue,false);

    //creating the list node 
    let listNode = todoListNodeCreate(itemValue,false);

    document.querySelector('.todo-items-list').appendChild(listNode);
    document.querySelector('.item-textbox').value = '';

    //updating counter after adding a todo item
    numOfIncompleteItems++;
    counterUpdate(numOfCompletedItems, numOfIncompleteItems);
}

//todo item manipulation function
function todoItemManipulate(event){
    let value;

    if (event.target.className==='far fa-edit'){
        value = event.target.parentElement.parentElement.innerText;

        //handling item removal from local storage based on if it is completed or not
        let tickIcon = event.target.previousElementSibling;
        if(tickIcon.classList.contains('tick-icon-color-changer')){
            removeFromLocalStorage(value,true);
        }else{
            removeFromLocalStorage(value,false);
        }

        //todo item textbox updation in UI
        document.querySelector('.item-textbox').value = value;

        //todo item removal from UI list
        event.target.parentElement.parentElement.remove();

        //updating counter after edit
        numOfIncompleteItems--;
        numOfCompletedItems--;
        counterUpdate(numOfCompletedItems, numOfIncompleteItems);
    }

    else if (event.target.className==='far fa-times-circle'){

        //handling todo item removal from local storage based on if it is completed or not
        let tickIcon = event.target.previousElementSibling.previousElementSibling;
        if(tickIcon.classList.contains('tick-icon-color-changer')){
            removeFromLocalStorage(event.target.parentElement.previousElementSibling.textContent,true);
        } else {
            removeFromLocalStorage(event.target.parentElement.previousElementSibling.textContent,false);
        }

        //todo item removal from UI list
        event.target.parentElement.parentElement.remove();

        //updating counter after delete
        if(numOfCompletedItems===0){
            numOfIncompleteItems--;
        }  
        numOfCompletedItems--;
        counterUpdate(numOfCompletedItems, numOfIncompleteItems);
    }

    else {
        event.target.classList.toggle('tick-icon-color-changer');
        event.target.parentElement.previousElementSibling.classList.toggle('ontick-text-linethrough');

        let iValue = event.target.parentElement.previousElementSibling.textContent;
        //updating counter after completion and also updating local storage
        if(event.target.classList.contains('tick-icon-color-changer')){

            //local storage updation
            removeFromLocalStorage(iValue,false);
            addToLocalStorage(iValue,true);

            //counter updation
            numOfCompletedItems++;
            numOfIncompleteItems--;
            counterUpdate(numOfCompletedItems, numOfIncompleteItems);
        } else {
            
            //local storage updation
            removeFromLocalStorage(iValue,true);
            addToLocalStorage(iValue,false);

            //counter updation
            numOfCompletedItems--;
            numOfIncompleteItems++;
            counterUpdate(numOfCompletedItems, numOfIncompleteItems);
        }
    }
}

//all todo items clear function
function allItemsClear(){
    document.querySelector('.todo-items-list').innerHTML='';

    clearLocalStorage();

    //updating counter after clearing
    numOfCompletedItems=0;
    numOfIncompleteItems=0;
    counterUpdate(numOfCompletedItems, numOfIncompleteItems);
}
