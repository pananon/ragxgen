"use client";

import { Icon as Iconify, addCollection } from "@iconify/react";
import solar from "@/data/solar-icons.json";
import logos from "@/data/logo-icons.json";

// Solar icons by 480 Design (CC BY 4.0) and the GitHub mark from Iconify's SVG Logos,
// bundled locally so no icon API calls are made.
addCollection(solar);
addCollection(logos);

interface IconProps {
    name: string;
    size?: number;
    className?: string;
    label?: string;
}

export default function Icon({ name, size = 18, className, label }: IconProps) {
    const icon = name.includes(":") ? name : `solar:${name}`;
    return (
        <Iconify
            icon={icon}
            width={size}
            height={size}
            className={className}
            aria-hidden={label ? undefined : true}
            aria-label={label}
            role={label ? "img" : undefined}
        />
    );
}
