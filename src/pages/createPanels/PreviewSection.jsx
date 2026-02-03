export default function PreviewSection({
  previewRef,
  isLandscape,
  renderPreview,
  template,
  previewData,
}) {
    const previewScale = isLandscape ? 0.54 : 0.75;
  return (

<section className="md:h-[calc(100vh-6rem)] md:sticky md:top-20 flex flex-col">
        <div className="flex-1 overflow-auto flex items-start justify-center">
          {/* <div className="origin-top scale-[0.75]"> */}
          <div
            className="origin-top"
            style={{ transform: `scale(${previewScale})` }}
          >
            <div
              ref={previewRef}
              className="bg-white rounded-xl shadow-card"
              // style={{ width: 900, minHeight: 1273 }}
              style={
                  isLandscape
                    ? { width: 1273, height: 716 }   // 16:9  716  1273
                    : { width: 900, minHeight: 1273 } // باقي القوالب
                }
            >
              {renderPreview(template, previewData)}
            </div>
          </div>
        </div>
      </section>
        );
}