export default function Datetime({ datetime, size = "sm", className }) {
  return (
    <div
      className={`text-skin-muted ${size === "sm" ? "text-sm" : "text-base"} ${
        className ?? ""
      }`}
    >
      <span className="sr-only">Posted on:</span>
      <FormattedDatetime datetime={datetime} showTime={size === "lg"} />
    </div>
  );
}

const FormattedDatetime = ({ datetime, showTime }) => {
  const myDatetime = new Date(datetime);

  const date = myDatetime.toLocaleDateString([], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = myDatetime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {date}
      {showTime && (
        <>
          <span aria-hidden="true">, </span>
          <span className="sr-only">&nbsp;at&nbsp;</span>
          {time}
        </>
      )}
    </>
  );
};
