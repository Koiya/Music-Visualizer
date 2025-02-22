import {useRef, Suspense, useMemo, useState, useEffect} from 'react'
import './App.css'
import {Canvas, useFrame} from '@react-three/fiber'
import * as THREE from 'three'
import { useControls } from 'leva'
import {OrbitControls} from '@react-three/drei'
import AudioComponent from "./components/audioComponent.jsx";
import vertexShader from "./components/vertexShader.glsl?raw";
import fragmentShader from "./components/fragmentShader.glsl?raw";
import {Vector2} from "three";

function App() {
    const { name, number } = useControls({ name: 'World', number: 1 })
    const Sphere = (props) => {
        const uniforms = useMemo(
            () => ({
                u_time:{
                    value: 0.0,
                },
                u_resolution : {
                    value : new Vector2(window.innerWidth, window.innerHeight)
                },
            }),
            []
        )
        const mesh = useRef()
        useFrame((state) => {
            mesh.current.material.uniforms.u_time.value = state.clock.getElapsedTime();
        })
        return (
            <mesh
                {...props}
                ref={mesh}
                scale={1}>
                <icosahedronGeometry args={[number, 15]} />
                <shaderMaterial
                    fragmentShader = {fragmentShader}
                    vertexShader = {vertexShader}
                    uniforms={uniforms}
                />
            </mesh>
        )
    }
    return (
        <>
            <Canvas>
                <OrbitControls makeDefault />
                <Suspense fallback={null}>
                    <AudioComponent />
                </Suspense>
                <ambientLight intensity={Math.PI / 2}/>
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
                <Sphere position={[0, 0, 0]}/>

            </Canvas>
        </>
    )
}

export default App
