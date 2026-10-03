import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import webDevelopmentImage from "../../../../assets/images/webdevelopment.png";
import appDevelopmentImage from "../../../../assets/images/appdevelopment.png";
import graphicDesignImage from "../../../../assets/images/graphicsdesigning.png";

import "./WhatWeBuild.css";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "",
    title: "Website & App Development",
    description:
      "We design and develop high-performance websites and applications that combine strong visual design, smooth interactions and reliable technology.",
    cta: "Explore Development",
    details: [
      {
        label: "WEBSITES",
        value: "Responsive & scalable",
      },
      {
        label: "APPLICATIONS",
        value: "Built around workflows",
      },
      {
        label: "TECHNOLOGY",
        value: "Modern & maintainable",
      },
    ],
    type: "development",
  },
  {
    number: "",
    title: "Custom Product Development",
    description:
      "We build custom digital products around your requirements and automate the workflows that keep your business moving.",
    cta: "Build Your Product",
    details: [
      {
        label: "CUSTOM PRODUCTS",
        value: "Built around your needs",
      },
      {
        label: "WORKFLOW AUTOMATION",
        value: "Reduce repetitive work",
      },
      {
        label: "BUSINESS SYSTEMS",
        value: "Connected & scalable",
      },
    ],
    type: "product",
  },
  {
    number: "",
    title: "Graphic Design",
    description:
      "We shape brands from the ground up through strategy, identity and design, creating everything from logos and brand systems to marketing and digital assets.",
    cta: "Shape Your Brand",
    details: [
      {
        label: "BRAND IDENTITY",
        value: "Logo & visual systems",
      },
      {
        label: "MARKETING DESIGN",
        value: "Campaigns & social assets",
      },
      {
        label: "DIGITAL & PRINT",
        value: "Design across every touchpoint",
      },
    ],
    type: "design",
  },
];

const serviceVisuals = {
  development: webDevelopmentImage,
  product: appDevelopmentImage,
  design: graphicDesignImage,
};

function ServiceVisual({ type }) {
  return (
    <div className={`service-card__visual service-card__visual--${type}`}>
      <img
        className="service-card__image"
        src={serviceVisuals[type]}
        alt=""
        draggable="false"
      />
    </div>
  );
}

export default function WhatWeBuild() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 651px) and (prefers-reduced-motion: no-preference)",
      () => {
        const cards = gsap.utils.toArray(".service-card", section);
        gsap.set(cards.slice(1), { autoAlpha: 0, xPercent: 8 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * (cards.length - 1)}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });

        let wheelLocked = false;
        let wheelAccumulator = 0;
        let wheelDirection = 0;
        let unlockTimer;

        const handleWheel = (event) => {
          if (event.ctrlKey || Math.abs(event.deltaY) < 1) return;

          const trigger = timeline.scrollTrigger;

          if (!trigger?.isActive) return;

          const direction = Math.sign(event.deltaY);
          const steps = cards.length - 1;
          const position = trigger.progress * steps;
          const currentIndex = direction > 0
            ? Math.floor(position + 1 - 0.72)
            : Math.ceil(position - (1 - 0.72));
          const nextIndex = gsap.utils.clamp(
            0,
            steps,
            currentIndex + direction
          );

          if (nextIndex === currentIndex) {
            wheelAccumulator = 0;
            return;
          }

          event.preventDefault();

          if (wheelLocked) return;

          if (wheelDirection !== direction) {
            wheelAccumulator = 0;
            wheelDirection = direction;
          }

          wheelAccumulator += event.deltaY;

          if (Math.abs(wheelAccumulator) < 70) return;

          wheelAccumulator = 0;
          wheelLocked = true;
          window.clearTimeout(unlockTimer);
          unlockTimer = window.setTimeout(() => {
            wheelLocked = false;
          }, 700);

          const targetScroll =
            trigger.start +
            (nextIndex / steps) * (trigger.end - trigger.start);

          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        };

        window.addEventListener("wheel", handleWheel, { passive: false });

        cards.slice(0, -1).forEach((card, index) => {
          timeline
            .to(card, {
              autoAlpha: 0,
              xPercent: -8,
              duration: 0.28,
              ease: "power2.inOut",
            }, index + 0.72)
            .to(cards[index + 1], {
              autoAlpha: 1,
              xPercent: 0,
              duration: 0.28,
              ease: "power2.inOut",
            }, index + 0.72);
        });

        return () => {
          window.removeEventListener("wheel", handleWheel);
          window.clearTimeout(unlockTimer);
        };
      }
    );

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="what-we-build"
    >
      <div className="what-we-build__intro">
        <p className="what-we-build__eyebrow">
          What We Build
        </p>

        <h2 className="what-we-build__title">
          Digital work built around
          <br />
          real business requirements.
        </h2>
      </div>

      <div className="what-we-build__viewport">
        <div
          ref={trackRef}
          className="what-we-build__track"
        >
        {services.map((service) => (
          <article
            className="service-card"
            key={service.number}
          >
            <div className="service-card__visual-wrap">
              <ServiceVisual type={service.type} />
            </div>

            <div className="service-card__content">
              <div className="service-card__heading">
                <span className="service-card__number">
                  {service.number}
                </span>

                {/* <span className="service-card__category">
                  WebQuad
                </span> */}
              </div>

              <h3 className="service-card__title">
                {service.title}
              </h3>

              <p className="service-card__description">
                {service.description}
              </p>

              <Link
                to="/contact"
                className="service-card__link"
              >
                {service.cta}
              </Link>

              <div className="service-card__details">
                {service.details.map((detail) => (
                  <div
                    className="service-card__detail"
                    key={detail.label}
                  >
                    <span>{detail.label}</span>
                    <strong>{detail.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </article>
          ))}
        </div>
      </div>
    </section>
  );
}