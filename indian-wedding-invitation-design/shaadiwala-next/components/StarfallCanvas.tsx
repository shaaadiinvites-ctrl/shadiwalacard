'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function StarfallCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // transparent so our CSS bg shows
    mount.appendChild(renderer.domElement);

    // ── Starfield particles ──
    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const colors = new Float32Array(starCount * 3);

    // Bronze & white star colors
    const palette = [
      /* removed white for light theme */
      new THREE.Color('#e8a85a'),
      new THREE.Color('#f5d17e'),
      new THREE.Color('#cd7f32'),
      new THREE.Color('#9c6f3f'),
    ];

    for (let i = 0; i < starCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sizes[i] = Math.random() * 2.5 + 0.5;
      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3]     = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.06,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ── Falling star streaks ──
    const streakCount = 12;
    const streaks: { mesh: THREE.Mesh; speed: number; life: number; maxLife: number }[] = [];

    function createStreak() {
      const length = Math.random() * 3 + 1;
      const geo = new THREE.CylinderGeometry(0.003, 0.001, length, 4);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.1, 0.8, Math.random() * 0.4 + 0.5),
        transparent: true,
        opacity: Math.random() * 0.7 + 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 30,
        Math.random() * 12 + 6,
        (Math.random() - 0.5) * 8
      );
      // tilt the streak diagonally
      mesh.rotation.z = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
      scene.add(mesh);
      return {
        mesh,
        speed: Math.random() * 0.12 + 0.06,
        life: 0,
        maxLife: Math.random() * 80 + 40,
      };
    }

    for (let i = 0; i < streakCount; i++) streaks.push(createStreak());

    // ── Mouse parallax ──
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * -2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ── Resize handler ──
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    
    // Use ResizeObserver for robust mobile layout changes
    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(mount);
    window.addEventListener('resize', onResize);
    
    // Initial size
    setTimeout(onResize, 50);

    // ── Animation loop ──
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Slowly rotate the starfield
      stars.rotation.y += 0.0003;
      stars.rotation.x += 0.0001;

      // Parallax camera sway
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.02;

      // Animate falling streaks
      for (const s of streaks) {
        s.life++;
        s.mesh.position.y -= s.speed;
        s.mesh.position.x -= s.speed * 0.5;
        const progress = s.life / s.maxLife;
        (s.mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(progress * Math.PI) * 0.8;

        if (s.life >= s.maxLife) {
          scene.remove(s.mesh);
          (s.mesh.geometry as THREE.BufferGeometry).dispose();
          (s.mesh.material as THREE.Material).dispose();
          const idx = streaks.indexOf(s);
          streaks[idx] = createStreak();
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}
