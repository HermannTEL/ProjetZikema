import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const getColor = (percent) => {
  if (percent < 40) return "#ef4444";    // rouge
  if (percent < 70) return "#f59e0b";    // orange
  return "#10b981";                      // vert
};

const CircularProgress = ({ value }) => {
  const color = getColor(value);

  return (
    <div className="w-24 h-24">
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          pathColor: color,
          textColor: "#111827",          // texte sombre (mode clair)
          trailColor: "#e5e7eb",
          textSize: "16px",
        })}
      />
    </div>
  );
};

export default CircularProgress;
