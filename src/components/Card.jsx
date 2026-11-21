import Datetime from "./Datetime";

export default function Card({ href, frontmatter, secHeading = true }) {
  const { title, pubDatetime, description } = frontmatter;
  const Title = secHeading ? "h2" : "h3";
  return (
    <li className="border-b border-skin-line">
      <a href={href} className="block py-6">
        <Title className="text-xl font-medium leading-snug tracking-tight text-skin-accent hover:underline hover:underline-offset-4">
          {title}
        </Title>
        <Datetime datetime={pubDatetime} className="mt-1" />
        <p className="mt-2 text-base leading-relaxed text-skin-muted">
          {description}
        </p>
      </a>
    </li>
  );
}
