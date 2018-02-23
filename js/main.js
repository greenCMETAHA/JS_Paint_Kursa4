var historyChannel=[];
var currentstepOfHistory=-1;
var currentObject=[]; //это текущая картинка, сборка объектов и растров, array
var currentCanvasCoordinates=new Point(0,0);
var objectInProcess=null;
var windowsList=new Set();
var currentTool=BUTTON_MOVE;
var currentPath="";
var listLastFiles=new Set();
var currentColor="ffffffff", currentBackgroundColor="00000000";

var CURRENT_BUTTON_POINTS=BUTTON_POINTS, CURRENT_BUTTON_SHAPE=BUTTON_RECTANGLE, CURRENT_BUTTON_SELECT=BUTTON_SELECT_RECTANGLE;
var mainCanvas=null;
//var buttonsInLeftMenu=["bMove","bSelect","bPen","bShape","bText","bClear","bFill"];
var buttonsInLeftMenu=["bMove","bPen","bShape","bText","bClear","bFill"];
var currentButtonIdInLeftMenu="bMove";

var cursors={};
var selectedObjects=[];
downloadImages();
var imagesInPicture=[];
var fileMode=undefined;


var pressedCtrl=false, pressedShift=false; 
var CLEAR_SIZE=70;
var bErase=false;
var bOverCanvasMouse=false;




start();

function start(){
    historyChannel=[];
    selectedObjects=[];
    imagesInPicture=[];
    currentstepOfHistory=-1;    
    mainCanvas=document.getElementById("mainCanvas");
    setCanvasSize();  //utils   
    buttonsOkCancelDiv=document.getElementById("buttonsOkCancelDiv");
    document.getElementById("currentColor").value="black";
    document.getElementById("currentBackgroundColor").value="white";
    visibilityOkCancelDiv();
    getCurrentSettings(); //взять настройки из localStorage
   // document.onkeydown =keyDownPressFunction;
   // document.onkeypress =keyPressedFunction;
   // document.onkeyup =keyUpPressFunction;
   document.addEventListener('keydown',keyDownPressFunction);
   document.addEventListener('keypress',keyPressedFunction);
   document.addEventListener('keyup',keyUpPressFunction);
    
    mainCanvas.addEventListener("mousedown",(ev)=>{ onCanvasMouseDown(ev);} );
    mainCanvas.addEventListener("mouseup",(ev)=>{ onCanvasMouseUp(ev);} );
    mainCanvas.addEventListener("mousemove", (ev)=>{ onCanvasMouseMove(ev);});
    document.getElementById("settingsDiv").addEventListener('mousemove',(ev)=>{
        bOverCanvasMouse=false;
       // console.log(bOverCanvasMouse);
    });
    //mainCanvas.addEventListener("keydown", (ev)=>{ keyPressFunction(ev);});
    clearCanvas();
    document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.main.src+"'), auto";
    showHistoryList();   
}

function keyUpPressFunction(e) {
   // console.log("keyUp");
    if (e.keyCode===17) { //Ctrl
        pressedCtrl=false;
    }else if (e.keyCode===16){
        pressedShift=false;  //Shift
    }

    show();
    
}

function keyDownPressFunction(e){
    //console.log("keyDown");
    let keyPressed=e.which;
    if (objectInProcess && bOverCanvasMouse){
        objectInProcess.reactionOnKeyDown(e);
    }
}

function keyPressedFunction(e){
    //console.log("keyPressed");
    if (objectInProcess && bOverCanvasMouse){
        if (currentTool===BUTTON_TEXT || currentTool===BUTTON_CURVE){
            e.preventDefault();
        }
        objectInProcess.reactionOnKeyPressed(e);
    }else{ 
        switch (e.keyCode) { //ГОРЯЧИЕ КЛАВИШИ
            case 32: //поменять
            e.preventDefault();
                break;
        
            default:
                break;
        }
    }

    show(); 
}

