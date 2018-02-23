const BUTTON_MOVE=1, BUTTON_POINTS=21, BUTTON_CURVE=22
    , BUTTON_RECTANGLE=31, BUTTON_TRIANGLE=32, BUTTON_CIRCLE=33, BUTTON_STAR=34, BUTTON_LINE=35
    , BUTTON_CLEAR=4, BUTTON_FILL=5, BUTTON_PIPETTE=6
    , BUTTON_COLOR=71, BUTTON_BACKGROUND_COLOR=72, BUTTON_TEXT=8, BUTTON_IMAGE=9
    , BUTTON_SELECT_RECTANGLE=91, BUTTON_SELECT_LASSO=92, BUTTON_OK=200, BUTTON_CANCEL=400;
const MENU_NEW_FILE=101, MENU_OPEN_FILE=102, MENU_SAVE_FILE=103, MENU_SAVE_FILE_AS=104, MENU_PRINT=105
    , MENU_UNDO=106, MENU_REDU=107, MENU_ABOUT_PROJECT=108, MENU_ABOUT_ME=109;
const PANEL_OPEN=1, PANEL_HIDE=2, PANEL_SHIFT=3, PANEL_SETTINGS=10, PANEL_HISTORY=20;
var isOkCancelVisible=false;
var buttonsOkCancelDiv=null;

var fileDialog;

function onClickByLeftMenu(mode, buttonIdInLeftMenu=currentButtonIdInLeftMenu){
    if (checkIfSomethingInProgress()){
        return;
    }

    document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.main.src+"'), auto";
    switch (mode) {   //var buttonsInLeftMenu=["bMove","bSelect","bPen","bShape","bText","bClear","bFill"];
        case BUTTON_MOVE:  
            buttonIdInLeftMenu="bMove";
            document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.palm.src+"'), auto";
            console.log("onClickByLeftMenu  --- grab3");
            break;
        case BUTTON_POINTS:
            buttonIdInLeftMenu="bPen";
            CURRENT_BUTTON_POINTS=mode;
            saveCurrentSettings();
            changePictureForLeftMenu(buttonIdInLeftMenu, getImageForToolButton(BUTTON_POINTS));
            break;

        case BUTTON_CURVE:
            buttonIdInLeftMenu="bPen";
            CURRENT_BUTTON_POINTS=mode;
            saveCurrentSettings();
            changePictureForLeftMenu(buttonIdInLeftMenu, getImageForToolButton(BUTTON_CURVE));
            break;        

        case BUTTON_RECTANGLE:
            buttonIdInLeftMenu="bShape";
            CURRENT_BUTTON_SHAPE=mode;
            saveCurrentSettings();
            changePictureForLeftMenu(buttonIdInLeftMenu, getImageForToolButton(BUTTON_RECTANGLE));
        
            break;
        case BUTTON_TRIANGLE:
            buttonIdInLeftMenu="bShape";
            CURRENT_BUTTON_SHAPE=mode;
            saveCurrentSettings();
            changePictureForLeftMenu(buttonIdInLeftMenu, getImageForToolButton(BUTTON_TRIANGLE));
    
            break;
        case BUTTON_CIRCLE:
            buttonIdInLeftMenu="bShape";
            CURRENT_BUTTON_SHAPE=mode;
            saveCurrentSettings();
            changePictureForLeftMenu(buttonIdInLeftMenu, getImageForToolButton(BUTTON_CIRCLE));

            break;
        case BUTTON_STAR:
            buttonIdInLeftMenu="bShape";
            CURRENT_BUTTON_SHAPE=mode;
            saveCurrentSettings();
            changePictureForLeftMenu(buttonIdInLeftMenu, getImageForToolButton(BUTTON_STAR));

            break;    
        case BUTTON_LINE:
            buttonIdInLeftMenu="bShape";
            CURRENT_BUTTON_SHAPE=mode;
            saveCurrentSettings();
            changePictureForLeftMenu(buttonIdInLeftMenu, getImageForToolButton(BUTTON_LINE));

            break;  
            
        case BUTTON_IMAGE:
            mainMenu(mode);
            break;             
            
        case BUTTON_CLEAR:
            buttonIdInLeftMenu="bClear";
            document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.eraser.src+"'), auto";
        
        break;
            case BUTTON_FILL:
            buttonIdInLeftMenu="bFill";

            break;
        case BUTTON_PIPETTE:
            buttonIdInLeftMenu="bPipet";            
        
            break;
        case BUTTON_TEXT:
            buttonIdInLeftMenu="bText";
        
            break;
        case BUTTON_SELECT_RECTANGLE:
            buttonIdInLeftMenu="bSelect";
            CURRENT_BUTTON_SELECT=mode;
            saveCurrentSettings();
            changePictureForLeftMenu(buttonIdInLeftMenu, getImageForToolButton(BUTTON_SELECT_RECTANGLE));
            break;
        case BUTTON_SELECT_LASSO:
            buttonIdInLeftMenu="bSelect";
            CURRENT_BUTTON_SELECT=mode;
            saveCurrentSettings();
            changePictureForLeftMenu(buttonIdInLeftMenu, getImageForToolButton(BUTTON_SELECT_LASSO));
            break;        
    
            
    
        default:
            break;
    }
    currentTool=mode;
    changeCurrentButtonInLeftMenu(currentButtonIdInLeftMenu,buttonIdInLeftMenu);
    changePanelSettings();


}

