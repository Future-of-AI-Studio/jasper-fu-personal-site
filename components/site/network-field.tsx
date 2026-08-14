"use client";

import { useEffect, useRef } from "react";

import { identity } from "../../lib/identity";
import { prefersReducedMotion } from "../../lib/motion/reveal";
import {
  assertNetworkOpacity,
  createNetworkNodes,
  NETWORK_LINK_DISTANCE,
  NETWORK_OPACITY,
  networkLinks,
  networkNodeCountForArea,
  shouldAnimateNetwork,
  stepNetworkNodes,
  type NetworkNode,
} from "../../lib/network-field";

function readReducedMotion() {
  if (typeof window.matchMedia !== "function") {
    return false;
  }
  return prefersReducedMotion(
    window.matchMedia("(prefers-reduced-motion: reduce)"),
  );
}

function paintNetwork(
  context: CanvasRenderingContext2D,
  nodes: readonly NetworkNode[],
  width: number,
  height: number,
) {
  context.clearRect(0, 0, width, height);
  const links = networkLinks(nodes, NETWORK_LINK_DISTANCE);
  const line = identity.colors.sky;
  const node = identity.colors.navyLight;

  for (const link of links) {
    const a = nodes[link.from]!;
    const b = nodes[link.to]!;
    context.beginPath();
    context.moveTo(a.x, a.y);
    context.lineTo(b.x, b.y);
    context.strokeStyle = line;
    context.globalAlpha = 0.22 + link.strength * 0.45;
    context.lineWidth = 1;
    context.stroke();
  }

  for (const point of nodes) {
    context.beginPath();
    context.arc(point.x, point.y, point.r * 3.2, 0, Math.PI * 2);
    context.fillStyle = line;
    context.globalAlpha = 0.12;
    context.fill();
    context.beginPath();
    context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
    context.fillStyle = node;
    context.globalAlpha = 0.85;
    context.fill();
  }

  context.globalAlpha = 1;
}

export function NetworkField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const opacity = assertNetworkOpacity(NETWORK_OPACITY);
    canvas.style.opacity = String(opacity);

    let nodes: NetworkNode[] = [];
    let frame = 0;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      nodes = createNetworkNodes(
        networkNodeCountForArea(width, height),
        width,
        height,
      );
      paintNetwork(context, nodes, width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!shouldAnimateNetwork(readReducedMotion())) {
      return () => window.removeEventListener("resize", resize);
    }

    const tick = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      nodes = stepNetworkNodes(nodes, width, height);
      paintNetwork(context, nodes, width, height);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      aria-hidden="true"
      className="network-field"
      data-network-field="true"
      ref={canvasRef}
    />
  );
}
