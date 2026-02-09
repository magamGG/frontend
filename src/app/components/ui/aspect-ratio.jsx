"use client";

import * as Radix-uiReact-aspect-ratioPrimitive from "@radix-ui/react-aspect-ratio";

function AspectRatio({
  ...props
}) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />;
}

export { AspectRatio };
