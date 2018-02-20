

function getCanvasCoordinates(ev) {
    let rect = mainCanvas.getBoundingClientRect();
    return {
        x: Math.floor(ev.clientX - rect.left),
        y: Math.floor(ev.clientY - rect.top)
      };
}

function visibilityOkCancelDiv() {
    isOkCancelVisible ? $(buttonsOkCancelDiv).show() : $(buttonsOkCancelDiv).hide();
}

function addToHistory() {
    currentstepOfHistory++;
    let newCurrentObject= copyArray(currentObject);
    if (historyChannel.length===currentstepOfHistory){ //идём по истории последовательно
        historyChannel.push(currentObject);
    }else{                                      //где-то было undo
        historyChannel[currentstepOfHistory]=currentObject;
        for (let i = (historyChannel.length-1); i>currentstepOfHistory; i--) {
            historyChannel.pop();
        }
    }
    currentObject=newCurrentObject;
    showHistoryList();
}



function copyArray(mass) {
    let result=[];

    if (mass){
        mass.forEach(shape=>{
            result.push(clone(shape));
        });
    }



    return result;
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = Object.create(obj);
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    this.inProcess=false;
    return copy;
}

function setCanvasSize(){
    let context=mainCanvas.getContext("2d");
    context.canvas.width  = window.innerWidth-100;
    context.canvas.height = window.innerHeight-120;      
}

function changeCurrentButtonInLeftMenu(currentValue,newValue) {
    if (currentValue!==newValue){
        let currentElement=document.getElementById(currentValue);
        currentElement.classList.add('toolImage');
        currentElement.classList.remove('toolImageActive');

        currentElement=document.getElementById(newValue);
        currentElement.classList.add('toolImageActive');
        currentElement.classList.remove('toolImage');        
        currentButtonIdInLeftMenu=newValue;

        saveCurrentSettings();
    }
}

function changePictureForLeftMenu(menuElement, newImage) {
    let currentElement=document.getElementById(menuElement);
    currentElement.src=newImage;
}

function minCoordinate(points,value) {
    let result=Number.MAX_SAFE_INTEGER;

    points.forEach(point => {
        let current=value==="x"?point.getX():point.getY();
        result=result>current?current:result;
        
    });

    return result;
}

function maxCoordinate(points,value) {
    let result=Number.MIN_SAFE_INTEGER;

    points.forEach(point => {
        let current=value==="x"?point.getX():point.getY();
        result=result<current?current:result;
    });
    
    return result;
}

function getLineOfText(text,cursorCoordinates){
    let result={"line":0, "position":0}; 
    let line=1;
    let summ=0; //сумма символов по строкам
    for (let i = 1; i < cursorCoordinates.length; i++) {
        summ+=cursorCoordinates[i];
        if (cursorCoordinates[0]<summ){
            summ=cursorCoordinates[0]-summ;
            result={
                "line": line,               //на какой строке сейчас курсор
                "position":summ};           //на какой букве на этой строке
            break;  
        }
        line++;
    }

    return result;

}


function haveObjectOnPoint(coordinates){
    let result=undefined;
    let i=currentObject.length-1;  //потому что надо взять самый верхний объект
    while (i>=0){
        if (currentObject[i]){
            let frame=currentObject[i].getFrame();
            if (coordinates.x<=Math.max(frame[0].getX(),frame[1].getX())   //потому как изначально можно раскрутить рамку влево-вправо-вверх-вниз. Потому и такая проверка
                && coordinates.x>=Math.min(frame[0].getX(),frame[1].getX())
                && coordinates.y<=Math.max(frame[0].getY(),frame[1].getY())
                && coordinates.y>=Math.min(frame[0].getY(),frame[1].getY())){
                result=currentObject[i];
                console.log(result);
                break;
            }

        }
        i--;
    }

    return result;
}

function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}

