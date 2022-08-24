import { Component, ViewChild, ElementRef, OnInit,} from '@angular/core';
import { Point } from "./point.model";

@Component({
  selector: 'app-Canvas',
  template: `

 <button #reset (click)="reDo($event)"> Reset Points </button>
 <input #imgInput type = "file" (change)="selectFile($event)" style="background-color: red; color: white; margin: 10px;">

<label for ="shots"> </label>
<select id = "shots" name = "shots" #shotList>
  <option value="EForehand"> Eastern Forehand</option>
<option value="SWForehand"> Semi-Western Forehand</option>
<option value="WForehand"> Western Forehand</option>
<option value="twoHForehand"> Two Handed Backhand</option>
<option value="oneHForehand"> One Handed Backhand</option>
</select>


 <div class="float-container">

 <div class = "float-child">
 <canvas #canvas width=500 height=500></canvas>
 </div>
   <div class = "float-child">

 <p> Shoulder to Elbow =  {{ShoulderToElbow}} degrees<p>
 <p> Elbow to Wrist =  {{ElbowToWrist}} degrees<p>
 <p> Wrist to Racket Tip =  {{WristToTip}} degrees<p>
</div>
<div class = "float-child">
  <p> Ideal Shoulder to Elbow = {{iShoulderToElbow}} <span style="color: red">  {{shoulderElbowDif}}  </span></p>
  <p> Ideal Elbow to Wrist = {{iElbowToWrist}}  <span style="color: red">  {{elbowWristDif}}  </span></p>
  <p> Ideal Wrist to Racket Tip = {{iWristToTip}} <span style="color: red">  {{wristRacketDif}}  </span> </p>
</div>
</div>

   `,

   styles: ['canvas { min-width: 150px; min-height: 300px; border-style: solid; background-color: white; margin:auto; display: inline-block; text-align: center;}',
  'button {font-size: 16px;  background-color: aqua; font-weight: bold; margin: 10px; display: block; width: auto;}',' .container {width: 500px; height: auto; padding:5px; margin:auto; text-align:center; background-color: white; font-family: arial; font-size: 16px; border-style: groove; border-radius: 5px;}',
'.float-container{padding: 20px;}',' .float-child{float: left; padding:20px; border-style: inset; border-radius: 5px; background-color: white; margin:5px;}', '.float-child2{ float: right;}', 'button:hover{ color: red;}' ]

 })

export class CanvasComponent implements OnInit{

  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('shotList', {static: false}) shotList: ElementRef<HTMLInputElement>;

  public ctx: CanvasRenderingContext2D;

  imgUrl = '../../assets/semiWest.png';
  requestId;
  semiWest = [];
  mouseX = 1;
  mouseY = 1;
  points: Point[] = [];
  img = new Image (150, 300);
  loaded = false;
  index = 1;
  // the held values for the user's input
  ShoulderToElbow =0;
  ElbowToWrist = 0;
  WristToTip = 0;

  //calculated vs ideal for selected shot-type
  shoulderElbowDif;
  elbowWristDif;
  wristRacketDif;
  trueY;

  //ideal values for selected shot.
  iShoulderToElbow;
  iElbowToWrist = 0;
  iWristToTip = 0;


  // ideal angles Semi-Western

  SWShoulderToElbow = 122;
  SWElbowToWrist = 96;
  SWWristToTip = 170;

  // ideal angles Western
  WShoulderToElbow = 128;
  WElbowToWrist = 92;
  WWristToTip = 187;

  // ideal angles Eastern

  EShoulderToElbow = 137;
  EElbowToWrist = 114;
  EWristToTip = 140;


  constructor() {}

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.img.src = '../../assets/Instructions.png';
    this.ctx.fillRect(10,10,10,10);
    this.ctx.font = "18px arial";

    document.addEventListener('mousemove', (event) => {

      this.mouseX= event.offsetX;
      this.mouseY = event.offsetY;
      this.trueY = event.y;


      });


