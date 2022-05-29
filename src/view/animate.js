import { bounceOut } from "svelte/easing";

/**
 * @typedef {import('svelte/animate').AnimationConfig} AnimationConfig
 * @typedef {import('svelte/animate').FlipParams} FlipParams
 * A vertical translate animation directive
 * @param {Element} node DOM node to animate
 * @param {{from: DOMRect, to: DOMRect}} bounds The animation bounds
 * @param {FlipParams?} [params={}] The animation parameters
 * @returns {AnimationConfig} AnimationConfig
 */
export function verticalTranslate(node, { from, to }, params = {}) {
    const style = getComputedStyle(node);
	const transform = style.transform === "none" ? "" : style.transform;
	const h = parseInt(style.height);

	const { delay = 0, duration = 1000, easing = bounceOut } = params;

	return {
		delay,
		duration,
		easing,
        css: (t, u) => {
			return `transform: ${transform} translateY(${u * h}px);`;
		},
	};
}
