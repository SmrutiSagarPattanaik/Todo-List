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
function addToLocalStorage(iValue){
    let items;
    if(localStorage.getItem('items')===null){
        items = [];
    } else {
        items = JSON.parse(localStorage.getItem('items'));
    }
    items.push(iValue);
    localStorage.setItem('items',JSON.stringify(items));  
}

//remove item from local storage
function removeFromLocalStorage(iValue){
    let items;
    if(localStorage.getItem('items')===null){
        return;
    } else {
        items = JSON.parse(localStorage.getItem('items'));
    }
    items.forEach((element,index)=>{
        if(element===iValue){
            items.splice(index,1);
        }
    });
    localStorage.setItem('items',JSON.stringify(items));
}

//get item from local storage on page loading
function getFromLocalStorage(){
    let items;
    if(localStorage.getItem('items')===null){
        return;
    } else {
        items = JSON.parse(localStorage.getItem('items'));
    }
    items.forEach((element)=>{
        let listNode = todoListNodeCreate(element);
        document.querySelector('.todo-items-list').appendChild(listNode);

        //updating counter after adding a todo item
        numOfIncompleteItems++;
        counterUpdate(numOfCompletedItems, numOfIncompleteItems);
    });
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
function todoListNodeCreate(iValue){
    let listElement = document.createElement('li');
    listElement.classList.add('todo-item');

    let textValue = document.createElement('div');
    textValue.classList.add('text-value');
    textValue.appendChild(document.createTextNode(`${iValue}`));

    let crossIcon = document.createElement('i');
    crossIcon.classList.add('far','fa-times-circle');

    let tickIcon = document.createElement('i');
    tickIcon.classList.add('far','fa-check-circle');

    let editIcon = document.createElement('i');
    editIcon.classList.add('far', 'fa-edit');

    let allIcons = document.createElement('div');
    allIcons.classList.add('far')
    allIcons.appendChild(crossIcon);
    allIcons.appendChild(tickIcon);
    allIcons.appendChild(editIcon);

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
    addToLocalStorage(itemValue);

    //creating the list node 
    let listNode = todoListNodeCreate(itemValue);

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
        document.querySelector('.item-textbox').value = value;
        event.target.parentElement.parentElement.remove();

        //updating counter after edit
        numOfIncompleteItems--;
        counterUpdate(numOfCompletedItems, numOfIncompleteItems);
    }

    else if (event.target.className==='far fa-times-circle'){

        removeFromLocalStorage(event.target.parentElement.previousElementSibling.textContent);

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

//all todo items clear function
function allItemsClear(){
    document.querySelector('.todo-items-list').innerHTML='';

    clearLocalStorage();

    //updating counter after clearing
    numOfCompletedItems=0;
    numOfIncompleteItems=0;
    counterUpdate(numOfCompletedItems, numOfIncompleteItems);
}
