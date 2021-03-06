// @flow
import React from "react";

type Props = {
    width: ?number,
    height: ?number,
};

const Bot = ({ width, height }: Props) => {

    const ratio = 420/400;

    if(!width && !height) {
        height = 100;
        width = height * ratio;
    } else if(width) {
        height = width * (1/ratio);
    } else if(height) {
        width = height * ratio;
    }

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 420 400"
        >
            <g fill="none">
                <g transform="translate(1 1)">
                    <polygon
                        transform="translate(209.232434 198.991869)scale(-1 1)rotate(-180)translate(-209.232434 -198.991869)"
                        points="209.2 0 418.5 152 338.5 398 79.9 398 0 152"
                        fill="#D8D8D8"
                    />
                    <polygon
                        points="209 397.8 209.2 398 418.5 246 338.5 0 209 0"
                        fill="#818181"
                    />
                    <polygon
                        points="242.1 147 328.9 147 318.9 79 209.7 91.5 98 79 88 147 174.1 147 174.1 299.9 209.4 292 242.1 299.9"
                        fill="#222"
                    />
                    <path
                        d="M167.4 86.7L209.2 91.4 248.7 86.9C250.5 91.7 251.5 96.9 251.5 102.4 251.5 126.4 232 145.9 208 145.9 184 145.9 164.5 126.4 164.5 102.4 164.5 96.9 165.5 91.6 167.4 86.7Z"
                        fill="#F00"
                    />
                </g>
            </g>
        </svg>
    );
};

export default Bot;
