import { useEffect, useMemo, useRef, useState } from "react";
import { geoInterpolate, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import landAtlas from "world-atlas/land-110m.json";
import { mapLayers } from "@data/mapLayers";

const topology = landAtlas;

const land = feature(topology, topology.objects.land);

function densify(coordinates) {
  const points = [];
  for (let i = 0; i < coordinates.length - 1; i++) {
    const interpolate = geoInterpolate(coordinates[i], coordinates[i + 1]);
    for (let step = 0; step < 32; step++) {
      points.push(interpolate(step / 32));
    }
  }
  points.push(coordinates[coordinates.length - 1]);
  return points;
}

function projectRoute(coordinates, projection, width) {
  let d = "";
  let open = false;
  let previous = null;
  for (const point of densify(coordinates)) {
    const next = projection(point);
    if (!next) {
      open = false;
      previous = null;
      continue;
    }
    const jumped =
      previous != null &&
      Math.hypot(next[0] - previous[0], next[1] - previous[1]) > width * 0.28;
    d += `${open && !jumped ? "L" : "M"}${next[0].toFixed(1)} ${next[1].toFixed(1)}`;
    open = true;
    previous = next;
  }
  return d || null;
}

/** Pull shared origins and destinations apart so the arrowheads do not stack. */
function nudgeEndpoints(routes) {
  const lines = new Map(
    routes.map(route => [
      route.id,
      route.coordinates.map(point => [...point]),
    ])
  );
  const shift = atEnd => {
    const groups = new Map();
    for (const route of routes) {
      if (route.people == null) continue;
      const line = lines.get(route.id);
      if (!line) continue;
      const point = line[atEnd ? line.length - 1 : 0];
      const key = `${atEnd ? "e" : "s"}:${point[0].toFixed(1)},${point[1].toFixed(1)}`;
      const group = groups.get(key) ?? [];
      group.push(route.id);
      groups.set(key, group);
    }
    for (const ids of groups.values()) {
      if (ids.length < 2) continue;
      const step = Math.min(0.65, 4.5 / ids.length);
      ids.forEach((id, slot) => {
        const line = lines.get(id);
        if (!line) return;
        const index = atEnd ? line.length - 1 : 0;
        const point = line[index];
        const other = line[atEnd ? 0 : line.length - 1];
        const dx = point[0] - other[0];
        const dy = point[1] - other[1];
        const len = Math.hypot(dx, dy) || 1;
        const offset = (slot - (ids.length - 1) / 2) * step;
        line[index] = [
          point[0] + (-dy / len) * offset,
          point[1] + (dx / len) * offset,
        ];
      });
    }
  };
  shift(false);
  shift(true);
  return lines;
}

function keepTogether(name) {
  return name
    .replaceAll("United States", "United\u00a0States")
    .replaceAll("United Kingdom", "United\u00a0Kingdom")
    .replaceAll("United Arab Emirates", "United\u00a0Arab\u00a0Emirates")
    .replaceAll("South Africa", "South\u00a0Africa")
    .replaceAll("South Korea", "South\u00a0Korea")
    .replaceAll("South Sudan", "South\u00a0Sudan")
    .replaceAll("Saudi Arabia", "Saudi\u00a0Arabia")
    .replaceAll("El Salvador", "El\u00a0Salvador")
    .replaceAll("Puerto Rico", "Puerto\u00a0Rico")
    .replaceAll("Dominican Republic", "Dominican\u00a0Republic")
    .replaceAll("Hong Kong", "Hong\u00a0Kong")
    .replaceAll("Burkina Faso", "Burkina\u00a0Faso")
    .replaceAll("Côte d'Ivoire", "Côte\u00a0d'Ivoire");
}

const minZoom = 1;
const maxZoom = 8;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function clampView(view, size) {
  const k = clamp(view.k, minZoom, maxZoom);
  return {
    k,
    x: clamp(view.x, size.width * (1 - k), 0),
    y: clamp(view.y, size.height * (1 - k), 0),
  };
}

function zoomAt(current, svgX, svgY, nextK, size) {
  const k = clamp(nextK, minZoom, maxZoom);
  const worldX = (svgX - current.x) / current.k;
  const worldY = (svgY - current.y) / current.k;
  return clampView(
    { k, x: svgX - k * worldX, y: svgY - k * worldY },
    size
  );
}

function LayerSwatch({ ink, thick }) {
  return (
    <svg
      width="18"
      height="8"
      viewBox="0 0 18 8"
      aria-hidden="true"
      className="shrink-0"
    >
      <line
        x1="1"
        y1="4"
        x2="17"
        y2="4"
        stroke={
          ink === "text" ? "rgb(var(--color-text-base))" : "rgb(var(--color-accent))"
        }
        strokeWidth={thick ? 2.5 : 1.5}
        strokeLinecap="round"
      />
    </svg>
  );
}

const layerFrames = [
  { ms: 1000, ids: [] },
  { ms: 2400, ids: ["human-migration"] },
  { ms: 2400, ids: ["human-migration", "modern-migration"] },
  {
    ms: 2800,
    ids: ["human-migration", "modern-migration", "africa-europe"],
  },
  { ms: 2000, ids: ["modern-migration", "africa-europe"] },
  { ms: 2000, ids: ["africa-europe"] },
];

function layerVisibility(ids) {
  const on = new Set(ids);
  return Object.fromEntries(
    mapLayers.map(layer => [layer.id, on.has(layer.id)])
  );
}

function everyLayerOn() {
  return layerVisibility(mapLayers.map(layer => layer.id));
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function placeLabel(point, text, width, height, side) {
  if (!point) return null;
  const estimated = text.length * 6.6;
  let x = point[0] + (side === "end" ? 8 : -8);
  let anchor = side === "end" ? "start" : "end";
  if (side === "end" && x + estimated > width - 12) {
    x = point[0] - 8;
    anchor = "end";
  }
  if (side === "start" && x - estimated < 12) {
    x = point[0] + 8;
    anchor = "start";
  }
  let y = point[1] - 10;
  if (y < 18) y = point[1] + 16;
  if (y > height - 8) y = point[1] - 10;
  return { x, y, anchor };
}

export default function WorldMap() {
  const frame = useRef(null);
  const svgRef = useRef(null);
  const viewRef = useRef({ k: 1, x: 0, y: 0 });
  const dragged = useRef(false);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const [size, setSize] = useState({ width: 800, height: 520 });
  const [view, setView] = useState({ k: 1, x: 0, y: 0 });
  viewRef.current = view;
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [enabled, setEnabled] = useState(() =>
    prefersReducedMotion() ? everyLayerOn() : layerVisibility(layerFrames[0].ids)
  );
  const [listId, setListId] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  const [pinnedId, setPinnedId] = useState(null);
  const highlightId = hoverId || pinnedId;
  const nudged = useMemo(
    () => nudgeEndpoints(mapLayers.flatMap(layer => layer.routes)),
    []
  );

  useEffect(() => {
    if (!playing) return;
    let index = 0;
    let timer = 0;
    const step = () => {
      const frame = layerFrames[index];
      setEnabled(layerVisibility(frame.ids));
      index = (index + 1) % layerFrames.length;
      timer = window.setTimeout(step, frame.ms);
    };
    step();
    return () => window.clearTimeout(timer);
  }, [playing]);

  useEffect(() => {
    if (!listId) return;
    const onKey = event => {
      if (event.key === "Escape") setListId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [listId]);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const measure = () => {
      const next = element.getBoundingClientRect();
      if (next.width > 0 && next.height > 0) {
        setSize({ width: next.width, height: next.height });
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = event => {
      event.preventDefault();
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const svgX = ((event.clientX - rect.left) / rect.width) * size.width;
      const svgY = ((event.clientY - rect.top) / rect.height) * size.height;
      const factor = Math.exp(-event.deltaY * 0.0016);
      setView(current => zoomAt(current, svgX, svgY, current.k * factor, size));
    };
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, [size]);

  const projection = useMemo(() => {
    // Greenwich at the center, so the Americas sit on the west.
    const next = geoNaturalEarth1().rotate([0, 0]);
    next.fitExtent(
      [
        [16, 16],
        [Math.max(size.width - 16, 48), Math.max(size.height - 16, 48)],
      ],
      land
    );
    return next;
  }, [size.height, size.width]);

  const outline = geoPath(projection);
  const activeRoutes = mapLayers
    .flatMap(layer =>
      layer.routes.map(route => ({
        layerId: layer.id,
        ink: layer.ink ?? "accent",
        dash: Boolean(layer.dash),
        shown: Boolean(enabled[layer.id]),
        route,
        coordinates: nudged.get(route.id) ?? route.coordinates,
      }))
    )
    .sort((a, b) => {
      const hotA = `${a.layerId}:${a.route.id}` === highlightId;
      const hotB = `${b.layerId}:${b.route.id}` === highlightId;
      if (hotA !== hotB) return hotA ? 1 : -1;
      return (a.route.people ?? -1) - (b.route.people ?? -1);
    });

  const skipIntro = () => {
    setPlaying(false);
    setEnabled(everyLayerOn());
  };

  const toggle = id => {
    setPlaying(false);
    setEnabled(current => ({ ...current, [id]: !current[id] }));
    setHoverId(current => (current?.startsWith(`${id}:`) ? null : current));
    setPinnedId(current => (current?.startsWith(`${id}:`) ? null : current));
  };

  const reservedLabels = new Set();
  const labelBoxes = [];
  const reserveLabel = (id, side, text, point) => {
    if (!point) return;
    const textWidth = text.length * 6.8;
    const box = {
      x: (point.anchor === "end" ? point.x - textWidth : point.x) - 6,
      y: point.y - 14,
      w: textWidth + 12,
      h: 20,
    };
    const crowded = labelBoxes.some(
      other =>
        box.x < other.x + other.w &&
        box.x + box.w > other.x &&
        box.y < other.y + other.h &&
        box.y + box.h > other.y
    );
    if (crowded) return;
    labelBoxes.push(box);
    reservedLabels.add(`${id}:${side}`);
  };
  [...activeRoutes]
    .sort(
      (a, b) =>
        (b.route.people ?? Number.POSITIVE_INFINITY) -
        (a.route.people ?? Number.POSITIVE_INFINITY)
    )
    .forEach(({ route, coordinates, shown }) => {
      if (!shown) return;
      if (route.people != null && route.people < 3_000_000) return;
      if (route.origin) {
        reserveLabel(
          route.id,
          "start",
          route.origin,
          placeLabel(
            projection(coordinates[0]),
            route.origin,
            size.width,
            size.height,
            "start"
          )
        );
      }
      reserveLabel(
        route.id,
        "end",
        route.label,
        placeLabel(
          projection(coordinates[coordinates.length - 1]),
          route.label,
          size.width,
          size.height,
          "end"
        )
      );
    });

  const zoomBy = factor => {
    setView(current =>
      zoomAt(current, size.width / 2, size.height / 2, current.k * factor, size)
    );
  };

  const onPointerDown = event => {
    if (event.button !== 0) return;
    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
    const points = [...pointers.current.values()];
    if (points.length >= 2) {
      for (const id of pointers.current.keys()) {
        event.currentTarget.setPointerCapture(id);
      }
      gesture.current = {
        type: "pinch",
        dist:
          Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) ||
          1,
        view: viewRef.current,
        moved: false,
      };
      return;
    }
    gesture.current = {
      type: "pan",
      x: event.clientX,
      y: event.clientY,
      view: viewRef.current,
      moved: false,
    };
  };

  const onPointerMove = event => {
    const point = pointers.current.get(event.pointerId);
    const active = gesture.current;
    if (!point || !active) return;
    point.x = event.clientX;
    point.y = event.clientY;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const scaleX = size.width / rect.width;
    const scaleY = size.height / rect.height;
    if (active.type === "pinch") {
      const points = [...pointers.current.values()];
      if (points.length < 2) return;
      const dist =
        Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y) || 1;
      const midX = ((points[0].x + points[1].x) / 2 - rect.left) * scaleX;
      const midY = ((points[0].y + points[1].y) / 2 - rect.top) * scaleY;
      active.moved = true;
      setView(
        zoomAt(
          active.view,
          midX,
          midY,
          active.view.k * (dist / active.dist),
          size
        )
      );
      return;
    }
    if (active.view.k === 1) return;
    const dx = (event.clientX - active.x) * scaleX;
    const dy = (event.clientY - active.y) * scaleY;
    if (Math.hypot(dx, dy) <= 3) return;
    active.moved = true;
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    setView(
      clampView(
        { k: active.view.k, x: active.view.x + dx, y: active.view.y + dy },
        size
      )
    );
  };

  const onPointerUp = event => {
    pointers.current.delete(event.pointerId);
    if (gesture.current?.moved) dragged.current = true;
    if (pointers.current.size === 0) {
      gesture.current = null;
      return;
    }
    const remaining = [...pointers.current.values()][0];
    gesture.current = {
      type: "pan",
      x: remaining.x,
      y: remaining.y,
      view: viewRef.current,
      moved: false,
    };
  };

  const onDoubleClick = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const svgX = ((event.clientX - rect.left) / rect.width) * size.width;
    const svgY = ((event.clientY - rect.top) / rect.height) * size.height;
    setView(current => zoomAt(current, svgX, svgY, current.k * 1.8, size));
  };

  const ignoreDraggedClick = event => {
    if (!dragged.current) return false;
    dragged.current = false;
    event.stopPropagation();
    return true;
  };

  const listLayer = mapLayers.find(layer => layer.id === listId) ?? null;

  return (
    <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden">
      <div className="absolute left-3 top-3 z-30 w-[min(20rem,calc(100%-6.5rem))]">
        <div className="border border-skin-accent/30 bg-skin-fill">
          <div className="flex items-center justify-between gap-3 border-b border-skin-accent/25 px-2.5 py-1.5">
            <p className="text-sm text-skin-muted">Layers</p>
            {playing && (
              <button
                type="button"
                className="focus-outline text-sm text-skin-muted hover:text-skin-accent"
                onClick={skipIntro}
              >
                Skip
              </button>
            )}
          </div>
          <ul>
            {mapLayers.map(layer => {
              const on = Boolean(enabled[layer.id]);
              const open = listId === layer.id;
              return (
                <li
                  key={layer.id}
                  className="flex items-center gap-2 border-b border-skin-accent/25 px-2.5 py-1.5 last:border-b-0"
                >
                  <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 shrink-0"
                      style={{ accentColor: "rgb(var(--color-accent))" }}
                      checked={on}
                      onChange={() => toggle(layer.id)}
                    />
                    <LayerSwatch ink={layer.ink} thick={Boolean(layer.dash)} />
                    <span
                      className={`min-w-0 text-sm ${
                        on ? "text-skin-base" : "text-skin-muted"
                      }`}
                    >
                      {layer.title}
                    </span>
                  </label>
                  <span className="shrink-0 text-sm text-skin-muted">
                    {layer.routes.length}
                  </span>
                  <button
                    type="button"
                    className={`focus-outline shrink-0 text-sm hover:text-skin-accent ${
                      open ? "text-skin-accent" : "text-skin-muted"
                    }`}
                    aria-expanded={open}
                    aria-controls="map-layer-routes"
                    onClick={() => {
                      setPlaying(false);
                      setListId(current =>
                        current === layer.id ? null : layer.id
                      );
                    }}
                  >
                    Routes
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        {listLayer && (
          <div
            id="map-layer-routes"
            className="mt-1 max-h-[calc(100dvh-13rem)] overflow-y-auto border border-skin-accent/30 bg-skin-fill px-3 py-3"
          >
            <p className="text-sm leading-relaxed text-skin-muted">
              {listLayer.summary}
            </p>
            <ul
              className={
                listLayer.ink === "text" ? "mt-3 space-y-1.5" : "mt-3 space-y-2"
              }
            >
              {listLayer.routes.map(route => {
                const key = `${listLayer.id}:${route.id}`;
                const hot = highlightId === key;
                const [from, to] = route.name.split(" → ");
                return (
                  <li key={route.id}>
                    <button
                      type="button"
                      aria-pressed={pinnedId === key}
                      className="-mx-1 flex w-[calc(100%+0.5rem)] items-baseline justify-between gap-3 px-1 text-left text-sm"
                      style={
                        hot
                          ? {
                              backgroundColor:
                                "rgba(var(--color-accent), 0.16)",
                            }
                          : undefined
                      }
                      onMouseEnter={() => setHoverId(key)}
                      onMouseLeave={() =>
                        setHoverId(current => (current === key ? null : current))
                      }
                      onFocus={() => setHoverId(key)}
                      onBlur={() =>
                        setHoverId(current => (current === key ? null : current))
                      }
                      onClick={() => {
                        setPlaying(false);
                        setPinnedId(current => (current === key ? null : key));
                      }}
                    >
                      {route.people != null ? (
                        <>
                          <span
                            className={
                              hot ? "text-skin-accent" : "text-skin-base"
                            }
                          >
                            <span>{keepTogether(from)}</span>
                            {" → "}
                            <span>{keepTogether(to)}</span>
                          </span>
                          <span className="shrink-0 text-skin-muted">
                            {route.when}
                          </span>
                        </>
                      ) : (
                        <span>
                          <span
                            className={`block ${
                              hot ? "text-skin-accent" : "text-skin-base"
                            }`}
                          >
                            {route.name}
                          </span>
                          <span className="block text-skin-muted">
                            {route.when}
                          </span>
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div
        ref={frame}
        className="relative h-full w-full"
        onClick={event => {
          if (ignoreDraggedClick(event)) return;
          if (listId) setListId(null);
        }}
      >
        <svg
          ref={svgRef}
          className="h-full w-full"
          viewBox={`0 0 ${size.width} ${size.height}`}
          role="img"
          aria-label="World map. Scroll or pinch to zoom. Drag to move when zoomed."
          style={{
            touchAction: "none",
            cursor: view.k > 1 ? "grab" : "default",
            userSelect: "none",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={event => {
            event.preventDefault();
            onDoubleClick(event);
          }}
        >
          <defs>
            <marker
              id="route-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.2 L 9 5 L 0 8.8 Z" fill="rgb(var(--color-accent))" />
            </marker>
            <marker
              id="corridor-arrow"
              markerUnits="userSpaceOnUse"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth={8 / view.k}
              markerHeight={8 / view.k}
              orient="auto"
            >
              <path d="M 0 1.2 L 9 5 L 0 8.8 Z" fill="rgb(var(--color-text-base))" />
            </marker>
          </defs>
          <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          <path
            d={outline({ type: "Sphere" }) ?? undefined}
            fill="rgb(var(--color-fill))"
            stroke="rgb(var(--color-muted))"
            strokeWidth={1 / view.k}
          />
          <path
            d={outline(land) ?? undefined}
            fill="rgb(var(--color-card))"
            stroke="rgb(var(--color-muted))"
            strokeWidth={0.6 / view.k}
          />
          {activeRoutes.map(({ layerId, ink, dash, shown, route, coordinates }) => {
            const key = `${layerId}:${route.id}`;
            const hot = highlightId === key;
            const showLabel =
              hot || route.people == null || route.people >= 3_000_000;
            const end = showLabel
              ? placeLabel(
                  projection(coordinates[coordinates.length - 1]),
                  route.label,
                  size.width,
                  size.height,
                  "end"
                )
              : null;
            const start =
              showLabel && route.origin
                ? placeLabel(
                    projection(coordinates[0]),
                    route.origin,
                    size.width,
                    size.height,
                    "start"
                  )
                : null;
            const width =
              route.people == null
                ? 1.75
                : dash
                  ? 1.7 + (route.people / 472_734) * 1.2
                  : 0.95 + (route.people / 11_279_561) * 2.7;
            return (
              <g
                key={`${layerId}-${route.id}`}
                style={{
                  opacity: shown ? 1 : 0,
                  transition: "opacity 640ms ease",
                  pointerEvents: shown ? "auto" : "none",
                }}
              >
                <path
                  d={
                    projectRoute(coordinates, projection, size.width) ??
                    undefined
                  }
                  fill="none"
                  stroke={
                    hot || ink !== "text"
                      ? "rgb(var(--color-accent))"
                      : "rgb(var(--color-text-base))"
                  }
                  strokeWidth={(hot ? width + 1.4 : width) / view.k}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity={highlightId && !hot ? 0.22 : 1}
                  style={{ cursor: "pointer" }}
                  markerEnd={
                    hot || route.people == null
                      ? "url(#route-arrow)"
                      : "url(#corridor-arrow)"
                  }
                  onMouseEnter={() => {
                    if (playing) return;
                    setHoverId(key);
                  }}
                  onMouseLeave={() =>
                    setHoverId(current => (current === key ? null : current))
                  }
                  onClick={event => {
                    if (ignoreDraggedClick(event)) return;
                    event.stopPropagation();
                    if (event.detail > 1) return;
                    setPlaying(false);
                    setPinnedId(current => (current === key ? null : key));
                  }}
                >
                  <title>
                    {route.people != null
                      ? `${route.name}, ${route.when}`
                      : `${route.name}. ${route.when}`}
                  </title>
                </path>
                {start && (hot || reservedLabels.has(`${route.id}:start`)) && (
                  <text
                    x={start.x}
                    y={start.y}
                    textAnchor={start.anchor}
                    fill={
                      hot
                        ? "rgb(var(--color-accent))"
                        : "rgb(var(--color-text-base))"
                    }
                    fontSize={13 / Math.sqrt(view.k)}
                    fontFamily="IBM Plex Sans, sans-serif"
                  >
                    {route.origin}
                  </text>
                )}
                {end && (hot || reservedLabels.has(`${route.id}:end`)) && (
                  <text
                    x={end.x}
                    y={end.y}
                    textAnchor={end.anchor}
                    fill={
                      hot
                        ? "rgb(var(--color-accent))"
                        : "rgb(var(--color-text-base))"
                    }
                    fontSize={13 / Math.sqrt(view.k)}
                    fontFamily="IBM Plex Sans, sans-serif"
                  >
                    {route.label}
                  </text>
                )}
              </g>
            );
          })}
          </g>
        </svg>
        <div
          className="absolute bottom-3 right-3 z-30 flex flex-col gap-1"
          onClick={event => event.stopPropagation()}
        >
          <button
            type="button"
            className="focus-outline border border-skin-accent/30 bg-skin-fill/90 px-2.5 py-1 text-sm text-skin-muted hover:text-skin-accent disabled:opacity-40"
            aria-label="Zoom in"
            disabled={view.k >= maxZoom}
            onClick={() => zoomBy(1.4)}
          >
            +
          </button>
          <button
            type="button"
            className="focus-outline border border-skin-accent/30 bg-skin-fill/90 px-2.5 py-1 text-sm text-skin-muted hover:text-skin-accent disabled:opacity-40"
            aria-label="Zoom out"
            disabled={view.k <= minZoom}
            onClick={() => zoomBy(1 / 1.4)}
          >
            −
          </button>
          <button
            type="button"
            className="focus-outline border border-skin-accent/30 bg-skin-fill/90 px-2.5 py-1 text-sm text-skin-muted hover:text-skin-accent disabled:opacity-40"
            aria-label="Reset zoom"
            disabled={view.k === 1}
            onClick={() => setView({ k: 1, x: 0, y: 0 })}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
