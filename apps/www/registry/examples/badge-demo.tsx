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
                <Badge className="palette-success">Success</Badge>
                <Badge className="palette-warning">Warning</Badge>
                <Badge className="palette-brand">Brand</Badge>
            </div>

            {/* solid variant with palette classes */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge variant="solid" className="palette-danger">
                    Error
                </Badge>
                <Badge variant="solid" className="palette-success">
                    Success
                </Badge>
                <Badge variant="solid" className="palette-warning">
                    Warning
                </Badge>
            </div>

            {/* outline variant with palette classes */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="palette-danger">
                    Error
                </Badge>
                <Badge variant="outline" className="palette-success">
                    Success
                </Badge>
            </div>

            {/* with icon */}
            <div className="flex flex-wrap items-center gap-3">
                <Badge className="palette-success">
                    <CheckIcon />
                    Verified
                </Badge>
            </div>
        </div>
    );
}
