const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const textArea = document.querySelector(".textarea-cont")
const allPriorityColors = document.querySelectorAll(".priority-cont");
const removeBtn = document.querySelector(".remove-btn");
const allTickets = document.querySelectorAll(".ticket-cont"); //The allTickets variable is a NodeList 
// that contains all the DOM elements with the class ticket-cont.
const toolboxColors = document.querySelectorAll(".color");
const ticketsArr = JSON.parse(localStorage.getItem('tickets')) || []; //

//local variables
let modalPriorityColor = 'black';
let addFlag = false;
let removeFlag = false;
const lockClose = "fa-lock";
const lockOpen = "fa-lock-open";
const colors = ["lightpink", "lightgreen", "lightskyblue", "burlywood"];

toolboxColors.forEach(function(colorEle){ //colorEle is the entire div
colorEle.addEventListener("click", function(){
const selectedColor = colorEle.classList[0];
const allTickets = document.querySelectorAll(".ticket-cont");
allTickets.forEach(function(ticket){ //ticket refers to each ticket container (.ticket-cont) in the list
    const ticketColorBand = ticket.querySelector(".ticket-color");
    if(ticketColorBand.style.backgroundColor === selectedColor){
        ticket.style.display = "block";
    } else{
        ticket.style.display = "none";
    }
})
})
colorEle.addEventListener("dblclick", function(){
const allTickets = document.querySelectorAll(".ticket-cont");
allTickets.forEach(function(ticket){
    ticket.style.display = "block";
});
});
})
//Adding Event-Listeners
addBtn.addEventListener("click", function(){
    addFlag = !addFlag; //when clicking on the plus button you are making the addFlag button to true, 
    // then you are checking the condition
    if(addFlag == true){
        modalCont.style.display = "flex";
    } else{
        modalCont.style.display = "none";
    }
});

removeBtn.addEventListener("click", function(){
    removeFlag = !removeFlag; //true
    if(removeFlag){ 
        alert("Delete Button is Activated");
        removeBtn.style.color = "red";
    } else{
        alert("Delete Button is Deactivated");
        removeBtn.style.color = "white";
    }
})

function handleRemove(ticket){ //a single DOM element from the allTickets NodeList.
    //a single DOM element from the allTickets NodeList.
    const id = ticket .querySelector(".ticket-id").innerText;
    ticket.addEventListener("click", function(){
        if(!removeFlag) return; //false, when ticket is clicked if removeFlag is false then nothing happens
        else{
            ticket.remove();
            const ticketIdx = getTicketIdx(id);
            ticketsArr.splice(ticketIdx, 1);
            updateLocalStorage();
        }
    });
}

function handleLock(ticket){ //calling handleLock when the ticket is getting created
    const ticketLockEle = ticket.querySelector(".ticket-lock"); //instead of document.querySelector, 
    //use ticket.querySelector because I want to fetch the lock inside newly created ticket.
    const ticketLockIcon = ticketLockEle.children[0]; //entire italics class.
    const ticketTaskArea = ticket.querySelector(".task-area");
    const id = ticket.querySelector(".ticket-id").innerText;
    ticketLockIcon.addEventListener("click", function(){
        const ticketIdx = getTicketIdx(id);
      console.log("Lock selected");
      if(ticketLockIcon.classList.contains(lockClose)){
          ticketLockIcon.classList.remove(lockClose);
          ticketLockIcon.classList.add(lockOpen);
          ticketTaskArea.setAttribute("contenteditable", "true");
      } else{
          ticketLockIcon.classList.remove(lockOpen);
          ticketLockIcon.classList.add(lockClose);
          ticketTaskArea.setAttribute("contenteditable", "false");
      }
      ticketsArr[ticketIdx].taskContent = ticketTaskArea.innerText;
      updateLocalStorage();
    });
  }

