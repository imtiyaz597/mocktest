import React from "react";
import Lottie from "lottie-react";

const animationData = {
  v: "4.6.8",
  fr: 29.9700012207031,
  ip: 0,
  op: 40.0000016292334,
  w: 256,
  h: 256,
  nm: "Comp 1",
  ddd: 0,
  assets: [],
  layers: [
    // ⏬ For brevity, I only show the start.
    // You will need to paste your entire JSON here (the one you gave me)
    // Due to space, I truncated it below.
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Shape Layer 3",
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            {
              i: { x: 0.667, y: 1 },
              o: { x: 0.333, y: 0 },
              n: "0p667_1_0p333_0",
              t: 20,
              s: [208.6, 127.969, 0],
              e: [208.6, 88, 0],
              to: [0, -6.66145849227905, 0],
              ti: [0, -0.00520833348855, 0],
            },
            // ... continue with your full JSON
          ],
        },
        a: { a: 0, k: [-70, -0.5, 0] },
        s: { a: 0, k: [75, 75, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            { d: 1, ty: "el", s: { a: 0, k: [33.75, 34.5] }, p: { a: 0, k: [0, 0] }, nm: "Ellipse Path 1", mn: "ADBE Vector Shape - Ellipse" },
            { ty: "fl", c: { a: 0, k: [0.9843137, 0.5490196, 0, 1] }, o: { a: 0, k: 100 }, r: 1, nm: "Fill 1", mn: "ADBE Vector Graphic - Fill" },
            { ty: "tr", p: { a: 0, k: [-70.125, -0.5], ix: 2 }, a: { a: 0, k: [0, 0], ix: 1 }, s: { a: 0, k: [100, 100], ix: 3 }, r: { a: 0, k: 0, ix: 6 }, o: { a: 0, k: 100, ix: 7 }, sk: { a: 0, k: 0, ix: 4 }, sa: { a: 0, k: 0, ix: 5 }, nm: "Transform" },
          ],
          nm: "Ellipse 1",
          np: 3,
          cix: 2,
          ix: 1,
          mn: "ADBE Vector Group",
        },
      ],
      ip: 0,
      op: 300.00001221925,
      st: 0,
      bm: 0,
      sr: 1,
    },
    // ✅ Paste the rest of your JSON here
  ],
};

const LoadingAnimation = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "150px" }}>
      <Lottie animationData={animationData} loop={true} style={{ width: "100px", height: "100px" }} />
    </div>
  );
};

export default LoadingAnimation;
