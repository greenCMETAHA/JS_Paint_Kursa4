
class RectangleShape extends Shape  {
    constructor(...args){
        super(...args);
        this.points=[args[5],args[5]]; //new Point, new Point
    }

    show(){
        if (this.inProcess){ 
            this.showFrame();
          //  console.log("show --- ");
          //  console.log(this.frame);
        }        
        context.restore();
        context.beginPath();
        context.lineWidth=this.lineWidth;
        context.strokeStyle=this.color;        
        
        context.moveTo(this.points[0].getX(), this.points[0].getY());  //потому что его надо будет крутить
        for (let i = 1; i < this.points.length; i++) {
            context.lineTo(this.points[i].getX(), this.points[i].getY());
        }
        context.closePath();
        if (this.isFilled()){
            context.fillStyle = this.getBackgroundColor(); 
            context.fill();
        }

        
       // let height=this.points[1].getX()-this.points[0].getX();
       // let width=this.points[1].getY()-this.points[0].getY();
       // context.strokeRect(this.points[0].getX(),this.points[0].getY(),height,width);
        context.stroke();
    }

    setPoint(x,y){
        this.points[2]=new Point(x,y);
        this.modify();              
    }
    
    setPointInPosition(position,x,y){
        this.points[position]=new Point(x,y);
        this.modify();
    } 
    
    onMouseMove(coordinates,buttonPressed){
        this.setPointInPosition(2,coordinates.x, coordinates.y);
        this.setPointInPosition(1,coordinates.x, this.points[0].getY());
        this.setPointInPosition(3,this.points[0].getX(),coordinates.y);
        if (buttonPressed>0){
            objectInProcess.createFrame(objectInProcess);
        }
        currentObject[currentObject.length-1]=objectInProcess;
        
    }   

    getSettingsPanel(){  //панель со свойствами: цвет, размер линии, заливка и т.п.
        let result="";

        result="<input type='checkbox' id='isFilledSettings' onchange='isFilledElementSettingsFunction(objectInProcess)'"
            +(this.isFilled()?"checked":"")+" />заполнять<br>"
            +"Толщина линии: <input type='number' id='lineWidthSettings' value='"
                +this.getLineWidth()+"' onchange='lineWidthSettingsFunction(objectInProcess)'/>";

        return result;
    }

}

class CircleShape extends RectangleShape  {
    constructor(...args){
        super(...args);
        this.points=[args[5],args[5]]; //new Point, new Point
        this.rotation=args[6]||0;
    }

    show(){
        if (this.inProcess){ 
            this.showFrame();
        }        
        context.restore();
        context.beginPath();
        context.lineWidth=this.lineWidth;
        context.strokeStyle=this.color;
        let width=this.points[1].getX()-this.points[0].getX();
        let height=this.points[1].getY()-this.points[0].getY();
        let radius=Math.min(height,width);
       // context.arc(this.points[0].getX()+(width/2),this.points[0].getY()+(height/2),radius,0,Math.PI*2, false);
       
        context.ellipse(this.points[0].getX()+(width/2),this.points[0].getY()+(height/2)
            ,Math.abs(width/2),Math.abs(height/2), this.getRotation(),Math.PI*2, false);
        if (this.isFilled()){
            context.fillStyle = this.getBackgroundColor(); 
            context.fill();
        }
        context.stroke();
    }

    setRotation(value){
        this.rotation=value;
        this.modify();

    }

    getRotation(){
        return this.rotation;

    }

    onMouseUp(){
        currentObject[currentObject.length-1]=objectInProcess;
        this.createFrame();
    }

    onMouseMove(coordinates,buttonPressed){
        this.setPointInPosition(1,coordinates.x, coordinates.y);
        if (buttonPressed>0){
            objectInProcess.createFrame(objectInProcess);
        }
        currentObject[currentObject.length-1]=objectInProcess;
        
    }      

