function selectObject(coordinates) {
    if (!objectInProcess){  //сначала пусть сохранит объект, или откажется от редлактирования
        
        //console.log("onMouseMoveShapes  --- grab3");
        let currentSelected=haveObjectOnPoint(coordinates); //есть ли объекты на щёлкнутой точке
        console.log(currentSelected);
        if (currentSelected){
            objectInProcess=cloneObject(currentSelected);
            objectInProcess.toProcess();
            for (let i = 0; i < currentObject.length; i++) {
                if (currentObject[i].getTime()===objectInProcess.getTime()){
                    currentObject[i]=objectInProcess;
                    break;
                };
                
            }
            changePanelSettings(objectInProcess);
            addToHistory();

           
            //currentCanvasCoordinates=new Point(coordinates.x,coordinates.y);
            isOkCancelVisible=true;
            document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.grab.src+"'), auto";
                console.log("selectObject  --- grab3");
            
        }else{
            isOkCancelVisible=false;
        }
        visibilityOkCancelDiv(); 
        show();
    }else{
        let currentSelected=haveObjectOnPoint(coordinates); //есть ли объекты на щёлкнутой точке
        if (currentSelected){
            if (currentSelected.getTime()!==objectInProcess.getTime()){
                beep();
                //debugger;
            }
        }

    }
}

function deleteObject(coordinates) {
    let currentSelected=haveObjectOnPoint(coordinates); //есть ли объекты на щёлкнутой точке
    if (currentSelected){
        deleteObjectById(currentSelected.getTime());
  
    }
}

function deleteObjectById(value){
    for (let i = 0; i < currentObject.length; i++) {
        if (currentObject[i].getTime()===value){
            currentObject.splice(i,1);
            break;
        };
        
    }
    addToHistory();    
}

function deletePoints(coordinates) {
    let point0=new Point(coordinates.x-(CLEAR_SIZE/2),coordinates.y-(CLEAR_SIZE/2))
        ,point2=new Point(coordinates.x+(CLEAR_SIZE/2),coordinates.y+(CLEAR_SIZE/2));
    for (let i = (objectInProcess.points.length-1); i >=0; i--) {
        if (i===0 && (objectInProcess.getType()==="triangle" || objectInProcess.getType()==="star")){ //у этих фигур нулевая точка - техническая
            continue;
        }
        let currentPoint=objectInProcess.points[i];
        if (point0.getX()<currentPoint.getX() && point2.getX()>currentPoint.getX()        //точка находится в пределах ластика
            && point0.getY()<currentPoint.getY() && point2.getY()>currentPoint.getY()){   //преобразуем фигуру в curve
            objectInProcess.points.splice(i,1);
        }
       
    }
    if (objectInProcess.getType()==="pen" || objectInProcess.getType()==="curve"){
    }else{
        if (objectInProcess.getType()==="triangle" || objectInProcess.getType()==="star"){
            objectInProcess.points.splice(0,1);
        }
        let currentSelected=new CurveShape("curve",objectInProcess.getColor(),objectInProcess.isFilled()
                    ,objectInProcess.getBackgroundColor(),objectInProcess.getLineWidth());
        currentSelected.setDate(objectInProcess.getDate());          //перенесем идентификатор объекта  
        for (let i = 0; i < objectInProcess.points.length; i++) {
            currentSelected.points.push(new PointWithColor(objectInProcess.points[i].getX()
                ,objectInProcess.points[i].getY(), objectInProcess.getColor()));
        }
        objectInProcess=currentSelected;
        replaceIntoCurrentObject(objectInProcess);

    }
    if (objectInProcess.points.length===0){
        deleteObjectById(objectInProcess.getTime());
        isOkCancelVisible=false;
        visibilityOkCancelDiv();
    }


    
}

