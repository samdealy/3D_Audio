# 3D Karaoke

<p align="center">
  <img src="./images/welcome_text.png" alt="welcome text" width="340" height="190">
</p>

Welcome to 3D karaoke, a three-dimensional audio-visualizer built using
the Three.js library.

## Technology
The project makes extensive use of the Three.js library's standard functionality.

### 3D text
To render 3D representations of song lyrics to the screen, the `createText(word)` method takes a
lyric as a parameter and creates a geometry and mesh. This lyric is then given a random position, and added to the scene.
To create the glowing text effect, a point-light is added directly in front of the lyric.

  ```javascript
  function createText(word) {
    // Remove previous lyrics
    removeText();

    // Load the futura font, and create a 3D text geometry with custom bevel measurements.
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
  ```


The lyrics update
as the song progresses.

Additionally, the app makes uses of the Three.js composer and its glitch pass to create temporally
random visual glitches.