    getSettingsPanel(){  //панель со свойствами: цвет, размер линии, заливка и т.п.
        let result="";

        result="<input type='checkbox' id='isFilledSettings' onchange='isFilledElementSettingsFunction(objectInProcess)'"
            +(this.isFilled()?"checked":"")+" />заполнять<br>"
            +"Толщина линии: <input id='lineWidthSettings' type='number' value='"
            +this.getLineWidth()+"' onchange='lineWidthSettingsFunction(objectInProcess)' /><br>"
            +"Угол: <input id='rotationSettings' type='number'  value='"
            +this.getRotation()+"' onchange='rotationSettingsFunction(objectInProcess)'/>";

        return result;
    }    

}


class LineShape extends RectangleShape  {
    constructor(...args){
        super(...args);
    }

    show(){
        if (this.inProcess){ 
            this.showFrame();
        }        
        context.restore();
        context.beginPath();
        context.lineWidth=this.lineWidth;
        context.strokeStyle=this.color;
        context.moveTo(this.points[0].getX(),this.points[0].getY());
        context.lineTo(this.points[1].getX(),this.points[1].getY());
        context.stroke();
    }
}

class TriangleShape extends RectangleShape  {
    constructor(...args){
        super(...args);
        this.points.push(args[5]); //[1] - точка левого верхнего угла. + new Point 3 times in a row 
        this.points.push(args[4]);
    }

    show(){
        if (this.inProcess){ 
            this.showFrame();
        }        
        context.restore();
        context.beginPath();
        context.lineWidth=this.lineWidth;
        context.strokeStyle=this.color;
        context.moveTo(this.points[1].getX(),this.points[1].getY());
        context.lineTo(this.points[2].getX(),this.points[2].getY());
        context.lineTo(this.points[3].getX(),this.points[3].getY());
        context.closePath();
        context.stroke();
    }

    setPoint(x,y){
        this.points[3]=new Point(x,y);
        this.points[2]=new Point(this.points[0].getX(),this.points[3].getY());
        let newX=this.points[2].getX()+((this.points[3].getX()-this.points[2].getX())/2);
        this.points[1]=new Point(newX,this.points[0].getY());
        this.modify();
    }

    onMouseMove(coordinates,buttonPressed){
        this.setPoint(coordinates.x,coordinates.y);
        if (buttonPressed>0){
            objectInProcess.createFrame(objectInProcess);
        }
        currentObject[currentObject.length-1]=objectInProcess;
        
    }      
}

class StarShape extends RectangleShape  {
    constructor(...args){
        super(...args);
        this.angles=args[6]||10;    //Правильная N-конечная звезда
        this.points=new Array(this.angles+1).fill(args[5]);
        
    }

    show(){
        if (this.inProcess){ 
            this.showFrame();
        }        
        context.restore();
        context.beginPath();
        context.lineWidth=this.lineWidth;
        context.strokeStyle=this.color;
        context.moveTo(this.points[1].getX(),this.points[1].getY());
        for (let i = 2; i < this.points.length; i++) {
            context.lineTo(this.points[i].getX(),this.points[i].getY());
            
        }
        context.closePath();
        if (this.isFilled()){
            context.fillStyle = this.getBackgroundColor(); 
            context.fill();
        }

        context.stroke();
    }

    getAngles(){
        return this.angles;
    }

    setAngles(value){
        this.angles=value;
        this.modify();
    }    

    setPoint(x,y){


        let centerX=this.points[0].getX()+((x-this.points[0].getX())/2); //Расчет центра по х
        let centerY=this.points[0].getY()+((y-this.points[0].getY())/2); //Расчет центра по y
        let radiusInside=Math.abs(x-this.points[0].getX());
        let radiusOutside=Math.abs(y-this.points[0].getY());
        
        let angle=0;
       //Цикл расчета вершин звезды
        for (let i=1;i<this.getAngles()*2+2;i++)
        {
            let radius=!(i%2)?radiusInside:radiusOutside;
            this.points[i]=new Point(Math.floor(centerX+radius/2*Math.cos(angle*Math.PI/180))
                                    ,Math.floor(centerY-radius/2*Math.sin(angle*Math.PI/180)));
            angle=angle+180/this.getAngles();
        } 
        this.modify();       
    }

