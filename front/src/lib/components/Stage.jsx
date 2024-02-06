// @ts-check
import SeatImg from "$/assets/seat.svg?react";
import { useMemo } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

/** @type {[string[], string[], string[]][]} */
const seatArrangement = [
  [[],["K1","K2","K3","K4","K5","K6","K7","K8","K9","K10"],[]], // prettier-ignore
  [["J1","J2","J3"],["J4","J5","J6","J7","J8","J9","J10","J11","J12","J13","J14"],["J15","J16","J17"]], // prettier-ignore
  [["I1","I2","I3","I4"],["I5","I6","I7","I8","I9","I10","I11","I12","I13","I14","I15","I16","I17","I18","I19","I20","I21"],["I22","I23","I24","I25"]], // prettier-ignore
  [["H1","H2","H3","H4","H5"],["H6","H7","H8","H9","H10","H11","H12","H13","H14","H15","H16","H17","H18","H19","H20","H21"],["H22","H23","H24","H25","H26"]], // prettier-ignore
  [["G1","G2","G3","G4","G5"],["G6","G7","G8","G9","G10","G11","G12","G13","G14","G15","G16","G17","G18","G19","G20"],["G21","G22","G23","G24","G25"]], // prettier-ignore
  [["F1","F2","F3","F4","F5","F6"],["F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20"],["F21","F22","F23","F24","F25","F26"]], // prettier-ignore
  [["E1","E2","E3","E4","E5"],["E6","E7","E8","E9","E10","E11","E12","E13","E14","E15","E16","E17","E18"],["E19","E20","E21","E22","E23"]], // prettier-ignore
  [["D1","D2","D3","D4","D5"],["D6","D7","D8","D9","D10","D11","D12","D13","D14","D15","D16","D17"],["D18","D19","D20","D21","D22"]], // prettier-ignore
  [["C1","C2","C3","C4","C5"],["C6","C7","C8","C9","C10","C11","C12","C13","C14","C15","C16"],["C17","C18","C19","C20","C21"]], // prettier-ignore
  [["B1","B2","B3","B4","B5"],["B6","B7","B8","B9","B10","B11","B12","B13","B14","B15"],["B16","B17","B18","B19","B20"]], // prettier-ignore
  [["A1","A2","A3","A4"],["A5","A6","A7","A8","A9","A10","A11","A12","A13"],["A14","A15","A16","A17"]], // prettier-ignore
];

function Spacer({ seats }) {
  return (
    <div
      style={{
        display: "inline-block",
        width: `calc(2rem * ${seats})`,
        height: "2rem",
      }}
    />
  );
}

/**
 *
 * @param {{ seat: string; onSelect: (seat: string) => void; color?: "black" | "white" | "gold" | "gray" | "darkgray"; disabled?: boolean; readOnly?: boolean }} props
 * @returns
 */
function Seat({
  seat,
  onSelect,
  color = "white",
  disabled = false,
  readOnly = false,
}) {
  return (
    <OverlayTrigger overlay={<Tooltip>{seat}</Tooltip>}>
      <div
        role={!disabled && !readOnly ? "button" : undefined}
        aria-disabled={disabled}
        style={{
          width: "2rem",
          height: "2rem",
          padding: 0,
          display: "inline-block",
        }}
        onClick={
          !disabled && !readOnly && onSelect ? () => onSelect(seat) : undefined
        }
        onKeyDown={
          !disabled && !readOnly && onSelect
            ? (e) =>
                e.key === "Enter" || e.key === " " ? onSelect(seat) : undefined
            : undefined
        }
        tabIndex={!disabled && !readOnly ? 1 : -1}
      >
        <SeatImg
          width="100%"
          height="100%"
          stroke="black"
          fill={
            color === "gold"
              ? "#CC9865"
              : color === "gray"
              ? "gray"
              : color === "black"
              ? "#1f1f1f"
              : color === "darkgray"
              ? "#3f3f3f"
              : "white"
          }
        />
      </div>
    </OverlayTrigger>
  );
}

