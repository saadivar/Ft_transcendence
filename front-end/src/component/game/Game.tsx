
// import { AxesHelper } from 'three';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader , GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { UserContext } from './StartGame';
import { useContext } from 'react';
import './Game.css'

export class Player
{
    constructor(name :any, goals : any)
    {
        this.raquete = undefined;
        this.goals = goals;
        this.name = name;
    }
    raquete : any;
    goals : any;
    name : any;
}

  


interface props{
    roomName : string;
    mode : string;
}
  
function Game({roomName , mode} : props) {

const socket = useContext(UserContext);


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setClearColor(0x000000, 0); 
renderer.setSize( window.innerWidth, window.innerHeight );
const controls = new OrbitControls( camera, renderer.domElement );
document.body.appendChild( renderer.domElement );




const  player1 = new Player(document.getElementById("player1Name"), document.getElementById("player1Score"));
const  player2 = new Player(document.getElementById("player2Name"), document.getElementById("player2Score"));





const loader = new GLTFLoader();
let TableboundingBox : THREE.Box3;
let object1 : THREE.Object3D;
let tableWidth : number;
let tableHeight : number;


loader.load( 'src/component/game/table.glb', function ( gltf : GLTF) {

    object1 = gltf.scene;
    TableboundingBox = new THREE.Box3().setFromObject(object1);
    tableWidth = TableboundingBox.max.x - TableboundingBox.min.x;
    tableHeight = TableboundingBox.max.z - TableboundingBox.min.z;
    object1.position.y = -(TableboundingBox.max.y - TableboundingBox.min.y) - 0.6;
    scene.add(object1);
    object1.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.material.color.set(0x6A0404); 
        }
    });

}, undefined, function ( error : any) {
    console.error( error );
} );


// interface Ball {
//     dirX : number,
//     dirY : number,
//     object : THREE.Mesh;
// }


const ShodowGeometry = new THREE.SphereGeometry(0.05, 32, 32);
const ShodowMaterial = new THREE.MeshBasicMaterial({color: 0x000000, transparent : true, opacity : 0.8})
const shodow = new THREE.Mesh(ShodowGeometry, ShodowMaterial);
shodow.position.y = -0.8;
scene.add(shodow);

const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xEAAD0F, transparent : true})

let ball = {
    dirX : 0,
    dirY : 0,
    object :  new THREE.Mesh(sphereGeometry, sphereMaterial),
}

ball.object.position.y = -0.5;
ball.object.position.z = -2.5;
ball.object.position.x = 0;
scene.add( ball.object );


let boundingBox : any;
setTimeout(() =>{
    loader.load( 'src/component/game/raquete1.glb', function ( gltf : GLTF ) {
    
        player1.raquete = gltf.scene;
        player1.raquete.scale.set(0.3, 0.3, 0.3);

        boundingBox = new THREE.Box3().setFromObject(object1);
        player1.raquete.position.set(0, -1.3, (boundingBox.max.z - boundingBox.min.z) * -0.5);
        scene.add( player1.raquete );
            
    }, undefined, function ( error : any ) {
        console.error( error );
    } );
    loader.load( 'src/component/game/raquete1.glb', function ( gltf : GLTF ) {
    
        player2.raquete = gltf.scene;
        player2.raquete.scale.set(0.3, 0.3, 0.3);
        boundingBox = new THREE.Box3().setFromObject(object1);

        player2.raquete.position.set(0, -1.3, (boundingBox.max.z - boundingBox.min.z) * 0.5);
        scene.add( player2.raquete );
            
    }, undefined, function ( error : any) {
        console.error( error );
    } );
}, 4000)






scene.add(new THREE.AmbientLight(0x404040, 100));
// const axesHelper = new THREE.AxesHelper(10);
// scene.add(axesHelper);



camera.position.set(-0.0029942240469618634,  0.2659820207895358,  -4.569881242557547);
controls.update();
controls.enablePan = false; // Disable panning
controls.enableZoom = false; // Disable zooming 
// controls.enableRotate = false; // Disable rotation



renderer.domElement.addEventListener('mousemove', onMouseMove);

let initclientX = window.innerWidth / 2;
let initClientY = window.innerHeight / 2;
let stepX = 0;