    getSettingsPanel(){  //панель со свойствами: цвет, размер линии, заливка и т.п.
        let result="";

        result="<input type='checkbox' id='isFilledSettings' onchange='isFilledElementSettingsFunction(objectInProcess)'"
            +(this.isFilled()?"checked":"")+" />заполнять<br>"
            +"Толщина линии: <input id='lineWidthSettings' type='number' value='"
            +this.getLineWidth()+"' onchange='lineWidthSettingsFunction(objectInProcess)'/><br>"
            +"Количество углов: <input id='angelsSettings' type='number' value='"
            +this.getAngles()+"' onchange='angelsSettingsFunction(objectInProcess)'/>";

        return result;
    }      

    onMouseUp(){
        currentObject[currentObject.length-1]=objectInProcess;
        this.createFrame();
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
            context.restore();         
            context.lineWidth=this.lineWidth;
            context.strokeStyle=point.getColor();
            context.fillStyle=point.getColor();
            context.fillRect(point.getX()-(this.lineWidth/2),point.getY()-(this.lineWidth/2),this.lineWidth,this.lineWidth);       
          //  context.stroke();            
        });       
    }

    setPoint(x,y, color){
        this.points.push(new PointWithColor(x,y,color));
        this.modify();
    } 
    
    onMouseMove(coordinates,buttonPressed){
        objectInProcess.setPoint(coordinates.x, coordinates.y,document.getElementById("currentColor").value);
        this.createFrame();
        objectInProcess=this;
    }

    getSettingsPanel(){  //панель со свойствами: цвет, размер линии, заливка и т.п.
        let result="";

        result="Толщина линии: <input id='lineWidthSettings' type='number' value='"
                +this.getLineWidth()+"' onchange='lineWidthSettingsFunction(objectInProcess)'/>";

        return result;
    }       
   
}

class CurveShape extends PenShape  {
    constructor(...args){
        super(...args);
        this.points=args[5]?[args[5]]:[]; //new Point
        this.lineWidth=2;
        this.closedPath=false;
    }

    show(){
        if (this.inProcess){ 
            this.showFrame();
        } 
        context.beginPath();
        if (this.points.length>0){

            context.moveTo(this.points[0].getX(),this.points[0].getY());
            let lastPoint=this.points[0];
            this.points.forEach(point => {

                if (point!==lastPoint){
                    context.lineWidth=this.lineWidth;
                    context.strokeStyle=point.getColor();
                    context.fillStyle=point.getColor();
                    context.lineTo(point.getX(),point.getY());
                }
            });
            if (lastPoint===this.points[this.points.length-1] || this.closedPath) {
                context.closePath();
            } 
            if (this.isFilled()){
                context.fillStyle = this.getBackgroundColor(); 
                context.fill();
            }            
            context.stroke(); 
        }      
    }

    setPoint(x,y, color){
        this.points.push(new PointWithColor(x,y,color));
        this.modify();
    }    


    toClosePath(value=true){
        this.closedPath=value;
        this.modify();
    }

    isClosedPath(){
        return this.closedPath
    }    
    
    reactionOnKeyPressed(e){
        if (e.keyCode===32){  //space
            if (objectInProcess){
                objectInProcess.toClosePath();
                objectInProcess.done();
                isOkCancelVisible=false;
                objectInProcess=undefined;
            }

        }        

    }

    onMouseUp(){
        currentObject[currentObject.length-1]=objectInProcess;
        this.createFrame();
        objectInProcess=this;
    }

    getSettingsPanel(){  //панель со свойствами: цвет, размер линии, заливка и т.п.
        let result="";

        result="<input type='checkbox' id='isFilledSettings' onchange='isFilledElementSettingsFunction(objectInProcess)'"
            +(this.isFilled()?"checked":"")+" />заполнять<br>"
            +"<input id='closedPathSettings' type='number' value='"
            +this.isClosedPath()+"' onchange='closePathSettingsFunction(objectInProcess)'/>замкнуть<br>"
            +"Толщина линии: <input id='lineWidthSettings' type='number' value='"
            +this.getLineWidth()+"' onchange='lineWidthSettingsFunction(objectInProcess)'/>";

        return result;
    }    
   
}

