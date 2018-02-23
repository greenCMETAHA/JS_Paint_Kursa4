const MOVE_SIDE_TOP=10, MOVE_SIDE_BOTTOM=11, MOVE_SIDE_LEFT=12, MOVE_SIDE_RIGHT=13
    , MOVE_ROTATE_ANGLE_0=20, MOVE_ROTATE_ANGLE_1=21, MOVE_ROTATE_ANGLE_2=22, MOVE_ROTATE_ANGLE_3=20
    , MOVE_ANGLE_0=40, MOVE_ANGLE_1=41, MOVE_ANGLE_2=42, MOVE_ANGLE_3=43,             MOVE_MOVE_ALL=3;
var moveMode=undefined;

function onMouseDownShapes(coordinates) {
    if (!isOkCancelVisible){
        let colorValue=document.getElementById("currentColor").value;
        let backgroundColorValue=document.getElementById("currentBackgroundColor").value;
        let settings=getCurrentSettingsForElement();
        let linewidth=2;
        switch (currentTool) {
            case BUTTON_RECTANGLE:
                objectInProcess=new RectangleShape("rectangle",colorValue,settings.isFilled,backgroundColorValue,settings.lineWidth
                    ,new Point(coordinates.x,coordinates.y));
                objectInProcess.onMouseDown();             
                break;
            case BUTTON_CIRCLE:
                let rotation=0;   //для Объекта сделать панель
                objectInProcess=new CircleShape("circle",colorValue,settings.isFilled,backgroundColorValue,settings.lineWidth
                    ,new Point(coordinates.x,coordinates.y),settings.rotation);
                objectInProcess.onMouseDown();             
                break;                
            case BUTTON_TRIANGLE:
                objectInProcess=new TriangleShape("triangle",colorValue,settings.isFilled,backgroundColorValue,settings.lineWidth
                    ,new Point(coordinates.x,coordinates.y));
                objectInProcess.onMouseDown();              
                break; 
            case BUTTON_STAR:
                //let angles=5;   //для Объекта сделать панель
                objectInProcess=new StarShape("star",colorValue,settings.isFilled,backgroundColorValue,settings.lineWidth
                    ,new Point(coordinates.x,coordinates.y),settings.angles);
                objectInProcess.onMouseDown();               
                break;                                 
            case BUTTON_LINE:
                objectInProcess=new LineShape("line",colorValue,false,backgroundColorValue,settings.lineWidth
                    ,new Point(coordinates.x,coordinates.y));
                currentObject.push(objectInProcess);
                addToHistory();   
                isOkCancelVisible=true;             
                break;                
            case BUTTON_POINTS:  
                objectInProcess=new PenShape("pen",colorValue,false,backgroundColorValue,settings.lineWidth
                    ,new PointWithColor(coordinates.x,coordinates.y,colorValue));
                objectInProcess.onMouseDown();               
                break;  
                
            case BUTTON_CURVE:  
                objectInProcess=new CurveShape("curve",colorValue,settings.isFilled,backgroundColorValue,settings.lineWidth
                    ,new PointWithColor(coordinates.x,coordinates.y,colorValue));
                objectInProcess.onMouseDown();             
                break;  

            case BUTTON_TEXT:
                objectInProcess=new TextShape("text",colorValue,false,backgroundColorValue,settings.lineWidth
                    ,new Point(coordinates.x,coordinates.y),undefined,settings.size,settings.textInterval,settings.linesInterval
                    ,settings.offset);
                objectInProcess.onMouseDown();
                break;  
            case BUTTON_MOVE:    //выделение объекта
                addToHistory();  
                break; 
            case BUTTON_CLEAR:    //выделение объекта
                //selectObject(coordinates);            
                //addToHistory(); 
                break;                   
                              
            default:
                break; 
        }
       
        
    }else{
        currentCanvasCoordinates=new Point(coordinates.x,coordinates.y);
    }
    
}

