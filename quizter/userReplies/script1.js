

//
// LAYOUT
//
// let logBox = document.getElementById("logbox");

const replyFormHeading = document.querySelector('.questionBrief');
replyFormHeading.innerHTML = "Вопрос";

const replyInput = document.querySelector("textarea");

// Делаем, чтобы textarea для ввода ответа стала auto resize
// Source: https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize
replyInput.setAttribute("style", "height:" + (replyInput.scrollHeight) + "px;overflow-y:hidden;");
replyInput.setAttribute("style", "height:16px;overflow-y:hidden;");
//answerInputElm.setAttribute("style", "height:" + (answerInputElm.scrollHeight) + "px;overflow-y:hidden;");
replyInput.addEventListener("input", OnInput, false);
function OnInput() {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
}

function onReplySubmitBtnClick() {
	console.log('!!!');
}

const replySubmitBtn = document.querySelector(".button");
replySubmitBtn.addEventListener('click', onReplySubmitBtnClick);

let submittedRepliesHeading = document.createElement('div');
submittedRepliesHeading.classList.add("questionBrief");
submittedRepliesHeading.innerText = 'Вы ответили:';

console.log(submittedRepliesHeading.classList);
// submittedRepliesHeading.style.visibility = 'hidden';

// let submittedRepliesDiv = document.createElement('div');

// document.getElementById('dynamicDiv').appendChild(replyFormHeading);
// document.getElementById('dynamicDiv').appendChild(replyInput);
// document.getElementById('dynamicDiv').appendChild(replySubmitBtn);
document.getElementById('dynamicDiv').appendChild(submittedRepliesHeading);
// document.getElementById('dynamicDiv').appendChild(submittedRepliesDiv);
//
// Конец LAYOUT
//
    

