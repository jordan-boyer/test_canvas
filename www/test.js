function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.random() * (max - min + 1) + min;
}

function getRandomColor() {
    let colors = ["#226de5", "#ef1032", "#12c92d", "#000000", "#ffffff"];
    return colors[Math.floor(Math.random() * (colors.length + 1))];
}

class Shape {
    constructor(pos, size, direction, vitesse, color) {
        this.pos = pos;
        this.size = size;
        this.direction = direction;
        this.vitesse = vitesse;
        this.color = color;
    }

    isOutside(world) {
        if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > world.width || this.pos.y >= world.heigth)
            return true;
        return false;
    }

    move() {
        this.pos.x += (this.direction.x * this.vitesse.x);
        this.pos.y += (this.direction.y * this.vitesse.y);
    }

    render(context) {

    }
}

class Carre extends Shape {
    constructor(pos, size, direction, vitesse, color) {
        super(pos, size, direction, vitesse, color);
    }

    render(context) {
        context.fillStyle = this.color;
        context.fillRect(this.pos.x,this.pos.y,this.size.x, this.size.x);
    }
}

class Rectangle extends Shape {
    constructor(pos, size, direction, vitesse, color) {
        super(pos, size, direction, vitesse, color);
    }

    render(context) {
        context.fillStyle = this.color;
        context.fillRect(this.pos.x,this.pos.y,this.size.x, this.size.y);
    }
}

class Rond extends Shape {
    constructor(pos, size, direction, vitesse, color) {
        super(pos, size, direction, vitesse, color);
    }

    render(context) {
        context.beginPath();
        context.arc(this.pos.x,this.pos.y,this.size.x,0,2*Math.PI);
        context.fillStyle = this.color;
        context.fill();
    }
}

class Particule {
    constructor(pos, direction, vitesse, size, color = "#000000", shape = "CARRE"){
        if (shape.toLocaleUpperCase() === "ROND")
            this.particule = new Rond(pos, size, direction, vitesse, color);
        else if (shape.toLocaleUpperCase() === "RECTANGLE")
            this.particule = new Rectangle(pos, size, direction, vitesse, color);
        else
            this.particule = new Carre(pos, size, direction, vitesse, color);
    }

    isOutside(world) {
        return this.particule.isOutside(world);
    }

    move() {
        this.particule.move();
    }

    render(context) {
        this.particule.render(context);
    }
}

class ParticuleGenerator {
    constructor(pos) {
        this.pos = pos;
        this.particules = [];
        this.shape = ["CARRE", "ROND", "RECTANGLE"]
    }

    frame(world) {
        let toRemove = [];
        for (let i = 0; i < this.particules.length; i++)
            if (this.particules[i].isOutside(world))
                toRemove.push(i);
        
        for (let i = 0; i < toRemove.length; i++)
            this.particules.splice(toRemove[i], 1);

        let variables = {   direction: {x: getRandom(-1, 1), y: getRandom(-1, 1)},
                            vitesse: {x: getRandomInt(1, 10), y: getRandomInt(1, 10)},
                            size: {x: getRandomInt(16, 32), y: getRandomInt(16, 32)},
                            color: getRandomColor()
                        };
        
        /*if (variables.direction.x === 0 && variables.direction.y === 0)
            variables.direction.x = 1;*/
        this.particules.push(new Particule({x: this.pos.x, y: this.pos.y}, variables.direction, variables.vitesse, variables.size, variables.color, this.shape[getRandomInt(0, this.shape.length)]));

        for (let particule of this.particules)
            particule.move();
    }

    render(context) {
        context.fillStyle = "#721208";
        context.fillRect(this.pos.x, this.pos.y, 6, 6)
        for (let particule of this.particules) {
            particule.render(context);
        }
           
    }
}

class Canvas {
    constructor(id, width, heigth) {
        this.context = document.getElementById(id).getContext("2d");
        this.width = width;
        this.heigth = heigth;
        this.particules = [ new ParticuleGenerator({x: this.width / 2 - 3, y: this.heigth / 2 - 3}),
                            new ParticuleGenerator({x: 50, y: 50})];
    }

    loop() {
        this.input();
        this.frame();
        this.render();
        window.requestAnimationFrame(() => {
            this.loop.apply(this);
        });
    }

    render() {
        this.rectangle(0,0,this.width,this.heigth, "#ffb3ff");
        for (let particule of this.particules)
            particule.render(this.context);
    }

    input() {

    }

    frame() {
        for (let particule of this.particules)
            particule.frame({width: this.width, heigth: this.heigth});
    }

    rectangle(x1, y1, largeur, hauteur, color = "#000000") {
        this.context.fillStyle = color;
        this.context.fillRect(x1,y1,largeur,hauteur);
    }
}

let canvas = new Canvas("canvas", 800, 600);

canvas.loop();






