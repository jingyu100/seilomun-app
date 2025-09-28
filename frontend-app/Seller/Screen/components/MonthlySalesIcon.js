// Seller/Screen/components/MonthlySalesIcon.js
import React from "react";
import Svg, { G, Line, Rect, Polyline, Path, Circle } from "react-native-svg";

export default function MonthlySalesIcon({
                                             size = 120,        // 아이콘 크기
                                             color = "#222",    // 선 색상
                                             strokeWidth = 3,   // 선 굵기
                                         }) {
    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 128 128"
            fill="none"
        >
            <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
                {/* 바닥면 점선 */}
                <Line x1="8" y1="106" x2="120" y2="106" strokeDasharray="4 6" />

                {/* 좌측 작은 점들 */}
                <Circle cx="14" cy="106" r="2.5" fill={color} />
                <Circle cx="24" cy="106" r="2.5" fill={color} />
                <Circle cx="34" cy="106" r="2.5" fill={color} />

                {/* 4개의 막대 (아웃라인) */}
                <Rect x="18"  y="72" width="14" height="34" rx="2" />
                <Rect x="40"  y="60" width="14" height="46" rx="2" />
                <Rect x="62"  y="46" width="14" height="60" rx="2" />
                <Rect x="84"  y="26" width="14" height="80" rx="2" />

                {/* 상승 라인 */}
                <Polyline points="12,84 38,64 60,74 80,48 100,28" />

                {/* 화살표 머리 */}
                <Path d="M100 28 L96 34" />
                <Path d="M100 28 L93 28" />
            </G>
        </Svg>
    );
}
