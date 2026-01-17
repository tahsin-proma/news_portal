const Loading = () => (
  <div className="flex justify-center items-center" style={{ height: "50vh", width: "100%" }}>
    <div className="spinner"></div>
    <style>{`
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--border-color);
        border-top: 4px solid var(--accent-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);
export default Loading;
