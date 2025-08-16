interface LoadingIndicatorProps {
  message?: string;
}

export default function LoadingIndicator({
  message = "Loading...",
}: LoadingIndicatorProps) {
  return <h1 className="loading">{message}</h1>;
}
