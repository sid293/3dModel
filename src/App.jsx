import { useEffect, useState } from 'react'
import './App.css'
import {Canvas} from "@react-three/fiber";
import {Line, OrbitControls} from '@react-three/drei';
import * as XLSX from 'xlsx/xlsx.mjs';
// import * as fs from 'fs';

// XLSX.set_fs(fs);

function App() {
  const [Node, setNode] = useState([]);
  const [Members, setMembers] = useState([]);
  const [Points, setPoints] = useState([]);

  const readExcel = async () => {
    const response = await fetch('/public/Sample.xlsx'); 
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0]; 
    const sheetName2 = workbook.SheetNames[1]; 
    const worksheet = workbook.Sheets[sheetName];
    const worksheet2 = workbook.Sheets[sheetName2];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    const jsonData2 = XLSX.utils.sheet_to_json(worksheet2);
    // console.log("json data: ",jsonData); 
    // console.log("json data2: ",jsonData2); 
    setMembers(jsonData);
    setNode(jsonData2);
  };


  useEffect(()=>{
    readExcel();
  },[]);

  useEffect(()=>{
    //calculate points
    let pointsArr = [];
    Members.map((member,index)=>{
      const startNode = Node[member["Start Node"] -1];
      const endNode = Node[member["End Node"] -1];
      if(!startNode || !endNode) return null;
      pointsArr.push([startNode,endNode]);
    })
    // console.log("points is ",pointsArr);
    setPoints(pointsArr);
  },[Node, Members]);

  return (
    <>
      <div id="canvas-container" style={{border:"2px solid green", height:"90vh", width:"90vw"}}>
        <Canvas 
          camera={{position:[10,10,10]}}>
          <ambientLight intensity={0.1} />
          <directionalLight color="green" position={[3,2,5]} />
          <mesh>
            <boxGeometry 
              args={[2,2,2]} 
              color="blue"
               />
            <Line
              color={"black"}
              points={[[2,2,2],[1,1,1]]}
            />
            {Points.map((point, index)=>(
              <Line key={index} color={"black"} points={[[point[0]["X"],point[0]["Y"],point[0]["Z"]],[point[1]["X"],point[1]["Y"],point[1]["Z"]]]} />
            ))}
            <meshStandardMaterial color="orange" />
          </mesh>
          <OrbitControls />
        </Canvas>
      </div>
    </>
  )
}

export default App