function onMouseMove(event : MouseEvent) {
        if (player1.raquete && !controls.enabled)//
        {
            moveZ = (event.clientY - initClientY) / window.innerHeight * 3;
            stepX = (event.clientX - initclientX) / window.innerWidth * (boundingBox.max.x - boundingBox.min.x); 
            if (player1.raquete.position.x < -0.1)
                player1.raquete.rotation.z = Math.PI/5;
            else if (player1.raquete.position.x > 0.1)
                player1.raquete.rotation.z = -Math.PI/5;
            else
                player1.raquete.rotation.z = 0;

            player1.raquete.position.z -= moveZ;
            player1.raquete.position.x -=  stepX;
            if (mode == 'online')
                socket.emit('PlayerMoves', [player1.raquete.position, player1.raquete.rotation, 'salah', index]);
            if (index == 1)
            {
                socket.emit('moveX', ['salah' ,stepX]);
                socket.emit('moveZ', ['salah' ,moveZ]);
                socket.emit('speed', ['salah', event.clientY - initClientY]);
            }
            else{
                if (event.clientY - initClientY < -80){
                    p1Speed =  -0.17;
                    falligPoint = 1.1;

                }
                else if (event.clientY - initClientY < -40){
                    p1Speed =  -0.13;
                    falligPoint = 1;
                }
                else {
                    p1Speed =  -0.1;
                    falligPoint = 0.2;
                }
            }
            initclientX = event.clientX ;
            initClientY = event.clientY;
        }

}

let stepZ = -0.1;



function reset(){
    ball.object.position.y = -0.5;
    ball.object.position.z = 2.5 * (stepZ < 0 ? -1 : 1);
    ball.object.position.x = 0;
    ball.dirX = 0;
    falligPoint = 0.2;
    stepZ  = 0;
    up = false;
    floorY = -0.8;

}
    
let maxZ = 11 / 2;
let minZ = 11 / -2;
let maxX = 6 / 2;
let minX = 6 / -2;
let moveX = 0;
let moveZ = 0;
let timer1 = 0;
let timer2 = 0;
let flag1 = false;
let flag2 = false;

function timerCheck(){
    if (flag1)
        timer1++;
    if (flag2)
        timer2++;
    if (timer1 > 20)
    {
        timer1 = 0;
        flag1 = false;
    }
    if (timer2 > 20)
    {
        timer2 = 0;
        flag2 = false;
    }
}

let gravity = 9.8;

let deltaT = 1/40;        
let up = false;
let move = false;
let rot = 0;
let index : number;

let factor = 5;
function calculateStepY(){
    return ((-0.5 * gravity * Math.pow(deltaT, 2) - Math.abs(stepZ) * (deltaT)) * factor); // stepz could be negative that is why must be abs
}

function touchRaquete(raqueteX : number, raqueteRotZ : number){
    if (Math.abs(Math.abs(ball.object.position.x) - Math.abs(raqueteX)) < 0.3)
        return (true);
    if (Math.abs(Math.abs(ball.object.position.x) - Math.abs(raqueteX)) - 0.6 < 0.3 && Math.abs(ball.object.position.x)  > Math.abs(raqueteX) && raqueteRotZ != 0)
        return(true);
    if (Math.abs(Math.abs(ball.object.position.x) - Math.abs(raqueteX)) + 0.6 < 0.3 && raqueteRotZ != 0)
        return(true);
    return(false);
}

let middle = 0;
let falligPoint = 0.2;
let floorY = -0.8;

