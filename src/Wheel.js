import {Box, Cylinder, Gltf, Shape, useKeyboardControls} from "@react-three/drei";
import {useBox, useCylinder} from "@react-three/cannon";
import {useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {RigidBody} from "@react-three/rapier";

export default function Wheel(props){


    const ref = useRef();
    const body = useRef();
    const [, get] = useKeyboardControls(); // Подключение клавиатурных контролов
    const [speed, setSpeed] = useState(0); // Текущая скорость машины
    const [steeringAngle, setSteeringAngle] = useState(0); // Угол поворота руля
    const [carDirection, setCarDirection] = useState(0); // Текущее направление машины
    const maxSpeed = 2; // Максимальная скорость
    const acceleration = 0.1; // Ускорение
    const brakingForce = 2; // Сила торможения
    const turnSpeed = 1; // Скорость поворота руля
    const friction = 2; // Замедление без нажатия клавиш

    const cameraOffset = new THREE.Vector3(0, 15, -20); // Камера выше и позади машины

    useFrame((state, delta) => {
        if (!ref.current) return;
        const {forward, backward, leftward, rightward} = get();
        if (forward || backward || leftward || rightward) {
            ref.current?.wakeUp()
        }


        // Управление скоростью
        if (forward) {
            setSpeed((prev) => Math.min(prev - acceleration * delta, maxSpeed));
        } else if (backward) {
            setSpeed((prev) => Math.max(prev + brakingForce * delta, -maxSpeed / 2));
        } else {
            setSpeed((prev) => prev * (1 - friction * delta));
        }

        // Управление углом поворота руля
        if (leftward) {
            setSteeringAngle((prev) =>
                Math.max(prev - turnSpeed * delta, -Math.PI / 4)
            ); // Поворот влево
        } else if (rightward) {
            setSteeringAngle((prev) =>
                Math.min(prev + turnSpeed * delta, Math.PI / 4)
            ); // Поворот вправо
        } else {
            setSteeringAngle((prev) => prev * (1 - delta * 5)); // Возврат руля в нейтральное положение
        }

        // Обновление направления машины
        if (speed !== 0) {
            setCarDirection((prev) => prev + steeringAngle * delta * speed * 0.05);
        }

        // Вычисление нового направления движения машины
        const direction = new THREE.Vector3(
            Math.sin(carDirection),
            0,
            Math.cos(carDirection)
        ).normalize();

        const linvel = ref.current.linvel();
        const carPosition = ref.current?.translation(); // Позиция машины
        const carRotation = ref.current?.rotation(); // Текущее вращение машины в кватернионах


       // ref.current?.setLinvel({
        //    x: direction.x * speed,
        //    y: linvel.y,
        //    z: direction.z * speed,
      //   });


            ref.current?.setAngvel({
                x: ref.current?.angvel().x,
                y: -steeringAngle * 2,
                z: ref.current?.angvel().z
            })



        // Вычисление позиции камеры относительно машины

        const rotatedOffset = cameraOffset.clone().applyQuaternion(carRotation); // Учитываем поворот машины

        // Позиция камеры
        const cameraPosition = new THREE.Vector3(
            carPosition.x + rotatedOffset.x,
            carPosition.y + rotatedOffset.y,
            carPosition.z + rotatedOffset.z
        );

        // Плавное перемещение камеры

        state.camera.position.lerp(cameraPosition, 0.1);


        // Камера всегда смотрит на машину
        state.camera.lookAt(carPosition.x, carPosition.y, carPosition.z);

    });

    return (
        <>
            <RigidBody ref={ref} type={"dynamic"} colliders={"hull"}>
                <Gltf src={"./asset/model/wheel-tree.glb"} position={[0,0,0]} rotation={[0,0,0]} />


            </RigidBody>



        </>

    );
}