function onMouseMoveShapes(coordinates,buttonPressed) {
    switch (currentTool) {
        case BUTTON_MOVE:
            document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.main.src+"'), auto";           
            break;
        case BUTTON_CLEAR:
            document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.eraser.src+"'), auto";
            break;
        case BUTTON_PIPETTE:
            document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.pipette.src+"'), auto";
            break;            
        default:
            break;
    }

    if (isOkCancelVisible && buttonPressed===1 && objectInProcess) {  //тянут с левой кнопкой 
        switch (currentTool) {
            case BUTTON_MOVE:    //выделение объекта
                let all4Points=getAllPointsOfFrame(objectInProcess);
                let yOffset=0, xOffset=0;

                switch (moveMode) {
                    case MOVE_SIDE_TOP:
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_side2.src+"'), auto";
                        yOffset=currentCanvasCoordinates.getY()-coordinates.y;
                        if (objectInProcess.points.length===2){
                            objectInProcess.points[0]=new Point(objectInProcess.points[0].getX(), objectInProcess.points[0].getY()-yOffset);
                        }else{
                            let y1=minCoordinate(objectInProcess.points,"y");
                            let y2=maxCoordinate(objectInProcess.points,"y");
                        
                            let newPoints=[];
                            objectInProcess.points.forEach(element => {
                                let newY=y2-((y2-element.getY())*((y2-y1)/(y2-y1-yOffset)));
                                newPoints.push(createNewPoint(element,element.getX(),newY));
                                
                            });                            
                            objectInProcess.points=newPoints;
                        };
                        currentCanvasCoordinates=new Point(coordinates.x,coordinates.y); 
                        objectInProcess.createFrame();
                        replaceIntoCurrentObject(objectInProcess);
                       
                        break;
                    case MOVE_SIDE_BOTTOM: 
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_side2.src+"'), auto"; 
                        yOffset=currentCanvasCoordinates.getY()-coordinates.y;
                        if (objectInProcess.points.length===2){
                            objectInProcess.points[1]=new Point(objectInProcess.points[1].getX(), objectInProcess.points[1].getY()-yOffset);
                        }else{
                            let y1=minCoordinate(objectInProcess.points,"y");
                            let y2=maxCoordinate(objectInProcess.points,"y");
                        
                            let newPoints=[];
                            objectInProcess.points.forEach(element => {
                                let newY=y1+(((element.getY()-y1)*(y2-yOffset-y1))/(y2-y1));
                                //let newY=(element.getY()*(y2+offset-y1))/(y2-y1);
                                newPoints.push(createNewPoint(element,element.getX(),newY));
                                
                            }); 
                            objectInProcess.points=newPoints;                             
                        };
                        currentCanvasCoordinates=new Point(coordinates.x,coordinates.y); 
                        objectInProcess.createFrame();
                        replaceIntoCurrentObject(objectInProcess);                   
                        
                        break;
                    case MOVE_SIDE_LEFT:
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_side1.src+"'), auto";
                        xOffset=currentCanvasCoordinates.getX()-coordinates.x;
                        if (objectInProcess.points.length===2){
                            objectInProcess.points[0]=new Point(objectInProcess.points[0].getX()-xOffset, objectInProcess.points[0].getY());
                        }else{
                            let x1=minCoordinate(objectInProcess.points,"x");
                            let x2=maxCoordinate(objectInProcess.points,"x");
                        
                            let newPoints=[];
                            objectInProcess.points.forEach(element => {
                                let newX=x2-((x2-element.getX())*((x2-x1)/(x2-x1-xOffset)));
                                //let newX=x2-((element.getX()-x1)*(x2-x1+xOffset))/(x2-x1);
                                newPoints.push(createNewPoint(element,newX,element.getY()));
                            });                            
                            objectInProcess.points=newPoints;
                        };
                        currentCanvasCoordinates=new Point(coordinates.x,coordinates.y); 
                        objectInProcess.createFrame();
                        replaceIntoCurrentObject(objectInProcess);                       
                    
                    break;
                    case MOVE_SIDE_RIGHT:
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_side1.src+"'), auto";
                        xOffset=currentCanvasCoordinates.getX()-coordinates.x;
                        if (objectInProcess.points.length===2){
                            objectInProcess.points[1]=new Point(objectInProcess.points[1].getX()-xOffset, objectInProcess.points[1].getY());
                        }else{
                            let x1=minCoordinate(objectInProcess.points,"x");
                            let x2=maxCoordinate(objectInProcess.points,"x");
                        
                            let newPoints=[];
                            objectInProcess.points.forEach(element => {
                                let newX=x1+(((element.getX()-x1)*(x2-xOffset-x1))/(x2-x1));
                                newPoints.push(createNewPoint(element,newX,element.getY()));
                              
                            });                            
                            objectInProcess.points=newPoints;
                        };
                        currentCanvasCoordinates=new Point(coordinates.x,coordinates.y);   
                        objectInProcess.createFrame();                       
                        replaceIntoCurrentObject(objectInProcess);
                        break;             
                    
                    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    case MOVE_ROTATE_ANGLE_0:  //ротацию пока сложно. Надо вычислить, на какой градус изменяться, перессчитать frame. Вообще, всесь Frame убрать из showFrame 
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.rotate_top_left.src+"'), auto";
                        rotateObjectInProcess(coordinates);

                       // yOffset=currentCanvasCoordinates.getY()-coordinates.y;
                   /* let point=all4Points[0];
                        objectInProcess.setRotation(Math.max(coordinates.x-point.getX(),coordinates.y-point.getY()));  
                        */ 
                        objectInProcess.createFrame();                           
                        replaceIntoCurrentObject(objectInProcess);
                        break;
                    case MOVE_ROTATE_ANGLE_1: 
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.rotate_top_right.src+"'), auto";
                        rotateObjectInProcess(coordinates);


                       /* let xOffset=(all4Points[2].getX()-all4Points[0].getX())/2;
                        let yOffset=((all4Points[2].getY()-all4Points[0].getY())/2)
                        let centerPoint= new Point(all4Points[0].getX()+xOffset ,all4Points[0].getY()+yOffset); 

                        X = x0 + (x - x0) * cos(a) - (y - y0) * sin(a);
                        Y = y0 + (y - y0) * cos(a) + (x - x0) * sin(a);

                        objectInProcess.setRotation(Math.max());                              
                                                    ctx.rotate(20*Math.PI/180); 
                                                    */ 
                        objectInProcess.createFrame();                            
                        replaceIntoCurrentObject(objectInProcess);         
                        break;
                    case MOVE_ROTATE_ANGLE_2:
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.rotate_bottom_left.src+"'), auto";
                        rotateObjectInProcess(coordinates);
                    /*
                        let xOffset=(all4Points[2].getX()-all4Points[0].getX())/2;
                        let yOffset=((all4Points[2].getY()-all4Points[0].getY())/2)
                        let centerPoint= new Point(all4Points[0].getX()+xOffset ,all4Points[0].getY()+yOffset); 
                        objectInProcess.setRotation(Math.max());                              
                                                    ctx.rotate(20*Math.PI/180);  
                                                    */   
                        objectInProcess.createFrame();                            
                        replaceIntoCurrentObject(objectInProcess);                           
                        break;
                    case MOVE_ROTATE_ANGLE_3:
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.rotate_bottom_right.src+"'), auto";
                        rotateObjectInProcess(coordinates);
                    /*
                        let xOffset=(all4Points[2].getX()-all4Points[0].getX())/2;
                        let yOffset=((all4Points[2].getY()-all4Points[0].getY())/2)
                        let centerPoint= new Point(all4Points[0].getX()+xOffset ,all4Points[0].getY()+yOffset); 
                        objectInProcess.setRotation(Math.max());                              
                                                    ctx.rotate(20*Math.PI/180);      
                                                    */   
                        objectInProcess.createFrame();
                        replaceIntoCurrentObject(objectInProcess);
                        break;                                        

                    case MOVE_MOVE_ALL:
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.grab.src+"'), auto";
                        //console.log("onMouseMoveShapes  --- grab3");
                        xOffset=currentCanvasCoordinates.getX()-coordinates.x;
                        yOffset=currentCanvasCoordinates.getY()-coordinates.y;
                        //console.log(currentCanvasCoordinates);
                        //console.log("offset:  "+xOffset+","+yOffset);
                        objectInProcess.points.forEach(element => {
                            element.setX(element.getX()-xOffset);
                            element.setY(element.getY()-yOffset);
                        });
                        currentCanvasCoordinates=new Point(coordinates.x,coordinates.y); 
                        objectInProcess.createFrame();                   
                        replaceIntoCurrentObject(objectInProcess);
                        break; 
                    case MOVE_ANGLE_0:
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_angle1.src+"'), auto";
                        yOffset=currentCanvasCoordinates.getY()-coordinates.y;
                        xOffset=currentCanvasCoordinates.getX()-coordinates.x;
                        if (objectInProcess.points.length===2){
                            objectInProcess.points[0]=new Point(objectInProcess.points[0].getX()-xOffset
                                                                , objectInProcess.points[0].getY()-yOffset);
                        }else{
                            let x1=minCoordinate(objectInProcess.points,"x");
                            let y1=minCoordinate(objectInProcess.points,"y");
                            let x2=maxCoordinate(objectInProcess.points,"x");
                            let y2=maxCoordinate(objectInProcess.points,"y");
                        
                            let newPoints=[];
                            objectInProcess.points.forEach(element => {
                                let newY=y2-((y2-element.getY())*((y2-y1)/(y2-y1-yOffset)));
                                let newX=x2-((x2-element.getX())*((x2-x1)/(x2-x1-xOffset)));
                                //let newY=(element.getY()*(y2-(y1+yOffset)))/(y2-y1);
                                //let newX=(element.getX()*(x2-(x1+xOffset)))/(x2-x1);
                                newPoints.push(createNewPoint(element,newX,newY));
                                
                                
                            });                            
                            objectInProcess.points=newPoints;
                        };
                        currentCanvasCoordinates=new Point(coordinates.x,coordinates.y); 
                        objectInProcess.createFrame();                       
                        replaceIntoCurrentObject(objectInProcess);
                        break; 
                    case MOVE_ANGLE_1:
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_angle2.src+"'), auto";
                        yOffset=currentCanvasCoordinates.getY()-coordinates.y;
                        xOffset=currentCanvasCoordinates.getX()-coordinates.x;
                        if (objectInProcess.points.length===2){
                            objectInProcess.points[0]=new Point(objectInProcess.points[0].getX(), objectInProcess.points[0].getY()-yOffset);
                            objectInProcess.points[1]=new Point(objectInProcess.points[1].getX()-xOffset, objectInProcess.points[1].getY());
                        }else{
                            let x1=minCoordinate(objectInProcess.points,"x");
                            let y1=minCoordinate(objectInProcess.points,"y");
                            let x2=maxCoordinate(objectInProcess.points,"x");
                            let y2=maxCoordinate(objectInProcess.points,"y");
                        
                            let newPoints=[];
                            objectInProcess.points.forEach(element => {
                                let newY=y2-((y2-element.getY())*((y2-y1)/(y2-y1-yOffset)));
                                let newX=x1+(((element.getX()-x1)*(x2-xOffset-x1))/(x2-x1));
                                //let newY=(element.getY()*(y2-(y1+yOffset)))/(y2-y1);
                                //let newX=(element.getX()*(x2-(x1+xOffset)))/(x2-x1);
                                newPoints.push(createNewPoint(element,newX,newY));
                                
                            }); 
                            objectInProcess.points=newPoints;                           

                        };
                        currentCanvasCoordinates=new Point(coordinates.x,coordinates.y); 
                        objectInProcess.createFrame();                    
                        replaceIntoCurrentObject(objectInProcess);
                        break; 
                    case MOVE_ANGLE_2:
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_angle1.src+"'), auto";
                        yOffset=currentCanvasCoordinates.getY()-coordinates.y;
                        xOffset=currentCanvasCoordinates.getX()-coordinates.x;
                        if (objectInProcess.points.length===2){
                            objectInProcess.points[1]=new Point(objectInProcess.points[1].getX()-xOffset
                                                                , objectInProcess.points[1].getY()-yOffset);
                        }else{
                            let x1=minCoordinate(objectInProcess.points,"x");
                            let y1=minCoordinate(objectInProcess.points,"y");
                            let x2=maxCoordinate(objectInProcess.points,"x");
                            let y2=maxCoordinate(objectInProcess.points,"y");
                        
                            let newPoints=[];
                            objectInProcess.points.forEach(element => {
                                let newX=x1+(((element.getX()-x1)*(x2-xOffset-x1))/(x2-x1));
                                let newY=y1+(((element.getY()-y1)*(y2-yOffset-y1))/(y2-y1));
                                //let newY=(element.getY()*(y2+yOffset-y1))/(y2-y1);
                                //let newX=(element.getX()*(x2+xOffset-x1))/(x2-x1);
                                newPoints.push(createNewPoint(element,newX,newY));
                                
                            });                            
                            objectInProcess.points=newPoints;
                        };
                        currentCanvasCoordinates=new Point(coordinates.x,coordinates.y);                      
                        objectInProcess.createFrame();
                        replaceIntoCurrentObject(objectInProcess);
                        break; 
                    case MOVE_ANGLE_3:
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_angle2.src+"'), auto";
                        yOffset=currentCanvasCoordinates.getY()-coordinates.y;
                        xOffset=currentCanvasCoordinates.getX()-coordinates.x;
                        if (objectInProcess.points.length===2){
                            objectInProcess.points[0]=new Point(objectInProcess.points[0].getX()-xOffset, objectInProcess.points[0].getY());
                            objectInProcess.points[1]=new Point(objectInProcess.points[1].getX(), objectInProcess.points[1].getY()-yOffset);
                        }else{
                            let x1=minCoordinate(objectInProcess.points,"x");
                            let y1=minCoordinate(objectInProcess.points,"y");
                            let x2=maxCoordinate(objectInProcess.points,"x");
                            let y2=maxCoordinate(objectInProcess.points,"y");
                        
                            let newPoints=[];
                            objectInProcess.points.forEach(element => {
                                let newY=y1+(((element.getY()-y1)*(y2-yOffset-y1))/(y2-y1));
                                let newX=x2-((x2-element.getX())*((x2-x1)/(x2-x1-xOffset)));
                               // let newY=(element.getY()*(y2+yOffset-y1))/(y2-y1);
                               // let newX=(element.getX()*(x2+xOffset-x1))/(x2-x1);
                                newPoints.push(createNewPoint(element,newX,newY));
                                
                            });                            
                            objectInProcess.points=newPoints;
                        };
                        currentCanvasCoordinates=new Point(coordinates.x,coordinates.y); 
                        objectInProcess.createFrame();                        
                        replaceIntoCurrentObject(objectInProcess);
                        break; 

                    default:
                        break;
                }


            break;
            case BUTTON_CLEAR:    //удаление точек 
                deletePoints(coordinates);
                break;                
            default: //рисуем фигуры
                objectInProcess.onMouseMove(coordinates,buttonPressed);
                replaceIntoCurrentObject(objectInProcess);
                break;
        }
    }else if (isOkCancelVisible && buttonPressed===0 && objectInProcess){ //мы просто парим над фигурой. Сейчас выберем режим из MOVE_ настроек 
        switch (currentTool) {
            case BUTTON_MOVE:
                let all4Points=getAllPointsOfFrame(objectInProcess);
                moveMode=getModeForResizeRemoveElement(coordinates,all4Points);               
                break;
            case BUTTON_CLEAR:
                document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.eraser.src+"'), auto";
                break;
            default:
                break;
        }
    }
    show(coordinates);     
}

