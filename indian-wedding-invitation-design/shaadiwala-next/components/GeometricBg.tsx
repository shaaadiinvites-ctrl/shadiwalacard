'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function GeometricBg() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth, H = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xfafafa, 0);
    mount.appendChild(renderer.domElement);

    // Muted neutral color palette — light greys, soft blue-grey
    const colors = [0xd1d5db, 0xe5e7eb, 0x9ca3af, 0xcbd5e1, 0xbfdbfe, 0xddd6fe];

    const shapes: { mesh: THREE.Mesh | THREE.LineSegments; rotX: number; rotY: number; rotZ: number }[] = [];

    // Helper: wireframe box
    function makeBox(size: number, x: number, y: number, z: number, color: number) {
      const geo = new THREE.BoxGeometry(size, size, size);
      const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.35 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      return { mesh, rotX: (Math.random() - 0.5) * 0.008, rotY: (Math.random() - 0.5) * 0.008, rotZ: (Math.random() - 0.5) * 0.004 };
    }

    // Helper: wireframe octahedron
    function makeOcta(r: number, x: number, y: number, z: number, color: number) {
      const geo = new THREE.OctahedronGeometry(r);
      const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.25 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      return { mesh, rotX: (Math.random() - 0.5) * 0.006, rotY: (Math.random() - 0.5) * 0.01, rotZ: 0 };
    }

    // Helper: wireframe torus
    function makeTorus(r: number, t: number, x: number, y: number, z: number, color: number) {
      const geo = new THREE.TorusGeometry(r, t, 8, 24);
      const mat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.2 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      return { mesh, rotX: (Math.random() - 0.5) * 0.005, rotY: (Math.random() - 0.5) * 0.007, rotZ: (Math.random() - 0.5) * 0.003 };
    }

    // Scatter shapes across scene
    const positions = [
      [-10, 5, -5], [10, -4, -8], [-8, -7, -4], [12, 6, -6], [-14, 2, -10],
      [7, 8, -3], [-5, -8, -7], [14, -7, -5], [-12, -3, -9], [0, 10, -6],
    ];

    positions.forEach(([x, y, z], i) => {
      const col = colors[i % colors.length];
      const type = i % 3;
      if (type === 0) shapes.push(makeBox(2 + Math.random() * 2, x!, y!, z!, col));
      else if (type === 1) shapes.push(makeOcta(1.2 + Math.random(), x!, y!, z!, col));
      else shapes.push(makeTorus(1.2, 0.15, x!, y!, z!, col));
    });

    // Dot grid plane — very subtle
    const dotCount = 300;
    const dotGeo = new THREE.BufferGeometry();
    const dotPos = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
      dotPos[i * 3]     = (Math.random() - 0.5) * 40;
      dotPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      dotPos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 5;
    }
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
    const dotMat = new THREE.PointsMaterial({ color: 0x9ca3af, size: 0.08, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(dotGeo, dotMat));

    // Mouse parallax
    let mx = 0, my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * -2;
    };
    window.addEventListener('mousemove', onMouse);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    let frame: number;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      shapes.forEach(s => {
        s.mesh.rotation.x += s.rotX;
        s.mesh.rotation.y += s.rotY;
        s.mesh.rotation.z += s.rotZ;
      });
      camera.position.x += (mx * 1.5 - camera.position.x) * 0.03;
      camera.position.y += (my * 1.0 - camera.position.y) * 0.03;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
}
