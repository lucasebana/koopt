
/* Dépendances externes */

/*
import * as THREE from 'https://unpkg.com/three@0.114.0/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.114.0/examples/jsm/controls/OrbitControls.js';
*/





function main() {
    this.canvas = document.querySelector('#c');
    this.renderer = new THREE.WebGLRenderer({ canvas });

    this.fov = 75;
    this.aspect = 2;  // the canvas default
    this.near = 0.1;
    this.far = 5;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    this.scene = new THREE.Scene();

    {
        this.color = 0xFFFFFF;
        this.intensity = 1;
        this.light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }

    this.boxWidth = 1;
    this.boxHeight = 1;
    this.boxDepth = 1;
    this.geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    function makeInstance(geometry, color, x) {
        this.material = new THREE.MeshPhongMaterial({ color });

        this.cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;

        return cube;
    }

    this.cubes = [
        makeInstance(geometry, 0x44aa88, 0),
    ];

    function render(time) {
        time *= 0.001;  // convert time to seconds

        cubes.forEach((cube, ndx) => {
            this.speed = 1 + ndx * .1;
            this.rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}

main();
