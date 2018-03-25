import * as THREE from 'three';
import { EffectComposer, GlitchPass, RenderPass, PixelationPass } from "postprocessing";
// import { goWestTiming } from '../transcriptions/go_west.js'
let scene, camera, renderer, materials, mesh;
let currentTime = 0, currentWord = 'Welcome to 3D karaoke!';

  //Scene
  scene = new THREE.Scene()

  //Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,.1, 1000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 800;
  camera.lookAt(scene.position);

  //Lights
  const ambientLight = new THREE.AmbientLight(0xffffff);
  const spotLight  = new THREE.SpotLight(0xffffff)
  const pointLight = new THREE.PointLight(0xffffff, .5);
  spotLight.castShadow = false;
  spotLight.position.set(0,0,200);

  // scene.add(ambientLight)
  scene.add(spotLight)
  scene.add(pointLight);

  //Materials
  // const cubeMat  = new THREE.MeshPhongMaterial({color: 'rgb(255,223,0)' })
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 'rgb(255,223,0)',
    roughness: 0.8,
    metalness: .2
  });

  // const cubeMat = new THREE.LineBasicMaterial();
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
  for (let i = 0; i < 20; i++) {
    const planeMesh = new THREE.Mesh(plane, planeMat);
    planeMesh.rotation.x = -90 * Math.PI / 180;
    planeMesh.position.y = -100 + 20 * i;
    scene.add(planeMesh);
  }


  //Renderer
  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(0xffcccc);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  document.body.appendChild(renderer.domElement);

  // create an AudioListener and add it to the camera
  const listener = new THREE.AudioListener();


  // create a global audio source
  var song = new THREE.Audio( listener );

  // load a song and set it as the Audio object's buffer
  var audioLoader = new THREE.AudioLoader();
  audioLoader.load( 'https://s3.amazonaws.com/3d-audio-visualizer/07+-+Go+West.mp3', function( buffer ) {
  	song.setBuffer( buffer );
  	song.setLoop( true );
  	song.setVolume( 0.5 );
  	song.play();
    setInterval( updateWords, 1000)
  });

  //Composer
  const composer = new EffectComposer(renderer);

  //Passes
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const glitchPass = new GlitchPass(0);
  // glitchPass.renderToScreen = true;
  composer.addPass(glitchPass);

  const pixelationPass = new PixelationPass(0);
  composer.addPass(pixelationPass);
  pixelationPass.renderToScreen = true;


  //Render Loop
  let increment = 0, pixelationGranularity = 0;
  const render = () => {
    increment += 0.1
    pixelationGranularity = (pixelationGranularity + 1) % 6
    requestAnimationFrame( render );
    // cube.position.y += Math.sin(increment) * 0.05
    spotLight.position.x =10+50*Math.sin(increment);
    // pixelationPass.granularity = pixelationGranularity;
    // spotLight.position.y =10+50*Math.cos(increment);
    // camera.position.z -= Math.sin(increment / 10)
    spinCamera();
    // spinText();
    // renderer.render(scene, camera);
    composer.render(scene, camera);
  };

  //Script
  // loadFont();
  render();

  //Text Settings
  let text = 'aems', height = 100, size = 10, curveSegments = 10,
        bevelThickness = 1, bevelSize = 0.3, bevelSegments = 3,
        bevelEnabled = true, font = undefined

  let rotation = 0
  function spinCamera(){
    rotation += 0.01
    camera.position.y = Math.sin(rotation) * 80;
    camera.position.x = Math.cos(rotation) * 200;
    camera.lookAt(scene.position)
  }

  function spinText() {
    text = scene.getObjectByName('lyrics');
    if (text) {
      object.rotateX(.2);
    }
  }
  const goWestTiming = {
    1: 'Welcome to 3D karaoke!',
    8: "Safe on the interstate",
    18: "New York is three thousand miles away",
    25: "And I'm not looking forward to following through",
    32: "But it's better than always running back into you",
    37: "I've closed my eyes and my bank account",
    40: "And gone west, young man",
    46: "Take off the parking brake",
    55: "Go coasting into a different state",
    65: "And I'm not looking forward to missing you",
    68: "But I must have something better to do",
    73: "I've got to tear my life apart",
    78: "And go west, young man",
    85: "And it feels like I've got something to prove",
    87: "But in some ways it's just something to do",
    91: "My friends turn me around and say,",
    97: "You go west, young man.",
    107: "Stepping down off my platform shoes",
    119: "Sixty-nine in the afternoon",
    125: "And I'm waiting for someone in the know",
    130: "Like Pirner tells me on the radio",
    135: "Says Take it from someone who's been there before,",
    140: "You go west, young man.",
    143: "And I'm looking for somebody to do my thinking for me",
    150: "Till I come through",
    153: "The state-line highway sign says,",
    159: "You have gone west, young man.",
    167: "And it feels like I've got something to prove",
    171: "But in some ways it's just something to do",
    176: "The state-line highway sign says,",
    180: "You have gone west, young man."
  }

  function updateWords() {
    currentTime += 1;
    if (goWestTiming[currentTime]) {
      currentWord = goWestTiming[currentTime];
      loadFont(currentWord);
    }
  }

  function loadFont(currentWord) {
    debugger
    var loader = new THREE.FontLoader();
    loader.load('../fonts/futura.typeface.json', function (res) {
      font = res;
      createText(currentWord);
    });
  }

  function createText(word) {
    removeText();
    const textGeo = new THREE.TextGeometry( word, {
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

    const leftRight = Math.random() > .5 ? 1 : -1;
    const xDimension = leftRight * Math.random() * window.innerWidth  / 8;
    const yDimension = leftRight * Math.random() * window.innerHeight / 8;
    const randomPosition = [xDimension, yDimension, 0]

    text.position.set(randomPosition[0], randomPosition[1], randomPosition[2])
    text.castShadow = true;
    text.name ='lyrics'
    scene.add(text)
  }

  function removeText() {
    const oldLyrics = scene.getObjectByName('lyrics');
    if (oldLyrics) scene.remove(oldLyrics);
  }