function downloadImages() {   //все курсоры переместить!!!!
    let img=new Image();
    img.src="./images/cursors/palm3.png";

    cursors["palm"]=img;

    img=new Image();
    img.src="./images/cursors/grab3.png"; 
    cursors["grab"]=img;  
    
    img=new Image();
    img.src="./images/cursors/cursor_pointer.png"; 
    cursors["main"]=img;     
    
    img=new Image();
    img.src="./images/cursors/cursor_pipette.png"; 
    cursors["pipette"]=img;    
    
    img=new Image();
    img.src="./images/cursors/cursor_rotate_bl.png"; 
    cursors["rotate_bottom_left"]=img;    
    
    img=new Image();
    img.src="./images/cursors/cursor_rotate_br.png"; 
    cursors["rotate_bottom_right"]=img;    
    
    img=new Image();
    img.src="./images/cursors/cursor_rotate_tl.png"; 
    cursors["rotate_top_left"]=img;    
    
    img=new Image();
    img.src="./images/cursors/cursor_rotate_tr.png"; 
    cursors["rotate_top_right"]=img;    

    img=new Image();
    img.src="./images/cursors/cursor_adjust_crop_ml_mr.png"; 
    cursors["resize_side1"]=img;    
    
    img=new Image();
    img.src="./images/cursors/cursor_adjust_crop_mt_mb.png"; 
    cursors["resize_side2"]=img;    
    
    img=new Image();
    img.src="./images/cursors/cursor_adjust_crop_size_tl_br.png"; 
    cursors["resize_angle1"]=img;    
    
    img=new Image();
    img.src="./images/cursors/cursor_adjust_crop_size_tr_bl.png"; 
    cursors["resize_angle2"]=img;    
    
    img=new Image();
    img.src="./images/cursors/eraser.png"; 
    cursors["eraser"]=img;      
}

function getAllPointsOfFrame() { //нужна для определения, какое действие мы будем делать при перемещении/трансформации: ротация, перемещение, ресайз через угол, или ресайз через сторону
    let result=[];

    if (objectInProcess){
        let frames=objectInProcess.getFrame(); //левая верхняя точка и правая нижняя
        result=[frames[0],new Point(frames[1].getX(),frames[0].getY()),frames[1],new Point(frames[0].getX(),frames[1].getY())];
    }

    return result;
}

function checkIfSomethingInProgress() {
    if (objectInProcess){
        beep();
        return;
    }
   
    if (isOkCancelVisible){  //Если в процессе редактирования какая-то фигура - скинем её.
        onClickMainMenu(BUTTON_CANCEL);
    }    
}


function openFileDialogAndGetPath(elemId) {
    var elem = document.getElementById(elemId);
    if(elem && document.createEvent) {
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, false);
        elem.dispatchEvent(evt);
    

       return elem.nodeValue;
    }
}

function findPicture(path) {
    for (let i = 0; i < imagesInPicture.length; i++) {
        return imagesInPicture[i].src===path;
    }  
    
    return false;
}


function getImageForToolButton(value) {
    let result='./images/buttons/';
    switch (value) {
        case BUTTON_RECTANGLE:
            result=result+'rectangle.png';
            break;
        case BUTTON_TRIANGLE:
            result=result+'triangle.png';
            break;
        case BUTTON_CIRCLE:
            result=result+'circle.png';
            break;
        case BUTTON_STAR:
            result=result+'star.png';
            break;
        case BUTTON_LINE:
            result=result+'line.png';
            break;
        case BUTTON_POINTS:
            result=result+'pen.png';
            break;
        case BUTTON_CURVE:
            result=result+'curve.png';
            break;
        case BUTTON_SELECT_RECTANGLE:
            result=result+'select.png';
            break;
        case BUTTON_SELECT_LASSO:
            result=result+'selectlasso.png';
            break;

            //case value:
            
            //break;
        default:
            result=result+'none.png';
            break;
    }

    return result;
}

  
function createNewObject() {
    let result={};

    switch (this.type) {
        case "rectangle":
            result=new RectangleShape(this.type);
            break;
        case "triangle":
            result=new TriangleShape(this.type);
            break;
        case "circle":
            result=new CircleShape(this.type);
            break;            
        case "star":
            result=new StarShape(this.type);
            break;
        case "line":
            result=new LineShape(this.type);
            break;
        case "pen":
            result=new PenShape(this.type);
            break;
        case "curve":
            result=new CurveShape(this.type);
            break;
        case "text":
            result=new TextShape(this.type);
            break;            
        case "image":
            result=new ImageShape(this.type);
            break;

        default:
            break;
    }
    
    for (let key in this){
        result[key]=this[key];
        if (typeof (this[key])==="object" && Array.isArray(this[key])){
            result[key]=[];
            this[key].forEach(element => {
                let point=new Point(element.x,element.y);
                if (element.color!==undefined){
                    point=new PointWithColor(element.x,element.y,element.color);
                }
                result[key].push(point);
            });
        }
    }

    return result;
}

function cloneObject(current=objectInProcess) {
    let result=undefined;

    if (current){
        result=createNewObject.call(current);
    }

    return result;

}

function createNewPoint(oldPoint,x,y) {
    let result=new Point(x,y);
    if (oldPoint["color"]){
        point=new PointWithColor(x,y,oldPoint.getColor());
    }
    return result;
    
}

function replaceIntoCurrentObject(value) {
    for (let i = 0; i < currentObject.length; i++) {
        if (currentObject[i].getTime()===value.getTime()){
            currentObject[i]=value;
            break;
        }
    }
    addToHistory();
}

function refreshHistory() {
    
}




