class TextShape extends Shape  {
    constructor(...args){
        super(...args);
        if (args[5]){
            this.points=[args[5],new  Point(args[5].getX()+300,args[5].getY()+50)]; //new Point
        }
        this.lineWidth=args[4];
        this.text=args[6] ||"text";
        this.size=args[7] ||20;
        this.textInterval=args[8] || 3;
        this.linesInterval=args[9] || 3;
        this.cursorPosition=[this.text.length,this.text.length]; //Курсор - это матрица: [0] = на каком символе стоит сейчас, остальные строки - это количество символов на каждой строке в многострочном тексте. Сделано так для поддержки навигации по тексту (вверх, вниз, назад, вперед) 
        this.offset=args[10] || 3;  //принудительно! Так сказать, валюнтаристски = 3
        this.selected=[0,0]; //можно ещё сделать выделение текста: с позиции по позицию
    }

  

    setOffset(value){
        this.text=value;
        this.modify();
    } 

    getOffset(){
        return this.offset;
    }      

    setText(value){
        this.text=value;
        this.modify();
    } 

    getText(){
        return this.text;
    }     

    setSize(value){
        this.size=value;
        this.modify();
    } 
    

    getSize(){
        return this.size;
    }

    setCursorPosition(value){
        this.cursorPosition=value;
        this.modify();
    } 
    

    getCursorPosition(){
        return this.cursorPosition;
    }    

    setTextInterval(value){
        this.textInterval=value;
        this.modify();
    } 

    getTextInterval(){
        return this.textInterval;
    } 

    setLinesInterval(value){
        this.linesInterval=value;
        this.modify();
    }  

    getLinesInterval(){
        return this.linesInterval;
    } 

    setSelected(x1,x2){
        this.selected=[Math.min(x1,x2),Math.max(x1,x2)];
        this.modify();
    }  

    getSelected(){
        return this.selected;
    }  
    
    isSelected(){
        return this.selected[1]> this.selected[0];
    }
    
    correctFrame() {
        let lines=this.getCursorPosition().length;
        this.points[1]=new Point(this.points[1].getX()
            ,this.points[0].getY()+(this.offset*2)+(lines*this.getSize())+((lines-1)*this.getLinesInterval()));
        
    }

    showCursor(){

        let txt=this.getText();
        let xPosition=this.points[0].getX()+this.offset;
        let yPosition=this.points[0].getY()+this.offset+this.getSize();
        let cursorPosition=this.getCursorPosition()[0]; ////Курсор - это матрица: [0] = на каком символе стоит сейчас (Номер), остальные строки - это количество символов на каждой строке в многострочном тексте. Сделано так для поддержки навигации по тексту (вверх, вниз, назад, вперед) 
        for (let i = 0; i <= txt.length; i++) {
            let char = txt[i]||"";
            if ((xPosition+context.measureText(char).width+this.offset)>this.points[1].getX()){
                yPosition+=(this.offset+this.getSize()+this.getLinesInterval());
                xPosition=this.points[0].getX()+this.offset;
            }

            if (i===cursorPosition){
                xPosition+=this.offset;
                context.restore();
                context.strokeStyle="rgb(150, 150, 160)";
                context.beginPath();
                context.lineWidth=2.5;
                context.moveTo(xPosition-(this.offset/2),yPosition+3);
                context.lineTo(xPosition-(this.offset/2),yPosition-this.getSize()-3);
                context.stroke();
                break;
            }
            xPosition+=context.measureText(char).width+this.getTextInterval();
        }
    }

