var myUser, myProject, mySprint, myIssue;
var allUsers = [];
var allSprints = [];
var myComments = [];
var allIssues = [];
var myStatus = [];

//Creates random ids
var token = function (min, max) {
    return Math.floor(Math.random()*(max - min)) + min;
}

//Creates options 
function optionMaker(textNode, value, parentElement){
    var opt = document.createElement("option");
    var optText = document.createTextNode(textNode);
    opt.appendChild(optText);
    opt.setAttribute("value", value);
    var element = document.getElementById(parentElement);
    element.appendChild(opt);
}

// Removes options created 
function optionRemover(parentElement) {
    var toRemoveOptions = document.getElementById(parentElement);
    var toRemove = toRemoveOptions.getElementsByTagName("option");
    while(toRemove.length > 0) {
        toRemoveOptions.removeChild(toRemove[0]);
    }
}

//Creates options for filter
document.getElementById("showTasksButton").addEventListener("click", function(){

    optionRemover("taskFilterBySprint");
    optionMaker("All","null","taskFilterBySprint");
    for ( i = 0; i < allSprints.length; i++) {
        optionMaker(allSprints[i].name, allSprints[i].id,"taskFilterBySprint");
    }

    //myStatus.forEach(x => optionMaker(x, x,"taskFilterByStatus"));
})


document.getElementById("submitTaskFilter").addEventListener("click", function(){

    var tempSprint = document.getElementById("taskFilterBySprint").value;
    var tempStatus = document.getElementById("taskFilterByStatus").value;
    
    showTasks(tempSprint,tempStatus);
})

// Shows all issues & sprints on click
function showTasks(sprintName,statusName) {

    var ul = document.getElementById("myToDoList");
    var lis = ul.getElementsByTagName("li");

    while(lis.length > 0) {
        ul.removeChild(lis[0]);
    }
    for (var i = 0; i < allSprints.length; i++) {
        if(sprintName != "null" && sprintName!= allSprints[i].id)
        continue;

        var li = document.createElement("li");
        li.appendChild(document.createTextNode(allSprints[i].name));
        ul.appendChild(li);
        
        var ul2 = document.createElement("ul");
        li.appendChild(ul2);

        for (var j = 0; j < allIssues.length; j++){
            if (statusName != "null" && allIssues[j].status != statusName)
            continue; 

            if(allIssues[j].sprint == allSprints[i].id && allIssues[j].subtask == false){
                var li2 = document.createElement("li");
                li2.appendChild(document.createTextNode(allIssues[j].name + "\t" + allIssues[j].type + "\t" + allIssues[j].status));
                ul2.appendChild(li2);

                if( allIssues[j].tasks.length >0) {
                    var ul3 = document.createElement("ul");
                    li2.appendChild(ul3);

                    for (var k = 0; k < allIssues[j].tasks.length; k++){
                        var li3 = document.createElement("li");
                        li3.appendChild(document.createTextNode(allIssues.filter(e => e.id === allIssues[j].tasks[k].id)[0].name));
                        ul3.appendChild(li3);
                    }
                }
            }            
        }
    }
}

// Username creator on click
document.getElementById("submit").addEventListener("click", function(){

    var myUsername = document.getElementById("uname").value;
    var temp = allUsers.filter(e => e.name === myUsername); 

    if (temp.length > 0) {
        myUser = temp[0];
        localStorage.getItem(myUser.name);
    }
    else {
        myUser = new User(myUsername);
        allUsers.push(myUser);
        localStorage.setItem(myUser.name, myUser.id);
    }
});

// Project creator on click
document.getElementById("createProjectButton").addEventListener("click", function(){
    myProject = new Project([]);
});

// Sprint creator on click
document.getElementById("addSprint").addEventListener("click", function(){
    var sprintName = document.getElementById("spname").value;
    mySprint = new Sprint(sprintName);
    allSprints.push(mySprint);
    myProject.sprints.push(mySprint.id);
});

// Subtask form creator on click
document.getElementById("createSubtaskButton").addEventListener("click", function(){
    optionRemover("subtaskIssue");
    for ( i = 0; i < allIssues.length; i++) {
        if(allIssues[i].type === "feature" || allIssues[i].type === "bug"){
            optionMaker(allIssues[i].type + "/" + allIssues[i].name, allIssues[i].id,"subtaskIssue");
        }
}
})

