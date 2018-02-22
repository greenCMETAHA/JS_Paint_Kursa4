function changePanelSettings(currentObject=undefined) {
    let tagDiv=document.getElementById("divSettings");
    switch (currentTool) {
        case BUTTON_RECTANGLE:
            currentObject=currentObject || new RectangleShape();
            break;
        case BUTTON_LINE:
            currentObject=currentObject || new LineShape();
            break;
        case BUTTON_TRIANGLE:
            currentObject=currentObject || new TriangleShape();
            break;
        case BUTTON_CIRCLE:
            currentObject=currentObject || new CircleShape();
            break;
        case BUTTON_POINTS:
            currentObject=currentObject || new PenShape();
            break;
        case BUTTON_CURVE:
            currentObject=currentObject || new CurveShape();
            break;
        case BUTTON_STAR:
            currentObject=currentObject || new StarShape();
            break;
        case BUTTON_TEXT:
            currentObject=currentObject || new TextShape();
            break;
        case BUTTON_IMAGE:
            currentObject=currentObject || new ImageShape();    
            break;
        default:
            currentObject=currentObject || new BaseShape();   //там пусто
            break;
    }
    tagDiv.innerHTML="<h6>"+currentObject.getSettingsPanel()+"</h6>";
}

function isFilledElementSettingsFunction(current=undefined) {
    if (current){
        let elem=document.getElementById("isFilledSettings");
        if (elem){
            current.isFilled(elem.checked);
        }
        replaceIntoCurrentObject(current);
    }
    show();
}

function lineWidthSettingsFunction(current=undefined) {
    if (current){
        let elem=document.getElementById("lineWidthSettings");
        if (elem){
            current.setLineWidth(+elem.value);
        }
        replaceIntoCurrentObject(current);
    }
    show();
}

function rotationSettingsFunction(current=undefined) {
    if (current){
        let elem=document.getElementById("rotationSettings");
        if (elem){
            current.setRotation(+elem.value);
        }
        replaceIntoCurrentObject(current);
    }
    show();
}

function anglesSettingsFunction(current=undefined) {
    if (current){
        let elem=document.getElementById("angelsSettings");
        if (elem){
            current.setAngles(+elem.value);
        }
        replaceIntoCurrentObject(current);
    }
    show();
}

function closePathSettingsFunction(current=undefined) {
    if (current){
        let elem=document.getElementById("closedPathSettings");
        if (elem){
            current.toClosePath(elem.checked);
        }
        replaceIntoCurrentObject(current);
    }
    show();
}

function sizeSettingsFunction(current=undefined) {
    if (current){
        let elem=document.getElementById("sizeSettings");
        if (elem){
            current.setSize(+elem.value);
        }
        replaceIntoCurrentObject(current);
    }
    show();
}

function textIntervalSettingsFunction(current=undefined) {
    if (current){
        let elem=document.getElementById("textIntervalSettings");
        if (elem){
            current.setTextInterval(+elem.value);
        }
        replaceIntoCurrentObject(current);
    }
    show();
}

function linesIntervalSettingsFunction(current=undefined) {
    if (current){
        let elem=document.getElementById("linesIntervalSettings");
        if (elem){
            current.setLinesInterval(+elem.value);
        }
        replaceIntoCurrentObject(current);
    }
    show();
}

function offsetSettingsFunction(current=undefined) {
    if (current){
        let elem=document.getElementById("offsetSettings");
        if (elem){
            current.setOffset(+elem.value);
        }
        replaceIntoCurrentObject(current);
    }
    show();
}

function heightSettingsFunction(current=undefined) {
    if (current){
        let elem=document.getElementById("heightSettings");
        if (elem){
            current.setHeight(+elem.value);
        }
        replaceIntoCurrentObject(current);
    }
    show();
}

function widthSettingsFunction(current=undefined) {
    if (current){
        let elem=document.getElementById("widthSettings");
        if (elem){
            current.setWidth(+elem.value);
        }
        replaceIntoCurrentObject(current);
    }
    show();
}


function getCurrentSettingsForElement() {
    let result={};
    let settings=document.getElementById("divSettings");
    let arr = settings.getElementsByTagName("input");
    for (let i = 0; i < arr.length; i++) {
        let value=arr[i].value;
        let name= arr[i].id.replace("Settings","");
        value=value==="on"?true:(value==="off"?false:+value);
        result[name]=value;
    }
    
    return result;
}