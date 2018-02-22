class BaseShape {
    constructor(type){
        this.points=[]; //new Point
        this.type=type;
        this.inProcess=true;
        this.created=new Date();
        this.frame=[new Point(0,0),new Point(0,0)];
        console.log("frame clear");
        this.modified=true;
    }

    getDate(){
        return this.created;
    }

    setDate(value){
        this.created=value;
    }    

    getTime(){
        return this.created.getTime();
    }
    
    setRotation(value){
        this.rotation=value;
    }     

    getRotation(){
        return this.rotation;
    }    

    isModified(){
        return this.modified;
    } 

    modify(){
        this.modified=true;
    }


    setFrame(a,b){
        //console.log("setFrame"+a.getX()+","+a.getY()+" -- "+b.getX()+","+b.getY());
        this.frame=[a,b];

        if (!a){
            debugger;
        }
    } 

    getFrame(){
        return this.frame;
    }
    
    setPoint(x,y){
        this.points.push(new Point(x,y));
        this.modify();
    }

    getPoint(index){
        let result=null;
        if (index<this.points.length){
            result=this.points[index];
        }

        return result;
    }    

    setPointInPosition(position,x,y){
        this.points[position]=new Point(x,y);
        this.modify();
    }  

    getType(){
        return this.type;
    }

    setType(value){
        this.type=value;
    }

    done(){
        this.inProcess=false;
        this.modified=false;
    }

    isProcessed(){
        return this.inProcess;
    }  

    toProcess(){
        this.inProcess=true;
        console.log(this.getTime());
//        history.push(createNewObject.bind(this));
   }  
   
   onMouseDown(){ 
        currentObject.push(objectInProcess);
        addToHistory();   
        isOkCancelVisible=true;
        visibilityOkCancelDiv();          
    }

    onMouseMove(coordinates,buttonPressed){
        objectInProcess.setPoint(coordinates.x, coordinates.y);
        if (buttonPressed>0){
            objectInProcess.createFrame(objectInProcess);
        }
        currentObject[currentObject.length-1]=objectInProcess;
        
    }

    onMouseUp(coordinates, shapeType){
        objectInProcess.done();
        isOkCancelVisible=false;
        visibilityOkCancelDiv();
        currentObject[currentObject.length-1]=objectInProcess;
        console.log("onMouseUp");
        this.createFrame();
        objectInProcess=undefined;
    }

    createFrame(){
        let x1=minCoordinate(this.points,"x");
        let y1=minCoordinate(this.points,"y");
        let x2=maxCoordinate(this.points,"x");
        let y2=maxCoordinate(this.points,"y");
        this.setFrame(new Point(x1-3,y1-3), new Point(x2+3,y2+3));  //по этим координатам потом будем искать при выделени    
        objectInProcess=this;
     //   console.log("createFrame");   
     //   console.log(this.getFrame()); 

    }

    showFrame(){

        
        let  frame=this.getFrame();
        //console.log("showFrame");   
        //console.log(this.getFrame());         
        context.beginPath();
        context.setLineDash([5,2]);
        context.lineWidth="1";
        context.strokeStyle="rgb(195, 197, 201)";
        context.rect(frame[0].getX()-3,frame[0].getY()-3,frame[1].getX()-frame[0].getX()+6,frame[1].getY()-frame[0].getY()+6);
       
    //   console.log(x1+","+y1+" - "+x2+","+y2);
    //   console.log(this.getFrame());

        context.strokeStyle="rgb(150, 150, 160)";
        context.fillStyle=context.strokeStyle;
        context.fillRect(frame[0].getX()-3-4,frame[0].getY()-3-4,8,8);
        context.fillRect(frame[1].getX()+3-4,frame[1].getY()+3-4,8,8);
        context.fillRect(frame[0].getX()-3-4,frame[1].getY()+3-4,8,8);
        context.fillRect(frame[1].getX()+3-4,frame[0].getY()-3-4,8,8);
        context.stroke();

        context.setLineDash([]);         
    }

    show(){
        if (this.inProcess){
            this.showFrame();
            //отобразить элемент
        }
    }

    reactionOnKeyDown(e){


    }

    reactionOnKeyUp(e){

        
    }

    reactionOnKeyPressed(e){

    } 
    
    getSettingsPanel(){  //панель со свойствами: цвет, размер линии, заливка и т.п.
        return "Нет данных";
    }

}

class Shape extends BaseShape{
    constructor(...args){
        super(args[0] || "");

        let colorValue=document.getElementById("currentColor").value;
        let backgroundColorValue=document.getElementById("currentBackgroundColor").value;

        this.color=args[1] || colorValue;
        this.isFilledElement=args[2] || false;
        this.backgroundColor=args[3] || backgroundColorValue;
        this.lineWidth=args[4]||2;
        this.modified=true;
    }

    getColor(){
        return this.color;
    }

    setColor(color){
        this.color=color;
        this.modify();
    }

    getLineWidth(){
        return this.lineWidth;
    }

    setLineWidth(width){
        this.lineWidth=width;
        this.modify();
    }


    getBackgroundColor(){
        return this.backgroundColor;
    }

    setBackgroundColor(color){
        this.backgroundColor=color;
        this.modify();
    }

    isFilled(value){
        if (value!=undefined){
            this.isFilledElement=value;
            this.modify();
        }

        return this.isFilledElement;
    }

}



class Point {
    constructor(x,y){
        this.x=x||0;
        this.y=y||0;
    }

    getPoint(){
        return {
            x,
            y,
            color
        }
    }

    setPoint(x,y,color){
        this.x=x;
        this.y=y;
        this.color=color;
    }

    setX(x){
        this.x=x;
    }

    setY(y){
        this.y=y;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    isColored(){
        return false;
    }    

}

class PointWithColor extends Point {
    constructor(x,y,color){
        super(x,y);
        this.color=color;
    }

    getPoint(){
        return {
            x,
            y
        }
    }

    setPoint(x,y){
        this.x=x;
        this.y=y;
    }

    setX(x){
        this.x=x;
    }

    setY(y){
        this.y=y;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    setColor(color){
        this.color=color;
    }

    getColor(){
        return this.color;
    }

    isColored(){
        return true;
    }


}

class LineForFill{
    constructor(...args){ //x1,y1, x2,y2
        this.points=[new Point(args[0],args[1]),new Point(args[2],args[3])];
    }

    getPoint0(){
        let result=undefined;
        if (this.points.length>0){
            result=this.points[0];
        }
        return result
    }

    getPoint1(){
        let result=undefined;
        if (this.points.length>1){
            result=this.points[1];
        }
        return result
    }    

}

class SideWindow{
    constructor(args){
        this.type=args[0];
        this.side=args[1];
        this.isCloseWindow=false;
        this.isHideWindow=false;
        this.data=args[2];
    }

    toClose(value=true){
        this.isCloseWindow=value;
    }

    toHide(value=true){
        this.isHideWindow=value;
    }   

    returnHTML(){
        return "";

    }

}