// Issue form creator on click
document.getElementById("createIssueButton").addEventListener("click", function(){
    optionRemover("issueSprint");
    for ( i = 0; i < allSprints.length; i++) {
    optionMaker(allSprints[i].name, allSprints[i].id,"issueSprint");
}
})

//Issue creator on click
document.getElementById("addIssue").addEventListener("click", function(){
        myIssue = new Issue(myUser.id, document.getElementById("issueType").value, document.getElementById("iname").value,  document.getElementById("issueSprint").value)
        allIssues.push(myIssue); 
     
});

//Subtask creator on click
document.getElementById("addSubtask").addEventListener("click", function(){
    var tempTasks = allIssues.filter(e => e.id == document.getElementById("subtaskIssue").value);
    myIssue = new Issue(myUser.id, "task", document.getElementById("sname").value,  tempTasks[0].sprint);
    myIssue.subtask = true;
    tempTasks[0].tasks.push(myIssue);
    allIssues.push(myIssue);

})

//Comment creator on click
document.getElementById("createCommentButton").addEventListener("click", function(){
    var tempComment = new Comment(document.getElementById("comname").value, myUser.id );
    if (tempComment.name != "") {
        myComments.push(tempComment);
    }
});

//User constructor
function User (value) {
    this.id = token(10000000,1000000);
    this.name = value;
}

//Creates Update form
document.getElementById("createUpdateButton").addEventListener("click", function(){
    optionRemover("updateOptions");
    for ( i = 0; i < allIssues.length; i++) {
        optionMaker(allIssues[i].type + "/" + allIssues[i].name, allIssues[i].id,"updateOptions");
    }
})

//Shows issue to be updated
document.getElementById("updateIssueButton").addEventListener("click", function(){
    myIssue = allIssues.filter(x => x.id == document.getElementById("updateOptions").value)[0];
    var txt = document.createTextNode(JSON.stringify(myIssue, null, "\t"));
    document.getElementById("issueToUpdate").innerHTML = txt.data;
    for( var i = 0; i< allSprints.length; i++) {
        optionMaker(allSprints[i].name, allSprints[i].id,"newIssueSprint");
    } 
    for( i = 0; i< myComments.length; i++) {
        optionMaker(myComments[i].name, myComments[i].id,"newIssueComments");
    } 
    for( i = 0; i< allIssues.length; i++) {
        if(allIssues[i].type == "task") {
            optionMaker(allIssues[i].name, allIssues[i].id,"newIssueTasks");
        }    
    }       
})

//Updates issue
function updateIssue() {
    myIssue.updatedAt = Date();
    myIssue.name = document.getElementById("upname").value;
    myIssue.type = document.getElementById("newIssueType").value;
    myIssue.status = document.getElementById("newIssueStatus").value;
    myIssue.sprint = document.getElementById("newIssueSprint").value;
    myIssue.tasks = document.getElementById("newIssueTasks").value;
    if(myIssue.tasks) {
        myIssue.forEach(x => {
            return x.status = myIssue.status;
        });
    }
    myIssue.comments = document.getElementById("uname").value;
    if (myIssue.type == "bug" || myIssue.type == "feature" || myIssue.tasks == null) {
        myIssue.subtask = false;
    }

}

//Issue constructor
function Issue (givenId, givenType, givenName, givenSprint) {
    this.id = token(1000000,100000);
    this.type = givenType;
    this.name = givenName;
    this.createdBy = givenId;
    this.status = "New";
    this.tasks = []; 
    this.comments = [];
    this.updatedAt = null;
    this.createdAt = Date(); 
    this.sprint = givenSprint;
    this.subtask = false;
}

//Project constructor
function Project(givenSprints){
    this.id = token(10000,1000);
    this.sprints = [];
    this.sprints = givenSprints;
}

//Sprint constructor
function Sprint(value) {
    this.id = token(100000,10000);
    this.name = value;
}

//Comment constructor
function Comment(givenName, givenId){
    this.id = token(1000,100);
    this.name = givenName;
    this.createdBy = givenId;
}