function onMouseUpShapes(coordinates, shapeType) {
    document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.main.src+"'), auto";
    if (objectInProcess) {
        switch (currentTool) {
            case BUTTON_MOVE:    //выделение объекта
                console.log("onMouseUpShapes --- 351");
                selectObject(coordinates);
                break;                                              
            case BUTTON_CLEAR:    //удаление точек 
                if (objectInProcess instanceof ImageShape){
                    deleteObject(coordinates);
                    isOkCancelVisible=false;                    
                }else{


                }

                bErase=false;
                break;
            
            default:
                objectInProcess. onMouseUp(coordinates, shapeType);
                break;
        }

    }else{
        switch (currentTool) {
            case BUTTON_MOVE:    //выделение объекта
                console.log("onMouseUpShapes --- 363");
                selectObject(coordinates);
                break;  
            case BUTTON_CLEAR:    //удаление объекта                                           
                deleteObject(coordinates);
                isOkCancelVisible=false;

                break;  
            case BUTTON_PIPETTE:    //получить цвет в определенной точке
                
                $("#currentColor").spectrum({
                    color:  colorInCoordinates(coordinates)
                });
                isOkCancelVisible=false;
                break;  
            case BUTTON_FILL:
                let colorInPoint = colorInCoordinates(coordinates);
                let colorValue=document.getElementById("currentColor").value;
                let backgroundColorValue=document.getElementById("currentBackgroundColor").value;

                objectInProcess=new FillShape("fill",colorValue);
                    
                fillCanvasWhileColor(colorInPoint,coordinates.x,coordinates.y);  //рекурсия
                objectInProcess.onMouseDown();             

                break;                   
            default:
                break;
        }

    }
    visibilityOkCancelDiv();
    show();
}