function getModeForResizeRemoveElement(coordinates,all4Points) {
    //console.log(""+coordinates.x+","+coordinates.y);
    let result=undefined;
    document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.main.src+"'), auto";
    const offset=5;
    if (coordinates.x>(all4Points[0].getX()+offset) && coordinates.x<(all4Points[2].getX()-offset)    //MOVE_MOVE_ALL
        && coordinates.y>(all4Points[0].getY()+offset) && coordinates.y<(all4Points[2].getY()-offset)){
        result=MOVE_MOVE_ALL;
        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.palm.src+"'), auto";
        console.log("MOVE_MOVE_ALL");
    } else if (coordinates.x>(all4Points[0].getX()-offset) && coordinates.x<(all4Points[0].getX()+offset)  //MOVE_SIDE
        && coordinates.y>(all4Points[0].getY()+offset) && coordinates.y<(all4Points[2].getY()-offset)) {
        result=MOVE_SIDE_LEFT;
        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_side1.src+"'), auto";
        console.log("MOVE_SIDE_LEFT");
    } else if (coordinates.x>(all4Points[2].getX()-offset) && coordinates.x<(all4Points[2].getX()+offset)
        && coordinates.y>(all4Points[0].getY()+offset) && coordinates.y<(all4Points[2].getY()-offset)) {
        result=MOVE_SIDE_RIGHT;
        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_side1.src+"'), auto";
        console.log("MOVE_SIDE_RIGHT");
    } else if (coordinates.x>(all4Points[0].getX()+offset) && coordinates.x<(all4Points[2].getX()-offset)
        && coordinates.y>(all4Points[0].getY()-offset) && coordinates.y<(all4Points[0].getY()+offset)) {
        result=MOVE_SIDE_TOP;
        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_side2.src+"'), auto";
        console.log("MOVE_SIDE_TOP");
    } else if (coordinates.x>(all4Points[0].getX()+offset) && coordinates.x<(all4Points[2].getX()-offset)
        && coordinates.y>(all4Points[2].getY()-offset) && coordinates.y<(all4Points[2].getY()+offset)) {
        result=MOVE_SIDE_BOTTOM;
        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_side2.src+"'), auto"; 
        console.log("MOVE_SIDE_BOTTOM");

    } else if ((coordinates.x>(all4Points[0].getX()-(offset*3)) && coordinates.x<(all4Points[0].getX()-offset)  //MOVE_ROTATE
        && coordinates.y<(all4Points[0].getY()+offset) && coordinates.y>(all4Points[0].getY()-(offset*3)))
        || (coordinates.x>(all4Points[0].getX()-(offset*3)) && coordinates.x<(all4Points[0].getX()+offset) 
        && coordinates.y>(all4Points[0].getY()-(offset*3)) && coordinates.y<(all4Points[0].getY()-offset))){
        result=MOVE_ROTATE_ANGLE_0;
        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.rotate_top_left.src+"'), auto";
        console.log("MOVE_ROTATE_ANGLE_0");
    } else if ((coordinates.x>(all4Points[1].getX()+offset) && coordinates.x<(all4Points[1].getX()+(offset*3))  
        && coordinates.y<(all4Points[1].getY()+offset) && coordinates.y>(all4Points[1].getY()-(offset*3)))
        || (coordinates.x>(all4Points[1].getX()-offset) && coordinates.x<(all4Points[1].getX()+(offset*3)) 
        && coordinates.y>(all4Points[1].getY()-(offset*3)) && coordinates.y<(all4Points[1].getY()-offset))){
        result=MOVE_ROTATE_ANGLE_1;  
        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.rotate_top_right.src+"'), auto";
        console.log("MOVE_ROTATE_ANGLE_1");
    } else if ((coordinates.x>(all4Points[2].getX()-offset) && coordinates.x<(all4Points[2].getX()+(offset*3))  //MOVE_ROTATE //низ угла
        && coordinates.y<(all4Points[2].getY()+(offset*3)) && coordinates.y>(all4Points[2].getY()+offset))
        || (coordinates.x>(all4Points[2].getX()+offset) && coordinates.x<(all4Points[2].getX()+(offset*3))                  //сторона угла
        && coordinates.y>(all4Points[2].getY()+offset) && coordinates.y<(all4Points[2].getY()+(offset*3)))){
        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.rotate_bottom_right.src+"'), auto";
        result=MOVE_ROTATE_ANGLE_2; 
        console.log("MOVE_ROTATE_ANGLE_2");  
    } else if ((coordinates.x>(all4Points[3].getX()-(offset*3)) && coordinates.x<(all4Points[3].getX()+offset)  //низ угла
        && coordinates.y<(all4Points[3].getY()+(offset*3)) && coordinates.y>(all4Points[3].getY()+offset))
        || (coordinates.x>(all4Points[3].getX()-(offset*3)) && coordinates.x<(all4Points[3].getX()-(offset*3)) //сторона угла
        && coordinates.y>(all4Points[3].getY()-offset) && coordinates.y<(all4Points[3].getY()+(offset*3)))){
        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.rotate_bottom_left.src+"'), auto";        
        result=MOVE_ROTATE_ANGLE_3; 
        console.log("MOVE_ROTATE_ANGLE_3");                   

    } else {
        for (let i = 0; i < all4Points.length; i++) {
            let point=all4Points[i];
            if (coordinates.x>(point.getX()-offset) && coordinates.x<(point.getX()+offset)                  //MOVE_ANGLE
                && coordinates.y>(point.getY()-offset) && coordinates.y<(point.getY()+offset)){
                switch (i) {
                    case 0:
                        result=MOVE_ANGLE_0;
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_angle1.src+"'), auto";
                        console.log("MOVE_ANGLE_0");
                        break;
                    case 1:
                        result=MOVE_ANGLE_1;
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_angle2.src+"'), auto";
                        console.log("MOVE_ANGLE_1");
                        break;
                    case 2:
                        result=MOVE_ANGLE_2;
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_angle1.src+"'), auto";
                        console.log("MOVE_ANGLE_2");
                        break;
                    case 3:
                        result=MOVE_ANGLE_3;
                        document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursors.resize_angle2.src+"'), auto";
                        console.log("MOVE_ANGLE_3");
                        break;                                                    
                    default:
                        break;
                }
               // let cursorImage=(i===0 || i===2)?cursores.resize_angle1:cursores.resize_angle2;
               // document.getElementsByTagName("canvas")[0].style.cursor = "url('"+cursorImage.src+"'), auto";
            }
        }
    }

    return result;
}

function repositionPoints(xOffset,yOffset) {
    let x1=minCoordinate(objectInProcess.points,"x");
    let y1=minCoordinate(objectInProcess.points,"y");
    let x2=maxCoordinate(objectInProcess.points,"x");
    let y2=maxCoordinate(objectInProcess.points,"y");

    objectInProcess.point.forEach(element => {

        
    });
    
}