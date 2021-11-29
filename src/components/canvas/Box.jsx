import useStore from '@/helpers/store'
import { useFrame, extend, useThree } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import { useRef, useState } from 'react'
import { SAOPass } from 'three-stdlib'
import {Vector2} from "three"
extend(SAOPass)

const TheSao = () => {  
  const {camera, scene} = useThree();
  
  return(


    <SAOPass 
    args = {[scene, camera, false, true , new Vector2(window.innerWidth,window.innerHeight)]}
    params={{
      saoBias :  1,
      saoIntensity : 0.003,
      saoScale : 45,
      saoKernelRadius :96,
      saoMinResolution : 0,
      saoBlur : true,
      saoBlurRadius : 16,
      saoBlurStdDev : 8 ,
      saoBlurDepthCutoff : 0.01,
    }}
    />
  );
}

const BoxComponent = ({ route }) => {

  const router = useStore((s) => s.router)
  // This reference will give us direct access to the THREE.Mesh object
  const mesh = useRef(null)
  const mesh1 = useRef(null)
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) =>{
    mesh.current
      ? (mesh.current.rotation.y = mesh.current.rotation.x += 0.01)
      : null
    mesh1.current
      ? (mesh1.current.rotation.y = mesh1.current.rotation.x += 0.01)
      : null
  })
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <>
      <mesh
      position={[2,1,0]}
        ref={mesh1}
        onClick={() => router.push(route)}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.1 : 1}
      >
        <boxBufferGeometry args={[2, 2, 2]} />
        <meshPhysicalMaterial color={0x99ffff} />
      </mesh>
      <mesh
        ref={mesh}

      >
        <boxBufferGeometry args={[2, 2, 2]} />
        <meshPhysicalMaterial color={0xffff99} />
      </mesh>
      <directionalLight position={[5, 5, 5]} />
      <ambientLight />

      {/*using AO Here*/}
      <EffectComposer>
        <TheSao/>
      </EffectComposer>
    </>
  )
}
export default BoxComponent