/*function fillCanvasWhileColor(colorInPoint,x,y) {  //рекурсия. заполнение по точкам, но не срабатывает, т.к. стек переполняемся очень быстро
    let colorValue=document.getElementById("currentColor").value;
    objectInProcess.setPoint(x,y,colorValue);
    context.restore();
    context.strokeStyle=colorValue;
    context.fillStyle=colorValue;
    context.fillRect(x,y,1,1);  
    console.log(objectInProcess.points.length);  

    if ((x-1)>0 && colorInPoint === colorInCoordinatesXY(x-1,y)){
        fillCanvasWhileColor(colorInPoint,x-1,y);
    }

    if ((y-1)>0 && colorInPoint === colorInCoordinatesXY(x,y-1)){
        fillCanvasWhileColor(colorInPoint,x,y-1);
    } 
    
    if ((x+1)<mainCanvas.width && colorInPoint === colorInCoordinatesXY(x+1,y)){
        fillCanvasWhileColor(colorInPoint,x+1,y);
    }    
    
    if ((y+1)<mainCanvas.height && colorInPoint === colorInCoordinatesXY(x,y+1)){
        fillCanvasWhileColor(colorInPoint,x,y+1);
    }      
    
} */

function fillCanvasWhileColor(colorInPoint,x,y) {    //рекурсия. Работает по линиям, но работает медленно. Наверное, потому как приходится часто опрашивать canvas  на цвет.
    let colorValue=document.getElementById("currentColor").value;
    let minX=x;
    while ((minX-1)>0 && colorInPoint === colorInCoordinatesXY(minX-1,y)){
        minX--;
    }
    let maxX=x;
    while ((maxX+1)<mainCanvas.width && colorInPoint === colorInCoordinatesXY(maxX+1,y)){
        maxX++;
    }    
    if ((minX!==maxX) || (minX===maxX && colorInPoint === colorInCoordinatesXY(maxX,y))){
        objectInProcess.addLine(minX,y,maxX,y); //первая линия
        context.restore();
        context.strokeStyle=colorValue;
        context.moveTo(minX,y);
        context.lineTo(maxX,y);
        //console.log(""+minX+"   "+y+"   "+maxX+"   "+y+"lines:  "+objectInProcess.lines.length);

        for (let i = minX; i <=maxX; i++) {
            if ((y-1)>0 && colorInPoint === colorInCoordinatesXY(i,y-1) &&  !haveJustDrawn(i,y-1)){
                fillCanvasWhileColor(colorInPoint,i,y-1);
            }
            if ((y+1)<mainCanvas.height && colorInPoint === colorInCoordinatesXY(i,y+1) && !haveJustDrawn(i,y+1)){
                fillCanvasWhileColor(colorInPoint,i,y+1);
            }        
            
        }  
            
    } 
}