      window.addEventListener('mousedown', (event) =>{
        console.log(this.trueY);
        if (this.trueY > 166){
        let a:  Point = {x: this.mouseX, y: this.mouseY};
        this.points.push(a);

        }
        if (this.points.length > 4){
          this.points.shift();
        }



      })
      setInterval(() => {
        this.refresh();
      }, 400);

  }

  refresh(){
    this.index = 1;
    this.ctx.clearRect(0,0,500,500);
    this.ctx.drawImage(this.img,0,0,500,500);
    this.ctx.fillStyle = 'rgb(0,200,0)'
    this.index = 1;
    this.points.forEach(Point => {

      this.ctx.fillRect(Point.x, Point.y, 5, 5);
      this.ctx.fillText(this.index.toString(), Point.x, Point.y - 5);
      this.index++;
    })
    this.calculateAngles();
   }

   // resets the drawn points
   reDo(event:Event){

    this.points = [];
    this.shoulderElbowDif = 0;
    this.elbowWristDif = 0;
    this.wristRacketDif = 0;
  }

  selectFile(event){

    let tempImg;
    let convImg = new Image(50,50);
    let reader;


    if(event.target.files){
      tempImg = event.target.files[0];
      reader = new FileReader();
      reader.readAsDataURL(tempImg);
      reader.onloadend = function (event) {
        convImg.src = event.target.result;
      };
      this.translateImg(convImg);


    }


  }

  translateImg(input){
    this.img = input;

    console.log("img src is" + this.img.src);

    this.points = [];
  }

  calculateAngles(){

    // checks the correct ideals are used:

    console.log(this.shotList.nativeElement.value);
    switch (this.shotList.nativeElement.value)  {

        case "EForehand":
          this.iShoulderToElbow = this.EShoulderToElbow;
          this.iElbowToWrist = this.EElbowToWrist;
          this.iWristToTip = this.EWristToTip;
          break;
        case "SWForehand":
          this.iShoulderToElbow = this.SWShoulderToElbow;
          this.iElbowToWrist = this.SWElbowToWrist;
          this.iWristToTip = this.SWWristToTip;
          break;
          case "WForehand":
            this.iShoulderToElbow = this.WShoulderToElbow;
            this.iElbowToWrist = this.WElbowToWrist;
            this.iWristToTip = this.WWristToTip;
            break;
            default:
              console.log("error, none of the cases matched the selected shot.");
    }

// shoulder to elbow calcs
    if(this.points.length > 1){
    let x1 = this.points[0].x - this.points[1].x;
    let y1 = this.points[0].y - this.points[1].y;

    let ang1 = Math.atan2(y1,x1);
    ang1 *= 180/Math.PI;
    ang1 -= 90;
    ang1 = Math.floor(ang1);
    if(ang1 < 0){
      ang1 = ang1 + 360;
    }

    this.ShoulderToElbow = ang1;
    let a = this.ShoulderToElbow - this.iShoulderToElbow;
    if (a > 0){
      this.shoulderElbowDif = "+ " + a;
    }
    else {this.shoulderElbowDif = a;}
  }

  // elbow to wrist calc

  if(this.points.length > 2){
    let x1 = this.points[1].x - this.points[2].x;
    let y1 = this.points[1].y - this.points[2].y;

    let ang1 = Math.atan2(y1,x1);
    ang1 *= 180/Math.PI;
    ang1 -= 90;
    ang1 = Math.floor(ang1);
    if(ang1 < 0){
      ang1 = ang1 + 360;
    }
    this.ElbowToWrist = ang1;

    let a = this.ElbowToWrist - this.iElbowToWrist;
    if (a > 0){
      this.elbowWristDif = "+ " + a;
    }
    else {this.elbowWristDif = a;}
  }

// wrist to racket tip

if(this.points.length > 3){
  let x1 = this.points[2].x - this.points[3].x;
  let y1 = this.points[2].y - this.points[3].y;

  let ang1 = Math.atan2(y1,x1);
  ang1 *= 180/Math.PI;
  ang1 -= 90;
  ang1 = Math.floor(ang1);
  if(ang1 < 0){
    ang1 = ang1 + 360;
  }

  this.WristToTip = ang1;

  let a =  this.WristToTip - this.iWristToTip

    if (a > 0){
      this.wristRacketDif = "+ " + a;
    }
    else {this.wristRacketDif =  a;}
}

  }


}


