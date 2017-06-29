(function(window){

  ////
  //  Start off when the page is ready
  $(document).ready(function(){
    var env = init();
    window.env = env;

    var update = function(){
      env.uniforms.time.value = env.clock.getElapsedTime()
      env.renderer.render(env.scene, env.camera);
      requestAnimationFrame(update);
    }

    load_shader_source_and_then('/glsl/moon.vert', function(vertex_source){
      load_shader_source_and_then('/glsl/moon.frag', function(fragment_source){
        env.vertex_source = vertex_source;
        env.fragment_source = fragment_source;
        setup_scene(env);
        requestAnimationFrame(update);
      });
    });
  });


  ////
  //  Initializez Three.js
  function init() {
    var aspect_ratio = 4 / 3;
    var container = $('#moon_orb');
    var container_width = container.innerWidth();
    var width = container_width;
    var height = container_width / aspect_ratio;

    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({antialias: true});
    var camera = new THREE.PerspectiveCamera(45, aspect_ratio, 0.1, 10000);
    var clock = new THREE.Clock();

    camera.position.z = 1452;
    renderer.setSize(width, height);

    scene.add(camera);
    container.append(renderer.domElement);

    window.addEventListener('resize', function(){
      console.log('window resizing')
      var new_width = container.innerWidth();
      var new_height = new_width / aspect_ratio;
      renderer.setSize(new_width, new_height);
      renderer.setViewPort(0, 0, canvas.clientWidth, canvas.clientHeight);
      camera.aspect = aspect_ratio;
      camera.updateProjectionMatrix();
    });
    return {clock: clock, container: container, scene: scene, camera: camera, renderer: renderer};
  }


  ////
  //  Load a glsl source file and then
  function load_shader_source_and_then(url, lambda){
    url = url + '?' + new Date().getTime();
    $.ajax({dataType: 'text', url: url}).done(function(source){
      console.log('loaded ' + url);
      lambda(source);
    });
  }


  ////
  //  Load a texture, and then call the passed lambda
  function load_texture_and_then(url, lambda){
    var texture = null;
    var texture_loader = new THREE.TextureLoader();
    texture_loader.load('images/tarot_moon.png', lambda)
  }


  ////
  //  Load a shader program from the DOM
  function load_shader_material_dom(vertex_name, fragment_name, uniforms){
    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader:   $(vertex_name).text(),
      fragmentShader: $(fragment_name).text()
    });
  }

  ////
  //  Load a shader program from source
  function load_shader_material_source(vertex_source, fragment_source, uniforms){
    return new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader:   vertex_source,
      fragmentShader: fragment_source
    });
  }


  ////
  //  Setup the geometry of the scene
  function setup_scene(env){
    var geometry = new THREE.BufferGeometry();
    var vetex_positions = [
      [-1.0, -1.0,  1.0], [ 1.0, -1.0,  1.0], [ 1.0,  1.0,  1.0],
      [ 1.0,  1.0,  1.0], [-1.0,  1.0,  1.0], [-1.0, -1.0,  1.0]
    ];

    var res = env.renderer.getSize();
    var vertices = new Float32Array(vetex_positions.length * 3);
    for ( var i = 0; i < vetex_positions.length; i++ ){
      vertices[i * 3 + 0] = vetex_positions[i][0] * res.width;
      vertices[i * 3 + 1] = vetex_positions[i][1] * res.height;
      vertices[i * 3 + 2] = vetex_positions[i][2];
    }

    env.uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(res.width, res.height)
      },
      time: {
        type: 'f',
        value: 0
      }
    };

    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var material = load_shader_material_source(env.vertex_source, env.fragment_source, env.uniforms);
    var mesh = new THREE.Mesh(geometry, material);

    env.mesh = mesh;
    env.scene.add(mesh);
    return env;
  }

})(window);
