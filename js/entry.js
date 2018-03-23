import * as THREE from 'three';
let scene, camera, renderer, materials, mesh;

  scene    = new THREE.Scene()
  camera   = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,.1, 1000)
  renderer = new THREE.WebGLRenderer()
  camera.position.x = 40
  camera.position.y = 80;
  camera.position.z = 80;
  renderer.setClearColor(0xa300ff)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true
  //GEOMETRY
  var cubeGeo = new THREE.BoxGeometry(5,5,5)
  var cubeMat = new THREE.MeshPhongMaterial({color: 'rgb(255,223,0)' })
  // var cube    = new THREE.Mesh(cubeGeo, cubeMat)
  // cube.castShadow = true;
  // cube.position.y = 2.5;
  var planeGeo = new THREE.PlaneGeometry(100,100,100)
  var planeMat = new THREE.MeshLambertMaterial(0xffffff)
  var plane = new THREE.Mesh(planeGeo,planeMat)
  plane.rotation.x = -.5 * Math.PI
  plane.receiveShadow = true;

  var spotlight = new THREE.SpotLight(0xffffff)
  const pointLight = new THREE.PointLight(0xffffff, .5);
  scene.add(pointLight)
  spotlight.castShadow = false;
  spotlight.position.set(30,60,60)
  // scene.add(plane)
  scene.add(spotlight)
  // scene.add(cube)
  camera.lookAt(scene.position)
  document.body.appendChild(renderer.domElement)
  var increment = 0
  var render = function () {
    increment += 0.01
    requestAnimationFrame( render );
    camera.position.y += Math.sin(increment) * .5
    // camera.position.y++ 80;
    // camera.position.z = 80;
    // cube.position.y += Math.sin(increment) * 0.05
    // cube.rotation.y +=  0.01
    spinCamera()
    renderer.render(scene, camera);
  };
  loadFont()
  render();
  /*
  HELPERS
  ~~~~~~~~~~~~~~~~~~~*/
  //SETTINGS
  var text = "aems",
        height = 2,
        size = 10,
        curveSegments = 10,
        bevelThickness = 1,
        bevelSize = 0.3,
        bevelSegments = 3,
        bevelEnabled = true,
        font = undefined
  var rotation = 0
  function spinCamera(){
    rotation += 0.005
    // camera.position.z = Math.sin(rotation) * 80;
    // camera.position.x = Math.cos(rotation) * 80;
    camera.lookAt(scene.position)
  }
  function loadFont() {
    var loader = new THREE.FontLoader();
    loader.load('../fonts/futura.typeface.json', function (res) {
      font = res;
      createText();
    });
  }
  function createText() {
    const textGeo = new THREE.TextGeometry( 'ARIES SEASON', {
      font: font,
      size: size,
      height: height,
      curveSegments:curveSegments,
      weight: "normal",
      bevelThickness:bevelThickness,
      bevelSize:bevelSize,
      bevelSegments:bevelSegments,
      bevelEnabled:bevelEnabled
    });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    var text = new THREE.Mesh(textGeo, cubeMat)
    text.position.x = -textGeo.boundingBox.max.x/2;
    text.castShadow = true;
    scene.add(text)
  }