    show(){
        if (this.inProcess){ 
            this.correctFrame();//текст может выйти за нижнюю рамку. В этом случае её нужно скорректировать
            this.showFrame();
        } 
        context.beginPath();
        
        let txt=this.getText();
        //console.log(txt);
        let line=1; 
        let xPosition=this.points[0].getX()+this.offset;
        let yPosition=this.points[0].getY()+this.offset+this.getSize();
        let cursorPosition=[0,0]; // не получается полность отделить представление от модели/ здесь мы рассчитаем положение курсора. А в конце его выведем.
        cursorPosition[0]=this.getCursorPosition()[0];
        context.font = this.getSize()+"px Arial";
        for (let i = 0; i < txt.length; i++) {
            let char = txt[i];
            if ((xPosition+context.measureText(char).width+this.offset)>this.points[1].getX()){
                yPosition+=(this.offset+this.getSize()+this.getLinesInterval());
                xPosition=this.points[0].getX()+this.offset;
                line++; 
                cursorPosition[line]=0;
            }
            let selectedSymbol=false;
            if (this.isSelected() & i>=this.getSelected()[0] &&  i<this.getSelected()[1] && this.isProcessed()){
                let offset=this.getTextInterval()/2;  //чуть-чуть отступим от буквы со всех сторон
                //context.globalAlpha=0.5;
                context.fillStyle="rgb(195, 197, 201)";
                context.fillRect(xPosition-offset,yPosition+(offset/2)
                    , (offset*2)+context.measureText(char).width,-this.getSize()-offset);
                selectedSymbol=true;
            }
            context.strokeStyle=selectedSymbol?'black':this.getColor(); //если символ выделен, его точно должно быть видно
            if (this.isFilled()){
                context.fillStyle=this.getColor();
                context.fillText(char,xPosition,yPosition);
    
            }else{
                context.strokeText(char,xPosition,yPosition);
            }
            cursorPosition[line]=cursorPosition[line]+1;
            xPosition+=context.measureText(char).width+this.getTextInterval();
        }

        this.setCursorPosition(cursorPosition); //Курсор - это матрица: [0] = на каком символе стоит сейчас, остальные строки - это количество символов на каждой строке в многострочном тексте. Сделано так для поддержки навигации по тексту (вверх, вниз, назад, вперед) 

        if (this.inProcess){  //выводим курсор
            this.showCursor();
        } 
    }

    setPointInPosition(position,x,y){
        this.points[position]=new Point(x,y);
        this.modify();
    }  

    reactionOnKeyPressed(e){
        let cursorCoordinates=objectInProcess.getCursorPosition(); //new Point
        if ((e.keyCode>=32 && e.keyCode<=126) //латиница  и спецсимволы
                || (e.keyCode>=1072 && e.keyCode<=1103)  //малые русские
                || (e.keyCode>=1040 && e.keyCode<=1071) //большие русские
                ||(e.keyCode>=186 && e.keyCode<=222)) {  //;=-
                    let str=objectInProcess.getText();
                    let cursorCoordinates=objectInProcess.getCursorPosition();
                    //console.log(e.keyCode +  "---- ");
                    if (cursorCoordinates[0]===str.length) {//курсор стоит на последней позиции
                        objectInProcess.setText(str+String.fromCharCode(e.keyCode));
                        objectInProcess.getCursorPosition(cursorCoordinates);
                    }else{
                        let newStr=str.slice(0,(cursorCoordinates[0]))
                            +String.fromCharCode(e.keyCode)
                            +str.slice(cursorCoordinates[0],(str.length))
                        objectInProcess.setText(newStr);
                        
                    }
                    cursorCoordinates[0]=cursorCoordinates[0]+1;
                
            }
    }