function changeColorForObjects(mode) {
    if (objectInProcess){
        if (mode===BUTTON_COLOR){
            objectInProcess.setColor(document.getElementById("currentColor").value);
        }else if(mode===BUTTON_BACKGROUND_COLOR){
            objectInProcess.setBackgroundColor(document.getElementById("currentBackgroundColor").value);
        }
        replaceIntoCurrentObject(objectInProcess);
        show();  
    }   
}


function mainMenu(mode) {
    let urlOpen=undefined;
    if (checkIfSomethingInProgress()){
        return;
    }


    switch (mode) {
        case MENU_NEW_FILE:
            clearCanvas();
            document.getElementById("savedFile").value="";
            break;
        case MENU_OPEN_FILE: 
            document.getElementById("savedFile").value="";
            fileMode=mode;
            urlOpen=openFileDialogAndGetPath('savedFile');

            break;
        case MENU_SAVE_FILE:  //как image
            fileMode=mode;

           /* var image = mainCanvas.toDataURL();

            var aLink = document.createElement('a');
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("click");
            aLink.download = 'image.png';
            aLink.href = image;
            aLink.dispatchEvent(evt);     
            */       
            var imageData = mainCanvas.toDataURL();
            var image = new Image();
            image.src = imageData;
            Canvas2Image.saveAsJPEG(mainCanvas);
            
            //document.location.href=image;             
            //------------------------------------------------
            break;
        case MENU_SAVE_FILE_AS:  //как свой gsi-формат
            fileMode=mode;

            let str=JSON.stringify(currentObject);
            var file = new Blob([str], {type: 'application/json'});
           // a.href = URL.createObjectURL(file);
              
            let  aTag=document.getElementById("downloader");
            aTag.download = "image.gsi";
            aTag.href=URL.createObjectURL(file);	
            aTag.click();
            

            //------------------------------------------------
            
            break;
        case BUTTON_IMAGE: 
            fileMode=mode;
            urlOpen=openFileDialogAndGetPath('theFilePath');
            break;            
        case MENU_PRINT:
        
            break;
        case MENU_UNDO:
            undo();        
            break;
        case MENU_REDU:
            redo();
            break;
        case MENU_ABOUT_PROJECT:  //можно сделать через модальные окна jQuery. Если время останется
        
        
            break;
        case MENU_ABOUT_ME://можно сделать через модальные окна jQuery. Если время останется
        
            break;   
        default:
            break;
    }

 
    
}



function undo() {
    currentstepOfHistory=currentstepOfHistory>=0?currentstepOfHistory-1:currentstepOfHistory;
    currentObject=currentstepOfHistory===-1?[]:copyArray(historyChannel[currentstepOfHistory]);
    console.log("history: "+currentObject+" from "+historyChannel.length);
    changePanelSettings();
    show();    
}

function redo() {
    currentstepOfHistory=currentstepOfHistory<(historyChannel.length-1)?currentstepOfHistory+1:currentstepOfHistory;
    currentObject=copyArray(historyChannel[currentstepOfHistory]);
    console.log("history: "+currentObject+" from "+historyChannel.length);
    changePanelSettings();
    show();       
}

function newPicture() {
    
}

function savePicture() {
    
}

function saveAsPicture() {
    
}

function About() {
    
}

function showAllWindowsMenu() {
    windowsList.forEach(element => {
        showCloseWindow(element,true);
    });
    
}

function closeAllWindowsMenu() {
    windowsList.forEach(element => {
        showCloseWindow(element,false);
    });    
}

function showCloseWindow(element,mode) {
    
}



//-------------------mainMenu Horizontal ----------------

function onClickMainMenu(value) {
    switch (value) {
        case 200:  //ok
            if (objectInProcess){
                objectInProcess.done();
            }
            selectedObjects.forEach(element =>{
                element.done();
            });
            selectedObjects=[];
            isOkCancelVisible=false;
            
            visibilityOkCancelDiv();
            show();
            objectInProcess=undefined;
            break;
        case 400:  //cancel
            
            isOkCancelVisible=false;
            objectInProcess=undefined;
            visibilityOkCancelDiv();
            selectedObjects.forEach(element =>{
                element.done();
            });
            selectedObjects=[];            
            undo();
            show();
            break;            
    
        default:
            onClickByLeftMenu(value);
            break;
    }
}

jQuery(function($){
    $(".nav-menu").jlnav();
    $(".navigation").detachit();
    $(".details").hide();
    $(".summary").click(function(){
     if($(".details").is(":visible")){
        $(".details").hide(); 
     } else {
         $(".details").show();
     }
    });
    $(".html").click(function(){
     $(this).focus().select();
    });
 });


