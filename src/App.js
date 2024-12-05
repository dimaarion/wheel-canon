import logo from './logo.svg';
import './App.css';
import {Physics} from '@react-three/rapier'
import {
  KeyboardControls,
  Environment,
  Cloud,
  Clouds,
  OrbitControls,
  Sky,
  TorusKnot,
  useGLTF,
  Plane, CameraControls
} from '@react-three/drei'
import { Canvas, invalidate } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { BufferGeometry, Mesh } from 'three'
import * as THREE from "three";
import Wheel from "./Wheel";
import Planes from "./Planes";
const keyboardMap = [
  {name: "forward", keys: ["ArrowUp", "w", "W"]},
  {name: "backward", keys: ["ArrowDown", "s", "S"]},
  {name: "leftward", keys: ["ArrowLeft", "a", "A"]},
  {name: "rightward", keys: ["ArrowRight", "d", "D"]},
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
];


function App() {
  return (
    <div className="App">
      <Canvas shadows camera={{fov: 45}}>
        <hemisphereLight intensity={0.2} />
        <spotLight  angle={0.4} penumbra={1} position={[-50, 50, 2.5]} castShadow shadow-bias={-0.00001} />
        <directionalLight  color="red" position={[-10, 50, 0]} intensity={1.5} />
        <Clouds material={THREE.MeshBasicMaterial}>
          <Cloud seed={10} bounds={50} volume={80} position={[40, 100, -80]} />
          <Cloud seed={10} bounds={50} volume={80} position={[50, 100, 80]} />
        </Clouds>
        <Environment preset="city" />
        <Sky distance={1000} />
        <KeyboardControls map={keyboardMap}>

          <Physics debug={false}  >

            <Wheel/>
            <Planes/>
          </Physics>


        </KeyboardControls>
        {
         // <CameraControls/>
        }
      </Canvas>
</div>

  );
}
useGLTF.preload([
  './asset/model/level1.glb',
  './asset/model/wheel-tree.glb'
]);
export default App;
