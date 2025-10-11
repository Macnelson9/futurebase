export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 border-2 border-primary/20 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        </div>
        {/* Inner ring */}
        <div className="absolute inset-2 border border-primary/40 rounded-full animate-ping"></div>
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export const LoadingText = ({
  text = "Loading...",
  className,
}: {
  text?: string;
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      <LoadingSpinner />
      <div className="font-mono text-primary animate-pulse">
        [{text.toUpperCase()}]
      </div>
    </div>
  );
};

export const PageLoading = ({ className }: { className?: string }) => {
  return (
    <div
      className={`min-h-screen bg-background flex items-center justify-center ${className}`}
    >
      <LoadingText text="Initializing FutureBase..." />
    </div>
  );
};
