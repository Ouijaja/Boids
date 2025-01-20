class Boid {
  //constructor runs same as c++ construction graph

   
  constructor() {
    // position set to random on canvas
    this.position = createVector(random(width), random(height));
    //randomises velocity
    this.velocity = createVector(random(-1,1),random(-1,1));
    this.velocity.setMag(random(0.75, 1.75));
    this.maxVelocity = 3;

    this.colour = color(random(100,255),random(100,255),random(100,255));

    //sets acceleration and max
    this.acceleration = createVector(0,0);
    this.maxAcceleration = 1;

  }


  //##########Display#############
/*
  show() {
    
    
    strokeWeight(10); // point size
    stroke(255); //point colour
    triangle(this.position)
    point(this.position.x, this.position.y); //draws the point


  }
  
 */
  show() {
    push(); // Save the current drawing state

    translate(this.position.x, this.position.y); // Move to boid's position
    let angle = this.velocity.heading(); // Get the angle of the velocity vector
    
    
    rotate(angle+90); // Rotate the canvas to align with the velocity

    // Draw a triangle
    
    stroke(this.colour); // Outline color
    strokeWeight(5); // Boid size
    beginShape();
    vertex(0, -5); // Point of the triangle (boid's head)
    vertex(-3, 5); // Left side
    vertex(3, 5); // Right side
    endShape(CLOSE);

    pop(); // Restore the previous drawing state
  }

  //updates boid motion 
  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxVelocity);


  }

  //copied from example. wrap canvas edges so boids can't escape
  
  edges() {
    if (this.position.x > width) {
      this.position.x = 0
    } else if (this.position.x < 0) {
      this.position.x = width
    }

    if (this.position.y > height) {
      this.position.y = 0
    } else if (this.position.y < 0) {
      this.position.y = height
    }
  }






  //##################Behaviour######################
///*
  //Separation - changing  direction according to incoming particles in range
  separate(boids) {

    let perceptionRadius = 50;
    let totalBoids = 0; //No. boids in perception radius
    let avoidance = createVector(); //average velocity


    //loops through every boid to check if within perception radius. Seems inefficient
    boids.forEach(boid => {
      let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y); //calculate distance
     
      if (d < perceptionRadius && boid != this) {
        // Calculates the avarage avoidance vector (inverse to the distance vector between two boids)
        let diff = p5.Vector.sub(this.position, boid.position);
        diff.div(d);


        //Adds to avoidance force vector proportional inverse vector. I don't get this part.
        avoidance.add(diff);
        totalBoids++;


      }


    })

    if (totalBoids > 0) {
      avoidance.div(totalBoids);
      avoidance.setMag(this.maxVelocity);
      avoidance.sub(this.velocity);
      avoidance.limit(this.maxAcceleration);

    }

    return avoidance;

  }
//*/

  //Alignment

  align(boids) {
    let perceptionRadius = 25;
    let totalBoids = 0; //No. boids in perception radius
    let desiredForce = createVector();


    //loops through every boid to check if within perception radius
    boids.forEach(boid => {
      let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);

      if (d < perceptionRadius && boid != this) {
        desiredForce.add(boid.velocity);
        totalBoids++;

      }
    })

    if (totalBoids > 0) {
      desiredForce.div(totalBoids);
      desiredForce.sub(this.velocity);
      desiredForce.limit(this.maxAcceleration);

    }

    return desiredForce;


  }

//Cohesion

cohesion(boids){
  let perceptionRadius =50;
  let totalBoids = 0; 
  let steering = createVector();


  //loops through every boid to check if within perception radius
  boids.forEach(boid => {
    let d = dist(this.position.x, this.position.y, boid.position.x, boid.position.y);

    if (d < perceptionRadius && boid != this) {
      steering.add(boid.position);
      totalBoids++;

    }
  })

  if(totalBoids > 0 ){
    steering.div(totalBoids);
    steering.sub(this.position);
    steering.setMag(this.maxVelocity);
    steering.sub(this.velocity);
    steering.limit(this.maxAcceleration);


  }

  return steering;

}


//Flock - uses force vectors determined above

flock(boids){
  this.acceleration.set(0,0); //Resets boid acceleration every frame

  //Gets returned force vectors
  
  let alignment = this.align(boids);  //functions referred to here use capitals in tutorial? Bug!
  let cohesion = this.cohesion(boids);
  let avoidance = this.separate(boids);

    // Arbitrarily weight these forces
    avoidance.mult(1.0);
    alignment.mult(1.0);
    cohesion.mult(1.0);

  //Adds acceleration force to above values

  this.acceleration.add(alignment);
  this.acceleration.add(cohesion);
  this.acceleration.add(avoidance);

}







}