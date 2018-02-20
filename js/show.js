var context=document.getElementById("mainCanvas").getContext("2d");

function clearCanvas() {
    clearCanvasField();
    currentObject=[];
    historyChannel=[];
    imagesInPicture=[];
    refreshHistory();
}

function clearCanvasField() {
    context.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    context.fillStyle="white";
    context.fillRect(0, 0, mainCanvas.width-1, mainCanvas.height-1);      
    
}

function show(coordinates) {
    clearCanvasField();
    showObjects();
    if (currentTool===BUTTON_CLEAR && coordinates){
        context.restore();
        context.beginPath();
        context.setLineDash([5,2]);
        context.lineWidth=1;
        context.strokeStyle="red";
        context.strokeRect(coordinates.x-(CLEAR_SIZE/2),coordinates.y-(CLEAR_SIZE/2),CLEAR_SIZE,CLEAR_SIZE);
        context.setLineDash([]);         
    }

    
}

function showObjects() {
    currentObject.forEach(element => {
        element.show();
        
    });
    
}

function showWindows() {
    
}