"use client";

import React, { useEffect, useRef, useState } from "react";

// Labeled technology nodes floating in the outer sphere layer
const LABELED_TECHS = [
  "AI Automation",
  "Neural Networks",
  "Agentic Workflows",
  "Computer Vision",
  "NLP Models",
  "IoT Sensor Mesh",
  "Embedded C/C++",
  "Next.js Web Apps",
  "Prisma Databases",
  "Robotics & ROS",
  "Cloud Systems",
  "Autonomous Logic"
];

interface Point3D {
  x: number;
  y: number;
  z: number;
  projX: number;
  projY: number;
  projZ: number;
  scale: number;
}

interface TechNode {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  label: string;
  projX: number;
  projY: number;
  projZ: number;
  scale: number;
}

export function TechOrbit() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent?.clientWidth || 550;
      height = parent?.clientHeight || 550;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener("resize", resize);
    resize();

    // ----------------------------------------------------
    // INITIALIZE ROBOT 3D GEOMETRY VERTICES
    // ----------------------------------------------------
    // Head box vertices (relative to head center Y = -60)
    const headOffset = -70;
    const rawHeadVertices = [
      { x: -30, y: -30 + headOffset, z: -25 }, // 0
      { x: 30, y: -30 + headOffset, z: -25 },  // 1
      { x: 30, y: 30 + headOffset, z: -25 },   // 2
      { x: -30, y: 30 + headOffset, z: -25 },  // 3
      { x: -28, y: -28 + headOffset, z: 25 },  // 4 (slightly tapered front)
      { x: 28, y: -28 + headOffset, z: 25 },   // 5
      { x: 28, y: 28 + headOffset, z: 25 },    // 6
      { x: -28, y: 28 + headOffset, z: 25 }     // 7
    ];

    // Neck vertices (Y = -35 to -20)
    const rawNeckVertices = [
      { x: -8, y: -35, z: -8 },
      { x: 8, y: -35, z: -8 },
      { x: 8, y: -20, z: -8 },
      { x: -8, y: -20, z: -8 },
      { x: -8, y: -35, z: 8 },
      { x: 8, y: -35, z: 8 },
      { x: 8, y: -20, z: 8 },
      { x: -8, y: -20, z: 8 }
    ];

    // Chest/Shoulders vertices (Y = -20 to 30)
    const rawChestVertices = [
      { x: -60, y: -20, z: -35 }, // 0
      { x: 60, y: -20, z: -35 },  // 1
      { x: 50, y: 40, z: -30 },   // 2
      { x: -50, y: 40, z: -30 },  // 3
      { x: -60, y: -20, z: 35 },  // 4
      { x: 60, y: -20, z: 35 },   // 5
      { x: 50, y: 40, z: 30 },    // 6
      { x: -50, y: 40, z: 30 }    // 7
    ];

    // Left and Right Eyes (on front face of head Y = -70, Z = 25)
    const rawEyes = [
      { x: -12, y: -70, z: 26 }, // Left eye center
      { x: 12, y: -70, z: 26 }   // Right eye center
    ];

    // ----------------------------------------------------
    // INITIALIZE ORBITING TECH NODES
    // ----------------------------------------------------
    const techNodes: TechNode[] = [];
    const orbitRadius = 195;
    const totalTechs = LABELED_TECHS.length;

    for (let i = 0; i < totalTechs; i++) {
      // Golden Spiral distribution for outer sphere orbiting
      const phi = Math.acos(1 - 2 * (i + 0.5) / totalTechs);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = orbitRadius * Math.sin(phi) * Math.cos(theta);
      const y = orbitRadius * Math.sin(phi) * Math.sin(theta);
      const z = orbitRadius * Math.cos(phi);

      techNodes.push({
        x, y, z,
        baseX: x, baseY: y, baseZ: z,
        label: LABELED_TECHS[i],
        projX: 0, projY: 0, projZ: 0, scale: 1
      });
    }

    // State for auto-rotation and tilt interpolation
    let angleX = 0;
    let angleY = 0;
    let rotationVelocityX = 0.001;
    let rotationVelocityY = 0.002;
    const focalLength = 400;

    // ----------------------------------------------------
    // RENDER LOOP
    // ----------------------------------------------------
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Mouse Parallax Physics
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.07;
      mouse.y += (mouse.targetY - mouse.y) * 0.07;

      const targetVelX = 0.0015 - mouse.y * 0.012;
      const targetVelY = 0.0025 + mouse.x * 0.012;

      rotationVelocityX += (targetVelX - rotationVelocityX) * 0.08;
      rotationVelocityY += (targetVelY - rotationVelocityY) * 0.08;

      angleX += rotationVelocityX;
      angleY += rotationVelocityY;

      // Trigonometric cache for rotation
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Robot angles: face straight, tilt with mouse, plus breathing movement
      const robotTime = Date.now() * 0.0025;
      const robotAngleX = mouse.y * 0.35 + Math.sin(robotTime) * 0.04;
      const robotAngleY = mouse.x * 0.45 + Math.cos(robotTime * 0.7) * 0.03;
      const robotCosX = Math.cos(robotAngleX);
      const robotSinX = Math.sin(robotAngleX);
      const robotCosY = Math.cos(robotAngleY);
      const robotSinY = Math.sin(robotAngleY);
      const robotBreathingY = Math.sin(robotTime) * 6; // Breathing up/down movement

      // Projects robot parts so they face straight ahead with tilt and breathing
      const rotateAndProjectRobot = (p: { x: number; y: number; z: number }): Point3D => {
        // Apply breathing Y offset
        let py = p.y + robotBreathingY;

        // Rotate around Y-axis (robotAngleY)
        let x1 = p.x * robotCosY - p.z * robotSinY;
        let z1 = p.x * robotSinY + p.z * robotCosY;

        // Rotate around X-axis (robotAngleX)
        let y1 = py * robotCosX - z1 * robotSinX;
        let z2 = py * robotSinX + z1 * robotCosX;

        const scale = focalLength / (focalLength + z2);
        return {
          x: x1, y: y1, z: z2,
          projX: centerX + x1 * scale,
          projY: centerY + y1 * scale,
          projZ: z2,
          scale
        };
      };

      // Project all technology nodes orbiting the robot
      for (let i = 0; i < techNodes.length; i++) {
        const node = techNodes[i];
        // Apply Y-rotation (orbiting rotation over time) plus standard mouse tilt
        const orbitAngle = Date.now() * 0.0003 + i * 0.25;
        const oCos = Math.cos(orbitAngle);
        const oSin = Math.sin(orbitAngle);

        // Orbit calculation around Y-axis
        let ox = node.baseX * oCos - node.baseZ * oSin;
        let oz = node.baseX * oSin + node.baseZ * oCos;
        let oy = node.baseY;

        // Apply mouse tilt rotation
        let rx = ox * cosY - oz * sinY;
        let rz = ox * sinY + oz * cosY;
        let ry = oy * cosX - rz * sinX;
        let rz2 = oy * sinX + rz * cosX;

        const scale = focalLength / (focalLength + rz2);
        node.projX = centerX + rx * scale;
        node.projY = centerY + ry * scale;
        node.projZ = rz2;
        node.scale = scale;
      }

      // Generate animated hands typing on a console in front of the robot
      const time = Date.now() * 0.0085;
      const rawLeftHand = {
        x: -35 + 8 * Math.sin(time * 0.5),
        y: 55 + 12 * Math.cos(time * 0.8),
        z: 45 + 10 * Math.sin(time)
      };
      const rawRightHand = {
        x: 35 + 8 * Math.cos(time * 0.6),
        y: 55 + 12 * Math.sin(time * 0.7),
        z: 45 + 10 * Math.cos(time * 0.9)
      };

      // Generate control console grid (tilted holographic pad in front of body)
      const rawConsolePoints = [
        { x: -55, y: 70, z: 25 },
        { x: 55, y: 70, z: 25 },
        { x: 65, y: 80, z: 75 },
        { x: -65, y: 80, z: 75 }
      ];

      // Rotate and project robot parts
      const head = rawHeadVertices.map(v => rotateAndProjectRobot(v));
      const neck = rawNeckVertices.map(v => rotateAndProjectRobot(v));
      const chest = rawChestVertices.map(v => rotateAndProjectRobot(v));
      const eyes = rawEyes.map(v => rotateAndProjectRobot(v));
      const leftHand = rotateAndProjectRobot(rawLeftHand);
      const rightHand = rotateAndProjectRobot(rawRightHand);
      const consolePad = rawConsolePoints.map(v => rotateAndProjectRobot(v));

      // Separate tech nodes into back (z > 0) and front (z <= 0) for depth compositing
      const backTechs = techNodes.filter(n => n.projZ > 0);
      const frontTechs = techNodes.filter(n => n.projZ <= 0);

      // Helper to draw wireframe edges between points
      const drawWireframe = (points: Point3D[], edges: number[][], color: string, width = 1) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        for (const edge of edges) {
          const p1 = points[edge[0]];
          const p2 = points[edge[1]];
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      };

      // Helper to draw tech nodes labels
      const drawTechNodes = (nodeList: TechNode[]) => {
        for (const node of nodeList) {
          const size = 3 * node.scale;
          const alpha = (node.projZ > 0 ? 0.3 : 0.8) * (node.scale * 0.6 + 0.4);

          // Draw node dot
          ctx.beginPath();
          ctx.arc(node.projX, node.projY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 92, 42, ${alpha})`;
          ctx.fill();

          // Draw label
          ctx.font = `600 ${Math.round(8.5 * node.scale)}px var(--sans)`;
          const textWidth = ctx.measureText(node.label).width;

          ctx.fillStyle = `rgba(11, 12, 12, ${alpha * 0.7})`;
          ctx.fillRect(
            node.projX - textWidth / 2 - 5,
            node.projY - 16 * node.scale,
            textWidth + 10,
            11 * node.scale
          );

          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.07})`;
          ctx.strokeRect(
            node.projX - textWidth / 2 - 5,
            node.projY - 16 * node.scale,
            textWidth + 10,
            11 * node.scale
          );

          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(node.label, node.projX, node.projY - 11 * node.scale);
        }
      };

      // ----------------------------------------------------
      // DRAW PASS 1: BACK LAYER (Tech nodes behind the robot)
      // ----------------------------------------------------
      drawTechNodes(backTechs);

      // ----------------------------------------------------
      // DRAW PASS 2: THE 3D ROBOT AGENT
      // ----------------------------------------------------
      // A. Draw Neck (connects head center to chest)
      const neckEdges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // top
        [4, 5], [5, 6], [6, 7], [7, 4], // bottom
        [0, 4], [1, 5], [2, 6], [3, 7]  // pillars
      ];
      drawWireframe(neck, neckEdges, "rgba(92, 125, 248, 0.25)", 0.8);

      // B. Draw Chest / Shoulders
      const chestEdges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // back
        [4, 5], [5, 6], [6, 7], [7, 4], // front
        [0, 4], [1, 5], [2, 6], [3, 7]  // depth links
      ];
      // Draw double chest outlines with varying opacity to look like volumetric panels
      drawWireframe(chest, chestEdges, "rgba(92, 125, 248, 0.4)", 1);
      drawWireframe(chest, [[0, 2], [1, 3], [4, 6], [5, 7]], "rgba(92, 125, 248, 0.15)", 0.6); // diagonal structure

      // C. Draw Head Box
      const headEdges = [
        [0, 1], [1, 2], [2, 3], [3, 0], // back
        [4, 5], [5, 6], [6, 7], [7, 4], // front
        [0, 4], [1, 5], [2, 6], [3, 7]  // sides
      ];
      drawWireframe(head, headEdges, "rgba(255, 92, 42, 0.55)", 1.2);
      
      // Draw transparent head backplate shading
      ctx.fillStyle = "rgba(255, 92, 42, 0.03)";
      ctx.beginPath();
      ctx.moveTo(head[4].projX, head[4].projY);
      ctx.lineTo(head[5].projX, head[5].projY);
      ctx.lineTo(head[6].projX, head[6].projY);
      ctx.lineTo(head[7].projX, head[7].projY);
      ctx.closePath();
      ctx.fill();

      // D. Draw Eyes (glowing digital screens)
      const eyeRadius = 6 * head[0].scale;
      const eyePulse = 1 + 0.12 * Math.sin(Date.now() * 0.005);
      
      for (const eye of eyes) {
        // Draw glow ring
        ctx.beginPath();
        ctx.arc(eye.projX, eye.projY, eyeRadius * 1.8 * eyePulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 92, 42, 0.12)";
        ctx.fill();

        // Draw solid core
        ctx.beginPath();
        ctx.arc(eye.projX, eye.projY, eyeRadius * eyePulse, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.fill();
        ctx.strokeStyle = "var(--acid)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // E. Draw Holographic Console Pad (Keyboard grid) in front
      const padEdges = [
        [0, 1], [1, 2], [2, 3], [3, 0]
      ];
      drawWireframe(consolePad, padEdges, "rgba(92, 125, 248, 0.7)", 1.5);
      
      // Draw inner console grid lines
      ctx.strokeStyle = "rgba(92, 125, 248, 0.25)";
      ctx.lineWidth = 0.5;
      for (let i = 1; i <= 4; i++) {
        const t = i / 5;
        // Horizontal lines
        const leftX = consolePad[0].projX + (consolePad[3].projX - consolePad[0].projX) * t;
        const leftY = consolePad[0].projY + (consolePad[3].projY - consolePad[0].projY) * t;
        const rightX = consolePad[1].projX + (consolePad[2].projX - consolePad[1].projX) * t;
        const rightY = consolePad[1].projY + (consolePad[2].projY - consolePad[1].projY) * t;

        ctx.beginPath();
        ctx.moveTo(leftX, leftY);
        ctx.lineTo(rightX, rightY);
        ctx.stroke();
        
        // Vertical grid subdivisions
        const topX = consolePad[0].projX + (consolePad[1].projX - consolePad[0].projX) * t;
        const topY = consolePad[0].projY + (consolePad[1].projY - consolePad[0].projY) * t;
        const botX = consolePad[3].projX + (consolePad[2].projX - consolePad[3].projX) * t;
        const botY = consolePad[3].projY + (consolePad[2].projY - consolePad[3].projY) * t;

        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.lineTo(botX, botY);
        ctx.stroke();
      }

      // Draw faint console glow fill
      ctx.fillStyle = "rgba(92, 125, 248, 0.05)";
      ctx.beginPath();
      ctx.moveTo(consolePad[0].projX, consolePad[0].projY);
      ctx.lineTo(consolePad[1].projX, consolePad[1].projY);
      ctx.lineTo(consolePad[2].projX, consolePad[2].projY);
      ctx.lineTo(consolePad[3].projX, consolePad[3].projY);
      ctx.closePath();
      ctx.fill();

      // F. Draw Robot Hands (glowing input probes) and connections
      const drawHand = (hand: Point3D) => {
        // Draw hand core
        ctx.beginPath();
        ctx.arc(hand.projX, hand.projY, 6 * hand.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        ctx.strokeStyle = "rgba(92, 125, 248, 0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Connect hand back to chest shoulder points (Jointed arm wireframe)
        ctx.beginPath();
        // Left chest shoulder
        const shoulder = hand.projX < centerX ? chest[4] : chest[5];
        // Calculate an elbow point in 3D for a jointed look
        const midX = (shoulder.projX + hand.projX) / 2;
        const midY = (shoulder.projY + hand.projY) / 2 + 30 * hand.scale;
        
        ctx.moveTo(shoulder.projX, shoulder.projY);
        ctx.lineTo(midX, midY);
        ctx.lineTo(hand.projX, hand.projY);
        ctx.strokeStyle = "rgba(92, 125, 248, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Draw elbow joint dot
        ctx.beginPath();
        ctx.arc(midX, midY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "var(--acid)";
        ctx.fill();
      };

      drawHand(leftHand);
      drawHand(rightHand);

      // G. Draw Active Control beams shooting from hands to closest technology nodes
      const drawControlBeams = (hand: Point3D, startNodeIdx: number) => {
        // Find nearest tech node to hand coordinate in 2D projection
        let nearestNode: TechNode | null = null;
        let minDist = 999999;
        
        for (let i = startNodeIdx; i < techNodes.length; i += 2) {
          const node = techNodes[i];
          const dx = node.projX - hand.projX;
          const dy = node.projY - hand.projY;
          const d = dx * dx + dy * dy;
          if (d < minDist) {
            minDist = d;
            nearestNode = node;
          }
        }

        if (nearestNode) {
          ctx.beginPath();
          ctx.moveTo(hand.projX, hand.projY);
          ctx.lineTo(nearestNode.projX, nearestNode.projY);
          
          const grad = ctx.createLinearGradient(hand.projX, hand.projY, nearestNode.projX, nearestNode.projY);
          grad.addColorStop(0, "rgba(255, 255, 255, 0.85)");
          grad.addColorStop(0.3, "rgba(92, 125, 248, 0.6)");
          grad.addColorStop(1, "rgba(255, 92, 42, 0)");
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8 * hand.scale;
          // Set a glowing console command dashes
          ctx.setLineDash([6, 12]);
          ctx.lineDashOffset = -Date.now() * 0.05;
          ctx.stroke();
          ctx.setLineDash([]); // Reset
          
          // Draw a small splash impact glow at the node
          ctx.beginPath();
          ctx.arc(nearestNode.projX, nearestNode.projY, 8 * nearestNode.scale, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(92, 125, 248, 0.22)";
          ctx.fill();
        }
      };

      // Left hand controls odd-indexed nodes, Right hand controls even-indexed nodes
      drawControlBeams(leftHand, 1);
      drawControlBeams(rightHand, 0);

      // ----------------------------------------------------
      // DRAW PASS 3: FRONT LAYER (Tech nodes in front of the robot)
      // ----------------------------------------------------
      drawTechNodes(frontTechs);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="orbit-container" ref={containerRef}>
      <div className="orbit-ecosystem">
        {/* Holographic light background glow */}
        <div className="orbit-volumetric-light" style={{ background: "radial-gradient(circle, rgba(92,125,248,0.1) 0%, transparent 60%)" }} />
        
        {/* The 3D Render Canvas */}
        <canvas ref={canvasRef} className="orbit-canvas" />
      </div>
    </div>
  );
}