function getCurrentSettings() { //взять настройки из localStorage
    let current=localStorage.getItem("greenCMETAHA-Paint-January2018");
    current = JSON.parse(current) || {};
    //текущий каталог
    currentPath=current.currentPath || "e://temp"; //Поменять потом
    listLastFiles=current.listLastFiles || "e://temp";
    //текущие значения кнопок в меню
    CURRENT_BUTTON_POINTS=current.BUTTON_POINTS || BUTTON_POINTS; //Поменять потом, когда на одной кнопке будет много назначений
    CURRENT_BUTTON_SHAPE= current.BUTTON_SHAPE || BUTTON_RECTANGLE;   //Поменять потом, когда на одной кнопке будет много назначений
    CURRENT_BUTTON_SELECT=current.BUTTON_SELECT || BUTTON_SELECT_RECTANGLE; //Поменять потом, когда на одной кнопке будет много назначений
    changePictureForLeftMenu("bPen", getImageForToolButton(CURRENT_BUTTON_POINTS));
    changePictureForLeftMenu("bShape", getImageForToolButton(CURRENT_BUTTON_SHAPE));
    //changePictureForLeftMenu("bSelect", getImageForToolButton(CURRENT_BUTTON_SELECT));
}

function saveCurrentSettings() { //настройки - в localStorage
    current={};
    //текущий каталог
    current.currentPath=currentPath;
    current.listLastFiles=listLastFiles;
    //текущие значения кнопок в меню
    current.BUTTON_POINTS=CURRENT_BUTTON_POINTS;
    current.BUTTON_SHAPE=CURRENT_BUTTON_SHAPE;
    current.BUTTON_SELECT=CURRENT_BUTTON_SELECT;

  
    localStorage.setItem("greenCMETAHA-Paint-January2018",JSON.stringify(current));
}

function onCanvasMouseDown(ev){
    ev.preventDefault();
    let coordinates=getCanvasCoordinates(ev);
    //console.log("onCanvasMouseDown(ev) "+coordinates.x+","+coordinates.y);
    onMouseDownShapes(coordinates);

}

function onCanvasMouseMove(ev){
    bOverCanvasMouse=true;
    ev.preventDefault();
    let coordinates=getCanvasCoordinates(ev);
   // isOkCancelVisible=false; //мы произвели действие. Покажем кномки, чтобы пользователь мог сохранить/изменить
   // visibilityOkCancelDiv();
    //console.log("onCanvasMouseMove(ev)"+coordinates.x+","+coordinates.y);   
    onMouseMoveShapes(coordinates,ev.buttons); 
    
  //  console.log(document.getElementsByTagName("canvas")[0].style.cursor);
}


function onCanvasMouseUp(ev){
    ev.preventDefault();
    let coordinates=getCanvasCoordinates(ev);
    isOkCancelVisible=true; //мы произвели действие. Покажем кномки, чтобы пользователь мог сохранить/изменить
    visibilityOkCancelDiv();
    //console.log("onCanvasMouseUp(ev)"+coordinates.x+","+coordinates.y);  
    onMouseUpShapes(coordinates); 
    
}

window.onresize = function(event) {
    setCanvasSize();
};

document.getElementById("theFilePath").addEventListener("change",(ev)=>{ 
    workWithFiles(ev);
});
document.getElementById("savedFile").addEventListener("change",(ev)=>{ workWithFiles(ev);});





