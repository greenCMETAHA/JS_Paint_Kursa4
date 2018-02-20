class Shape {
    constructor(...args){
        this.points=[]; //new Point
        this.type=args[0];
        this.color=args[1];
        this.isFilledElement=args[2];
        this.backgroundColor=args[3];
        this.lineWidth=args[4];
        this.inProcess=true;
    }

    setPoint(x,y){
        this.points.push(new Point(x,y));
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
    }         

    getColor(){
        return this.color;
    }

    setColor(color){
        this.color=color;
    }

    getLineWidth(){
        return this.lineWidth;
    }

    setLineWidth(width){
        this.lineWidth=width;
    }


    getBackgroundColor(){
        return this.backgroundColor;
    }

    setBackgroundColor(color){
        this.backgroundColor=color;
    }

    isFilled(value){
        if (value){
            this.isFilledElement=value;
        }

        return this.isFilledElement;
    }

    getType(){
        return this.type
    }

    setType(value){
        this.type=value;
    }

    done(){
        this.inProcess=false;
    }

    showFrame(){
        let x1=minCoordinate(this.points,"x");
        let y1=minCoordinate(this.points,"y");
        let x2=maxCoordinate(this.points,"x");
        let y2=maxCoordinate(this.points,"y");

        context.beginPath();
        context.setLineDash([5,2]);
        context.lineWidth="1";
        context.strokeStyle="rgb(195, 197, 201)";
        context.rect(x1-3,y1-3,x2-x1+6,y2-y1+6);
        context.stroke();
        context.setLineDash([]);
         
    }
    
    show(){
        if (this.inProcess){
            this.showFrame();
            //отобразить элемент
        }
    }
}

class RectangleShape extends Shape  {
    constructor(...args){
        super(...args);
        this.points=[args[5],args[5]]; //new Point, new Point
    }

    show(){
        if (this.inProcess){ 
            this.showFrame();
        }        
        context.restore();
        context.beginPath();
        context.lineWidth=this.lineWidth;
        context.strokeStyle=this.color;
        let height=this.points[1].getX()-this.points[0].getX();
        let width=this.points[1].getY()-this.points[0].getY();
        context.strokeRect(this.points[0].getX(),this.points[0].getY(),height,width);
        context.stroke();
    }

    setPoint(x,y){
        this.points[1]=new Point(x,y);
    }
    
    setPointInPosition(position,x,y){
        this.points[position]=new Point(x,y);
    }       

}

class PenShape extends Shape  {
    constructor(...args){
        super(...args);
        this.points=[args[5]]; //new Point
        this.lineWidth=3;
    }

    show(){
        if (this.inProcess){ 
            this.showFrame();
        } 
        this.points.forEach(point => {
         //  context.beginPath();
            context.lineWidth=this.lineWidth;
            context.strokeStyle=point.getColor();
            context.fillStyle=point.getColor();
            context.fillRect(point.getX()-(this.lineWidth/2),point.getY()-(this.lineWidth/2),this.lineWidth,this.lineWidth);       
          //  context.stroke();            
        });       

    }
   
}




class Point {
    constructor(x,y){
        this.x=x;
        this.y=y;
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
        this.x=x;
        this.y=y;
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

