import {useEffect} from 'react'
import {AudioListener, AudioLoader, Audio, AudioAnalyser} from 'three';
import {useThree} from "@react-three/fiber";

function AudioComponent() {
    const {camera} = useThree();
    useEffect(() => {
// create an AudioListener and add it to the camera
        const listener = new AudioListener();
        camera.add( listener );

// create a global audio source
        const sound = new Audio( listener );

// load a sound and set it as the Audio object's buffer
        const audioLoader = new AudioLoader();
        audioLoader.load( 'src/components/test.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.5 );
            // const handleClick = () =>{
            //     sound.play();
            // };
            // window.addEventListener('click', handleClick);
        });
        const analyser = new AudioAnalyser(sound, 32);
    }, []);
    return null;
}
export default AudioComponent;