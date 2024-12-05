import {usePlane} from "@react-three/cannon";
import {
    Gltf,
    Plane, useGLTF
} from '@react-three/drei'
import {useRef} from "react";
import {RigidBody} from "@react-three/rapier";
export default function Planes(props) {
    const {nodes, materials, animations} = useGLTF("./asset/model/level1.glb");

    const ref = useRef()

    return (
        <>
            <RigidBody ref={ref} type={"fixed"} colliders={"trimesh"} >
                <primitive  castShadow receiveShadow object={nodes.road} name={"road"}/>
            </RigidBody>

        </>



    )
}