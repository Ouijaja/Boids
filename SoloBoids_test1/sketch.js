const flock = [] //Array to store boids. Tutorial uses const rather than let, let is more flexible but not necessary as flock is neither updated nor re-declared
const maxBoids = 150 //Max number of boids. Const in tutorial
let play = false;



function setup() {
  createCanvas(800, 800);
  let playButton = createButton('Play/Pause');
  playButton.mousePressed(playState);



  //creates boids up to maxBoids limit  
  for (let i = 0; i < maxBoids; i++) {
    flock.push(new Boid())

  }


}

function draw() {
  background(0,0,0,100);

  if (play == true) {

    flock.forEach(boid => {
      boid.edges();
      boid.flock(flock);
      boid.update();
      boid.show();
    })

  }
}


function playState(){
if(play == true) {
play = false;
}else{
  play = true;
}

}