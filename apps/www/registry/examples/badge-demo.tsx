"use client";
import { CheckIcon } from "lucide-react";
import { Badge } from "#/atoms/badge";

export default function BadgeDemo() {
    return (
        <div className="flex flex-col gap-6">
            {/* variant × palette matrix */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge>Default</Badge>
                <Badge variant="solid">Solid</Badge>
                <Badge variant="outline">Outline</Badge>
            </div>

            {/* tone by palette class — no tone prop, no variant="destructive" */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge className="palette-danger">Error</Badge>
                <Badge className="palette-green">Green</Badge>
                <Badge className="palette-orange">Orange</Badge>
                <Badge className="palette-blue">Blue</Badge>
            </div>

            {/* solid variant with palette classes */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge variant="solid" className="palette-danger">
                    Error
                </Badge>
                <Badge variant="solid" className="palette-green">
                    Green
                </Badge>
                <Badge variant="solid" className="palette-orange">
                    Orange
                </Badge>
            </div>

            {/* outline variant with palette classes */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="palette-danger">
                    Error
                </Badge>
                <Badge variant="outline" className="palette-green">
                    Green
                </Badge>
            </div>

            {/* with icon */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge className="palette-green">
                    <CheckIcon />
                    Verified
                </Badge>
            </div>
        </div>
    );
}
