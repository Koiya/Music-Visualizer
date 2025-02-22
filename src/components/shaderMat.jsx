import {shaderMaterial} from "@react-three/drei";
import {vertexShader} from "./vertexShader.glsl";
import {fragmentShader} from "./fragmentShader.glsl";
import {Vector2} from "three";

export const ShaderMat = shaderMaterial(
    {
        u_time : 0.0,
        u_resolution : new Vector2(window.innerWidth, window.innerHeight),
    },
    vertexShader,
    fragmentShader

)
