import { Fragment, type ElementType, type HTMLAttributes } from "react";

interface SplitWordsProps extends HTMLAttributes<HTMLElement> {
    text?: string;
    lines?: string[];
    as?: ElementType;
}

// Keeps one unsplit accessible name; the per-word spans are decorative.
export default function SplitWords({ text = "", lines, as: Tag = "span", className, ...rest }: SplitWordsProps) {
    const rows = lines ?? [text];
    return (
        <Tag className={className} data-split {...rest}>
            <span className="sr-only">{rows.join(" ")}</span>
            {rows.map((row, rowIndex) => (
                <span key={rowIndex} className={lines ? "split-line" : undefined} aria-hidden="true">
                    {row.split(" ").map((word, index, words) => (
                        <Fragment key={index}>
                            <span className="split-word">
                                <span className="split-inner">{word}</span>
                            </span>
                            {index < words.length - 1 ? " " : ""}
                        </Fragment>
                    ))}
                </span>
            ))}
        </Tag>
    );
}