function workWithFiles(ev) {
    var files = ev.target.files, fr, data;
    console.log(ev);
    if (fileMode){
        switch (fileMode) {
/*
            var link = document.createElement("a");
 
            link.setAttribute("href", img.src);
            link.setAttribute("download", "canvasImage");
            link.click();
*/

            case MENU_OPEN_FILE:
                file=files[0];
                if (file){
                    if (file.type==="image/jpeg" || file.type==="image/png"){
                        clearCanvas();
                        fr = new FileReader();
                        fr.readAsDataURL(file);
                        fr.onload = (function (file, data) {
                            let img = new Image();
                            img.src = file.target.result;
                            imagesInPicture.push(img);
                            let newImage=new ImageShape("image",img.src, mainCanvas.width, mainCanvas.height, imagesInPicture.length-1);
                            currentObject.push(newImage);
                            addToHistory();
                            document.getElementById("theFilePath").value="";
                            isOkCancelVisible=false;
                            visibilityOkCancelDiv();
                            objectInProcess=undefined;
                            show();
                        });

                    }else {//if (file.type==="gsi") { //наш формат
                        if (window.File && window.FileReader && window.FileList && window.Blob) {
                            // Great success! All the File APIs are supported.
                        } else {
                            alert('The File APIs are not fully supported in this browser.');
                        }

                        fr = new FileReader();
                        fr.readAsText(file);

                        fr.onload = function(ev) {
                            var str = ev.target.result;
                            currentObject=[];
                            objectInProcess=undefined;
                            clearCanvas();

                            let arr=JSON.parse(str);
                            for (let i = 0; i < arr.length; i++) {
                                currentObject.push(cloneObject(arr[i]));
                            }

                            addToHistory();
                            document.getElementById("theFilePath").value="";
                            isOkCancelVisible=false;
                            visibilityOkCancelDiv();
                            objectInProcess=undefined;   
                            show();                         
                        };

                    }

                }
                
                break;
            case MENU_SAVE_FILE:  //как картинку
              /*  var imageData = canvas.toDataURL();
                var image = new Image();
                image.src = imageData;

                window.location.href=image; 
               */ 
                
                
                break;
            case MENU_SAVE_FILE_AS:  //как свой gsi-формат
              
                break;
            case BUTTON_IMAGE:

                for(var i = 0; i < files.length; i++) {    
                    let file = files[i];
                    data = [file.name, file.type, file.size];
                    fr = new FileReader();
                    fr.readAsDataURL(file);
                    fr.onload = (function (file, data) {
                        let img = new Image();
                        img.src = file.target.result;
                        imagesInPicture.push(img);
                        let newImage=new ImageShape("image",img.src, img.width, img.height, imagesInPicture.length-1);
                        currentObject.push(newImage);
                        addToHistory();
                        document.getElementById("theFilePath").value="";
                        isOkCancelVisible=true;
                        visibilityOkCancelDiv();
                        objectInProcess=newImage;
                        getCurrentSettingsForElement(objectInProcess);
                    });
                }
                
                break;                                        
            default:
                break;
        }



    }
    
}

function saveFileDialog (blob, filename, mimetype) {

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
      return;
    }
    
    var a = document.createElement('a'),
        URL = window.URL,
        objectURL;
  
    if (mimetype) {
      a.type = mimetype;
    }
  
    a.download = filename;
    a.href = objectURL = window.URL.createObjectURL(blob);
  
    a.dispatchEvent(new MouseEvent('click'));
    setTimeout(URL.revokeObjectURL.bind(URL, objectURL), 0);
  }



$("#currentColor").spectrum({
        preferredFormat: "rgb",
        showInput: true,
        showPalette: true,        
        togglePaletteOnly: true,
        togglePaletteMoreText: 'more',
        togglePaletteLessText: 'less',
        change: function(color) {
            //console.log("Color");
            changeColorForObjects(BUTTON_COLOR);   
        },        
    //    color: 'black',
        palette: [
            ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
            ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
            ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
            ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
            ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
            ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
            ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
            ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
        ]
});

$("#currentBackgroundColor").spectrum({
    preferredFormat: "rgb",
    showInput: true,
    showPalette: true,       
    togglePaletteOnly: true,
    togglePaletteMoreText: 'more',
    togglePaletteLessText: 'less',
    change: function(color) {
        //console.log("BUTTON_BACKGROUND_COLOR");
        changeColorForObjects(BUTTON_BACKGROUND_COLOR);   
    },
  //  color: 'white',
    palette: [
        ["#000","#444","#666","#999","#ccc","#eee","#f3f3f3","#fff"],
        ["#f00","#f90","#ff0","#0f0","#0ff","#00f","#90f","#f0f"],
        ["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
        ["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
        ["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
        ["#c00","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
        ["#900","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
        ["#600","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"]
    ]
});

