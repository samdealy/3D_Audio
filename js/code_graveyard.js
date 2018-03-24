import * as THREE from 'three';
var angle = 0;

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
//
// // const renderer = new THREE.WebGLRenderer();
// // renderer.setSize( window.innerWidth, window.innerHeight );
// // document.body.appendChild( renderer.domElement );
// //
// // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// // const cube = new THREE.Mesh( geometry, material );
// // scene.add( cube );
// //
// // camera.position.z = 5;
// //
// // const animate = function () {
// //   requestAnimationFrame( animate );
// //
// //   cube.rotation.x += 0.1;
// //   cube.rotation.y += 0.1;
// //
// //   // renderer.render(scene, camera);
// // };
// //
// // animate();

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
//
// const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
// camera.position.set( 0, 0, 100 );
// camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
//
// const scene = new THREE.Scene();
//
// const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
// const geometry = new THREE.Geometry();
// geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
// geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
// geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
//
// const line = new THREE.Line(geometry, material);
// scene.add( line );
// renderer.render( scene, camera );
//
// const animate = () => {
//   requestAnimationFrame( animate );
//   line.rotation.x += 1;
//   line.rotation.y += 1;
// }



var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 500, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// add cube
var geometry = new THREE.IcosahedronGeometry(20, 0);
var color = new THREE.Color( "#32CD32" );
var material = new THREE.MeshPhongMaterial( {color: color.getHex(), specular: 0x009900, shinyness: 20 } );
var icosahedron = new THREE.Mesh( geometry, material );
scene.add( icosahedron );


// rotate cube
icosahedron.rotation.x = 0.1;
icosahedron.rotation.y = -0.25;

camera.position.z = 100;

var light = new THREE.PointLight( 0xFFFF00 );
light.position.set( 10, 0, 25 );
scene.add( light );


var render = function () {
  requestAnimationFrame( render );
	// for (var i = 0, l = geometry.vertices.length; i<l; i++) {
	//     // we'll move the x & y position of each vertice by a random amount
	//   geometry.vertices[i].x += -10 + Math.random()*100;
	//   geometry.vertices[i].y += -10 + Math.random()*100;
	// }
	// updateCamPosition();
  renderer.render(scene, camera);

  icosahedron.rotation.x += 0.1;
  icosahedron.rotation.y += 0.1;
  icosahedron.rotation.z += 0.10;
};

function updateCamPosition() {
  // rotate our camera's position on the z/y axis
  angle += 0.005;
  var z = 100 * Math.cos(angle);
  var y = 100 * Math.sin(angle);
  camera.position.z = z;
  camera.position.y = y;

  /* rotate the camera so the angle it faces animates -
   there's no exact science to this - I just picked a
   random percentage of the z position */

  camera.rotation.x = z*0.02;
}

render();


// function initScene() {
//   scene    = new THREE.Scene();
//   camera   = new THREE.PerspectiveCamera( 80, window.innerWidth/window.innerHeight, 0.1, 1000 );
//   renderer = new THREE.WebGLRenderer({ alpha: true });
//   renderer.setSize( window.innerWidth, window.innerHeight );
//   document.body.appendChild( renderer.domElement);
// }
//
// function render() {
//   requestAnimationFrame(render);
//   renderer.render(scene, camera);
// };
//
// initScene();
// render();
//
// function loadFont() {
//   const loader = new THREE.FontLoader();
//   loader.load( 'fonts/futura.typeface.json', function ( font ) {
//   	const geometry = new THREE.TextGeometry( 'Hello three.js!', {
//   		font: font,
//   		size: 80,
//   		height: 5,
//   		curveSegments: 12,
//   		bevelEnabled: true,
//   		bevelThickness: 10,
//   		bevelSize: 8,
//   		bevelSegments: 5
//   	});
//
//     materials = [
// 					new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, overdraw: 0.5 } ),
// 					new THREE.MeshBasicMaterial( { color: 0x000000, overdraw: 0.5 } )
// 				];
// 		mesh = new THREE.Mesh( geometry, materials );
//     mesh.position.x = centerOffset;
//     mesh.position.y = 100;
//     mesh.position.z = 0;
//     mesh.rotation.x = 0;
//     mesh.rotation.y = Math.PI * 2;
//     group = new THREE.Group();
//     group.add( mesh );
//     scene.add( group );
//   });
// }


Plane stuff
// const planeMat = new THREE.MeshLambertMaterial(0xffffff)

// const cubeGeo = new THREE.BoxGeometry(5,5,5)

// const planeGeo = new THREE.PlaneGeometry(100,100,100)
// const plane    = new THREE.Mesh(planeGeo,planeMat)
// plane.rotation.x = -.5 * Math.PI
// plane.receiveShadow = true;