export default function Stage({
  selected,
  taken,
  extraBlocked,
  progressiveUnblock = false,
  onSelect = undefined,
  readOnly = false,
  canSelectTaken = false,
}) {
  const blockedFromRow = useMemo(() => {
    if (progressiveUnblock) {
      let lastReservedRow =
        taken
          .map((s) => s[0])
          .sort()
          .reverse()[0] ?? "A";
      if (lastReservedRow < "C") lastReservedRow = "C";

      let totalSeats = 0;
      let takenSeats = 0;
      for (const row of seatArrangement) {
        for (const side of row) {
          for (const seat of side) {
            if (seat[0] <= lastReservedRow) {
              totalSeats += 1;
              if (taken.includes(seat)) {
                takenSeats += 1;
              }
            }
          }
        }
      }

      let blockedRow;
      if (takenSeats / totalSeats < 0.6) {
        if (lastReservedRow <= "C") {
          blockedRow = "G";
        } else {
          blockedRow = String.fromCharCode(lastReservedRow.charCodeAt(0) + 1);
        }
      } else {
        if (lastReservedRow <= "C") {
          blockedRow = "H";
        } else {
          blockedRow = String.fromCharCode(lastReservedRow.charCodeAt(0) + 2);
        }
      }

      if (blockedRow > "L") {
        return "L";
      } else {
        return blockedRow;
      }
    }
    return "L";
  }, [progressiveUnblock, taken]);

  return (
    <div className="overflow-x-auto pt-4">
      <div
        style={{
          minWidth: "calc(2rem * 17 + 2rem * 4 * 4)",
          minHeight: "calc(2rem * 15)",
        }}
      >
        {seatArrangement.map((r, i) => (
          <div
            key={i}
            style={{
              height: "2rem",
              display: "flex",
              justifyContent: "center",
            }}
            className="mb-1"
          >
            <div
              style={{
                transformOrigin: "right",
                transform: "translate(calc(2rem * -2)) rotate(-30deg)",
                display: "inline-flex",
              }}
            >
              {r[0].map((c) => (
                <Seat
                  key={c}
                  seat={c}
                  color={
                    c === selected
                      ? "gold"
                      : taken.includes(c)
                      ? "gray"
                      : extraBlocked.includes(c)
                      ? "black"
                      : c >= blockedFromRow
                      ? "darkgray"
                      : "white"
                  }
                  onSelect={onSelect}
                  disabled={
                    !canSelectTaken &&
                    (taken.includes(c) ||
                      extraBlocked.includes(c) ||
                      c >= blockedFromRow)
                  }
                  readOnly={readOnly}
                />
              ))}
            </div>
            <div
              style={{
                display: "inline-flex",
              }}
            >
              {i === 1 ? <Spacer seats={3.5} /> : null}
              {r[1].map((c) => (
                <Seat
                  key={c}
                  seat={c}
                  color={
                    c === selected
                      ? "gold"
                      : taken.includes(c)
                      ? "gray"
                      : extraBlocked.includes(c)
                      ? "black"
                      : c >= blockedFromRow
                      ? "darkgray"
                      : "white"
                  }
                  onSelect={onSelect}
                  disabled={
                    !canSelectTaken &&
                    (taken.includes(c) ||
                      extraBlocked.includes(c) ||
                      c >= blockedFromRow)
                  }
                  readOnly={readOnly}
                />
              ))}
              {i === 1 ? <Spacer seats={3.5} /> : null}
            </div>
            <div
              style={{
                transformOrigin: "left",
                transform: "translate(calc(2rem * 2)) rotate(30deg)",
                display: "inline-flex",
              }}
            >
              {r[2].map((c) => (
                <Seat
                  key={c}
                  seat={c}
                  color={
                    c === selected
                      ? "gold"
                      : taken.includes(c)
                      ? "gray"
                      : extraBlocked.includes(c)
                      ? "black"
                      : c >= blockedFromRow
                      ? "darkgray"
                      : "white"
                  }
                  onSelect={onSelect}
                  disabled={
                    !canSelectTaken &&
                    (taken.includes(c) ||
                      extraBlocked.includes(c) ||
                      c >= blockedFromRow)
                  }
                  readOnly={readOnly}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