function haveJustDrawn(x,y) {  //проверить, внесли ли мы уже эту точку под покраску
    let result=false;
    for (let i = 0; i < objectInProcess.lines.length; i++) {
        let line=objectInProcess.lines[i];
        if (x>= line.points[0].getX() && x<=line.points[1].getX() && y===line.points[0].getY()){
            result=true;
            break;
        }        
        
    }

    return result;
} 

function rotateObjectInProcess(coordinates) {
    let xOffset=currentCanvasCoordinates.getX()-coordinates.x;
    let yOffset=currentCanvasCoordinates.getY()-coordinates.y;
    //let offset=Math.max(xOffset,-yOffset)/100;
    let offset=(xOffset-yOffset)/100;
    if (objectInProcess.getType()==="rectangle" || objectInProcess.getType()==="triangle" || objectInProcess.getType()==="pen" 
        || objectInProcess.getType()==="curve" || objectInProcess.getType()==="star" || objectInProcess.getType()==="line" ){
            
            let frame=objectInProcess.getFrame();
            let x0=(frame[1].getX()-frame[0].getX())/2+frame[0].getX();
            let y0=(frame[1].getY()-frame[0].getY())/2+frame[0].getY();
            let newPoints=[];
            objectInProcess.points.forEach(element => {


                let newX = x0 + (element.getX() - x0) * Math.cos(offset) - (element.getY()  - y0) * Math.sin(offset);
                let newY = y0 + (element.getY()  - y0) * Math.cos(offset) + (element.getX() - x0) * Math.sin(offset);

                newPoints.push(createNewPoint(element,newX,newY));
        
                
            });
            objectInProcess.points=newPoints;
            currentCanvasCoordinates=new Point(coordinates.x,coordinates.y); 


    }else if (objectInProcess.getType()==="circle" || objectInProcess.getType()==="image" ){
        objectInProcess.setRotation(objectInProcess.getRotation()+offset);
        changePanelSettings(objectInProcess);
    }else{
        //там остались fill и text. их не будем вращать. 
    }

             

}