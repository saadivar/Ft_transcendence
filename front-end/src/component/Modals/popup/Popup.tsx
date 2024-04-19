import { FC, ReactNode, useRef } from "react";
import "./Popup.css";

interface Props {
  children: ReactNode;
  tooltip?: string;
}

const Popup: FC<Props> = ({ children, tooltip }): JSX.Element => {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const container = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={container}
      onMouseEnter={({ clientX }) => {
        if (!tooltipRef.current || !container.current) return;
        const { left } = container.current.getBoundingClientRect();

        tooltipRef.current.style.left = clientX - left + "px";
      }}
      className="group relative inline-block"
    >
      {children}
      {tooltip ? (
        <span
          ref={tooltipRef}
          className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition tooltip"
        >
          {tooltip}
        </span>
      ) : null}
    </div>
  );
};

export default Popup;
