import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

// Initialize Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: "dcjhugzvs", // Replace with your actual cloud name if different
  },
});

const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (e) {
    console.error("Error extracting public ID", e);
    return null;
  }
};

const InspectionEvidenceDetails = ({ inspection }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Evidence</h3>
      {inspection.evidenceUrl ? (
        <div className="w-full max-w-3xl mx-auto overflow-hidden rounded-md border shadow-sm">
          <AspectRatio ratio={16 / 9}>
            {/* Fallback to standard img if public ID extraction fails or for simplicity until configured */}
            {(() => {
              const publicId = getPublicIdFromUrl(inspection.evidenceUrl);
              if (publicId) {
                const myImage = cld.image(publicId);
                return (
                  <AdvancedImage
                    cldImg={myImage}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                );
              }
              return (
                <img
                  src={inspection.evidenceUrl}
                  alt="Evidence"
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              );
            })()}
          </AspectRatio>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No evidence photo uploaded.
        </p>
      )}
    </div>
  );
};

export default InspectionEvidenceDetails;
