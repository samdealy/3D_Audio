import * as THREE from 'three';
let scene, camera, renderer, materials, mesh;

  //Scene
  scene = new THREE.Scene()

  //Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,.1, 1000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 200;
  camera.lookAt(scene.position);

  //Lights
  const spotlight  = new THREE.SpotLight(0xffffff)
  const pointLight = new THREE.PointLight(0xffffff, .5);
  spotlight.castShadow = false;
  spotlight.position.set(30,60,60);

  scene.add(spotlight)
  scene.add(pointLight);

  //Materials
  const cubeMat  = new THREE.MeshPhongMaterial({color: 'rgb(255,223,0)' })
  const planeMat = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 1,
    wireframeLinewidth: 1,
    wireframeLinejoin: 'round',
    wireframeLinecap: 'round'
  });

  //Geometry
  const plane = new THREE.PlaneGeometry(10000, 10000, 100, 100);
  const planeMesh = new THREE.Mesh(plane, planeMat);
  planeMesh.rotation.x = -90 * Math.PI / 180;
  planeMesh.position.y = -100;
  scene.add(planeMesh);

  //Renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0xa300ff);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  document.body.appendChild(renderer.domElement);

  //Render Loop
  var increment = 0
  var render = function () {
    increment += 0.01
    requestAnimationFrame( render );
    // cube.position.y += Math.sin(increment) * 0.05
    spinCamera()
    renderer.render(scene, camera);
  };

  //Script
  loadFont();
  render();

  //Text Settings
  let text = 'aems', height = 2, size = 10, curveSegments = 10,
        bevelThickness = 1, bevelSize = 0.3, bevelSegments = 3,
        bevelEnabled = true, font = undefined

  let rotation = 0
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

    const text = new THREE.Mesh(textGeo, cubeMat)
    text.position.x = -textGeo.boundingBox.max.x/2;
    text.castShadow = true;
    scene.add(text)
  }
