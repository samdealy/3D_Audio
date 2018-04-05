import * as THREE from 'three';
import { EffectComposer, GlitchPass, RenderPass} from "postprocessing";
import dat from 'dat.gui';
let scene, camera, renderer, materials, mesh, interval;
let currentTime = 0, currentWord = 'Welcome to 3D karaoke!';

  //Scene
  scene = new THREE.Scene();
  window.scene = scene;

  //Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight,.1, 1000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 800;
  camera.lookAt(scene.position);

  //Lights
  const spotLight  = new THREE.SpotLight(0xffffff);
  spotLight.castShadow = false;
  spotLight.position.set(0, 0, 200);

  const pointLight  = new THREE.PointLight(0xffffff, .5);
  pointLight.name   = 'pointLight';

  scene.add(spotLight);
  scene.add(pointLight);

  //Materials
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 'rgb(255,223,0)',
    roughness: 0.8,
    metalness: .2
  });

  const planeMat = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 1,
    wireframeLinewidth: 1,
    wireframeLinejoin: 'round',
    wireframeLinecap: 'round'
  });

  //Geometry
  const plane  = new THREE.PlaneGeometry(10000, 10000, 100, 100);
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

  const listener    = new THREE.AudioListener();
  const song        = new THREE.Audio( listener );
  song.volume = .5;
  song.mute   = false;

  const audioLoader = new THREE.AudioLoader();

  song.onEnded = function() {
    this.isPlaying = false;
    resetSong();
  }
  loadAudio();

  //Composer + Passes
  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  window.renderPass = renderPass;
  renderPass.renderToScreen = false;
  composer.addPass(renderPass);

  const glitchPass = new GlitchPass(0);
  glitchPass.visible = true;
  glitchPass.renderToScreen = true;
  window.glitchPass = glitchPass;
  composer.addPass(glitchPass);

  //Dat.gui

  const gui = new dat.GUI();
  const folder1 = gui.addFolder('song');
  folder1.add(song, 'volume', 0, 1).onChange( level => {
    song.volume  = level;
    if (!song.muted) song.setVolume(level);
  })

  folder1.add(song, 'mute').onChange( muted => {
    if (muted) {
      song.muted = true;
      song.setVolume(0);
    }
    else {
      song.muted = false;
      song.setVolume(song.volume);
    }
  })
  folder1.open();

  const folder2 = gui.addFolder('glitch');
  folder2.add(glitchPass, 'visible').onChange( visible => {
    if (visible) {
      renderPass.renderToScreen = false;
      glitchPass.renderToScreen = true;
    }
    else {
      glitchPass.renderToScreen = false;
      renderPass.renderToScreen = true;
    }
  });


  //Render Loop
  let increment = 0
  const render = () => {
    increment += 0.1
    requestAnimationFrame(render);

    const lyrics = scene.getObjectByName('lyrics')
    spotLight.position.x =50*Math.sin(increment);
    spinCamera();
    composer.render(scene, camera);
  };

  //Resize
  window.addEventListener( 'resize', onWindowResize, false );

  //Script
  render();


  //**HELPERS**

  //Text Settings
  let text = 'aems', height = 100, size = 15, curveSegments = 10,
        bevelThickness = 1, bevelSize = 0.3, bevelSegments = 3,
        bevelEnabled = true, font = undefined

  let rotation = 0
  function spinCamera(){
    rotation += 0.01
    camera.position.y = Math.sin(rotation) * 80;
    camera.position.x = Math.cos(rotation) * 200;

    const lyrics = scene.getObjectByName('lyrics');
    if (lyrics) camera.lookAt(lyrics.position);
    else camera.lookAt(scene.position);

  }

  //Word Updating
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
    var loader = new THREE.FontLoader();
    loader.load('fonts/futura.typeface.json', function (res) {
      font = res;
      createText(currentWord);
    });
  }

  function createText(word) {
    removeText();
    const textGeo = new THREE.TextGeometry( word, {
      font: font, size: size, height: height, curveSegments:curveSegments,
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
    setPointLightPosition(randomPosition);
    text.castShadow = true;
    text.name ='lyrics'
    scene.add(text)
  }

  function setPointLightPosition(pos) {
    const pointLight = scene.getObjectByName('pointLight')
    pointLight.position.set(pos[0], pos[1], pos[2] + 100)

  }

  function removeText() {
    const oldLyrics = scene.getObjectByName('lyrics');
    if (oldLyrics) scene.remove(oldLyrics);
  }

  function onWindowResize( event ) {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize( window.innerWidth, window.innerHeight );
   }

  function resetSong() {
    clearInterval(interval);
    currentTime = 0;
    loadAudio();
  }

  function loadAudio() {
    audioLoader.load( 'https://s3.amazonaws.com/3d-audio-visualizer/07+-+Go+West.mp3', function( buffer ) {
      song.setBuffer(buffer);
      song.setLoop(false);
      song.setVolume(0.5);
      song.play();
      interval = setInterval( updateWords, 1000);
    });
  }
