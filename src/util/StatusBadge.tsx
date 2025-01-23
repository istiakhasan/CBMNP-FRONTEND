const getStatusStyle = (label:string) => {
    switch (label) {
      case "Pending":
        return { bgColor: "#FFC107", textColor: "black" };
      case "Approved":
        return { bgColor: "#4CAF50", textColor: "white" };
      case "In-Progress":
        return { bgColor: "#2196F3", textColor: "white" };
      case "Cancel":
        return { bgColor: "#F44336", textColor: "white" };
      case "Store":
        return { bgColor: "#FF9800", textColor: "white" };
      case "Hold":
        return { bgColor: "#9C27B0", textColor: "white" };
      case "Packing":
        return { bgColor: "#3F51B5", textColor: "white" };
      case "Delivered":
        return { bgColor: "#009688", textColor: "white" };
      case "In-transit":
        return { bgColor: "#00BCD4", textColor: "white" };
      case "Unreachable":
        return { bgColor: "#795548", textColor: "white" };
      default:
        return { bgColor: "white", textColor: "black", isBordered: true };
    }
  };
  
  const StatusBadge = ({ status }:{status:{label:string}}) => {
    const { bgColor, textColor, isBordered } = getStatusStyle(status?.label);
    const borderClass = isBordered ? "border" : "";
  
    return (
      <span
        className={`${borderClass} font-semibold text-[10px] px-2 py-[1px] w-[90px] text-center block`}
        style={{ backgroundColor: bgColor, color: textColor }}
      >
        {status?.label || "N/A"}
      </span>
    );
  };

  export default StatusBadge
  
  