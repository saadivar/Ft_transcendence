import * as THREE from 'three';
import { FBXLoader, GLTFLoader, OrbitControls } from 'three/examples/jsm/Addons.js';
import './playersInfo.css'
import { Socket } from 'socket.io-client';

interface props{
	infos : string[];
    mode : string;
	socket : Socket;
};


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
let i = 0;

export default function FirstPage({infos , mode, socket} : props){
			if (i == 1){
				console.log("yes");
				return ;
			}
			console.log("infos: ", infos);
			i++;
			let tableWidth = 30;
			let tableHeight = 50;
			let p2Speed =  3;
			let p1Speed = -3;
			let camera:any, scene:any, renderer:any, stats:any;
			let initclientX = window.innerWidth / 2;
			let initClientY = window.innerHeight / 2;
			
			scene = new THREE.Scene();
			renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
			renderer.setClearColor(0x000000, 0); 
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.shadowMap.enabled = true;
			const root = document.getElementById('root');

			const container = document.createElement('div');
			container.id = 'player-info'; 
			container.style.position = 'absolute';
			container.style.top = '0px';
			container.style.left = '0px';
			container.style.padding = '10px';
			container.style.pointerEvents = 'none';
			const player1Info = document.createElement('div');
			const player2Info = document.createElement('div');
			const player1Name = document.createElement('a');
			const player2Name = document.createElement('a');
			const player1Img = document.createElement('img');
			const player2Img = document.createElement('img');
			const player1Score = document.createElement('span');
			const player2Score = document.createElement('span');
			const scoreInfo = document.createElement('div');

			player1Score.id = "player1-score";
			player2Score.id = "player2-score";

			player1Score.innerText = "0";
			player2Score.innerText = "0";

			scoreInfo.append(player1Score);
			scoreInfo.append(player2Score);
			scoreInfo.id = "score-info"
			container.append(scoreInfo);
			player1Img.src = infos[2];
			player2Img.src = infos[3];
			
			player1Name.innerText = infos[0];
			player1Info.appendChild(player1Name)
			player1Info.appendChild(player1Img)

			player1Info.id = 'player1-info';

			player2Name.innerText = infos[1];
			player2Info.appendChild(player2Name);
			player2Info.appendChild(player2Img);

			player2Info.id = 'player2-info';

			container.appendChild(player1Info);
			container.appendChild(player2Info);

			if (root) {
				root.appendChild(renderer.domElement);
				root.appendChild(container);
			} else {
				console.log("Element with ID 'root' not found.");
			}
			
			
			camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
			camera.position.set(
				0,
				70,
				-200 );
			camera.lookAt(0, 50, -100);


			const controls = new OrbitControls( camera, renderer.domElement );
			controls.target.set( 0, 100, 0 );
			controls.maxDistance = 2000;
			controls.update();
			
			
			
			const  player1 = new Player(document.getElementById("player1Name"), 0);
			const  player2 = new Player(document.getElementById("player2Name"), 0);
			let boundingBox : any;
			const glbloader = new GLTFLoader();
			let table : any;
			
			
			
			const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
			const sphereMaterial = new THREE.MeshBasicMaterial({color: 0xE71111, transparent : true})
			
			let ball = {
				dirX : 0,
				dirY : 0,
				object :  new THREE.Mesh(sphereGeometry, sphereMaterial),
			}
			
			const ShodowGeometry = new THREE.SphereGeometry(0.05, 32, 32);
			const ShodowMaterial = new THREE.MeshBasicMaterial({color: 0x000000, transparent : true, opacity : 0.5})
			const shodow = new THREE.Mesh(ShodowGeometry, ShodowMaterial);
			shodow.position.y = 45;
			shodow.scale.set(18, 18, 18);
			scene.add(shodow);
			// controls.enableZoom = false;
			// controls.enableRotate = false;
			// controls.enablePan = false;


			glbloader.load('src/component/game/table.glb', (gltf)=>{
				table = gltf.scene;
				table.castShadow = true;
				table.scale.set(30, 30, 30);
				boundingBox = new THREE.Box3().setFromObject(table);
				tableWidth = (boundingBox?.max.x - boundingBox?.min.x);
				tableHeight = boundingBox?.max.z - boundingBox?.min.z;
				scene.add(table);
			})

			const clock = new THREE.Clock();

			let mixer:any;

			base();
			logic();
			function logic(){

				// scene.add(new THREE.AxesHelper(100))
				setTimeout(() =>{
					ball.object.position.y = 50;
					ball.object.position.z =  -(boundingBox?.max.z - boundingBox?.min.z) * 0.4;
					ball.object.position.x = 30;
					ball.object.scale.set(18, 18, 18);
					scene.add( ball.object );
					glbloader.load( 'src/component/game/raquete1.glb', function ( gltf : any ) {
					
						player1.raquete = gltf.scene;
						player1.raquete.scale.set(6, 6, 6);
						player1.raquete.position.set(0, 40, (boundingBox?.max.z - boundingBox?.min.z) * -0.5);
						scene.add( player1.raquete );
							
					});
					glbloader.load( 'src/component/game/raquete1.glb', function ( gltf : any ) {
					
						player2.raquete = gltf.scene;
						player2.raquete.scale.set(6, 6, 6);
						// boundingBox = new THREE.Box3().setFromObject(table);
				
						player2.raquete.position.set(0, 40, (boundingBox?.max.z - boundingBox?.min.z) * 0.5);
						scene.add( player2.raquete );
							
					});
					glbloader.load('src/component/game/gameready_cottage_free.glb', (gltf) => {
						gltf.scene.scale.set(150, 150, 150);
						scene.add(gltf.scene);
					})
				}, 1000)

				renderer.domElement.addEventListener('mousemove', onMouseMove);

				let stepX = 0;
				let stepZ = -3;
				function onMouseMove(event : MouseEvent) {
						if (player1.raquete)// && !controls.enabled)
						{
							moveZ = (event.clientY - initClientY) / window.innerHeight * 70;
							stepX = (event.clientX - initclientX) / window.innerWidth * tableWidth ; 
							player1.raquete.position.z -= moveZ;
							player1.raquete.position.x -=  stepX / 1.5;

							if (player1.raquete.position.x > 5)
								player1.raquete.rotation.z  = -Math.PI / 6;
							else if (player1.raquete.position.x < -5)
								player1.raquete.rotation.z  = Math.PI / 6;
							else
								player1.raquete.rotation.z  = 0;

							if (mode == 'online')
								socket.emit('PlayerMoves', [player1.raquete.position, player1.raquete.rotation, infos[0], index]);
							if (index == 1)
							{
								socket.emit('moveX', [infos[0] ,stepX]);
								socket.emit('moveZ', [infos[0] ,moveZ]);
								socket.emit('speed', [infos[0], event.clientY - initClientY]);
							}
							else{
								if (event.clientY - initClientY < -200){
									console.log("ISHERER");
									p1Speed =  -10;
									deltaT = 1 / 30;
									player1fp = (boundingBox.max.z - boundingBox.min.z) / 3;
								}
								else if (event.clientY - initClientY < -150){
									p1Speed =  -7;
									deltaT = 1 / 30;
									player1fp = (boundingBox.max.z - boundingBox.min.z) / 3;
								}
								else if (event.clientY - initClientY < -100){
									deltaT = 1 / 35;
									p1Speed =  -6;
									player1fp = (boundingBox.max.z - boundingBox.min.z) / 3;
								}
								else {
									p1Speed =  -3;
									player1fp = (boundingBox.max.z - boundingBox.min.z) / 4;
								}
							}
							initclientX = event.clientX ;
							initClientY = event.clientY;
						}

				}
				function	reset(){
					if ((stepZ > 0 && lastFallingZ > 0) || (stepZ < 0 && !lastFallingZ)){
							player1.goals++;
							player1Score.innerText = player1.goals;
					} else if ((stepZ < 0 && lastFallingZ < 0) || (stepZ > 0 && !lastFallingZ) ) {
						player2.goals++;
						player2Score.innerText = player2.goals;
					}
					socket.emit('score', [player1.goals, player2.goals, infos[0]]);
					ball.object.position.y = 50;
					ball.object.position.z = -(boundingBox?.max.z - boundingBox?.min.z) * 0.4// * (stepZ < 0 ? 1 : -1);
					ball.object.position.x = 35;
					ball.dirX = 0;
					lastFallingZ = 0;
					// falligPoint = (boundingBox.max.z - boundingBox.min.z) / 4;
					stepZ  = 0;
					up = false;
					floorY = 45;
					deltaT = 1/35;
					touchNet = false;
					if (mode == "practice")
						player2.raquete.position.z = (boundingBox?.max.z - boundingBox?.min.z) * 0.5;
					if (player1.goals > 2 || player2.goals > 2){
						socket.emit('endGame',[player1.goals, player2.goals, infos[0]]);
					}
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
				let player1fp = (boundingBox?.max.z - boundingBox?.min.z) / 4;
				let player2fp = (boundingBox?.max.z - boundingBox?.min.z) / 4;

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

				let deltaT = 1/35;        
				let up = false;
				let move = false;
				let index : number;

				let factor = 10;
				function calculateStepY(){
					return ((-0.5 * gravity * Math.pow(deltaT, 2) - Math.abs(stepZ) * (deltaT)) * factor); // stepz could be negative that is why must be abs
				}

				function touchRaquete(raqueteX : number, raqueteRotZ : number){
					// if (Math.abs(ball.object.position.x - raqueteX) < 6)
					// 	return (true);
					// if (Math.abs(ball.object.position.x - raqueteX) - 12 < 6 && Math.abs(ball.object.position.x)  > Math.abs(raqueteX) && raqueteRotZ != 0)
					// 	return(true);
					// if (Math.abs(ball.object.position.x - raqueteX) + 12 < 6 && raqueteRotZ != 0)
					// 	return(true);



					if (ball.object.position.x <= 0 && raqueteX <= 0 && raqueteRotZ == 0)
						return((Math.abs(ball.object.position.x - raqueteX)) < 10 ? true : false);
					else if (ball.object.position.x <= 0 && raqueteX <= 0 && raqueteRotZ != 0)
						return((Math.abs(ball.object.position.x - (raqueteX - 5)) < 6) ? true : false);
					else if (ball.object.position.x >= 0 && raqueteX >= 0 && raqueteRotZ == 0)
						return((Math.abs(ball.object.position.x - raqueteX)) < 10 ? true : false);
					else if (ball.object.position.x >= 0 && raqueteX >= 0 && raqueteRotZ != 0)
						return((Math.abs(ball.object.position.x - (raqueteX + 5)) < 6) ? true : false);



					// if (raqueteRotZ == 0)
					// 	return((Math.abs(ball.object.position.x - raqueteX)) < 10 ? true : false);
					// return((Math.abs(ball.object.position.x - (raqueteX + 12)) < 10) ? true : false);

					return(false);
				}

				let middle = 0;
				let falligPoint = (boundingBox?.max.z - boundingBox?.min.z) / 4;
				let floorY = 45;
				let touchNet = false;
				// let endGame = false;
				let lastFallingZ = 0;
		function animate() {
				if (index == undefined && mode == 'online')
				{
					socket.emit('index', infos[0]);
					console.log("----------------EMIT INDEX : ", index);
				}
				if (ball.object && table && player1.raquete && player2.raquete && (index == 0 || mode == "practice"))
				{
						maxZ = tableHeight / 2;
						minZ = tableHeight / -2;
						maxX = tableWidth / 2;
						minX = tableWidth / -2;
						if (!touchNet && !flag2 && Math.abs(player2.raquete.position.z - ball.object.position.z) < 8 && touchRaquete(player2.raquete.position.x, player2.raquete.rotation.z))
						{
							falligPoint = player2fp;
							if (mode == "practice")
								falligPoint = (boundingBox.max.z - boundingBox.min.z) / 3;
							middle = ball.object.position.z - falligPoint;   
							stepZ = p2Speed;
							move = true;
							up = false; 
							flag2 = true;
							deltaT = 1/35;
							stepZ *= -1;
							floorY = 45;
							ball.dirX += -moveX / 4;
							moveX = 0;
							if (mode == "practice"){
								ball.dirX  = 0;
								player2.raquete.position.z -= (boundingBox.max.z - boundingBox.min.z) * 0.1;
								stepZ = -3;
							}
						}
						if (!touchNet && !flag1 && Math.abs(player1.raquete.position.z - ball.object.position.z) < 8 && touchRaquete(player1.raquete.position.x, player1.raquete.rotation.z))
						{
							falligPoint = player1fp;
							middle = ball.object.position.z + falligPoint;;
							stepZ = p1Speed;
							up = false;
							move = true;
							floorY = 45;
							flag1 = true;
							deltaT = 1/35;
							stepZ *= -1;
							ball.dirX += -stepX / 4;
							if (mode == "practice")
								player2.raquete.position.z = (boundingBox.max.z - boundingBox.min.z) * 0.5;
						}
						if (ball.object.position.z > tableHeight * 3 || ball.object.position.z < tableHeight * -3){
							reset();
						}
						if (ball.object.position.z > maxZ*1.5 || ball.object.position.z < minZ*1.5 || ball.object.position.x > maxX || ball.object.position.x < minX)
							floorY = 0;
						if (move){
							ball.object.position.x += ball.dirX;
							ball.object.position.z += stepZ;
							if (Math.abs(ball.object.position.z) < 10 && ball.object.position.y < 50 && floorY  && (mode == "online" || stepZ > 0)){
								falligPoint = 0.1;
								middle = ball.object.position.z - falligPoint;;
								up = false;
								stepZ *= -1;
								touchNet = true;
								stepZ = stepZ / 2;
							}
							if (ball.object.position.y > floorY && !up){
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
								if (ball.object.position.y > floorY)
									up = false;
							}
							if (ball.object.position.y <= floorY){
								if (floorY != 0)
									lastFallingZ = ball.object.position.z;
								up = true;
								if (stepZ > 0)
									middle = ball.object.position.z + falligPoint / 2;
								else
									middle = ball.object.position.z - falligPoint / 2;
							}

						}
						if (mode == "practice" && floorY > 0){
							player2.raquete.position.x =  ball.object.position.x ;
						}
						timerCheck();
						}
						if (ball.object && mode == "online" && index == 0)
							socket.emit('data', [{x : ball.object.position.x, y : ball.object.position.y, z : ball.object.position.z}, infos[0]]);

						shodow.position.x = ball.object.position.x;
						shodow.position.z = ball.object.position.z;
						shodow.position.y = floorY;
						requestAnimationFrame( animate );
						renderer.render( scene, camera );

						const delta = clock.getDelta();

						if ( mixer ) mixer.update( delta );


				}

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

				
					if (player1 && player1.raquete) {
						const intersects = raycaster.intersectObject(player1.raquete);
						if (intersects.length > 0) {
							controls.enabled = false;
						}
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


				let p2moveZ  = 0;
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
				socket.on('speed', (spd) => {
					p2Speed = spd;
				})
				500
				
				socket.on('falligPoint', (fp) =>{
					player2fp = (boundingBox.max.z - boundingBox.min.z) / fp;
				});






				animate();

			}

			function base() {
				scene.background = new THREE.Color( 0x000000 );
				// scene.fog = new THREE.Fog(0x000000, 150, 300)

				const hemiLight = new THREE.HemisphereLight( 0x333333, 0x333333, 5 );
				hemiLight.position.set( 0, 500, 0 );
				scene.add( hemiLight );

				const dirLight = new THREE.DirectionalLight( 0xffffff, 5 );
				dirLight.position.set( 0, 500, 100 );
				dirLight.castShadow = true;
				dirLight.shadow.camera.top = 180;
				dirLight.shadow.camera.bottom = - 100;
				dirLight.shadow.camera.left = - 120;
				dirLight.shadow.camera.right = 120;
				scene.add( dirLight );
				const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x9F9999, depthWrite: false } ) );
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );

				const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
				grid.material.opacity = 0.2;
				grid.material.transparent = true;
				scene.add( grid );

				const fbxloader = new FBXLoader();
				fbxloader.load( 'src/component/game/people_freePack_webGl_ani.fbx', function ( object  : any) {
          
				mixer = new THREE.AnimationMixer( object );
		
				const action = mixer.clipAction( object.animations[ 0 ] );
				action.play();
				object.traverse( function ( child : any ) {
				if ( child.isMesh ) {
					child.castShadow = true;
					child.receiveShadow = true;
				}} );
				object.position.z = 100;
				object.position.x = -500;
				object.scale.set(0.5, 0.5, 0.5);
				object.rotation.y = Math.PI/2;
				scene.add( object );
				} );



				// stats
				// stats = new Stats();
				// container.appendChild( stats.dom );
				
			}
			window.addEventListener( 'resize', onWindowResize );
			function onWindowResize() {
				initclientX = window.innerWidth / 2;
				initClientY = window.innerHeight / 2;
				player1.raquete.position.x = 0;
				player1.raquete.position.z = (boundingBox?.max.z - boundingBox?.min.z) * -0.5;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			socket.on('score', (score : any[]) => {
				console.log(score);
				player1.goals = score[0];
				player1Score.innerText = score[0];
				player2.goals = score[1];
				player2Score.innerText = score[1];
			})
			// function animate() {

			// 	requestAnimationFrame( animate );

			// 	const delta = clock.getDelta();

			// 	if ( mixer ) mixer.update( delta );

			// 	renderer.render( scene, camera );

			// 	stats.update();

			// }
    }