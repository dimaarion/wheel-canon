import * as THREE from "three";

function controlCamera(ref){
    if (!ref.current) return;
    const {forward, backward, leftward, rightward} = get();
    if (forward || backward || leftward || rightward) {
        ref.current?.wakeUp()
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

    const linvel = body.current.linvel();
    const carPosition = body.current?.translation(); // Позиция машины
    const carRotation = body.current?.rotation(); // Текущее вращение машины в кватернионах


    /*     body.current?.setLinvel({
             x: direction.x * speed,
            y: linvel.y,
             z: direction.z * speed,
          });*/



    ref.current?.setAngvel({
        x: ref.current?.angvel().x,
        y: -steeringAngle * 2,
        z: ref.current?.angvel().z
    })
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

    //    state.camera.position.lerp(cameraPosition, 0.1);


    // Камера всегда смотрит на машину
    //    state.camera.lookAt(carPosition.x, carPosition.y, carPosition.z);

}