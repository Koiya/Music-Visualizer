import {useRef, Suspense, useMemo, useState, useEffect} from 'react'
import './App.css'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import * as THREE from 'three'
import { useControls } from 'leva'
import {OrbitControls, PerspectiveCamera} from '@react-three/drei'
import vertexShader from "./components/vertexShader.glsl?raw";
import fragmentShader from "./components/fragmentShader.glsl?raw";
import {Audio, AudioAnalyser, AudioListener, AudioLoader, Vector2} from "three";

function App() {
    const { number } = useControls({
        number: {
            value: 4,
            min: 1,
            max: 10,
            step: 1,
        },
    })
    const Sphere = (props) => {
        const [analyser,setAnalyser] = useState(null);
        const {camera} = useThree();
        useEffect(() => {
// create an AudioListener and add it to the camera
            const listener = new AudioListener();
            camera.add( listener );

// create a global audio source
            const sound = new Audio( listener );

// load a sound and set it as the Audio object's buffer
            const audioLoader = new AudioLoader();
            audioLoader.load( 'src/test.mp3', function( buffer ) {
                sound.setBuffer( buffer );
                sound.setLoop( true );
                sound.setVolume( 0.5 );
                const handleClick = () =>{
                    sound.play();
                };
                window.addEventListener('click', handleClick);
            });
            const analyser = new AudioAnalyser(sound, 32)
            setAnalyser(analyser);
        }, []);
        const uniforms = useMemo(
            () => ({
                u_time:{
                    value: 0.0,
                },
                u_frequency: { value: 0.0 },
                u_resolution : {
                    value : new Vector2(window.innerWidth, window.innerHeight)
                },
            }),
            []
        )
        const mesh = useRef()

        useFrame((state) => {
            mesh.current.material.uniforms.u_time.value = state.clock.getElapsedTime();
            mesh.current.material.uniforms.u_frequency.value = analyser.getAverageFrequency();
        })
        return (
            <mesh
                {...props}
                ref={mesh}
                scale={1}>
                <icosahedronGeometry args={[number, 30]} />
                <shaderMaterial
                    fragmentShader = {fragmentShader}
                    vertexShader = {vertexShader}
                    uniforms={uniforms}
                    wireframe={true}
                />
            </mesh>
        )
    }
    return (
        <>
            <Canvas>
                <PerspectiveCamera makeDefault
                    fov={45}
                    aspect={window.innerWidth / window.innerHeight}
                    near={1}
                    far={1000}
                    position={[6, 8, 14]}
                />
                <OrbitControls />
                <ambientLight intensity={Math.PI / 2}/>
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI}/>
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI}/>
                <Sphere position={[0, 0, 0]}/>

            </Canvas>
        </>
    )
}

export default App