function handleColor(ticket){
  const ticketColorBand = ticket.querySelector(".ticket-color"); //getting the existing color of the ticket
//   console.log(ticketColorBand);
const id = ticket.querySelector(".ticket-id").innerText;
  ticketColorBand.addEventListener("click", function(){
  const ticketIdx = getTicketIdx(id);
  let currentColor = ticketColorBand.style.backgroundColor;
  //   console.log(currentColor);
  let currentColorIdx = colors.findIndex(function(color){ //iterate over the colors array
    return currentColor === color; //return the index if currentColor matches with the color from colors array
  });
  console.log("current color idx:", currentColorIdx);
  currentColorIdx++; //increment the index
  const newTicketColorIdx = currentColorIdx % colors.length;
  const newTicketColor = colors[newTicketColorIdx];
  ticketColorBand.style.backgroundColor = newTicketColor;
  ticketsArr[ticketIdx].ticketColor = newTicketColor;
  updateLocalStorage(); 
  });
}

allTickets.forEach(function(ticket){ //Each element in this NodeList is passed 
// as an argument (ticket) to the forEach method. Example: If there are 3 tickets in the HTML, 
// the forEach loop will pass each <div class="ticket-cont">...</div> element one by one 
// to the handleRemove function. handleRemove inside the allTickets.forEach loop is to 
// attach the "remove" functionality to tickets that already exist in the DOM when the 
// page initially loads.
    handleRemove(ticket); //tickets that exist while initial load time of the doc.
// Pass that ticket as an argument and delete it. 
})


function createTicket(ticketColor, ticketTask, ticketId){
    // debugger;
    const ticketCont = document.createElement("div");
    //ticketCont.classList.add("ticket-cont");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `<div class="ticket-color" style = "background-color: ${ticketColor};"></div>
    <div class="ticket-id">${ticketId}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
    <i class="fa-solid fa-lock"></i>
    </div>`;
    mainCont.appendChild(ticketCont);
    handleRemove(ticketCont); //while creating ticket it's deletion time is also decided, 
    // so this method is called here.
    handleLock(ticketCont); //why passing new ticket is because add listener to the lock of the new tkt.
    handleColor(ticketCont);
}

//Add Listeners on Modal / Popup
modalCont.addEventListener("keydown", function(e){
    const key = e.key; //What key was pressed when a key event occured:
    console.log("target", e.target.value); 
    if(key === "Shift"){
        const taskContent = textArea.value;
        // let ticketId = shortid();
        const ticketId = Math.random().toString(36).substring(2,8);
       createTicket(modalPriorityColor, taskContent, ticketId); //call the createTicket function to create a new ticket
       modalCont.style.display = "none";
       addFlag = false;
       textArea.value = "";
       ticketsArr.push({ticketId, taskContent, ticketColor:modalPriorityColor});//object
    //    localStorage.setItem('tickets', JSON.stringify(ticketsArr));
    updateLocalStorage();
    }
});

function init(){
   if(localStorage.getItem("tickets")){
    ticketsArr.forEach(function(ticket){
        createTicket(ticket.ticketColor, ticket.taskContent, ticket.ticketId);
    });    
   }
}
init();

function getTicketIdx(id){
    const ticketIdx = ticketsArr.findIndex(function(ticket){
        return ticket.ticketId === id;
    })
    return ticketIdx;
}
//except the func.'s the rest of the code are executed while the initial page load. 
//when the script parses HTMl, CSS & JS.
allPriorityColors.forEach(function(colorElement){ //colorElement is the entire div (i.e) <div class="lightpink priority-cont"></div>
colorElement.addEventListener("click", function(){
    allPriorityColors.forEach(function(priorityColorElement){
        priorityColorElement.classList.remove("active");
    });
    colorElement.classList.add("active");
    modalPriorityColor = colorElement.classList[0]; //when the color is clicked, I want to give 
    // the value as colorElement along with all the classes that are present in this 
    // particular element. The color class will be saved in this variable & it can be used later.
    //Basically pass the selected color to the ticket.
});
});

// localStorage.setItem('user', JSON.stringify({name: 'Aadhi', age: 5}));
// const user1 = JSON.parse(localStorage.getItem('user'));
// console.log(user1);
// localStorage.removeItem("user");
// localStorage.clear();

function updateLocalStorage(){
    localStorage.setItem('tickets', JSON.stringify(ticketsArr));
}