function animate() {
if (index == undefined && mode == 'online')
    socket.emit('index', "salah");
if (ball.object && object1 && player1.raquete && player2.raquete && (index == 0 || mode == "practice"))
{
    
        maxZ = tableHeight / 2;
        minZ = tableHeight / -2;
        maxX = tableWidth / 2.2;
        minX = tableWidth / -2.2;
        if (!flag2 && Math.abs(player2.raquete.position.z - ball.object.position.z) < 0.3 && touchRaquete(player2.raquete.position.x, player2.raquete.rotation.z))
        {
            if (mode == "practice")
                falligPoint = 1.5;

            middle = ball.object.position.z - falligPoint;   
            stepZ = p2Speed;
            move = true;
            up = false; 
            flag2 = true;
            stepZ *= -1;
            ball.dirX += -moveX / 4;
            moveX = 0;
            if (mode == "practice"){
                ball.dirX *= -1;
                player2.raquete.position.z -= 0.8;
                stepZ = -0.15;
            }
        }
        if (!flag1 && Math.abs(player1.raquete.position.z - ball.object.position.z) < 0.3 && touchRaquete(player1.raquete.position.x, player1.raquete.rotation.z))
        {
            middle = ball.object.position.z + falligPoint;;
            stepZ = p1Speed;
            up = false;
            move = true;
            flag1 = true;
            stepZ *= -1;
            ball.dirX += -stepX / 4;
            if (mode == "practice")
                player2.raquete.position.z = (boundingBox.max.z - boundingBox.min.z) * 0.5
        }
        else if(ball.object.position.z > maxZ*1.5)
        {
            reset();
        }
        else if(ball.object.position.z < minZ*1.5)
        {
            reset()
        }
        if (ball.object.position.x >= maxX || ball.object.position.x <= minX){
            // reset();
            floorY = -1;
        }
        if (move){
            ball.object.position.x += ball.dirX;
            ball.object.position.z += stepZ;

            if (ball.object.position.y > floorY && !up)
            {
                console.log("false : ", ball.object.position.y);

                if(ball.object.position.z < middle && stepZ > 0)
                    ball.object.position.y -= calculateStepY();
                else if (ball.object.position.z  > middle && stepZ > 0)
                    ball.object.position.y += calculateStepY();
                else if (ball.object.position.z < middle && stepZ < 0)
                    ball.object.position.y += calculateStepY() ;
                else if (ball.object.position.z  > middle && stepZ < 0)
                    ball.object.position.y -= calculateStepY();
            }
            else{
                ball.object.position.y -= calculateStepY();
                if (ball.object.position.y > -0.5)
                    up = false;
            }
            if (ball.object.position.y <= floorY)
            {
                up = true;
                if (stepZ > 0)
                    middle = ball.object.position.z + falligPoint / 2;
                else
                    middle = ball.object.position.z - falligPoint / 2;
            }
        }
        if (mode == "practice"){
           player2.raquete.position.x =  ball.object.position.x ;

        }
        timerCheck();
        }
        if (ball.object && mode == "online" && index == 0)
            socket.emit('data', [{x : ball.object.position.x, y : ball.object.position.y, z : ball.object.position.z}, "salah"]);

        shodow.position.x = ball.object.position.x;
        shodow.position.z = ball.object.position.z;
        if (shodow.position.z > maxZ || shodow.position.z < minZ || shodow.position.x < minX || shodow.position.x > maxX)
            shodow.material.opacity = 0;
        else{
            ShodowMaterial.color = new THREE.Color(0x0000000);
            shodow.material.opacity = 0.5;
        }
        setTimeout(function() {
            requestAnimationFrame(animate);
    }, 1000 / 60); 
    renderer.render( scene, camera );
}
1

document.addEventListener('mousedown', mouseDown);
document.addEventListener('mouseup', mouseUp);

function mouseUp(event : MouseEvent){
    if (controls)
        controls.enabled = true;
    if (player1.raquete)
        player1.raquete.rotation.x = 0;
}

function mouseDown(event : MouseEvent) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(player1.raquete);
    if (!intersects)
        return ;
    if (intersects.length > 0) {
        controls.enabled = false;
    }
}

socket.on('data', (message : any)=> {
    if (index == 1 && ball.object){
        ball.object.position.x = message[0].x;
        ball.object.position.y = message[0].y;
        ball.object.position.z = -message[0].z;
    }
})

socket.on('moveX', (mx : any) => {
    moveX = mx;
})


let p2moveZ : number;
socket.on('moveZ', (mz : any) => {
    // console.log("moveZ : ", mz);

    p2moveZ = mz;
})

socket.on('PlayerMoves', (pos : any, rot : any) => {
    player2.raquete.position.x = pos.x;
    player2.raquete.position.y = pos.y;
    player2.raquete.position.z = -pos.z;

    player2.raquete.rotation.copy(rot);

})


socket.on('index', (i) =>{
    index = i;
    console.log("Game index : ", i);
})

let p2Speed = 0.1;
let p1Speed = -0.1;

socket.on('speed', (spd) => {
    p2Speed = spd;
})


socket.on('falligPoint', (fp) =>{
    falligPoint = fp;
})

animate();


return (
<div>
{/* <h1 style={}> TEST </h1> */}

</div>
)
}

export default Game

