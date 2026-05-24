/**
 * Side-view car silhouettes per body type.
 * Used on the BrandModels page to give a clean, uniform catalog look
 * (similar to automobile.tn / partsouq schematic listings).
 */

const Sedan = ({ color = "#0F172A", className = "" }) => (
  <svg viewBox="0 0 200 80" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M14 56c0-2 1-3 3-3l8-2 14-16c4-5 9-7 16-7h54c8 0 13 1 19 5l18 12 26 4c5 1 8 4 8 9v6c0 3-2 5-5 5h-9a14 14 0 0 0-28 0H66a14 14 0 0 0-28 0h-18c-3 0-6-2-6-5v-8zm44-26-9 12h50V30H58zm60 0v12h40l-16-10c-3-2-5-2-8-2h-16z" />
    <circle cx="52" cy="63" r="9" fill={color} />
    <circle cx="52" cy="63" r="4" fill="white" />
    <circle cx="148" cy="63" r="9" fill={color} />
    <circle cx="148" cy="63" r="4" fill="white" />
  </svg>
);

const Hatchback = ({ color = "#0F172A", className = "" }) => (
  <svg viewBox="0 0 200 80" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M14 56c0-2 1-3 3-3l8-2 12-18c3-5 8-7 14-7h58c6 0 11 2 15 5l22 18 26 4c5 1 8 4 8 9v6c0 3-2 5-5 5h-9a14 14 0 0 0-28 0H66a14 14 0 0 0-28 0h-18c-3 0-6-2-6-5v-8zM50 30l-10 14h54V30H50zm60 0v14h42l-18-12c-3-2-5-2-8-2h-16z" />
    <circle cx="52" cy="63" r="9" fill={color} />
    <circle cx="52" cy="63" r="4" fill="white" />
    <circle cx="148" cy="63" r="9" fill={color} />
    <circle cx="148" cy="63" r="4" fill="white" />
  </svg>
);

const Suv = ({ color = "#0F172A", className = "" }) => (
  <svg viewBox="0 0 200 80" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 58c0-2 1-3 3-3l8-2 8-22c2-5 6-7 12-7h70c6 0 10 1 14 4l22 16 28 6c5 1 8 4 8 9v6c0 3-2 5-5 5h-9a14 14 0 0 0-28 0H64a14 14 0 0 0-28 0H17c-3 0-6-2-6-5v-7zm38-30-7 18h50V28H50zm60 0v18h44l-22-15c-3-2-5-3-8-3h-14z" />
    <circle cx="50" cy="63" r="10" fill={color} />
    <circle cx="50" cy="63" r="5" fill="white" />
    <circle cx="150" cy="63" r="10" fill={color} />
    <circle cx="150" cy="63" r="5" fill="white" />
  </svg>
);

const Van = ({ color = "#0F172A", className = "" }) => (
  <svg viewBox="0 0 200 80" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M10 62c0-3 2-4 4-4l4-1V22c0-3 2-5 5-5h130c4 0 8 2 11 5l24 22 6 2c3 1 5 3 5 6v8c0 3-2 5-5 5h-9a14 14 0 0 0-28 0H62a14 14 0 0 0-28 0H15c-3 0-5-2-5-5v-7zm20-38v22h60V24H30zm68 0v22h72L150 25c-2-1-3-1-5-1H98z" />
    <circle cx="48" cy="63" r="9" fill={color} />
    <circle cx="48" cy="63" r="4" fill="white" />
    <circle cx="152" cy="63" r="9" fill={color} />
    <circle cx="152" cy="63" r="4" fill="white" />
  </svg>
);

const Coupe = ({ color = "#0F172A", className = "" }) => (
  <svg viewBox="0 0 200 80" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M14 58c0-2 1-3 3-3l8-2 18-18c5-5 12-7 20-7h44c8 0 13 2 19 6l16 11 26 4c5 1 8 4 8 9v5c0 3-2 5-5 5h-9a14 14 0 0 0-28 0H66a14 14 0 0 0-28 0H20c-3 0-6-2-6-5v-5zm46-28-12 14h52V28H64a8 8 0 0 0-4 2zm56-2v16h44l-16-12c-4-3-7-4-12-4h-16z" />
    <circle cx="52" cy="63" r="9" fill={color} />
    <circle cx="52" cy="63" r="4" fill="white" />
    <circle cx="148" cy="63" r="9" fill={color} />
    <circle cx="148" cy="63" r="4" fill="white" />
  </svg>
);

const SILHOUETTES = {
  sedan: Sedan,
  hatchback: Hatchback,
  suv: Suv,
  van: Van,
  coupe: Coupe,
};

export default function ModelSilhouette({ kind = "sedan", color, className }) {
  const Comp = SILHOUETTES[kind] || Sedan;
  return <Comp color={color} className={className} />;
}
