import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  Rotate3d, 
  Layers, 
  Maximize2, 
  RotateCcw, 
  Play, 
  Pause, 
  Eye, 
  Mountain,
  Radio,
  Sliders
} from 'lucide-react';

export default function GeoTerrain3D({ imageSrc, rasterName = "Sentinel-2 MSI Terrain" }) {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const meshRef = useRef(null);
  const animFrameRef = useRef(null);

  const [elevationScale, setElevationScale] = useState(1.8);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current || !imageSrc) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#08090C');
    scene.fog = new THREE.FogExp2('#08090C', 0.007);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, -50, 42);
    camera.up.set(0, 0, 1); // Z is UP for geospatial terrain

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't flip below terrain
    controls.minDistance = 15;
    controls.maxDistance = 140;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.4);
    sunLight.position.set(30, -40, 60);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 0.5);
    rimLight.position.set(-40, 40, 30);
    scene.add(rimLight);

    // 6. Terrain Generation via Texture + Heightmap Inversion
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    img.onload = () => {
      // Build heightmap from luminance
      const canvas = document.createElement('canvas');
      const segments = 128;
      canvas.width = segments;
      canvas.height = segments;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, segments, segments);
      const imgData = ctx.getImageData(0, 0, segments, segments).data;

      const geometry = new THREE.PlaneGeometry(60, 60, segments - 1, segments - 1);
      const pos = geometry.attributes.position;

      // Displace vertices along Z axis
      const originalZ = new Float32Array(pos.count);
      for (let i = 0; i < pos.count; i++) {
        const pixelIdx = i * 4;
        const r = imgData[pixelIdx];
        const g = imgData[pixelIdx + 1];
        const b = imgData[pixelIdx + 2];
        // Standard perceived luminance formula
        const lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255.0;
        
        // Non-linear elevation curve (valleys dip smoothly, ridges peak)
        const heightVal = Math.pow(lum, 1.2) * 12.0;
        pos.setZ(i, heightVal * elevationScale);
        originalZ[i] = heightVal;
      }
      geometry.userData = { originalZ };
      geometry.computeVertexNormals();

      // Satellite Texture
      const texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      texture.colorSpace = THREE.SRGBColorSpace;

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.85,
        metalness: 0.1,
        wireframe: wireframe,
        flatShading: false,
        side: THREE.DoubleSide
      });

      const terrainMesh = new THREE.Mesh(geometry, material);
      terrainMesh.receiveShadow = true;
      terrainMesh.castShadow = true;
      scene.add(terrainMesh);
      meshRef.current = terrainMesh;

      // Base Grid Floor (HUD aesthetic)
      const grid = new THREE.GridHelper(90, 30, 0x8b5cf6, 0x1e293b);
      grid.position.z = -1.0;
      grid.rotation.x = Math.PI / 2;
      scene.add(grid);

      setIsLoading(false);
    };

    // 7. Animation Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [imageSrc]);

  // Handle elevation scale changes dynamically
  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;
    const pos = mesh.geometry.attributes.position;
    const originalZ = mesh.geometry.userData.originalZ;
    if (!originalZ) return;

    for (let i = 0; i < pos.count; i++) {
      pos.setZ(i, originalZ[i] * elevationScale);
    }
    pos.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  }, [elevationScale]);

  // Handle wireframe toggle
  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.material.wireframe = wireframe;
  }, [wireframe]);

  // Handle auto-rotate toggle
  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  const handleResetCamera = () => {
    if (!controlsRef.current) return;
    controlsRef.current.reset();
  };

  return (
    <div className="relative w-full h-full min-h-[420px] bg-[#08090C] rounded-xl overflow-hidden flex flex-col items-center justify-center select-none border border-white/10 shadow-2xl">
      
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#08090C]/80 backdrop-blur-sm">
          <div className="w-10 h-10 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-white font-mono text-xs tracking-widest uppercase">Building 3D Elevation Mesh...</p>
          <span className="text-white/40 font-mono text-[10px] mt-1">Copernicus / DEM Topographic Inversion</span>
        </div>
      )}

      {/* Top HUD Banner: ISRO Geospatial Elevation Telemetry */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-[#08090C]/85 backdrop-blur-md border border-[#8B5CF6]/40 px-3 py-1.5 rounded-xl shadow-lg">
        <Mountain className="w-4 h-4 text-[#10B981]" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold text-white tracking-wider uppercase">3D Digital Twin</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          </div>
          <span className="text-[9px] font-mono text-slate-400">Topographic Relief • 30m Res</span>
        </div>
      </div>

      {/* Interactive Controls Floating HUD */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#12131C]/90 backdrop-blur-xl border border-white/15 px-3 py-2 rounded-2xl shadow-2xl">
        
        {/* Elevation Scale Slider */}
        <div className="flex items-center gap-2 px-2 border-r border-white/10">
          <Sliders className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span className="text-[10px] font-mono text-slate-300 hidden sm:inline">Relief:</span>
          <input
            type="range"
            min="0.5"
            max="3.5"
            step="0.1"
            value={elevationScale}
            onChange={(e) => setElevationScale(parseFloat(e.target.value))}
            className="w-20 accent-[#8B5CF6] cursor-pointer"
            title="Adjust Elevation Amplification"
          />
          <span className="text-[10px] font-mono text-[#10B981] font-bold w-7">{elevationScale}x</span>
        </div>

        {/* Wireframe Toggle */}
        <button
          type="button"
          onClick={() => setWireframe(prev => !prev)}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
            wireframe 
              ? 'bg-[#10B981] text-[#08090C] font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)]' 
              : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
          }`}
          title="Toggle Radar Wireframe Mesh"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Wireframe</span>
        </button>

        {/* Auto Orbit Toggle */}
        <button
          type="button"
          onClick={() => setAutoRotate(prev => !prev)}
          className={`px-2.5 py-1 rounded-xl text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
            autoRotate 
              ? 'bg-[#8B5CF6] text-white font-bold shadow-[0_0_12px_rgba(139,92,246,0.5)]' 
              : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
          }`}
          title="Toggle Slow Cinematic 360° Rotation"
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>Orbit</span>
        </button>

        {/* Reset Camera Button */}
        <button
          type="button"
          onClick={handleResetCamera}
          className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer active:scale-95"
          title="Reset Camera View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Legend Pill */}
      <div className="absolute top-3 right-3 z-20 hidden sm:flex items-center gap-2 bg-[#08090C]/85 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-xl text-[9px] font-mono text-slate-400">
        <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
        <span>Drag: Rotate • Right-click: Pan • Scroll: Zoom</span>
      </div>

    </div>
  );
}