    reactionOnKeyDown(e){
        let cursorCoordinates=objectInProcess.getCursorPosition(); //new Point
        switch (e.keyCode) {
            case 17:   //Ctrl
                pressedCtrl=true;
                break;
            case 16:    //Shift
                pressedShift=true;
                break;
            case 38:  { //Стрелка вверх
                e.preventDefault();
                let cursorPositionInText = getLineOfText(objectInProcess.getText(),cursorCoordinates);
                let line=cursorPositionInText.line;
                let newCursorPosition=0;
                if (line>1){
                    let minusPositionsPriviousString=cursorCoordinates[line-1]-cursorPositionInText.position; // Столько символов осталось в предыдущей строке до конца
                    minusPositionsPriviousString=minusPositionsPriviousString<0?0:minusPositionsPriviousString;
                    let minusPositions=minusPositionsPriviousString+cursorPositionInText.position;            // по идее на столько символов мы идём вверх
                    newCursorPosition=cursorCoordinates[0]-minusPositions;    //новая позиция курсора
                }else if (line=1){
                    newCursorPosition=0;
                }
                if (pressedShift){
                    let selected=objectInProcess.getSelected();
                    if ((selected[0]+selected[1])===0){
                        objectInProcess.setSelected(newCursorPosition,cursorCoordinates[0]);
                    }else{
                        selected[0]=newCursorPosition;
                        objectInProcess.setSelected(selected[0],selected[1]);
                    }


                }else{
                    objectInProcess.setSelected(0,0);
                }                            
                cursorCoordinates[0]=newCursorPosition;

                break; 
            }
            case 40: {  //Стрелка вниз
                e.preventDefault();
                let cursorPositionInText = getLineOfText(objectInProcess.getText(),cursorCoordinates);
                let line=cursorPositionInText.line;
                let newCursorPosition=0;
                if (line<cursorCoordinates.length){
                    let nextStringPositions=cursorPositionInText.position<cursorCoordinates[line+1]<0?cursorCoordinates[line+1]:cursorPositionInText.position; //столько символов приплюсуем в следующей строке
                    let plusPositions=nextStringPositions+(cursorCoordinates[line]-cursorPositionInText.position);            // по идее на столько символов мы идём зниз
                    newCursorPosition=cursorCoordinates[0]+plusPositions;    //новая позиция курсора
                }else if (line===cursorCoordinates.length){
                    newCursorPosition=cursorPositionInText;
                }
                if (pressedShift){
                    let selected=objectInProcess.getSelected();
                    if ((selected[0]+selected[1])===0){
                        objectInProcess.setSelected(cursorCoordinates[0],newCursorPosition);
                    }else{
                        selected[1]=newCursorPosition;
                        objectInProcess.setSelected(selected[0],selected[1]);
                    }


                } else{
                    objectInProcess.setSelected(0,0);
                }                             
                cursorCoordinates[0]=newCursorPosition;                        
            
                break;
            }
            case 37: { //Стрелка влево    //на одну позицию назад
                e.preventDefault();
                let newCursorPosition=cursorCoordinates[0]===0?0:cursorCoordinates[0]-1;

                if (pressedShift){
                    let selected=objectInProcess.getSelected();
                    if ((selected[0]+selected[1])===0){
                        objectInProcess.setSelected(newCursorPosition,cursorCoordinates[0]);
                    }else{
                        selected[0]=newCursorPosition;
                        objectInProcess.setSelected(selected[0],selected[1]);
                    }


                }else{
                    objectInProcess.setSelected(0,0);
                }                            
                cursorCoordinates[0]=newCursorPosition;                      
            
                break;
            }
            case 39: { //Стрелка вправо  //на одну позицию вперед
                e.preventDefault();
                let newCursorPosition=cursorCoordinates[0]
                    +(cursorCoordinates[0]>=(objectInProcess.getText().length)?0:1);
                if (pressedShift){
                    let selected=objectInProcess.getSelected();
                    if ((selected[0]+selected[1])===0){
                        objectInProcess.setSelected(cursorCoordinates[0],newCursorPosition);
                    }else{
                        selected[1]=newCursorPosition;
                        objectInProcess.setSelected(selected[0],selected[1]);
                    }


                } else{
                    objectInProcess.setSelected(0,0);
                }                             
                cursorCoordinates[0]=newCursorPosition;     
            
                break;
            }
            case 27:  //ESC
                e.preventDefault();
                objectInProcess.setCursorPosition([0,0]);
                objectInProcess.setText("");
                break;   
            case 8:  //Backspace
                e.preventDefault();
                if (cursorCoordinates[0]>0){
                    let cursorCoordinates=objectInProcess.getCursorPosition();
                    let str=objectInProcess.getText();
                    let newStr=str.slice(0,(cursorCoordinates[0]-1))+str.slice(cursorCoordinates[0],str.length);
                    objectInProcess.setText(newStr);
                    cursorCoordinates[0]=cursorCoordinates[0]-1;
                    cursorCoordinates[0]=cursorCoordinates[0]<0?0:cursorCoordinates[0];
                    objectInProcess.getCursorPosition(cursorCoordinates); 
                    objectInProcess.setSelected(0,0);                           
                }
                break;
            case 46:  //del
                e.preventDefault();
                let str=objectInProcess.getText();
                let selected=objectInProcess.getSelected();
                if ((selected[0]+selected[1])===0){
                    if (cursorCoordinates[0]<str.length){
                        let newStr=str.slice(0,(cursorCoordinates[0]))+str.slice(cursorCoordinates[0]+1,(str.length));
                        objectInProcess.setText(newStr);
                    }
                }else{
                    let newStr=str.slice(0,selected[0])+str.slice(selected[1],str.length);
                    objectInProcess.setText(newStr);
                    cursorCoordinates[0]=selected[0];
                    objectInProcess.setCursorPosition(cursorCoordinates);
                    objectInProcess.setSelected(0,0);
                }
                break;                        
            case 35:  //end;
                e.preventDefault();
                if (pressedShift){
                    objectInProcess.setSelected(cursorCoordinates[0],objectInProcess.getText().length);
                    
                }else{
                    objectInProcess.setSelected(0,0);
                }                
                cursorCoordinates[0]=objectInProcess.getText().length;
                objectInProcess.setCursorPosition(cursorCoordinates);

        
                break;  
            case 36:  //home;
                e.preventDefault();
                if (pressedShift){
                    objectInProcess.setSelected(0,cursorCoordinates[0]);
                } else{
                    objectInProcess.setSelected(0,0);
                }               
                cursorCoordinates[0]=0;
                objectInProcess.setCursorPosition(cursorCoordinates); 

                                    
                break;                              
            

            default:
                break;  
        }

        //console.log(objectInProcess.getSelected());
    }

