/**
 * NetworkNode — one seat on the membership map.
 *
 * The seat is its Circle's own coin: driver for Inner, tractor-trailer for
 * Convoy, shield for Founders. An earned seat shows the coin as it is; an
 * unearned one shows a pre-baked unlit cut of the same coin — desaturated and
 * dimmed, so the difference survives being read in greyscale and a seat never
 * moves or changes size as it fills.
 *
 * Three nested groups, each doing exactly one job, because they animate on
 * different clocks and would otherwise fight over `transform`:
 *
 *   translate  where the seat sits on its orbit        (SVG attribute)
 *   .nm-seat   hover / active lift                     (CSS transition)
 *   .nm-upright counter-rotation keeping the coin level (CSS animation)
 *
 * The lift sits outside the counter-rotation: uniform scale and rotation
 * commute, so the two compose without the seat wobbling as it grows.
 */
import React from "react";

import innerSeat from "@/assets/founders/seats/inner.png";
import convoySeat from "@/assets/founders/seats/convoy.png";
import foundersSeat from "@/assets/founders/seats/founders.png";
import innerSeatOff from "@/assets/founders/seats/inner-off.png";
import convoySeatOff from "@/assets/founders/seats/convoy-off.png";
import foundersSeatOff from "@/assets/founders/seats/founders-off.png";

const SEAT_ART = {
  inner: { on: innerSeat, off: innerSeatOff },
  convoy: { on: convoySeat, off: convoySeatOff },
  founders: { on: foundersSeat, off: foundersSeatOff },
};

export default function NetworkNode({
  x,
  y,
  r,
  kind,
  lit,
  period,
  reverse = false,
  paused = false,
  active = false,
  onActivate,
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      onMouseEnter={onActivate ? () => onActivate(kind) : undefined}
    >
      <g className={`nm-seat${active ? " nm-seat--active" : ""}`}>
        <g
          className={`nm-upright${reverse ? " nm-upright--rev" : ""}`}
          style={{ "--nm-period": period, animationPlayState: paused ? "paused" : "running" }}
        >
          {/* Squares up the bounding box. Both CSS transforms above resolve
              their origin against it, and the contact shadow below hangs low
              enough to drag that box's centre off the coin's — which would
              turn the counter-rotation into a slow wobble and make the hover
              lift grow off-centre. Geometry counts toward the box whether or
              not it is painted, so an unpainted symmetric circle fixes both.
              It must stay the widest thing in the group. */}
          <circle r={r * 1.15} fill="none" />

          {/* contact shadow — keeps the coin seated in the dial rather than
              floating above it */}
          <ellipse cx="0" cy={r * 0.34} rx={r * 0.94} ry={r * 0.8} fill="rgba(0,0,0,0.5)" />

          {/* the orbit line would otherwise show through the coin's rim */}
          <circle r={r - 0.5} fill="#0B0D0F" />

          <image
            href={lit ? SEAT_ART[kind].on : SEAT_ART[kind].off}
            x={-r}
            y={-r}
            width={r * 2}
            height={r * 2}
          />
        </g>
      </g>
    </g>
  );
}
