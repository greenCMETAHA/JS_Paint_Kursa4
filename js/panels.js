var panelsOpenSettings={
    "settings":true,
    "history":true
}
function workWithPanel(panel,mode) {
    let currentPanel=null;
    let panelName=""; 
    switch (panel) {
        case PANEL_SETTINGS:
            currentPanel=document.getElementById("settingsDiv");
            panelName="settings";
            break;
        case PANEL_HISTORY:
            currentPanel=document.getElementById("historyPanel");
            panelName="history";
            break;    
        default:
            break;
    }
    if (currentPanel){
        switch (mode) {
            case PANEL_OPEN:
                currentPanel.style.right="0px";
                panelsOpenSettings[panelName]=true;
                break;
            case PANEL_HIDE:
                currentPanel.style.right="-200px";
                panelsOpenSettings[panelName]=false;
                
                break;
            case PANEL_SHIFT:
                currentPanel.style.right=panelsOpenSettings[panelName]?"-120px":"0px";
                panelsOpenSettings[panelName]=!panelsOpenSettings[panelName];
                break;
            default:
                break;
       } 
    }
}

function showHistoryList() {
    let result="<table><tbody>";

    if (panelsOpenSettings.history){ //если всёрнута - облегчим себе работу и не будем всё это выводить
        let numberOfRecords=20;  //выберем только какое-то количество записей
        let actionNumber=Math.max(historyChannel.length-numberOfRecords,0);
        while (actionNumber<historyChannel.length) {
            let action="Действие "+actionNumber;//потом можно сделать из currentObject хэш, и выводить строку с наименованием действия
            if (currentstepOfHistory===actionNumber){
                action="<b>"+action+"</b>";
            }
            result+="<tr><td onclick='onClickHistory("+actionNumber+")'>"+action+"</tr></td>";
            actionNumber++;            
            
        }
    }
    result+="</tbody></table>";

    document.getElementById("historyList").innerHTML=result;

    return result;
}

function onClickHistory(actionNumber) {
    currentObject=currentstepOfHistory===-1?[]:copyArray(historyChannel[actionNumber]);
    currentstepOfHistory=actionNumber;
   // console.log("history: "+currentObject+" from "+historyChannel.length);
    showHistoryList();
    changePanelSettings();
    show();      
    
}