    onMouseUp(){
        currentObject[currentObject.length-1]=objectInProcess;
        this.createFrame();
    }   
   
    onMouseMove(){}

    getSettingsPanel(){  //панель со свойствами: цвет, размер линии, заливка и т.п.
        let result="";

        result="Размер шрифта: <input id='sizeSettings' type='number' value='"
            +this.getSize()+"' onchange='sizeSettingsFunction(objectInProcess)'/><br>"
            +"Интервал: <input id='textIntervalSettings' type='number' value='"
            +this.getTextInterval()+"' onchange='textIntervalSettingsFunction(objectInProcess)'/><br>"
            +"Межстрочный: <input id='linesIntervalSettings' type='number' value='"
            +this.getLinesInterval()+"' onchange='linesIntervalSettingsFunction(objectInProcess)'/>"; //<br>"
            //+"Отступ: <input id='offsetSettings' type='number' value='"
            //+this.getOffset()+"' onchange='offsetSettingsFunction(objectInProcess)'/>";

        return result;
    }     
}

class ImageShape extends BaseShape{
    constructor(...args){
        super(args[0]);

        this.width=args[2];
        this.height=args[3];
        this.points=[ new Point(mainCanvas.width/2-(this.width/2), mainCanvas.height/2-(this.height/2))
                    , new Point(mainCanvas.width/2+(this.width/2), mainCanvas.height/2+(this.height/2))]; //new Point, new Point
        this.rotation=0; //degrees
        this.path=args[1];
        this.numberInArray=args[4];
        this.createFrame();
    }

    getSettingsPanel(){  //панель со свойствами: цвет, размер линии, заливка и т.п.
        let result="";

        result="Высота: <input id='heightSettings' type='number' value='"
            +this.getHeight()+"' onchange='heightSettingsFunction(objectInProcess)'/><br>"
            +"Ширина: <input id='widthSettings' type='number' value='"
            +this.getWidth()+"' onchange='widthSettingsFunction(objectInProcess)'/><br>"
            +"Угол вращения: <input id='rotationSettings' type='number' value='"
            +this.getRotation()+"' onchange='rotationSettingsFunction(objectInProcess)'/><br>";

          return result;
    }  

    getNumberInArray(){
        return this.numberInArray;
    }

    setNumberInArray (value){
        this.numberInArray=number;
    }

    getPicture(){
        return imagesInPicture[this.getNumberInArray()];

    }

    getWidth(){
        return this.width;
    }

