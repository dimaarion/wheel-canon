import {Box, Cylinder, Gltf, Shape, useKeyboardControls} from "@react-three/drei";
import {useRef, useState} from "react";
import {useFrame} from "@react-three/fiber";
import * as THREE from "three";
import {BallCollider, CuboidCollider, RigidBody, useFixedJoint, useRevoluteJoint} from "@react-three/rapier";
import Controller from "ecctrl";

export default function Wheel(props){


    const ref = useRef();
    const body = useRef();
    const ref2 = useRef();
    const ref3 = useRef();
    const ref4 = useRef();
    const balka = useRef();
    const [, get] = useKeyboardControls(); // Подключение клавиатурных контролов
    const [speed, setSpeed] = useState(0); // Текущая скорость машины
    const [steeringAngle, setSteeringAngle] = useState(0); // Угол поворота руля
    const [carDirection, setCarDirection] = useState(0); // Текущее направление машины
    const maxSpeed = 100; // Максимальная скорость
    const acceleration = 30; // Ускорение
    const brakingForce = 2; // Сила торможения
    const turnSpeed = 5; // Скорость поворота руля
    const friction = 2; // Замедление без нажатия клавиш

    const cameraOffset = new THREE.Vector3(0, 20, -30); // Камера выше и позади машины
/*

    const jointBodyRef = useRevoluteJoint(body,ref,[
        [0,0,5],
        [0,0,0],
        [1,0,0]
    ])
    const jointBodyRef2 = useRevoluteJoint(body,ref2,[
        [0,0,5],
        [0,0,0],
        [1,0,0]
    ])
    const jointBodyRef3 = useRevoluteJoint(body,balka,[
        [0,0,0],
        [0,0,0],
        [0,1,0]
    ])

    const jointBodyRef4 = useRevoluteJoint(balka,ref3,[
        [0,0,-5],
        [0,0,0],
        [1,0,0]
    ])

    const jointBodyRef5 = useRevoluteJoint(balka,ref4,[
        [0,0,-5],
        [0,0,0],
        [1,0,0]
    ])


*/



    useFrame((state, delta) => {
        if (!ref.current) return;
        const {forward, backward, leftward, rightward,jump} = get();
        if (forward || backward || leftward || rightward) {
          //  ref.current?.wakeUp()
        }


        // Управление скоростью
        if (forward) {
            setSpeed((prev) => Math.min(prev + acceleration * delta, maxSpeed));
        } else if (backward) {
            setSpeed((prev) => Math.max(prev - brakingForce * delta, -maxSpeed / 2));
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


        ref.current?.setLinvel({
                 x: linvel.x,
                 y: 1000,
                 z: linvel.z,
              });



       // ref.current?.setAngvel({
        //   x: ref.current?.angvel().x,
        //   y: rightward? 1: leftward?-1:0 ,
        //    z: ref.current?.angvel().z
       // })
        //  jointBodyRef.current.configureMotorVelocity(speed, 30)
        //   jointBodyRef2.current.configureMotorVelocity(speed, 30)

        //    jointBodyRef4.current.configureMotorVelocity(0, 30)
        //    jointBodyRef5.current.configureMotorVelocity(0, 30)
        // Вычисление позиции камеры относительно машины

        const rotatedOffset = cameraOffset.clone().applyQuaternion(carRotation); // Учитываем поворот машины

        // Позиция камеры
        const cameraPosition = new THREE.Vector3(
            carPosition.x + rotatedOffset.x,
            carPosition.y + rotatedOffset.y,
            carPosition.z + rotatedOffset.z
        );

        // Плавное перемещение камеры

          //  state.camera.position.lerp(cameraPosition, 0.1);


        // Камера всегда смотрит на машину
         //  state.camera.lookAt(carPosition.x, carPosition.y, carPosition.z);

    });

    return (
        <>
                    <Controller  maxVelLimit={20} jumpVel={10} disableControl={false} camInitDir={{x: 0.4, y: 0}} density={10} mass={2} jumpForceToGroundMult={5}  type={"dynamic"} friction={1}  mode={"FixedCamera"} ref={ref}
                                camInitDis={-20}     colliders={"ball"} >
                        <Gltf src={"./asset/model/ball.glb"}   />
                    </Controller>



        </>

    );
}