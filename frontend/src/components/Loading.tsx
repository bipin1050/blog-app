import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Loading = () => {
  return (
    <div className="w-[100%] relative h-[80vh]">
      <div className="animate-spin h-12 w-12 absolute top-1/2 left-1/2 transform">
        <FontAwesomeIcon icon={faSpinner} size="3x" />
      </div>
    </div>
  );
};

export default Loading;