    setWidth(value){
        this.width=value;
    } 
    
    getHeight(){
        return this.height;
    }

    setHeight(value){
        this.height=value;
    }       

    setRotation(value){
        this.rotation=value;
    }     

    getRotation(){
        return this.rotation;
    } 

    setPath(value){
        this.path=value;
    }     

    getPath(){
        return this.path;
    }  
    
    createFrame(){
        this.setWidth(this.points[1].getX()-this.points[0].getX());
        this.setHeight(this.points[1].getY()-this.points[0].getY());

        let x1=minCoordinate(this.points,"x");
        let y1=minCoordinate(this.points,"y");
        let x2=maxCoordinate(this.points,"x");
        let y2=maxCoordinate(this.points,"y");
        this.setFrame(new Point(x1-3,y1-3), new Point(x2+3,y2+3));  //по этим координатам потом будем искать при выделени 
        objectInProcess=this; //   
     //   console.log("createFrame");   
     //   console.log(this.getFrame()); 

    }
    
    showFrame(){
        let x1=this.points[0].getX();
        let y1=this.points[0].getY();
        let x2=x1+this.getWidth();
        let y2=y1+this.getHeight();
        

        context.beginPath();
        context.setLineDash([5,2]);
        context.lineWidth="1";
        context.strokeStyle="rgb(195, 197, 201)";
        context.rect(x1-3,y1-3,x2-x1+6,y2-y1+6);
     //   objectInProcess.setFrame(new Point(x1-3,y1-3), new Point(x2+3,y2+3));  //по этим координатам потом будем искать при выделени
    //   console.log(x1+","+y1+" - "+x2+","+y2);
    //   console.log(this.getFrame());

        context.strokeStyle="rgb(150, 150, 160)";
        context.fillStyle=context.strokeStyle;
        context.fillRect(x1-3-4,y1-3-4,8,8);
        context.fillRect(x2+3-4,y2+3-4,8,8);
        context.fillRect(x1-3-4,y2+3-4,8,8);
        context.fillRect(x2+3-4,y1-3-4,8,8);
        context.stroke();

        context.setLineDash([]);         
    }

    show(){
        if ((this.getHeight()+this.getWidth())===0){
            this.setWidth(this.getPicture().width);
            this.setHeight(this.getPicture().height);
            this.points=[ new Point(mainCanvas.width/2-(this.getWidth()/2), mainCanvas.height/2-(this.getHeight()/2))
                ,new Point(mainCanvas.width/2+(this.getWidth()/2), mainCanvas.height/2+(this.getHeight()/2))];
            this.createFrame();
            objectInProcess=this; //
            

        }
        if (this.inProcess){ 
            this.showFrame();
        }        
        context.restore();
        context.beginPath();
        //context.transform();

        context.drawImage(this.getPicture(),this.points[0].getX(),this.points[0].getY(),this.getWidth(),this.getHeight());
        context.stroke();
    }

}


class FillShape extends BaseShape  {
    constructor(...args){
        super(...args);
        this.color=args[1];
        this.lines=[];
    }


    getColor(){
        return this.color;
    }

    setColor(color){
        this.color=color;
        this.modify();
    }

    clearLines(){
        this.lines=[];
    }

    addLine(...args){ //x1,y1,x2,y2
        this.lines.push(new LineForFill(...args));
    }


    show(){
        this.lines.forEach(line => {
            context.beginPath();
            context.restore(); 
            context.strokeStyle=this.getColor();        
            context.moveTo(line.getPoint0().getX(),line.getPoint0().getY());
            
            context.lineTo(line.getPoint1().getX(),line.getPoint1().getY());
            context.stroke();            
        });       
    }

    onMouseMove(coordinates,buttonPressed){
        objectInProcess=this;
    }
/*
    getSettingsPanel(){  //панель со свойствами: цвет, размер линии, заливка и т.п.
        let result="";

        result="Толщина линии: <input id='lineWidthSettings' type='number' value='"
                +this.getLineWidth()+"' onchange='lineWidthSettingsFunction(objectInProcess)'/>";

        return result;
    }       
*/   
}