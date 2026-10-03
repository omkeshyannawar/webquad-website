import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import "./Hero.css";

const GRID_X = 48;
const GRID_Y = 28;

const POINTER_RADIUS = 190;
const POINTER_FORCE = 0.22;

const RETURN_SPEED = 0.12;
const VELOCITY_DAMPING = 0.82;

export default function Hero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;

    if (!hero || !canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrame;
    let width = 0;
    let height = 0;
    let dpr = 1;

    let points = [];

    const pointer = {
      x: 0,
      y: 0,
      previousX: 0,
      previousY: 0,
      velocityX: 0,
      velocityY: 0,
      active: false,
    };

    const createPoints = () => {
      points = [];

      for (let y = 0; y <= GRID_Y; y += 1) {
        for (let x = 0; x <= GRID_X; x += 1) {
          points.push({
            baseX: x / GRID_X,
            baseY: y / GRID_Y,

            x: x / GRID_X,
            y: y / GRID_Y,

            velocityX: 0,
            velocityY: 0,
          });
        }
      }
    };

    const resize = () => {
      const rect = hero.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      dpr = Math.min(
        window.devicePixelRatio || 1,
        1.5
      );

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );

      createPoints();

      pointer.x = width / 2;
      pointer.y = height / 2;

      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;
    };

    const handlePointerMove = (event) => {
      const rect = hero.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      pointer.velocityX = x - pointer.x;
      pointer.velocityY = y - pointer.y;

      pointer.previousX = pointer.x;
      pointer.previousY = pointer.y;

      pointer.x = x;
      pointer.y = y;

      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;

      pointer.velocityX = 0;
      pointer.velocityY = 0;
    };

    const getIndex = (x, y) => {
      return y * (GRID_X + 1) + x;
    };

    const updatePoints = () => {
      const speed = Math.sqrt(
        pointer.velocityX ** 2 +
          pointer.velocityY ** 2
      );

      /*
       * Keep cursor influence controlled.
       */

      const velocityX = Math.max(
        -25,
        Math.min(25, pointer.velocityX)
      );

      const velocityY = Math.max(
        -25,
        Math.min(25, pointer.velocityY)
      );

      for (const point of points) {
        const pointX = point.x * width;
        const pointY = point.y * height;

        const dx = pointX - pointer.x;
        const dy = pointY - pointer.y;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        /*
         * ----------------------------------------
         * LOCAL CURSOR INFLUENCE
         * ----------------------------------------
         *
         * Outside this radius:
         *
         * absolutely no cursor force.
         */

        if (
          pointer.active &&
          distance < POINTER_RADIUS
        ) {
          const normalizedDistance =
            distance / POINTER_RADIUS;

          /*
           * Smooth falloff.
           *
           * Center = strong
           * Edge   = almost zero
           */

          const falloff =
            1 -
            normalizedDistance *
              normalizedDistance;

          /*
           * Faster cursor = stronger push.
           * But capped so it never explodes.
           */

          const speedFactor = Math.min(
            speed / 30,
            1
          );

          const force =
            falloff *
            speedFactor *
            POINTER_FORCE;

          /*
           * Push in the direction
           * the cursor is moving.
           */

          point.velocityX +=
            velocityX *
            force *
            0.0008;

          point.velocityY +=
            velocityY *
            force *
            0.0008;
        }

        /*
         * ----------------------------------------
         * LOCAL VELOCITY
         * ----------------------------------------
         */

        point.velocityX *= VELOCITY_DAMPING;
        point.velocityY *= VELOCITY_DAMPING;

        /*
         * ----------------------------------------
         * RETURN TO ORIGINAL POSITION
         * ----------------------------------------
         *
         * This is deliberately strong.
         * The affected area returns quickly.
         */

        point.x += point.velocityX;
        point.y += point.velocityY;

        point.x +=
          (point.baseX - point.x) *
          RETURN_SPEED;

        point.y +=
          (point.baseY - point.y) *
          RETURN_SPEED;
      }

      /*
       * Cursor velocity disappears quickly
       * when the cursor stops.
       */

      pointer.velocityX *= 0.7;
      pointer.velocityY *= 0.7;
    };

    const drawLine = (linePoints) => {
      if (linePoints.length < 2) return;

      ctx.beginPath();

      const first = linePoints[0];

      ctx.moveTo(
        first.x * width,
        first.y * height
      );

      for (
        let i = 1;
        i < linePoints.length;
        i += 1
      ) {
        const previous =
          linePoints[i - 1];

        const current =
          linePoints[i];

        const previousX =
          previous.x * width;

        const previousY =
          previous.y * height;

        const currentX =
          current.x * width;

        const currentY =
          current.y * height;

        const controlX =
          (previousX + currentX) / 2;

        const controlY =
          (previousY + currentY) / 2;

        ctx.quadraticCurveTo(
          previousX,
          previousY,
          controlX,
          controlY
        );
      }

      const last =
        linePoints[linePoints.length - 1];

      ctx.lineTo(
        last.x * width,
        last.y * height
      );

      ctx.stroke();
    };

    const drawMesh = () => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      /*
       * Horizontal lines
       */

      ctx.lineWidth = 0.7;

      ctx.strokeStyle =
        "rgba(243, 241, 236, 0.22)";

      for (
        let y = 0;
        y <= GRID_Y;
        y += 1
      ) {
        const row = [];

        for (
          let x = 0;
          x <= GRID_X;
          x += 1
        ) {
          row.push(
            points[getIndex(x, y)]
          );
        }

        drawLine(row);
      }

      /*
       * Vertical lines
       */

      ctx.strokeStyle =
        "rgba(243, 241, 236, 0.15)";

      for (
        let x = 0;
        x <= GRID_X;
        x += 1
      ) {
        const column = [];

        for (
          let y = 0;
          y <= GRID_Y;
          y += 1
        ) {
          column.push(
            points[getIndex(x, y)]
          );
        }

        drawLine(column);
      }
    };

    const render = () => {
      if (!reducedMotion) {
        updatePoints();
      }

      drawMesh();

      animationFrame =
        requestAnimationFrame(render);
    };

    resize();

    hero.addEventListener(
      "pointermove",
      handlePointerMove
    );

    hero.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    window.addEventListener(
      "resize",
      resize
    );

    render();

    return () => {
      cancelAnimationFrame(animationFrame);

      hero.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      hero.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      window.removeEventListener(
        "resize",
        resize
      );
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="hero"
    >
      <canvas
        ref={canvasRef}
        className="hero__canvas"
        aria-hidden="true"
      />

      <div className="hero__content">
        <p className="hero__eyebrow">
          WebQuad / Digital Studio
        </p>

        <h1 className="hero__title">
          We build
          <br />
          digital products
          <br />
          that move.
        </h1>

        <div className="hero__bottom">
          <p className="hero__description">
            Websites, applications and digital
            experiences built for businesses
            ready to move forward.
          </p>

          <Link
            to="/contact"
            className="hero__cta"
          >
            Start a project
          </Link>
        </div>
      </div>

      <div className="hero__footer">
        <span>Websites</span>
        <span>Products</span>
        <span>Applications</span>
      </div>
    </section>
  );
}